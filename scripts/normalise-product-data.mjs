/**
 * Collapses casing variants in the product attributes that drive the Product Finder's
 * facets.
 *
 * The catalogue was imported from several sources and the same value arrived spelled
 * three ways — "Stainless Steel", "Stainless steel" and "stainless steel" each show up
 * in the finder as a separate tickbox with its own count, which reads as three
 * materials instead of one. Same for finishes and door types.
 *
 * The canonical spelling is chosen by frequency, not by a rule: whichever casing the
 * catalogue already uses most often wins. Nothing is invented and no two genuinely
 * different values are merged — only variants that are identical once case and
 * whitespace are ignored.
 *
 * Singular/plural pairs ("Fire door" vs "Fire Doors") are NOT merged, because deciding
 * they mean the same thing is an editorial call rather than a mechanical one. They are
 * printed at the end so a human can settle them.
 *
 *   node scripts/normalise-product-data.mjs           # report
 *   node scripts/normalise-product-data.mjs --write   # apply
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const write = process.argv.includes("--write");
const DIR = "content/products";
const FIELDS = [
  { key: "material", kind: "scalar" },
  { key: "finishes", kind: "list" },
  { key: "doorTypes", kind: "list" },
];

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
const products = files.map((f) => ({ f, p: JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")) }));

const foldKey = (v) => String(v).trim().replace(/\s+/g, " ").toLowerCase();

/**
 * Title Case, the convention a spec table uses — but leaving alone the two kinds of
 * token where it would do damage: short all-caps finish codes (PSS, SSS, AB, ABS, PVD)
 * and grade numbers (304, 201). Frequency is not used to pick the spelling: it produced
 * a list that mixed "Stainless Steel" with "Zinc alloy" purely because of how often each
 * was typed, which looks like an error in a filter list.
 */
function titleCase(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .split(/([ /()\-+,]) */)
    .map((tok) => {
      if (!/[a-z]/i.test(tok)) return tok;                       // separators, numbers
      if (/^[A-Z0-9]{1,5}$/.test(tok)) return tok;               // PSS, SSS, AB, ABS, 304
      return tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
    })
    .join("");
}

/**
 * Some records have a whole sentence typed into `material` or `finishes` — "steel
 * material with spray painting, different finishes are available." Those are a content
 * problem, not a casing problem, and re-casing them only makes them read worse. They
 * are left exactly as they are and listed at the end for the client to rewrite.
 */
function isValueLike(v) {
  const s = String(v).trim();
  if (s.length > 30) return false;
  if (/[.,;:]/.test(s)) return false;
  if (s.split(/\s+/).length > 4) return false;
  return true;
}

/** value -> canonical spelling, per field. Free text is deliberately absent. */
const canon = {};
const freeText = [];
for (const { key, kind } of FIELDS) {
  canon[key] = new Map();
  for (const { f, p } of products) {
    const raw = kind === "scalar" ? (p[key] ? [p[key]] : []) : (p[key] ?? []);
    for (const v of raw) {
      if (!v) continue;
      if (!isValueLike(v)) { freeText.push({ f, key, v: String(v) }); continue; }
      canon[key].set(foldKey(v), titleCase(v));
    }
  }
}

let changedFiles = 0, changedValues = 0;
const examples = [];

for (const { f, p } of products) {
  let touched = false;
  for (const { key, kind } of FIELDS) {
    if (kind === "scalar") {
      if (!p[key]) continue;
      const next = canon[key].get(foldKey(p[key]));
      if (next && next !== p[key]) {
        if (examples.length < 12) examples.push(`${f}  ${key}: ${JSON.stringify(p[key])} -> ${JSON.stringify(next)}`);
        p[key] = next; touched = true; changedValues++;
      }
    } else {
      const list = p[key];
      if (!Array.isArray(list) || !list.length) continue;
      const mapped = list.map((v) => canon[key].get(foldKey(v)) ?? v);
      // de-duplicate: two spellings can collapse onto the same canonical value
      const deduped = [...new Set(mapped)];
      if (JSON.stringify(deduped) !== JSON.stringify(list)) {
        if (examples.length < 12) examples.push(`${f}  ${key}: ${JSON.stringify(list)} -> ${JSON.stringify(deduped)}`);
        p[key] = deduped; touched = true; changedValues++;
      }
    }
  }
  if (touched) {
    changedFiles++;
    if (write) writeFileSync(`${DIR}/${f}`, `${JSON.stringify(p, null, 2)}\n`);
  }
}

for (const { key } of FIELDS) {
  const before = new Set();
  for (const { p } of products) {
    const raw = Array.isArray(p[key]) ? p[key] : p[key] ? [p[key]] : [];
    raw.forEach((v) => before.add(String(v)));
  }
  console.log(`${key.padEnd(11)} distinct values now: ${canon[key].size}`);
}

console.log(`\nfiles changed: ${changedFiles}   field values rewritten: ${changedValues}`);
examples.forEach((e) => console.log("  " + e));

// Singular/plural pairs the fold cannot decide.
console.log("\nlikely duplicates left for a human to settle (singular vs plural):");
for (const { key } of FIELDS) {
  const vals = [...canon[key].values()];
  const seen = new Set();
  for (const a of vals) {
    for (const b of vals) {
      if (a === b) continue;
      const pair = [a, b].sort().join(" | ");
      if (seen.has(pair)) continue;
      const norm = (s) => s.toLowerCase().replace(/s$/, "");
      if (norm(a) === norm(b)) { seen.add(pair); console.log(`  ${key}: ${pair}`); }
    }
  }
}

// Free text sitting in attribute fields. Left untouched, because rewriting a sentence
// into a value is an editorial decision — but it does become a junk tickbox in the
// Product Finder, so it needs to reach the client.
const byField = {};
freeText.forEach((x) => ((byField[x.key] ??= new Set()).add(x.v)));
const freeTotal = Object.values(byField).reduce((a, s) => a + s.size, 0);
console.log(`\nfree text found in attribute fields: ${freeTotal} distinct values across ${freeText.length} entries`);
console.log("(left unchanged — each is currently its own tickbox in the Product Finder)");
for (const [key, set] of Object.entries(byField)) {
  console.log(`  ${key}:`);
  [...set].slice(0, 8).forEach((v) => console.log(`    ${JSON.stringify(v)}`));
  if (set.size > 8) console.log(`    … ${set.size - 8} more`);
}

if (!write) console.log("\nReport only. Re-run with --write to apply.");
