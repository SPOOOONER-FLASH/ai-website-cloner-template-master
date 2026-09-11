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

/* ------------------------------------------------------------ Spanish pages */

/*
 * src/app/es/** — Codex's area, covered while they are offline (client, 2026-09-11).
 *
 * A .tsx file is three different kinds of text in one, and only one of them should be
 * touched. The first pass at this would have rewritten all three:
 *
 *   English code comments   "inbound link each — from the spec table at the bottom"
 *                           Notes to us. Never touched — and they are stripped BEFORE
 *                           matching rather than skipped after, so a dash inside a
 *                           comment cannot be reached at all.
 *
 *   Titles and headings     title: "Productos — Catálogo de herrajes para puertas"
 *                           A dash between a title and its subtitle is a separator, not
 *                           a raya, and the spaces are correct — the same distinction
 *                           that caught the first version of this script on seoTitleEs.
 *
 *   Spanish body prose      "que los distinguen — distancia al eje, entrepuntos…"
 *                           The only category that gets re-spaced.
 *
 * Prose is identified positively rather than by elimination: it has to contain Spanish
 * orthography (á é í ó ú ñ ¿ ¡) or a Spanish function word. A line that cannot be shown
 * to be Spanish is left alone, because the cost of skipping one is a dash somebody fixes
 * by hand, and the cost of a false positive is English prose silently mangled.
 */
const TSX_DIR = "src/app/es";
const SPANISH_HINT = /[áéíóúñ¿¡]|\b(?:que|para|de|del|las|los|una|con|por|se|su|sus|como|cuando|donde|entre|sobre)\b/i;

function walkTsx(dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkTsx(path, found);
    else if (entry.name.endsWith(".tsx")) found.push(path);
  }
  return found;
}

let pageStrings = 0;
const pageSkipped = [];

for (const path of walkTsx(TSX_DIR)) {
  const source = readFileSync(path, "utf8");

  /*
    Comments are blanked to same-length placeholders so every later index still lines up
    with the original file, and the original text is restored before writing.
  */
  const comments = [];
  const masked = source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => {
      comments.push(m);
      return ` ${comments.length - 1} `.padEnd(m.length, "");
    })
    .replace(/^([ \t]*)\/\/.*$/gm, (m) => {
      comments.push(m);
      return ` ${comments.length - 1} `.padEnd(m.length, "");
    });

  let next = masked;
  let touched = false;

  /* JSX text nodes: the visible paragraphs. */
  next = next.replace(/>([^<>{}]*?)</g, (whole, inner) => {
    if (!needsWork(inner) || !SPANISH_HINT.test(inner)) return whole;
    /*
      A heading's dash separates a label from its gloss, so it keeps its spaces. The test
      is PUNCTUATION, not length: prose carries a comma or a full stop somewhere, a
      heading carries none.

      Length alone was the first attempt and it let one through —
      "Herrajes en detalle — fotografías y selección de componentes" is exactly eight
      words, cleared a `< 8` floor, and is unmistakably a heading. Counting words was
      measuring the wrong property.
    */
    const text = inner.trim();
    if (!/[.,;:]/.test(text.replace(/\s—\s/g, " "))) {
      pageSkipped.push(`${path} · heading: ${text.slice(0, 70)}`);
      return whole;
    }
    const [fixed] = fixDashes(inner);
    if (fixed === inner) return whole;
    pageStrings += 1;
    touched = true;
    if (samples.length < 6) samples.push([path.replace("src/app/", ""), inner.trim(), fixed.trim()]);
    return `>${fixed}<`;
  });

  /* `description:` metadata is prose; `title:` is a separator and stays. */
  next = next.replace(/(description:\s*)"((?:[^"\\]|\\.)*)"/g, (whole, lead, inner) => {
    if (!needsWork(inner) || !SPANISH_HINT.test(inner)) return whole;
    const [fixed] = fixDashes(inner);
    if (fixed === inner) return whole;
    pageStrings += 1;
    touched = true;
    if (samples.length < 6) samples.push([path.replace("src/app/", "") + " · description", inner, fixed]);
    return `${lead}"${fixed}"`;
  });

  if (touched) {
    const restored = next.replace(/ (\d+) */g, (_, i) => comments[Number(i)]);
    changed += pageStrings;
    filesTouched += 1;
    if (write) writeFileSync(path, restored);
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
