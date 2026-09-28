#!/usr/bin/env node
/**
 * One 1200×675 (16:9) share image per article, for Google Discover and link previews.
 *
 * Client 2026-09-28 (Discover notes): cards want a large image at least 1200 px wide, 16:9,
 * under 500 KB. Of 82 guides and news articles, 40 had a square product plate as hero and
 * only 41 were 1200 px wide, so Discover would show them small or not at all.
 *
 * Made from the article's own hero photograph, never invented (AGENTS.md: never generate
 * a metal product). A wide photograph at least 1200 px across is cropped to 16:9 around
 * its centre; anything else is placed whole on a 16:9 field in its own border colour, so a
 * product plate keeps every hole and edge. Enlargement is capped at 1.5×.
 *
 * Writes public/images/share/<section>/<slug>.jpg and src/data/generated/article-share-images.json
 * (slug → file, with the source path and size so --check can tell when one is stale).
 *
 *   node scripts/build-article-share-images.mjs          write what is missing or stale
 *   node scripts/build-article-share-images.mjs --check  exit 1 if anything is missing or stale
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 675;
const MAX_BYTES = 500 * 1024;
const MANIFEST = "src/data/generated/article-share-images.json";
const CHECK = process.argv.includes("--check");

const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const next = {};
const stale = [];
let written = 0;

async function borderColour(file) {
  const { data, info } = await sharp(file).flatten({ background: "#ffffff" }).resize(64, 64, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < info.width; i++) px.push(i, (info.height - 1) * info.width + i);
  for (let j = 0; j < info.height; j++) px.push(j * info.width, j * info.width + info.width - 1);
  const median = (c) => px.map((p) => data[p * 3 + c]).sort((a, b) => a - b)[Math.floor(px.length / 2)];
  return { r: median(0), g: median(1), b: median(2) };
}

async function render(source, target) {
  const meta = await sharp(source).metadata();
  const ratio = meta.width / meta.height;
  let image;
  if (ratio >= 16 / 9 - 0.05 && meta.width >= W) {
    image = sharp(source).resize(W, H, { fit: "cover", position: "centre" });
  } else {
    const scale = Math.min(W / meta.width, H / meta.height, 1.5);
    const w = Math.round(meta.width * scale);
    const h = Math.round(meta.height * scale);
    const inner = await sharp(source).flatten({ background: "#ffffff" }).resize(w, h).toBuffer();
    image = sharp({ create: { width: W, height: H, channels: 3, background: await borderColour(source) } }).composite([
      { input: inner, left: Math.round((W - w) / 2), top: Math.round((H - h) / 2) },
    ]);
  }
  for (const quality of [84, 78, 70, 62]) {
    const buf = await image.clone().jpeg({ quality, mozjpeg: true }).toBuffer();
    if (buf.length <= MAX_BYTES || quality === 62) {
      mkdirSync(join(target, ".."), { recursive: true });
      writeFileSync(target, buf);
      return buf.length;
    }
  }
}

for (const section of ["guides", "news"]) {
  for (const f of readdirSync(join("content", section)).filter((x) => x.endsWith(".json"))) {
    const article = JSON.parse(readFileSync(join("content", section, f), "utf8"));
    const src = article.heroImage?.src;
    if (!src) continue;
    const source = join("public", src);
    if (!existsSync(source)) continue;
    const st = statSync(source);
    const file = `/images/share/${section}/${article.slug}.jpg`;
    const key = `${section}/${article.slug}`;
    const entry = { file, src, size: st.size };
    next[key] = entry;
    const old = previous[key];
    const upToDate = old && old.src === src && old.size === st.size && existsSync(join("public", file));
    if (upToDate) {
      next[key] = old;
      continue;
    }
    if (CHECK) {
      stale.push(key);
      continue;
    }
    await render(source, join("public", file));
    written++;
  }
}

if (CHECK) {
  if (stale.length) {
    console.error(`${stale.length} article share images missing or stale — run node scripts/build-article-share-images.mjs`);
    console.error(stale.slice(0, 10).join("\n"));
    process.exit(1);
  }
  console.log(`article share images up to date (${Object.keys(next).length})`);
} else {
  mkdirSync("src/data/generated", { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(next, null, 1) + "\n");
  console.log(`${written} written, ${Object.keys(next).length} articles → ${MANIFEST}`);
}
