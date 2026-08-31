/**
 * Recovers the stahlock rows the first pass threw away as "category mismatch".
 *
 * WHAT THE FIRST PASS MISSED. kimi's mapping compared stahlock's category string against
 * ours and rejected 73 pairs where they differed. Most of those are not mismatches at
 * all — stahlock and this catalogue simply divide the same families at different depths:
 *
 *   stahlock "Hardware Accessories"  is our hardware-accessories/door-viewers,
 *                                    /latches, /door-stoppers, /door-flush-bolts …
 *   stahlock "Push Bar"              is our panic-exit-devices/fire-door, /alarmed …
 *   stahlock "Trim Handle"           is the exterior trim of a panic exit device
 *
 * Rejecting those cost real data. stahlock's page for model 305 carries Material, Finish
 * and Length; our 305 had two spec rows.
 *
 * SO THE GATE IS REPLACED, NOT REMOVED. `FAMILIES` below says which stahlock category may
 * supply which of our category prefixes. A pair still has to pass it — the point is that
 * a parent and its own child are the same family, while two different families are not.
 * The pairs it still refuses are listed at the end for a human to look at.
 *
 * ⚠ The certification rule is unchanged and matters here more than anywhere: stahlock's
 * 305 page reads "Certification: EN1205 compliant". There is no EN 1205 — it is a typo
 * for EN 1125, on a storefront, for a model no report of ours covers. Every row that
 * reaches for a standard is dropped, as in stahlock-cited.mjs.
 *
 *   node scripts/stahlock-second-pass.mjs --fetch   # download into tmp/ (cached)
 *   node scripts/stahlock-second-pass.mjs --dry     # report what would be written
 *   node scripts/stahlock-second-pass.mjs           # apply
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const DIR = "content/products";
const MISMATCH = "docs/collaboration/reviews/2026-08-29-kimi-seo-stahlock/stahlock_category_mismatch.csv";
const CACHE = "tmp/claude-stahlock-pass2";
const FETCH = process.argv.includes("--fetch");
const DRY = process.argv.includes("--dry");

/**
 * stahlock category -> the cantonlock category prefixes it is allowed to supply.
 *
 * Read as "this stahlock section covers that part of our tree". Anything not listed is
 * refused, which is why F101 (ours: glass door patch fitting, stahlock: night latch)
 * stays out — that pair is two different products sharing a number, exactly the failure
 * the original gate existed to prevent.
 */
const FAMILIES = {
  "Push Bar": ["panic-exit-devices"],
  "Trim Handle": ["panic-exit-devices"],
  "Profile Lock Case": ["panic-exit-devices", "lock-cases"],
  "Fire Door Coordinator": ["panic-exit-devices"],
  "Fire Hinge": ["panic-exit-devices", "brass-steel-hinges", "door-hinges"],
  "Hardware Accessories": ["hardware-accessories"],
  "Washroom Accessories": ["bathroom-accessories"],
};

/** A claim that needs a certificate naming the model, which a storefront is not. */
const CERTIFICATION = /(standard|certif|EN\s?1\d{3}|ANSI|BHMA|CE\b|fire[\s-]?rated|UL\b)/i;

/** stahlock's field names, mapped onto the vocabulary this catalogue already uses. */
const LABEL_ALIASES = {
  "Door Thickness": "Door thickness",
  "Center distance": "Centre distance",
  "Lock Body Material": "Material",
  "Body Material": "Material",
  "Out case material": "Material",
  "Latch Bolt": "Latch",
  "Finish Options": "Finish",
  "Cylinder Options": "Cylinder",
  "Key Options": "Key options",
  Keys: "Key options",
  Usage: "Application",
  "Suitable Doors": "Application",
  "Door Compatibility": "Application",
  "Model Size": "Size",
  "Door Handing": "Handing",
  "Inner structure": "Chassis",
  Type: "Type",
};

