#!/usr/bin/env node
/**
 * Builds the one file we hand to the person who actually knows the products.
 *
 * It replaces two documents that asked the same person for the same facts twice:
 *   docs/research/DATA_GAP_SHEET.html        — which spec rows are empty
 *   docs/research/BUYER_QUESTION_COVERAGE.md — which buyer questions nothing answers
 * A missing "Backset on 32/45 records" and a buyer asking "what backset do you have"
 * are one fact, not two, so the workbook asks once and shows the coverage beside it.
 *
 * The reader is not technical and does not read English. Everything is Chinese except
 * model designations, the fields are real inputs, the work auto-saves, and one button
 * produces a block of text they can paste into WeChat. No install, no server, no login —
 * double-click the file.
 *
 * The output is also the machine's input: the exported text is `[id] question` then
 * `  → answer`, so answers can be read back and merged into content/products.
 *
 * Usage: node scripts/build-supplier-workbook.mjs
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { assessQuestions } from "./lib/question-coverage.mjs";

const { rows, categories } = assessQuestions(process.cwd());
const zhBank = JSON.parse(readFileSync("docs/research/buyer-questions.zh.json", "utf8")).questions;

const DIR = "content/products";
const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")));

const total = products.length;
const has = (p, label) => (p.specs ?? []).some((r) => r.label === label);
const noSpecs = products.filter((p) => !(p.specs ?? []).length);
const onRequest = products.filter((p) => (p.specs ?? []).some((r) => /on request/i.test(r.value)));

/* ---- 中文品类名 ---------------------------------------------------------- */
const CAT_ZH = {
  "panic-exit-devices": "逃生推杠",
  "lock-cases": "锁体",
  "knob-locks": "球形锁",
  "lever-handles": "执手锁",
  "night-latches-rim-locks": "外装门锁 / 弹子锁",
  "lock-cylinders": "锁芯",
  "door-closers": "闭门器 / 地弹簧",
  deadbolts: "单锁舌",
  "brass-steel-hinges": "铰链",
  "stainless-steel-handles": "不锈钢拉手",
  "glass-door-accessories": "玻璃门配件",
  "bathroom-accessories": "卫浴配件",
  "grip-handle-sets": "面板执手套装",
  "hardware-accessories": "五金配件",
  "sliding-hook-locks": "推拉门钩锁",
};
const catName = (slug) =>
  `${CAT_ZH[slug] ?? slug}（${categories.find((c) => c.slug === slug)?.name ?? slug}）`;

/* ---- 全站字段（附录 A） -------------------------------------------------- */
const FIELDS = [
  ["Material", "材质", "锌合金 / 不锈钢 304 / 黄铜 / 铁 —— 写牌号，不要只写「金属」"],
  ["Finish", "表面处理", "写代码即可：PB / AB / SN / SS，脚本会自动展开成全称"],
  ["Application", "用在什么门上", "木门 / 铁门 / 铝合金门 / 防火门 / 玻璃门 —— 可多选"],
  ["Door thickness", "适配门厚", "例：35–50mm。有非标范围也写"],
  ["Function", "功能", "执手 / 通道 / 卫生间 / 钥匙进入 / 自锁"],
  ["Backset", "锁舌中心到门边", "例：60mm。锁体、球形锁、单锁舌都要"],
  ["Cycle life", "循环寿命", "例：200,000 次。没做过测试就留空，不要猜"],
  ["Installation", "安装方式", "壁挂 / 暗装 / 明装；有开孔图或纸模板也写上"],
  ["Packing", "装箱", "每箱几个、毛重、箱规 —— 报价和运费全靠这个"],
];

/** 8 finish codes the expander could not name. */
const UNSOURCED = ["BP", "NB", "CB", "BC", "GP", "BRN", "N", "PVD"];

