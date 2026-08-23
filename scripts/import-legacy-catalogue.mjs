/**
 * Turns the crawled legacy catalogue into product records.
 *
 * Input is docs/research/legacy/products/*.json, produced by
 * `node scripts/scrape-legacy-products.mjs --all`.
 *
 *   node scripts/import-legacy-catalogue.mjs            # dry run, prints the plan
 *   node scripts/import-legacy-catalogue.mjs --write    # write content/products/*.json
 *   node scripts/import-legacy-catalogue.mjs --write --images   # also fetch imagery
 *
 * Two rules govern everything here:
 *
 *   Nothing is invented. Every field traces to something the legacy page actually said.
 *   Where the source is silent the field stays empty, because an empty spec table is
 *   honest and a plausible one is a commercial liability.
 *
 *   Existing records are never overwritten. The twenty products already on the site were
 *   reviewed against the client's own asset pack; this run only adds what is missing.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from "node:fs";
import sharp from "sharp";

const write = process.argv.includes("--write");
const withImages = process.argv.includes("--images");

const SRC_DIR = "docs/research/legacy/products";
const OUT_DIR = "content/products";
const IMG_DIR = "public/images/products";

/**
 * Legacy category → our category path.
 *
 * The site's tree was built from this same catalogue, so the mapping is close to 1:1 —
 * `knob-locks` even has a child per cylindrical-lock weight class. Where a legacy name
 * has no home the product is skipped rather than filed somewhere approximate.
 */
const CATEGORY_MAP = {
  "Bathroom Accessories": ["bathroom-accessories"],
  "Lever Handle": ["lever-handles"],
  "Lock Case": ["lock-cases"],
  "Stainless Steel Handle": ["stainless-steel-handles"],
  "Panic Exit Device": ["panic-exit-devices"],
  "S-Panic Exit Device": ["panic-exit-devices", "special-applications"],
  "D-Panic Exit Device": ["panic-exit-devices", "special-applications"],
  "Tubular Lock": ["knob-locks", "tubular-locks"],
  "Brass and Steel Hinges": ["brass-steel-hinges"],
  "Heavy Duty Cylindrical Lock": ["knob-locks", "heavy-duty-cylindrical-locks"],
  "Night Latch And Rim Lock": ["night-latches-rim-locks"],
  "Lock Cylinder": ["lock-cylinders"],
  "Light Duty Cylindrical Lock": ["knob-locks", "light-duty-cylindrical-locks"],
  "Commercial Lock": ["knob-locks", "commercial-locks"],
  "Door viewer": ["hardware-accessories", "door-viewers"],
  "Grip Handle Set": ["grip-handle-sets"],
  "Glass Door Patch Fittings": ["glass-door-accessories", "glass-door-patch-fittings"],
  "Glass Door Handle": ["glass-door-accessories", "glass-door-handles"],
  "Door Flush Bolt": ["hardware-accessories", "door-flush-bolts"],
  Latch: ["hardware-accessories", "latches"],
  "Pry Latch": ["hardware-accessories", "latches"],
  "Door Stopper": ["hardware-accessories", "door-stoppers"],
  Deadbolts: ["deadbolts"],
  "Security Door Guard": ["hardware-accessories", "security-door-guards"],
  Indicator: ["hardware-accessories", "indicators"],
  "Sliding Hook Lock": ["sliding-hook-locks"],
  "Door Closer": ["door-closers"],
  "Door Hinge": ["door-hinges"],
  "Door Power Transfer Devices": ["hardware-accessories", "power-transfer-devices"],
  "Gate House No": ["hardware-accessories", "house-numbers"],
};

/**
 * Longest first: "Heavy Duty Cylindrical Lock" has to win over "Lock", and
 * "S-Panic Exit Device" over "Panic Exit Device".
 */
const CATEGORY_NAMES = Object.keys(CATEGORY_MAP).sort((a, b) => b.length - a.length);

/**
 * The 2026 uploads abandoned the "MODEL-Category" title convention for long
 * multilingual SEO titles, so they are placed by hand from their own spec tables.
 *
 * aid 1597 and 1601 are already on the site as 314 and 317 and are not repeated here.
 *
 * aid 1608 is deliberately absent. Its listing link says model "024" while its own spec
 * block says "023 ETAN" — and 023 ETAN is already published. The client's site
 * contradicts itself, so importing under either name would be a guess; it goes to the
 * review list instead.
 */
const MANUAL_PLACEMENT = {
  1602: { category: "Door Coordinator", path: ["hardware-accessories"] },
  1605: { category: "Panic Exit Device", path: ["panic-exit-devices"] },
  1607: { category: "Panic Exit Device", path: ["panic-exit-devices"] },
  1609: { category: "Exterior Trim", path: ["panic-exit-devices", "exterior-trim"] },
};

