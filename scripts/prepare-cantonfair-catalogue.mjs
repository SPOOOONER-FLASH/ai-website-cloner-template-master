#!/usr/bin/env node
/**
 * Prepare source-faithful assets for the Canton Fair catalogue.
 * No cutout, AI, geometry edits, invented sets, or frozen editorial assets.
 * PNGs retain decoded source pixels; the digital edition uses smaller JPEGs.
 * Run this before build-cantonfair-catalogue.py. Originals remain untouched.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "tmp/codex-cantonfair-catalogue/assets");
const reportDir = join(root, "docs/catalogues/2026-canton-fair");
mkdirSync(out, { recursive: true });
mkdirSync(reportDir, { recursive: true });
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
const categories = JSON.parse(readFileSync(join(root, "content/categories.json"), "utf8")).categories;
const settings = JSON.parse(readFileSync(join(root, "content/site-settings.json"), "utf8"));
const records = readdirSync(join(root, "content/products"))
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => JSON.parse(readFileSync(join(root, "content/products", name), "utf8")))
  .filter((p) => !p.sites || p.sites.includes("hyde"));
const withheld = [];
const products = [];
for (const p of records) {
  if (!p.heroImage?.src) {
    withheld.push({ model: p.model, slug: p.slug, reason: "No published source image" });
    continue;
  }
  let src = p.heroImage.src;
  if (src.startsWith("/images/products/")) {
    const branded = src.replace("/images/products/", "/images/products-hyde/");
    if (existsSync(join(root, "public", branded))) src = branded;
  }
  const source = join(root, "public", src);
  if (!existsSync(source)) throw new Error(`Missing source for ${p.model}: ${source}`);
  const bytes = readFileSync(source);
  const hash = digest(bytes);
  const meta = await sharp(bytes).metadata();
  const png = `${p.slug}.png`;
  const jpg = `${p.slug}.jpg`;
  const printJpg = `${p.slug}-print.jpg`;
  // Retain all source content, including existing dimension annotations and kit parts.
  await sharp(bytes).flatten({ background: "#ffffff" }).png().toFile(join(out, png));
  await sharp(bytes).flatten({ background: "#ffffff" })
    .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(join(out, printJpg));
  await sharp(bytes).flatten({ background: "#ffffff" })
    .resize(700, 700, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true }).toFile(join(out, jpg));
  products.push({
    ...p,
    catalogueAsset: { png, jpg, printJpg, source: `public${src}`, sourceSha256: hash,
      width: meta.width, height: meta.height, method: "Full source image; format conversion only" },
  });
}
const logoSource = "public/images/brand/hyde/hyde-logo-horizontal-black.svg";
await sharp(join(root, logoSource)).resize(1200).png().toFile(join(out, "hyde-logo.png"));
const manifest = { edition: "Canton Fair 2026 / October design review", sourceDate: "2026-10-08",
  originalLibraryMounted: existsSync("G:/新网站资料"), siteUrl: "https://cantonlock.com",
  settings, categories, products, withheld };
writeFileSync(join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(join(reportDir, "source-register.json"), `${JSON.stringify({
  edition: manifest.edition, sourceDate: manifest.sourceDate,
  originalLibraryMounted: manifest.originalLibraryMounted,
  publishedProducts: products.length, withheldProducts: withheld.length,
  logo: { source: logoSource, sourceSha256: digest(readFileSync(join(root, logoSource))) },
  products: products.map((p) => ({ model: p.model, slug: p.slug, category: p.categoryPath[0], ...p.catalogueAsset })),
  withheld,
}, null, 2)}\n`);
console.log(`${products.length} HYDE records prepared; ${withheld.length} withheld without imagery. Sources unchanged.`);