/* ---- 第一部分：全公司只填一次 -------------------------------------------- */
/** `q` links back to a universal question in the bank so nothing is asked twice. */
const COMPANY = [
  {
    id: "A1",
    t: "装箱数据",
    q: "How do you pack it, and how many per carton?",
    d: "每箱数量 / 毛重 / 箱规（长×宽×高）。按品类写也行。",
    w: "覆盖率只有 1%（435 个里 6 个）。买家算不出运费就问不出价——所有数据里最卡脖子的一项。",
    big: true,
  },
  {
    id: "A2",
    t: "不锈钢等级 304 / 201 / 316",
    d: "按型号或按系列写都行，例：拉手 304、铰链 201。",
    w: "横跨不锈钢拉手 35 个、铰链 26 个、卫浴 45 个。沿海和泳池项目一定会问。",
    big: true,
  },
  {
    id: "A3",
    t: "检测报告：机构 + 报告号 + 标准版本",
    d: "只写我们真有报告的。没有报告编号的认证一律不写。",
    w: "AI 引用需要「事实锚点」——一个报告号比十句形容词管用。",
    big: true,
  },
  {
    id: "A4",
    t: "盐雾测试做过多少小时",
    d: "做过就写小时数和是哪个型号；没做过留空。",
    w: "表面处理会不会掉色、会不会锈，买家只认这一个数字。",
  },
  {
    id: "A5",
    t: "循环寿命测过多少次",
    d: "第三方测的还是自测的，一并写上。",
    w: "435 个产品里只有 102 个有这一项。",
  },
  {
    id: "A6",
    t: "质保期",
    q: "What warranty do you give?",
    d: "几年？涵盖什么、不涵盖什么？",
    w: "通常是询价后第二个问题，仅次于价格。",
  },
  {
    id: "A7",
    t: "HS 编码",
    q: "What is the HS code for customs?",
    d: "各品类的海关编码。过去的报关单上就有。",
    w: "每个进口商清关和估税都要用。",
  },
  {
    id: "A8",
    t: "开模费与打样周期",
    d: "两个数字：开一套模多少钱、打样要几天。",
    w: "OEM 客户问得最多的两个数字。",
  },
  {
    id: "A9",
    t: "配件和替换锁芯",
    q: "Can I get spare parts and replacement cylinders later?",
    d: "后期能不能单独买？哪些件常备？",
    w: "工程客户要考虑五年后怎么维修。",
  },
  {
    id: "A10",
    t: "真实项目（客户名可以隐去）",
    d: "保留国家 / 建筑类型 / 用了哪些型号即可，例：智利，连锁酒店 120 间房，用 607 SSET。",
    w: "我们是 OEM 代工，客户名不公开是行业常态，但「哪种楼用过哪些型号」可以说。",
    big: true,
  },
];

/* ---- 完整性检查：题库里每一条都必须有去处 --------------------------------- */
const zhOf = (row) => zhBank[`${row.category ?? "universal"} :: ${row.q}`];
const open = rows.filter((r) => r.state !== "full");

const untranslated = open.filter((r) => !zhOf(r));
if (untranslated.length) {
  console.error("以下问题缺中文译文，请补 docs/research/buyer-questions.zh.json：");
  for (const r of untranslated) console.error(`  ${r.category ?? "universal"} :: ${r.q}`);
  process.exit(1);
}

const placedUniversal = new Set(COMPANY.map((c) => c.q).filter(Boolean));
const stray = open.filter(
  (r) => !r.category && zhOf(r).who === "supplier" && !placedUniversal.has(r.q),
);
if (stray.length) {
  console.error("以下通用问题标了 supplier，但第一部分没有对应条目：");
  for (const r of stray) console.error(`  ${r.q}`);
  process.exit(1);
}

/* ---- HTML ---------------------------------------------------------------- */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** One answer box. `pri:1` survives the 「只看重点」filter. */
const box = (id, q, { hint = "", pri = 2, big = false, why = "" } = {}) => `
<div class="f" data-pri="${pri}">
  <span class="qid">${id}</span>
  <label for="${id}">${esc(q)}</label>
  ${why ? `<p class="why">${esc(why)}</p>` : ""}
  ${hint ? `<p class="hint">${esc(hint)}</p>` : ""}
  ${
    big
      ? `<textarea id="${id}" data-field="${id}" data-q="${esc(q)}" rows="3"></textarea>`
      : `<input id="${id}" data-field="${id}" data-q="${esc(q)}" type="text" autocomplete="off">`
  }
</div>`;

const coverage = FIELDS.map(([label, zh, how]) => {
  const gap = products.filter((p) => !has(p, label)).length;
  return { label, zh, how, missing: gap, pct: Math.round((1 - gap / total) * 100) };
});