/**
 * Titles read "MODEL-Category", but plenty of models contain their own hyphen
 * ("JU-071-Door Closer"), so splitting on the first one mangles both halves. Matching the
 * END of the title against the known category list gets both right.
 */
function splitTitle(title) {
  const clean = String(title || "").trim();
  for (const name of CATEGORY_NAMES) {
    const suffix = `-${name}`;
    if (clean.toLowerCase().endsWith(suffix.toLowerCase())) {
      return { model: clean.slice(0, -suffix.length).trim(), category: name };
    }
  }
  return { model: clean, category: null };
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[×/]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Only imagery uploaded from 2023 on.
 *
 * The 2022 batch carries a repeating diagonal domain watermark across the product itself
 * — on some of it the watermark is a different brand's domain entirely. Those are listed
 * for the client to re-supply instead. Paths look like /uploads/allimg/20240401/....
 */
const IMAGE_YEAR = /\/allimg\/(\d{4})/;
const usableImages = (images = []) =>
  images.filter((u) => {
    const year = u.match(IMAGE_YEAR)?.[1];
    return year ? Number(year) >= 2023 : false;
  });

/** Spec labels that carry a finish, so the dedicated field can be filled from them. */
const FINISH_LABELS = /^(finish|surface finish|color|colour)$/i;
const MATERIAL_LABELS = /^material$/i;
const DOOR_LABELS = /^(door type|suitable for|application)$/i;

/**
 * A one-line summary composed from what the page actually stated.
 *
 * Deliberately mechanical. The alternative is writing marketing copy for 419 products
 * nobody has seen, which is exactly the kind of invention this project refuses.
 */
function buildSummary(category, specs) {
  const material = specs.find((s) => MATERIAL_LABELS.test(s.label))?.value;
  const backset = specs.find((s) => /^backset$/i.test(s.label))?.value;
  const size = specs.find((s) => /^(size|length)$/i.test(s.label))?.value;

  const noun = category.toLowerCase();
  const parts = [];
  parts.push(material ? `${material} ${noun}` : noun);
  if (backset) parts.push(`${backset} backset`);
  else if (size) parts.push(size);

  const sentence = parts.join(", ");
  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`;
}

const MAX_EDGE = 1000;
const BUDGET_KB = 60;
const QUALITY_FLOOR = 62;

async function fetchImage(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();
  const edge = Math.min(MAX_EDGE, Math.max(meta.width, meta.height));

  let quality = 82;
  for (;;) {
    await sharp(buf)
      .resize(edge, edge, { fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toFile(destPath);
    const kb = Math.round(statSync(destPath).size / 1024);
    if (kb <= BUDGET_KB || quality <= QUALITY_FLOOR) return kb;
    quality -= 6;
  }
}

// ---------------------------------------------------------------------------

const existing = new Set(
  readdirSync(OUT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, "")),
);

/** Models already on the site, so a legacy duplicate under a different slug is skipped. */
const existingModels = new Set(
  readdirSync(OUT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => slugify(JSON.parse(readFileSync(`${OUT_DIR}/${f}`, "utf8")).model)),
);

const records = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`${SRC_DIR}/${f}`, "utf8")))
  .filter((r) => !r.error);

const plan = [];
const skipped = { noCategory: [], duplicate: [], noModel: [] };

for (const rec of records) {
  const manual = MANUAL_PLACEMENT[rec.aid];
  const parsed = splitTitle(rec.title);
  const category = manual?.category ?? parsed.category;
  const model = rec.label || parsed.model || rec.model;

  if (!model) {
    skipped.noModel.push(rec.aid);
    continue;
  }
  if (!category) {
    skipped.noCategory.push(`${rec.aid} ${rec.title}`);
    continue;
  }
  if (existingModels.has(slugify(model))) {
    skipped.duplicate.push(model);
    continue;
  }

  const slug = slugify(`${model}-${category}`);
  if (existing.has(slug)) {
    skipped.duplicate.push(model);
    continue;
  }

  const specs = (rec.specs || []).map((s) => ({ label: s.label, value: s.value }));
  const material = specs.find((s) => MATERIAL_LABELS.test(s.label))?.value ?? "";
  const finishes = specs
    .filter((s) => FINISH_LABELS.test(s.label))
    .flatMap((s) => s.value.split(/\s*[/,]\s*/))
    .filter(Boolean);
  const doorTypes = specs
    .filter((s) => DOOR_LABELS.test(s.label))
    .flatMap((s) => s.value.split(/\s*[/,]\s*/))
    .filter(Boolean);

  plan.push({
    aid: rec.aid,
    slug,
    model,
    category,
    categoryPath: manual?.path ?? CATEGORY_MAP[category],
    name: `${category}`,
    specs,
    material,
    finishes,
    doorTypes,
    images: usableImages(rec.images),
    droppedImages: (rec.images || []).length - usableImages(rec.images).length,
  });
}

/**
 * Collapse records that would land on the same slug.
 *
 * The legacy site lists some products more than once — model 70SN appears five times as
 * a lock cylinder, every copy with identical specifications and a different photo set.
 * Writing them out separately used to mean last-writer-wins, silently losing six
 * records; giving them -2/-3 suffixes instead would publish five near-identical pages,
 * which is duplicate content to a search engine and a confusing catalogue to a buyer.
 *
 * Same model plus same category is treated as one product, and the duplicate listings
 * contribute their photography to it.
 */
const merged = new Map();
const mergedFrom = [];

for (const entry of plan) {
  const existingEntry = merged.get(entry.slug);
  if (!existingEntry) {
    merged.set(entry.slug, entry);
    continue;
  }
  const before = existingEntry.images.length;
  existingEntry.images = [...new Set([...existingEntry.images, ...entry.images])];
  existingEntry.droppedImages += entry.droppedImages;
  // Prefer whichever copy actually carried a spec table.
  if (!existingEntry.specs.length && entry.specs.length) existingEntry.specs = entry.specs;
  mergedFrom.push(
    `${entry.slug} ← aid ${entry.aid} (${entry.images.length} 图, 合并后 ${before} → ${existingEntry.images.length})`,
  );
}

plan.length = 0;
plan.push(...merged.values());

console.log(`旧站记录 ${records.length}`);
console.log(`可导入   ${plan.length}`);
if (mergedFrom.length) {
  console.log(`合并重复 ${mergedFrom.length} 条（同型号同分类，旧站重复挂牌）:`);
  mergedFrom.forEach((m) => console.log(`   ${m}`));
}
console.log(`跳过     重复 ${skipped.duplicate.length} · 无分类 ${skipped.noCategory.length} · 无型号 ${skipped.noModel.length}`);
console.log(`图片     可用 ${plan.reduce((s, p) => s + p.images.length, 0)} · 因水印丢弃 ${plan.reduce((s, p) => s + p.droppedImages, 0)}`);
console.log(`规格行   ${plan.reduce((s, p) => s + p.specs.length, 0)}`);

if (skipped.noCategory.length) {
  console.log(`\n无法归类（未导入）:`);
  skipped.noCategory.forEach((s) => console.log(`   ${s}`));
}

if (!write) {
  console.log("\n预演模式。加 --write 才会写入。");
  process.exit(0);
}

mkdirSync(IMG_DIR, { recursive: true });

let written = 0;
let imagesFetched = 0;
let imagesFailed = 0;

for (const p of plan) {
  const gallery = [];
  let hero = { ratio: "1 / 1", label: `Hyland ${p.model} ${p.category.toLowerCase()}` };

  if (withImages) {
    for (const [i, url] of p.images.entries()) {
      const name = i === 0 ? `${p.slug}.webp` : `${p.slug}-${i + 1}.webp`;
      const dest = `${IMG_DIR}/${name}`;
      try {
        if (!existsSync(dest)) await fetchImage(url, dest);
        imagesFetched++;
        const ref = {
          src: `/images/products/${name}`,
          ratio: "1 / 1",
          label: `Hyland ${p.model} ${p.category.toLowerCase()}${i ? `, view ${i + 1}` : ""}`,
        };
        if (i === 0) hero = ref;
        else gallery.push(ref);
      } catch {
        imagesFailed++;
      }
    }
  }

  const summary = buildSummary(p.category, p.specs);

  const record = {
    model: p.model,
    // Every model here is the client's own published product name, so none are provisional.
    slug: p.slug,
    name: p.name,
    series: p.category,
    categoryPath: p.categoryPath,
    summary,
    specs: p.specs,
    material: p.material,
    finishes: p.finishes,
    doorTypes: p.doorTypes,
    // Never populated from a scrape — see scrape-legacy-products.mjs on EN1205.
    certifications: [],
    heroImage: hero,
    gallery,
    attachmentIds: [],
    relatedModels: [],
    seoTitle: `${p.model} ${p.category} | Canton Hyland`,
    seoDescription: summary,
  };

  writeFileSync(`${OUT_DIR}/${p.slug}.json`, `${JSON.stringify(record, null, 2)}\n`);
  written++;
  if (written % 50 === 0) console.log(`  ${written}/${plan.length} 已写入`);
}

console.log(`\n写入 ${written} 个产品`);
if (withImages) console.log(`图片 ${imagesFetched} 张成功, ${imagesFailed} 张失败`);
