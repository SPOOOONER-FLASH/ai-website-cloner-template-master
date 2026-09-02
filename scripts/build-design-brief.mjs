#!/usr/bin/env node
/**
 * The SECOND fill-in sheet: photography, gallery and copy — not numbers.
 *
 * scripts/build-supplier-workbook.mjs already asks for the specification figures and the
 * buyer questions behind them (packing, backset, cycle life, stainless grade). This one
 * asks for the things a 美工 colleague can actually produce without a production drawing
 * in front of them: a photograph of a product that currently has none, extra views for a
 * product that has exactly one, and a sentence of description for a page that has none.
 * The workbook has no photography section and this has no specification section; they do
 * not overlap.
 *
 * WHY IT IS SEPARATE. The two jobs go to different people on different days. Mixing
 * "photograph these 75 models" into a table of missing millimetres produced a document
 * nobody could act on in one sitting, and the photography half is the half that does not
 * need engineering sign-off — it can start immediately.
 *
 * Every count is measured from content/products at run time. Nothing here is a generic
 * checklist; if a row is listed, that record is empty right now.
 *
 * Output: docs/research/DESIGN_BRIEF.html, self-contained, prints to A4 from a browser.
 * Pass --out <dir> to write a copy somewhere else as well (e.g. the Desktop hand-off
 * folder).
 *
 * Usage: node scripts/build-design-brief.mjs [--out "C:/Users/johns/Desktop/hyde"]
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ file: f, ...JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")) }));

const total = products.length;

const CATEGORY_ZH = {
  "panic-exit-devices": "逃生推杆",
  "lock-cases": "锁体",
  "knob-locks": "球形锁",
  "lever-handles": "执手锁 / 门把手",
  "stainless-steel-handles": "不锈钢拉手",
  "night-latches-rim-locks": "碰锁 / 外装锁",
  "lock-cylinders": "锁芯",
  "door-closers": "闭门器",
  deadbolts: "单锁舌",
  "brass-steel-hinges": "铰链",
  "glass-door-accessories": "玻璃门配件",
  "bathroom-accessories": "卫浴配件",
  "grip-handle-sets": "大拉手套装",
  "hardware-accessories": "五金配件",
  "sliding-hook-locks": "移门钩锁",
};

const hasHero = (p) => Boolean(p.heroImage && p.heroImage.src);
const galleryCount = (p) => (p.gallery ?? []).length;
const thinSummary = (p) => !p.summary || p.summary.trim().length < 40;

/*
  "No hero image" is not one problem, it is two, and they go to different people.

  A record with no hero and no gallery has no photograph anywhere — somebody has to
  photograph the part. A record with no hero but a gallery already HAS photographs; what
  is missing is the decision about which one leads. Today that is exactly one product
  (EH01, eight images on disk), and putting it on a shooting list would send someone to
  photograph a product we have already photographed eight times.
*/
const noPhotoAtAll = products.filter((p) => !hasHero(p) && galleryCount(p) === 0);
const heroUnpicked = products.filter((p) => !hasHero(p) && galleryCount(p) > 0);
const noHero = [...noPhotoAtAll, ...heroUnpicked];
const noGallery = products.filter((p) => hasHero(p) && galleryCount(p) === 0);
const noSummary = products.filter(thinSummary);
const blank = products.filter((p) => !hasHero(p) && !(p.specs ?? []).length);

/** Per-category rollup, ordered by the number of missing photographs. */
const byCategory = new Map();
for (const p of products) {
  const slug = p.categoryPath[0];
  if (!byCategory.has(slug)) {
    byCategory.set(slug, { slug, n: 0, noHero: 0, noGallery: 0, noSummary: 0 });
  }
  const row = byCategory.get(slug);
  row.n += 1;
  if (!hasHero(p)) row.noHero += 1;
  if (hasHero(p) && !galleryCount(p)) row.noGallery += 1;
  if (thinSummary(p)) row.noSummary += 1;
}
const categories = [...byCategory.values()].sort((a, b) => b.noHero - a.noHero);

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const zh = (slug) => CATEGORY_ZH[slug] ?? slug;
const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

