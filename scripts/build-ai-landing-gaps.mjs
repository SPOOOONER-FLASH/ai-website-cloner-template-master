#!/usr/bin/env node
/**
 * 被 AI 引流的产品页缺什么数据 —— 给工厂的清单，按「AI 送人来的次数」排序。
 *
 * ---------------------------------------------------------------------------
 * 为什么（客户 2026-09-28）
 *
 * ChatGPT 把瑞士买家直接送到 LC04 85×60、把澳大利亚买家送到 SSH018，靠的是
 * 「数字写成文字、型号清楚」。这两页都只有 5 行规格。下一步是先补被 AI 引流的页，
 * 不是平均地补 590 页。补什么只能工厂给 —— 这张清单只列缺口，一个数字都不填。
 *
 * ---------------------------------------------------------------------------
 * 信号从哪来（全部现读，不手抄）
 *
 *   1. docs/research/analytics/ 和 docs/research/ai-citations/ 下所有 CSV 里
 *      出现的产品页 URL：Bing AI 引用、Cloudflare AEO 请求等。每一行取它的最后一个数字列。
 *   2. docs/research/ai-landing-seeds.json：客户在 Clarity / GA4 里亲眼看到的
 *      chatgpt.com 落地页（Clarity 不给导出，所以只能手记，记下日期和来源）。
 *
 * 新导出放进 analytics/ 目录、新看到的落地页加进 seeds，重跑即更新：
 *
 *   node scripts/build-ai-landing-gaps.mjs     → docs/research/AI-LANDING-GAPS.md
 *   npm run sheet:ai-landing
 *
 * ---------------------------------------------------------------------------
 * 「缺什么」按品类问
 *
 * 每个品类列出买家核对一个零件时要看的字段（看的是规格行的标签，不看值）。
 * 字段名和站上现有的标签对齐，工厂填回来就能直接进 content/products。
 * 认证、防火等级、标准号不在清单里 —— 那些只有证书在手才写。
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "docs/research/AI-LANDING-GAPS.md";
const SEEDS = "docs/research/ai-landing-seeds.json";
const SIGNAL_DIRS = ["docs/research/analytics", "docs/research/ai-citations"];

/* 字段：[中文问题, 匹配已有标签的正则]。顺序即买家核对的顺序。 */
const COMMON = [
  ["材质（本体 / 主要零件）", /^material$|body material|chassis|case material/i],
  ["表面处理 / 可选颜色", /finish|color|colour|surface/i],
];
const CHECKLIST = {
  "lock-cases": [
    ["中心距（方孔到锁芯孔）", /center distance|centre distance|faceplate to cylinder/i],
    ["后距 backset", /backset/i],
    ["面板（导向片）长 × 宽 × 厚", /faceplate|forend|plate length|plate size/i],
    ["锁体外形尺寸（长 × 宽 × 厚）", /case size|case depth|body size|dimension/i],
    ["方孔尺寸（mm）", /spindle/i],
    ["斜舌 / 方舌伸出长度", /throw|latch|bolt/i],
    ["适用门厚", /door thickness/i],
    ["锁芯类型（欧标 / 椭圆）", /cylinder/i],
    ["左右开是否通用", /handing|revers/i],
    ...COMMON,
  ],
  "brass-steel-hinges": [
    ["规格尺寸（高 × 宽）", /^size|dimension/i],
    ["页片厚度", /thickness/i],
    ["轴承（无 / 2BB / 4BB）", /bearing|type/i],
    ["每片螺丝孔数和螺丝规格", /hole|screw/i],
    ["单副承重（kg）或建议门重", /capacity|load|weight/i],
    ["方角还是圆角", /corner|radius/i],
    ["管数（节数）", /knuckle/i],
    ...COMMON,
  ],
  "night-latches-rim-locks": [
    ["后距 backset", /backset/i],
    ["锁体外形尺寸", /size|dimension|case/i],
    ["适用门厚", /door thickness/i],
    ["斜舌 / 方舌伸出", /throw|extension|latch/i],
    ["锁芯", /cylinder/i],
    ...COMMON,
  ],
  "lock-cylinders": [
    ["总长与内外分段（如 30/30）", /size|length|split/i],
    ["型材（欧标 / 椭圆）", /profile|type/i],
    ["弹子数", /pin/i],
    ["钥匙数量和钥匙类型", /key/i],
    ["拨轮 / 凸轮形式", /cam/i],
    ...COMMON,
  ],
  "door-closers": [
    ["适用门宽", /door width/i],
    ["适用门重（kg）", /capacity|weight/i],
    ["最大开启角度", /opening angle/i],
    ["调速阀（几段）", /speed|valve|adjust/i],
    ["是否带缓冲 / 定位", /backcheck|hold/i],
    ...COMMON,
  ],
  "panic-exit-devices": [
    ["推杠长度 / 适用门宽", /length|door width/i],
    ["锁闭方式（侧锁 / 上下杆）", /type|latch|function|operation/i],
    ["适用门厚", /door thickness/i],
    ["单门 / 双门", /door leaves|door type|application/i],
    ["外侧配件（执手 / 锁芯）", /trim|cylinder|lever|used with/i],
    ["突出高度", /projection|height/i],
    ...COMMON,
  ],
};
const HANDLE_LIKE = [
  ["后距 backset", /backset/i],
  ["适用门厚", /door thickness/i],
  ["功能（入户 / 卧室 / 通道）", /function/i],
  ["底座（圆底座 / 长面板）尺寸", /rose|rosette|backplate|trim|plate/i],
  ["方轴规格", /spindle/i],
  ...COMMON,
];
for (const c of ["lever-handles", "knob-locks", "grip-handle-sets", "deadbolts"]) CHECKLIST[c] = HANDLE_LIKE;
const DEFAULT = [["外形尺寸", /size|dimension|length|width|height/i], ...COMMON];

