#!/usr/bin/env node
/**
 * Tiles a directory of plates into one sheet so a person can look at the whole take.
 *
 * There is no pixel test that separates a good plate from a bad one here, and I spent
 * two attempts finding that out: a mortise-lock photo that is really a dimension drawing
 * (printed "85" and "25" callouts, arrows, a grey backdrop that survived the key) scores
 * the same as a genuine pull plate on every statistic I tried — pale-pixel fraction,
 * silhouette fill against its own bounding box, component count. Of course it does: a
 * lock case IS rectangular, and printed type is not a colour.
 *
 * So the take gets reviewed by eye, the way a photographic take always has been, and the
 * rejects go in an explicit list next to the composer rather than into a threshold that
 * would quietly start eating real parts the moment the catalogue changed.
 */

import { readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import sharp from "sharp";

export async function contactSheet(dir, out, { cols = 4, cell = 420, gap = 10 } = {}) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp")).sort();
  const rows = Math.ceil(files.length / cols);
  const cellH = Math.round(cell * 0.625);
  const W = cols * cell + (cols + 1) * gap;
  const H = rows * cellH + (rows + 1) * gap;

  const tiles = await Promise.all(
    files.map(async (f, i) => ({
      input: await sharp(join(dir, f)).resize(cell, cellH, { fit: "cover" }).png().toBuffer(),
      left: gap + (i % cols) * (cell + gap),
      top: gap + Math.floor(i / cols) * (cellH + gap),
    })),
  );

  mkdirSync(dirname(out), { recursive: true });
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 255, g: 255, b: 255 } } })
    .composite(tiles)
    .webp({ quality: 82 })
    .toFile(out);

  return { out, count: files.length, files };
}

if (process.argv[1]?.endsWith("contact-sheet.mjs")) {
  const [dir, out] = process.argv.slice(2);
  const r = await contactSheet(dir ?? "tmp/claude-editorial", out ?? "tmp/claude-editorial-sheet.webp");
  console.log(`${r.count} plate(s) -> ${r.out}`);
  r.files.forEach((f, i) => console.log(`  ${String(i + 1).padStart(2)}  ${f}`));
}
