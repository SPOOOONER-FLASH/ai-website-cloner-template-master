/**
 * Builds the site search index.
 *
 * Runs from `prebuild`, so it can never be stale relative to content/.
 *
 *   node scripts/build-search-index.mjs
 *
 * Why this exists at all: site search was previously written off as needing a backend.
 * It does not. The corpus is known at build time and it is small — a few hundred
 * kilobytes — so the index ships as a static file and the matching happens in the
 * visitor's browser. No server, no third-party search service, no per-query cost.
 *
 * The file is deliberately NOT imported by any component. It is fetched the first time
 * someone opens the search dialog, so 431 products' worth of text never lands in the
 * main bundle for the majority of visitors who never search.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from "node:fs";

const OUT = "public/search-index.json";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const readCollection = (dir) => {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => readJson(`${dir}/${f}`));
  } catch {
    return [];
  }
};

/**
 * One index entry.
 *
 * `text` is the haystack — everything worth matching, lowercased once here so the
 * browser never has to. Keeping it separate from the display fields means a match on a
 * spec value can still render a clean title and subtitle.
 */
const entry = (type, title, subtitle, href, terms, model) => ({
  type,
  title,
  subtitle,
  href,
  text: terms.filter(Boolean).join(" ").toLowerCase(),
  // Only products have one. Kept as its own field rather than parsed back out of the
  // subtitle: the subtitle also carries the series and category name, so scoring against
  // it made an ordinary word like "panic" score as if it were a model number.
  ...(model ? { model: String(model).toLowerCase() } : {}),
});

const entries = [];

// ── Products ────────────────────────────────────────────────────────────────────
for (const p of readCollection("content/products")) {
  const specTerms = (p.specs ?? []).flatMap((s) => [s.label, s.value]);
  entries.push(
    entry(
      "product",
      p.name,
      p.modelTbc ? p.series : `${p.model} · ${p.series}`,
      `/products/${p.categoryPath[0]}/${p.slug}/`,
      [
        p.model,
        p.name,
        p.nameZh,
        p.series,
        p.summary,
        p.material,
        ...(p.finishes ?? []),
        ...(p.doorTypes ?? []),
        ...specTerms,
        ...p.categoryPath,
      ],
      p.modelTbc ? null : p.model,
    ),
  );
}

// ── Categories ──────────────────────────────────────────────────────────────────
const categoriesFile = readJson("content/categories.json");
const categories = Array.isArray(categoriesFile)
  ? categoriesFile
  : (categoriesFile.categories ?? []);

for (const c of categories) {
  entries.push(
    entry("category", c.name, "Product category", `/products/${c.slug}/`, [
      c.name,
      c.nameZh,
      c.summary,
      // Child names matter: someone searching "fire door" should reach the parent
      // category even though no top-level category is called that.
      ...(c.children ?? []).flatMap((child) => [child.name, child.nameZh, child.summary]),
    ]),
  );
}

// ── Projects ────────────────────────────────────────────────────────────────────
for (const p of readCollection("content/projects")) {
  entries.push(
    entry("project", p.name, p.buildingType, `/projects/${p.slug}/`, [
      p.name,
      p.buildingType,
      p.summary,
      ...(p.body ?? []),
      ...(p.productModels ?? []),
    ]),
  );
}

// ── News ────────────────────────────────────────────────────────────────────────
const todayIso = new Date().toISOString().slice(0, 10);
for (const n of readCollection("content/news")) {
  // Same rule the site itself applies — a draft or a post-dated piece has no page.
  if (n.draft || n.publishedAt > todayIso) continue;
  entries.push(
    entry(
      "news",
      n.title,
      n.kind === "press-release" ? "Press release" : "Insight",
      `/news/${n.slug}/`,
      [n.title, n.summary, ...(n.body ?? []), ...(n.relatedModels ?? [])],
    ),
  );
}

// ── Downloads ───────────────────────────────────────────────────────────────────
const downloadsFile = readJson("content/downloads.json");
const downloads = Array.isArray(downloadsFile)
  ? downloadsFile
  : (downloadsFile.downloads ?? []);

for (const d of downloads) {
  entries.push(
    entry("download", d.title, `${String(d.format).toUpperCase()} · Download`, "/downloads/", [
      d.title,
      d.titleZh,
      d.kind,
      d.format,
      ...(d.relatedModels ?? []),
    ]),
  );
}

// ── Static pages ────────────────────────────────────────────────────────────────
// Hand-listed rather than crawled: these are stable, and crawling the built HTML would
// make the index depend on a previous build.
const PAGES = [
  ["Company", "About Canton Hyland", "/company/", "company about us factory manufacturing iso 9001 guangdong 1998"],
  ["Contact", "Get in touch", "/contact/", "contact enquiry quote request email phone export"],
  ["Downloads", "Catalogues and documents", "/downloads/", "downloads catalogue pdf datasheet certificate cad"],
  ["Product Finder", "Find the right hardware", "/product-finder/", "product finder selector filter choose"],
  ["Projects", "Applications", "/projects/", "projects applications case studies references"],
  ["News", "Press and insight", "/news/", "news press release insight article"],
];
for (const [title, subtitle, href, terms] of PAGES) {
  entries.push(entry("page", title, subtitle, href, [title, subtitle, terms]));
}

mkdirSync("public", { recursive: true });
writeFileSync(OUT, JSON.stringify(entries));

const kb = Math.round(statSync(OUT).size / 1024);
const byType = entries.reduce((acc, e) => ({ ...acc, [e.type]: (acc[e.type] ?? 0) + 1 }), {});
console.log(
  `search index: ${entries.length} entries, ${kb}KB — ` +
    Object.entries(byType)
      .map(([t, n]) => `${t} ${n}`)
      .join(", "),
);
