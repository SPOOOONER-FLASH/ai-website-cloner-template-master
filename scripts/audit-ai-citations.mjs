#!/usr/bin/env node
/**
 * Reads an AI citation export and says what earned the citations — and what did not.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS WORTH A SCRIPT
 *
 * The client sends a Bing "AI Page Stats" CSV every so often. Read once by eye it produces
 * an impression; read against the site it produces instructions. The 2026-09-18 export is
 * the first one big enough to argue with — 135 citations over 26 pages — and three of its
 * findings were invisible until the URLs were joined to the tree:
 *
 *   1. ARTICLES EARN 81%. Thirty-five articles took 110 citations; 519 product pages took
 *      13. The catalogue is what we sell and the articles are what gets quoted.
 *
 *   2. SPANISH EARNS 20% — and `/es/news/handing-left-right-and-universal/` took 17
 *      citations against its English twin's 6. A translated article is not a courtesy to
 *      the Spanish market, it is a separate citable asset that can outperform the original.
 *      Portuguese took 0, which is what a tree two days old looks like, and is the reason
 *      to keep the newsroom in three languages rather than one.
 *
 *   3. 11 CITATIONS POINT AT URLS THAT NO LONGER EXIST — www., index.php?aid=, Index.php.
 *      All of them still resolve through the redirect chain, which is the whole argument
 *      for keeping those rules alive: an engine that learned a URL in 2023 is still
 *      sending readers down it in 2026.
 *
 * Every number above is re-derived by running this. Nothing here is typed.
 *
 * Usage:
 *   node scripts/audit-ai-citations.mjs <export.csv>
 *   node scripts/audit-ai-citations.mjs <export.csv> --check   # fail if a cited URL 404s
 *
 * `--check` makes live requests, one per cited URL, and is the only part that touches the
 * network. Without it the script is pure file reading.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const file = process.argv[2];
const CHECK = process.argv.includes("--check");

if (!file || !existsSync(file)) {
  console.error("Usage: node scripts/audit-ai-citations.mjs <export.csv> [--check]");
  console.error("The CSV is Bing Webmaster Tools → AI Page Stats → export.");
  process.exit(1);
}

/* The export is two columns and quotes everything, including the count. */
const rows = readFileSync(file, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.match(/^"?(.*?)"?,"?(\d+)"?$/))
  .filter(Boolean)
  .map((match) => ({ url: match[1], citations: Number(match[2]) }))
  .filter((row) => row.url.startsWith("http"));

const total = rows.reduce((sum, row) => sum + row.citations, 0);

/** The route a cited URL points at, with the host and any locale prefix separated out. */
function classify(url) {
  const parsed = new URL(url);
  const legacy = parsed.hostname.startsWith("www.") || /index\.php/i.test(parsed.pathname);
  const segments = parsed.pathname.split("/").filter(Boolean);
  const locale = segments[0] === "es" || segments[0] === "pt" ? segments[0] : "en";
  const rest = locale === "en" ? segments : segments.slice(1);
  const section = rest[0] ?? "(home)";
  return { legacy, locale, section, path: parsed.pathname };
}

const byLocale = new Map();
const bySection = new Map();
let legacyCitations = 0;

for (const row of rows) {
  const { legacy, locale, section } = classify(row.url);
  if (legacy) legacyCitations += row.citations;
  byLocale.set(locale, (byLocale.get(locale) ?? 0) + row.citations);
  bySection.set(section, (bySection.get(section) ?? 0) + row.citations);
}

const share = (n) => `${((n / total) * 100).toFixed(0)}%`.padStart(4);

console.log(`AI citations — ${rows.length} pages, ${total} citations\n`);

console.log("by language");
for (const [locale, n] of [...byLocale.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${locale.padEnd(4)} ${String(n).padStart(4)}  ${share(n)}`);
}

console.log("\nby section");
for (const [section, n] of [...bySection.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${section.padEnd(18)} ${String(n).padStart(4)}  ${share(n)}`);
}

console.log(
  `\nretired URLs (www. or index.php)  ${String(legacyCitations).padStart(4)}  ${share(legacyCitations)}`,
);
console.log("  Those depend on deploy/nginx/legacy-redirects.conf being installed.");

/* ------------------------------------------------------- the translated twins ----- */

/**
 * An article that earns citations in one language is a candidate in the others.
 *
 * Reported as pairs rather than as a score, because the useful question is not "is
 * Spanish good" but "this exact page earned 17 there and 6 here — why".
 */
const articles = new Map();
for (const row of rows) {
  const { locale, section, path } = classify(row.url);
  if (section !== "news") continue;
  const slug = path.replace(/^\/(es|pt)/, "").replace(/\/$/, "");
  if (!articles.has(slug)) articles.set(slug, { en: 0, es: 0, pt: 0 });
  articles.get(slug)[locale] += row.citations;
}

if (articles.size) {
  console.log("\narticles, by language (citations)\n");
  console.log(`  ${"EN".padStart(4)} ${"ES".padStart(4)} ${"PT".padStart(4)}  article`);
  const ranked = [...articles.entries()].sort(
    (a, b) => b[1].en + b[1].es + b[1].pt - (a[1].en + a[1].es + a[1].pt),
  );
  for (const [slug, counts] of ranked) {
    console.log(
      `  ${String(counts.en).padStart(4)} ${String(counts.es).padStart(4)} ` +
        `${String(counts.pt).padStart(4)}  ${slug.replace("/news/", "")}`,
    );
  }
}

/* ------------------------------------------------------- do they still resolve? --- */

if (CHECK) {
  console.log("\nchecking every cited URL at the origin…\n");
  let broken = 0;
  for (const row of rows) {
    let status = "ERR";
    try {
      const response = await fetch(row.url, { redirect: "follow" });
      status = String(response.status);
      if (!response.ok) broken += 1;
    } catch {
      broken += 1;
    }
    const flag = status === "200" ? "  " : "!!";
    console.log(`  ${flag} ${status}  ${String(row.citations).padStart(3)}  ${row.url}`);
  }
  if (broken) {
    console.error(
      `\n${broken} cited URL(s) do not return 200. A citation that lands on an error is ` +
        `worse than no citation: the engine keeps the reference and the reader gets nothing.`,
    );
    process.exit(1);
  }
  console.log("\nEvery cited URL resolves.");
}

/* ------------------------------------------------------- what is not cited -------- */

const cited = new Set(
  rows.map((row) => classify(row.url).path.replace(/^\/(es|pt)/, "").replace(/\/$/, "")),
);
const newsDir = "content/news";
if (existsSync(newsDir)) {
  const { readdirSync } = await import("node:fs");
  const uncited = readdirSync(newsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(join(newsDir, name), "utf8")))
    .filter((article) => !cited.has(`/news/${article.slug}`))
    .map((article) => article.slug);

  if (uncited.length) {
    console.log(`\n${uncited.length} published article(s) with no citation yet:\n`);
    for (const slug of uncited) console.log(`  ${slug}`);
    console.log(
      "\nNot a defect — most of these are recent. It is the list to compare against the\n" +
        "next export, because an article that stays here for months is answering a question\n" +
        "nobody asks.",
    );
  }
}
