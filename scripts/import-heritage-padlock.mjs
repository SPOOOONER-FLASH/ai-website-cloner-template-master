#!/usr/bin/env node
/**
 * Imports the principal's photographs of the padlock he found in Germany.
 *
 *   node scripts/import-heritage-padlock.mjs <source-directory>
 *   node scripts/import-heritage-padlock.mjs --check
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IMPORTS, AND WHAT IT REFUSES TO
 *
 * Four photographs, and only photographs:
 *
 *   cutout-chain   the lock and its chain, cut out on white — the article hero
 *   cutout-front   square on, where the eight rivets and the keyhole read clearest
 *   in-situ        the close-up on the stone plinth, as taken
 *   knight         the wide shot of the cast knight outside the hotel
 *
 * The last one is not decoration. It is the evidence for every provenance sentence in
 * the article — that this is a found object on a German street and not a Canton Hyland
 * product — and an article that makes a claim while withholding the photograph that
 * supports it is doing the thing this article is about.
 *
 * ⚠ THE PENCIL DRAWING IS NOT IN THE LIST, ON PURPOSE.
 *
 * The client's principal also sent an engraved/pencil rendering of the same lock and
 * asked for it on the site. It is a generated redraw of a real object. It is not a
 * product we sell, so the usual test — could a buyer take this to a workshop and order
 * the part — does not apply, and nobody is going to be misled about a padlock bolted to
 * a statue.
 *
 * It is left out for a different reason: the article's entire argument is that we do not
 * invent what we cannot verify, and the paragraph that carries it says so about this
 * exact object. Illustrating that with a picture a machine drew would cost more than the
 * image is worth. If the principal still wants it, it can run — but captioned as a
 * drawing, below the photographs, never as the hero, and that is his call to make
 * explicitly rather than ours to make quietly. See docs/collaboration/OPEN-ITEMS.md.
 *
 * ---------------------------------------------------------------------------
 * Cleaning up a real photograph is allowed and is the whole job here: WebP encoding,
 * resizing, and padding the hero to 16:9 so the news frame does not crop it. Nothing is
 * cropped, recoloured or composed. Each output gets a sidecar recording what it came
 * from, the same way public/images/editorial/*.webp.json does, so the branding pass in
 * scripts/build-branded-editorial-list.mjs can see it is a real photograph.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = "public/images/editorial/heritage";
const RECORD = "content/news/what-an-old-padlock-tells-a-lock-factory.json";
const HERO_FRAME = 16 / 9;

/** Expected source filenames, in the order they should appear on the page. */
const PHOTOGRAPHS = [
  {
    id: "padlock-germany-chain",
    source: "cutout-chain",
    hero: true,
    label:
      "The padlock and its chain, cut out from the principal's photograph — eight domed rivets, a staple shackle and an engraved oval escutcheon",
    labelEs:
      "El candado y su cadena, recortados de la fotografía del director — ocho remaches abombados, un arco de grapa y un escudo ovalado grabado",
  },
  {
    id: "padlock-germany-front",
    source: "cutout-front",
    label:
      "Square on: the pin standing in the middle of the keyhole is what tells you this takes a hollow barrel key, not a cylinder",
    labelEs:
      "De frente: el pivote en el centro del bocallave es lo que indica que admite una llave de tubo hueca, no un cilindro",
  },
  {
    id: "padlock-germany-in-situ",
    source: "in-situ",
    label: "As found, on the stone plinth — the chain is slack and the lock secures nothing",
    labelEs:
      "Tal como se encontró, sobre el zócalo de piedra — la cadena está floja y el candado no asegura nada",
  },
  {
    id: "padlock-germany-knight",
    source: "knight",
    label:
      "Where it lives: chained around the ankles of a cast knight outside a hotel in Germany, whose shield claims the year 998",
    labelEs:
      "Dónde vive: encadenado a los tobillos de un caballero fundido a la puerta de un hotel en Alemania, cuyo escudo reclama el año 998",
  },
];

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"];