/** Page furniture that sits in the same block as the spec lines. */
const NOT_A_SPEC = /^(Category|Product Features|Let's Talk|Contact Us|Our Service|Related Products|STAHLOCK MODEL)/i;

const rows = readFileSync(MISMATCH, "utf8")
  .split("\n")
  .slice(1)
  .filter(Boolean)
  .map((line) => {
    const [slug, model, id, url, sModel, sCat] = line.split(",");
    return { slug, model, id, url, sModel, sCat: (sCat ?? "").trim() };
  });

const products = Object.fromEntries(
  readdirSync(DIR).map((f) => {
    const p = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));
    return [p.slug, { file: f, product: p }];
  }),
);

const approved = [];
const refused = [];
for (const row of rows) {
  const entry = products[row.slug];
  if (!entry) continue;
  const ours = entry.product.categoryPath.join("/");
  const allowed = FAMILIES[row.sCat] ?? [];
  if (allowed.some((prefix) => ours === prefix || ours.startsWith(`${prefix}/`))) approved.push(row);
  else refused.push({ ...row, ours });
}

console.log(`mismatch pairs      : ${rows.length}`);
console.log(`same family, allowed: ${approved.length}`);
console.log(`still refused       : ${refused.length}`);

if (FETCH) {
  mkdirSync(CACHE, { recursive: true });
  let got = 0;
  for (const row of approved) {
    const file = `${CACHE}/${row.id}.html`;
    if (existsSync(file)) continue;
    try {
      execFileSync("curl", ["-s", "-m", "30", row.url, "-o", file], { stdio: "ignore" });
      got += 1;
    } catch {
      console.log(`  fetch failed: ${row.url}`);
    }
  }
  console.log(`fetched ${got} new pages into ${CACHE}`);
}

/** The detail page prints `Label: Value` lines between the model heading and Features. */
function parseSpecs(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const start = text.findIndex((l) => /^STAHLOCK MODEL/i.test(l));
  const end = text.findIndex((l, i) => i > start && /^Product Features/i.test(l));
  if (start < 0) return [];

  const out = [];
  for (const line of text.slice(start + 1, end > start ? end : start + 25)) {
    if (NOT_A_SPEC.test(line)) continue;
    const hit = /^([A-Za-z][A-Za-z &/-]{1,30}):\s*(.+)$/.exec(line);
    if (!hit) continue;
    out.push({ label: (LABEL_ALIASES[hit[1].trim()] ?? hit[1].trim()), value: hit[2].trim() });
  }
  return out;
}

let updated = 0;
let added = 0;
let droppedCert = 0;
let noPage = 0;
const samples = [];

for (const row of approved) {
  const file = `${CACHE}/${row.id}.html`;
  if (!existsSync(file)) {
    noPage += 1;
    continue;
  }
  const entry = products[row.slug];
  const specs = [...(entry.product.specs ?? [])];
  const before = specs.length;

  for (const spec of parseSpecs(readFileSync(file, "utf8"))) {
    if (CERTIFICATION.test(spec.label) || CERTIFICATION.test(spec.value)) {
      droppedCert += 1;
      continue;
    }
    if (specs.some((s) => s.label.toLowerCase() === spec.label.toLowerCase())) continue;
    specs.push(spec);
    if (samples.length < 14) samples.push(`${entry.product.model} · ${spec.label} = ${spec.value}`);
  }

  if (specs.length === before) continue;
  entry.product.specs = specs;
  added += specs.length - before;
  updated += 1;
  if (!DRY && !FETCH) writeFileSync(`${DIR}/${entry.file}`, `${JSON.stringify(entry.product, null, 2)}\n`);
}

console.log(`\npages missing from cache : ${noPage}${noPage ? " — run with --fetch" : ""}`);
console.log(`certification rows dropped: ${droppedCert}`);
console.log(`products updated          : ${updated}`);
console.log(`rows added                : ${added}`);
if (samples.length) console.log(`\nsample:\n  ${samples.join("\n  ")}`);
if (refused.length) {
  console.log(`\nstill refused — different families, for a human to judge:`);
  for (const r of refused) console.log(`  ${r.model.padEnd(16)} ours: ${r.ours.padEnd(46)} stahlock: ${r.sCat}`);
}
if (DRY) console.log("\nDry run. Re-run without --dry to apply.");
