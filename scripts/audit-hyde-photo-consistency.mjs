#!/usr/bin/env node
/**
 * Read-only audit of the catalogue-source images used by HYDE product records.
 *
 * This measures apparent foreground geometry only on images with a demonstrably
 * uniform white edge or transparent edge. It never edits a photograph, infers
 * physical dimensions, or claims that a source image is a camera photograph.
 * Existing legacy-logo exclusion rectangles come from the watermark manifest;
 * if the rectangle may touch the product, the image goes to manual review.
 *
 * node scripts/audit-hyde-photo-consistency.mjs --write
 * node scripts/audit-hyde-photo-consistency.mjs --check
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const PRODUCT_DIR = resolve(ROOT, "content/products");
const MANIFEST = resolve(ROOT, "docs/design-references/product-watermark-manifest.json");
const CSV = resolve(ROOT, "docs/design-references/hyde-photo-consistency-audit.csv");
const MD = resolve(ROOT, "docs/design-references/hyde-photo-consistency-audit.md");
const SIZE = 256;
const PIXELS = SIZE * SIZE;
const args = new Set(process.argv.slice(2));

if ([...args].some((arg) => !["--write", "--check"].includes(arg)) || (args.has("--write") && args.has("--check"))) {
  console.error("Usage: node scripts/audit-hyde-photo-consistency.mjs [--write | --check]");
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const repairBySource = new Map(manifest.files.map((entry) => [entry.source.replaceAll("\\", "/"), entry.repair ?? null]));

function isWhite(r, g, b) {
  return Math.min(r, g, b) >= 246 && Math.max(r, g, b) - Math.min(r, g, b) <= 8;
}

function isForeground(r, g, b) {
  return Math.min(r, g, b) < 238 || Math.max(r, g, b) - Math.min(r, g, b) > 12;
}

function exclusionRectangle(repair, width, height) {
  const region = repair?.region;
  if (!region || ![region.left, region.top, region.width, region.height].every(Number.isFinite)) return null;
  return {
    left: Math.max(0, Math.floor(region.left * SIZE / width)),
    top: Math.max(0, Math.floor(region.top * SIZE / height)),
    right: Math.min(SIZE, Math.ceil((region.left + region.width) * SIZE / width)),
    bottom: Math.min(SIZE, Math.ceil((region.top + region.height) * SIZE / height)),
  };
}

function isExcluded(x, y, exclusion) {
  return exclusion && x >= exclusion.left && x < exclusion.right && y >= exclusion.top && y < exclusion.bottom;
}

function componentsOf(mask) {
  const visited = new Uint8Array(PIXELS);
  const queue = new Int32Array(PIXELS);
  const components = [];
  for (let start = 0; start < PIXELS; start += 1) {
    if (!mask[start] || visited[start]) continue;
    let head = 0;
    let tail = 1;
    queue[0] = start;
    visited[start] = 1;
    const bounds = { area: 0, left: SIZE, top: SIZE, right: -1, bottom: -1 };
    while (head < tail) {
      const index = queue[head++];
      const x = index % SIZE;
      const y = Math.floor(index / SIZE);
      bounds.area += 1;
      bounds.left = Math.min(bounds.left, x);
      bounds.top = Math.min(bounds.top, y);
      bounds.right = Math.max(bounds.right, x);
      bounds.bottom = Math.max(bounds.bottom, y);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) continue;
          const neighbor = ny * SIZE + nx;
          if (mask[neighbor] && !visited[neighbor]) {
            visited[neighbor] = 1;
            queue[tail++] = neighbor;
          }
        }
      }
    }
    if (bounds.area >= 20) components.push(bounds); // Ignore JPEG/WebP specks, not detached pieces.
  }
  return components.sort((a, b) => b.area - a.area);
}

function measure(raw, repair, width, height) {
  const exclusion = exclusionRectangle(repair, width, height);
  const mask = new Uint8Array(PIXELS);
  let edgeCount = 0;
  let whiteEdge = 0;
  let clearEdge = 0;
  let clearPixels = 0;
  let opaquePixels = 0;
  let consideredPixels = 0;
  let nearExclusion = 0;
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (isExcluded(x, y, exclusion)) continue;
      consideredPixels += 1;
      const i = y * SIZE + x;
      const offset = i * 4;
      const r = raw[offset];
      const g = raw[offset + 1];
      const b = raw[offset + 2];
      const a = raw[offset + 3];
      if (a <= 8) clearPixels += 1;
      if (a >= 250) opaquePixels += 1;
      if (x < 8 || x >= SIZE - 8 || y < 8 || y >= SIZE - 8) {
        edgeCount += 1;
        if (a <= 8) clearEdge += 1;
        if (a >= 250 && isWhite(r, g, b)) whiteEdge += 1;
      }
    }
  }

  const edgeWhite = edgeCount ? whiteEdge / edgeCount : 0;
  const edgeClear = edgeCount ? clearEdge / edgeCount : 0;
  const background = edgeClear >= 0.98 && clearPixels >= consideredPixels * 0.01
    ? "transparent"
    : edgeWhite >= 0.98 && opaquePixels >= consideredPixels * 0.98
      ? "white"
      : "other / uncertain";
  if (background === "other / uncertain") {
    return { status: "manual", reason: "edge is not uniformly white or transparent", background, edgeWhite, edgeClear };
  }

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (isExcluded(x, y, exclusion)) continue;
      const i = y * SIZE + x;
      const offset = i * 4;
      const r = raw[offset];
      const g = raw[offset + 1];
      const b = raw[offset + 2];
      const a = raw[offset + 3];
      mask[i] = Number(background === "transparent" ? a >= 32 : a >= 250 && isForeground(r, g, b));
      if (mask[i] && exclusion &&
          x >= exclusion.left - 2 && x <= exclusion.right + 1 &&
          y >= exclusion.top - 2 && y <= exclusion.bottom + 1) nearExclusion += 1;
    }
  }

  const components = componentsOf(mask);
  const significant = components.filter((component) => component.area >= PIXELS * 0.001);
  const totalArea = components.reduce((total, component) => total + component.area, 0);
  if (totalArea < PIXELS * 0.005) {
    return { status: "manual", reason: "foreground too small to segment reliably", background, edgeWhite, edgeClear };
  }
  if (totalArea > PIXELS * 0.75) {
    return { status: "manual", reason: "foreground covers most of the canvas", background, edgeWhite, edgeClear };
  }
  if (nearExclusion > 20) {
    return { status: "manual", reason: "known logo exclusion may touch product", background, edgeWhite, edgeClear };
  }
  if (!exclusion && significant.some((component) =>
    component.left < SIZE * 0.3 && component.right < SIZE * 0.3 &&
    component.top < SIZE * 0.2 && component.bottom < SIZE * 0.2 &&
    significant.some((other) => other.area > component.area * 4))) {
    return { status: "manual", reason: "possible separate corner logo or label", background, edgeWhite, edgeClear };
  }

  const bounds = components.reduce((box, component) => ({
    left: Math.min(box.left, component.left),
    top: Math.min(box.top, component.top),
    right: Math.max(box.right, component.right),
    bottom: Math.max(box.bottom, component.bottom),
  }), { left: SIZE, top: SIZE, right: -1, bottom: -1 });
  const boxWidth = (bounds.right - bounds.left + 1) / SIZE;
  const boxHeight = (bounds.bottom - bounds.top + 1) / SIZE;
  const baseline = (bounds.bottom + 1) / SIZE;
  const centerOffset = ((bounds.left + bounds.right + 1) / 2 - SIZE / 2) / SIZE;
  const flags = [];
  if (boxWidth * boxHeight < 0.30) flags.push("small bounding box");
  if (baseline < 0.78) flags.push("high visual baseline");
  if (Math.abs(centerOffset) > 0.10) flags.push("off-center");
  if (bounds.left < 2 || bounds.top < 2 || bounds.right >= SIZE - 2 || bounds.bottom >= SIZE - 2) flags.push("touches canvas edge");
  return {
    status: "measured", reason: "", background, edgeWhite, edgeClear,
    boxWidth, boxHeight, boxArea: boxWidth * boxHeight,
    foregroundArea: totalArea / PIXELS, baseline, centerOffset,
    componentCount: significant.length, flags,
  };
}

function csvCell(value) {
  const string = String(value ?? "");
  return /[",\r\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function pct(value) {
  return Number.isFinite(value) ? (100 * value).toFixed(1) : "";
}

async function analyseReference(ref) {
  const base = { ...ref, status: "manual", reason: "", background: "", repair: "", edgeWhite: "", edgeClear: "" };
  if (!ref.src?.startsWith("/images/products/") || ref.src.includes("..")) {
    return { ...base, reason: "not a catalogue-source product image" };
  }
  const relative = `public${ref.src}`;
  const absolute = resolve(ROOT, relative);
  if (!existsSync(absolute)) return { ...base, reason: "source file missing" };
  const repair = repairBySource.get(relative);
  try {
    const original = await sharp(absolute).metadata();
    const { data } = await sharp(absolute)
      .resize(SIZE, SIZE, { fit: "fill" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    return { ...base, repair: repair?.mode ?? "none", ...measure(data, repair, original.width, original.height) };
  } catch (error) {
    return { ...base, reason: `decode failed: ${error.message}` };
  }
}

const refs = [];
let eligibleProducts = 0;
for (const file of readdirSync(PRODUCT_DIR).filter((entry) => entry.endsWith(".json")).sort()) {
  const product = JSON.parse(readFileSync(resolve(PRODUCT_DIR, file), "utf8"));
  if (product.sites && !product.sites.includes("hyde")) continue;
  eligibleProducts += 1;
  for (const [index, image] of [product.heroImage, ...(product.gallery ?? [])].entries()) {
    if (!image?.src) continue;
    refs.push({
      model: product.model ?? "", slug: product.slug ?? file.replace(/\.json$/, ""),
      category: product.categoryPath?.[0] ?? "", role: index === 0 ? "hero" : `gallery ${index}`,
      src: image.src,
    });
  }
}

const rows = [];
const CONCURRENCY = 8;
for (let start = 0; start < refs.length; start += CONCURRENCY) {
  rows.push(...await Promise.all(refs.slice(start, start + CONCURRENCY).map(analyseReference)));
}

const columns = ["model", "slug", "category", "role", "src", "status", "reason", "background", "repair", "edgeWhitePct", "edgeTransparentPct", "bboxWidthPct", "bboxHeightPct", "bboxAreaPct", "foregroundAreaPct", "visualBaselinePct", "horizontalCenterOffsetPct", "significantComponents", "reviewFlags"];
const csv = [columns.join(","), ...rows.map((row) => [
  row.model, row.slug, row.category, row.role, row.src, row.status, row.reason, row.background, row.repair,
  pct(row.edgeWhite), pct(row.edgeClear), pct(row.boxWidth), pct(row.boxHeight), pct(row.boxArea),
  pct(row.foregroundArea), pct(row.baseline), pct(row.centerOffset), row.componentCount, row.flags?.join("; "),
].map(csvCell).join(","))].join("\n") + "\n";

const measured = rows.filter((row) => row.status === "measured");
const manual = rows.filter((row) => row.status === "manual");
const flagged = measured.filter((row) => row.flags?.length);
const heroFlags = flagged.filter((row) => row.role === "hero").sort((a, b) => b.flags.length - a.flags.length || a.slug.localeCompare(b.slug));
const reasons = Object.entries(manual.reduce((counts, row) => {
  counts[row.reason] = (counts[row.reason] ?? 0) + 1;
  return counts;
}, {})).sort((a, b) => b[1] - a[1]);
const md = [
  "# HYDE catalogue-source photo consistency audit",
  "",
  "Generated from `content/products/*.json` (HYDE or shared records), their hero/gallery image references, and the original files under `public/images/products/`. Run `node scripts/audit-hyde-photo-consistency.mjs --write` to regenerate; `--check` compares both reports without changing files. No images or product records are modified.",
  "",
  `- HYDE/shared product records: **${eligibleProducts}**; **${new Set(rows.map((row) => row.slug)).size}** have referenced hero/gallery images, totaling **${rows.length}** image references.`,
  `- Measured on a strictly white or transparent edge: **${measured.length}** (including **${measured.filter((row) => row.repair !== "none").length}** with a documented legacy-logo exclusion).`,
  `- Needs human review because the background or silhouette is uncertain: **${manual.length}**.`,
  `- Measured images with at least one layout review flag: **${flagged.length}**; flagged hero images: **${heroFlags.length}**. These are **review candidates, not defects**.`,
  "",
  "## What the measurements mean",
  "",
  "The source is resized to a 256×256 analysis grid. Transparent images require a nearly clear edge; white images require ≥98% near-white edge pixels. For a white image, foreground means pixels below RGB 238 or with color spread above 12. Tiny compression specks are ignored. The existing watermark manifest supplies exact legacy-logo rectangles to exclude; suspected unlisted corner marks and logo exclusions touching the silhouette go to manual review. The bounding-box area and darker/color foreground area are percentages of the canvas; the visual baseline is the bottom of the visible silhouette as a percentage of canvas height. Detached keys, escutcheons, shadows and labels can change this visual measure. It is **not** an engineering dimension, product area, physical baseline, or proof that an image is a factory photograph.",
  "",
  "Review flags are intentionally loose triage rules: bounding box below 30%, visual baseline above the 22% lower margin, center offset over 10%, or silhouette touching the image edge. Different product shapes and orientations cannot be compared by one occupancy target. Open the actual photograph before changing crop or padding. The existing `scripts/audit-image-fit.mjs` checks cropping in fixed site frames; it does not segment a product, measure its margins, or verify a white background. This report fills that measurement gap without changing that build guard.",
  "",
  "## Manual-review reasons",
  "",
  "| Reason | Images |",
  "|---|---:|",
  ...reasons.map(([reason, count]) => `| ${reason.replaceAll("|", "\\|")} | ${count} |`),
  "",
  "## First flagged hero images to inspect",
  "",
  "| Model | Source | Box area | Baseline | Flags |",
  "|---|---|---:|---:|---|",
  ...heroFlags.slice(0, 30).map((row) => `| ${row.model} | \`${row.src}\` | ${pct(row.boxArea)}% | ${pct(row.baseline)}% | ${row.flags.join(", ")} |`),
  "",
  "The complete image-by-image evidence is in [hyde-photo-consistency-audit.csv](hyde-photo-consistency-audit.csv). CSV values are estimates suitable for prioritising a visual review. Product authenticity, correct model/finish, hole positions, and product-set compatibility still require Product Finder or factory source evidence.",
  "",
].join("\n");

if (args.has("--write")) {
  writeFileSync(CSV, csv);
  writeFileSync(MD, md);
} else if (args.has("--check")) {
  const stale = !existsSync(CSV) || !existsSync(MD) || readFileSync(CSV, "utf8") !== csv || readFileSync(MD, "utf8") !== md;
  if (stale) {
    console.error("HYDE photo consistency audit report is stale. Run with --write.");
    process.exitCode = 1;
  }
}

console.log(`HYDE product images: ${rows.length}; measured ${measured.length}; manual ${manual.length}; layout review candidates ${flagged.length}.`);
console.log(`Reports: ${CSV}; ${MD}`);
