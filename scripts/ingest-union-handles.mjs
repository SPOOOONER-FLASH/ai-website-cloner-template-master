/**
 * Ingest the supplier handle packs into the catalogue as RAYEN 雷茵 products.
 *
 * Reads content/rayen/union-handles.json — the curated classification, the dimensions
 * read off each model's own drawing, and the image plan. Writes:
 *   - public/images/products/<slug>[-n].webp
 *   - content/products/<slug>.json
 *
 * WHY A MANIFEST PLUS A GENERATOR
 * The judgement calls in this import are the whole job: which category a model belongs
 * to, which number on the drawing is the centre distance, and which three models do not
 * have enough evidence to publish at all. Those live in the manifest where a person can
 * check them against the drawings. This file only spreads them. Re-run after editing the
 * manifest; never hand-edit the generated product JSON.
 *
 * IMAGE ORDER IS A DECISION, NOT AN ACCIDENT
 * Plate first (that is what the listing thumbnail shows), then the DIMENSION DRAWING, then
 * detail shots, then installed scenes. The drawing sits second because for a pull handle
 * the buyer's first question is "will it fit my door" — the centre distance decides the
 * order, and burying it under five lifestyle photographs is how a catalogue loses an
 * enquiry it had already won.
 *
 * WHAT IS DELIBERATELY NOT WRITTEN
 * Four models have no drawing in the pack (G1216, G2110, T2973, MUL1022). They ship with
 * an empty spec table rather than dimensions borrowed from a sibling model: G* and T* of
 * the same family are different lengths and different fixings, so "close enough" here is
 * a wrong hole position. See AGENTS.md.
 *
 * Usage: node scripts/ingest-union-handles.mjs [--check]
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "content", "rayen", "union-handles.json"), "utf8"));
const IMAGE_DIR = join(root, "public", "images", "products");
const PRODUCT_DIR = join(root, "content", "products");

const checkOnly = process.argv.includes("--check");
const excluded = new Set(manifest.excludeImages);

/**
 * Sort key for one supplier file.
 *
 * The supplier encodes the shot type in the filename: D000/L000 plate, D400 detail,
 * D900/D921 drawing, D500+ installed scene. Parsing it beats sorting alphabetically,
 * which would put the drawing between two plates.
 */
function shotRank(file) {
  if (/D9\d\dSZ/i.test(file)) return 1; // drawing
  if (/(D|L)0\d\d Z|(D|L)0\d\dZ/i.test(file)) return 0; // product plate
  if (/(D|L)1\d\dZ/i.test(file)) return 2; // component detail
  if (/(D|L)4\d\dZ/i.test(file)) return 3; // arrangement / range shot
  return 4; // installed scene
}

function imagesFor(model) {
  const dir = join(manifest.sourceRoot, model);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.jpg$/i.test(f) && !excluded.has(f))
    .sort((a, b) => shotRank(a) - shotRank(b) || a.localeCompare(b))
    .map((f) => join(dir, f));
}

/**
 * The English summary, composed from the record's own fields.
 *
 * Same rule as the Spanish and Chinese sides: assembled from structured data, so the
 * sentence cannot claim anything the spec table does not carry. Where there are no
 * dimensions it says what the product is and stops.
 */
function buildSummary(entry) {
  const kind = entry.categoryPath[0] === "lever-handles" ? "lever handle" : "pull handle";
  const centre = entry.specs.find((s) => s.label === "Centre distance")?.value;
  const length = entry.specs.find((s) => s.label === "Overall length")?.value;
  const lever = entry.specs.find((s) => s.label === "Lever length")?.value;

  const head = `${entry.material} ${kind}`;
  if (centre && length) return `${head}, ${length} overall on ${centre} fixing centres.`;
  if (centre) return `${head} on ${centre} fixing centres.`;
  if (lever) return `${head}, ${lever} lever.`;
  return `${head}.`;
}

/* ------------------------------------------------------------------------ */

/*
  A style family needs at least two PUBLISHED members to mean anything.

  Three models (G1289, G1293, G2750) were written with a family in the manifest and
  turned out to be alone in it: the first two shipped in single-model packs, and
  G2750's two packmates were held back for lack of a product photograph. A family of
  one is a field that claims a pairing the site cannot show — so it is computed here
  rather than trusted from the manifest, and it corrects itself the day the missing
  models arrive. src/data/product-sites.test.ts is what caught this.
*/
const familyCount = new Map();
for (const entry of manifest.models) {
  if (!entry.styleFamily) continue;
  familyCount.set(entry.styleFamily, (familyCount.get(entry.styleFamily) ?? 0) + 1);
}

mkdirSync(IMAGE_DIR, { recursive: true });
const written = [];
const missing = [];

for (const entry of manifest.models) {
  const sources = imagesFor(entry.model);
  if (!sources.length) {
    missing.push(entry.model);
    continue;
  }

  const refs = [];
  for (const [index, source] of sources.entries()) {
    const name = index === 0 ? `${entry.slug}.webp` : `${entry.slug}-${index + 1}.webp`;
    const target = join(IMAGE_DIR, name);
    if (!checkOnly) {
      await sharp(source).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
    }
    const isDrawing = /D9\d\dSZ/i.test(source);
    refs.push({
      src: `/images/products/${name}`,
      ratio: "1 / 1",
      label: isDrawing
        ? `${entry.model} ${entry.name}, dimension drawing`
        : index === 0
          ? `${entry.model} ${entry.name}`
          : `${entry.model} ${entry.name}, view ${index + 1}`,
    });
  }

  const summary = buildSummary(entry);
  const record = {
    model: entry.model,
    slug: entry.slug,
    name: entry.name,
    nameZh: entry.nameZh,
    series: entry.name,
    categoryPath: entry.categoryPath,
    /*
      The style family. The supplier shipped these in seven packs, one per design, and the
      client's own note explains what that means: "有门把手的表示此款式搭配有同风格的门把手".
      Storing the family rather than a list of partner models means the pairing is written
      once and both directions are derived — a hand-maintained pair of lists is how a
      catalogue ends up telling a buyer that a lever matches a handle the lever's own page
      does not mention.
    */
    styleFamily: (familyCount.get(entry.styleFamily) ?? 0) >= 2 ? entry.styleFamily : undefined,
    /*
      RAYEN only. The client said on 2026-09-08 that this batch is for the Chinese site.
      These images came from a Japanese supplier's packs; HYDE and Stahlock sell the same
      factory's output to overseas buyers, where the provenance question is a different
      one. Not widening the scope without being asked.
    */
    sites: manifest.sites,
    summary,
    specs: entry.specs,
    material: entry.material,
    finishes: entry.finishes,
    doorTypes: [],
    certifications: [],
    heroImage: refs[0],
    gallery: refs.slice(1),
    attachmentIds: [],
    relatedModels: [],
    seoTitle: `${entry.model} ${entry.name} | RAYEN`,
    seoDescription: summary,
  };

  if (!checkOnly) {
    writeFileSync(join(PRODUCT_DIR, `${entry.slug}.json`), `${JSON.stringify(record, null, 2)}\n`, "utf8");
  }
  written.push(`${entry.model} → ${entry.categoryPath.join("/")} (${refs.length} 图, ${entry.specs.length} 规格行)`);
}

if (missing.length) {
  console.error(`找不到素材目录：${missing.join(", ")}（源盘没挂上就会这样）`);
  process.exit(1);
}

console.log(written.join("\n"));
console.log(
  `\n${written.length} 个型号；${manifest.heldBack.length} 个证据不足未收：` +
    manifest.heldBack.map((h) => h.model).join("、"),
);
