#!/usr/bin/env node
/**
 * Search Console "page indexing" and "video indexing" exports, read for what is actually broken.
 *
 * GSC lists every URL it ever met, including the old CMS's index.php addresses from before the
 * rebuild, and it reports a validation as 失败 whenever a URL is still in the state the issue
 * names — which for "page redirects", "alternate with proper canonical" and "excluded by noindex"
 * is the state we chose. So the raw counts (766 redirects, 395 crawled-not-indexed) say little.
 * This classifies each list, asks the live site what those URLs return today, and checks whether
 * any of them is in the sitemaps we submit — the one place a redirect or a noindex is a defect.
 *
 *   node scripts/audit-gsc-coverage.mjs <dir-with-extracted-exports> [--out <report.md>] [--offline]
 *
 * Each export folder holds 元数据.csv (问题名称) and 表格.csv (网址, 上次抓取日期[, 视频网址]).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const dir = process.argv[2];
if (!dir || !existsSync(dir)) { console.error("usage: node scripts/audit-gsc-coverage.mjs <dir> [--out report.md] [--offline]"); process.exit(1); }
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const out = arg("--out", `${dir.replace(/[\\/]raw[\\/]?$/, "")}/gsc-coverage.md`);
const offline = process.argv.includes("--offline");
const SITE = "https://cantonlock.com";

const csv = (t) => { const rows = []; let row = [], cell = "", q = false; for (let i = 0; i < t.length; i++) { const c = t[i]; if (q) { if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; } else if (c === '"') q = true; else if (c === ",") { row.push(cell); cell = ""; } else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; } else if (c !== "\r") cell += c; } if (cell || row.length) { row.push(cell); rows.push(row); } return rows; };
const clean = (u) => u.replace(/\s+/g, " ").trim();

const kind = (u) => {
  if (/index\.(php|asp)/i.test(u)) return "旧网站网址（index.php / index.asp）";
  if (/^http:\/\//.test(u)) return "http://";
  if (/\/\/www\./.test(u)) return "www.";
  let url; try { url = new URL(u); } catch { return "无法解析"; }
  if (url.search) return `带参数：${[...url.searchParams.keys()].join("+") || url.search}`;
  if (/\.pdf$/i.test(url.pathname)) return "PDF 规格书";
  const seg = url.pathname.split("/").filter(Boolean);
  const loc = /^(es|pt|fr|de|ja|ko|tr|ru|ar)$/.test(seg[0]) ? seg.shift() : "en";
  const s = seg[0] ?? "(首页)";
  return `${loc} ${s === "products" ? (seg.length >= 3 ? "产品页" : "分类页") : s}`;
};

/* What each GSC issue means for us, and whether "validation failed" is news. */
const VERDICT = {
  "网页会自动重定向": "正常。旧网址和 www/http 本来就该 301；只有出现在站点地图里的才是问题。",
  "备用网页（有适当的规范标记）": "正常。询价链接带 ?product=&model=，规范网址指回不带参数的页面，Google 照做了。",
  "被“noindex”标记排除了": "正常。没有照片的型号按规则 noindex（src/data/products.ts isPublished）；只有出现在站点地图里的才是问题。",
  "已抓取 - 尚未编入索引": "看抓取日期：旧网址多是 9 月 23 日前抓的，现在已 301，下次抓取会自己移到「重定向」。在站点地图里的少数几个是新上线的译文页，Google 抓了还没决定收录，属于时间问题，不是错误。",
  "视频不在观看页面上": "设计如此。Google 只为「以视频为主的页面」建视频索引；产品页的主角是产品，视频是配角。改播放器参数修不掉，要修只能给每个视频单独做观看页。",
};

const exportsFound = readdirSync(dir).filter((d) => existsSync(`${dir}/${d}/表格.csv`)).sort();
const lists = new Map(); // issue -> { urls: [{url, date, video}] }
for (const d of exportsFound) {
  const issue = (readFileSync(`${dir}/${d}/元数据.csv`, "utf8").match(/问题名称,(.*)/) || [])[1]?.trim();
  if (!issue) continue;
  const rows = csv(readFileSync(`${dir}/${d}/表格.csv`, "utf8").replace(/^﻿/, ""));
  const head = rows.shift();
  const iDate = head.findIndex((h) => /抓取日期/.test(h)), iVideo = head.findIndex((h) => /视频网址/.test(h));
  const urls = rows.filter((r) => r[0]).map((r) => ({ url: clean(r[0]), date: r[iDate] ?? "", video: iVideo >= 0 ? r[iVideo] : "" }));
  /* Drilldown and Validation exports of one issue overlap; keep the longer (they are the same set). */
  if (!lists.has(issue) || lists.get(issue).urls.length < urls.length) lists.set(issue, { urls });
}

