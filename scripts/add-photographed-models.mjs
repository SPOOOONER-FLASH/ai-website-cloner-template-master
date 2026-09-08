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
  { model: "069", category: "stainless-steel-handles", sub: "stainless-steel-handles" },
  { model: "9007E", category: "stainless-steel-handles", sub: "stainless-steel-handles" },
  { model: "9010E", category: "stainless-steel-handles", sub: "stainless-steel-handles" },
  { model: "9087 SS", category: "stainless-steel-handles", sub: "stainless-steel-handles" },
  { model: "LH1083", category: "stainless-steel-handles", sub: "stainless-steel-handles" },
  { model: "LH1083 SS", category: "stainless-steel-handles", sub: "stainless-steel-handles" },
  { model: "LH1085 SS", category: "stainless-steel-handles", sub: "stainless-steel-handles" },
  { model: "DH02 AB", category: "grip-handle-sets", sub: "grip-handle-sets" },
  { model: "DH02 PB", category: "grip-handle-sets", sub: "grip-handle-sets" },
];

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

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));

const known = new Set(products.map((p) => p.model.replace(/\s+/g, "").toUpperCase()));

const created = [];
const refused = [];

for (const want of WANTED) {
  const key = want.model.replace(/\s+/g, "").toUpperCase();
  if (known.has(key)) {
    refused.push([want.model, "目录里已有这个型号"]);
    continue;
  }

  const name = familyName(want.category, products);
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
  delete record.heroImage;
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
