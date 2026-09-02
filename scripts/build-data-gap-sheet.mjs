#!/usr/bin/env node
/**
 * Builds the fill-in sheet for the colleague who collects product data.
 *
 * Everything on it is measured from content/products, so it lists the actual gaps rather
 * than a generic "please fill in the specs". The reader is not technical: each block says
 * what to write, where to get it, and what NOT to write, and it is ordered so the rows
 * that unblock the most pages come first.
 *
 * Output is a single self-contained HTML file that prints to A4 — open it in a browser
 * and use Print → Save as PDF. No PDF library, nothing to install.
 *
 * Usage: node scripts/build-data-gap-sheet.mjs
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ file: f, ...JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")) }));

const total = products.length;
const has = (p, label) => (p.specs ?? []).some((r) => r.label === label);

/** The fields a buyer asks for, in the order the coverage audit says they matter. */
const FIELDS = [
  ["Material", "什么材质", "锌合金 / 不锈钢 304 / 黄铜 / 铁 —— 写牌号，不要只写「金属」"],
  ["Finish", "有哪些表面处理", "用代码即可：PB / AB / SN / SS，脚本会自动展开成全称"],
  ["Application", "用在什么门上", "木门 / 铁门 / 铝合金门 / 防火门 / 玻璃门 —— 可多选"],
  ["Door thickness", "适配门厚", "例：35–50mm。有非标范围也写"],
  ["Function", "功能", "执手 / 通道 / 卫生间 / 钥匙进入 / 自锁"],
  ["Backset", "锁舌中心到门边", "例：60mm。锁体、球形锁、单锁舌都要"],
  ["Cycle life", "循环寿命", "例：200,000 次。没做过测试就留空，不要猜"],
  ["Packing", "装箱", "每箱几个、毛重、箱规 —— 报价和运费全靠这个"],
];

const coverage = FIELDS.map(([label, zh, how]) => {
  const missing = products.filter((p) => !has(p, label));
  return { label, zh, how, missing: missing.length, pct: Math.round((1 - missing.length / total) * 100) };
});

const noSpecs = products.filter((p) => !(p.specs ?? []).length);
const onRequest = products.filter((p) =>
  (p.specs ?? []).some((r) => /on request/i.test(r.value)),
);

