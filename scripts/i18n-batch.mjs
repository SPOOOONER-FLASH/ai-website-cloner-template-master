#!/usr/bin/env node
/**
 * Cut a translation job for one locale and one kind of content.
 *
 *   node scripts/i18n-batch.mjs --locale de --kind products --size 60 --index 1
 *   node scripts/i18n-batch.mjs --locale de --kind ui
 *   node scripts/i18n-batch.mjs --locale de --kind glossary --section specLabels
 *
 * Writes tmp/i18n/<locale>-<kind>[-<section>]-<index>.json: `{ locale, kind, items }` where
 * every item carries the English source and an empty `target` of the same shape. A native
 * writer (a subagent, see docs/collaboration/2026-09-24-market-locale-brief.md) fills
 * `target`; scripts/i18n-merge.mjs validates and merges it into content/i18n/<locale>/.
 *
 * Already-translated keys are skipped, so re-running after a merge cuts the next slice.
 *
 * SCOPE. Products are the 521 published HYDE records — `!sites || sites.includes("hyde")`
 * and a hero photograph — not the 1,110 in content/products, half of which are RAYEN's and
 * never render here (release session, 2026-09-25). Articles are the published ones.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const locale = opt("locale");
const kind = opt("kind");
const size = Number(opt("size", "60"));
const index = Number(opt("index", "1"));
const section = opt("section");
const LOCALES = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
if (!LOCALES.includes(locale) || !kind) {
  console.error("usage: node scripts/i18n-batch.mjs --locale <fr|de|ja|ko|tr|ru|ar> --kind <products|categories|ui|glossary|news|guides|projects|faq> [--size 60] [--index 1] [--section specLabels]");
  process.exit(2);
}
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const dir = `content/i18n/${locale}`;
const overlay = (name) => (existsSync(`${dir}/${name}.json`) ? readJson(`${dir}/${name}.json`) : {});
const today = new Date().toISOString().slice(0, 10);

function published(p) {
  return (!p.sites || p.sites.includes("hyde")) && Boolean(p.heroImage?.src);
}
function records(folder) {
  return readdirSync(`content/${folder}`)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson(`content/${folder}/${f}`));
}

let items = [];
if (kind === "products") {
  const done = overlay("products");
  const complete = (t) => t && t.name && t.summary && Array.isArray(t.specs);
  items = records("products")
    .filter(published)
    .filter((p) => !complete(done[p.slug]))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((p) => ({
      key: p.slug,
      model: p.model,
      category: p.categoryPath[0],
      material: p.material ?? "",
      source: {
        name: p.name,
        summary: p.summary,
        description: p.description || "",
        features: p.features ?? [],
        specs: (p.specs ?? []).map(({ label, value }) => ({ label, value })),
      },
      target: { name: "", summary: "", description: "", features: [], specs: (p.specs ?? []).map(({ label }) => ({ label, value: "" })) },
    }));
} else if (kind === "categories") {
  const done = overlay("categories");
  const cats = readJson("content/categories.json").categories;
  items = cats
    .filter((c) => !(done[c.slug]?.name && done[c.slug]?.summary && (c.children ?? []).every((ch) => done[c.slug]?.children?.[ch.slug]?.name)))
    .map((c) => ({
      key: c.slug,
      source: { name: c.name, summary: c.summary, children: Object.fromEntries((c.children ?? []).map((ch) => [ch.slug, { name: ch.name }])) },
      target: { name: done[c.slug]?.name ?? "", summary: done[c.slug]?.summary ?? "", children: Object.fromEntries((c.children ?? []).map((ch) => [ch.slug, { name: done[c.slug]?.children?.[ch.slug]?.name ?? "" }])) },
    }));
} else if (kind === "ui") {
  const done = overlay("ui");
  const keys = readJson("content/i18n/ui-keys.json");
  items = Object.entries(keys)
    .filter(([en]) => !done[en])
    .map(([en, where]) => ({ key: en, where: where.slice(0, 3), source: en, target: "" }));
} else if (kind === "glossary") {
  const done = overlay("glossary");
  const sections = section ? [section] : ["specLabels", "specValues", "finishNames", "materialNames", "categoryNames", "productNames"];
  const esTables = readFileSync("src/data/es-glossary.ts", "utf8");
  const tableOf = (name) => {
    const m = esTables.match(new RegExp(`export const ${name}: Record<string, string> = \\{([\\s\\S]*?)\\n\\};`));
    if (!m) return {};
    const out = {};
    for (const pair of m[1].matchAll(/^\s*(?:"((?:[^"\\]|\\.)*)"|([A-Za-z_][\w]*)):\s*\n?\s*"((?:[^"\\]|\\.)*)",?\s*$/gm)) {
      out[(pair[1] ?? pair[2]).replace(/\\"/g, '"')] = pair[3].replace(/\\"/g, '"');
    }
    return out;
  };
  const ES = { specLabels: "SPEC_LABELS_ES", specValues: "SPEC_VALUES_ES", finishNames: "FINISH_NAMES_ES", materialNames: "MATERIAL_NAMES_ES", categoryNames: "CATEGORY_NAMES_ES", productNames: "PRODUCT_NAMES_ES" };
  for (const sec of sections) {
    const es = tableOf(ES[sec]);
    for (const [en, esValue] of Object.entries(es)) {
      if (done[sec]?.[en]) continue;
      items.push({ key: en, section: sec, source: en, reference_es: esValue, target: "" });
    }
  }
} else if (kind === "news" || kind === "guides") {
  const done = overlay(kind);
  const complete = (t) => t && t.title && t.summary && Array.isArray(t.body) && t.body.length;
  items = records(kind)
    .filter((a) => !a.draft && a.publishedAt <= today)
    .filter((a) => !complete(done[a.slug]))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((a) => ({
      key: a.slug,
      source: { title: a.title, summary: a.summary, seoTitle: a.seoTitle, seoDescription: a.seoDescription, body: a.body, faq: a.faq?.en ?? [] },
      target: { title: "", summary: "", seoTitle: "", seoDescription: "", body: a.body.map(() => ""), faq: (a.faq?.en ?? []).map(() => ({ question: "", answer: "" })) },
    }));
} else if (kind === "projects") {
  const done = overlay("projects");
  items = records("projects")
    .filter((p) => !(done[p.slug]?.name && done[p.slug]?.body))
    .map((p) => ({
      key: p.slug,
      source: { name: p.name, buildingType: p.buildingType, summary: p.summary, seoTitle: p.seoTitle, seoDescription: p.seoDescription, body: p.body },
      target: { name: "", buildingType: "", summary: "", seoTitle: "", seoDescription: "", body: p.body.map(() => "") },
    }));
} else if (kind === "faq") {
  const done = overlay("faq");
  items = readJson("content/faq.json").groups.flatMap((g) => g.items).filter((i) => i.answer && !done[i.question]).map((i) => ({ key: i.question, source: { question: i.question, answer: i.answer }, target: { question: "", answer: "" } }));
} else {
  console.error(`unknown kind ${kind}`);
  process.exit(2);
}

/*
  Every kind is sliced: a native writer fills one file of `size` items and merges it before
  taking the next, so a refused item costs one slice, not a day. `--all` writes every slice
  at once (index 1..n) for a writer who works through them in order.
*/
const remaining = items.length;
mkdirSync("tmp/i18n", { recursive: true });
const all = args.includes("--all");
const slices = all ? Math.max(1, Math.ceil(items.length / size)) : 1;
const written = [];
for (let n = 0; n < slices; n++) {
  const i = all ? n + 1 : index;
  const slice = items.slice((i - 1) * size, i * size);
  if (!slice.length && all) break;
  const file = `tmp/i18n/${locale}-${kind}${section ? `-${section}` : ""}-${String(i).padStart(3, "0")}.json`;
  writeFileSync(file, JSON.stringify({ locale, kind, section, index: i, remaining, items: slice }, null, 2) + "\n");
  written.push(`${file} (${slice.length})`);
}
console.log(`${written.join("\n")}\n${remaining} untranslated in total`);
