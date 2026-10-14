// Every image cantonlock.com shows a product in, and what it is: a photograph, a factory
// render, an AI/composited scene, or a drawing. Client 10-14: 「审阅全网 找到我们所有产品的实拍图和生成图
// 用同样的规则记录标记」 — "the same rule" is the 10-13 side-by-side checklist (holes, screws,
// profile, proportions, keyway, part count, finish, installation logic).
//
//   node scripts/audit-site-images.mjs            inventory.json + REPORT.md from out/ and verdicts.json
//   node scripts/audit-site-images.mjs --sheets   numbered contact sheets for the visual pass (tmp/)
//
// Product images come from content/products (HYDE catalogue: hero + gallery). Everything else
// comes from the built out/ HTML, so a picture no page shows is not in the audit.
// Verdicts are written by people/agents into docs/research/image-audit/verdicts.json, keyed by
// file; this script never guesses a verdict, it only reports what is recorded and what is not.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DIR = "docs/research/image-audit";
const VERDICTS = `${DIR}/verdicts.json`;
// Logos, portraits, factory and OG cards do not depict a product as a specification.
const SKIP_FOLDERS = new Set(["brand", "people", "company", "company-hyde", "share", "products", "products-hyde", "rayen"]);

const products = fs.readdirSync("content/products").filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(`content/products/${f}`, "utf8")))
  .filter((p) => !p.sites || p.sites.includes("hyde"));

const items = [];
for (const p of products) {
  const all = [{ src: p.heroImage?.src, role: "hero" }, ...(p.gallery ?? []).map((g, i) => ({ src: g.src, role: `gallery-${i + 1}`, label: g.label }))];
  for (const it of all) if (it.src) items.push({ file: `public${it.src}`, group: "product", model: p.model, slug: p.slug, role: it.role, label: it.label ?? p.heroImage?.label ?? "" });
}