/** Model rows grouped by category, so one shooting session covers one shelf. */
function groupedRows(list, extra) {
  const groups = new Map();
  for (const p of list) {
    const slug = p.categoryPath[0];
    if (!groups.has(slug)) groups.set(slug, []);
    groups.get(slug).push(p);
  }
  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(
      ([slug, items]) => `
      <tr class="grp"><td colspan="4">${esc(zh(slug))} · ${items.length} 个</td></tr>
      ${items
        .map(
          (p) =>
            `<tr><td class="m">${esc(p.model ?? "—")}</td><td>${esc(p.name)}</td>` +
            `<td>${esc(extra ? extra(p) : "")}</td><td class="w"></td></tr>`,
        )
        .join("\n")}`,
    )
    .join("\n");
}

const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>美工工作需求补足表 — Canton Hyland</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif; color: #11110f; font-size: 11pt; line-height: 1.5; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 4px; }
  h2 { font-size: 13pt; margin: 22px 0 6px; padding-top: 10px; border-top: 1.5px solid #11110f; page-break-after: avoid; }
  p.lead { margin: 0 0 14px; color: #444; }
  .rule { color: #7a6f4f; background: #faf8f2; border: 1px solid #ddd5bd; padding: 8px 10px; margin: 10px 0 14px; font-size: 10pt; }
  .now { background: #f4f7fb; border: 1px solid #c6d4e6; padding: 8px 10px; margin: 10px 0 14px; font-size: 10pt; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; margin-top: 6px; }
  th, td { border: 1px solid #c9c9c4; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #f2f2ef; font-weight: 600; }
  td.m { font-family: ui-monospace, Consolas, monospace; white-space: nowrap; }
  td.w { min-width: 90px; background: #fffdf7; }
  tr.grp td { background: #ecece8; font-weight: 600; }
  tr { page-break-inside: avoid; }
  .cov td.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .bar { display: inline-block; height: 8px; background: #11110f; vertical-align: middle; }
  .small { font-size: 9.5pt; color: #555; }
  ol.spec { font-size: 10pt; margin: 8px 0 0 18px; padding: 0; }
  ol.spec li { margin-bottom: 4px; }
  footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #c9c9c4; font-size: 9.5pt; color: #555; }
</style>
</head>
<body>

<h1>美工工作需求补足表</h1>
<p class="lead">Canton Hyland · 第二份 · 共 ${total} 个产品 · 由 scripts/build-design-brief.mjs 从实际数据生成</p>

<div class="now">
  <strong>这份表和《供应商信息工作表》分工不同。</strong><br>
  那一份要的是<strong>数字</strong> —— 装箱、中心距、循环寿命、不锈钢等级、检测报告编号。那些要等工程或车间确认。<br>
  这一份要的是<strong>图片和文字</strong> —— 拍照、补细节图、写一句话介绍。这部分不需要等任何人签字，今天就能开始。<br>
  两份表互不重叠，可以同时进行。
</div>

<div class="rule">
  <strong>三条规矩：</strong><br>
  1. <strong>不确定就留空。</strong> 空白我们能识别并继续追；填错的内容会被客户照着下单。<br>
  2. <strong>照片必须是这个型号本身。</strong> 同系列拿相近型号顶替，等于给买家发错货的图。<br>
  3. <strong>不要自己加水印。</strong> 水印由脚本统一压，自己加的会被二次覆盖。
</div>

<h2>一、总览：缺什么，缺多少</h2>
<table class="cov">
  <tr><th>项目</th><th>现状</th><th></th><th>还缺</th><th>谁能做</th></tr>
  <tr><td>主图 —— 一张照片都没有，需要拍</td><td class="n">${pct(total - noHero.length, total)}%</td><td><span class="bar" style="width:${Math.round(pct(total - noHero.length, total) * 0.6)}px"></span></td><td class="n">${noPhotoAtAll.length} 个</td><td>美工 / 拍照</td></tr>
  <tr><td>主图 —— 照片有了，只差指定封面</td><td class="n">—</td><td></td><td class="n">${heroUnpicked.length} 个</td><td>编辑决定，不用拍</td></tr>
  <tr><td>细节图（第 2、3 张）</td><td class="n">${pct(total - noGallery.length - noHero.length, total)}%</td><td><span class="bar" style="width:${Math.round(pct(total - noGallery.length - noHero.length, total) * 0.6)}px"></span></td><td class="n">${noGallery.length} 个</td><td>美工 / 拍照</td></tr>
  <tr><td>一句话介绍（列表和搜索结果会显示）</td><td class="n">${pct(total - noSummary.length, total)}%</td><td><span class="bar" style="width:${Math.round(pct(total - noSummary.length, total) * 0.6)}px"></span></td><td class="n">${noSummary.length} 个</td><td>业务 / 美工</td></tr>
</table>
<p class="small">
  没有主图的页面对买家来说就是一个空框。这是全站可见度最差的一类页面，也是最容易补的一类 ——
  不需要任何技术信息，只需要把货摆在白背景上拍一张。
</p>

<h2>二、按类目分配拍摄任务</h2>
<p class="small">按缺图数量排序。同一类目的产品放在一起拍，一次布光可以拍完一整行。</p>
<table class="cov">
  <tr><th>类目</th><th>中文</th><th>产品数</th><th>缺主图</th><th>缺细节图</th><th>缺介绍</th></tr>
  ${categories
    .map(
      (c) =>
        `<tr><td>${esc(c.slug)}</td><td>${esc(zh(c.slug))}</td><td class="n">${c.n}</td><td class="n">${c.noHero || "—"}</td><td class="n">${c.noGallery || "—"}</td><td class="n">${c.noSummary || "—"}</td></tr>`,
    )
    .join("\n")}
</table>

<h2>三、${blank.length} 个页面既没有图也没有规格（最优先）</h2>
<p class="small">
  这几页现在只有一个标题。买家打开看不到任何东西，搜索引擎也判定为空页。
  拍一张图 + 上一份表里的规格，两边都补上才算完成。
</p>
<table>
  <tr><th>型号</th><th>名称</th><th>类目</th><th>已拍 ✓</th></tr>
  ${blank
    .map(
      (p) =>
        `<tr><td class="m">${esc(p.model ?? "—")}</td><td>${esc(p.name)}</td><td>${esc(zh(p.categoryPath[0]))}</td><td class="w"></td></tr>`,
    )
    .join("\n")}
</table>

<h2>四、${noPhotoAtAll.length} 个产品一张照片都没有</h2>
<p class="small">按类目分组。拍完在最后一栏打勾，文件名用型号即可，我们来改成正式名。</p>
<table>
  <tr><th>型号</th><th>名称</th><th>材质（已知的）</th><th>已拍 ✓</th></tr>
  ${groupedRows(noPhotoAtAll, (p) => p.material ?? "")}
</table>

${
  heroUnpicked.length
    ? `<h2>四·五、${heroUnpicked.length} 个产品照片已经拍好了，只差指定哪张当封面</h2>
<div class="now">
  <strong>这几个不用再拍。</strong> 图已经在我们服务器上，只是没人指定哪一张当产品页的第一张图，
  所以页面上现在是空的。请在「选哪张」一栏写图片编号（例如 <code>-3</code>），或者直接说
  「用侧面那张」。这是一个编辑决定，不是拍摄任务，五分钟就能定完。
</div>
<table>
  <tr><th>型号</th><th>名称</th><th>现有图片</th><th>选哪张</th></tr>
  ${heroUnpicked
    .map(
      (p) =>
        `<tr><td class="m">${esc(p.model ?? "—")}</td><td>${esc(p.name)}</td>` +
        `<td>${galleryCount(p)} 张（编号 ${(p.gallery ?? [])
          .map((g) => (g.src.match(/-(\d+)\.webp$/) ?? [, "?"])[1])
          .join(" / ")}）</td><td class="w"></td></tr>`,
    )
    .join("\n")}
</table>`
    : ""
}

<h2>五、${noGallery.length} 个产品只有一张图</h2>
<p class="small">
  只有一张正面图的产品，买家看不到锁舌、背板、安装孔位。至少补两张：<strong>侧面</strong>（看厚度和锁舌）
  和 <strong>背面或分解</strong>（看孔位和配件）。这一节可以在第四节做完之后再做。
</p>
<table>
  <tr><th>型号</th><th>名称</th><th>建议补拍</th><th>已拍 ✓</th></tr>
  ${groupedRows(noGallery, () => "侧面 + 背面／分解")}
</table>

<h2>六、${noSummary.length} 个产品没有一句话介绍</h2>
<p class="small">
  这一句会出现在列表页、搜索结果和 Google 摘要里。写 20–40 个字，说清楚
  <strong>是什么 + 用在什么门上 + 有什么特点</strong>，不要写「质量优良、价格实惠」这类话 ——
  搜索引擎和买家都会跳过。<br>
  好例子：「适用于 35–50mm 木门与铁门的不锈钢球形锁，钥匙外开、内侧旋钮反锁。」
</p>
<table>
  <tr><th>型号</th><th>名称</th><th>类目</th><th>一句话介绍</th></tr>
  ${groupedRows(noSummary, (p) => zh(p.categoryPath[0]))}
</table>

<h2>七、拍摄规格（照着这个拍，我们不用返工）</h2>
<ol class="spec">
  <li><strong>正方形。</strong> 1:1 裁切，全站 ${total} 张产品图都是正方形，非正方形会被裁掉两边。</li>
  <li><strong>最短边不低于 1200px。</strong> 成品站上是 800×800，留出裁切余量。手机也可以，锁定曝光即可。</li>
  <li><strong>纯白或极浅灰背景</strong>，不要影棚渐变，不要桌面木纹，不要手。</li>
  <li><strong>产品占画面约 70–80%</strong>，四边留白均匀。</li>
  <li><strong>不要加水印、不要加 logo、不要加型号文字。</strong> 水印由脚本统一压在右下角。</li>
  <li><strong>JPG 或 PNG 原图即可</strong>，我们转 WebP。不要先自己压缩。</li>
  <li><strong>文件名写型号</strong>，例如 <code>LC16.jpg</code>、<code>LC16-2.jpg</code>（第二张）、<code>LC16-3.jpg</code>。</li>
</ol>

<h2>八、还有一件事：站上少了一个在卖的型号</h2>
<div class="rule">
  外链站 worldbid 上有一条 <strong>d103-ac</strong> 的产品条目，但我们网站的目录里没有 D103 ——
  只有 D101（5 个变体）和 D102。<br>
  <strong>要确认的是：D103 是不是在卖？</strong> 如果在卖，请给型号、名称、材质、表面处理和一张图，
  我们建页面。如果早就停产，请告诉我们，我们去把那条外链改掉 —— 现在买家点进去会找不到东西。
</div>

<h2>九、交付方式</h2>
<p class="small">
  图片按类目建文件夹（<code>knob-locks/</code>、<code>lever-handles/</code> …），文字直接填在这张表打印稿上
  或回一份 Excel 都可以。<strong>不用等全部做完再给</strong> —— 拍完一个类目就发一个类目，
  我们收到就能上线，不必攒到最后。
</p>

<footer>
  由 scripts/build-design-brief.mjs 于构建数据生成，请勿手改本文件。<br>
  数据来源 content/products（${total} 条记录）。配套文件：《供应商信息工作表》SUPPLIER_WORKBOOK.html。
</footer>

</body>
</html>
`;

const OUT = "docs/research/DESIGN_BRIEF.html";
writeFileSync(OUT, html);
console.log(
  `wrote ${OUT} — 缺主图 ${noHero.length} · 缺细节图 ${noGallery.length} · 缺介绍 ${noSummary.length} · 全空 ${blank.length}`,
);

const outFlag = process.argv.indexOf("--out");
if (outFlag > -1 && process.argv[outFlag + 1]) {
  const dir = process.argv[outFlag + 1];
  mkdirSync(dir, { recursive: true });
  const copy = join(dir, "美工工作需求补足表.html");
  writeFileSync(copy, html);
  console.log(`copied to ${copy}`);
}
