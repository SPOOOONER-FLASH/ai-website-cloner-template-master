#!/usr/bin/env node
/**
 * Creates catalogue records for finish/function variants of models we already carry.
 *
 * ---------------------------------------------------------------------------
 * WHAT THE CLIENT SENT AND WHY MOST OF IT IS SAFE
 *
 * The September photo drop contains 87 model folders; 44 matched products we already have
 * and 43 did not. Those 43 are not new designs — they are the same models in a different
 * finish or a different door function, which is how this catalogue is organised: `587
 * PBET`, `587 PBBK` and `587 PBPS` are one lock offered three ways.
 *
 * Comparing those three, and the LH852 and 607 families independently, the pattern is
 * exact and the client's own data states it:
 *
 *     ET  Entrance — keyed outside
 *     BK  Privacy — bathroom, turn button inside
 *     PS  Passage
 *
 * Across all three families the ONLY spec row that differs with the suffix is `Function`.
 * Material, cylinder, cycle life, chassis, trim, latch, handing, application, keying and
 * key options are identical. So a variant record is a copy of its sibling with two rows
 * changed, and that is a derivation from the client's data rather than an invention.
 *
 * ---------------------------------------------------------------------------
 * WHERE THE FINISH STRING COMES FROM — THREE TIERS, AND A REFUSAL
 *
 * The finish must never be phrased here. It is taken, in this order:
 *
 *   1. A sibling with the SAME finish code — its `Finish` row is copied verbatim.
 *      Zero inference: the same words the client already publishes for that code.
 *   2. A catalogue-wide precedent: at least two existing records whose model carries that
 *      code and whose Finish row is a single value. "SS" resolves to "Satin stainless
 *      steel (US32D)" because thirteen records say so. This is applying the client's own
 *      established convention, and the precedent count is recorded on the product.
 *   3. Nothing. `MB`, `CP` and `BS` appear in the new folder names and NOWHERE in the
 *      catalogue. There is no honest way to turn "MB" into a finish name from here —
 *      matt black is the obvious guess and a guess on a finish is a colour somebody
 *      orders and cannot be shipped. Those models are reported, not created.
 *
 * Models with no function suffix at all (8827, 8828) are also refused: without it the
 * record cannot say whether the door locks, and Function is the first thing a buyer picks.
 *
 * ---------------------------------------------------------------------------
 * PHOTOS ARE NOT HANDLED HERE
 *
 * Run `import-client-product-photos.mjs` again afterwards. It matches folders to records
 * by exact model, so records created by this script make their own photographs importable
 * on the next pass. Keeping the two apart means a bad record can be deleted without
 * disturbing images and vice versa.
 *
 * Usage:
 *   node scripts/add-finish-variants.mjs --report
 *   node scripts/add-finish-variants.mjs --write
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const WRITE = process.argv.includes("--write");
const DIR = "content/products";

/** Verified against the 587, LH852 and 607 families — see the header. */
const FUNCTION_BY_SUFFIX = {
  ET: "Entrance — keyed outside",
  BK: "Privacy — bathroom, turn button inside",
  PS: "Passage",
};

/** The models the September drop brought that the catalogue does not carry. */
const WANTED = [
  "3431 SSET", "6491 SNET", "807 ABBK", "808 ABET", "808 MBET", "808 SNPS",
  "819 PBET", "836 SNET", "853 SSBK", "8803 SNBK", "8803 SNET", "8806 SSBK",
  "8806 SSET", "8827", "8828", "LH851", "LH852 BNET", "LH853 CPBK", "LH853 CPPS",
  "LH853 SNBK", "LH853 SNPS", "LH854 SNET", "LH855 BNBK", "587 MBBK", "S578",
  "575 ACET", "575 SSET", "578 SNBK", "578 SNET", "578 SSET", "592 BSET",
  "598 ACET", "598 SNBK", "598 SNET", "598 SSET", "607 ACBK", "607 SSPS",
  "609 SSET", "D01 AB", "D101 BS", "D102 AC", "D102 PB", "D103 AC",
  /* The 2026-09-08 WeChat drop: folders with photographs and no product record. */
  "70720 PB", "9014 SSET", "70900 MBBK", "70900 MBET", "1073D MB",
];

const parse = (model) => {
  const m = String(model).toUpperCase().trim().match(/^([A-Z]*\s*\d+)\s*([A-Z]{2})?\s*(ET|BK|PS)?$/);
  if (!m) return null;
  return { base: m[1].replace(/\s+/g, ""), finish: m[2] ?? null, fn: m[3] ?? null };
};

const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));

/* Index by base model, and build the finish-code precedent table from real records. */
const byBase = new Map();
const finishSeen = new Map();
for (const product of products) {
  const q = parse(product.model);
  if (!q) continue;
  if (!byBase.has(q.base)) byBase.set(q.base, []);
  byBase.get(q.base).push({ product, ...q });

  const finish = (product.specs ?? []).find((s) => s.label === "Finish")?.value;
  /* A comma means a list of options, not the finish this SKU designates. */
  if (!q.finish || !finish || finish.includes(",") || finish.length > 60) continue;
  if (!finishSeen.has(q.finish)) finishSeen.set(q.finish, new Map());
  const tally = finishSeen.get(q.finish);
  tally.set(finish, (tally.get(finish) ?? 0) + 1);
}

