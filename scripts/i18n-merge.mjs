#!/usr/bin/env node
/**
 * Validate a filled translation job and merge it into content/i18n/<locale>/.
 *
 *   node scripts/i18n-merge.mjs tmp/i18n/de-products-001.json [--dry]
 *
 * WHAT IS REFUSED, PER ITEM (the rest of the job still merges):
 *   - an empty target, or a target identical to the English source (not translated);
 *   - a translated `specs` list that differs in length or label order from the source;
 *   - model numbers, standards and codes in the source that do not survive verbatim —
 *     every token matching /\b[A-Z]{1,4}\d[\w\-\/.]*\b|EN \d{3,4}|ISO \d{4}|ANSI|BHMA/ in the
 *     English must appear in the target; a translator who "translates" 023 ET has changed
 *     the order code;
 *   - Han characters in a non-Japanese locale, or a run of seven kanji without kana in
 *     Japanese (the rule of scripts/audit-no-chinese.mjs);
 *   - Eastern Arabic digits, and Unicode bidi controls;
 *   - a `{n}`-style placeholder present in the source and missing in the target;
 *   - for `ui`: a key that no longer exists in content/i18n/ui-keys.json (the English
 *     sentence changed; the translation would never be read).
 *
 * Refusals are printed with the key and the reason and the job file is left as it is, so
 * the writer can fix and re-run. `--dry` validates without writing.
 */
import { untranslatable } from "./lib/i18n-untranslatable.mjs";
import { materialConflict } from "./lib/i18n-material.mjs";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
const dry = process.argv.includes("--dry");
if (!file || !existsSync(file)) {
  console.error("usage: node scripts/i18n-merge.mjs tmp/i18n/<locale>-<kind>-<index>.json [--dry]");
  process.exit(2);
}
const job = JSON.parse(readFileSync(file, "utf8"));
const { locale, kind, items } = job;
const dir = `content/i18n/${locale}`;
const target = kind === "glossary" ? "glossary" : kind;
const path = `${dir}/${target}.json`;
const overlay = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};

const CODE = /\b(?:[A-Z]{1,4}-?\d[\w\-\/.]*|EN\s?\d{3,5}(?::\d{4})?|ISO\s?\d{4,5}|ANSI(?:\/BHMA)?(?:\s?A\d+(?:\.\d+)?)?|BHMA|DIN\s?\d+|UL\s?\d+|\d+(?:[.,]\d+)?\s?mm)\b/g;
const HAN = /\p{Script=Han}/u;
const HAN_RUN = /\p{Script=Han}{7,}/u;
const EASTERN_DIGITS = /[٠-٩۰-۹]/;
const BIDI = /[‎‏‪-‮⁦-⁩]/;
const PLACEHOLDER = /\{[a-zA-Z]+\}/g;

