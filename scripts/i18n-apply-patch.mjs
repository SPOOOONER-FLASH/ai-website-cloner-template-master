#!/usr/bin/env node
/**
 * Apply a filled patch job from scripts/i18n-stale-diff.mjs to content/i18n/<locale>/.
 *
 *   node scripts/i18n-apply-patch.mjs tmp/i18n-patch/fr-patch.json [--dry]
 *
 * Each item with a non-empty `target` replaces one paragraph / FAQ entry / string (or, for
 * `whole: true`, the whole field). A field's `sourceHash` moves to the current English only
 * when EVERY moved item of that field was applied, so a half-done field stays on the board.
 *
 * Refused per item, as in i18n-merge.mjs: a target identical to the English, a model number
 * or standard from the English that does not survive verbatim, Han characters outside
 * Japanese, a FAQ entry without both question and answer, a whole field of the wrong length.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { hashOf } from "./lib/i18n-source-hash.mjs";

const file = process.argv[2];
const dry = process.argv.includes("--dry");
if (!file) {
  console.error("usage: node scripts/i18n-apply-patch.mjs tmp/i18n-patch/<locale>-patch.json [--dry]");
  process.exit(2);
}
const { locale, items } = JSON.parse(readFileSync(file, "utf8"));
const CODES = /\b[A-Z]{1,4}\d[\w\-/.]*\b|EN \d{3,4}|ISO \d{4}|ANSI|BHMA/g;
const text = (v) => (typeof v === "string" ? v : JSON.stringify(v));

function problem(it) {
  const t = it.target;
  if (t === "" || t == null || (Array.isArray(t) && t.length === 0)) return "empty target";
  if (text(t) === text(it.english)) return "identical to the English";
  if (it.whole && Array.isArray(it.english) && (!Array.isArray(t) || t.length !== it.english.length)) return "whole field has the wrong length";
  if (it.field === "faq") for (const q of [t].flat()) if (!q?.question || !q?.answer) return "FAQ entry needs question and answer";
  if (it.field === "specs" && (t.label !== it.english.label)) return "spec label must stay the English key";
  const missing = [...new Set(text(it.english).match(CODES) ?? [])].filter((code) => !text(t).includes(code));
  if (missing.length) return `codes missing: ${missing.join(", ")}`;
  if (locale !== "ja" && /\p{Script=Han}/u.test(text(t))) return "Han characters";
  return undefined;
}

const files = {};
const overlayOf = (kind) => (files[kind] ??= JSON.parse(readFileSync(`content/i18n/${locale}/${kind}.json`, "utf8")));
const englishOf = (kind, slug) => {
  const r = JSON.parse(readFileSync(`content/${kind}/${slug}.json`, "utf8"));
  return kind === "news" || kind === "guides" ? { ...r, faq: r.faq?.en ?? [] } : r;
};

const fields = new Map();
let applied = 0;
for (const it of items) {
  const id = `${it.kind}/${it.slug}/${it.field}`;
  if (!fields.has(id)) fields.set(id, { it, ok: true });
  const why = problem(it);
  if (why) {
    fields.get(id).ok = false;
    console.log(`refused ${id}${it.index == null ? "" : `[${it.index}]`}: ${why}`);
    continue;
  }
  const entry = overlayOf(it.kind)[it.slug];
  if (it.index == null) entry[it.field] = it.target;
  else entry[it.field][it.index] = it.target;
  applied++;
}
for (const [, { it, ok }] of fields) {
  if (!ok) continue;
  const entry = overlayOf(it.kind)[it.slug];
  entry.sourceHash = { ...(entry.sourceHash ?? {}), [it.field]: hashOf(it.field, englishOf(it.kind, it.slug)[it.field]) };
}
if (!dry) for (const [kind, data] of Object.entries(files)) writeFileSync(`content/i18n/${locale}/${kind}.json`, `${JSON.stringify(data, null, 2)}\n`);
console.log(`${locale}: ${applied}/${items.length} item(s) applied${dry ? " (dry run)" : ""}; ${[...fields.values()].filter((f) => f.ok).length}/${fields.size} field(s) now current`);
