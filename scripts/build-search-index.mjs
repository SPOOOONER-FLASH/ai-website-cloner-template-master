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
import { readFileSync, readdirSync, mkdirSync, statSync } from "node:fs";
import { writeFileAtomic } from "./lib/write-atomic.mjs";
import { materialTermsFor, regionalTermsFor } from "./lib/search-regional-terms.mjs";

const OUT = "public/search-index.json";

/*
  --site=hyde | --site=rayen writes only that site's index; no flag writes both.

  WHY (2026-09-23, the RAYEN / HYDE wall): `npm run content` is what a HYDE session runs
  after editing an article, and it used to rewrite public/search-index-rayen-*.json as
  well. Those files are RAYEN-lane, so the next commit either crossed the wall (and the
  pre-commit guard refused it) or the HYDE session had to revert RAYEN files by hand —
  twice on 2026-09-23 alone. The prebuild hook still runs with no flag, so every release
  build of either site regenerates both indexes exactly as before.
*/
const SITE = (process.argv.find((a) => a.startsWith("--site=")) ?? "").slice("--site=".length) || "both";
if (!["hyde", "rayen", "both"].includes(SITE)) throw new Error(`--site must be hyde or rayen, got "${SITE}"`);

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

/*
  Which brand's catalogue a record belongs to.

  This mirrors `onHydeCatalogue` in src/data/products.ts, whose comment says the rule is
  applied once so that "the sitemap, search index, finder, counts and llms.txt all agree
  without any of them knowing this rule exists". Every one of those consumers reads through
  that module — except this script, which reads content/products directly and therefore never
  saw the rule at all.

  The result, found on 2026-09-14 while adding search to the RAYEN site: all 196 RAYEN-only
  products were in HYDE's index, and none of their pages exist in HYDE's build. A quarter of
  the index led to a 404. Nothing caught it, because the dead-link audit walks links in HTML
  and these were strings in a JSON payload fetched at runtime.
*/
const onHyde = (p) => !p.sites || p.sites.includes("hyde");
const onRayen = (p) => (p.sites ?? []).includes("rayen");

const allProducts = readCollection("content/products");

