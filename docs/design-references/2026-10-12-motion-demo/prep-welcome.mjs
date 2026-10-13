// Data and images for welcome.html (the homepage welcome-band proposal, 2026-10-13).
// Copy is lifted verbatim from the site source, figures are counted with the site's own rules
// (src/data/products.ts: on the HYDE catalogue and has a hero photograph). Nothing typed here
// is a claim: the only changed wording is "published products" (plan section 6); rail labels reuse site strings.
// `node prep-welcome.mjs --build` also writes dist/welcome/welcome.html, one file that opens by
// double-click (scripts, styles and font inlined; images beside it in img/welcome/).
import fs from "node:fs";
import path from "node:path";

const SITE = path.resolve(import.meta.dirname, "../../..");
const OUT = path.resolve(import.meta.dirname, "public/img/welcome");
const need = (p) => { const f = path.join(SITE, p); if (!fs.existsSync(f)) throw new Error(`missing ${p}`); return f; };
const read = (p) => fs.readFileSync(need(p), "utf8");

// A quoted TS string property inside a slice of source; JSON.parse undoes the \n and \' escapes.
function prop(src, key, from = 0) {
  const m = new RegExp(`\\b${key}:\\s*("(?:[^"\\\\]|\\\\.)*")`).exec(src.slice(from));
  if (!m) throw new Error(`no ${key}`);
  return JSON.parse(m[1]);
}
const between = (src, a, b) => {
  const i = src.indexOf(a), j = src.indexOf(b, i + a.length);
  if (i < 0 || j < 0) throw new Error(`no block ${a}`);
  return src.slice(i, j);
};

/* -------- images */
fs.mkdirSync(OUT, { recursive: true });
const IMAGES = {
  "public/images/editorial/home-panic-exit-double-door.webp": "hero-standin.webp",
  // The HYDE-marked copies the live page serves (src/components/site/editorial-images.ts, editorial-hyde root).
  "public/images/editorial-hyde/hyde-real-lever-set-dark.webp": "lever-set-dark.webp",
  "public/images/editorial-hyde/hyde-real-cylinder-dark.webp": "cylinder-dark.webp",
  "public/images/company/certification-marks.svg": "certification-marks.svg",
  "docs/brand/hyde-2026/marks/hyde-horizontal-ink.svg": "hyde-horizontal-ink.svg",
  "docs/brand/hyde-2026/marks/hyde-icon-ink.svg": "hyde-icon-ink.svg",
};
for (const [src, dst] of Object.entries(IMAGES)) fs.copyFileSync(need(src), path.join(OUT, dst));

/* -------- copy */
const intro = between(read("src/components/site/WelcomeIntro.tsx"), "en: {", "es: {");
const body = prop(intro, "body");
const sentences = body.split(/(?<=[.])\s+(?=[A-Z])/);
if (sentences.length !== 11) throw new Error(`expected 11 sentences in the welcome body, got ${sentences.length}`);
const statement = sentences.slice(0, 4).join(" ");
// Word-like segments become spans; punctuation rides on the word before it (otherwise a full stop
// stays ink beside a grey word mid-brighten); whitespace stays plain text.
const seg = [];
for (const s of new Intl.Segmenter("en", { granularity: "word" }).segment(statement)) {
  const last = seg.at(-1);
  if (!s.isWordLike && s.segment.trim() && last?.w) last.t += s.segment;
  else seg.push({ t: s.segment, w: !!s.isWordLike });
}
if (seg.map((s) => s.t).join("") !== statement) throw new Error("segmentation lost text");
const words = seg.filter((s) => s.w).length;
if (words !== 62) throw new Error(`statement should be 62 words, got ${words}`);

const teaserSrc = between(read("src/data/home.ts"), "export const teaser1", "export const spacers");
const cardAt = (n) => { let i = -1; for (let k = 0; k <= n; k++) i = teaserSrc.indexOf("media: {", i + 1); if (i < 0) throw new Error("teaser card"); return i; };
const card = (n) => ({ alt: prop(teaserSrc, "label", cardAt(n)), title: prop(teaserSrc, "title", cardAt(n)), subtitle: prop(teaserSrc, "subtitle", cardAt(n)) });
const [distributors, specifiers] = [card(0), card(1)];
if (distributors.title !== "For distributors" || specifiers.title !== "For specifiers") throw new Error("teaser cards moved");

