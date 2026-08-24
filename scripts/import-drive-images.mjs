/**
 * Imports the client's own product photography from F:\新网站资料 into
 * public/images/products/, and attaches it to the products that currently have no
 * imagery at all.
 *
 * ---------------------------------------------------------------------------
 * Why this is not just a file copy
 *
 * The drive's JPEGs are export artefacts, and three different brand marks are burnt
 * into them:
 *
 *   STAHLOCK        a sibling brand's logotype, composited across the middle of the
 *                   frame at 15% opacity. On roughly half of all candidate images.
 *   Hyland badge    the parent company's red corner badge.
 *   cantonlock.com  a diagonal repeating domain tile — the client's own future domain,
 *                   from the 2022 shoot.
 *   RAYEN 雷茵       a third party's badge. Excluded by path; never imported.
 *
 * The first two are not baked in: the retouching PSDs sitting next to each JPEG keep
 * them as their own layers. So instead of trying to invert an overlay out of a
 * flattened image, this renders the PSD stack *without* those layers, which is exact.
 * Where no PSD exists the JPEG is used and the corner badge is painted out against the
 * studio white instead — see lib/debadge.mjs, which refuses rather than guesses when
 * the product sits too close.
 *
 * Every render is then re-inspected (lib/marks.mjs). Anything still carrying STAHLOCK
 * is dropped rather than published; anything still carrying the 2022 domain tile is
 * published but tagged `sourceNote: "2022-watermarked"` so a later pass can find and
 * replace it without re-inspecting pixels. That tagging was the client's call, as was
 * keeping images whose Hyland badge could not be lifted.
 *
 *   node scripts/import-drive-images.mjs             # dry run: report only
 *   node scripts/import-drive-images.mjs --write     # convert, write, attach
 *   node scripts/import-drive-images.mjs --write --limit 5
 *   node scripts/import-drive-images.mjs --contact-sheets   # render review sheets
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { flatten } from "./lib/psdflatten.mjs";
import { debadge } from "./lib/debadge.mjs";
import { marks } from "./lib/marks.mjs";

const write = process.argv.includes("--write");
const sheets = process.argv.includes("--contact-sheets");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > 0 ? Number(process.argv[limitArg + 1]) : Infinity;

const ROOT = "F:/新网站资料";
const OUT_DIR = "public/images/products";
const MATCH = "docs/research/legacy/drive-match.json";
const REPORT = "docs/research/legacy/drive-import-report.json";

/** 雷茵 is a third party. 原图 holds unretouched camera files, not web assets. */
const SKIP_DIRS = new Set(["雷茵", "原图", "原图2", "诚信通", "HYLAND"]);
const IMG = /\.(jpe?g|png)$/i;

/** Matches the 22 images already in the folder: 1000px square WebP, ~21 KB. */
const MAX_EDGE = 1000;
const QUALITY = 82;
const BUDGET_KB = 60;
const QUALITY_FLOOR = 62;

/** Gallery depth per product. Beyond this the page is padding, not informing. */
const MAX_VIEWS = 8;

const log = (...a) => console.log(...a);

/* ---------------------------------------------------------------- candidates */

function candidateFiles(cat, folder) {
  const dir = path.join(ROOT, cat, folder);
  let ents;
  try {
    ents = readdirSafe(dir);
  } catch {
    return [];
  }
  const out = [];
  for (const e of ents.files) if (IMG.test(e) && !e.startsWith("._")) out.push({ rel: e, file: path.join(dir, e) });
  for (const s of ents.dirs) {
    if (SKIP_DIRS.has(s)) continue;
    const sub = readdirSafe(path.join(dir, s));
    for (const e of sub.files) {
      if (IMG.test(e) && !e.startsWith("._")) out.push({ rel: `${s}/${e}`, file: path.join(dir, s, e) });
    }
  }
  return out;
}

function readdirSafe(dir) {
  const ents = readdirSync(dir, { withFileTypes: true });
  return {
    files: ents.filter((e) => e.isFile()).map((e) => e.name),
    dirs: ents.filter((e) => e.isDirectory()).map((e) => e.name),
  };
}

/* ------------------------------------------------------------------ ordering */