/* 第三部分：按品类分组。一条问题问一次，旁边给出这一项在本品类的现有覆盖。 */
const catSections = categories
  .map((cat) => {
    const list = open.filter((r) => r.category === cat.slug);
    if (!list.length) return "";
    const fields = list
      .map((r, i) => {
        const z = zhOf(r);
        if (z.who === "tech") {
          return `<div class="f tech" data-pri="9"><span class="qid">技术侧</span><label>${esc(z.zh)}</label>
  <p class="hint">${esc(z.hint ?? "技术侧处理，你不用填。")}</p></div>`;
        }
        const cov = r.coverage
          ? r.coverage.covered === 0
            ? `目前 ${r.coverage.total} 个型号一条都没写`
            : `目前 ${r.coverage.covered}/${r.coverage.total} 个型号有`
          : "";
        return box(`C-${slug(cat.slug)}-${i + 1}`, z.zh, {
          hint: [z.hint, cov].filter(Boolean).join(" · "),
          pri: r.state === "none" ? 1 : 2,
        });
      })
      .join("\n");
    const none = list.filter((r) => r.state === "none").length;
    const part = list.filter((r) => r.state === "partial").length;
    return `<section class="cat" id="cat-${cat.slug}">
  <h3>${esc(catName(cat.slug))} <span class="badge">全缺 ${none} · 半缺 ${part}</span></h3>
  ${fields}
</section>`;
  })
  .join("\n");

const techRows = open
  .filter((r) => zhOf(r).who === "tech")
  .map((r) => `<tr><td>${esc(zhOf(r).zh)}</td><td>${esc(zhOf(r).hint ?? "")}</td></tr>`)
  .join("\n");

