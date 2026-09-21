#!/usr/bin/env node
/**
 * 给工厂同事填的一张表 —— 只问三件事，不是又一本问卷。
 *
 * 为什么不用 SUPPLIER_WORKBOOK：那一本问的是"每个品类的买家问题覆盖"，四十多个问题，
 * 而且它现在跑不起来（docs/research/buyer-questions.zh.json 缺译文，exit 1）。
 * 这张表问的是当前唯一真正挡住网站的三件，每一件都能直接写进 content/products。
 *
 * 三件的数字全部现算，没有一个是手写的：
 *   1. finish-codes.ts 里 evidence === "unconfirmed" 的订货代码
 *   2. 客户点名的五个型号缺的 Plate size / Plate thickness
 *   3. 执手与拉手缺的固定孔径与孔中心距 —— 按 series 分组，一族填一次
 *
 * 读的人不是开发，不看英文，可能在手机上填。所以：双击打开、全中文、自动存、
 * 一个按钮导出成能粘进微信的文本。没有安装、没有服务器、没有登录。
 *
 * 导出的文本格式是机器也能读回来的：`[id] 问题` 然后 `  → 答案`。
 *
 * 用法: node scripts/build-factory-gap-sheet.mjs
 *       npm run sheet:factory
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const OUT = "docs/research/FACTORY_GAP_SHEET.html";
const HANDLE_CATEGORIES = [
  "lever-handles",
  "stainless-steel-handles",
  "glass-door-accessories",
  "grip-handle-sets",
];

/* ---------------------------------------------------------------- 数据 */

const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")));

const sitesOf = (p) => (Array.isArray(p.sites) ? p.sites : p.sites ? [p.sites] : []);
const isRayen = (p) => sitesOf(p).includes("rayen");
const labels = (p) => (p.specs || []).map((s) => s.label);
const hasLabel = (p, needle) =>
  labels(p).some((l) => l.toLowerCase().includes(needle.toLowerCase()));

