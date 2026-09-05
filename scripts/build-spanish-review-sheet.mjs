#!/usr/bin/env node
/**
 * Builds the workbook a human Spanish translator actually needs, and nothing else.
 *
 * ---------------------------------------------------------------------------
 * WHY A GENERATOR AND NOT A PASTED TABLE
 *
 * The numbers in this sheet — how many products use a term, which terms are still
 * sitting in English on a Spanish page — go stale the moment anybody edits
 * content/products or es-glossary.ts. A sheet pasted into a chat and saved by hand is a
 * sheet nobody can re-derive, and six weeks from now nobody can tell whether "72 products
 * use this term" is still true. Run `npm run es:sheet` and it reprints from source.
 *
 * ---------------------------------------------------------------------------
 * WHAT THE TRANSLATOR IS ACTUALLY BEING ASKED TO DO
 *
 * Spanish here is not translated prose. Product pages are composed from a glossary —
 * spec labels, spec values, category names — and a term with no glossary entry is LEFT
 * IN ENGLISH by the generator rather than guessed at. So the review has exactly two
 * shapes, and they are separate sheets because they need different kinds of attention:
 *
 *   1. TERMINOLOGY  One row changes every page that uses the term. The "products"
 *                   column is the blast radius, so the translator can spend their time
 *                   in order of consequence instead of alphabetically.
 *
 *   2. GAPS         Terms with no entry at all. These are visibly English on a Spanish
 *                   page right now. Highest priority, and the sheet says so.
 *
 *   3. PROSE        The hand-written page copy — headings, ledes, meta descriptions.
 *                   Real sentences, reviewed as sentences.
 *
 * The Chinese column exists so the client can check a decision without reading Spanish.
 * It is written here rather than sourced from the repo because the repo has no Chinese
 * copy — the site is EN/ES only.
 *
 * Usage:  node scripts/build-spanish-review-sheet.mjs [--out docs/collaboration]
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SPEC_LABELS_ES, SPEC_VALUES_ES, CATEGORY_NAMES_ES } from "../src/data/es-glossary.ts";
import {
  SPEC_LABELS_ZH,
  SPEC_VALUES_ZH,
  CATEGORY_NAMES_ZH,
  PROSE_ZH,
  FINISHES,
  FINISH_LIST_NOTE,
} from "./es-review-chinese.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i > -1 ? args[i + 1] : d;
};

/* ------------------------------------------------------- 1. what the catalogue uses */

const PRODUCT_DIR = "content/products";
/*
  How many different ways the catalogue spells the finishes, so the sheet can say it.
  This is the argument for deciding twenty terms instead of ninety-five lists, and it is
  counted rather than asserted because the number will change as content is cleaned up.
*/
const finishSpellings = new Set();

const labelUse = new Map();
const valueUse = new Map();

for (const file of readdirSync(PRODUCT_DIR).filter((f) => f.endsWith(".json"))) {
  const product = JSON.parse(readFileSync(join(PRODUCT_DIR, file), "utf8"));
  for (const spec of product.specs ?? []) {
    labelUse.set(spec.label, (labelUse.get(spec.label) ?? 0) + 1);
    valueUse.set(spec.value, (valueUse.get(spec.value) ?? 0) + 1);
    if (/^(finish|finishes|available finishes|surface finish)$/i.test(spec.label)) {
      for (const token of spec.value.split(/[,;]| — /)) {
        const t = token.trim().replace(/\.$/, "");
        if (t) finishSpellings.add(t);
      }
    }
  }
}

/* ------------------------------------------------------------- 2. the prose surface */

/*
  Hand-written Spanish lives in two places: the homepage data module, and JSX under
  src/app/es. Strings are pulled with a deliberately blunt matcher — anything in quotes
  long enough to be a sentence and containing a letter with a Spanish diacritic or a
  space. It over-collects; that is the right failure direction for a review sheet, since
  a translator skipping an irrelevant row costs seconds and a missing row costs a page.
*/
function proseFrom(file) {
  if (!existsSync(file)) return [];
  const source = readFileSync(file, "utf8");
  const out = [];
  for (const m of source.matchAll(/"([^"\\]{18,240})"/g)) {
    const text = m[1];
    if (!/\s/.test(text)) continue;
    if (/^[/#.]|^https?:|^\d+ \/ \d+$|^[a-z-]+$/.test(text)) continue;
    if (/[<>{}]/.test(text)) continue;
    out.push(text);
  }
  return [...new Set(out)];
}

const proseFiles = ["src/data/home-es.ts"];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(entry.name)) proseFiles.push(p);
  }
};
walk("src/app/es");

