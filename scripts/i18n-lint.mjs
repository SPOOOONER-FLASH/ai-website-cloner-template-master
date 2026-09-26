#!/usr/bin/env node
/**
 * Re-run the merge's checks over what is already in content/i18n/<code>/ — for the native
 * reviewers (M8), who correct overlay files directly and must not be able to introduce what
 * the merge would have refused: Chinese characters outside Japanese, Eastern digits, bidi
 * controls, a dropped model code or standard, an array that no longer matches the English,
 * a summary that names the wrong metal. Exit 1 with every finding listed.
 *
 *   node scripts/i18n-lint.mjs [--locale ar]
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { materialConflict } from "./lib/i18n-material.mjs";

const arg = process.argv.indexOf("--locale");
const LOCALES = arg === -1 ? ["fr", "de", "ja", "ko", "tr", "ru", "ar"] : [process.argv[arg + 1]];
const CODE = /\b(?:[A-Z]{1,4}-?\d[\w\-\/.]*|EN\s?\d{3,5}(?::\d{4})?|ISO\s?\d{4,5}|ANSI(?:\/BHMA)?(?:\s?A\d+(?:\.\d+)?)?|BHMA|DIN\s?\d+|UL\s?\d+)\b/g;
const HAN = /\p{Script=Han}/u;
const HAN_RUN = /\p{Script=Han}{7,}/u;
const EASTERN_DIGITS = /[٠-٩۰-۹]/;
const BIDI = /[‎‏‪-‮⁦-⁩]/;
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const records = (folder) => Object.fromEntries(readdirSync(`content/${folder}`).filter((f) => f.endsWith(".json")).map((f) => { const r = readJson(`content/${folder}/${f}`); return [r.slug, r]; }));
const EN = { products: records("products"), news: records("news"), guides: records("guides"), projects: records("projects") };

const problems = [];
function text(locale, where, en, out) {
  if (typeof out !== "string") return;
  if (!out.trim() && typeof en === "string" && en.trim()) problems.push(`${where}: empty`);
  if (locale === "ja" ? HAN_RUN.test(out) : HAN.test(out)) problems.push(`${where}: Chinese characters`);
  if (EASTERN_DIGITS.test(out)) problems.push(`${where}: Eastern Arabic digits`);
  if (BIDI.test(out)) problems.push(`${where}: bidi control`);
  /* The Korean reviewer found 38 tables stored with the two characters "
" instead of a line break (2026-09-25). */
  if (out.includes("\n") && !(typeof en === "string" && en.includes("\n"))) problems.push(`${where}: literal "\n" (should be a real line break)`);
  if (typeof en === "string") {
    const flat = out.replace(/\s+/g, "");
    for (const code of new Set((en.match(CODE) ?? []).map((c) => c.replace(/\s+/g, "")))) if (!flat.includes(code)) problems.push(`${where}: dropped code "${code}"`);
  }
}
function walk(locale, where, en, out) {
  if (typeof out === "string") return text(locale, where, en, out);
  if (Array.isArray(out)) {
    if (Array.isArray(en) && en.length !== out.length) problems.push(`${where}: ${out.length} entries, English has ${en.length}`);
    out.forEach((v, i) => walk(locale, `${where}[${i}]`, Array.isArray(en) ? en[i] : undefined, v));
    return;
  }
  if (out && typeof out === "object") for (const [k, v] of Object.entries(out)) if (k !== "sourceHash") walk(locale, `${where}.${k}`, en?.[k], v);
}

for (const locale of LOCALES) {
  for (const kind of ["products", "news", "guides", "projects"]) {
    const path = `content/i18n/${locale}/${kind}.json`;
    if (!existsSync(path)) continue;
    const overlay = readJson(path);
    for (const [slug, entry] of Object.entries(overlay)) {
      const en = EN[kind][slug];
      if (!en) { problems.push(`${locale}/${kind}/${slug}: no such English record`); continue; }
      const src = kind === "news" || kind === "guides" ? { ...en, faq: en.faq?.en ?? [] } : en;
      for (const [field, value] of Object.entries(entry)) {
        if (field === "sourceHash" || field === "seoTitle" || field === "seoDescription") continue;
        const enValue = field === "specs" ? (src.specs ?? []).map(({ label, value: v }) => ({ label, value: v })) : src[field];
        walk(locale, `${locale}/${kind}/${slug}.${field}`, enValue, value);
      }
      if (kind === "products") {
        const clash = materialConflict(locale, en.material, entry.summary);
        if (clash) problems.push(`${locale}/products/${slug}.summary ${clash}`);
        for (const [i, row] of (entry.specs ?? []).entries()) if (src.specs?.[i] && row.label !== src.specs[i].label) problems.push(`${locale}/products/${slug}.specs[${i}].label must stay "${src.specs[i].label}"`);
      }
    }
  }
  for (const kind of ["ui", "glossary", "categories", "faq"]) {
    const path = `content/i18n/${locale}/${kind}.json`;
    if (!existsSync(path)) continue;
    walk(locale, `${locale}/${kind}`, undefined, readJson(path));
  }
}
if (problems.length) {
  console.error(`✗ ${problems.length} finding(s):`);
  for (const p of problems.slice(0, 80)) console.error(`  ${p}`);
  if (problems.length > 80) console.error(`  … ${problems.length - 80} more`);
  process.exit(1);
}
console.log(`✓ overlays clean for ${LOCALES.join(", ")}`);