const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>产品资料补充表 — Canton Hyland</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  :root { --ink:#11110f; --dim:#5c5c56; --line:#d6d6d0; --paper:#fff; --tint:#faf8f2; --edge:#ddd5bd; --accent:#7a6f4f; }
  body { font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif; color:var(--ink); background:#f4f4f1;
         font-size:15px; line-height:1.65; margin:0; padding:0 0 120px; }
  .wrap { max-width:940px; margin:0 auto; padding:0 20px; background:var(--paper); }
  header.top { padding:32px 0 20px; }
  h1 { font-size:28px; margin:0 0 6px; }
  h2 { font-size:20px; margin:40px 0 4px; padding-top:14px; border-top:2px solid var(--ink); }
  h3 { font-size:17px; margin:26px 0 8px; }
  p.lead { margin:0; color:var(--dim); }
  p.note { color:var(--dim); font-size:14px; margin:6px 0 14px; }
  .rule { background:var(--tint); border:1px solid var(--edge); padding:14px 16px; margin:18px 0; border-radius:4px; }
  .rule strong { color:var(--accent); }
  .steps { counter-reset:s; list-style:none; padding:0; margin:14px 0 0; }
  .steps li { counter-increment:s; padding:6px 0 6px 34px; position:relative; }
  .steps li::before { content:counter(s); position:absolute; left:0; top:8px; width:22px; height:22px; border-radius:50%;
    background:var(--ink); color:#fff; text-align:center; font-size:13px; line-height:22px; }

  .f { padding:12px 0 14px; border-bottom:1px solid var(--line); }
  .f label { display:block; font-weight:600; }
  .qid { display:block; color:#a09a86; font:11px ui-monospace,Consolas,monospace; letter-spacing:.02em; }
  .f .why { margin:3px 0 0; font-size:13px; color:var(--accent); }
  .f .hint { margin:3px 0 0; font-size:13px; color:var(--dim); }
  .f input, .f textarea { display:block; width:100%; margin:8px 0 0; padding:8px 10px;
    border:1px solid var(--line); border-radius:3px; font:inherit; background:#fffdf7; }
  .f input:focus, .f textarea:focus { outline:2px solid var(--accent); outline-offset:-1px; background:#fff; }
  .f.done input, .f.done textarea { background:#f3f8f1; border-color:#9dbb92; }
  .f.tech { opacity:.62; }
  .f.tech label { font-weight:500; }

  section.cat { border-left:3px solid var(--edge); padding-left:16px; margin:22px 0; }
  .badge { font-size:12px; font-weight:400; color:var(--dim); background:var(--tint); border:1px solid var(--edge);
    padding:1px 7px; border-radius:9px; margin-left:6px; vertical-align:middle; }

  table { border-collapse:collapse; width:100%; font-size:14px; margin:10px 0 4px; }
  th, td { border:1px solid var(--line); padding:6px 9px; text-align:left; vertical-align:top; }
  th { background:#f2f2ef; font-weight:600; }
  td.m { font:13px ui-monospace,Consolas,monospace; }
  td.n { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .bar { display:inline-block; height:8px; background:var(--ink); vertical-align:middle; }
  td.cell input { width:100%; padding:5px 7px; border:1px solid var(--line); border-radius:3px; font:inherit; background:#fffdf7; }
  td.cell input:focus { outline:2px solid var(--accent); outline-offset:-1px; }
  td.cell input.filled { background:#f3f8f1; border-color:#9dbb92; }

  #bar { position:fixed; left:0; right:0; bottom:0; background:var(--ink); color:#fff; z-index:50;
    box-shadow:0 -2px 12px rgba(0,0,0,.25); }
  #bar .in { max-width:940px; margin:0 auto; padding:10px 20px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  #bar .grow { flex:1 1 200px; font-size:14px; }
  #bar button { font:inherit; padding:9px 16px; border:0; border-radius:4px; cursor:pointer; background:#fff; color:var(--ink); font-weight:600; }
  #bar button.ghost { background:transparent; color:#fff; border:1px solid #6a6a63; font-weight:400; }
  #bar button:hover { opacity:.88; }
  #prog { height:5px; background:#3a3a35; }
  #prog i { display:block; height:100%; background:#c9b984; width:0; transition:width .2s; }
  #say { font-size:13px; color:#c9c9c2; }

  @media print {
    body { background:#fff; font-size:10.5pt; padding:0; }
    .wrap { max-width:none; padding:0; }
    #bar, .noprint { display:none !important; }
    h2 { page-break-after:avoid; } .f, tr, section.cat { page-break-inside:avoid; }
    .f input, .f textarea { background:#fff; border:0; border-bottom:1px solid #999; border-radius:0; height:26px; }
  }
</style>
</head>
<body>
<div class="wrap">

<header class="top">
  <h1>产品资料补充表</h1>
  <p class="lead">Canton Hyland · 共 ${total} 个产品 · 由网站真实数据生成，不是通用模板</p>
</header>

<div class="rule noprint">
  <strong>怎么用（三步）</strong>
  <ol class="steps">
    <li>知道的就填，不知道的<strong>留空跳过</strong>。填过的框会变绿。</li>
    <li>随时可以关掉，内容自动存在这台电脑上，下次打开还在。</li>
    <li>填完点最下面的 <strong>【复制全部】</strong>，粘贴到微信发给技术同事就行。</li>
  </ol>
</div>

<div class="rule">
  <strong>三条规矩，比填得多更重要</strong><br>
  1. <strong>不确定就留空。</strong>空白我们能识别并继续追；填错的数字会被客户照着下单。<br>
  2. <strong>不要从同系列别的型号推。</strong>100 和 107 都是 148mm，102 是 147mm —— 差一毫米就是另一个型号。<br>
  3. <strong>认证只写我们自己有报告的。</strong>没有报告编号的认证一律不写。
</div>

<h2>第一部分 · 全公司只填一次</h2>
<p class="note">这几项不分型号，一次说清就能立刻上站，是整份表里最值钱的部分。</p>
${COMPANY.map((c) => box(c.id, c.t, { hint: c.d, why: c.w, pri: 1, big: c.big })).join("\n")}

<h2>第二部分 · 8 个表面处理代码</h2>
<p class="note">
  另外 15 个代码（PB / AB / AC / SN / SC / CP / SB / SP / BN / MB / SS / SSS / PSS / NP / ORB）
  已经自动展开成英文全称并译成西班牙语。下面这 8 个查不到出处，现在按原样显示在网站上 —— 请写出英文全称。
</p>
<table>
  <tr><th style="width:80px">代码</th><th>英文全称</th><th>中文</th></tr>
  ${UNSOURCED.map(
    (c) => `<tr><td class="m">${c}</td>
    <td class="cell"><input data-field="B-${c}-en" data-q="表面代码 ${c} 的英文全称" type="text" autocomplete="off"></td>
    <td class="cell"><input data-field="B-${c}-zh" data-q="表面代码 ${c} 的中文" type="text" autocomplete="off"></td></tr>`,
  ).join("\n")}
</table>

<h2>第三部分 · 分品类问答</h2>
<p class="note">
  下面每一条都是买家真的会问、而网站现在答不上来的问题。一条答一次，整个品类通用；
  某几个型号特殊，就在答案里注明型号。「目前 X/Y」是这一项已经写了的型号数。
</p>
${catSections}

<h2>第四部分 · ${noSpecs.length} 个产品一行规格都没有</h2>
<p class="note">这些页面对买家和搜索引擎都近乎空白，优先级最高。有图纸的，把图纸编号写进「主要尺寸」也行。</p>
<table>
  <tr><th style="width:34%">型号</th><th>材质</th><th>主要尺寸</th></tr>
  ${noSpecs
    .map((p) => {
      const k = slug(p.model);
      return `<tr><td class="m">${esc(p.model)}</td>
      <td class="cell"><input data-field="D-${k}-mat" data-q="${esc(p.model)} 的材质" type="text" autocomplete="off"></td>
      <td class="cell"><input data-field="D-${k}-dim" data-q="${esc(p.model)} 的主要尺寸" type="text" autocomplete="off"></td></tr>`;
    })
    .join("\n")}
</table>

<h2 data-secpri="2">第五部分 · ${onRequest.length} 个产品写着「按需询问」</h2>
<p class="note" data-secpri="2">
  「available on request」这句话对搜索引擎等于没有内容。请写真实值；
  确实要按单确认的，写「按单确认」也可以，但要具体到哪一项。
</p>
<table data-secpri="2">
  <tr><th style="width:26%">型号</th><th style="width:22%">缺的是哪一项</th><th>真实值</th></tr>
  ${onRequest
    .map((p) => {
      const which = (p.specs ?? [])
        .filter((r) => /on request/i.test(r.value))
        .map((r) => (r.label === "Door thickness" ? "适配门厚" : r.label === "Strike" ? "锁扣片" : r.label))
        .join(" / ");
      const k = slug(p.model);
      return `<tr><td class="m">${esc(p.model)}</td><td>${esc(which)}</td>
      <td class="cell"><input data-field="E-${k}" data-q="${esc(p.model)} 的${esc(which)}" type="text" autocomplete="off"></td></tr>`;
    })
    .join("\n")}
</table>

<h2 data-secpri="2">附录 A · 全站字段覆盖率（只看，不用填）</h2>
<p class="note" data-secpri="2">这是第四、第五部分之外的长期功课：这些字段每补一个型号，就多一个页面能被搜到。按这个顺序补，影响的页面最多。</p>
<table data-secpri="2">
  <tr><th>字段</th><th>中文</th><th>怎么写</th><th>已有</th><th></th><th>还缺</th></tr>
  ${coverage
    .map(
      (c) => `<tr><td class="m">${c.label}</td><td>${c.zh}</td><td>${esc(c.how)}</td>
    <td class="n">${c.pct}%</td><td><span class="bar" style="width:${Math.max(1, Math.round(c.pct * 0.6))}px"></span></td>
    <td class="n">${c.missing} 个</td></tr>`,
    )
    .join("\n")}
</table>

<h2 data-secpri="2">附录 B · 不用你填（技术侧的活）</h2>
<table data-secpri="2">
  <tr><th style="width:42%">事项</th><th>谁做、怎么做</th></tr>
  ${techRows}
  <tr><td>38 条外链改深链</td><td><strong>这是唯一能加速 Google 收录那 447 个页面的杠杆。</strong>Search Console 显示我们 102 条外链全部指向首页，一条深链都没有。需要有人登录 worldbid.com / traderscity.com 后台，把正文里指向首页的链接改成对应型号的产品页。完整清单见 <code>docs/research/BACKLINK_DEEPLINKS.md</code>。</td></tr>
</table>

<footer style="margin:36px 0 0; padding:14px 0; border-top:1px solid var(--line); color:var(--dim); font-size:13px">
  填完点最下面的【复制全部】发回给技术同事即可，不需要自己改网站。<br>
  由 <code>scripts/build-supplier-workbook.mjs</code> 生成 —— 数据补进去之后重跑，这份表会自动变短。
</footer>

</div>

<div id="bar" class="noprint">
  <div id="prog"><i></i></div>
  <div class="in">
    <div class="grow">已填 <b id="n">0</b> / <span id="t">0</span> 项 <span id="say"></span></div>
    <button type="button" id="only" class="ghost">只看重点</button>
    <button type="button" id="print" class="ghost">打印 / 存 PDF</button>
    <button type="button" id="save" class="ghost">导出文件</button>
    <button type="button" id="copy">复制全部</button>
  </div>
</div>

<script>
(function () {
  var KEY = "chy-workbook-v1";
  var all = [].slice.call(document.querySelectorAll("[data-field]"));
  document.getElementById("t").textContent = all.length;

  /* localStorage can be unavailable (private window, some browsers on file://).
     The workbook must still work then; it just will not remember. */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function persist() {
    var out = {};
    all.forEach(function (el) { if (el.value.trim()) out[el.dataset.field] = el.value.trim(); });
    try {
      localStorage.setItem(KEY, JSON.stringify(out));
      document.getElementById("say").textContent = "· 已自动保存";
    } catch (e) {
      document.getElementById("say").textContent = "· 这台电脑不能自动保存，填完请马上导出";
    }
  }

  function mark(el) {
    var on = el.value.trim().length > 0;
    if (el.closest("td")) el.classList.toggle("filled", on);
    var f = el.closest(".f");
    if (f) f.classList.toggle("done", on);
  }

  function count() {
    var n = all.filter(function (el) { return el.value.trim(); }).length;
    document.getElementById("n").textContent = n;
    document.querySelector("#prog i").style.width = (n / all.length * 100) + "%";
    return n;
  }

  var saved = load();
  all.forEach(function (el) {
    if (saved[el.dataset.field]) el.value = saved[el.dataset.field];
    mark(el);
  });

  var timer, dirty = false;
  document.addEventListener("input", function (e) {
    if (!e.target.dataset || !e.target.dataset.field) return;
    mark(e.target); count(); dirty = true;
    clearTimeout(timer); timer = setTimeout(persist, 400);
  });

  window.addEventListener("beforeunload", function (e) {
    if (!dirty) return;
    e.preventDefault(); e.returnValue = "";
  });

  /* The export is also the machine's input: "[id] question" then "  -> answer". */
  function heading(el) {
    var n = el;
    while (n && n !== document.body) {
      var p = n.previousElementSibling;
      while (p) { if (p.tagName === "H2") return p.textContent.trim(); p = p.previousElementSibling; }
      n = n.parentElement;
    }
    return "";
  }

  function text() {
    var n = count();
    var lines = ["Canton Hyland 产品资料补充表",
                 "填写人：____________   日期：____________",
                 "已填 " + n + " / " + all.length + " 项", ""];
    var head = "";
    all.forEach(function (el) {
      var v = el.value.trim();
      if (!v) return;
      var h = heading(el);
      if (h && h !== head) { head = h; lines.push("=== " + h + " ===", ""); }
      lines.push("[" + el.dataset.field + "] " + (el.dataset.q || ""));
      lines.push("  → " + v.replace(/\\s*\\n\\s*/g, " / "), "");
    });
    if (n === 0) lines.push("（还没有填写任何内容）");
    return lines.join("\\n");
  }

  document.getElementById("copy").onclick = function () {
    var t = text(), ta = document.createElement("textarea");
    ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) { dirty = false; alert("已复制。打开微信粘贴，发给技术同事就行。"); return; }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t).then(function () {
        dirty = false; alert("已复制。打开微信粘贴，发给技术同事就行。");
      }, function () { alert("这台电脑不让复制，请改用【导出文件】。"); });
      return;
    }
    alert("这台电脑不让复制，请改用【导出文件】。");
  };

  document.getElementById("save").onclick = function () {
    var blob = new Blob(["\\ufeff" + text()], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "产品资料补充表-已填.txt";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    dirty = false;
    alert("已保存到「下载」文件夹，文件名：产品资料补充表-已填.txt");
  };

  document.getElementById("print").onclick = function () { window.print(); };

  var onlyKey = false;
  document.getElementById("only").onclick = function () {
    onlyKey = !onlyKey;
    this.textContent = onlyKey ? "显示全部" : "只看重点";
    [].forEach.call(document.querySelectorAll(".f"), function (f) {
      f.style.display = onlyKey && f.dataset.pri !== "1" ? "none" : "";
    });
    [].forEach.call(document.querySelectorAll("[data-secpri]"), function (n) {
      n.style.display = onlyKey ? "none" : "";
    });
    [].forEach.call(document.querySelectorAll("section.cat"), function (s) {
      var vis = [].slice.call(s.querySelectorAll(".f")).some(function (f) {
        return f.style.display !== "none";
      });
      s.style.display = vis ? "" : "none";
    });
  };

  count();
})();
</script>
</body>
</html>
`;

const out = "docs/research/SUPPLIER_WORKBOOK.html";
writeFileSync(out, html);
const boxes = (html.match(/data-field=/g) ?? []).length;
console.log(`wrote ${out}`);
console.log(
  `  ${boxes} 个填写框 · ${open.length} 条待答问题 · ${noSpecs.length} 个零规格型号 · ${onRequest.length} 个按需询问`,
);
