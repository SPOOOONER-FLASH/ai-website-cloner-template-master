#!/usr/bin/env node
/*
 * Maps every directory listing that links to cantonlock.com (Bing "Referring pages" export)
 * to the product page it should link to instead of the home page.
 *
 * Why: on 2026-10-09 all 140 backlinks pointed at the home page with a bare-URL anchor, while
 * 226 English product pages sat in Google's "discovered, not crawled" queue. The listings on
 * worldbid / traderscity / etradeasia are the client's own posts, so he can change each link
 * to the matching product page himself — a deep link with relevant context costs nothing.
 *
 * Matching is by model code only (taken from the listing URL slug). A listing whose code is
 * not on the HYDE site is reported as "no match" and keeps the home page link; nothing is
 * guessed from product type.
 *
 *   node scripts/build-backlink-deeplinks.mjs [--csv <bing ReferringPages csv>] [--out <md>]
 */
import fs from "node:fs";
import path from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const csvPath = arg("--csv", "docs/research/analytics/2026-10-09/raw/bing-ReferringPages.csv");
const outPath = arg("--out", "docs/research/analytics/2026-10-09/BACKLINK-DEEPLINKS.md");

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// HYDE product pages as built: out/products/<category>/<slug>/index.html
const byKey = new Map();
for (const cat of fs.readdirSync("out/products", { withFileTypes: true })) {
  if (!cat.isDirectory()) continue;
  for (const p of fs.readdirSync(path.join("out/products", cat.name), { withFileTypes: true })) {
    const rec = path.join("content/products", `${p.name}.json`);
    if (!p.isDirectory() || !fs.existsSync(rec)) continue;
    const model = JSON.parse(fs.readFileSync(rec, "utf8")).model;
    if (!model) continue;
    const key = norm(model);
    // A code needs a digit and three characters: "01" would match half the catalogue, and a
    // generic model like "Cylindrical Knob Lock" would match any listing that describes one.
    if (key.length < 3 || !/\d/.test(key)) continue;
    (byKey.get(key) ?? byKey.set(key, []).get(key)).push({
      model,
      url: `https://cantonlock.com/products/${cat.name}/${p.name}/`,
    });
  }
}

export function matchListing(listingUrl, index = byKey) {
  const last = new URL(listingUrl).pathname.split("/").filter(Boolean).pop() ?? "";
  const tokens = last
    .replace(/\.html$/, "")
    .replace(/-i\d+$/, "")
    .split("-")
    .filter(Boolean);
  let best = null;
  for (let a = 0; a < tokens.length; a++) {
    for (let b = a + 1; b <= Math.min(tokens.length, a + 4); b++) {
      const key = norm(tokens.slice(a, b).join(""));
      const hits = index.get(key);
      if (hits && (!best || key.length > best.key.length)) best = { key, hits };
    }
  }
  return best;
}

// Self-check against two listings read by hand on 2026-10-09: a spaced code and a code
// buried after a backset ("16mm-lc17-backset").
for (const [listing, model] of [
  ["https://worldbid.com/x/stainless-steel-mortise-lock-for-interior-wooden-and-metal-doors-lc8525-ps-i383219.html", "LC8525 PS"],
  ["https://worldbid.com/x/sliding-hook-mortise-lock-case-16mm-lc17-backset-aluminium-and-steel-construction-for-doors-i383141.html", "LC17"],
]) {
  const got = matchListing(listing)?.hits[0].model;
  if (got !== model) throw new Error(`self-check: ${listing} matched ${got}, expected ${model}`);
}

const rows = fs
  .readFileSync(csvPath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((l) => l.match(/"([^"]*)"/g).map((c) => c.slice(1, -1)));

const out = [];
let matched = 0;
const bySite = {};
for (const [source] of rows) {
  const host = new URL(source).hostname.replace(/^(www|cn|hs)\./, "");
  const m = matchListing(source);
  const site = (bySite[host] ??= { total: 0, matched: 0 });
  site.total++;
  if (m) {
    matched++;
    site.matched++;
  }
  // Several variants share a code (e.g. one model in two finishes): list them all, first is the default.
  out.push({ host, source, model: m?.hits[0].model ?? "", target: m ? m.hits.map((h) => h.url).join(" 或 ") : "" });
}
out.sort((a, b) => a.host.localeCompare(b.host) || (a.target ? 0 : 1) - (b.target ? 0 : 1));

const md = [
  "# 目录网站帖子 → 改链到产品页（深链）对照表",
  "",
  `生成：\`node scripts/build-backlink-deeplinks.mjs\`（源：Bing「引用页面」导出 ${path.basename(csvPath)}）。按帖子网址里的型号匹配；对不上的保持链首页，不猜。`,
  "",
  `共 ${rows.length} 条帖子，能对上产品页的 ${matched} 条。`,
  "",
  "| 网站 | 帖子数 | 能改成产品页 |",
  "|---|---|---|",
  ...Object.entries(bySite).map(([h, s]) => `| ${h} | ${s.total} | ${s.matched} |`),
  "",
  "| 网站 | 型号 | 帖子 | 把网址改成 |",
  "|---|---|---|---|",
  ...out.map((r) => `| ${r.host} | ${r.model || "—"} | ${r.source} | ${r.target || "（对不上，保持首页）"} |`),
  "",
].join("\n");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md);
console.log(`${matched}/${rows.length} listings matched → ${outPath}`);
for (const [h, s] of Object.entries(bySite)) console.log(`  ${h}: ${s.matched}/${s.total}`);
