#!/usr/bin/env node
/**
 * Are the HYDE product photographs shot to one scale?
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * Client, 2026-09-28: 「产品图一致性审计脚本（主体占比、基线）没写」, next to the note that
 * FSB's premium feel comes from 「主体明确、照片有统一尺度」.
 *
 * AGENTS.md already says why it matters: fifteen plates shot identically say "this is a
 * factory with a process"; fifteen shot differently say "these came from somewhere". A grid
 * of cards where one lever fills 90% of its square and the next fills 40% reads as the
 * second kind, however good each photograph is on its own. Nobody can see that across 588
 * products by scrolling, so this measures it.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS MEASURED
 *
 * Each image is reduced to 256px on its long side and its background is taken from the
 * border ring (per-channel median). Every pixel further than BG_DISTANCE from that colour is
 * subject; the subject's bounding box gives:
 *
 *   fill      the box's longer side as a share of the frame's matching side — "how big is
 *             the product in the plate". This is the number a grid of cards makes visible.
 *   centre    the box centre's offset from the frame centre, as a share of the frame.
 *   baseline  the empty band under the product, as a share of the frame height. On a
 *             catalogue plate every product should sit on (roughly) the same line.
 *   field     the background luminance and how uniform the border is. A border that is not
 *             one colour is a scene — an installation shot or a packshot on a table — and
 *             its "subject box" is meaningless, so scenes are counted but not scored.
 *
 * Only the photographs the HYDE site renders are measured: heroImage and gallery of every
 * record `onHydeCatalogue` accepts (src/data/products.ts). Sources are read from
 * public/images/products/, not products-hyde/, because the watermark would count as subject.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS FLAGGED (hero images; the gallery is summarised, not itemised)
 *
 *   small       fill below SMALL_FILL. The product is lost in white on a card.
 *   cropped     the subject touches the frame edge. Part of the product may be cut off.
 *   off-centre  horizontal centre offset above OFF_CENTRE. (Vertical position is the
 *               baseline's job: a lever sits higher in its square than a lock case does.)
 *   off-baseline  baseline more than BASELINE_DRIFT away from its category's median, so the
 *               product floats or sinks against its neighbours in the same grid.
 *   off-scale   fill more than SCALE_DRIFT away from its category's median. Neighbours in
 *               the same grid will visibly disagree in size.
 *   grey-field  a uniform field darker than WHITE_FIELD — a grey or cream background in a
 *               catalogue of white plates.
 *   scene       border not uniform; not a studio plate at all.
 *
 * A separate mark in the top-left corner (the old supplier logo baked into ~600 sources) is
 * excluded from the product's box and counted, not flagged: watermark-product-images.mjs
 * covers that corner with the HYDE mark in every products-hyde/ copy the site serves.
 *
 * The flags are a list for a person to act on, not a verdict. This script never edits,
 * re-crops or regenerates an image — see AGENTS.md「Never generate an imagined metal
 * product」: re-framing a real photograph is allowed, but it is a designer's call per image.
 *
 * Usage:
 *   node scripts/audit-product-image-consistency.mjs            # write the report
 *   node scripts/audit-product-image-consistency.mjs --json     # print measurements as JSON
 *
 * Deliberately NOT in `npm run check`: it takes 10–20 s, a staleness check would fail the
 * build every time a photograph is replaced (the chore build-product-image-config.mjs was
 * written to remove), and libvips resampling is not guaranteed byte-identical between the
 * Windows and Linux machines this repo builds on. Run it after a batch of image work.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const PRODUCT_DIR = "content/products";
const IMAGE_ROOT = "public";
const REPORT = "docs/design-references/product-image-consistency.md";

const SAMPLE = 256;
const BG_DISTANCE = 28; // max channel distance from the field colour that still counts as field
const MIN_RUN = 2; // a row/column needs this many subject pixels to count (ignores dust)
const SCENE_BORDER = 0.12; // share of border pixels off the field colour → a scene
const SMALL_FILL = 0.6;
const SCALE_DRIFT = 0.15;
const OFF_CENTRE = 0.08;
const BASELINE_DRIFT = 0.1;
const EDGE = 0.01;
const WHITE_FIELD = 240;
const MARK_ZONE = { w: 0.32, h: 0.14 }; // top-left corner where legacy logos sit
const MARK_MIN_INK = 20; // subject pixels (at SAMPLE size) before the corner counts as marked

const args = process.argv.slice(2);
const asJson = args.includes("--json");

const round = (value, places = 3) => Number(value.toFixed(places));
const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
const percentile = (values, p) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
};

async function measure(file) {
  const { data, info } = await sharp(file)
    .flatten({ background: "#ffffff" })
    .resize(SAMPLE, SAMPLE, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => (y * w + x) * 3;

  const border = [[], [], []];
  const borderIdx = [];
  for (let x = 0; x < w; x++) for (const y of [0, 1, h - 2, h - 1]) borderIdx.push(px(x, y));
  for (let y = 2; y < h - 2; y++) for (const x of [0, 1, w - 2, w - 1]) borderIdx.push(px(x, y));
  for (const i of borderIdx) for (let c = 0; c < 3; c++) border[c].push(data[i + c]);
  const field = border.map(median);
  const far = (i) =>
    Math.max(
      Math.abs(data[i] - field[0]),
      Math.abs(data[i + 1] - field[1]),
      Math.abs(data[i + 2] - field[2]),
    ) > BG_DISTANCE;

  const borderOff = borderIdx.filter(far).length / borderIdx.length;
  const luminance = 0.2126 * field[0] + 0.7152 * field[1] + 0.0722 * field[2];

  // A legacy supplier logo sits in the top-left corner of some sources. It is not the
  // product, so it is measured apart: when the corner holds marks and the product never
  // reaches into that corner, the product's box is taken without it and the plate is flagged.
  const markW = Math.round(w * MARK_ZONE.w);
  const markH = Math.round(h * MARK_ZONE.h);
  const inMark = (x, y) => x < markW && y < markH;
  const tally = () => ({ rows: new Uint32Array(h), cols: new Uint32Array(w), n: 0 });
  const all = tally();
  const outside = tally();
  let markInk = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!far(px(x, y))) continue;
      for (const t of inMark(x, y) ? [all] : [all, outside]) {
        t.rows[y]++;
        t.cols[x]++;
        t.n++;
      }
      if (inMark(x, y)) markInk++;
    }
  }
  const first = (counts) => counts.findIndex((n) => n >= MIN_RUN);
  const last = (counts) => counts.length - 1 - [...counts].reverse().findIndex((n) => n >= MIN_RUN);
  const box = (t) => ({ top: first(t.rows), left: first(t.cols), bottom: last(t.rows), right: last(t.cols) });
  const main = box(outside);
  const cornerMark =
    markInk >= MARK_MIN_INK && main.top >= 0 && (main.top >= markH + 2 || main.left >= markW + 2);
  const { top, left, bottom, right } = cornerMark ? main : box(all);
  if (top < 0 || left < 0) {
    return { empty: true, scene: false, luminance: round(luminance, 0), borderOff: round(borderOff) };
  }
  const boxW = (right - left + 1) / w;
  const boxH = (bottom - top + 1) / h;
  return {
    ratio: round(info.width / info.height, 2),
    scene: borderOff > SCENE_BORDER,
    cornerMark,
    luminance: round(luminance, 0),
    borderOff: round(borderOff),
    fill: round(Math.max(boxW, boxH)),
    area: round(boxW * boxH),
    ink: round((cornerMark ? outside.n : all.n) / (w * h)),
    centreX: round((left + right + 1) / 2 / w - 0.5),
    centreY: round((top + bottom + 1) / 2 / h - 0.5),
    marginTop: round(top / h),
    baseline: round((h - 1 - bottom) / h),
    marginLeft: round(left / w),
    marginRight: round((w - 1 - right) / w),
  };
}

function hydeProducts() {
  return readdirSync(PRODUCT_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(PRODUCT_DIR, name), "utf8")))
    .filter((product) => !product.sites || product.sites.includes("hyde"));
}

async function run() {
  const products = hydeProducts();
  const heroes = [];
  const gallery = [];
  const missing = [];
  const cache = new Map();

  const measureSrc = async (src) => {
    if (!cache.has(src)) {
      const file = join(IMAGE_ROOT, src);
      cache.set(src, existsSync(file) ? measure(file) : Promise.resolve(null));
    }
    return cache.get(src);
  };

  // Bounded concurrency: sharp is fast, but 2,500 decodes at once exhausts memory on 16 GB.
  const jobs = [];
  for (const product of products) {
    const category = product.categoryPath?.[0] ?? "uncategorised";
    const base = { model: product.model, slug: product.slug, category };
    if (product.heroImage?.src) jobs.push({ ...base, src: product.heroImage.src, list: heroes });
    for (const image of product.gallery ?? []) {
      if (image.src && image.src !== product.heroImage?.src) jobs.push({ ...base, src: image.src, list: gallery });
    }
  }
  let next = 0;
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (next < jobs.length) {
        const job = jobs[next++];
        const m = await measureSrc(job.src);
        if (!m) missing.push(job);
        else job.list.push({ model: job.model, slug: job.slug, category: job.category, src: job.src, ...m });
      }
    }),
  );
  const order = (a, b) => a.category.localeCompare(b.category) || a.slug.localeCompare(b.slug) || a.src.localeCompare(b.src);
  heroes.sort(order);
  gallery.sort(order);
  missing.sort(order);
  const noPhoto = products.filter((product) => !product.heroImage?.src).length;
  return { products: products.length, noPhoto, heroes, gallery, missing };
}

function flag(heroes) {
  const plates = heroes.filter((r) => !r.scene && !r.empty);
  const byCategory = new Map();
  for (const r of plates) byCategory.set(r.category, [...(byCategory.get(r.category) ?? []), r]);
  const categoryMedian = new Map([...byCategory].map(([c, rs]) => [c, median(rs.map((r) => r.fill))]));
  const categoryBaseline = new Map([...byCategory].map(([c, rs]) => [c, median(rs.map((r) => r.baseline))]));
  const flagged = [];
  for (const r of heroes) {
    const flags = [];
    if (r.empty) flags.push("empty");
    else if (r.scene) flags.push("scene");
    else {
      if (r.fill < SMALL_FILL) flags.push("small");
      if (Math.min(r.marginTop, r.baseline, r.marginLeft, r.marginRight) < EDGE) flags.push("cropped");
      if (Math.abs(r.centreX) > OFF_CENTRE) flags.push("off-centre");
      if (Math.abs(r.baseline - categoryBaseline.get(r.category)) > BASELINE_DRIFT) flags.push("off-baseline");
      if (Math.abs(r.fill - categoryMedian.get(r.category)) > SCALE_DRIFT) flags.push("off-scale");
      if (r.luminance < WHITE_FIELD) flags.push("grey-field");
    }
    if (flags.length) flagged.push({ ...r, flags });
  }
  return { plates, byCategory, categoryMedian, categoryBaseline, flagged };
}

const pct = (value) => `${Math.round(value * 100)}%`;
const signed = (value) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.round(Math.abs(value) * 100)}%`;

function report({ products, noPhoto, heroes, gallery, missing }) {
  const { plates, byCategory, categoryMedian, categoryBaseline, flagged } = flag(heroes);
  const galleryPlates = gallery.filter((r) => !r.scene && !r.empty);
  const count = (name) => flagged.filter((r) => r.flags.includes(name)).length;
  const lines = [];
  lines.push("# HYDE product image consistency");
  lines.push("");
  lines.push("> Generated by `node scripts/audit-product-image-consistency.mjs`. Do not edit by hand —");
  lines.push("> re-run the script. How each number is measured is documented at the top of the script.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| | Hero images | Gallery images |");
  lines.push("|---|---|---|");
  lines.push(`| Measured | ${heroes.length} (of ${products} HYDE products; ${noPhoto} have no photograph) | ${gallery.length} |`);
  lines.push(`| Studio plates | ${plates.length} | ${galleryPlates.length} |`);
  lines.push(`| Scenes (not scored) | ${heroes.filter((r) => r.scene).length} | ${gallery.filter((r) => r.scene).length} |`);
  lines.push(`| Median fill | ${pct(median(plates.map((r) => r.fill)))} | ${pct(median(galleryPlates.map((r) => r.fill)))} |`);
  lines.push(`| Fill, 10th–90th percentile | ${pct(percentile(plates.map((r) => r.fill), 0.1))}–${pct(percentile(plates.map((r) => r.fill), 0.9))} | ${pct(percentile(galleryPlates.map((r) => r.fill), 0.1))}–${pct(percentile(galleryPlates.map((r) => r.fill), 0.9))} |`);
  lines.push(`| Median baseline (space under product) | ${pct(median(plates.map((r) => r.baseline)))} | ${pct(median(galleryPlates.map((r) => r.baseline)))} |`);
  lines.push(`| Baseline, 10th–90th percentile | ${pct(percentile(plates.map((r) => r.baseline), 0.1))}–${pct(percentile(plates.map((r) => r.baseline), 0.9))} | ${pct(percentile(galleryPlates.map((r) => r.baseline), 0.1))}–${pct(percentile(galleryPlates.map((r) => r.baseline), 0.9))} |`);
  lines.push(`| Old corner logo (excluded; HYDE watermark covers it on site) | ${heroes.filter((r) => r.cornerMark).length} | ${gallery.filter((r) => r.cornerMark).length} |`);
  lines.push(`| Missing file | ${missing.filter((r) => r.list === heroes).length} | ${missing.filter((r) => r.list === gallery).length} |`);
  lines.push("");
  lines.push(
    `Hero flags: **${flagged.length}** images — small ${count("small")}, cropped ${count("cropped")}, ` +
      `off-centre ${count("off-centre")}, off-baseline ${count("off-baseline")}, off-scale ${count("off-scale")}, grey-field ${count("grey-field")}, ` +
      `scene ${count("scene")}, empty ${count("empty")}.`,
  );
  lines.push("");
  lines.push(
    `Thresholds: small < ${pct(SMALL_FILL)} fill · off-scale > ${pct(SCALE_DRIFT)} from the category median · ` +
      `off-centre > ${pct(OFF_CENTRE)} horizontally · off-baseline > ${pct(BASELINE_DRIFT)} from the category median · cropped = subject within ${pct(EDGE)} of an edge · grey-field = field luminance < ${WHITE_FIELD}.`,
  );
  lines.push("");
  lines.push("## By category (hero plates)");
  lines.push("");
  lines.push("| Category | Plates | Median fill | Fill range (10–90%) | Median baseline | Baseline range (10–90%) | Flagged |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const [category, rs] of [...byCategory].sort((a, b) => a[0].localeCompare(b[0]))) {
    const fills = rs.map((r) => r.fill);
    const bases = rs.map((r) => r.baseline);
    lines.push(
      `| ${category} | ${rs.length} | ${pct(categoryMedian.get(category))} | ${pct(percentile(fills, 0.1))}–${pct(percentile(fills, 0.9))} | ` +
        `${pct(median(bases))} | ${pct(percentile(bases, 0.1))}–${pct(percentile(bases, 0.9))} | ${flagged.filter((r) => r.category === category).length} |`,
    );
  }
  lines.push("");
  lines.push("## Flagged hero images");
  lines.push("");
  lines.push("Sorted by category, then by how far the fill is from the category median.");
  lines.push("");
  lines.push("| Model | Category | Flags | Fill (cat. median) | Center x | Baseline (cat. median) | Field | Image |");
  lines.push("|---|---|---|---|---|---|---|---|");
  const drift = (r) => (r.fill === undefined ? 0 : Math.abs(r.fill - (categoryMedian.get(r.category) ?? r.fill)));
  for (const r of [...flagged].sort((a, b) => a.category.localeCompare(b.category) || drift(b) - drift(a) || a.slug.localeCompare(b.slug))) {
    const fill = r.fill === undefined ? "—" : `${pct(r.fill)} (${pct(categoryMedian.get(r.category) ?? 0)})`;
    const centre = r.centreX === undefined ? "—" : signed(r.centreX);
    const base = r.baseline === undefined ? "—" : `${pct(r.baseline)} (${pct(categoryBaseline.get(r.category) ?? 0)})`;
    lines.push(`| ${r.model} | ${r.category} | ${r.flags.join(", ")} | ${fill} | ${centre} | ${base} | ${r.luminance} | \`${r.src.replace("/images/products/", "")}\` |`);
  }
  if (missing.length) {
    lines.push("");
    lines.push("## Referenced but missing");
    lines.push("");
    for (const r of missing) lines.push(`- ${r.model} — \`${r.src}\``);
  }
  lines.push("");
  return lines.join("\n");
}

const started = Date.now();
const result = await run();

if (asJson) {
  const { flagged } = flag(result.heroes);
  const missing = result.missing.map(({ list, ...rest }) => ({ ...rest, hero: list === result.heroes }));
  process.stdout.write(`${JSON.stringify({ ...result, missing, flagged }, null, 2)}\n`);
} else {
  writeFileSync(REPORT, report(result));
  const { flagged } = flag(result.heroes);
  console.log(`${REPORT}: ${result.heroes.length} hero + ${result.gallery.length} gallery images, ${flagged.length} hero flags (${Date.now() - started} ms)`);
}
