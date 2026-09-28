#!/usr/bin/env node
/**
 * Re-seat a real product photograph on its white plate: size, baseline, centring. Nothing else.
 *
 * Client 2026-09-23: 同类产品统一底色、视觉占比、基线和周围留白. scripts/audit-product-plates.mjs
 * measures each HYDE hero against its category's median and lists the outliers; this script
 * fixes the geometric ones and only those.
 *
 * WHAT IT DOES. For each flagged plate: find the product's bounding box (pixels further than
 * DIST from the border colour — the audit's own method, at full resolution), cut that box out
 * whole, scale it so its longer side fills the category's median share of the frame, and put it
 * back on a white field of the original size, centred horizontally, with the category's median
 * empty margin under it. The product's pixels are resampled, never edited: no retouching, no
 * inpainting, no generated fill (AGENTS.md, "Never generate an imagined metal product").
 *
 * WHAT IT LEAVES ALONE, and says so in its report:
 *   - background: a grey field (the AR4 plates) would need re-lighting to become white, which
 *     changes the product's tones too;
 *   - marks: loose kit parts or a printed label beside the product are a composition choice
 *     (026's parts laid out) or a logo to remove by hand, not a re-seat;
 *   - 559: its gallery is the STAHLOCK sub-brand's photography, which the client asked us not to
 *     touch (2026-09-24); the hero is left with it;
 *   - an upscale above MAX_UP: a small subject blown up past 1.5× goes soft; it is scaled to the
 *     cap and reported, and a better source photograph is the real fix.
 *
 * Originals in public/images/products are rewritten in place; run `npm run assets:watermark`
 * afterwards so /images/products-hyde follows, then re-run the audit.
 *
 *   node scripts/normalize-product-plates.mjs            # dry run: what would change
 *   node scripts/normalize-product-plates.mjs --write
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

// libvips keeps source files open on Windows; read into memory and disable its cache so
// the plate can be written back in place.
sharp.cache(false);

const WRITE = process.argv.includes("--write");
const DIST = 28;
const MAX_UP = 1.5;
const TOP_MIN = 0.04; // never closer than this to the top edge
const SKIP_SLUGS = new Set([
  "559-night-latch-and-rim-lock", // STAHLOCK photography (see header)
  "9007-stainless-steel-handle", // an annotated infographic, not a product plate: shrinking it shrinks its text
]);

const { rows } = JSON.parse(readFileSync("docs/research/product-plate-audit.json", "utf8"));
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const byCat = {};
for (const r of rows) (byCat[r.category] ||= []).push(r);
const norms = Object.fromEntries(Object.entries(byCat).map(([c, rs]) => [c, { fill: median(rs.map((r) => r.fill)), baseline: median(rs.map((r) => r.baseline)) }]));

// The audit's geometric flags (same thresholds as scripts/audit-product-plates.mjs).
const geometric = (r) => {
  const n = norms[r.category];
  const why = [];
  if (r.fill < n.fill - 0.18) why.push("small");
  if (r.fill > 0.97) why.push("large");
  if (Math.abs(r.offsetX) > 0.12 || Math.abs(r.offsetY) > 0.12) why.push("off-centre");
  if (Math.abs(r.baseline - n.baseline) > 0.15) why.push("baseline");
  return why;
};

async function bbox(file) {
  const { data, info } = await sharp(readFileSync(file)).flatten({ background: "#ffffff" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const border = [];
  const bw = Math.max(1, Math.round(Math.min(W, H) * 0.02));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (x >= bw && x < W - bw && y >= bw && y < H - bw) continue;
    const i = (y * W + x) * C;
    border.push(data[i] + data[i + 1] + data[i + 2]);
  }
  border.sort((a, b) => a - b);
  const bgSum = border[Math.floor(border.length / 2)];
  const fg = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    if (Math.abs(data[i] + data[i + 1] + data[i + 2] - bgSum) / 3 > DIST) fg[p] = 1;
  }
  /* The unbranded originals still carry the old "Hyland" mark in a corner (the audit notes
     it too). A box around every foreground pixel would include it and re-seat the logo with
     the product, so connected parts that sit wholly inside a corner and are small are set
     aside — the same rule the audit uses for the HYDE mark. */
  const label = new Int32Array(W * H);
  const parts = [];
  const stack = [];
  for (let p = 0; p < W * H; p++) {
    if (!fg[p] || label[p]) continue;
    const id = parts.length + 1;
    const part = { x0: W, y0: H, x1: -1, y1: -1, n: 0 };
    label[p] = id; stack.push(p);
    while (stack.length) {
      const q = stack.pop(); const x = q % W, y = (q / W) | 0;
      part.n++; if (x < part.x0) part.x0 = x; if (x > part.x1) part.x1 = x; if (y < part.y0) part.y0 = y; if (y > part.y1) part.y1 = y;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const r = ny * W + nx; if (fg[r] && !label[r]) { label[r] = id; stack.push(r); }
      }
    }
    parts.push(part);
  }
  const total = parts.reduce((s, p) => s + p.n, 0);
  const cw = W * 0.25, ch = H * 0.2;
  const inCorner = (p) => (p.x1 < cw || p.x0 > W - cw) && (p.y1 < ch || p.y0 > H - ch);
  const kept = parts.filter((p) => !(inCorner(p) && p.n < total * 0.25) && p.n > total * 0.0005);
  const setAside = parts.length - kept.length;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (const p of kept) { x0 = Math.min(x0, p.x0); y0 = Math.min(y0, p.y0); x1 = Math.max(x1, p.x1); y1 = Math.max(y1, p.y1); }
  // Pixels of the set-aside corner marks (grown by 2 px for their anti-aliased edge), painted
  // white before the cut so a logo that overlaps the product box does not ride along.
  const keptIds = new Set(kept.map((p) => parts.indexOf(p) + 1));
  const drop = new Uint8Array(W * H);
  for (let q = 0; q < W * H; q++) {
    if (!label[q] || keptIds.has(label[q])) continue;
    const x = q % W, y = (q / W) | 0;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H) drop[ny * W + nx] = 1;
    }
  }
  return { W, H, x0, y0, x1, y1, bgLum: bgSum / 3, setAside, drop, raw: { data, C } };
}

