import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/*
  The Chinese and English RAYEN image sets must stay the same pictures.

  WHY THIS TEST EXISTS
  The mark is baked into the pixels, so one file cannot carry two of them and each locale
  needs its own copy: public/images/products-rayen/ holds the black RAYEN 雷茵 lockup, and
  public/images/products-rayen-en/ the teal latin wordmark. The English set is SEEDED from
  the Chinese one — copied, then stamped — which means the two can silently drift apart.

  On 2026-09-14 they did, twice over, and neither the pipeline's own --check nor the pixel
  audit reported it:

    · Ten files in the English set had no Chinese counterpart at all. Re-ingesting a model
      whose gallery had grown renumbered <slug>-N.webp, the new -N was refused by the
      cleaning step, the Chinese master was dropped — and nothing pruned the English copy,
      which went on being served showing a photograph no product record referenced.

    · Nineteen more were a DIFFERENT PICTURE from their Chinese master, left over from
      before the master was regenerated. The seeding step skipped any file that already
      existed, so a changed master never refreshed its English copy. Every ledger agreed the
      file was stamped, because it was — the wrong photograph was stamped. The only visible
      symptom was that one set was 1049px wide and the other 1050.

  Both are cheap to assert and impossible to eyeball across 1,258 pairs, which is exactly
  what a test is for. Dimensions are the tell: two encodings of the same photograph agree on
  them, two different photographs almost never do.
*/

const ZH = join(process.cwd(), "public", "images", "products-rayen");
const EN = join(process.cwd(), "public", "images", "products-rayen-en");

const images = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith(".webp")) : [];

/**
 * Width and height straight out of the WebP header.
 *
 * Parsed here rather than pulled from sharp so the test stays a plain file-tree assertion
 * with no image decoding: it reads 32 bytes per file instead of megabytes, and it does not
 * make the unit test suite depend on a native module.
 */
function webpSize(file: string): { width: number; height: number } | undefined {
  let head: Buffer;
  try {
    head = Buffer.alloc(32);
    const fd = readFileSync(file);
    fd.copy(head, 0, 0, Math.min(32, fd.length));
  } catch {
    return undefined;
  }
  if (head.toString("ascii", 0, 4) !== "RIFF" || head.toString("ascii", 8, 12) !== "WEBP") {
    return undefined;
  }
  const chunk = head.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return { width: head.readUInt16LE(26) & 0x3fff, height: head.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = head.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    const read24 = (at: number) => head[at] | (head[at + 1] << 8) | (head[at + 2] << 16);
    return { width: read24(24) + 1, height: read24(27) + 1 };
  }
  return undefined;
}

test("every English RAYEN image has a Chinese master", () => {
  const zh = new Set(images(ZH));
  if (!zh.size) return; // image trees not checked out (shallow clone) — nothing to compare
  const orphans = images(EN).filter((name) => !zh.has(name));
  assert.deepEqual(
    orphans,
    [],
    `products-rayen-en 里有 ${orphans.length} 张图在 products-rayen 里没有对应的底图。` +
      "说明中文底图重新生成或被删掉之后，英文副本没有跟着走。跑 npm run rayen:images 修。",
  );
});

test("the two RAYEN sets show the same picture at the same size", () => {
  const en = images(EN);
  if (!en.length || !images(ZH).length) return;

  const mismatched: string[] = [];
  for (const name of en) {
    const master = join(ZH, name);
    if (!existsSync(master)) continue; // covered by the orphan test above
    const a = webpSize(master);
    const b = webpSize(join(EN, name));
    if (!a || !b) continue;
    if (a.width !== b.width || a.height !== b.height) {
      mismatched.push(`${name}（中文 ${a.width}×${a.height}，英文 ${b.width}×${b.height}）`);
    }
  }

  assert.deepEqual(
    mismatched.slice(0, 20),
    [],
    `${mismatched.length} 张英文图和它的中文底图尺寸不一样 —— 多半是底图重新生成过，` +
      "而英文副本还是上一版的那张照片（标打在了错的图上）。跑 npm run rayen:images 修。",
  );
});

test("neither set carries a zero-byte image", () => {
  for (const dir of [ZH, EN]) {
    for (const name of images(dir)) {
      assert.ok(statSync(join(dir, name)).size > 0, `${dir} 里的 ${name} 是空文件`);
    }
  }
});