/** `首图` is the client's own designation for the lead shot. */
function orderKey(rel) {
  const base = path.basename(rel);
  if (/^首图/.test(base)) return -1;
  const m = base.match(/^(\d+)[-_]/);
  if (m) return Number(m[1]);
  const a = base.match(/^([a-z])[-_]/i);
  if (a) return 100 + a[1].toLowerCase().charCodeAt(0) - 97;
  return 500;
}

/* -------------------------------------------------------------- clean render */

/**
 * Produces the cleanest render available for one source image.
 *
 * Prefers the PSD stack minus the mark layers; falls back to the JPEG with the corner
 * badge painted out. Either way the result is re-inspected before it is trusted.
 */
async function cleanRender(file) {
  const psdPath = file.replace(IMG, ".psd");
  let data = null, width = 0, height = 0, via = "jpg", dropped = 0, badges = 0;

  if (existsSync(psdPath)) {
    try {
      const f = flatten(psdPath);
      const odd = f.notes.filter((n) => n.startsWith("blend:") || n.startsWith("compression"));
      if (!odd.length && f.drawn > 0) {
        data = f.data; width = f.width; height = f.height;
        via = "psd"; dropped = f.dropped; badges = f.badges;
      }
    } catch {
      /* fall through to the JPEG */
    }
  }

  if (!data) {
    const d = await debadge(file);
    const buf = Buffer.from(d.data);
    const { width: W, height: H, channels } = d.info;
    // debadge hands back the source channel count; normalise to RGB
    const rgb = Buffer.alloc(W * H * 3);
    for (let i = 0, j = 0; i < W * H; i++, j += 3) {
      const s = i * channels;
      rgb[j] = buf[s]; rgb[j + 1] = buf[s + 1]; rgb[j + 2] = buf[s + 2];
    }
    data = rgb; width = W; height = H;
    badges = d.removed ? 1 : 0;
  } else {
    // A badge can also be flattened into the PSD's own background; catch that here.
    const tmp = Buffer.from(data);
    const d = await debadgeRaw(tmp, width, height);
    if (d.removed) { data = d.data; badges += 1; }
  }

  return { data, width, height, via, dropped, badges };
}

/** debadge over an already-decoded RGB buffer. */
async function debadgeRaw(rgb, W, H) {
  const png = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
  const tmpFile = path.join(TMP, "debadge-in.png");
  writeFileSync(tmpFile, png);
  const d = await debadge(tmpFile);
  return { removed: d.removed, data: Buffer.from(d.data) };
}

/* -------------------------------------------------------------- verification */

const TMP = path.join(process.env.TEMP || ".", "drive-import");
mkdirSync(TMP, { recursive: true });

/** Re-inspects a render for marks that survived. */
async function inspect(rgb, W, H) {
  const f = path.join(TMP, "inspect.png");
  writeFileSync(f, await sharp(rgb, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer());
  return marks(f);
}

/* ------------------------------------------------------------- content shape */

/**
 * Studio product shot, line drawing / scanned document, or scene? Used only for
 * ordering — a drawing or an instruction sheet is worth keeping in the gallery but
 * makes a poor lead image.
 *
 * What separates them is not whiteness — a scanned manual is as white as a studio
 * sweep — and not blob size either, because a product shot with its parts laid out
 * separately is legitimately many blobs. What does separate them is *type*: a manual
 * or a dimensioned drawing carries hundreds of letter-sized specks, and a photograph
 * carries almost none. So the deciding measure is how many tiny components there are.
 */
async function shape(rgb, W, H) {
  const S = 192;
  const { data } = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
    .resize(S, S, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });

  const n = S * S;
  let white = 0, sat = 0, ink = 0;
  const mark = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mn >= 245) white++; else mark[i] = 1;
    if (mx - mn > 28) sat++;
    if (mx < 120) ink++;
  }
  const whiteFrac = white / n, satFrac = sat / n, inkFrac = ink / n;

  // Count connected non-white components in the letter size range.
  const seen = new Uint8Array(n);
  let specks = 0;
  const stack = [];
  for (let s = 0; s < n; s++) {
    if (!mark[s] || seen[s]) continue;
    let size = 0;
    stack.push(s);
    while (stack.length) {
      const p = stack.pop();
      if (seen[p] || !mark[p]) continue;
      seen[p] = 1; size++;
      const x = p % S, y = (p - x) / S;
      if (x > 0) stack.push(p - 1);
      if (x < S - 1) stack.push(p + 1);
      if (y > 0) stack.push(p - S);
      if (y < S - 1) stack.push(p + S);
    }
    if (size >= 2 && size <= 60) specks++;
  }

  if (specks > 70) return "drawing";                                // type and dimensions
  if (whiteFrac > 0.62 && inkFrac < 0.10 && satFrac < 0.06) return "drawing";
  if (whiteFrac > 0.30) return "studio";
  return "scene";
}