const factsSrc = between(read("src/lib/site-facts.ts"), "const COPY", "es: {");
const exportMap = read("src/components/site/ExportMap.tsx");

/* -------- figures: the three counted facts, each linked to the list it counts */
const dir = need("content/products");
const products = fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
  .filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src); // products.ts onHydeCatalogue + isPublished
const categories = JSON.parse(read("content/categories.json")).categories;
// Mirrors src/lib/video-pages.ts isIndexableVideo + src/lib/upload-date.ts isoUploadDate, so the
// figure is the number of watch pages /video/ lists (productsWithWatchPage).
const uploadDateOk = (v) => {
  const t = (v ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(t)
    || (/T\d{2}:\d{2}/.test(t) && /(Z|[+-]\d{2}:\d{2})$/.test(t))
    || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(t);
};
const indexable = (v) => Boolean(v.src?.startsWith("/") && v.poster?.src && v.durationSeconds && uploadDateOk(v.uploadDate));
const withWatchPage = products.filter((p) => (p.videos ?? []).some(indexable)).length;
const company = read("src/data/company.ts");
const stat = (label) => { const m = new RegExp(`label: "${label}", value: "([^"]+)"`).exec(company); if (!m) throw new Error(`no stat ${label}`); return m[1]; };
const workforce = stat("Workforce");
if (!/\s+people$/.test(workforce)) throw new Error(`Workforce stat changed shape: ${workforce}`);

const B = "https://cantonlock.com";
const data = {
  teaser: {
    heading: prop(teaserSrc, "heading"),
    // Swapped per the plan (risk 1): each card goes where its sentence promises.
    cards: [
      { ...distributors, img: "img/welcome/lever-set-dark.webp", href: `${B}/products/` },
      { ...specifiers, img: "img/welcome/cylinder-dark.webp", href: `${B}/contact/` },
    ],
  },
  h1: [prop(intro, "welcome"), prop(intro, "title")],
  statement: { seg, n: words },
  credentials: sentences.slice(4, 7).join(" "),
  offer: sentences.slice(7).join(" "),
  company: prop(intro, "company"),
  headcount: { value: workforce.replace(/\s+people$/, ""), label: prop(factsSrc, "workforce") },
  // English preview, so localisedHref(path, "en") is the bare path. Labels reuse existing site strings.
  rail: [
    { label: "Downloads", href: `${B}/downloads/` },
    { label: "Price list", href: `${B}/request/price-list/` },
    { label: "About the company", href: `${B}/company/` },
  ],
  factsHeading: "The factory, in figures",
  // Only the three counted figures. 1998 and ISO 9001 stay in the H1, credentials and letterhead.
  facts: [
    // The plan's one changed string: "verified product records" -> the finder's own wording.
    { value: String(products.length), label: "published products", href: `${B}/product-finder/` },
    { value: String(categories.length), label: prop(factsSrc, "families"), href: `${B}/products/` },
    { value: String(withWatchPage), label: prop(factsSrc, "withVideo"), href: `${B}/video/` },
  ],
  exportTitle: prop(exportMap, "title"),
};
fs.writeFileSync(path.resolve(import.meta.dirname, "src/welcome.json"), JSON.stringify(data, null, 2));
console.log(`welcome.json: ${data.facts.map((f) => f.value).join(" / ")}; ${data.headcount.value} ${data.headcount.label}; statement ${words} words`);

if (process.argv.includes("--build")) {
  // Own inline config: vite.config.js builds only index.html and belongs to the main demo.
  const [{ build }, { default: react }, { viteSingleFile }] = await Promise.all([
    import("vite"), import("@vitejs/plugin-react"), import("vite-plugin-singlefile"),
  ]);
  const root = import.meta.dirname, dist = path.join(root, "dist/welcome");
  await build({
    configFile: false, root, base: "./", publicDir: false, logLevel: "warn",
    plugins: [react(), viteSingleFile()],
    build: { outDir: dist, emptyOutDir: true, rollupOptions: { input: path.join(root, "welcome.html") } },
  });
  fs.cpSync(OUT, path.join(dist, "img/welcome"), { recursive: true });
  console.log(`built ${path.join(dist, "welcome.html")}`);
}