// 1 — 未确认的订货代码
const codeSource = readFileSync("src/data/finish-codes.ts", "utf8");
const codes = [...codeSource.matchAll(/\{\s*code:\s*"([^"]+)"[\s\S]*?evidence:\s*"([^"]+)"/g)]
  .map((m) => ({ code: m[1], evidence: m[2] }));
const unconfirmed = codes.filter((c) => c.evidence === "unconfirmed");

// 每个未确认代码在目录里出现在哪些型号上 — 让填表的人看得见它是活的
const codeUsage = new Map(unconfirmed.map((c) => [c.code, []]));
for (const p of products) {
  const model = String(p.model || "");
  for (const { code } of unconfirmed) {
    if (new RegExp(`(^|[^A-Z])${code}([^A-Z]|$)`).test(model)) codeUsage.get(code).push(model);
  }
}

// 2 — 客户点名的五个型号
const PLATE_MODELS = ["307", "311", "305", "035", "308"];
const plateRows = PLATE_MODELS.map((m) => {
  const p = products.find((x) => String(x.model) === m);
  return {
    model: m,
    name: p?.name ?? "（目录里找不到这个型号）",
    needSize: p ? !hasLabel(p, "plate size") : true,
    needThickness: p ? !hasLabel(p, "plate thickness") : true,
  };
});

// 3 — 执手与拉手的固定孔，按 series 分组
const handles = products.filter(
  (p) => !isRayen(p) && HANDLE_CATEGORIES.some((c) => (p.categoryPath || "").includes(c)),
);
const missingFixing = handles.filter((p) => !hasLabel(p, "fixing hole"));

const families = new Map();
for (const p of missingFixing) {
  const key = p.series || (p.categoryPath || "").split("/").pop() || "其他";
  if (!families.has(key)) families.set(key, []);
  families.get(key).push(String(p.model));
}
const familyRows = [...families.entries()]
  .map(([name, models]) => ({ name, models: models.sort() }))
  .sort((a, b) => b.models.length - a.models.length);

/* ---------------------------------------------------------------- 页面 */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const field = (id, placeholder = "") =>
  `<input class="ans" data-id="${esc(id)}" placeholder="${esc(placeholder)}">`;

const codeRows = unconfirmed
  .map((c) => {
    const used = codeUsage.get(c.code) ?? [];
    const where = used.length
      ? `目录里 ${used.length} 个型号带这个码，例如 ${esc(used.slice(0, 3).join("、"))}`
      : "目录里暂时没有型号带这个码";
    return `<tr>
      <td class="code">${esc(c.code)}</td>
      <td class="why">${where}</td>
      <td>${field(`code:${c.code}`, "这两个字母代表什么？一句话")}</td>
    </tr>`;
  })
  .join("\n");

const plateHtml = plateRows
  .map(
    (r) => `<tr>
      <td class="code">${esc(r.model)}</td>
      <td class="why">${esc(r.name)}</td>
      <td>${r.needSize ? field(`plate-size:${r.model}`, "面板长 × 宽，毫米") : '<span class="done">已有</span>'}</td>
      <td>${r.needThickness ? field(`plate-thk:${r.model}`, "面板厚度，毫米") : '<span class="done">已有</span>'}</td>
    </tr>`,
  )
  .join("\n");

const familyHtml = familyRows
  .map(
    (f) => `<tr>
      <td class="code">${esc(f.name)}</td>
      <td class="why">${f.models.length} 个型号：${esc(f.models.slice(0, 8).join("、"))}${f.models.length > 8 ? " 等" : ""}</td>
      <td>${field(`fix-dia:${f.name}`, "孔径 mm")}</td>
      <td>${field(`fix-cc:${f.name}`, "孔中心距 mm")}</td>
    </tr>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>工厂填写表 — 挡住网站的三件</title>
<style>
  :root { color-scheme: light; }
  body { font: 16px/1.7 -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
         margin: 0; padding: 24px 16px 96px; background: #fff; color: #111; }
  .wrap { max-width: 880px; margin: 0 auto; }
  h1 { font-size: 24px; margin: 0 0 8px; }
  .sub { color: #666; margin: 0 0 32px; }
  h2 { font-size: 19px; margin: 40px 0 4px; padding-top: 24px; border-top: 1px solid #e3e3e3; }
  .lead { color: #444; margin: 4px 0 16px; }
  .rule { background: #fff8e1; border-left: 3px solid #e0a800; padding: 12px 14px; margin: 16px 0; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 13px; color: #666; font-weight: 600;
       border-bottom: 1px solid #ddd; padding: 8px 8px 8px 0; }
  td { border-bottom: 1px solid #f0f0f0; padding: 10px 8px 10px 0; vertical-align: top; }
  td.code { font-weight: 700; white-space: nowrap; }
  td.why { color: #666; font-size: 13px; }
  .done { color: #1a7f37; font-size: 13px; }
  input.ans { width: 100%; box-sizing: border-box; font: inherit; font-size: 15px;
              padding: 7px 9px; border: 1px solid #ccc; border-radius: 4px; background: #fff; }
  input.ans:focus { outline: 2px solid #111; outline-offset: -1px; }
  .bar { position: fixed; left: 0; right: 0; bottom: 0; background: #111; color: #fff;
         padding: 12px 16px; display: flex; gap: 12px; align-items: center; justify-content: center; }
  button { font: inherit; font-size: 15px; padding: 9px 18px; border: 0; border-radius: 4px;
           background: #fff; color: #111; cursor: pointer; font-weight: 600; }
  button.ghost { background: transparent; color: #fff; border: 1px solid #555; font-weight: 400; }
  #saved { color: #9c9; font-size: 13px; }
  textarea { width: 100%; box-sizing: border-box; height: 260px; font: 13px/1.6 ui-monospace, Consolas, monospace;
             padding: 12px; border: 1px solid #ccc; border-radius: 4px; margin-top: 12px; }
  @media print { .bar, textarea, button { display: none } input.ans { border: 0; border-bottom: 1px solid #999; border-radius: 0 } }
</style>
<div class="wrap">

<h1>工厂填写表 — 挡住网站的三件</h1>
<p class="sub">
  生成时间：${new Date().toISOString().slice(0, 10)}　·　由 <code>scripts/build-factory-gap-sheet.mjs</code> 现算，不是手写的<br>
  填完点最下面的「导出」，把出来的文字整段发回来就行。内容会自动保存在这台设备上，可以分几次填。
</p>

<div class="rule">
  <strong>最重要的一条规矩：不确定就空着。</strong><br>
  空着我们在网站上印一个短横线，买家知道要问。
  填一个差不多的数字，买家会照着它开孔、下单、开模 —— 五金件的孔位在开模那一刻定死，
  错了是一整批货。<strong>一个编出来的数字被抓到一次，买家会把我们所有的数字都打折。</strong>
</div>

<h2>一、六个订货代码到底是什么意思</h2>
<p class="lead">
  这六个代码正在我们自己的型号里用着，但没有任何资料说明它们代表什么。
  网站的 <code>/finishes</code> 页面上它们现在印着「未确认」。
  每个一句话就够，比如「SN = 砂镍 Satin Nickel」或「DK = 双面钥匙」。
</p>
<table>
  <tr><th style="width:80px">代码</th><th style="width:44%">用在哪里</th><th>它代表什么</th></tr>
  ${codeRows}
</table>

<h2>二、五个型号的面板尺寸</h2>
<p class="lead">
  这几个型号占了近九十天询盘的大头。尺寸一给，尺寸线图和规格表当天就能出。
  <strong>请量实物或查图纸，单位毫米。</strong>
</p>
<table>
  <tr><th style="width:80px">型号</th><th style="width:34%">名称</th><th style="width:23%">面板尺寸 长×宽</th><th style="width:23%">面板厚度</th></tr>
  ${plateHtml}
</table>

<h2>三、执手与拉手的固定孔</h2>
<p class="lead">
  买家换装时第一个要对的就是这两个数：<strong>固定孔的直径</strong>，和<strong>两个孔的中心距</strong>。
  开孔图生成器早就建好了，就卡在这一个字段上。<br>
  下面按系列分组，<strong>同一系列共用一套孔位的话，一族只填一次</strong>；
  如果同一系列里不同型号孔位不同，请在中心距那栏写清楚，例如「1022 是 96，其余 128」。
</p>
<table>
  <tr><th style="width:150px">系列</th><th style="width:38%">包含型号</th><th style="width:18%">孔径 ⌀</th><th style="width:18%">孔中心距</th></tr>
  ${familyHtml}
</table>

<textarea id="out" placeholder="点「导出」之后，答案会出现在这里，整段复制发回来即可。" readonly></textarea>

</div>

<div class="bar">
  <button id="export">导出（然后整段复制发回）</button>
  <button class="ghost" id="clear">清空</button>
  <span id="saved"></span>
</div>

<script>
(function () {
  var KEY = "factory-gap-sheet-v1";
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }

  var inputs = Array.prototype.slice.call(document.querySelectorAll("input.ans"));
  inputs.forEach(function (el) {
    var id = el.getAttribute("data-id");
    if (saved[id]) el.value = saved[id];
    el.addEventListener("input", function () {
      saved[id] = el.value;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
      var s = document.getElementById("saved");
      s.textContent = "已保存";
      clearTimeout(window.__t);
      window.__t = setTimeout(function () { s.textContent = ""; }, 1200);
    });
  });

  document.getElementById("export").addEventListener("click", function () {
    var lines = ["工厂填写表 — 挡住网站的三件", "导出时间：" + new Date().toLocaleString("zh-CN"), ""];
    var n = 0;
    inputs.forEach(function (el) {
      var v = (el.value || "").trim();
      if (!v) return;
      n++;
      var row = el.closest("tr");
      var head = row ? row.querySelector("td.code").textContent.trim() : "";
      var col = el.getAttribute("placeholder") || "";
      lines.push("[" + el.getAttribute("data-id") + "] " + head + " · " + col);
      lines.push("  \\u2192 " + v);
    });
    if (!n) lines.push("（还没有填写任何一栏）");
    else lines.push("", "共 " + n + " 条。没填的是还不确定的，按规矩空着。");
    var out = document.getElementById("out");
    out.value = lines.join("\\n");
    out.removeAttribute("readonly");
    out.focus();
    out.select();
  });

  document.getElementById("clear").addEventListener("click", function () {
    if (!confirm("清空所有已填内容？")) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    inputs.forEach(function (el) { el.value = ""; });
    document.getElementById("out").value = "";
  });
})();
</script>
</html>
`;

writeFileSync(OUT, html);

console.log(`${OUT}`);
console.log(`  一、未确认订货代码   ${unconfirmed.length} 个：${unconfirmed.map((c) => c.code).join(" ")}`);
console.log(`  二、面板尺寸         ${plateRows.filter((r) => r.needSize || r.needThickness).length} 个型号待填`);
console.log(
  `  三、固定孔           HYDE 执手/拉手 ${handles.length} 个，缺固定孔 ${missingFixing.length} 个，` +
    `归成 ${familyRows.length} 个系列`,
);