/** The best-evidenced phrasing for a code, with how many records back it. */
function precedent(code) {
  const tally = finishSeen.get(code);
  if (!tally) return null;
  const [best] = [...tally].sort((a, b) => b[1] - a[1]);
  return best && best[1] >= 2 ? { value: best[0], records: best[1] } : null;
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const created = [];
const refused = [];

for (const wanted of WANTED) {
  const q = parse(wanted);
  if (!q) { refused.push([wanted, "型号无法解析"]); continue; }

  const siblings = byBase.get(q.base) ?? [];
  if (!siblings.length) { refused.push([wanted, "目录里没有同型号，需要工厂给规格"]); continue; }

  /*
    NOT EVERY FAMILY USES A FUNCTION SUFFIX.

    The first pass refused D101 BS, D102 AC and D102 PB for "no ET/BK/PS", which was wrong:
    deadbolts have no passage or privacy version, so the two letters after the number are
    the FINISH and there is no function token at all. D101 AB, D101 AC, D101 PB and D101 SS
    are already in the catalogue and none of them carries a suffix.

    So the family decides, and the family says so itself: if no sibling of this base model
    has a function suffix, this family does not use one, and its absence is not a gap.
    Refusing only where the siblings DO use one keeps the guard where it matters — a knob
    lock without a stated function really is unspecifiable.
  */
  const familyUsesFunction = siblings.some((s) => s.fn);
  if (!q.fn && familyUsesFunction) {
    refused.push([wanted, "同系列其他型号都带 ET/BK/PS，这个没有——功能未知，不能建"]);
    continue;
  }

  /* Prefer a sibling sharing the finish code; otherwise the richest record. */
  const sameFinish = siblings.find((s) => s.finish === q.finish);
  const donor = sameFinish
    ?? [...siblings].sort((a, b) => (b.product.specs?.length ?? 0) - (a.product.specs?.length ?? 0))[0];

  let finishValue = null;
  let finishSource = null;
  if (sameFinish) {
    finishValue = (donor.product.specs ?? []).find((s) => s.label === "Finish")?.value ?? null;
    finishSource = `sibling ${donor.product.model}`;
  } else {
    const p = precedent(q.finish);
    if (p) { finishValue = p.value; finishSource = `${p.records} records use ${q.finish}`; }
  }
  if (!finishValue) {
    refused.push([wanted, `表面处理代码 ${q.finish} 在目录里零先例——不能替它命名`]);
    continue;
  }

  const source = donor.product;
  /*
    The donor's slug with its model swapped for this one.

    Built by string surgery on the family part in the first attempt, which produced
    `3431-sset-snet-lever-handle` — the new finish code AND the donor's, because the
    donor's slug still carried its own. Substituting the model is exact and needs no
    guessing about where the family name starts.
  */
  const finalSlug = source.slug.startsWith(`${slugify(source.model)}-`)
    ? source.slug.replace(slugify(source.model), slugify(wanted))
    : `${slugify(wanted)}-${source.categoryPath.at(-1)}`;

  if (existsSync(join(DIR, `${finalSlug}.json`))) { refused.push([wanted, `slug 已存在：${finalSlug}`]); continue; }

  const specs = (source.specs ?? []).map((s) => ({ ...s }));
  const setRow = (label, value) => {
    const row = specs.find((s) => s.label === label);
    if (row) row.value = value;
    else specs.push({ label, value });
  };
  setRow("Finish", finishValue);
  /* Families without a function suffix keep the donor's Function row untouched. */
  if (q.fn) setRow("Function", FUNCTION_BY_SUFFIX[q.fn]);

  /*
    CLONE THE DONOR, THEN OVERRIDE. NOT: build a record field by field.

    The first version listed the fields it thought a product needed and the build died
    twice — once on `relatedModels.map` and once on `attachmentIds.map`, both of which
    ProductDetail maps over unguarded because every hand-written record has them. Adding
    the missing field each time the build fails is a loop with no stated end: the next
    required array is found by the next crash.

    Cloning the donor inverts that. A variant of an existing product IS that product with
    two rows changed, so it should start as a copy and differ only where it differs. Any
    field the template needs is present because the donor has it.
  */
  const record = {
    ...structuredClone(source),
    model: wanted,
    slug: finalSlug,
    specs,
    finishes: [q.finish].filter(Boolean),
    summary: q.fn
      ? `${source.name} in ${finishValue.toLowerCase()}, ${FUNCTION_BY_SUFFIX[q.fn].split(" — ")[0].toLowerCase()} function.`
      : `${source.name} in ${finishValue.toLowerCase()}.`,
    /* Its own photographs arrive on the next import pass; the donor's are not this SKU. */
    heroImage: { src: "", ratio: "1 / 1", label: `Hyland ${wanted} ${source.name}` },
    gallery: [],
    videos: [],
    /* Certificates are model-scoped. A sibling's certificate does not cover this one. */
    certifications: [],
    /* Composed fresh by translate-products-es.mjs so it matches the new specs. */
    specsEs: undefined,
    summaryEs: undefined,
    derivedFrom: {
      model: source.model,
      slug: source.slug,
      finishFrom: finishSource,
      functionFrom: q.fn ? `suffix ${q.fn}` : "family has no function suffix",
      createdAt: "2026-09-07",
      script: "scripts/add-finish-variants.mjs",
    },
  };
  for (const k of Object.keys(record)) if (record[k] === undefined) delete record[k];

  if (WRITE) writeFileSync(join(DIR, `${finalSlug}.json`), `${JSON.stringify(record, null, 2)}\n`);
  created.push([wanted, finalSlug, finishSource]);
}

console.log(`${WRITE ? "" : "[report] "}${created.length} created · ${refused.length} refused\n`);
for (const [model, slug, src] of created) {
  console.log(`  + ${model.padEnd(12)} ${slug.padEnd(46)} finish from ${src}`);
}
console.log("\n拒绝创建（需要工厂）:");
for (const [model, why] of refused) console.log(`  · ${model.padEnd(12)} ${why}`);
if (!WRITE) console.log("\n--write not given; nothing written.");