/* ---------------------------------------------------------------- 3. assemble rows */

const rows = { finishes: [], gaps: [], terminology: [], dimensions: [], prose: [] };



/*
  A value that is only a number and a unit does not need a translator.

  This matters more than it sounds: 192 of the 279 untranslated values are things like
  "85mm", "60/70mm", "180°". Left in the sheet they triple its length and bury the
  eighty-odd rows that are real language decisions — and a reviewer who opens a
  thousand-row sheet of "85mm" stops reading before reaching the finish lists, which are
  the rows that actually appear on forty-five product pages.

  The test is deliberately strict about letters: "35mm to 45mm adjustable" contains a
  word and therefore IS a translation decision, even though it is mostly digits.
*/
const DIMENSION_TOKEN = /^(?:[\d.,]+|mm|cm|m|kg|g|in|x|×|\*|\/|-|–|—|°|Ø|ø|ф|"|”|'|’|\(|\)|,)+$/i;
const isDimension = (v) =>
  v
    .trim()
    .split(/[\s,;/]+/)
    .filter(Boolean)
    .every((token) => DIMENSION_TOKEN.test(token));

/*
  A value naming three or more finishes is a list, not a term. It is routed to the
  finishes sheet instead of being handed to the translator nine times in nine orders.
*/
const isFinishList = (v) => (v.match(/\(([A-Z]{2,4})\)/g) ?? []).length >= 3;

const pushTerm = (kind, en, es, zh, uses) => {
  const row = {
    kind,
    en,
    es: es ?? "",
    zh: zh ?? (isFinishList(en) ? FINISH_LIST_NOTE : ""),
    uses,
    status: es ? "已有译法，请复核" : isFinishList(en) ? "由「表面处理」表统一处理" : "缺译，页面上仍是英文",
  };
  if (!es && isDimension(en)) {
    rows.dimensions.push({ ...row, status: "纯尺寸，无需翻译" });
    return;
  }
  (es ? rows.terminology : rows.gaps).push(row);
};

for (const [en, uses] of [...labelUse].sort((a, b) => b[1] - a[1])) {
  pushTerm("规格标签 Spec label", en, SPEC_LABELS_ES[en], SPEC_LABELS_ZH[en], uses);
}
for (const [en, uses] of [...valueUse].sort((a, b) => b[1] - a[1])) {
  pushTerm("规格值 Spec value", en, SPEC_VALUES_ES[en], SPEC_VALUES_ZH[en], uses);
}
for (const [en, es] of Object.entries(CATEGORY_NAMES_ES)) {
  pushTerm("产品类别 Category", en, es, CATEGORY_NAMES_ZH[en], labelUse.get(en) ?? "");
}

for (const file of proseFiles) {
  for (const text of proseFrom(file)) {
    rows.prose.push({ kind: file, en: "", es: text, zh: PROSE_ZH[text] ?? "", uses: "", status: "整句复核" });
  }
}

for (const [en, es, zh] of FINISHES) {
  rows.finishes.push({ kind: "表面处理 Acabado", en, es, zh, uses: "", status: "请确认这一条术语" });
}

/* ------------------------------------------------------------------- 4. the workbook */

const outDir = flag("out", "docs/collaboration");
mkdirSync(outDir, { recursive: true });
const payload = join(outDir, "spanish-review.json");
writeFileSync(
  payload,
  JSON.stringify({ ...rows, meta: { finishSpellings: finishSpellings.size, generated: new Date().toISOString().slice(0, 10) } }, null, 1),
);

console.log(`finishes     ${rows.finishes.length}    <- 二十条决定，替掉 ${finishSpellings.size} 种写法`);
console.log(`terminology  ${rows.terminology.length}`);
console.log(`gaps         ${rows.gaps.length}   <- 这些页面上仍是英文，需要译者处理`);
console.log(`dimensions   ${rows.dimensions.length}   <- 纯尺寸，已从译者视图中分出`);
console.log(`prose        ${rows.prose.length}`);
console.log(`\npayload -> ${payload}`);
console.log(`now run:  py scripts/build_spanish_workbook.py ${payload}`);
