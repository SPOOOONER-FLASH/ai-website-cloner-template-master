#!/usr/bin/env node
/**
 * The sheet for whoever prepares the photograph folders: what did not match, and why.
 *
 * The import matches a folder to a product by model number and nothing else — see the
 * note in import-client-product-photos.mjs on why it does not guess. That leaves two
 * kinds of leftover, and both need a person:
 *
 *   1. A folder whose model number no product carries. Either the product is missing from
 *      the catalogue, or the folder is named differently from the model on the site.
 *   2. A product in that category with no folder at all — still no photograph.
 *
 * Plus the videos, which nothing on the site can show yet. They are listed rather than
 * quietly ignored, because 34 product videos is an asset the site does not currently have
 * anywhere and the decision to build a player is the client's, not mine.
 *
 * Output: docs/research/PHOTO_GAP_SHEET.html, prints to A4 from a browser.
 *
 * Usage:
 *   node scripts/build-photo-gap-sheet.mjs --from "<folder>" [--from "<folder>"] \
 *     [--category panic-exit-devices] [--out "<dir>"]
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const roots = args.flatMap((a, i) => (a === "--from" && args[i + 1] ? [args[i + 1]] : []));
const categoryFlag = args.indexOf("--category");
const category = categoryFlag > -1 ? args[categoryFlag + 1] : null;
const outFlag = args.indexOf("--out");

if (!roots.length) {
  console.error('Give at least one folder: --from "<path>"');
  process.exit(1);
}

const PRODUCTS_DIR = "content/products";
const normalise = (s) => String(s ?? "").toUpperCase().replace(/[\s_-]/g, "");

const products = readdirSync(PRODUCTS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(PRODUCTS_DIR, f), "utf8")));

const byModel = new Map();
for (const p of products) if (p.model) byModel.set(normalise(p.model), p);

const folders = [];
for (const root of roots) {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(root, entry.name);
    const gallery = existsSync(join(dir, "图库"))
      ? readdirSync(join(dir, "图库")).filter((f) => /\.jpe?g$/i.test(f))
      : [];
    const videos = existsSync(join(dir, "视频"))
      ? readdirSync(join(dir, "视频")).filter((f) => /\.mp4$/i.test(f))
      : [];
    folders.push({
      model: entry.name,
      hero: ["主图.jpg", "主图.jpeg"].some((n) => existsSync(join(dir, n))),
      gallery: gallery.length,
      videos,
      product: byModel.get(normalise(entry.name)) ?? null,
    });
  }
}

const unmatched = folders.filter((f) => !f.product);
const noHero = folders.filter((f) => f.product && !f.hero);
const withVideo = folders.filter((f) => f.videos.length);
const folderModels = new Set(folders.map((f) => normalise(f.model)));

/** Products in the category that got no folder at all. */
const stillMissing = category
  ? products.filter(
      (p) =>
        p.categoryPath[0] === category &&
        !folderModels.has(normalise(p.model)) &&
        !(p.heroImage && p.heroImage.src),
    )
  : [];