const problems = [];
function checkText(key, en, out, path = "") {
  if (typeof en !== "string") return true;
  if (typeof out !== "string" || !out.trim()) return fail(key, `${path} empty`);
  /*
    Identical is fine when there is nothing to translate: a brand or legal name, or a value
    that is only figures, units and codes ("80 kg", "4\" × 3\"", "EN 1125", "SS304"). The
    2026-09-25 writers were refused on those and spelled units out to get past the check
    ("80 kilogram"), which is worse than the English. Untranslatable strings may also
    simply be left out — the page then shows the English, which is the same text.
  */
  if (en.trim().length > 2 && out.trim() === en.trim() && !untranslatable(en)) return fail(key, `${path} identical to English`);
  if (locale === "ja" ? HAN_RUN.test(out) : HAN.test(out)) return fail(key, `${path} has Chinese characters`);
  if (EASTERN_DIGITS.test(out)) return fail(key, `${path} uses Eastern Arabic digits`);
  if (BIDI.test(out)) return fail(key, `${path} carries a bidi control`);
  for (const ph of en.match(PLACEHOLDER) ?? []) if (!out.includes(ph)) return fail(key, `${path} lost placeholder ${ph}`);
  const codes = new Set((en.match(CODE) ?? []).map((c) => c.replace(/\s+/g, "")));
  const flat = out.replace(/\s+/g, "");
  for (const code of codes) {
    if (/^\d+(?:[.,]\d+)?mm$/.test(code)) continue; /* units may be respaced or localised */
    if (!flat.includes(code)) return fail(key, `${path} dropped code "${code}"`);
  }
  return true;
}
function fail(key, reason) {
  problems.push(`${key}: ${reason}`);
  return false;
}
function checkShape(key, en, out, path = "") {
  if (typeof en === "string") return checkText(key, en, out, path);
  if (Array.isArray(en)) {
    if (!Array.isArray(out) || out.length !== en.length) return fail(key, `${path} length ${out?.length} ≠ ${en.length}`);
    return en.every((v, i) => checkShape(key, v, out[i], `${path}[${i}]`));
  }
  if (en && typeof en === "object") {
    if (!out || typeof out !== "object") return fail(key, `${path} not an object`);
    return Object.entries(en).every(([k, v]) => {
      if (k === "label" && typeof v === "string") {
        /* Spec labels are translated through glossary.json, not per product; they stay English here. */
        return out[k] === v || fail(key, `${path}.label must stay "${v}"`);
      }
      return checkShape(key, v, out[k], `${path}.${k}`);
    });
  }
  return true;
}

let merged = 0;
const uiKeys = kind === "ui" && existsSync("content/i18n/ui-keys.json") ? JSON.parse(readFileSync("content/i18n/ui-keys.json", "utf8")) : null;

for (const item of items) {
  const { key, source, target: out } = item;
  if (kind === "ui") {
    if (uiKeys && !uiKeys[key]) {
      fail(key, "no longer an interface key (English changed)");
      continue;
    }
    if (!checkText(key, source, out)) continue;
    overlay[key] = out;
    merged++;
  } else if (kind === "glossary") {
    if (!checkText(key, source, out)) continue;
    overlay[item.section] ??= {};
    overlay[item.section][key] = out;
    merged++;
  } else if (kind === "products") {
    /* description may legitimately be empty in English. */
    const en = { ...source };
    const got = { ...out };
    if (!en.description) {
      delete en.description;
      delete got.description;
    }
    if (!checkShape(key, en, got)) continue;
    /*
      B024 (2026-09-25): a brass hinge whose summary said stainless, in seven languages. Summary
      only — descriptions still carry the English template's category name ("brass and steel
      hinges"), which is the English side's defect, not the translator's.
    */
    const clash = materialConflict(locale, item.material, got.summary);
    if (clash) {
      fail(key, `summary ${clash}`);
      continue;
    }
    overlay[key] = { ...(overlay[key] ?? {}), ...got };
    merged++;
  } else {
    if (!checkShape(key, source, out)) continue;
    overlay[key] = { ...(overlay[key] ?? {}), ...out };
    merged++;
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} item(s) refused:`);
  for (const p of problems.slice(0, 60)) console.error(`  ${p}`);
  if (problems.length > 60) console.error(`  … ${problems.length - 60} more`);
}
if (dry) {
  console.log(`dry run: ${merged} of ${items.length} would merge into ${path}`);
  process.exit(problems.length ? 1 : 0);
}
const sorted = kind === "glossary"
  ? Object.fromEntries(Object.entries(overlay).map(([sec, table]) => [sec, Object.fromEntries(Object.entries(table).sort(([a], [b]) => a.localeCompare(b, "en")))]))
  : Object.fromEntries(Object.entries(overlay).sort(([a], [b]) => a.localeCompare(b, "en")));
writeFileSync(path, JSON.stringify(sorted, null, 2) + "\n");
console.log(`✓ merged ${merged} of ${items.length} into ${path}${problems.length ? ` (${problems.length} refused, see above)` : ""}`);
/* The client subset follows ui.json, or a "use client" component reads stale copy. */
if (kind === "ui") execFileSync(process.execPath, ["scripts/build-i18n-client-ui.mjs"], { stdio: "inherit" });
process.exit(problems.length ? 1 : 0);
