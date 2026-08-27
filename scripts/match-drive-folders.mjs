/**
 * Finds the drive folder that holds each product's photography, and appends the hits to
 * docs/research/legacy/drive-match.json for import-drive-images.mjs to consume.
 *
 * WHY A SEPARATE PASS. The existing match table was built when only the products that
 * already had imagery were in scope, and it assumes `ROOT/<category>/<model>`. The 113
 * products still without a photograph sit deeper — `2-球锁/大档盖球锁/5874 ACET便宜货不锈钢/`
 * — and their folder names carry trade notes alongside the model. So this walks the tree
 * and matches on a normalised model token instead of on a fixed path shape.
 *
 * MATCHING RULE. A folder matches when its name, stripped of spaces, punctuation and
 * Chinese characters and upper-cased, starts with the product's model token treated the
 * same way. Anchoring at the start is what stops "587" from claiming "5874": a longer
 * digit run is a different model, never a variant of the shorter one. Where several
 * folders match, the shallowest wins — the deeper ones are finish variants of it.
 *
 * The year is read off the path: the client files re-shoots under `2026新拍` and keeps
 * the superseded set under `旧`. That lands in `shotYear` so a later pass can find the
 * stock that still needs re-photographing without opening a single image.
 *
 *   node scripts/match-drive-folders.mjs            # report
 *   node scripts/match-drive-folders.mjs --write    # append to drive-match.json
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = "F:/新网站资料";
const MATCH = "docs/research/legacy/drive-match.json";
const PRODUCTS = "content/products";
const write = process.argv.includes("--write");

/** 雷茵 is a third party and STAHLOCK is a sibling brand — neither is ours to publish. */
const SKIP = /^(雷茵|原图2?|诚信通\d*|HYLAND|stahlock|视频)$/i;
const IMG = /\.(jpe?g|png)$/i;

/** Model tokens and folder names compared on the same footing. */
const norm = (s) =>
  s
    .replace(/[\u4e00-\u9fff]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();

/** Directories the client uses to date a shoot. */
function shotYear(rel) {
  const hit = /(\d{4})\s*新拍/.exec(rel);
  if (hit) return Number(hit[1]);
  if (/(^|\/)旧(\/|$)/.test(rel)) return null; // superseded, year unknown
  return null;
}

/** Every directory under ROOT that directly contains at least one usable image. */
function walk(dir, rel = "", out = []) {
  let ents;
  try {
    ents = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  const files = ents.filter((e) => e.isFile() && IMG.test(e.name) && !e.name.startsWith("._"));
  if (files.length) out.push({ rel, images: files.length });
  for (const e of ents) {
    if (!e.isDirectory() || e.name.startsWith(".") || SKIP.test(e.name)) continue;
    walk(path.join(dir, e.name), rel ? `${rel}/${e.name}` : e.name, out);
  }
  return out;
}

const dirs = walk(ROOT);
console.log(`${dirs.length} drive folders hold images`);

const products = readdirSync(PRODUCTS).map((f) =>
  JSON.parse(readFileSync(path.join(PRODUCTS, f), "utf8")),
);
const missing = products.filter((p) => !p.heroImage?.src);
console.log(`${missing.length} products have no photograph`);

const table = JSON.parse(readFileSync(MATCH, "utf8"));
const already = new Set(table.matched.map((e) => e.slug));

const hits = [];
const misses = [];

for (const product of missing) {
  if (already.has(product.slug)) continue;
  const token = norm(product.model);
  if (token.length < 3) {
    misses.push(`${product.model} (token too short to match safely)`);
    continue;
  }

  /*
    The model folder is often not the one holding the files — the client puts the web
    set in a `图` child, and re-shoots in `2026新拍/<model>/`. So a directory belongs to
    a product when ANY segment of its path names the model, not just its leaf.
  */
  const candidates = dirs
    .filter((d) =>
      d.rel.split("/").some((segment) => {
        const seg = norm(segment);
        if (!seg.startsWith(token)) return false;
        // A longer digit run is a different model: 587 must not claim 5874.
        const next = seg.slice(token.length, token.length + 1);
        return !/\d/.test(next) || !/\d$/.test(token);
      }),
    )
    .sort(
      (a, b) =>
        // Newest shoot first, then the client's own `图` web set, then most images.
        (shotYear(b.rel) ?? 0) - (shotYear(a.rel) ?? 0) ||
        Number(/(^|\/)图$/.test(b.rel)) - Number(/(^|\/)图$/.test(a.rel)) ||
        b.images - a.images,
    );

  if (!candidates.length) {
    misses.push(product.model);
    continue;
  }
  const best = candidates[0];
  hits.push({
    cat: "",
    folder: best.rel,
    model: product.model,
    slug: product.slug,
    hasHero: false,
    images: best.images,
    shotYear: shotYear(best.rel),
  });
}

console.log(`\nmatched : ${hits.length}`);
console.log(`unmatched: ${misses.length}`);
for (const h of hits.slice(0, 20)) console.log(`  ${h.model.padEnd(14)} -> ${h.folder}  (${h.images} images${h.shotYear ? `, ${h.shotYear}` : ""})`);
if (misses.length) console.log(`\nno folder found:\n  ${misses.join("\n  ")}`);

if (write) {
  table.matched = [...table.matched, ...hits];
  writeFileSync(MATCH, `${JSON.stringify(table, null, 2)}\n`);
  console.log(`\nappended ${hits.length} entries to ${MATCH}`);
} else {
  console.log("\nReport only. Re-run with --write to append.");
}