let sitemap = new Set();
if (!offline) {
  const robots = await (await fetch(`${SITE}/robots.txt`)).text();
  const maps = [...robots.matchAll(/^Sitemap:\s*(\S+sitemap\.xml)\s*$/gim)].map((m) => m[1]);
  for (const m of maps) { const x = await (await fetch(m)).text(); for (const l of x.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemap.add(l[1].trim()); }
}
const live = async (u) => {
  try { const r = await fetch(encodeURI(decodeURI(u)), { redirect: "manual" }); const html = r.status === 200 ? await r.text() : ""; const robots = (html.match(/<meta name="robots" content="([^"]*)"/i) || [])[1] ?? ""; return `${r.status}${r.headers.get("location") ? " → " + r.headers.get("location") : ""}${robots ? " · " + robots : ""}`; }
  catch (e) { return "请求失败"; }
};

const md = [
  `# Search Console 索引问题核对（${new Date().toISOString().slice(0, 10)}）`,
  "",
  `由 \`scripts/audit-gsc-coverage.mjs\` 生成，数据：\`${dir}\`。${offline ? "离线运行，未对照线上。" : `已对照线上 ${sitemap.size} 个站点地图网址，并实测非旧网站网址的当前状态。`}`,
  "",
  "**先看结论**：Search Console 把「验证」标成失败，只表示这些网址仍处在那个状态；对重定向、规范网址、noindex 三类，那个状态就是我们要的。真正的问题只看两件事：这些网址在不在我们提交的站点地图里，以及线上今天返回什么。",
  "",
];
const actions = [];
for (const [issue, { urls }] of lists) {
  const byKind = {}; for (const u of urls) (byKind[kind(u.url)] ??= []).push(u);
  /* A product page with a clip is meant to be in the sitemap; only the page states are defects there. */
  const inMap = issue === "视频不在观看页面上" ? [] : urls.filter((u) => sitemap.has(u.url));
  md.push(`## ${issue}（${urls.length}）`, "", `**判断**：${VERDICT[issue] ?? "未归类，逐条看。"}`, "", "| 类型 | 数量 | 最近抓取 |", "|---|---:|---|");
  for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1].length - a[1].length)) {
    const dates = v.map((x) => x.date).filter(Boolean).sort();
    md.push(`| ${k} | ${v.length} | ${dates[0] ?? ""} → ${dates.at(-1) ?? ""} |`);
  }
  md.push("", `在站点地图里：**${offline ? "未查" : inMap.length}**${inMap.length ? " ← 这些是真问题" : ""}`, "");
  if (inMap.length) { actions.push(`${issue}：${inMap.length} 个网址在站点地图里`); inMap.slice(0, 50).forEach((u) => md.push(`- ${u.url}`)); md.push(""); }
  if (!offline && issue !== "视频不在观看页面上") {
    const sample = urls.filter((u) => !/index\.(php|asp)/i.test(u.url) && !new URL(u.url).search).slice(0, 40);
    if (sample.length) {
      md.push("<details><summary>旧网址和带参数网址以外的，线上现状</summary>", "", "| 网址 | 现在 |", "|---|---|");
      for (const u of sample) md.push(`| ${u.url} | ${await live(u.url)} |`);
      md.push("", "</details>", "");
    }
  }
}
md.push("## 要做的", "", actions.length ? actions.map((a) => `- ${a}`).join("\n") : "- 这批导出里没有出现在站点地图里的问题网址。", "");
/* The lists worth exporting next are the ones whose state is never by design. */
const WANTED = ["未找到 (404)", "重复网页，用户未选定规范网页", "已发现 - 尚未编入索引"];
const missing = WANTED.filter((w) => ![...lists.keys()].includes(w));
if (missing.length) md.push("## 下一次请导出", "", "这几类没有一种是“设计如此”，每一条都可能是真问题：", "", ...missing.map((m) => `- ${m}`), "");
writeFileSync(out, md.join("\n"));
console.log(md.join("\n"));
