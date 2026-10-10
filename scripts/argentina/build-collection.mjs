#!/usr/bin/env node
/*
  Build the Argentina collection (client 2026-10-10: 「阿根廷产品大集合」) from the crawl in
  tmp/claude-argentina/: src/data/generated/argentina-collection.json plus 720px webp in
  public/images/argentina-collection/.

  Candex and Elabora are HYDE's OEM customers on HYDE moulds; the client states both
  authorised the use of their photographs and copy. Their names never reach the page —
  `source` stays in the data for traceability only.

  Order of work:
    node scripts/argentina/crawl-candex.mjs
    node scripts/argentina/prepare-collection-images.mjs
    node scripts/watermark-product-images.mjs --all --input-root=../claude-argentina/webp \
      --output-root=../claude-argentina/branded --manifest=../claude-argentina/branded/manifest.json
    node scripts/argentina/build-collection.mjs
*/
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { parseCandex } from "./parse-candex.mjs";

const TMP = join("..", "claude-argentina");
const IMG_OUT = join("public", "images", "argentina-collection");
mkdirSync(IMG_OUT, { recursive: true });

const ELABORA = [
  { model: "110", group: "mortise", faceplate: "210 × 25", centres: "67", case: "125 × 65" },
  { model: "110-frente-chico", label: "110 FC", group: "mortise", faceplate: "190 × 20", centres: "67", case: "125 × 63" },
  { model: "111", group: "mortise", faceplate: "220 × 25", centres: "72", case: "140 × 64" },
  { model: "111-doble-perno", label: "111 DP", group: "mortise", faceplate: "220 × 25", centres: "72", case: "140 × 64" },
  { model: "101", group: "mortise", faceplate: "183 × 18", centres: "72", case: "— × 63" },
  { model: "102", group: "mortise", faceplate: "210 × 25", centres: "68", case: "— × 63" },
  { model: "140", group: "aluminium", faceplate: "190 × 20", centres: "71", case: "125 × 40" },
  { model: "1140", group: "aluminium", faceplate: "240 × 24", centres: "91", case: "175 × 40" },
  { model: "1121", group: "deadlock", faceplate: "140 × 25", case: "81 × 65" },
  { model: "1122", group: "deadlock", faceplate: "140 × 25", case: "81 × 65" },
];

function candexGroup(p) {
  if (/corrediza|cortina/i.test(p.category) || /123|cortina/i.test(p.slug)) return "sliding";
  if (/batientes angost/i.test(p.description)) return "aluminium";
  if (/cerrojo/i.test(p.category)) return "deadlock";
  return "mortise";
}

async function image(file, id) {
  await sharp(join(TMP, "branded", file)).resize(720, 720).webp({ quality: 84 }).toFile(join(IMG_OUT, `${id}.webp`));
  return `/images/argentina-collection/${id}.webp`;
}

const items = [];
for (const p of JSON.parse(readFileSync(join(TMP, "raw", "candex.json"), "utf8"))) {
  const id = `ar5-${p.slug.replace(/^(cerradura|cerrojo|puerta|cortina-metalica)-/, "")}`;
  const nameEs = p.title.replace(/\s+/g, " ").trim();
  items.push({
    id, source: "candex", sourceUrl: p.url, group: candexGroup(p),
    model: `AR5-${nameEs.match(/\d+|Due/i)?.[0] ?? "?"}`, nameEs,
    headlineEs: p.description.split("\n")[0], descriptionEs: p.description,
    specs: parseCandex(p.description), image: await image(`candex-${p.slug}.webp`, id),
  });
}
for (const e of ELABORA) {
  const id = `ar4-${e.model}`;
  items.push({
    id, source: "elabora", group: e.group, model: `AR4-${e.label ?? e.model}`, drawing: true,
    specs: [
      { key: "faceplate", value: `${e.faceplate} mm` },
      ...(e.centres ? [{ key: "centres", value: `${e.centres} mm` }] : []),
      { key: "case", value: `${e.case} mm` },
    ],
    image: await image(`elabora-${e.model}.webp`, id),
  });
}
writeFileSync(join("src", "data", "generated", "argentina-collection.json"), JSON.stringify(items, null, 2) + "\n");
console.log(`${items.length} items: ${Object.entries(items.reduce((a, i) => ({ ...a, [i.group]: (a[i.group] ?? 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(", ")}`);
