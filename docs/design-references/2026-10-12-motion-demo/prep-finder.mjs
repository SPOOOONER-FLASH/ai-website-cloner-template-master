// Data for the Product Finder preview (finder.html): Catalog, Configurator, Studio. Every record,
// count, name and photograph comes from the site as it ships — out/data/en/finder.json (the file the
// live finder fetches), content/products (spec rows), content/categories.json, and the site's own
// src/lib code for finishes, configurator options, variant families and order codes. Nothing typed.
//
// Revised plan (2026-10-13), five edits over the 02:48 version:
//   1. order: content/categories.json, then model in natural sort (not by name, not by count);
//   2. material labels get punctuation-only tidying — filter values stay raw;
//   3. finish values that differ only by case are merged, once, for Catalog and Configurator alike;
//   4. Studio opens on the family with the most members, ties broken by catalogue order;
//   5. images: page 1, the Category and askable Type option photographs, the opening Studio family.
// Every other record points at the same file on cantonlock.com; the script throws unless that file
// exists in the repo's public/images/products-hyde/.
import fs from "node:fs";
import path from "node:path";
import { normaliseFinishes, OPTION_NOTES, STEPS } from "../../../src/lib/configurator.ts";
import { variantFamilies } from "../../../src/lib/product-variants.ts";
import { finishCode, functionCode } from "../../../src/lib/order-code.ts";

const SITE = path.resolve(import.meta.dirname, "../../..");
const OUT = path.resolve(import.meta.dirname, "public/img/finder");
const PAGE_SIZE = 20;
const must = (p) => {
  if (!fs.existsSync(p)) throw new Error(`missing ${p}`);
  return p;
};
const read = (p) => JSON.parse(fs.readFileSync(must(path.join(SITE, p)), "utf8"));
const assert = (ok, msg) => { if (!ok) throw new Error(msg); };

const finder = read("out/data/en/finder.json");
const { categories } = read("content/categories.json");
const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
const catIndex = (slug) => {
  const i = categories.findIndex((c) => c.slug === slug);
  if (i < 0) throw new Error(`no category ${slug}`);
  return i;
};
const byModel = (a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });

// ---------------------------------------------------------------- figure (plan §2: extended labels)
// card-figure.ts FIGURE_LABELS, in its order, then the labels the preview adds. A value counts only
// when it carries a digit, as in cardFigure().
const FIGURE_LABELS = [
  "Backset", "Center distance", "Center Distance", "Grip center distance", "Plate length", "Bar Length",
  "Length", "Size", "Deadbolt throw", "Door thickness", "Capacity", "Door Width",
  // added by the plan
  "Thickness", "Projection", "Body size", "Height", "Width", "Diameter", "Rose diameter", "Lever length",
  "Tube diameter", "Glass thickness", "Min door thickness", "Max door width",
  // added because the dash check below failed without them (BH12, DV06, GL125 SS, SSH012/013/016)
  "Rosette Size", "Glass door thickness", "Suitable Door Thickness", "Available Diameters", "Size1",
  // added when the dash check learned inches (QA 2026-10-13: NO01 states 3”–6” under "Sizes")
  "Sizes",
];
const labelIs = (spec, label) => spec.label === label || (label === "Max door width" && spec.label.startsWith("Max door width"));
function figureOf(specs = []) {
  for (const label of FIGURE_LABELS) {
    const row = specs.find((s) => labelIs(s, label) && /\d/.test(s.value));
    if (row) return { label: row.label, value: row.value };
  }
  return null;
}

