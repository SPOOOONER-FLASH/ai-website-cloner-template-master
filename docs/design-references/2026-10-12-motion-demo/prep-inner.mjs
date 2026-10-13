// Data for the inner-page previews (product page, guide page): one real product (307) and one
// real guide (exit-device comparison), read from content/ as the site reads them. Nothing is typed
// here except which product and which guide to show. Product photographs are the HYDE-branded
// copies the live site serves (public/images/products-hyde), never the as-shot originals.
import fs from "node:fs";
import path from "node:path";

const SITE = path.resolve(import.meta.dirname, "../../..");
const OUT = path.resolve(import.meta.dirname, "public/img/inner");
fs.mkdirSync(OUT, { recursive: true });
const read = (p) => JSON.parse(fs.readFileSync(path.join(SITE, p), "utf8"));
const products = fs.readdirSync(path.join(SITE, "content/products")).filter((f) => f.endsWith(".json"))
  .map((f) => read(`content/products/${f}`))
  .filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);
const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

/** Copy the branded version of a /images/products/… path; throw if the site has none. */
function img(src) {
  const name = path.basename(src);
  const branded = path.join(SITE, "public/images/products-hyde", name);
  const from = fs.existsSync(branded) ? branded : path.join(SITE, "public", src);
  if (!fs.existsSync(from)) throw new Error(`no image for ${src}`);
  if (src.startsWith("/images/products/") && from !== branded) throw new Error(`no branded copy of ${src}`);
  fs.copyFileSync(from, path.join(OUT, name));
  return `img/inner/${name}`;
}
const firstSpecs = (p, n) => (p.specs || []).filter((s) => !/minimum order/i.test(s.label)).slice(0, n);
const card = (p) => ({ model: p.model, name: p.name, slug: p.slug, img: img(p.heroImage.src), specs: firstSpecs(p, 2) });

// ---------------------------------------------------------------- product: 307
const p = bySlug["307-panic-exit-device"];
const family = products.filter((x) => x.categoryPath[0] === "panic-exit-devices");
const devices = family.filter((x) => !/trim|lock case|coordinator/i.test(x.name));
const video = p.videos[0];
fs.copyFileSync(path.join(SITE, "public", video.src), path.join(OUT, path.basename(video.src)));
const guides = fs.readdirSync(path.join(SITE, "content/guides")).map((f) => read(`content/guides/${f}`));
const product = {
  model: p.model, name: p.name, summary: p.summary, slug: p.slug,
  specs: p.specs,
  gallery: [p.heroImage, ...p.gallery].map((g) => ({ src: img(g.src), label: g.label.replace(/^Hyland /, "HYDE ") })),
  video: { src: `img/inner/${path.basename(video.src)}`, poster: img(video.poster.src), seconds: video.durationSeconds, label: video.label },
  family: { name: "Panic exit devices", records: family.length, devices: devices.length },
  // The record's own feature lines name the parts the 307 is sold with; these are those parts.
  worksWith: [
    { role: "Lock case", note: "the mortise lock body the bar drives", ...card(bySlug["072-panic-exit-device-lock-case"]) },
    { role: "Outside trim", note: "handle option one", ...card(bySlug["015-panic-exit-device-trim"]) },
    { role: "Outside trim", note: "handle option two", ...card(bySlug["9080e-panic-exit-device-trim"]) },
  ],
  related: ["311-panic-exit-device", "305-fire-door-panic-exit-device", "310-panic-exit-device", "300-panic-exit-device"].map((s) => card(bySlug[s])),
  guides: guides.filter((g) => (g.relatedModels || []).includes("307")).map((g) => ({ slug: g.slug, title: g.title })),
};

// ---------------------------------------------------------------- guide: exit-device comparison
const g = read("content/guides/exit-device-comparison-2026.json");
const isHeading = (s) => typeof s === "string" && s.length < 80 && s === s.toUpperCase() && /[A-Z]/.test(s);
const parseTable = (s) => {
  const rows = s.trim().split("\n").filter((l) => !/^\|\s*-/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  return { head: rows[0], rows: rows.slice(1) };
};
const sections = [{ title: "Overview", blocks: [] }];
for (const b of g.body) {
  if (isHeading(b)) sections.push({ title: b, blocks: [] });
  else if (b.trim().startsWith("|")) sections.at(-1).blocks.push({ table: parseTable(b) });
  else sections.at(-1).blocks.push({ p: b });
}
const words = g.body.join(" ").split(/\s+/).length;
const modelCard = (m) => {
  const hit = family.find((x) => x.model === m);
  return hit ? card(hit) : null;
};
const neighbour = (slug) => {
  const n = read(`content/guides/${slug}.json`);
  return { slug, title: n.title, summary: n.summary, img: n.heroImage ? img(n.heroImage.src) : null };
};
const guide = {
  slug: g.slug, title: g.title, summary: g.summary, publishedAt: g.publishedAt, updatedAt: g.updatedAt,
  author: { name: g.author.name, role: g.author.role, credential: g.author.credential },
  hero: { src: img(g.heroImage.src), label: g.heroImage.label },
  minutes: Math.round(words / 230), words,
  index: guides.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt)).findIndex((x) => x.slug === g.slug) + 1,
  total: guides.length,
  sections,
  models: g.relatedModels.map(modelCard).filter(Boolean),
  prev: neighbour("en-1125-vs-en-179-2026"),
  next: neighbour("exit-device-outside-trim-functions-2026"),
};

fs.writeFileSync(path.join(import.meta.dirname, "src/inner.json"), JSON.stringify({ product, guide }, null, 1));
console.log(`product ${product.model}: ${product.gallery.length} views, family ${product.family.devices}/${product.family.records}; guide: ${sections.length} sections, ${guide.models.length} models, ${guide.minutes} min`);