/** Finish codes the expander could not name. */
const UNSOURCED = ["BP", "NB", "CB", "BC", "GP", "BRN", "N", "PVD"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const rows = (list) =>
  list
    .map(
      (p) =>
        `<tr><td class="m">${esc(p.model)}</td><td>${esc(p.name)}</td><td class="w"></td><td class="w"></td></tr>`,
    )
    .join("\n");

const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>产品数据待补清单 — Canton Hyland</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif; color: #11110f; font-size: 11pt; line-height: 1.5; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 4px; }
  h2 { font-size: 13pt; margin: 22px 0 6px; padding-top: 10px; border-top: 1.5px solid #11110f; page-break-after: avoid; }
  h3 { font-size: 11.5pt; margin: 14px 0 4px; page-break-after: avoid; }
  p.lead { margin: 0 0 14px; color: #444; }
  .rule { color: #7a6f4f; background: #faf8f2; border: 1px solid #ddd5bd; padding: 8px 10px; margin: 10px 0 14px; font-size: 10pt; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; margin-top: 6px; page-break-inside: auto; }
  th, td { border: 1px solid #c9c9c4; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #f2f2ef; font-weight: 600; }
  td.m { font-family: ui-monospace, Consolas, monospace; white-space: nowrap; }
  td.w { min-width: 90px; background: #fffdf7; }
  tr { page-break-inside: avoid; }
  .cov td.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .bar { display: inline-block; height: 8px; background: #11110f; vertical-align: middle; }
  .small { font-size: 9.5pt; color: #555; }
  footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #c9c9c4; font-size: 9.5pt; color: #555; }
</style>
</head>
<body>

<h1>产品数据待补清单</h1>
<p class="lead">Canton Hyland · 共 ${total} 个产品 · 生成于构建数据，不是通用模板</p>

<div class="rule">
  <strong>三条规矩，比填得多更重要：</strong><br>
  1. <strong>不确定就留空。</strong> 空白我们能识别并继续追；填错的数字会被客户照着下单。<br>
  2. <strong>不要从同系列别的型号推。</strong> 100 和 107 都是 148mm，102 是 147mm —— 差一毫米就是另一个型号。<br>
  3. <strong>认证只写我们自己有报告的。</strong> 没有报告编号的认证一律不写。
</div>

<h2>一、先看整体缺口</h2>
<table class="cov">
  <tr><th>字段</th><th>中文</th><th>已有</th><th></th><th>还缺</th></tr>
  ${coverage
    .map(
      (c) =>
        `<tr><td>${c.label}</td><td>${c.zh}</td><td class="n">${c.pct}%</td><td><span class="bar" style="width:${Math.round(c.pct * 0.6)}px"></span></td><td class="n">${c.missing} 个</td></tr>`,
    )
    .join("\n")}
</table>
<p class="small">怎么填，见每一节的说明。按这个顺序填，前面的字段影响的页面最多。</p>

${coverage
  .map(
    (c) => `<h3>${c.label} — ${c.zh}</h3><p class="small">${c.how}<br>目前 ${c.pct}% 已有，还缺 ${c.missing} 个。</p>`,
  )
  .join("\n")}

<h2>二、${noSpecs.length} 个产品一行规格都没有（最优先）</h2>
<p class="small">这些页面对买家和搜索引擎都近乎空白。有图纸的请附图纸编号。</p>
<table>
  <tr><th>型号</th><th>名称</th><th>材质</th><th>主要尺寸</th></tr>
  ${rows(noSpecs)}
</table>

<h2>三、${onRequest.length} 个产品写着「available on request」</h2>
<p class="small">这句话对爬虫等于没有内容。请把真实值写进右边两栏；确实要按单确认的，写「按单确认」也可以，但要具体到哪一项。</p>
<table>
  <tr><th>型号</th><th>名称</th><th>缺的是哪一项</th><th>真实值</th></tr>
  ${onRequest
    .map((p) => {
      const which = (p.specs ?? [])
        .filter((r) => /on request/i.test(r.value))
        .map((r) => r.label)
        .join(" / ");
      return `<tr><td class="m">${esc(p.model)}</td><td>${esc(p.name)}</td><td>${esc(which)}</td><td class="w"></td></tr>`;
    })
    .join("\n")}
</table>

<h2>四、8 个表面处理代码，我们不知道全称</h2>
<p class="small">
  其余 15 个代码（PB / AB / AC / SN / SC / CP / SB / SP / BN / MB / SS / SSS / PSS / NP / ORB）
  已经自动展开成全称并译成西语。下面这 8 个查不到出处，暂时原样保留 —— 请写出英文全称。
</p>
<table>
  <tr><th>代码</th><th>英文全称</th><th>中文</th></tr>
  ${UNSOURCED.map((c) => `<tr><td class="m">${c}</td><td class="w"></td><td class="w"></td></tr>`).join("\n")}
</table>

<h2>五、这几项拿到就能立刻上站，价值最高</h2>
<table>
  <tr><th>项目</th><th>说明</th><th>填写</th></tr>
  <tr><td>不锈钢等级</td><td>304 / 201 / 316，按型号或按系列都行。沿海和泳池项目必问</td><td class="w"></td></tr>
  <tr><td>装箱数据</td><td>每箱数量 / 毛重 / 箱规。买家算运费要用</td><td class="w"></td></tr>
  <tr><td>盐雾测试</td><td>做过多少小时？没做过就留空</td><td class="w"></td></tr>
  <tr><td>循环寿命</td><td>测过多少次？第三方还是自测？</td><td class="w"></td></tr>
  <tr><td>质保期</td><td>几年？涵盖什么？</td><td class="w"></td></tr>
  <tr><td>HS 编码</td><td>各品类的海关编码</td><td class="w"></td></tr>
  <tr><td>检测报告编号</td><td>机构名 + 报告号 + 标准版本；只写真有的</td><td class="w"></td></tr>
  <tr><td>开模费与打样周期</td><td>OEM 客户最常问的两个数字</td><td class="w"></td></tr>
</table>

<h2>六、按价值排序的七项（甲方 2026-09-01 指定顺序）</h2>
<p class="small">上面几节是逐个型号的细活；这七项是「拿到就能立刻上站」的整批数据，按对生意的影响排序。</p>
<table>
  <tr><th>#</th><th>项目</th><th>为什么排这个位置</th><th>填写 / 附件</th></tr>
  <tr><td>1</td><td>装箱数据</td><td>覆盖率只有 1%。买家算不出运费就问不出价，这是所有数据里最卡脖子的一项</td><td class="w"></td></tr>
  <tr><td>2</td><td>不锈钢等级 304 / 201 / 316</td><td>横跨不锈钢拉手 35、铰链 26、卫浴 45 个产品。沿海与泳池项目一定会问</td><td class="w"></td></tr>
  <tr><td>3</td><td>8 个表面代码全称</td><td>见第四节。其余 15 个已自动展开并译成西语，就差这 8 个</td><td class="w"></td></tr>
  <tr><td>4</td><td>检测报告编号 + 机构 + 标准版本</td><td>AI 引用需要「事实锚点」。没有编号的认证一律不写</td><td class="w"></td></tr>
  <tr><td>5</td><td>质保 / HS 编码 / 开模费 / 打样周期</td><td>质保和 HS 每个进口商都问；开模费和打样周期是 OEM 客户问得最多的两个数字</td><td class="w"></td></tr>
  <tr><td>6</td><td>真实项目名（可隐去客户名）</td><td>保留国家 / 建筑类型 / 用了哪些型号即可。我们是 OEM 代工，客户名不能公开是行业常态，但「哪种楼用过哪些型号」可以说</td><td class="w"></td></tr>
  <tr><td>7</td><td>38 条外链改深链</td><td><strong>这是唯一能加速 Google 收录那 447 个页面的杠杆。</strong>不需要填表，需要有人去 worldbid / traderscity 后台改链接</td><td class="w"></td></tr>
</table>

<h2>七、第 7 项的具体清单（不用填，照着改链接）</h2>
<p class="small">
  Search Console 显示我们全部 102 条外链<strong>都指向首页</strong>，一条深链都没有。
  而这些来源页本身就是在讲某一个具体型号 —— 把链接从首页改成对应产品页，每条只需在对方后台编辑一次。
  完整 38 条见仓库 <code>docs/research/BACKLINK_DEEPLINKS.md</code>，格式是「型号 / 应指向的网址 / 来源 listing」。
</p>
<table>
  <tr><th>做什么</th><th>怎么做</th></tr>
  <tr><td>登录 worldbid.com 后台</td><td>找到清单里列出的 listing，把正文里指向 cantonlock.com 首页的链接改成该型号的产品页网址</td></tr>
  <tr><td>登录 traderscity.com 后台</td><td>同上</td></tr>
  <tr><td>改完告诉技术同事</td><td>我们会在 Search Console 里跟踪这批页面的收录变化</td></tr>
</table>

<footer>
  填完把这份交回给技术同事即可，不需要自己改网站。<br>
  由 <code>scripts/build-data-gap-sheet.mjs</code> 生成 —— 补完数据后重跑，清单会自动变短。
</footer>

</body>
</html>
`;

const out = "docs/research/DATA_GAP_SHEET.html";
writeFileSync(out, html);
console.log(`wrote ${out}`);

/*
  --out also drops a Chinese-named copy in a hand-off folder. The colleague who fills
  this in does not have the repo and should not have to be told which of two English
  filenames is theirs, so the copy is named the way it is referred to in conversation.
*/
const outFlag = process.argv.indexOf("--out");
if (outFlag > -1 && process.argv[outFlag + 1]) {
  const dir = process.argv[outFlag + 1];
  mkdirSync(dir, { recursive: true });
  const copy = join(dir, "产品数据待补清单.html");
  writeFileSync(copy, html);
  console.log(`copied to ${copy}`);
}
console.log(`  ${total} products · ${noSpecs.length} with no specs · ${onRequest.length} with "on request"`);
for (const c of coverage) console.log(`  ${c.label.padEnd(16)} ${String(c.pct).padStart(3)}%  missing ${c.missing}`);
