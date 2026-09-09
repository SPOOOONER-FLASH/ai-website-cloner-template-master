#!/usr/bin/env node
/**
 * Creates catalogue records for models the client has photographed but that the site does
 * not carry, so `import-client-product-photos.mjs` can then attach their pictures.
 *
 * ---------------------------------------------------------------------------
 * WHY A PAGE WITH NO SPECIFICATIONS IS STILL WORTH PUBLISHING
 *
 * The instinct is that a product page with a photograph, a model number and an empty spec
 * table is thin content and should wait for the factory. The keyword data says otherwise.
 * Bing's report for 2026-09-08 shows buyers arriving on bare model numbers and nothing
 * else — `ssh017`, `ju-088`, `nc068`, `45bn`, `wbk 609`, `hc5845`, `nc182`, `l004-d4`.
 * That is how this trade searches: somebody has the part in their hand, or a line on a
 * quotation, and types the number.
 *
 * For that buyer a page carrying the real photograph and the real model number is the
 * whole answer. A missing page is not "neutral pending better data" — it is a competitor's
 * page ranking for our own model number.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS NOT INVENTED HERE
 *
 * Everything except model, category and name comes from the factory later. This script
 * writes NO specs, NO material, NO finish, NO dimensions. `add-finish-variants.mjs`
 * derives spec rows because it has a sibling to derive them from; these models have none
 * (checked: of the nine in the September drop, only 9007E has a sibling in the
 * catalogue). So the spec table renders empty, which is the honest state, and
 * `npm run sheets` lists them as awaiting data.
 *
 * The category comes from the folder the client filed the photographs under, which is
 * their own classification, not ours.
 *
 * Usage:
 *   node scripts/add-photographed-models.mjs --report
 *   node scripts/add-photographed-models.mjs --write
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const WRITE = process.argv.includes("--write");

/**
 * The models to create, with the category their photographs were filed under and the
 * catalogue's own name for that family. Both are the client's classification.
 */
const WANTED = [
  { model: "069", category: "stainless-steel-handles" },
  { model: "9007E", category: "stainless-steel-handles" },
  { model: "9010E", category: "stainless-steel-handles" },
  { model: "9087 SS", category: "stainless-steel-handles" },
  { model: "LH1083", category: "stainless-steel-handles" },
  { model: "LH1083 SS", category: "stainless-steel-handles" },
  { model: "LH1085 SS", category: "stainless-steel-handles" },
  { model: "DH02 AB", category: "grip-handle-sets" },
  { model: "DH02 PB", category: "grip-handle-sets" },
];

/**
 * `--from <folder>` reads the wanted list off disk instead of the literal above.
 *
 * The literal was fine for nine models named in a chat message. The 2026-09-08 drop
 * brought 115 folders across four categories with 49 unmatched, and transcribing 49 model
 * numbers by hand is both tedious and exactly the kind of step that introduces a typo
 * nobody catches until a page exists under a model number the factory never made.
 *
 * So a folder is the input: its name is the model, and the category comes from the map
 * below, which is a translation of the client's own folder names into our slugs — not an
 * inference about any individual product. A folder with no photographs in it is skipped,
 * because a record with no image publishes nothing and only adds a row to the fill-in
 * sheet.
 */
/** The client's structural folder names — never a model number. */
const STRUCTURAL_FOLDERS = new Set(["图库", "视频", "主图", "gallery", "video", "videos"]);

const CATEGORY_BY_FOLDER = {
  "brass & steel door hinges": "brass-steel-hinges",
  "lock cylinders": "lock-cylinders",
  "door closers": "door-closers",
  "lock cases": "lock-cases",
  "stainless steel handles": "stainless-steel-handles",
  "grip handle sets": "grip-handle-sets",
  "night latches & rim locks": "night-latches-rim-locks",
  /* The 2026-09-08 full-catalogue drop added the remaining families. */
  "door hinge": "brass-steel-hinges",
  deadbolts: "deadbolts",
  "lever handles": "lever-handles",
  "panic exit devices": "panic-exit-devices",
  "tubular locks": "knob-locks",
  "heavy duty cylindrical locks": "knob-locks",
  "light duty cylindrical locks": "knob-locks",
  "commercial locks": "knob-locks",
  /* Second 2026-09-08 drop. */
  "glass door patch fittings": "glass-door-accessories",
  "glass door handles": "glass-door-accessories",
  "door flush bolts": "hardware-accessories",
  latches: "hardware-accessories",
};

