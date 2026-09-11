#!/usr/bin/env node
/**
 * Puts the Spanish raya on Spanish rules instead of English ones.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS WRONG
 *
 * The Spanish side of this site was written well — idiomatic vocabulary, consistent
 * usted, real trade words like `palé` and `lineal` rather than calques. What it carried
 * over from the English was the PUNCTUATION habit, and that is what makes a page read as
 * translated to a Spanish reader even when every word is right.
 *
 * English sets an em dash with spaces around it:        the length — the little bar — turns
 * Spanish sets the raya tight against the text it encloses:  la longitud —la pletina— gira
 *
 * The RAE rule is that the raya attaches to the text of the inciso: a space on the
 * outside, none on the inside. Applied to a closing raya at the end of a clause, the
 * space goes before and nothing after.
 *
 * Measured on 2026-09-11: 107 English-spaced dashes across 17 of the 20 articles, against
 * 10 that were already correct. The client's complaint — 「很机翻很不本地化」 — was
 * accurate, and this is most of what produced it.
 *
 * ---------------------------------------------------------------------------
 * HOW THE TWO CASES ARE TOLD APART
 *
 * A dash is either half of a pair enclosing an inciso, or a single break introducing a
 * clause. The fix differs, so the sentence is counted first:
 *
 *   two dashes in the sentence   A — B — C   →   A —B— C     (pair: tighten inward)
 *   one dash in the sentence     A — B       →   A —B        (single: tighten right)
 *
 * Three or more in one sentence is not a shape this prose uses, and guessing which two
 * pair up would be exactly the kind of plausible-looking edit this repository refuses to
 * make elsewhere. Those are REPORTED, not changed.
 *
 * English text is never touched: ` — ` is correct there, and the two languages live in
 * the same JSON file, so the fields are selected by name rather than by scanning.
 *
 *   node scripts/fix-spanish-dashes.mjs           # dry run, shows before/after
 *   node scripts/fix-spanish-dashes.mjs --write
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const write = process.argv.includes("--write");

/** Split on sentence ends, keeping the delimiter with the sentence. */
const sentences = (text) => text.split(/(?<=[.!?…])\s+/);

const needsWork = (t) => / — /.test(t);

/**
 * Re-space the rayas in one string. Returns [fixed, skippedSentences].
 */
function fixDashes(text) {
  const skipped = [];
  const out = sentences(text).map((sentence) => {
    const n = (sentence.match(/ — /g) ?? []).length;
    if (n === 0) return sentence;

    if (n === 2) {
      /* Pair: the first raya closes up to the right, the second to the left. */
      let seen = 0;
      return sentence.replace(/ — /g, () => (seen++ === 0 ? " —" : "— "));
    }

    if (n === 1) {
      /* Single break: space before, none after. */
      return sentence.replace(/ — /, " —");
    }

    skipped.push(sentence.trim().slice(0, 90));
    return sentence;
  });
  return [out.join(" "), skipped];
}

/**
 * Field names on a news record that hold Spanish PROSE.
 *
 * `titleEs` and `seoTitleEs` are deliberately excluded. A dash in a title is not a raya
 * enclosing an inciso — it separates a title from its subtitle, and there the spaces are
 * correct in Spanish exactly as they are in English:
 *
 *   ANSI Grade 1 vs EN 1125 — Guía de selección antipánico      ✓ separator
 *   ANSI Grade 1 vs EN 1125 —Guía de selección antipánico       ✗ what the first draft did
 *
 * The first version of this script did not make that distinction and tightened the
 * titles too. Caught in the dry run, which is the reason the dry run prints before/after
 * rather than a count.
 */
const ES_FIELDS = ["summaryEs", "seoDescriptionEs"];
const ES_ARRAYS = ["bodyEs"];

let changed = 0;
let filesTouched = 0;
const skippedAll = [];
const samples = [];

/* ------------------------------------------------------------ news records */