const report = [];
for (const r of rows) {
  if (SKIP_SLUGS.has(r.slug)) { if (geometric(r).length) report.push({ slug: r.slug, action: "skipped (STAHLOCK)" }); continue; }
  const why = geometric(r);
  if (!why.length) continue;
  const file = join("public", r.src);
  const b = await bbox(file);
  if (b.bgLum < 245) { report.push({ slug: r.slug, why, action: `skipped (background ${Math.round(b.bgLum)}, not white)` }); continue; }
  const n = norms[r.category];
  const bw = b.x1 - b.x0 + 1, bh = b.y1 - b.y0 + 1;
  const longer = Math.max(bw / b.W, bh / b.H);
  let scale = n.fill / longer;
  const notes = [];
  if (scale > MAX_UP) { notes.push(`upscale capped ${scale.toFixed(2)}→${MAX_UP}`); scale = MAX_UP; }
  let nw = Math.round(bw * scale), nh = Math.round(bh * scale);
  // Keep TOP_MIN above it: shrink the bottom margin first, then the subject.
  let bottom = Math.round(n.baseline * b.H);
  /* A category median baseline is set by its tall pieces; a flat push bar seated on it sits
     visibly low (the audit then flags it off-centre). Keep the box centre within 0.10 of the
     frame centre vertically, and take the baseline nearest the median inside that band. */
  const lo = b.H / 2 - nh / 2 - 0.1 * b.H, hi = b.H / 2 - nh / 2 + 0.1 * b.H;
  bottom = Math.round(Math.min(Math.max(bottom, lo), hi));
  if (bottom + nh > b.H * (1 - TOP_MIN)) bottom = Math.max(Math.round(b.H * 0.02), Math.round(b.H * (1 - TOP_MIN)) - nh);
  if (bottom + nh > b.H * (1 - TOP_MIN)) { const k = (b.H * (1 - TOP_MIN) - bottom) / nh; nw = Math.round(nw * k); nh = Math.round(nh * k); notes.push("fitted to height"); }
  const left = Math.round((b.W - nw) / 2), top = b.H - bottom - nh;
  report.push({ slug: r.slug, why, action: `re-seated: fill ${r.fill}→${(Math.max(nw / b.W, nh / b.H)).toFixed(3)}, baseline ${r.baseline}→${(bottom / b.H).toFixed(3)}, scale ${scale.toFixed(2)}${notes.length ? ` (${notes.join("; ")})` : ""}` });
  if (!WRITE) continue;
  const clean = Buffer.from(b.raw.data);
  for (let q = 0; q < b.W * b.H; q++) if (b.drop[q]) { const i = q * b.raw.C; clean[i] = clean[i + 1] = clean[i + 2] = 255; }
  const cut = await sharp(clean, { raw: { width: b.W, height: b.H, channels: b.raw.C } }).extract({ left: b.x0, top: b.y0, width: bw, height: bh }).resize(nw, nh, { kernel: "lanczos3" }).png().toBuffer();
  const out = await sharp({ create: { width: b.W, height: b.H, channels: 3, background: "#ffffff" } })
    .composite([{ input: cut, left, top }]).webp({ quality: 90 }).toBuffer();
  writeFileSync(file, out);
}
for (const x of report) console.log(`${x.slug.padEnd(48)} ${(x.why || []).join(",").padEnd(18)} ${x.action}`);
console.log(`\n${report.filter((x) => x.action.startsWith("re-seated")).length} re-seated, ${report.filter((x) => x.action.startsWith("skipped")).length} skipped${WRITE ? "" : " (dry run; --write to apply)"}`);
