#!/usr/bin/env node
/**
 * Are the product plates shot the same way? Subject size, baseline, centering, background.
 *
 * AGENTS.md: "Consistency IS the argument. Fifteen product plates shot identically say
 * 'this is a factory with a process'." Client 2026-09-23 asked for exactly this check
 * (同类产品统一底色、视觉占比、基线和周围留白). scripts/audit-image-fit.mjs answers a
 * different question — whether a frame crops an image — so this is its own audit.
 *
 * Method, per published HYDE product's hero image as the site shows it (/images/products-hyde/,
 * with the HYDE mark (a small part wholly inside any corner) set aside; the unbranded originals still carry the old
 * "Hyland" logo, which a first run read as 151 stray marks):
 *   background = median colour of the outermost 2% border;
 *   subject    = pixels further than DIST from that colour; its bounding box is the product;
 *   fill       = the box's longer side ÷ the image's matching side (how big it sits);
 *   baseline   = empty margin under the box ÷ height;  offset = box centre − image centre.
 * Each category is compared with its own median, because a 1100 mm push bar and a 30 mm
 * cylinder are not meant to fill a square the same way.
 *
 * Flags (reported, not fixed — retouching real photographs is the visual session's job,
 * and the rule "never generate an imagined product" still applies):
 *   small      fill more than 0.18 below the category median
 *   large      fill above 0.97 (touching the edge — likely cropped)
 *   off-centre |offset| above 0.12 of the width or height
 *   background not near-white (luminance under 232) in a category whose median is white,
 *              or white in a category whose median is not
 *   baseline   bottom margin more than 0.15 away from the category median
 *   marks      separate parts away from the product: loose kit parts laid beside it (026), or a
 *              logo or label printed into the photograph — either way a different composition
 *
 * Output: docs/research/product-plate-audit.md (+ .json). Re-run after any image change:
 *   node scripts/audit-product-plates.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const DIST = 28;
const SIZE = 256;
const OUT = "docs/research/product-plate-audit";

const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join("content/products", f), "utf8")))
  .filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

async function measure(file, branded) {
  const { data, info } = await sharp(file)
    .flatten({ background: "#ffffff" })
    .resize(SIZE, SIZE, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const px = (x, y) => {
    const i = (y * W + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const band = Math.max(1, Math.round(Math.min(W, H) * 0.02));
  const border = [];
  for (let x = 0; x < W; x++) for (let b = 0; b < band; b++) border.push(px(x, b), px(x, H - 1 - b));
  for (let y = 0; y < H; y++) for (let b = 0; b < band; b++) border.push(px(b, y), px(W - 1 - b, y));
  const bg = [0, 1, 2].map((c) => median(border.map((p) => p[c])));
  const mask = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const [r, g, b] = px(x, y);
      if (Math.hypot(r - bg[0], g - bg[1], b - bg[2]) > DIST) mask[y * W + x] = 1;
    }
  }
  /*
    Connected parts, 8-neighbour. The product is the largest part plus anything touching
    its box (a shadow, a separate screw set beside it). A small part well outside that box
    is a mark printed into the photograph — the first run found an old "Hyland" logo in the
    corner of AAH024 and read it as the product being off-centre.
  */
  const label = new Int32Array(W * H).fill(-1);
  const parts = [];
  for (let start = 0; start < W * H; start++) {
    if (!mask[start] || label[start] !== -1) continue;
    const id = parts.length;
    const part = { n: 0, x0: W, y0: H, x1: -1, y1: -1 };
    const stack = [start];
    label[start] = id;
    while (stack.length) {
      const i = stack.pop();
      const x = i % W, y = (i - x) / W;
      part.n++;
      if (x < part.x0) part.x0 = x;
      if (x > part.x1) part.x1 = x;
      if (y < part.y0) part.y0 = y;
      if (y > part.y1) part.y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (mask[j] && label[j] === -1) { label[j] = id; stack.push(j); }
      }
    }
    parts.push(part);
  }
  if (!parts.length) return { empty: true, bgLum: Math.round(0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]) };
  parts.sort((a, b) => b.n - a.n);
  let { x0, y0, x1, y1 } = parts[0];
  const pad = Math.round(Math.min(W, H) * 0.04);
  let marks = 0;
  for (const p of parts.slice(1)) {
    if (p.n < 4) continue; // noise
    /* The HYDE mark every branded plate carries sits wholly inside one corner (top-left on
       most, top-right or bottom-left on the bathroom set). Expected, so neither subject nor
       a stray mark. Judged per part, so no product pixel is ever masked. */
    const inCorner = (p.y1 < H * 0.14 || p.y0 > H * 0.86) && (p.x1 < W * 0.3 || p.x0 > W * 0.7);
    if (branded && inCorner) continue;
    const near = p.x1 >= x0 - pad && p.x0 <= x1 + pad && p.y1 >= y0 - pad && p.y0 <= y1 + pad;
    if (near || p.n > parts[0].n * 0.25) {
      x0 = Math.min(x0, p.x0); y0 = Math.min(y0, p.y0); x1 = Math.max(x1, p.x1); y1 = Math.max(y1, p.y1);
    } else marks++;
  }
  const bw = (x1 - x0 + 1) / W;
  const bh = (y1 - y0 + 1) / H;
  return {
    fill: +Math.max(bw, bh).toFixed(3),
    baseline: +((H - 1 - y1) / H).toFixed(3),
    offsetX: +(((x0 + x1) / 2 - (W - 1) / 2) / W).toFixed(3),
    offsetY: +(((y0 + y1) / 2 - (H - 1) / 2) / H).toFixed(3),
    bgLum: Math.round(0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]),
    marks,
  };
}

