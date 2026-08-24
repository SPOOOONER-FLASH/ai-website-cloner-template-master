/**
 * Audits the built pages in out/ against what Google and Bing actually render.
 *
 * Reads the shipped HTML rather than the source metadata, because that is what a
 * crawler sees — a helper can look correct and still emit a title the template pushed
 * over the limit.
 *
 * Limits, and why these numbers:
 *   Title       Google truncates on pixel width (~600px desktop), which lands near 60
 *               characters for mixed-case Latin text; Bing allows a little more. Under
 *               30 usually means the page is leaving qualifiers on the table.
 *   Description Not a ranking factor, but a rewritten or truncated one costs clicks.
 *               Google shows ~155–160 characters, Bing ~160–170.
 *
 *   node scripts/audit-seo.mjs           # summary + the worst offenders
 *   node scripts/audit-seo.mjs --all     # every page
 *   node scripts/audit-seo.mjs --json    # machine-readable
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const OUT = "out";
const all = process.argv.includes("--all");
const asJson = process.argv.includes("--json");

const TITLE = { min: 30, good: 60, max: 65 };
const DESC = { min: 70, good: 155, max: 170 };

if (!existsSync(OUT)) {
  console.error(`No ${OUT}/ directory. Run \`npm run build\` first.`);
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (e === "index.html") acc.push(p);
  }
  return acc;
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));

const pick = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]).trim() : "";
};

const pages = walk(OUT).map((file) => {
  const html = readFileSync(file, "utf8");
  const url = "/" + path.relative(OUT, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  return {
    url,
    title: pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: pick(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
    canonical: pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i),
    ogTitle: pick(html, /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i),
    ogImage: pick(html, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i),
    hreflang: (html.match(/hreflang="/gi) || []).length,
    jsonLd: (html.match(/application\/ld\+json/g) || []).length,
    h1: (html.match(/<h1[\s>]/gi) || []).length,
  };
});

function flag(p) {
  const f = [];
  if (!p.title) f.push("no-title");
  else if (p.title.length > TITLE.max) f.push(`title-long(${p.title.length})`);
  else if (p.title.length < TITLE.min) f.push(`title-short(${p.title.length})`);
  if (!p.description) f.push("no-description");
  else if (p.description.length > DESC.max) f.push(`desc-long(${p.description.length})`);
  else if (p.description.length < DESC.min) f.push(`desc-short(${p.description.length})`);
  if (!p.canonical) f.push("no-canonical");
  if (!p.ogImage) f.push("no-og-image");
  if (p.h1 !== 1) f.push(`h1x${p.h1}`);
  return f;
}

const rows = pages.map((p) => ({ ...p, flags: flag(p) }));

if (asJson) {
  console.log(JSON.stringify(rows, null, 1));
  process.exit(0);
}

const tally = {};
rows.forEach((r) => r.flags.forEach((f) => {
  const key = f.replace(/\(\d+\)/, "");
  tally[key] = (tally[key] || 0) + 1;
}));

const len = (k) => rows.filter((r) => r[k]).map((r) => r[k].length).sort((a, b) => a - b);
const stat = (a) => a.length
  ? { min: a[0], p50: a[Math.floor(a.length / 2)], p90: a[Math.floor(a.length * 0.9)], max: a[a.length - 1] }
  : { min: 0, p50: 0, p90: 0, max: 0 };

console.log(`pages built: ${rows.length}`);
console.log(`  with JSON-LD: ${rows.filter((r) => r.jsonLd).length}`);
console.log(`  with hreflang: ${rows.filter((r) => r.hreflang).length}`);
console.log(`\ntitle length      ${JSON.stringify(stat(len("title")))}   target ${TITLE.min}–${TITLE.max}`);
console.log(`description length ${JSON.stringify(stat(len("description")))}   target ${DESC.min}–${DESC.max}`);

console.log("\nissues:");
Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${String(v).padStart(4)}  ${k}`));

const bad = rows.filter((r) => r.flags.length);
console.log(`\n${bad.length} of ${rows.length} pages have at least one issue.`);

const show = all ? bad : bad.slice(0, 25);
for (const r of show) {
  console.log(`\n${r.url}`);
  console.log(`  flags: ${r.flags.join(", ")}`);
  console.log(`  title(${r.title.length}): ${r.title}`);
  console.log(`  desc(${r.description.length}): ${r.description.slice(0, 180)}`);
}
if (!all && bad.length > show.length) console.log(`\n… ${bad.length - show.length} more. Re-run with --all.`);