// ── Products ────────────────────────────────────────────────────────────────────
for (const p of allProducts) {
  /*
    Unpublished products stay out of search.

    A record with no photograph is taken out of every listing and marked noindex — see
    `isPublished` in src/data/products.ts. Leaving it findable here would put the one
    page we decided not to show at the top of the results for its own model number,
    which is precisely the search somebody types.
  */
  if (!p.heroImage?.src) continue;
  if (!onHyde(p)) continue;

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
        // The /es/ and /pt/ pages search this same index: see scripts/lib/search-regional-terms.mjs.
        regionalTermsFor([].concat(p.categoryPath ?? [])[0]),
        // "copper hinge" is what many buyers call a brass hinge: haystack only, never shown.
        materialTermsFor(p.material),
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

/*
  Only categories that have at least one published HYDE product. The empty-category rule
  gives care-grab-bars and floor-springs-and-pivots no page on cantonlock.com (their
  products are all RAYEN-only), but this loop listed every category in the shared file, so
  two of the seventeen category results led to a 404 — the same defect as the RAYEN
  products above, found again 2026-09-23 for categories.
*/
const hydeCategorySlugs = new Set(
  allProducts
    .filter((p) => p.heroImage?.src && onHyde(p))
    .map((p) => [].concat(p.categoryPath ?? [])[0]),
);
for (const c of categories) {
  if (!hydeCategorySlugs.has(c.slug)) continue;
  entries.push(
    entry("category", c.name, "Product category", `/products/${c.slug}/`, [
      c.name,
      c.nameZh,
      c.summary,
      c.nameEs,
      c.namePt,
      regionalTermsFor(c.slug),
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

/*
  Guides. /guides/ opened on 2026-09-21 and this script was never taught about it, so 40
  long-form buying guides, the pages written to answer exactly what people type into a
  search box, could not be found from the site's own search (found 2026-09-23).
  Indexed with the "news" entry type so SearchDialog needs no change; the subtitle says
  "Guide" so the result reads correctly.
*/
for (const g of readCollection("content/guides")) {
  if (g.draft || g.publishedAt > todayIso) continue;
  entries.push(
    entry("news", g.title, "Guide", `/guides/${g.slug}/`, [
      g.title,
      g.summary,
      // Headings only, not the whole body: full guide text grew the lazily fetched index
      // from 633KB to 969KB. The headings carry the terms people search for.
      ...(g.body ?? []).filter((para) => /^## |^[A-Z0-9][A-Z0-9 ,:&()/'-]{6,}$/.test(para)),
      ...(g.relatedModels ?? []),
    ]),
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
  ["Contact", "Get in touch", "/contact/", "contact inquiry quote request email phone export"],
  ["Downloads", "Catalogs and documents", "/downloads/", "downloads catalog pdf datasheet certificate cad"],
  ["Product Finder", "Find the right hardware", "/product-finder/", "product finder selector filter choose"],
  ["Projects", "Applications", "/projects/", "projects applications case studies references"],
  ["News", "Press and insight", "/news/", "news press release insight article"],
];
for (const [title, subtitle, href, terms] of PAGES) {
  entries.push(entry("page", title, subtitle, href, [title, subtitle, terms]));
}

mkdirSync("public", { recursive: true });

if (SITE !== "rayen") {
  /* Atomic: see scripts/lib/write-atomic.mjs for why a plain write fails here. */
  writeFileAtomic(OUT, JSON.stringify(entries));

  const kb = Math.round(statSync(OUT).size / 1024);
  const byType = entries.reduce((acc, e) => ({ ...acc, [e.type]: (acc[e.type] ?? 0) + 1 }), {});
  console.log(
    `search index: ${entries.length} entries, ${kb}KB — ` +
      Object.entries(byType)
        .map(([t, n]) => `${t} ${n}`)
        .join(", "),
  );
}

/* ── RAYEN 雷茵 ────────────────────────────────────────────────────────────────────
  A separate index per language, rather than one file carrying both.

  The two sites do not share a corpus: RAYEN publishes 196 models that are not on HYDE, and
  HYDE publishes several hundred that are not on RAYEN. Serving HYDE's index to RAYEN would
  offer a Chinese buyer products the site does not sell, on URLs that do not exist there —
  which is exactly the bug this run fixes in the other direction.

  Two files rather than one bilingual file because a visitor needs one language and the whole
  point of a static index is that it is small enough to ship. A Chinese visitor should not
  download the English haystack to search 雷茵.

  The Chinese entry matches on the Chinese text AND the model number. A buyer who has the
  model from a drawing types "T1050"; one who has the part in his hand types 「拉手」.
*/
/*
  `href` here is a BARE path — "/products/…", with no locale prefix.

  The RAYEN site exists at two different path shapes depending on where you look at it. Inside
  the Next app it is /zh/… and /zh-en/… (LOCALE_SEGMENT); on the deployed host
  scripts/build-rayen-site.mjs lifts those to / and /en/ (LOCALE_PUBLIC_PREFIX) and rewrites
  the prefix out of every built file. That rewrite covers HTML, but NOT the JavaScript in
  _next, which is copied afterwards — so a URL baked into this index and used from a client
  component would be right in exactly one of the two places and wrong in the other.

  So the prefix is not stored. SearchBox adds it at click time from where the page actually
  is, and the same index is correct in `next dev` and in production.
*/
const RAYEN_LOCALES = [
  { locale: "zh", out: "public/search-index-rayen-zh.json" },
  { locale: "en", out: "public/search-index-rayen-en.json" },
];

for (const { locale, out } of SITE === "hyde" ? [] : RAYEN_LOCALES) {
  const zh = locale === "zh";
  const rayenEntries = [];

  for (const p of allProducts) {
    if (!p.heroImage?.src) continue;
    if (!onRayen(p)) continue;

    const title = (zh ? p.nameZh : p.name) || p.name;
    const specTerms = (p.specs ?? []).flatMap((s) => [s.label, s.value]);
    rayenEntries.push(
      entry(
        "product",
        title,
        `${p.model} · ${title}`,
        `/products/${p.categoryPath[0]}/${p.slug}/`,
        [
          p.model,
          p.name,
          p.nameZh,
          p.summary,
          p.material,
          ...(p.finishes ?? []),
          ...(p.doorTypes ?? []),
          ...specTerms,
          ...p.categoryPath,
        ],
        p.model,
      ),
    );
  }

  for (const c of categories) {
    const name = (zh ? c.nameZh : c.name) || c.name;
    rayenEntries.push(
      entry("category", name, zh ? "产品类目" : "Product category", `/products/${c.slug}/`, [
        c.name,
        c.nameZh,
        c.summary,
        ...(c.children ?? []).flatMap((child) => [child.name, child.nameZh, child.summary]),
      ]),
    );
  }

  writeFileAtomic(out, JSON.stringify(rayenEntries));
  const rkb = Math.round(statSync(out).size / 1024);
  console.log(`rayen ${locale} search index: ${rayenEntries.length} entries, ${rkb}KB — ${out}`);
}