const NEWS = "content/news";
for (const file of readdirSync(NEWS)) {
  if (!file.endsWith(".json")) continue;
  const path = join(NEWS, file);
  const record = JSON.parse(readFileSync(path, "utf8"));
  let touched = false;

  for (const field of ES_FIELDS) {
    if (typeof record[field] !== "string" || !needsWork(record[field])) continue;
    const [fixed, skipped] = fixDashes(record[field]);
    if (fixed !== record[field]) {
      if (samples.length < 4) samples.push([`${file} · ${field}`, record[field], fixed]);
      record[field] = fixed;
      changed += 1;
      touched = true;
    }
    skippedAll.push(...skipped.map((s) => `${file} · ${field}: ${s}`));
  }

  for (const field of ES_ARRAYS) {
    if (!Array.isArray(record[field])) continue;
    record[field] = record[field].map((paragraph, i) => {
      if (typeof paragraph !== "string" || !needsWork(paragraph)) return paragraph;
      const [fixed, skipped] = fixDashes(paragraph);
      skippedAll.push(...skipped.map((s) => `${file} · ${field}[${i}]: ${s}`));
      if (fixed !== paragraph) {
        if (samples.length < 4) samples.push([`${file} · ${field}[${i}]`, paragraph, fixed]);
        changed += 1;
        touched = true;
      }
      return fixed;
    });
  }

  /* heroImage.labelEs is prose too, and it is the caption a reader sees first. */
  if (record.heroImage?.labelEs && needsWork(record.heroImage.labelEs)) {
    const [fixed] = fixDashes(record.heroImage.labelEs);
    if (fixed !== record.heroImage.labelEs) {
      record.heroImage.labelEs = fixed;
      changed += 1;
      touched = true;
    }
  }

  if (touched) {
    filesTouched += 1;
    if (write) writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
  }
}

/* ------------------------------------------------------------ Spanish data modules */

/*
  home-es.ts and the Spanish glossary are TypeScript, so the strings are edited in place
  rather than through a parser. The replacement is anchored to the quoted string it sits
  in, which is safe here because ` — ` never appears in an identifier or a class name.
*/
const ES_MODULES = ["src/data/home-es.ts", "src/data/es-glossary.ts", "src/lib/spanish-product.ts"];
for (const path of ES_MODULES) {
  if (!existsSync(path)) continue;
  const source = readFileSync(path, "utf8");
  let touched = false;
  const next = source.replace(/"((?:[^"\\]|\\.)*)"/g, (whole, inner) => {
    if (!needsWork(inner)) return whole;
    /* Skip anything that is not Spanish prose — the file also holds English fallbacks. */
    if (!/[áéíóúñ¿¡]/.test(inner)) return whole;
    const [fixed] = fixDashes(inner);
    if (fixed === inner) return whole;
    changed += 1;
    touched = true;
    if (samples.length < 4) samples.push([path, inner, fixed]);
    return `"${fixed}"`;
  });
  if (touched) {
    filesTouched += 1;
    if (write) writeFileSync(path, next);
  }
}

/* ------------------------------------------------------------ report */

console.log(`strings re-spaced: ${changed}  across ${filesTouched} file(s)`);

if (samples.length) {
  console.log("\nsample:");
  for (const [where, before, after] of samples) {
    const i = before.indexOf(" — ");
    console.log(`\n  ${where}`);
    console.log(`    前: …${before.slice(Math.max(0, i - 42), i + 46)}…`);
    const j = after.indexOf("—");
    console.log(`    后: …${after.slice(Math.max(0, j - 43), j + 45)}…`);
  }
}

if (skippedAll.length) {
  console.log(`\n⚠ ${skippedAll.length} sentence(s) carry three or more dashes and were NOT changed.`);
  console.log("  Which two pair up is a judgement call, and guessing is how a plausible");
  console.log("  wrong edit gets shipped. Fix these by hand:");
  for (const s of skippedAll.slice(0, 8)) console.log(`    ${s}`);
}

if (!write) console.log("\n--write not given; nothing changed.");
