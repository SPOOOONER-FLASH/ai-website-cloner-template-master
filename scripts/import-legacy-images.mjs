/**
 * Imports the legacy site's product photography into public/images/products/ and
 * attaches it to the product records as gallery views.
 *
 * Scope, decided with the client:
 *
 *   ✅ The 2024 and 2026 uploads (023 ETAN, 314, 317) — clean shots carrying only the
 *      corner Hyland mark, at 800–1000px square.
 *   ❌ The 2022 uploads (305, 320, 600) — those additionally carry a diagonal repeating
 *      domain watermark across the product itself ("www.cantonlock.com", and on 600
 *      "www.hydeland.cn", a different brand's domain). Unusable; the client is being
 *      asked for originals. See docs/research/legacy/image-status.csv.
 *
 * `heroImage` is never touched. The existing heroes came from the client's own asset
 * pack and were reviewed; these land as additional views, which is what the product
 * pages were showing an empty state for.
 *
 *   node scripts/import-legacy-images.mjs            # dry run
 *   node scripts/import-legacy-images.mjs --write    # download, convert, attach
 */
import { readFileSync, writeFileSync, statSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const write = process.argv.includes("--write");
const force = process.argv.includes("--force");
const OUT_DIR = "public/images/products";

/**
 * Every entry was checked by eye against a contact sheet before being listed here, and
 * the two exclusions are recorded rather than silently dropped:
 *
 *   023-etan-4  a cold-store doorway photo sitting on the 023 ETAN page — wrong product
 *   314-1       a parts-laid-out shot 9.7 mean-greyscale from the existing hero; keeping
 *               it would put the same picture on the page twice
 */
const IMPORTS = [
  {
    slug: "023-etan-anti-pick-panic-exit-device",
    views: [
      { file: "2-240401104431554.jpg", label: "Hyland 023 ETAN keyed exterior trim with lever handle and cylinder" },
      { file: "2-240401104433P5.jpg", label: "023 ETAN trim seen from the mounting side, showing the backplate and spindle" },
      { file: "2-2404011044305H.jpg", label: "023 ETAN trim components: cylinder, spindle, fixing screws and mounting bracket" },
    ],
    date: "20240401",
  },
  {
    slug: "314-alarm-panic-bar-exit-device",
    views: [
      { file: "2-260F2155543a4.jpg", label: "Hyland 314 alarm panic bar, side elevation" },
      { file: "2-260F215554E17.jpg", label: "314 push bar showing the alarm module and end cap" },
      { file: "2-260F2160010595.jpg", label: "314 dimensional drawing with the size table for the 650, 800 and 1000 mm bars" },
      { file: "2-260F2155550R1.jpg", label: "Installation detail: the 314 alarm module with its cylinder being fitted" },
      { file: "2-260F215555RU.jpg", label: "A pair of 314 panic bars installed on double steel doors" },
    ],
    date: "20260702",
  },
  {
    slug: "317-cold-room-push-bar-exit-device",
    views: [
      { file: "2-260FQ62F9518.jpg", label: "Hyland 317 cold room push bar, angled view" },
      { file: "2-260FQ62G2251.jpg", label: "317 push bar from the reverse angle, showing the release mechanism" },
      { file: "2-260FQ62GHL.jpg", label: "317 dimensional drawing showing bar length and mounting centres" },
      { file: "2-260FQ62H4247.jpg", label: "317 inside-release bar being operated on a cold storage door" },
      { file: "2-260FQ62H2942.jpg", label: "317 supplied accessories: mounting bracket, connector, screw set and exit label" },
    ],
    date: "20260708",
  },
];

const BASE = "https://www.cantonlock.com/uploads/allimg";

/**
 * The existing 22 product images are 1000×1000 WebP averaging 21 KB, so new arrivals
 * match that. Sources are never upscaled — the 023 ETAN set is 800px at origin and
 * stays there; inventing pixels to hit a number would only soften the image.
 */
const MAX_EDGE = 1000;
const QUALITY = 82;

/**
 * Photographic views (a gloved hand on a cold-store door, a pair of doors in situ)
 * carry far more entropy than the white-background product shots, so a flat quality
 * setting puts them at 3× the size of everything else in the folder. Quality steps
 * down until the file fits the budget; dimensions are never reduced to get there,
 * because a soft 1000px image is worse than a slightly noisier one.
 */
const BUDGET_KB = 60;
const QUALITY_FLOOR = 62;

async function convert(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const img = sharp(buf);
  const meta = await img.metadata();
  const edge = Math.min(MAX_EDGE, Math.max(meta.width, meta.height));

  let quality = QUALITY;
  let kb = Infinity;

  while (true) {
    await sharp(buf)
      .resize(edge, edge, { fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toFile(destPath);
    kb = Math.round(statSync(destPath).size / 1024);
    if (kb <= BUDGET_KB || quality <= QUALITY_FLOOR) break;
    quality -= 6;
  }

  return { from: `${meta.width}×${meta.height}`, kb, quality };
}

if (write) mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
let bytes = 0;

for (const entry of IMPORTS) {
  const path = `content/products/${entry.slug}.json`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const gallery = [...(product.gallery ?? [])];
  const known = new Set(gallery.map((g) => g.src));

  console.log(`\n${product.model} — ${entry.slug}`);

  for (const [i, view] of entry.views.entries()) {
    const name = `${entry.slug}-${i + 2}.webp`;
    const src = `/images/products/${name}`;
    if (known.has(src) && !force) {
      console.log(`   = ${name} (already attached)`);
      continue;
    }

    if (write) {
      const { from, kb, quality } = await convert(`${BASE}/${entry.date}/${view.file}`, `${OUT_DIR}/${name}`);
      bytes += kb;
      console.log(`   + ${name}  ${from} → webp q${quality} ${kb}KB`);
    } else {
      console.log(`   + ${name}  ← ${view.file}`);
    }

    if (!known.has(src)) gallery.push({ src, ratio: "1 / 1", label: view.label });
    count++;
  }

  if (write) {
    product.gallery = gallery;
    writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

console.log(
  `\n${count} gallery views ${write ? `written (${bytes}KB total)` : "would be added"}.`,
);
if (!write) console.log("Dry run. Re-run with --write to apply.");
