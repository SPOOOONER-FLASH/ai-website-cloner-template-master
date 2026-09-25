#!/usr/bin/env node
/**
 * One-off, 2026-09-25: seed content/i18n/<code>/ from the seven-page market copy.
 *
 * The market landing sites (docs/collaboration/archive/market-copy-2026-09-24/<code>.ts, 2026-09-24) carried ~280 translated
 * sentences per language — nav labels, FAQ answers, category names and summaries, company
 * and services copy — written by native writers from docs/collaboration/archive/market-copy-2026-09-24/source.en.ts. When the
 * seven locales became full mirrors, that copy became the first entries of the overlay:
 *
 *   ui.json          every leaf string of source.en.ts → the same path in <code>.ts
 *   categories.json  copy.categories[slug] → { name, summary }
 *   faq.json         English question → { question, answer } (matched to content/faq.json)
 *
 * Runs with Node's type stripping (`node --experimental-strip-types` on 24 is default-on)
 * because the market files are TypeScript. Existing overlay entries are kept; the seed only
 * fills keys that are empty. Safe to re-run; deleted along with src/data/market once the
 * seven trees have shipped.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

const LOCALES = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
const root = process.cwd();

function leaves(value, path = "", out = []) {
  if (typeof value === "string") out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => leaves(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) leaves(v, path ? `${path}.${k}` : k, out);
  return out;
}

const { sourceEn } = await import(pathToFileURL(`${root}/docs/collaboration/archive/market-copy-2026-09-24/source.en.ts`).href);
const faq = JSON.parse(readFileSync(`${root}/content/faq.json`, "utf8"));
const englishQuestions = new Set(faq.groups.flatMap((g) => g.items.map((i) => i.question)));
const sourceLeaves = new Map(leaves(sourceEn));
const VERBATIM = /(^|\.)(locale|number|slug|issuer|reference|coversModel|cities|value)$|^home\.kicker$|^common\.modelsCount$/;

for (const code of LOCALES) {
  const mod = await import(pathToFileURL(`${root}/docs/collaboration/archive/market-copy-2026-09-24/${code}.ts`).href);
  const copy = mod[`${code}Copy`];
  const dir = `${root}/content/i18n/${code}`;
  const read = (name, fallback) => (existsSync(`${dir}/${name}`) ? JSON.parse(readFileSync(`${dir}/${name}`, "utf8")) : fallback);
  const ui = read("ui.json", {});
  const categories = read("categories.json", {});
  const faqOverlay = read("faq.json", {});

  let added = 0;
  for (const [path, translated] of leaves(copy)) {
    const en = sourceLeaves.get(path);
    if (!en || VERBATIM.test(path) || en === translated) continue;
    if (path.startsWith("faq.groups") || path.startsWith("categories.")) continue;
    if (!ui[en]) {
      ui[en] = translated;
      added++;
    }
  }
  for (const [slug, entry] of Object.entries(copy.categories)) {
    categories[slug] ??= {};
    categories[slug].name ??= entry.name;
    categories[slug].summary ??= entry.summary;
  }
  let faqAdded = 0;
  copy.faq.groups.forEach((group, gi) => {
    const enGroup = sourceEn.faq.groups[gi];
    if (enGroup && !ui[enGroup.title]) ui[enGroup.title] = group.title;
    group.items.forEach((item, ii) => {
      const enItem = enGroup?.items[ii];
      if (!enItem || !englishQuestions.has(enItem.question)) return;
      if (!faqOverlay[enItem.question]) {
        faqOverlay[enItem.question] = { question: item.question, answer: item.answer };
        faqAdded++;
      }
    });
  });
  const sorted = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(`${dir}/ui.json`, JSON.stringify(sorted(ui), null, 2) + "\n");
  writeFileSync(`${dir}/categories.json`, JSON.stringify(categories, null, 2) + "\n");
  writeFileSync(`${dir}/faq.json`, JSON.stringify(faqOverlay, null, 2) + "\n");
  console.log(`${code}: ui +${added} (${Object.keys(ui).length}), categories ${Object.keys(categories).length}, faq +${faqAdded}`);
}