const rows = [];
for (const p of products) {
  const original = join("public", p.heroImage.src);
  const branded = join("public", p.heroImage.src.replace("/images/products/", "/images/products-hyde/"));
  // What visitors see: the branded plate when there is one (its only extra is the HYDE mark,
  // masked in measure()); the original only when no branded copy exists.
  const file = existsSync(branded) ? branded : existsSync(original) ? original : null;
  if (!file) {
    rows.push({ slug: p.slug, model: p.model, category: p.categoryPath[0], missing: true });
    continue;
  }
  try {
    rows.push({ slug: p.slug, model: p.model, category: p.categoryPath[0], src: p.heroImage.src, ...(await measure(file, file === branded)) });
  } catch (error) {
    rows.push({ slug: p.slug, model: p.model, category: p.categoryPath[0], error: String(error.message ?? error) });
  }
}

const byCat = new Map();
for (const r of rows) {
  if (!byCat.has(r.category)) byCat.set(r.category, []);
  byCat.get(r.category).push(r);
}
const flagged = [];
const catSummary = [];
for (const [cat, list] of byCat) {
  const ok = list.filter((r) => typeof r.fill === "number");
  const mFill = median(ok.map((r) => r.fill));
  const mBase = median(ok.map((r) => r.baseline));
  const whiteCat = median(ok.map((r) => r.bgLum)) >= 232;
  catSummary.push({ cat, n: list.length, mFill, mBase, bg: whiteCat ? "白底" : "非白底" });
  for (const r of list) {
    const flags = [];
    if (r.missing) flags.push("找不到图片文件");
    if (r.error) flags.push(`读取失败：${r.error}`);
    if (r.empty) flags.push("检测不到主体（图和背景太接近）");
    if (typeof r.fill === "number") {
      if (r.fill < mFill - 0.18) flags.push(`主体偏小（${r.fill}，品类中位 ${mFill}）`);
      if (r.marks) flags.push(`画面里有 ${r.marks} 处与主体分开的物件（散放配件，或旧 logo / 标注）`);
      if (r.fill > 0.97) flags.push(`主体贴边（${r.fill}），可能被裁`);
      if (Math.abs(r.offsetX) > 0.12 || Math.abs(r.offsetY) > 0.12) flags.push(`不居中（x ${r.offsetX}，y ${r.offsetY}）`);
      if (Math.abs(r.baseline - mBase) > 0.15) flags.push(`基线偏（底边留白 ${r.baseline}，品类中位 ${mBase}）`);
      if (whiteCat && r.bgLum < 232) flags.push(`底色不是白（亮度 ${r.bgLum}）`);
      if (!whiteCat && r.bgLum >= 232) flags.push(`白底混在非白底品类（亮度 ${r.bgLum}）`);
    }
    if (flags.length) flagged.push({ ...r, flags });
  }
}
catSummary.sort((a, b) => b.n - a.n);
flagged.sort((a, b) => a.category.localeCompare(b.category) || b.flags.length - a.flags.length);

mkdirSync("docs/research", { recursive: true });
writeFileSync(`${OUT}.json`, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), rows }, null, 1) + "\n");
const cell = (s) => String(s ?? "").replace(/\|/g, "／");
let md = `# 产品主图一致性审计

生成：\`node scripts/audit-product-plates.mjs\`（${new Date().toISOString().slice(0, 10)}），不要手改。
范围：HYDE 目录里有主图的 ${rows.length} 个产品，测量未加水印的原图。方法和阈值见脚本开头。
**只列问题，不改图**：修图归视觉会话，只允许清理真实照片（留白、居中、底色），不得生成或改动产品本身。

共 ${flagged.length} 张需要看（占 ${Math.round((flagged.length / rows.length) * 100)}%）。

## 各品类基准

| 品类 | 产品数 | 主体占比中位 | 底边留白中位 | 底色 |
| --- | --- | --- | --- | --- |
${catSummary.map((c) => `| ${c.cat} | ${c.n} | ${c.mFill} | ${c.mBase} | ${c.bg} |`).join("\n")}

## 需要看的图

| 品类 | 型号 | 图片 | 问题 |
| --- | --- | --- | --- |
${flagged.map((r) => `| ${cell(r.category)} | ${cell(r.model)} | ${cell(r.src ?? r.slug)} | ${cell(r.flags.join("；"))} |`).join("\n")}
`;
writeFileSync(`${OUT}.md`, md);
console.log(`${rows.length} plates measured, ${flagged.length} flagged → ${OUT}.md`);
const kinds = {};
for (const r of flagged) for (const f of r.flags) { const k = f.split("（")[0]; kinds[k] = (kinds[k] ?? 0) + 1; }
for (const [k, n] of Object.entries(kinds).sort((a, b) => b[1] - a[1])) console.log(`  ${n}  ${k}`);