// ---------------------------------------------------------------- edit 2: material labels
// Punctuation only: drop a trailing " ." or ",", no space before "," or ".", first letter capitalised.
// No word changes. The raw value stays the filter value, so the counts are the site's own.
const tidyMaterial = (v) => {
  const t = v.trim().replace(/\s+\.\s*$/, "").replace(/\s+([,.])/g, "$1").replace(/,\s*$/, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
};
assert(tidyMaterial("steel material with spray painting , different finishes are available .") ===
  "Steel material with spray painting, different finishes are available", "tidyMaterial self-check");
assert(tidyMaterial("Carbon Steel .") === "Carbon Steel", "tidyMaterial self-check 2");

// ---------------------------------------------------------------- edit 3: finish case folding
// normaliseFinishes() is the Configurator's normaliser; the Catalog filtered raw `finishes`, so the two
// counted differently. One normaliser for both, plus case folding ("black" and "Black" are one finish).
// The spelling kept is the one most records use; ties go to the capitalised form.
const rawNorm = new Map(finder.map((p) => [p.slug, normaliseFinishes(p.finishes)]));
const spellings = new Map();
for (const list of rawNorm.values()) for (const v of list) {
  const k = v.toLowerCase();
  const m = spellings.get(k) ?? new Map();
  m.set(v, (m.get(v) ?? 0) + 1);
  spellings.set(k, m);
}
const canonical = new Map([...spellings].map(([k, m]) => [
  k, [...m].sort((a, b) => b[1] - a[1] || (/^[A-Z]/.test(b[0]) - /^[A-Z]/.test(a[0])))[0][0],
]));
const merged = [...spellings].filter(([, m]) => m.size > 1).map(([, m]) => [...m.keys()].join(" = "));
const foldFinishes = (slug) => [...new Set(rawNorm.get(slug).map((v) => canonical.get(v.toLowerCase())))];

// ---------------------------------------------------------------- images
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const copied = new Set();
const repoImage = (src) => must(path.join(SITE, "public", src)); // throws if the site has no such file
function copy(src) {
  if (!src?.startsWith("/images/products-hyde/")) throw new Error(`not a branded product image: ${src}`);
  const name = path.basename(src);
  if (!copied.has(name)) fs.copyFileSync(repoImage(src), path.join(OUT, name));
  copied.add(name);
}
const imgFor = (src) => (copied.has(path.basename(src)) ? `img/finder/${path.basename(src)}` : `https://cantonlock.com${src}`);

// ---------------------------------------------------------------- records, edit 1: catalogue order
let figuresBefore = 0;
const records = finder
  .map((p) => {
    const full = read(`content/products/${p.slug}.json`);
    const figure = figureOf(full.specs);
    if (p.figure?.en) {
      figuresBefore++;
      // The original twelve labels must give the site's own answer; the extension only fills gaps.
      if (!figure || figure.value !== p.figure.en.value) throw new Error(`figure drift on ${p.slug}`);
    }
    repoImage(p.heroImage.src);
    const finishes = foldFinishes(p.slug);
    catIndex(p.categoryPath[0]);
    return {
      slug: p.slug,
      model: p.model,
      tbc: Boolean(p.modelTbc),
      name: p.name,
      cat: p.categoryPath[0],
      sub: p.categoryPath[1] ?? null,
      material: p.material || "",
      finishes,
      figure,
      src: p.heroImage.src,
      // the live search key (product-finder.ts): model, name, series, finishes
      q: [p.model, p.name, p.series, ...(p.finishes ?? []), ...finishes].filter(Boolean).join(" ").toLowerCase(),
      fnSpec: (full.specs ?? []).find((s) => s.label === "Function")?.value ?? null,
      // kept only to check the dash, then dropped
      _unit: (full.specs ?? []).some((s) => /\d\s*(mm|cm|”|″|"|inch)/i.test(s.value)),
    };
  })
  .sort((a, b) => catIndex(a.cat) - catIndex(b.cat) || byModel(a.model, b.model));

const dashes = records.filter((r) => !r.figure);
const untrueDashes = dashes.filter((r) => r._unit);
// The plan's dash test: a "Dimensions —" row must not belong to a record that states a size.
if (untrueDashes.length) throw new Error(`untrue dash on ${untrueDashes.map((r) => r.model).join(", ")}`);
for (const r of records) delete r._unit;

// Page 1 of the default Catalog.
records.slice(0, PAGE_SIZE).forEach((r) => copy(r.src));

// ---------------------------------------------------------------- categories, in content order
const count = (pred) => records.filter(pred).length;
const cats = categories
  .filter((c) => records.some((r) => r.cat === c.slug))
  .map((c) => {
    const subs = [...new Set(records.filter((r) => r.cat === c.slug && r.sub).map((r) => r.sub))].map((s) => {
      const child = (c.children ?? []).find((x) => x.slug === s);
      if (!child) throw new Error(`no sub-category ${c.slug}/${s}`);
      return { slug: s, name: child.name };
    });
    // The option photograph is the first record of the category in catalogue order: what optionsFor()
    // picks when it walks the records in the order the Catalog lists them.
    const first = records.find((r) => r.cat === c.slug);
    copy(first.src);
    return { slug: c.slug, name: c.name, count: count((r) => r.cat === c.slug), img: imgFor(first.src), subs };
  });

// Type option photographs, only where the Type step can be asked (its options cover at least half of
// the category: the preview's coverage rule). Others never show a Type step, so need no thumbnail.
for (const c of cats) {
  const pool = records.filter((r) => r.cat === c.slug);
  const stated = pool.filter((r) => r.sub).length;
  c.typeAsked = c.subs.length > 1 && stated * 2 >= pool.length;
  if (!c.typeAsked) continue;
  for (const s of c.subs) {
    const first = pool.find((r) => r.sub === s.slug);
    copy(first.src);
    s.img = imgFor(first.src);
  }
}

// ---------------------------------------------------------------- studio, edit 4
const families = variantFamilies(finder)
  .map((f) => ({
    key: f.key,
    base: f.base,
    cat: f.categoryPath[0],
    name: f.name,
    members: f.members.map((m) => ({ slug: m.slug, model: m.model, finish: m.finish, fn: m.fn })),
  }))
  .sort((a, b) => catIndex(a.cat) - catIndex(b.cat) || byModel(a.base, b.base));
const most = Math.max(...families.map((f) => f.members.length));
const opening = families.find((f) => f.members.length === most); // first in catalogue order wins a tie
const tied = families.filter((f) => f.members.length === most).map((f) => f.base);
opening.members.forEach((m) => copy(records.find((r) => r.slug === m.slug).src));
const codes = new Set();
const fns = new Set();
for (const f of families) for (const m of f.members) {
  m.finish.split("+").filter(Boolean).forEach((c) => codes.add(c));
  if (m.fn) fns.add(m.fn);
}
const studio = {
  families,
  opening: opening.members[0].slug,
  ranges: [...new Set(families.map((f) => f.cat))].map((slug) => ({ slug, name: catBySlug[slug].name })),
  finishNames: Object.fromEntries([...codes].map((c) => [c, finishCode(c)?.name ?? null])),
  functions: Object.fromEntries([...fns].map((c) => [c, functionCode(c)?.name ?? null])),
  models: families.reduce((n, f) => n + f.members.length, 0),
};

// ---------------------------------------------------------------- configurator
// Door type leaves the configurator (plan §2), which leaves four steps.
const steps = STEPS.filter((s) => s.key !== "doorType").map(({ key, question, label, hint }) => ({ key, question, label, hint: hint ?? null }));
const notes = Object.fromEntries(
  [...cats.map((c) => c.slug), ...cats.flatMap((c) => c.subs.map((s) => s.slug))]
    .filter((k) => OPTION_NOTES[k])
    .map((k) => [k, OPTION_NOTES[k]]),
);
const materialLabels = Object.fromEntries(
  [...new Set(records.map((r) => r.material).filter(Boolean))].map((m) => [m, tidyMaterial(m)]).filter(([a, b]) => a !== b),
);

// ---------------------------------------------------------------- write
assert(copied.size <= 64, `too many images copied (${copied.size})`);
for (const r of records) {
  r.img = imgFor(r.src);
  delete r.src;
}
const data = { total: records.length, records, cats, steps, notes, materialLabels, studio };
fs.writeFileSync(path.join(import.meta.dirname, "src/finder.json"), JSON.stringify(data));
console.log(
  `${records.length} records, ${cats.length} categories, ${Math.ceil(records.length / PAGE_SIZE)} pages; ` +
    `figures ${figuresBefore} -> ${records.length - dashes.length}, dashes ${dashes.length}; tbc ${count((r) => r.tbc)}\n` +
    `page 1: ${records.slice(0, PAGE_SIZE).map((r) => r.model).join(", ")}\n` +
    `finishes merged by case: ${merged.join("; ") || "none"}; materials tidied: ${Object.keys(materialLabels).length}\n` +
    `type asked in: ${cats.filter((c) => c.typeAsked).map((c) => c.slug).join(", ") || "none"}\n` +
    `studio ${families.length} families / ${studio.models} models / ${studio.ranges.length} ranges, opens on ${opening.base} ` +
    `(${most}; tied: ${tied.join(", ")}); ${copied.size} images copied`,
);
