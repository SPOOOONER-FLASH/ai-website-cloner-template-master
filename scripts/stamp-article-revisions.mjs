#!/usr/bin/env node
/**
 * Stamps `updatedAt` on an article whose READER-FACING text changed (client 2026-09-28:
 * 「文章修改后要更新最后修改日期……Discover 会看内容新不新」).
 *
 * The rule is "changed what a reader reads", not "the file was touched". A git-log date
 * would move all 82 articles the day someone adds a field to every file, and a
 * dateModified that jumps without the page changing is the freshness manipulation
 * Google's guidance warns about. So this hashes only the text a reader sees — title,
 * summary, body, FAQ and HowTo, in English, Spanish and Portuguese — and compares with
 * src/data/article-revisions.json:
 *
 *   hash matches          → nothing to do
 *   no entry (new article)→ record the hash; updatedAt stays absent (= publishedAt)
 *   hash differs          → updatedAt = today, record the new hash
 *
 * SEO titles and descriptions are left out on purpose: retuning a <title> is not a new
 * version of the article.
 *
 *   node scripts/stamp-article-revisions.mjs           write (part of `npm run content`)
 *   node scripts/stamp-article-revisions.mjs --check   exit 1 if an edit was not stamped
 *   --today=YYYY-MM-DD                                  override today's date (tests)
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MANIFEST = "src/data/article-revisions.json";
const SECTIONS = ["guides", "news"];
const FIELDS = ["title", "summary", "body", "faq", "howTo"];
const TEXT_FIELDS = FIELDS.flatMap((f) => (f === "howTo" ? [f] : [f, `${f}Es`, `${f}Pt`]));

const check = process.argv.includes("--check");
const todayArg = process.argv.find((a) => a.startsWith("--today="));
const today = todayArg ? todayArg.slice(8) : new Date().toISOString().slice(0, 10);

export function revisionHash(article) {
  const text = Object.fromEntries(TEXT_FIELDS.filter((f) => article[f] !== undefined).map((f) => [f, article[f]]));
  return createHash("sha256").update(JSON.stringify(text)).digest("hex").slice(0, 16);
}

/** Put updatedAt directly after publishedAt so the JSON reads in date order. */
function withUpdatedAt(article, date) {
  const out = {};
  for (const [k, v] of Object.entries(article)) {
    if (k === "updatedAt") continue;
    out[k] = v;
    if (k === "publishedAt") out.updatedAt = date;
  }
  return out;
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const next = {};
const stale = [];
let stamped = 0;

for (const section of SECTIONS) {
  const dir = join("content", section);
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    const path = join(dir, file);
    const article = JSON.parse(readFileSync(path, "utf8"));
    const key = `${section}/${article.slug}`;
    const hash = revisionHash(article);
    next[key] = hash;
    if (!(key in manifest) || manifest[key] === hash) continue;
    stale.push(key);
    if (check) continue;
    /* Never before publication: an edit to a scheduled draft is not an update. */
    if (today > article.publishedAt) {
      writeFileSync(path, `${JSON.stringify(withUpdatedAt(article, today), null, 2)}\n`);
      stamped += 1;
    }
  }
}

const unrecorded = Object.keys(next).filter((k) => !(k in manifest));
const removed = Object.keys(manifest).filter((k) => !(k in next));

if (check) {
  if (stale.length || unrecorded.length || removed.length) {
    for (const k of stale) console.error(`  changed without a revision stamp: ${k}`);
    for (const k of unrecorded) console.error(`  not yet recorded: ${k}`);
    for (const k of removed) console.error(`  recorded but gone: ${k}`);
    console.error("❌ article revisions are stale — run: npm run content");
    process.exit(1);
  }
  console.log(`article revisions current (${Object.keys(next).length} articles)`);
} else {
  const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
  writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`article revisions: ${stamped} stamped ${today}, ${unrecorded.length} new recorded, ${Object.keys(next).length} total`);
}