function findSource(directory, stem) {
  for (const extension of EXTENSIONS) {
    const path = join(directory, `${stem}${extension}`);
    if (existsSync(path)) return path;
  }
  return undefined;
}

const check = process.argv.includes("--check");
const directory = process.argv.slice(2).find((argument) => !argument.startsWith("--"));

if (check) {
  const record = JSON.parse(readFileSync(RECORD, "utf8"));
  const wanted = [record.heroImage?.src, ...(record.gallery ?? []).map((image) => image.src)]
    .filter(Boolean)
    .filter((source) => source.includes("/heritage/"));

  const missing = wanted.filter((source) => !existsSync(`public${source}`));
  if (missing.length) {
    console.error(`❌ heritage photographs referenced but not present:\n  ${missing.join("\n  ")}`);
    process.exit(1);
  }
  console.log(
    wanted.length
      ? `heritage padlock — ${wanted.length} photographs present`
      : "heritage padlock — article still has no photographs (draft)",
  );
  process.exit(0);
}

if (!directory) {
  console.error("Usage: node scripts/import-heritage-padlock.mjs <source-directory>");
  console.error("Expected files (any of .jpg .jpeg .png .webp):");
  for (const photograph of PHOTOGRAPHS) console.error(`  ${photograph.source}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const record = JSON.parse(readFileSync(RECORD, "utf8"));
const gallery = [];
let heroSource;

for (const photograph of PHOTOGRAPHS) {
  const source = findSource(directory, photograph.source);
  if (!source) {
    console.error(`  missing source: ${photograph.source}`);
    continue;
  }

  const bytes = readFileSync(source);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const publicPath = `/images/editorial/heritage/${photograph.id}.webp`;
  const target = `public${publicPath}`;

  /* Encode only. No crop, no colour move — this is a photograph, not a composition. */
  const meta = await sharp(bytes).metadata();
  const wide = Math.min(meta.width, 2000);
  await sharp(bytes).resize({ width: wide, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(target);

  writeFileSync(
    `${target}.json`,
    `${JSON.stringify(
      {
        kind: "real-photograph-as-supplied",
        approvedUse:
          "Client's principal photographed this padlock on a street in Germany and asked for it on the site, 2026-09-15.",
        sources: [{ file: photograph.source, sha256 }],
        processing: "WebP encoding and downscaling only; no crop, recolour or composition.",
        limitation:
          "A found object, not a Canton Hyland product. Maker, date and country are unknown and are not claimed anywhere.",
      },
      null,
      2,
    )}\n`,
  );

  if (photograph.hero) {
    /* Pad to the 16:9 news frame rather than letting the card crop the lock. */
    const framed = `/images/editorial/heritage/${photograph.id}-16x9.webp`;
    const padded = await sharp(target).metadata();
    const width = padded.width / padded.height < HERO_FRAME ? Math.round(padded.height * HERO_FRAME) : padded.width;
    const height = padded.width / padded.height < HERO_FRAME ? padded.height : Math.round(padded.width / HERO_FRAME);
    await sharp(target)
      .resize({ width, height, fit: "contain", background: { r: 255, g: 255, b: 255 } })
      .webp({ quality: 84, effort: 6 })
      .toFile(`public${framed}`);
    heroSource = { src: framed, ratio: "16 / 9", label: photograph.label, labelEs: photograph.labelEs };
    console.log(`  ${photograph.id}: hero ${padded.width}×${padded.height} → ${width}×${height}`);
  } else {
    gallery.push({ src: publicPath, ratio: "4 / 3", label: photograph.label, labelEs: photograph.labelEs });
    console.log(`  ${photograph.id}: ${meta.width}×${meta.height} → ${wide}px wide`);
  }
}

if (!heroSource) {
  console.error("❌ no hero photograph imported; the article stays a draft.");
  process.exit(1);
}

record.heroImage = heroSource;
record.gallery = gallery;
delete record.draft;
writeFileSync(RECORD, `${JSON.stringify(record, null, 2)}\n`);

console.log(`heritage padlock — ${gallery.length + 1} photographs imported, article is no longer a draft.`);