// Non-product folders: whatever the built pages reference, responsive variants folded to their source.
const pagesFor = new Map();
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== "_next") walk(p); continue; }
    if (!e.name.endsWith(".html")) continue;
    const page = p.slice(3).replace(/\\/g, "/").replace(/index\.html$/, "");
    for (const m of new Set(fs.readFileSync(p, "utf8").match(/\/images\/[^"'\s,)?\\]+\.(?:webp|jpe?g|png|avif|svg)/gi) ?? [])) {
      const src = m.replace(/\/responsive\//, "/").replace(/-(\d{3,4})w(?=\.\w+$)/, "");
      if (!pagesFor.has(src)) pagesFor.set(src, new Set());
      pagesFor.get(src).add(page);
    }
  }
})("out");
for (const [src, pages] of [...pagesFor].sort()) {
  const folder = src.split("/")[2];
  if (SKIP_FOLDERS.has(folder)) continue;
  let file = `public${src}`;
  if (!fs.existsSync(file)) {
    // A size-suffixed name (-720/-1440) whose source is the largest sibling.
    const alt = file.replace(/-(?:480|720|960)(?=\.\w+$)/, "-1440");
    if (!fs.existsSync(alt)) continue;
    file = alt;
  }
  if (items.some((i) => i.file === file)) continue;
  items.push({ file, group: folder, pages: pages.size, page: [...pages].sort((a, b) => a.length - b.length)[0] });
}

// Provenance hints, never verdicts: a sidecar's declared kind, and the commit that added the file.
const added = new Map();
for (const block of execFileSync("git", ["log", "--diff-filter=A", "--name-only", "--format=@@%h %ad %s", "--date=short", "--", "public/images"], { encoding: "utf8", maxBuffer: 1 << 28 }).split("@@").slice(1)) {
  const [head, ...files] = block.trim().split("\n");
  for (const f of files) if (f && !added.has(f)) added.set(f, head);
}
for (const it of items) {
  const side = `${it.file}.json`;
  if (fs.existsSync(side)) it.sidecar = JSON.parse(fs.readFileSync(side, "utf8")).kind;
  it.added = added.get(it.file) ?? "";
}
items.forEach((it, i) => { it.id = i + 1; });

const verdicts = fs.existsSync(VERDICTS) ? JSON.parse(fs.readFileSync(VERDICTS, "utf8")) : {};
fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync(`${DIR}/inventory.json`, JSON.stringify(items, null, 1) + "\n");

if (process.argv.includes("--sheets")) {
  const { default: sharp } = await import("sharp");
  sharp.cache(false);
  const OUT = "tmp/claude-imgaudit/sheets", T = 250, COLS = 6, PER = 30;
  fs.mkdirSync(OUT, { recursive: true });
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  for (let s = 0; s * PER < items.length; s++) {
    const batch = items.slice(s * PER, (s + 1) * PER);
    const tiles = await Promise.all(batch.map(async (it, k) => {
      const img = await sharp(fs.readFileSync(it.file)).resize(T, T, { fit: "contain", background: "#ffffff" }).flatten({ background: "#ffffff" }).png().toBuffer();
      const cap = Buffer.from(`<svg width="${T}" height="22"><rect width="100%" height="100%" fill="#111"/><text x="4" y="16" font-family="Arial" font-size="14" fill="#fff">#${it.id} ${esc((it.model ?? it.group).slice(0, 26))}</text></svg>`);
      return [{ input: img, left: (k % COLS) * (T + 6), top: Math.floor(k / COLS) * (T + 28) + 22 }, { input: cap, left: (k % COLS) * (T + 6), top: Math.floor(k / COLS) * (T + 28) }];
    }));
    const rows = Math.ceil(batch.length / COLS);
    await sharp({ create: { width: COLS * (T + 6), height: rows * (T + 28), channels: 3, background: "#cccccc" } })
      .composite(tiles.flat()).jpeg({ quality: 82 }).toFile(`${OUT}/sheet-${String(s + 1).padStart(3, "0")}.jpg`);
  }
  console.log(`${Math.ceil(items.length / PER)} sheets in ${OUT}`);
}


// Report: counts, every failure, the models with nothing real to check against, and the full
// per-image list as CSV (opens in Excel) so nothing has to be pasted by hand.
const TYPE = { photo: "实拍照片", render: "渲染图（3D/CG）", ai: "AI 生成 / 重渲染", composite: "实拍合成", drawing: "尺寸图 / 线图", infographic: "图文说明图", unknown: "未判定" };
const typed = items.map((it) => ({ ...it, v: verdicts[it.file] ?? { type: "unknown" } }));
const count = (f) => typed.filter(f).length;
const where = (t) => (t.model ? `${t.model}（${t.role === "hero" ? "主图" : `图库第 ${t.role.slice(8)} 张`}）` : (t.page ?? ""));
const cell = (s) => String(s ?? "").replace(/\|/g, "/").replace(/\n/g, " ");
const failed = typed.filter((t) => t.v.verdict === "不通过");
const checked = typed.filter((t) => t.v.verdict);
// Rough buckets so the designer brief can rank mistakes; one image may land in several.
const BUCKETS = [
  ["同框混了两种以上表面 / 颜色不对", /混色|饰面|表面|颜色|色板|种表面|银色|金色|黄铜色|黑色/],
  ["多出或缺少零件，拼了别的型号", /多出|多加|多画|多了|加了|加入|缺|拼了|拼进|组合套装|非本型号|不是本型号|另一型号|另外|混入|没有 \d+ 产品/],
  ["外形、孔位、螺丝和实拍不一致", /孔|螺丝|螺钉|轮廓|外形|截面|画成|直杆|导向座|锁舌|变形|形状/],
  ["安装逻辑错（装错面、装错边、高度、门型）", /装在|装反|朝向|拉面|拉的一侧|合页侧|门型|离地|越出|悬|平贴|推侧|推门侧|中缝/],
  ["未核实的认证 / 性能说法", /CE|UL|EN ?1|防火|认证|P-90|承重|dB|360|FIRE/],
  ["文字拼错、标注和规格不符", /拼错|标注|规格|乱码|写|标成/],
];
const lines = [
  "# 全站产品图审计：实拍图与生成图",
  "",
  `2026-10-14 · 由 \`node scripts/audit-site-images.mjs\` 生成，不要手改。逐张判定在 \`${VERDICTS}\`，全表在 \`${DIR}/all-images.csv\`。`,
  "",
  `范围：cantonlock.com（HYDE）${products.length} 个在售型号的主图和图库，加上站内所有展示产品的场景图、编辑图、合集图和尺寸线图，共 ${items.length} 张。RAYEN 站不在范围内。`,
  "",
  "## 一、总数",
  "",
  "| 类型 | 产品页 | 其他页面 | 合计 |",
  "|---|---:|---:|---:|",
  ...Object.entries(TYPE).filter(([k]) => count((t) => t.v.type === k)).map(([k, n]) => `| ${n} | ${count((t) => t.v.type === k && t.group === "product")} | ${count((t) => t.v.type === k && t.group !== "product")} | ${count((t) => t.v.type === k)} |`),
  "",
  `渲染、AI、合成、图文图，加上发现问题的尺寸线图，共 ${checked.length} 张逐张做了对照：`,
  "",
  "| 结论 | 张数 | 含义 |",
  "|---|---:|---|",
  `| 通过 | ${count((t) => t.v.verdict === "通过")} | 和该型号实拍图逐项对得上 |`,
  `| 不通过 | ${failed.length} | 至少一项对不上，见第三节，建议下架或换实拍 |`,
  `| 无实拍可对照 | ${count((t) => t.v.verdict === "无实拍可对照")} | 这个型号站上没有一张实拍，只能和它自己的尺寸图、规格对照，见第四节 |`,
  "",
  "对照清单（甲方 10-13）：孔位和孔数、螺丝数量和位置、执手或推杠的轮廓和粗细、按公布尺寸核对比例、锁芯和钥匙孔的形状方向、零件数量（不多不少）、表面处理和颜色；场景图另看安装逻辑（门型、开启边、高度、推拉面、比例、单一表面）；图文图另看有没有未核实的认证说法。",
  "",
  "## 二、不通过的原因分布",
  "",
  "按问题描述的关键词粗分，一张图可能计入多类。",
  "",
  "| 问题 | 张数 |",
  "|---|---:|",
  ...BUCKETS.map(([n, re]) => `| ${n} | ${failed.filter((t) => re.test(t.v.issues ?? "")).length} |`),
  "",
  `## 三、不通过（${failed.length} 张）`,
  "",
  "| # | 图片 | 型号 / 位置 | 类型 | 问题 |",
  "|---:|---|---|---|---|",
  ...failed.map((t) => `| ${t.id} | ${cell(t.file.replace("public/images/", ""))} | ${cell(where(t))} | ${TYPE[t.v.type]} | ${cell(t.v.issues)} |`),
  "",
];
const noPhoto = new Map();
for (const t of typed.filter((x) => x.v.verdict === "无实拍可对照")) {
  const k = t.model ?? t.group;
  if (!noPhoto.has(k)) noPhoto.set(k, []);
  noPhoto.get(k).push(t);
}
lines.push(`## 四、无实拍可对照（${noPhoto.size} 个型号 / 组）`, "", "这些型号站上的图全是渲染或 AI 图，没有实拍可以对。要么补拍实物，要么接受它们只按尺寸图核对。", "",
  "| 型号 | 张数 | 和自身尺寸图、规格的矛盾 |", "|---|---:|---|",
  ...[...noPhoto].map(([k, ts]) => `| ${cell(k)} | ${ts.length} | ${cell(ts.map((t) => t.v.issues).filter(Boolean).join("；")) || "—"} |`), "");
const NOTES = `${DIR}/notes.md`;
if (fs.existsSync(NOTES)) lines.push(fs.readFileSync(NOTES, "utf8").trim(), "");
const unknown = count((t) => t.v.type === "unknown");
if (unknown) lines.push(`未判定 ${unknown} 张：还没有写进 verdicts.json。`, "");
fs.writeFileSync(`${DIR}/REPORT.md`, lines.join("\n"));

const csv = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
fs.writeFileSync(`${DIR}/all-images.csv`, "﻿" + [
  ["编号", "图片", "型号", "位置", "类型", "结论", "问题", "对照的实拍", "判定把握"].join(","),
  ...typed.map((t) => [t.id, t.file.replace("public/images/", ""), t.model ?? "", t.model ? t.role : (t.page ?? ""), TYPE[t.v.type], t.v.verdict ?? "", t.v.issues ?? "", t.v.ref ?? "", t.v.confidence ?? ""].map(csv).join(",")),
].join("\r\n") + "\r\n");
console.log(`${items.length} images (${count((t) => t.group === "product")} product-page); ${checked.length} checked, ${failed.length} failed; ${unknown} without a verdict`);
