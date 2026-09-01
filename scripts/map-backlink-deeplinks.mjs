#!/usr/bin/env node
/**
 * Matches each inbound backlink to the product page it should point at.
 *
 * WHY. Search Console's referring-pages export (2026-09-01) shows 102 backlinks from
 * four domains, and **every one of them lands on the homepage or a legacy URL** — 98 on
 * `https://cantonlock.com`, 4 on `/index.php?lang=en`. Not one deep link.
 *
 * That is the whole external link equity this site has, spent on one page. Meanwhile 447
 * product pages sit in Search Console as "discovered, not indexed": Google knows they
 * exist from the sitemap and has never crawled them, because nothing points at them.
 *
 * The listings themselves are product-specific. worldbid.com/...-lc08-85-55-i383134.html
 * is a page about exactly one mortise lock case, and we publish a page about exactly that
 * lock case. Repointing that link costs the client one edit per listing and turns a
 * homepage link into a crawl path to a page Google has never fetched.
 *
 * This script reads the export, pulls the model code out of each listing URL and finds
 * the matching product record. It writes a table the client can work through — it does
 * not contact anyone or change anything.
 *
 * Usage:
 *   node scripts/map-backlink-deeplinks.mjs <referring-pages.csv> [--markdown]
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("usage: node scripts/map-backlink-deeplinks.mjs <referring-pages.csv> [--markdown]");
  process.exit(1);
}

/** Model codes are written a dozen ways across sites; compare on letters and digits only. */
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")))
  .map((p) => ({
    model: p.model,
    key: norm(p.model),
    url: `https://cantonlock.com/products/${p.categoryPath[0]}/${p.slug}/`,
  }));

const byKey = new Map(products.map((p) => [p.key, p]));

/**
 * Pull the model code out of a listing URL.
 *
 * worldbid ends every slug with the model then its own id: `...-lc08-85-55-i383134.html`.
 * traderscity uses a numeric id with no model, so those match by scanning the whole slug.
 */
function candidatesFrom(url) {
  const slug = url
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/-i\d+\.html$/, "")
    .replace(/-\d+$/, "")
    .replace(/\.html$/, "");
  const parts = slug.split(/[/-]/).filter(Boolean);

  // Try the longest trailing runs first: "lc08 85 55" beats "55".
  const out = [];
  for (let len = 4; len >= 1; len -= 1) {
    for (let i = parts.length - len; i >= 0; i -= 1) {
      out.push(parts.slice(i, i + len).join(""));
    }
  }
  return out;
}

const rows = readFileSync(csvPath, "utf8")
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean)
  .map((line) => {
    const m = line.match(/^"([^"]*)","([^"]*)","([^"]*)"/);
    return m ? { src: m[1], anchor: m[2], target: m[3] } : null;
  })
  .filter(Boolean);

const matched = [];
const unmatched = [];

for (const row of rows) {
  let hit = null;
  for (const candidate of candidatesFrom(row.src)) {
    const found = byKey.get(candidate);
    // Guard against a one- or two-character coincidence matching a short model.
    if (found && candidate.length >= 3) {
      hit = found;
      break;
    }
  }
  (hit ? matched : unmatched).push({ ...row, product: hit });
}

const domain = (u) => new URL(u).hostname.replace(/^www\./, "");
const perDomain = {};
for (const r of rows) perDomain[domain(r.src)] = (perDomain[domain(r.src)] ?? 0) + 1;

if (!process.argv.includes("--markdown")) {
  console.log(`backlinks read      : ${rows.length}`);
  console.log(`matched to a product: ${matched.length}`);
  console.log(`no model in the URL : ${unmatched.length}`);
  console.log("");
  console.log("by domain:", JSON.stringify(perDomain));
  console.log("");
  for (const r of matched.slice(0, 12)) {
    console.log(`${r.product.model.padEnd(14)} ${r.product.url}`);
    console.log(`   from ${r.src.slice(0, 96)}`);
  }
  process.exit(0);
}

const lines = [];
lines.push("# 外链深链改造清单");
lines.push("");
lines.push("<!-- 由 scripts/map-backlink-deeplinks.mjs --markdown 生成，请勿手改。 -->");
lines.push("");
lines.push(
  `Search Console 引荐页面导出（2026-09-01）共 **${rows.length}** 条外链，` +
    `**全部落在首页或一条旧 URL 上**，没有一条深链。`,
);
lines.push("");
lines.push(
  "这是本站全部的站外权重，全压在一个页面上。而与此同时有 447 个产品页在 Search Console 里" +
    "是「已发现 — 尚未编入索引」：Google 从 sitemap 知道它们存在，一次都没抓过，" +
    "因为**没有任何东西指向它们**。",
);
lines.push("");
lines.push(
  `下面 **${matched.length}** 条外链的来源页本身就是在讲某一个具体型号，而我们恰好有那个型号的页面。` +
    "把链接从首页改到对应产品页，每条只需在对方后台编辑一次。",
);
lines.push("");
lines.push("| 型号 | 应指向 | 来源listing |");
lines.push("|---|---|---|");
for (const r of matched) {
  lines.push(`| ${r.product.model} | ${r.product.url} | ${r.src} |`);
}
lines.push("");
lines.push(`## 未匹配到型号的 ${unmatched.length} 条`);
lines.push("");
lines.push(
  "多数是 traderscity 的列表页与公司主页，URL 里没有型号码，或讲的是我们没有单独页面的产品。" +
    "这些保持指向首页是合理的。",
);
lines.push("");
for (const r of unmatched) lines.push(`- ${r.src}`);
lines.push("");

const out = "docs/research/BACKLINK_DEEPLINKS.md";
writeFileSync(out, `${lines.join("\n")}\n`);
console.log(`wrote ${out} — ${matched.length} of ${rows.length} matched`);
