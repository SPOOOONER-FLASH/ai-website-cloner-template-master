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
import { staleFields } from "./lib/i18n-source-hash.mjs";
import { execFileSync } from "node:child_process";

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
  console.error("usage: node scripts/i18n-batch.mjs --locale <fr|de|ja|ko|tr|ru|ar> --kind <products|categories|ui|glossary|news|guides|projects|faq> [--size 60] [--index 1] [--section specLabels] [--slugs map.json] [--stale [--base <rev>]]");
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
/*
  --slugs <json>: a `{ slug: ["summary", "features"] }` map (or a plain array of slugs) that
  forces those products into the job regardless of what is already translated, carrying the
  field list as `retranslate` so the writer redoes exactly those fields and copies the rest.
  Cut by comparing content/products between two commits after the English side edits copy
  (2026-09-25: 47 records, summaries / features / template descriptions).
*/
const slugsFile = opt("slugs");
const forced = slugsFile ? readJson(slugsFile) : null;
let forcedMap = Array.isArray(forced) ? Object.fromEntries(forced.map((s) => [s, ["name", "summary", "description", "features", "specs"]])) : forced;
/*
  --stale: the same map, computed — every published record whose English moved since its
  translation was merged (scripts/lib/i18n-source-hash.mjs), with exactly the moved fields.
*/
const stale = args.includes("--stale");
/*
  The archived job files hold the English each translation was made from. For an array field
  (body, faq, features) that moved, they let the job say WHICH entries moved, so a one-paragraph
  edit to a forty-paragraph guide costs one paragraph, not forty: `changedIndices: { body: [21, 23] }`.
*/
const archivedSource = (() => {
  const map = {};
  for (const dir of ["tmp/i18n-done", "tmp/i18n"]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((n) => n.startsWith(`${locale}-${kind}-`) && n.endsWith(".json"))) {
      let job;
      try { job = JSON.parse(readFileSync(`${dir}/${f}`, "utf8")); } catch { continue; }
      for (const it of job.items ?? []) if (it.source) map[it.key] = it.source;
    }
  }
  return map;
})();
/* --base <rev>: when no job file holds the old English, read it from that commit. */
const baseRev = opt("base");
const fromBase = (key) => {
  if (!baseRev) return undefined;
  try {
    const r = JSON.parse(execFileSync("git", ["show", `${baseRev}:content/${kind === "products" ? "products" : kind}/${key}.json`], { encoding: "utf8", maxBuffer: 1e8 }));
    return kind === "news" || kind === "guides" ? { ...r, faq: r.faq?.en ?? [] } : r;
  } catch {
    return undefined;
  }
};
const changedIndices = (key, source, moved) => {
  const old = archivedSource[key] ?? fromBase(key);
  if (!old) return undefined;
  const out = {};
  for (const f of moved) {
    if (!Array.isArray(source[f]) || !Array.isArray(old[f]) || source[f].length !== old[f].length) continue;
    out[f] = source[f].map((v, i) => (JSON.stringify(v) === JSON.stringify(old[f][i]) ? -1 : i)).filter((i) => i >= 0);
  }
  return Object.keys(out).length ? out : undefined;
};
if (stale && ["products", "news", "guides", "projects"].includes(kind)) {
  const done = overlay(kind);
  const folder = kind === "products" ? "products" : kind;
  const isLive = (r) => (kind === "products" ? published(r) : !r.draft && r.publishedAt <= today);
  forcedMap = {};
  for (const r of records(folder)) {
    if (!isLive(r) || !done[r.slug]) continue;
    const src = kind === "news" || kind === "guides" ? { ...r, faq: r.faq?.en ?? [] } : r;
    const moved = staleFields(kind, src, done[r.slug]);
    if (moved.length) forcedMap[r.slug] = moved;
  }
}
if (kind === "products") {
  const done = overlay("products");
  const complete = (t) => t && t.name && t.summary && Array.isArray(t.specs);
  items = records("products")
    .filter(published)
    .filter((p) => (forcedMap ? Boolean(forcedMap[p.slug]) : !complete(done[p.slug])))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((p) => ({
      key: p.slug,
      model: p.model,
      category: p.categoryPath[0],
      material: p.material ?? "",
      ...(forcedMap ? { retranslate: forcedMap[p.slug], changedIndices: changedIndices(p.slug, p, forcedMap[p.slug]) } : {}),
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
    .filter((a) => (forcedMap ? Boolean(forcedMap[a.slug]) : !complete(done[a.slug])))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((a) => ({
      key: a.slug,
      ...(forcedMap ? { retranslate: forcedMap[a.slug], changedIndices: changedIndices(a.slug, { ...a, faq: a.faq?.en ?? [] }, forcedMap[a.slug]) } : {}),
      source: { title: a.title, summary: a.summary, seoTitle: a.seoTitle, seoDescription: a.seoDescription, body: a.body, faq: a.faq?.en ?? [] },
      target: { title: "", summary: "", seoTitle: "", seoDescription: "", body: a.body.map(() => ""), faq: (a.faq?.en ?? []).map(() => ({ question: "", answer: "" })) },
    }));
} else if (kind === "projects") {
  const done = overlay("projects");
  items = records("projects")
    .filter((p) => (forcedMap ? Boolean(forcedMap[p.slug]) : !(done[p.slug]?.name && done[p.slug]?.body)))
    .map((p) => ({
      key: p.slug,
      ...(forcedMap ? { retranslate: forcedMap[p.slug], changedIndices: changedIndices(p.slug, p, forcedMap[p.slug]) } : {}),
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