/** Near neighbours, to help a human spot a renaming rather than a missing product. */
function near(model) {
  const n = normalise(model);
  return products
    .filter((p) => p.model && (normalise(p.model).startsWith(n) || n.startsWith(normalise(p.model))))
    .map((p) => p.model)
    .slice(0, 4);
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>产品照片对不上的清单 — Canton Hyland</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif; color: #11110f; font-size: 11pt; line-height: 1.5; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 4px; }
  h2 { font-size: 13pt; margin: 22px 0 6px; padding-top: 10px; border-top: 1.5px solid #11110f; page-break-after: avoid; }
  p.lead { margin: 0 0 14px; color: #444; }
  .ok { background: #f2f8f2; border: 1px solid #cfe3cf; padding: 8px 10px; margin: 10px 0 14px; font-size: 10pt; }
  .rule { color: #7a6f4f; background: #faf8f2; border: 1px solid #ddd5bd; padding: 8px 10px; margin: 10px 0 14px; font-size: 10pt; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; margin-top: 6px; }
  th, td { border: 1px solid #c9c9c4; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #f2f2ef; font-weight: 600; }
  td.m { font-family: ui-monospace, Consolas, monospace; white-space: nowrap; }
  td.w { min-width: 110px; background: #fffdf7; }
  .small { font-size: 9.5pt; color: #555; }
  footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #c9c9c4; font-size: 9.5pt; color: #555; }
</style>
</head>
<body>

<h1>产品照片对不上的清单</h1>
<p class="lead">Canton Hyland · 本次共 ${folders.length} 个型号文件夹 · 由 scripts/build-photo-gap-sheet.mjs 生成</p>

<div class="ok">
  <strong>已经导入成功的不在这份表里。</strong> ${folders.length - unmatched.length} 个文件夹已经
  对上产品并上线，图片已按站点规格转换（1000×1000 WebP）并压好水印。
  <br>这份表只列**需要人来决定**的部分。
</div>

<div class="rule">
  <strong>为什么不自动猜。</strong> 文件夹叫 <code>308</code>，而我们目录里有
  <code>308-D</code> 和 <code>308-S</code> 两个型号。猜错的后果不是排版难看，
  是买家照着图下单拿到另一个产品。所以宁可列出来问，不自动匹配。
</div>

<h2>一、${unmatched.length} 个文件夹在目录里找不到对应型号</h2>
<p class="small">
  两种可能：<strong>(a)</strong> 这个产品我们网站上还没有，需要建；
  <strong>(b)</strong> 文件夹名和网站上的型号写法不一样。<br>
  请在最后一栏写清楚是哪一种，如果是 (b) 就写出网站上的正确型号。
</p>
<table>
  <tr><th>文件夹名</th><th>图库</th><th>视频</th><th>目录里相近的型号</th><th>该怎么处理</th></tr>
  ${unmatched
    .map((f) => {
      const n = near(f.model);
      return `<tr><td class="m">${esc(f.model)}</td><td>${f.gallery} 张</td><td>${f.videos.length}</td><td class="m">${n.length ? esc(n.join(" / ")) : "—"}</td><td class="w"></td></tr>`;
    })
    .join("\n")}
</table>

${
  noHero.length
    ? `<h2>二、${noHero.length} 个文件夹缺主图</h2>
<p class="small">图库有图但没有 <code>主图.jpg</code>。产品页的第一张图就是主图，缺了页面顶部是空的。</p>
<table>
  <tr><th>型号</th><th>图库</th><th>补主图 ✓</th></tr>
  ${noHero.map((f) => `<tr><td class="m">${esc(f.model)}</td><td>${f.gallery} 张</td><td class="w"></td></tr>`).join("\n")}
</table>`
    : ""
}

${
  stillMissing.length
    ? `<h2>三、${stillMissing.length} 个产品这一批里没有文件夹，仍然没有照片</h2>
<p class="small">这些型号在网站上是有的，但这次没有收到对应的文件夹，所以页面上依然没有图。</p>
<table>
  <tr><th>型号</th><th>名称</th><th>已拍 ✓</th></tr>
  ${stillMissing.map((p) => `<tr><td class="m">${esc(p.model)}</td><td>${esc(p.name)}</td><td class="w"></td></tr>`).join("\n")}
</table>`
    : ""
}

<h2>四、${withVideo.reduce((n, f) => n + f.videos.length, 0)} 个产品视频 —— 网站目前放不了</h2>
<div class="rule">
  这次的文件夹里有视频，<strong>这是网站现在完全没有的素材</strong>。但产品页还没有
  播放器，所以它们暂时没有上线。<br><br>
  <strong>要不要做，是甲方的决定</strong> —— 做的话需要：转码成网页格式、生成封面图、
  在产品页加播放器、并考虑加载体积（视频比整页其他内容加起来还大）。
  一句话说清楚要不要做，我就做。
</div>
<table>
  <tr><th>型号</th><th>视频文件</th><th>对应产品</th></tr>
  ${withVideo
    .map(
      (f) =>
        `<tr><td class="m">${esc(f.model)}</td><td class="m">${esc(f.videos.join(", "))}</td><td>${f.product ? esc(f.product.name) : "<em>目录里没有</em>"}</td></tr>`,
    )
    .join("\n")}
</table>

<footer>
  由 <code>scripts/build-photo-gap-sheet.mjs</code> 生成。文件夹补齐之后重跑导入，
  这份清单会自动变短。
</footer>

</body>
</html>
`;

const OUT = "docs/research/PHOTO_GAP_SHEET.html";
writeFileSync(OUT, html);
console.log(
  `wrote ${OUT} — 未匹配 ${unmatched.length} · 缺主图 ${noHero.length} · 无文件夹 ${stillMissing.length} · 视频 ${withVideo.reduce((n, f) => n + f.videos.length, 0)}`,
);

if (outFlag > -1 && args[outFlag + 1]) {
  const dir = args[outFlag + 1];
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "产品照片对不上的清单.html"), html);
  console.log(`copied to ${join(dir, "产品照片对不上的清单.html")}`);
}