const fromRoots = process.argv.flatMap((a, i) =>
  a === "--from" && process.argv[i + 1] ? [process.argv[i + 1]] : [],
);

for (const root of fromRoots) {
  const folder = root.split(/[/\\]/).filter(Boolean).pop() ?? "";
  const category = CATEGORY_BY_FOLDER[folder.toLowerCase()];
  if (!category) {
    console.error(`× ${folder} 没有对应类目，跳过整个文件夹`);
    continue;
  }
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    /*
      Skip the client's own structural folder names.

      Most category archives are `<category>/<model>/主图.jpg`, but a single-product one
      is `<category>/主图.jpg` + `图库/` + `视频/` — and scanning that as a container of
      models yields "图库" and "视频" as model numbers. The image check below does not
      catch it, because 图库 is precisely the folder that is full of images. On 2026-09-08
      that shipped a product record whose model was the Chinese word for "gallery", with
      the slug `-brass-and-steel-hinges`.
    */
    if (STRUCTURAL_FOLDERS.has(entry.name.trim())) continue;
    /* A folder with no picture in it cannot produce a publishable record. */
    const hasImage = readdirSync(join(root, entry.name), { recursive: true }).some((f) =>
      /\.(jpe?g|png|webp)$/i.test(String(f)),
    );
    if (!hasImage) continue;
    WANTED.push({ model: entry.name.trim(), category });
  }
}

/**
 * The catalogue's display name for a family — the one MOST of its records use.
 *
 * Not the first record found. The first stainless-steel-handles record happens to be
 * named "Concealed Sliding Door Handle", which is that one product's own name, and taking
 * it produced nine slugs like `lh1083-concealed-sliding-door-handle` for handles that are
 * nothing of the kind. A family's name is what the family agrees on, so count.
 */
function familyName(category, products) {
  const tally = new Map();
  for (const p of products) {
    if ((p.categoryPath ?? [])[0] !== category || !p.name) continue;
    tally.set(p.name, (tally.get(p.name) ?? 0) + 1);
  }
  const [best] = [...tally].sort((a, b) => b[1] - a[1]);
  return best ? best[0] : null;
}

/**
 * What to call this model — asking its own siblings before asking its category.
 *
 * A category's most common name is only the right answer when the category holds one kind
 * of thing. `hardware-accessories` does not: it carries door viewers, door stoppers, flush
 * bolts, latches and pry latches, and "Door viewer" wins the count. So on 2026-09-08 a
 * flush bolt was created as `fb001-door-viewer` and a latch as `l002-door-viewer` — a URL
 * a buyer would read as the wrong product, sitting next to `fb001-ac-door-flush-bolt` and
 * `l001-latch`, which the catalogue had named correctly all along.
 *
 * The correct name was one row away the whole time. Model numbers here carry a letter
 * prefix that is the product type — FB is a flush bolt, L is a latch, DS a door stopper —
 * so a sibling sharing that prefix knows what this is. Falling back to the family count
 * only when there is no sibling keeps the old behaviour for single-kind categories like
 * `lock-cylinders`, where it was right.
 */
function nameFor(model, category, products) {
  const prefix = String(model).trim().toUpperCase().match(/^[A-Z]+/)?.[0];
  if (prefix) {
    const tally = new Map();
    for (const p of products) {
      if ((p.categoryPath ?? [])[0] !== category || !p.name) continue;
      if (p.model.trim().toUpperCase().match(/^[A-Z]+/)?.[0] !== prefix) continue;
      tally.set(p.name, (tally.get(p.name) ?? 0) + 1);
    }
    const [best] = [...tally].sort((a, b) => b[1] - a[1]);
    if (best) return best[0];
  }
  return familyName(category, products);
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));

/**
 * The same reduction import-client-product-photos.mjs matches on — case, separators and a
 * trailing unit removed.
 *
 * It has to be the same reduction, or this script creates a record for a model the
 * importer would have matched to an existing product, and the catalogue ends up carrying
 * "LC02 85×40mm" and "LC02 85_40" as two products that are one product.
 */
