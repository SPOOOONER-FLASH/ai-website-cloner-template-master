#!/usr/bin/env node
/**
 * Does a glossary entry disagree with the Spanish/Portuguese already on the page?
 *
 * WHY THIS EXISTS. On 2026-09-24 four glossary keys were added by translating the English
 * label instead of reading what the records already said, and each one would have silently
 * replaced reviewed wording the next time the translator ran:
 *
 *     Case size        added "Medidas de la caja de cerradura"   records said "Medidas del cuerpo"
 *     Max door weight  added "Peso máximo de puerta"             records said "Peso máximo de hoja"
 *     Supplied with    added "Se suministra con"                 records said "Incluye"
 *     Case size (pt)   added "Dimensões da caixa da fechadura"   records said "Dimensões do corpo"
 *
 * Three were caught by reading a regeneration diff line by line, the fourth two hours later
 * in another language. That is not a repeatable way to catch it, which is what this is for.
 *
 * The rule the whole catalogue runs on is that a generator must not undo work it cannot see
 * (AGENTS.md, and the 2026-09-11 incident that reverted 830 spec rows). A missing key is
 * visible — the translator reports it. A key that is merely DIFFERENT from what review wrote
 * is invisible: the run is clean, the diff is large and boring, and reviewed wording is gone.
 *
 * So: for every English spec label that has a glossary entry, compare the entry against the
 * label text the records currently carry in that position. A mismatch is not automatically
 * wrong — the glossary may be the deliberate correction, as when the client's RAE decision
 * retired "picaporte" — so this reports rather than fails, and the reader decides which side
 * is right. What it removes is finding out by accident.
 *
 *   node scripts/audit-glossary-drift.mjs            report
 *   node scripts/audit-glossary-drift.mjs --check    exit 1 when anything drifts
 */
import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const DIR = "content/products";
const check = process.argv.includes("--check");
const url = (p) => pathToFileURL(`${process.cwd()}/${p}`).href;

const es = await import(url("src/data/es-glossary.ts"));
const pt = await import(url("src/data/pt-glossary.ts"));

/* RAYEN records are a different site's catalogue and a different lane; this audits HYDE. */
const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")))
  .filter((r) => !(Array.isArray(r.sites) ? r.sites : [r.sites]).includes("rayen"));

const LANGS = [
  { name: "es", labels: es.SPEC_LABELS_ES, field: "specsEs" },
  { name: "pt", labels: pt.SPEC_LABELS_PT, field: "specsPt" },
];

let drifted = 0;

for (const { name, labels, field } of LANGS) {
  /*
    Rows are matched by index, not by label: that is how the translator writes them, and it
    is the only pairing that survives a record whose English and translated tables were
    edited at different times. A length mismatch means the two tables are out of step for
    some other reason, and guessing a pairing there would invent the very disagreement this
    script is meant to find.
  */
  const seen = new Map();
  for (const record of products) {
    const english = record.specs ?? [];
    const translated = record[field] ?? [];
    if (!english.length || english.length !== translated.length) continue;

    for (let i = 0; i < english.length; i += 1) {
      const key = english[i]?.label;
      const onPage = translated[i]?.label;
      if (!key || !onPage) continue;
      if (!seen.has(key)) seen.set(key, new Map());
      const counts = seen.get(key);
      counts.set(onPage, (counts.get(onPage) ?? 0) + 1);
    }
  }

  const rows = [];
  for (const [key, counts] of seen) {
    const entry = labels[key];
    if (!entry) continue; // no entry: the translator already reports this one loudly
    for (const [onPage, count] of counts) {
      /* onPage === key means the row is still English, which is the reported case above. */
      if (onPage === key || onPage === entry) continue;
      rows.push({ key, entry, onPage, count });
    }
  }

  rows.sort((a, b) => b.count - a.count);
  drifted += rows.length;

  console.log(`\n${name}: ${rows.length} label(s) where the glossary and the page disagree`);
  for (const row of rows) {
    console.log(`  ${row.key}`);
    console.log(`     glossary : ${row.entry}`);
    console.log(`     on page  : ${row.onPage}   (${row.count} record${row.count === 1 ? "" : "s"})`);
  }
}

if (!drifted) console.log("\n✓ every glossary label matches the wording already on the page");

/*
  Second pass: two English VALUE keys that are the same term apart from punctuation or case,
  but carry different translations.

  Found on 2026-09-25. "Electroplating" and "Electroplating." differed by one full stop and
  had been given two different Spanish words — "Electrodeposición" on two records and review's
  "Galvanoplastia" on a third. One process, three products, two words, and nothing reported it:
  both keys were present, so the translator was silent and the first pass above was clean.

  Near-duplicate keys are the blind spot of an exact-match glossary. They do not drift over
  time, they are born apart, and they can only be seen by comparing keys to each other rather
  than to the records.
*/
const NORMAL = (s) => s.toLowerCase().replace(/[\s.,;:!?"'()·–—-]+/g, "");

for (const { name, values } of [
  { name: "es", values: es.SPEC_VALUES_ES },
  { name: "pt", values: pt.SPEC_VALUES_PT },
]) {
  const byShape = new Map();
  for (const [key, value] of Object.entries(values ?? {})) {
    const shape = NORMAL(key);
    if (!shape) continue;
    if (!byShape.has(shape)) byShape.set(shape, []);
    byShape.get(shape).push({ key, value });
  }

  /*
    Compare the translations by shape too. "Aluminum"/"aluminum" mapping to
    "Alumínio"/"alumínio" is the generator mirroring the English case, which is correct and
    not worth a line of output. Only a difference that survives normalisation is a real
    disagreement about WHICH WORDS to use.
  */
  const clashes = [...byShape.values()].filter(
    (group) => group.length > 1 && new Set(group.map((g) => NORMAL(g.value))).size > 1,
  );
  drifted += clashes.length;

  console.log(`\n${name}: ${clashes.length} near-duplicate value key(s) translated two ways`);
  for (const group of clashes) {
    for (const { key, value } of group) console.log(`  ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
    console.log("");
  }
}

if (check && drifted) {
  console.error(
    "\n✗ a glossary entry would overwrite reviewed wording on the next run.\n" +
      "  Decide which is right. If the glossary is the correction, regenerate those records\n" +
      "  with --only so the change is deliberate and its diff is small enough to read.",
  );
  process.exit(1);
}