const SHAPE_RANK = { studio: 0, scene: 1, drawing: 2 };

/* ------------------------------------------------------------------ dedupe */

/** 64-bit average hash; the 图/ subfolder repeats top-level shots. */
async function aHash(rgb, W, H) {
  const { data } = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
    .resize(8, 8, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let mean = 0;
  for (let i = 0; i < 64; i++) mean += data[i];
  mean /= 64;
  let h = 0n;
  for (let i = 0; i < 64; i++) if (data[i] > mean) h |= 1n << BigInt(i);
  return h;
}
const hamming = (a, b) => {
  let x = a ^ b, c = 0;
  while (x) { c += Number(x & 1n); x >>= 1n; }
  return c;
};

/* -------------------------------------------------------------------- encode */

async function toWebp(rgb, W, H, dest) {
  const edge = Math.min(MAX_EDGE, Math.max(W, H));
  let quality = QUALITY, kb = Infinity;
  for (;;) {
    await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
      .resize(edge, edge, { fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toFile(dest);
    kb = Math.round(statSync(dest).size / 1024);
    if (kb <= BUDGET_KB || quality <= QUALITY_FLOOR) break;
    quality -= 6;
  }
  return { kb, quality, edge };
}

/* ---------------------------------------------------------------------- main */

const match = JSON.parse(readFileSync(MATCH, "utf8"));
const productPath = (slug) => `content/products/${slug}.json`;

/**
 * A couple of models are filed under two categories on the drive (9082E and F101 each
 * appear twice), so matched entries are grouped by slug and their folders merged.
 * Treating them as two targets would run the product twice and leave the longer run's
 * surplus files orphaned on disk under the shorter run's numbering.
 */
const bySlug = new Map();
for (const m of match.matched) {
  const p = productPath(m.slug);
  if (!existsSync(p)) continue;
  const prod = JSON.parse(readFileSync(p, "utf8"));
  const heroSrc = prod.heroImage && (typeof prod.heroImage === "string" ? prod.heroImage : prod.heroImage.src);
  if (heroSrc || (prod.gallery || []).length) continue; // already has imagery
  const existing = bySlug.get(m.slug);
  if (existing) existing.sources.push({ cat: m.cat, folder: m.folder });
  else bySlug.set(m.slug, { ...m, sources: [{ cat: m.cat, folder: m.folder }], product: prod, path: p });
}
const targets = [...bySlug.values()];

log(`${targets.length} matched products currently have no imagery.`);
if (write) mkdirSync(OUT_DIR, { recursive: true });

const report = { generated: null, products: [], totals: {} };
const totals = { products: 0, filled: 0, images: 0, kb: 0, rejected: 0, viaPsd: 0, viaJpg: 0, tagged2022: 0 };

let done = 0;
for (const t of targets) {
  if (done >= LIMIT) break;
  done++;

  const files = t.sources
    .flatMap((s) => candidateFiles(s.cat, s.folder))
    .sort((a, b) => orderKey(a.rel) - orderKey(b.rel));
  const rec = { slug: t.slug, model: t.model, sources: t.sources.map((s) => `${s.cat}/${s.folder}`), candidates: files.length, kept: [], rejected: [] };

  const kept = [];
  const hashes = [];
  for (const f of files) {
    if (kept.length >= MAX_VIEWS) break;
    let r;
    try {
      r = await cleanRender(f.file);
    } catch (e) {
      rec.rejected.push({ rel: f.rel, why: "render:" + e.message.slice(0, 60) });
      continue;
    }

    const m = await inspect(r.data, r.width, r.height);
    if (m.stahlock) { rec.rejected.push({ rel: f.rel, why: "stahlock-survived", wm: +m.wm.toFixed(3) }); continue; }

    const h = await aHash(r.data, r.width, r.height);
    const dup = hashes.find((x) => hamming(x, h) <= 6);
    if (dup !== undefined) { rec.rejected.push({ rel: f.rel, why: "duplicate" }); continue; }
    hashes.push(h);

    kept.push({
      rel: f.rel, file: f.file, render: r, order: orderKey(f.rel),
      shape: await shape(r.data, r.width, r.height),
      veiled: m.veiled, hyland: m.hyland,
    });
  }

  if (!kept.length) {
    rec.result = "no-usable-images";
    report.products.push(rec);
    totals.products++;
    continue;
  }

  // Keep the client's own ordering, untouched. `首图` is literally their word for the
  // lead shot and the numeric prefixes are their sequence; both are better evidence of
  // what belongs at the top of the page than anything inferred from pixels. An earlier
  // version reordered on a guess at photo-vs-drawing and put an instruction scan in the
  // hero slot, which is what this comment is here to stop happening again. `shape` is
  // still recorded in the report, as a review aid only.
  const ordered = kept.slice().sort((a, b) => a.order - b.order || a.rel.localeCompare(b.rel));

  const name = (i) => (i === 0 ? `${t.slug}.webp` : `${t.slug}-${i + 1}.webp`);
  const productName = (t.product.name || "").replace(/\s+/g, " ").trim();

  for (let i = 0; i < ordered.length; i++) {
    const k = ordered[i];
    const dest = path.join(OUT_DIR, name(i));
    let enc = { kb: 0, quality: 0 };
    if (write) enc = await toWebp(k.render.data, k.render.width, k.render.height, dest);

    const label = i === 0
      ? `Hyland ${t.model} ${productName}`.trim()
      : `Hyland ${t.model} ${productName}, view ${i + 1}`.trim();

    const ref = { src: `/images/products/${name(i)}`, ratio: "1 / 1", label };
    if (k.veiled) {
      ref.sourceNote = "2022-watermarked";
      totals.tagged2022++;
    }
    k.ref = ref;

    totals.images++;
    totals.kb += enc.kb;
    if (k.render.via === "psd") totals.viaPsd++; else totals.viaJpg++;
    rec.kept.push({
      rel: k.rel, out: name(i), via: k.render.via, shape: k.shape,
      droppedWatermark: k.render.dropped, droppedBadge: k.render.badges,
      tagged2022: !!k.veiled, kb: enc.kb,
    });
  }

  if (write) {
    const prod = t.product;
    prod.heroImage = ordered[0].ref;
    prod.gallery = ordered.slice(1).map((k) => k.ref);
    writeFileSync(t.path, `${JSON.stringify(prod, null, 2)}\n`);
  }

  rec.result = "filled";
  report.products.push(rec);
  totals.products++;
  totals.filled++;
  totals.rejected += rec.rejected.length;

  log(
    `${String(done).padStart(3)}/${targets.length}  ${t.model.padEnd(16)} ${String(kept.length).padStart(2)} views  ` +
    `(psd ${rec.kept.filter((k) => k.via === "psd").length}, jpg ${rec.kept.filter((k) => k.via === "jpg").length})  ` +
    `dropped ${rec.rejected.length}`,
  );
}

report.totals = totals;
if (write) writeFileSync(REPORT, `${JSON.stringify(report, null, 1)}\n`);

log("\n────────────────────────────────────────────");
log(`products considered : ${totals.products}`);
log(`products filled     : ${totals.filled}`);
log(`images published    : ${totals.images}  (${Math.round(totals.kb)} KB total)`);
log(`  rendered from PSD : ${totals.viaPsd}`);
log(`  rendered from JPG : ${totals.viaJpg}`);
log(`  tagged 2022       : ${totals.tagged2022}`);
log(`source images dropped: ${totals.rejected}`);
if (!write) log("\nDry run. Re-run with --write to apply.");
else log(`\nReport: ${REPORT}`);