/* ------------------------------------------------------------------ 产品 */

const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join("content/products", f), "utf8")))
  .filter((p) => !p.sites || [].concat(p.sites).includes("hyde"));
const byPath = new Map(products.map((p) => [`${p.categoryPath[0]}/${p.slug}`, p]));

/* ------------------------------------------------------------------ 信号 */

function csvFiles(dir) {
  let out = [];
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(csvFiles(p));
    else if (e.endsWith(".csv")) out.push(p);
  }
  return out;
}

/** key -> { score, sources: Set } */
const signals = new Map();
const note = (key, n, source) => {
  if (!byPath.has(key)) return;
  const s = signals.get(key) ?? { score: 0, sources: new Set() };
  s.score += n;
  s.sources.add(source);
  signals.set(key, s);
};

/*
  Only exports that measure AI: Bing's AI page stats, Search Console's generative-AI pages,
  Cloudflare's AEO reports. The plain search and GA4 exports list almost every page and
  would turn this into the whole catalog again (583 of 590 on the first run).
*/
const AI_EXPORT = /AIPageStats|ai-page-stats|Generative-AI|[\\/]aeo-/i;

for (const file of SIGNAL_DIRS.flatMap(csvFiles).filter((f) => AI_EXPORT.test(f))) {
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /\/products\/([a-z0-9-]+)\/([a-z0-9-]+)\/?(?=["',\s?]|$)/i.exec(line);
    if (!m) continue;
    const nums = line.match(/(?<=^|[",])\d+(?=[",]|$)/g);
    const n = nums ? Number(nums[nums.length - 1]) : 1;
    note(`${m[1]}/${m[2]}`, n || 1, file.replace(/^docs\/research\//, ""));
  }
}

const seeds = JSON.parse(readFileSync(SEEDS, "utf8"));
for (const seed of seeds.landings) {
  /* 客户亲眼看到的落地页各记 10 分：一个真人从 ChatGPT 进来，比一次爬虫请求值钱得多。 */
  note(seed.path.replace(/^\/?products\//, "").replace(/\/$/, ""), 10, `客户记录 ${seed.seen} ${seed.from}`);
}

/* ------------------------------------------------------------------ 缺口 */

const rows = [...signals]
  .map(([key, s]) => {
    const p = byPath.get(key);
    const list = CHECKLIST[p.categoryPath[0]] ?? DEFAULT;
    const labels = (p.specs ?? []).map((r) => String(r.label));
    const missing = list.filter(([, re]) => !labels.some((l) => re.test(l))).map(([q]) => q);
    const photos = (p.heroImage?.src ? 1 : 0) + (p.gallery?.length ?? 0);
    return { key, p, s, missing, specCount: labels.length, photos };
  })
  .sort((a, b) => b.s.score - a.s.score || a.p.model.localeCompare(b.p.model));

const md = [];
md.push("# 被 AI 引流的产品页：缺什么数据");
md.push("");
md.push(`由 \`scripts/build-ai-landing-gaps.mjs\` 生成，不要手改。重跑：\`npm run sheet:ai-landing\`。`);
md.push("");
md.push("按「AI 带来的请求 / 引用 / 真人落地」排序。每行只列**缺的字段**，已有的规格不再问。");
md.push("工厂按型号填回数字即可；没有的写「无」，不确定的写「待测」，不要按同族型号估。");
md.push("认证、防火等级、标准号不在清单里：那些只有证书在手才写。");
md.push("");
/*
  Cloudflare's AEO export counts AI crawler requests, and the crawlers read nearly every page,
  so almost the whole catalog carries a signal of 1-3. The factory gets the top of the list;
  the rest waits for the next export to separate it.
*/
const TOP = 40;
md.push(
  `共 ${rows.length} 个产品页有信号；这里列前 ${TOP} 个，缺字段 ${rows.slice(0, TOP).reduce((n, r) => n + r.missing.length, 0)} 项。`,
);
md.push("");
md.push("| 排名 | 型号 | 信号分 | 现有规格行 | 照片 | 缺的字段 |");
md.push("|---|---|---|---|---|---|");
rows.slice(0, TOP).forEach((r, i) => {
  md.push(
    `| ${i + 1} | ${r.p.model} | ${r.s.score} | ${r.specCount} | ${r.photos} | ${r.missing.length ? r.missing.join("；") : "—"} |`,
  );
});
md.push("");
md.push("## 信号来源");
md.push("");
for (const r of rows.slice(0, TOP)) md.push(`- ${r.p.model}（/products/${r.key}/）：${[...r.s.sources].join("、")}`);
md.push("");

writeFileSync(OUT, md.join("\n"));
console.log(`${OUT}: ${rows.length} pages, top: ${rows.slice(0, 5).map((r) => r.p.model).join(", ")}`);