const normalise = (s) =>
  String(s ?? "")
    .toUpperCase()
    .replace(/[\s_\-×*]/g, "")
    .replace(/MM$/, "");

const known = new Set(products.map((p) => normalise(p.model)));

const created = [];
const refused = [];

for (const want of WANTED) {
  const key = normalise(want.model);
  if (known.has(key)) {
    refused.push([want.model, "目录里已有这个型号"]);
    continue;
  }

  const name = nameFor(want.model, want.category, products);
  if (!name) {
    refused.push([want.model, `类目 ${want.category} 在目录里没有任何记录，无法取family名`]);
    continue;
  }

  const slug = `${slugify(want.model)}-${slugify(name)}`;
  if (existsSync(join(DIR, `${slug}.json`))) {
    refused.push([want.model, `slug 已存在：${slug}`]);
    continue;
  }

  /*
    Field set copied from a live record rather than listed from memory. On 2026-09-07 a
    hand-listed field set shipped records missing `relatedModels` and `attachmentIds`, and
    the build died on `.map` of undefined — twice. Cloning the shape is the fix.
  */
  const shape = products.find((p) => (p.categoryPath ?? [])[0] === want.category);

  const record = {
    ...structuredClone(shape),
    model: want.model,
    slug,
    name,
    /* Everything below is deliberately emptied: it is the donor's, not this model's. */
    summary: `${want.model} ${name.toLowerCase()} manufactured by Canton Hyland.`,
    /*
      A description is not optional the way a spec row is: Product JSON-LD requires it,
      and the export test refuses a build without one — correctly, because a Product node
      with no description is invalid structured data, not merely sparse.

      So this states only what is actually known — the model, the family, the
      manufacturer — and then says plainly that the rest is not confirmed yet. That last
      clause is the point. "Full specifications are being confirmed with the factory" is
      a true sentence a buyer can act on; a paragraph of plausible material and dimension
      claims would fill the same space and be worth less than nothing.
    */
    description:
      `${want.model} is a ${name.toLowerCase()} manufactured by Canton Hyland Hardware ` +
      `(Group) Co., Ltd. in Guangdong, China. Photographs of the actual product are shown ` +
      `above. Full specifications for this model are being confirmed with the factory — ` +
      `ask our export team and you will get the measured figures rather than an estimate.`,
    specs: [],
    features: [],
    finishes: [],
    gallery: [],
    videos: [],
    relatedModels: [],
    attachmentIds: [],
    seoTitle: "",
    seoDescription: "",
  };
  /*
    A photography-pending hero, NOT a deleted key.

    `ImageRef.src` is optional by design and MediaPlaceholder renders a labelled block at
    the right aspect ratio when it is absent — that is the mechanism this catalogue
    already uses for 80 records awaiting photographs, and `isPublished()` reads
    `heroImage?.src`, so an empty hero still counts as unpublished.

    Deleting the key instead broke that design on 2026-09-08. Seven records shipped with
    no `heroImage` at all, `applyImageAltOverride` read `.src` off undefined, and the
    production build failed while collecting `/es/certifications` — a route with no
    product photograph on it, which is what made the message so hard to read back to its
    cause. Matching the established shape costs two lines and cannot do that.
  */
  record.heroImage = {
    ratio: "1 / 1",
    label: `Hyland ${want.model} ${name.toLowerCase()}`,
  };
  delete record.drawing;
  delete record.specsEs;
  delete record.summaryEs;
  delete record.descriptionEs;
  delete record.featuresEs;
  delete record.seoTitleEs;
  delete record.seoDescriptionEs;

  created.push({ model: want.model, slug, record });
}

if (WRITE) {
  for (const c of created) {
    writeFileSync(join(DIR, `${c.slug}.json`), `${JSON.stringify(c.record, null, 2)}\n`);
  }
}

console.log(`${created.length} created · ${refused.length} refused\n`);
for (const c of created) console.log(`  + ${c.model.padEnd(12)} ${c.slug}`);
if (refused.length) {
  console.log("\n拒绝：");
  for (const [model, why] of refused) console.log(`  · ${model.padEnd(12)} ${why}`);
}
if (!WRITE) console.log("\n--write not given; nothing written.");
else console.log("\n⚠ 接着跑 import-client-product-photos.mjs 把照片接上，规格仍需工厂提供。");
