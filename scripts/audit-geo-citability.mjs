#!/usr/bin/env node
/**
 * Scores how quotable this site's pages are to an answer engine.
 *
 * The rubric is the geo-citability skill's, applied to the built export rather than by
 * fetching pages one at a time — 1019 pages is past the point where a 50-page sample
 * tells you about the site, and the export is on disk anyway.
 *
 * WHAT MAKES A PASSAGE CITABLE, and why each of these is measured:
 *
 *   A SELF-CONTAINED ANSWER. An assistant quotes a passage out of its page. "It depends
 *   on the model" is useless once separated from the question above it; "Most models fall
 *   between 300 and 5,000 pieces" survives the trip. Measured as: does the page contain
 *   sentences carrying a concrete figure with its unit.
 *
 *   SPECIFIC NUMBERS. A number is the single strongest citation signal, because it is the
 *   thing a generated answer cannot invent safely and therefore has to attribute.
 *
 *   A QUESTION THE READER ASKED. Content shaped as a question and an answer maps directly
 *   onto how these systems are queried. FAQ markup makes that machine-legible.
 *
 *   AN ENTITY THAT CAN BE RESOLVED. A page that never names the company, the model number
 *   or the standard it implements gives the model nothing to attach the claim to.
 *
 *   HEDGING COSTS CITATIONS. "May", "can be", "typically", "up to" — a sentence that does
 *   not commit is a sentence an answer engine will not repeat, because repeating it makes
 *   the answer wrong in a way the model gets blamed for.
 *
 * Reported per page-type, because the answer for a product page and a news article is
 * different and averaging them hides both.
 *
 * Usage: node scripts/audit-geo-citability.mjs [--json] [--worst 15]
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
if (!existsSync(OUT)) {
  console.error("out/ not found — run npm run build first.");
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "_next" || entry === "admin") continue;
      walk(full, acc);
    } else if (entry.endsWith(".html")) acc.push(full);
  }
  return acc;
}

const visible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/** A figure with a unit, a standard, or a model number — the things worth quoting. */
const CONCRETE =
  /\b\d[\d.,]*\s?(?:mm|cm|m|kg|g|pieces?|pcs|days?|weeks?|months?|years?|hours?|%|°|×|x)\b|\bEN\s?1\d{3,4}\b|\bISO\s?\d{4}\b|\b\d{3,4}\s?(?:SS|ET|PS|MB)\b/i;
/*
  "can be" was in this list and it was the wrong call.

  It fired on all four flagged sentences on /configurator, and every one of them is a
  capability, not a hedge: "a lever can be opened with an elbow or a closed fist, which a
  knob cannot"; "lets the door open a few centimetres on a restrictor, so a caller can be
  spoken to". Those sentences are the reason an architect specifies a lever over a knob.
  Acting on the score would have meant rewriting correct, useful copy to satisfy an
  instrument — which is the failure mode this measure exists to catch, aimed at the wrong
  target.

  The remaining terms all mark genuine uncertainty about a value. "can be" marks what a
  product is able to do, and a hardware catalogue is largely made of those.

  Note for whoever reads the configurator's score next: removing this term lifts that page
  from 33 to 45, and the page still has ZERO concrete figures. That, not the wording, is
  what is actually wrong with it.
*/
const HEDGE = /\b(?:may|might|could|typically|generally|usually|up to|around|approximately)\b/i;
const ENTITY = /\b(?:Canton Hyland|HYDE|Zhongshan|Guangdong)\b/;

const groups = new Map();

for (const file of walk(OUT)) {
  const html = readFileSync(file, "utf8");
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) continue;

  const route = `/${relative(OUT, file).split(sep).join("/")}`.replace(/index\.html$/, "");
  const text = visible(html);
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 25);

  /*
    COUNT THE FIGURES, NOT THE SENTENCES CONTAINING THEM.

    The first version counted sentences matching CONCRETE, and it reported the comparison
    pages as the least quotable on the site — 1.3 figures each. They are spec tables. The
    deadbolt table holds twenty `mm` measurements; a table has no sentence-ending
    punctuation, so the whole thing collapsed into one 1,180-character "sentence" and
    scored 1.

    That was the instrument, not the page, and a report built on it would have sent
    somebody to rewrite the best-evidenced pages on the site. Counting matches directly is
    what the measure was always trying to express.
  */
  const concrete = text.match(new RegExp(CONCRETE.source, "gi")) ?? [];
  const hedged = sentences.filter((s) => HEDGE.test(s));
  const schemaTypes = new Set(
    [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]),
  );

  /*
    Scored out of 100 and deliberately blunt: this is a comparative instrument for
    finding the weakest page types, not a number to quote at anyone.
  */
  let score = 0;
  // Concrete, quotable sentences — the largest single component.
  score += Math.min(40, concrete.length * 3);
  // Enough substance to be worth extracting from at all.
  score += Math.min(20, Math.floor(sentences.length / 4) * 5);
  // Question-shaped content an assistant can map a query onto.
  if (schemaTypes.has("Question") || schemaTypes.has("FAQPage")) score += 15;
  // A resolvable entity to attach the claim to.
  if (ENTITY.test(text)) score += 15;
  // Structured data at all.
  if (schemaTypes.size) score += 10;
  // Hedging is subtracted, capped so one cautious sentence is not fatal.
  score -= Math.min(20, hedged.length * 3);
  score = Math.max(0, Math.min(100, score));

  const kind = route.startsWith("/es/")
    ? `es${route.replace("/es", "").split("/")[1] ? `/${route.replace("/es", "").split("/")[1]}` : ""}`
    : `/${route.split("/")[1] ?? ""}`;

  if (!groups.has(kind)) groups.set(kind, []);
  groups.get(kind).push({ route, score, concrete: concrete.length, hedged: hedged.length, sentences: sentences.length });
}

const all = [...groups.values()].flat();
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

const rows = [...groups.entries()]
  .map(([kind, pages]) => ({
    kind: kind || "/",
    pages: pages.length,
    score: Math.round(mean(pages.map((p) => p.score))),
    concrete: (mean(pages.map((p) => p.concrete))).toFixed(1),
    hedged: (mean(pages.map((p) => p.hedged))).toFixed(1),
  }))
  .sort((a, b) => a.score - b.score);

const overall = Math.round(mean(all.map((p) => p.score)));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ overall, rows }, null, 2));
  process.exit(0);
}

console.log(`AI citability — ${all.length} indexable pages\n`);
console.log(`overall: ${overall}/100\n`);
const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("page type", 26)}${pad("pages", 7)}${pad("score", 7)}${pad("concrete", 10)}hedged`);
console.log("-".repeat(60));
for (const r of rows) {
  console.log(`${pad(r.kind, 26)}${pad(r.pages, 7)}${pad(r.score, 7)}${pad(r.concrete, 10)}${r.hedged}`);
}

const worstFlag = process.argv.indexOf("--worst");
const worstN = worstFlag > -1 ? Number(process.argv[worstFlag + 1]) : 10;
console.log(`\nleast quotable pages:`);
for (const p of all.sort((a, b) => a.score - b.score).slice(0, worstN)) {
  console.log(`  ${String(p.score).padStart(3)}  ${p.route}  (${p.concrete} concrete, ${p.sentences} sentences)`);
}
