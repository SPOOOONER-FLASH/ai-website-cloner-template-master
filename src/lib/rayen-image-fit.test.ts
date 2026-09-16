import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * A photograph rendered with object-cover sits in a frame of its own shape.
 *
 * WHY THIS FILE EXISTS
 * object-cover does not fail. It fills the frame, silently discards whatever does not fit,
 * and produces a page that looks designed. The seven factory photographs are square files
 * and sat in 4 / 3 frames for weeks: every one of them lost 12.5% off the top and 12.5% off
 * the bottom, and nothing anywhere said so. The catalogue covers were worse — portraits of
 * tall pull handles, close to half the height gone, on the products index.
 *
 * So the rule this checks is not "pick a nice ratio". It is: if you crop, crop nothing.
 * A frame whose ratio differs from the file's must say `fit="contain"` and pad instead.
 */

const OUT = "out-rayen";
const built = existsSync(OUT);
const DIMS: Record<string, [number, number]> = JSON.parse(
  readFileSync("src/data/generated/rayen-image-dims.json", "utf8"),
);

/* Two ways a frame gets written here: an aspect-ratio box with the <img> inside it, and an
   <img> that carries the ratio itself as a Tailwind class. Both crop; both are checked. */
const BOXED = /style="aspect-ratio:([^"]+)"[^>]*>\s*<img([^>]+)>/g;
const SELF = /<img([^>]*class="[^"]*aspect-square[^"]*"[^>]*)>/g;

function* frames(html: string): Generator<[string, string]> {
  for (const [, aspect, attrs] of html.matchAll(BOXED)) yield [aspect, attrs];
  for (const [, attrs] of html.matchAll(SELF)) yield ["1 / 1", attrs];
}

function pages(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pages(full));
    else if (entry.name === "index.html") out.push(full);
  }
  return out;
}

function ratioOf(text: string): number | null {
  const [a, b] = text.split("/").map((part) => Number(part.trim()));
  return Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b : null;
}

test("object-cover 的图框比例必须等于图片本身的比例", { skip: !built }, () => {
  const cropped = new Map<string, string>();
  for (const file of pages(OUT)) {
    const html = readFileSync(file, "utf8");
    for (const [aspect, attrs] of frames(html)) {
      if (!/object-cover/.test(attrs)) continue; // contain pads; nothing to check
      const src = /src="([^"]+)"/.exec(attrs)?.[1];
      const dims = src ? DIMS[src] : undefined;
      if (!src || !dims) continue; // an image outside the measured tree; not this test's business
      const frame = ratioOf(aspect);
      if (frame === null) continue;
      const own = dims[0] / dims[1];
      /* 1% covers rounding in the ratio text, and nothing else. */
      if (Math.abs(frame - own) / own <= 0.01) continue;
      const lost = Math.round((1 - Math.min(frame, own) / Math.max(frame, own)) * 100);
      cropped.set(src, `${src} 是 ${dims[0]}×${dims[1]}（${own.toFixed(3)}），放进 ${aspect} 的框里裁掉 ${lost}%`);
    }
  }
  assert.deepEqual(
    [...cropped.values()],
    [],
    `${cropped.size} 张图被框裁掉了：把框改成图片自己的比例，或者给 <Photo> 加 fit="contain"`,
  );
});
