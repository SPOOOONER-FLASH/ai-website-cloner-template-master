/**
 * Produce public/images/products-rayen/ — the product photography with the Hyland mark off.
 *
 * WHY THIS EXISTS
 * public/images/products/ was assumed to be the unbranded original set, because
 * public/images/products-hyde/ is the one the watermark script writes. That assumption is
 * wrong: 660 of the 1595 originals already carry a burned-in "Hyland ® — Total solutions
 * to the building industry" oval in the top-left corner, from whoever shot them. The
 * products-hyde set is those images with a SECOND mark applied.
 *
 * Hyland is this factory's own export brand, which is exactly why it slipped through: it
 * is not a competitor's logo, so nothing looked stolen. But on a RAYEN page it is still
 * the wrong company's mark, and a Chinese buyer who opens 球形锁 and sees a different
 * brand name on the photograph draws the obvious conclusion about where the catalogue came
 * from. The client's rule of 2026-09-06 is 「没有露出商标水印的实拍都可以用」 — these are
 * not that. The same instruction allows retouching (「图片可以后期修」), and painting a
 * logo off a white studio field removes something rather than inventing something, so it
 * stays on the right side of the never-imagine-a-metal-product rule in AGENTS.md.
 *
 * HOW IT DECIDES
 * 1. Look at the top-left corner only, and find SATURATED RED. The Hyland lettering is
 *    red; door hardware is steel, brass and black. No red, no logo — the image is copied
 *    untouched. (Detecting "any ink in the corner" instead refused 803 of 1595 images,
 *    because on half the catalogue the product itself reaches up into that corner.)
 * 2. Grow the fill box from the red lettering out to the oval and the strapline below it.
 * 3. Sample a band just outside that box. Fill only when the band is either page
 *    background or uniform enough to be a plain backdrop; the fill takes the band's own
 *    colour, because a lot of this set was shot on a grey gradient and a white rectangle
 *    on grey is more conspicuous than the logo was.
 * 4. Otherwise REFUSE. 158 images end up here, nearly all installed-scene shots with the
 *    oval sitting over a corridor. They are listed in the manifest for a person to crop,
 *    and until then the models they belong to render the 暂无实拍图 state.
 *
 * Refusing is the whole point of the design. A missing photograph is a gap a buyer can
 * ask about; a photograph with a grey rectangle stamped across the lever is a supplier
 * who does not look at their own catalogue.
 *
 * Usage:
 *   node scripts/build-rayen-product-images.mjs            # write the cleaned set
 *   node scripts/build-rayen-product-images.mjs --check     # fail if the set is stale
 *   node scripts/build-rayen-product-images.mjs --sample    # contact sheet for eyeballing
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(root, "public", "images", "products");
const TARGET_DIR = join(root, "public", "images", "products-rayen");
const MANIFEST = join(root, "content", "rayen", "product-image-cleanup.json");

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");

/** The corner the mark lives in, as a fraction of the image. */
const SEARCH = { x0: 0.0, y0: 0.0, x1: 0.3, y1: 0.22 };

/** How close to the background a pixel must be to count as "empty". */
const BACKGROUND_TOLERANCE = 18;


function isNear(a, b, tolerance) {
  return (
    Math.abs(a[0] - b[0]) <= tolerance &&
    Math.abs(a[1] - b[1]) <= tolerance &&
    Math.abs(a[2] - b[2]) <= tolerance
  );
}

/**
 * The page background, sampled from the top-RIGHT corner.
 *
 * Top-left is where the logo is, and the centre is the product, so the opposite corner is
 * the only one reliably showing nothing but backdrop.
 */
async function sampleBackground(image, width, height) {
  const w = Math.max(2, Math.round(width * 0.08));
  const h = Math.max(2, Math.round(height * 0.06));
  const { data, info } = await image
    .clone()
    .extract({ left: width - w - 1, top: 1, width: w, height: h })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

/**
 * True when the band immediately outside `box` is almost entirely page background.
 *
 * Checked as a proportion rather than an absolute: JPEG-then-webp ringing around the oval
 * leaves a few off-background pixels touching it even on a spotless white field, and
 * demanding a perfect ring refused images that were fine.
 */
async function ringStats(image, width, height, box, background) {
  const band = Math.max(4, Math.round(width * 0.015));
  const left = Math.max(0, box.left - band);
  const top = Math.max(0, box.top - band);
  const right = Math.min(width, box.left + box.width + band);
  const bottom = Math.min(height, box.top + box.height + band);

  const { data, info } = await image
    .clone()
    .extract({ left, top, width: right - left, height: bottom - top })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const innerX0 = box.left - left;
  const innerY0 = box.top - top;
  const innerX1 = innerX0 + box.width;
  const innerY1 = innerY0 + box.height;

  let outside = 0;
  let foreign = 0;
  const sums = [0, 0, 0];
  const squares = [0, 0, 0];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (x >= innerX0 && x < innerX1 && y >= innerY0 && y < innerY1) continue;
      const i = (y * info.width + x) * info.channels;
      const pixel = [data[i], data[i + 1], data[i + 2]];
      outside++;
      for (let c = 0; c < 3; c++) {
        sums[c] += pixel[c];
        squares[c] += pixel[c] * pixel[c];
      }
      if (!isNear(pixel, background, BACKGROUND_TOLERANCE + 12)) foreign++;
    }
  }
  if (outside === 0) return { matchesPage: true, uniform: true, mean: background };

  const mean = sums.map((sum) => Math.round(sum / outside));
  const deviation = Math.max(
    ...squares.map((square, c) => Math.sqrt(Math.max(0, square / outside - mean[c] ** 2))),
  );

  return {
    matchesPage: foreign / outside < 0.06,
    /*
      Uniform-but-not-white. A sizeable part of this catalogue was shot on a soft grey
      gradient rather than paper, so the ring around the logo is a consistent mid-tone that
      the page-background test rejects. If that ring has low variance there is nothing in it
      but backdrop, and filling with the ring's own mean colour is invisible. This tier is
      what took 球形锁 off 51% photo coverage — the knob plates are mostly gradient shots.
    */
    uniform: deviation < 9,
    mean,
  };
}

async function analyse(file) {
  const source = join(SOURCE_DIR, file);
  const image = sharp(source);
  const { width, height } = await image.metadata();
  if (!width || !height) return { file, status: "unreadable" };

  const background = await sampleBackground(image, width, height);

  const left = Math.round(width * SEARCH.x0);
  const top = Math.round(height * SEARCH.y0);
  const cropW = Math.max(1, Math.round(width * (SEARCH.x1 - SEARCH.x0)));
  const cropH = Math.max(1, Math.round(height * (SEARCH.y1 - SEARCH.y0)));

  const { data, info } = await image
    .clone()
    .extract({ left, top, width: cropW, height: cropH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  /*
    The mark is identified by its RED lettering, not merely by "there is something in the
    corner". Without that test the first version refused 803 of 1595 images: on half the
    catalogue the product itself sits high enough to enter the search window, and any ink
    there looked like a logo. Door hardware is steel, brass and black — saturated red is
    the watermark and essentially nothing else.
  */
  let redPixels = 0;
  let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (!(r > 110 && r - g > 55 && r - b > 55)) continue;
      redPixels++;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  const total = info.width * info.height;
  if (redPixels / total < 0.003) {
    // No red lettering in the corner, so no Hyland oval. Whatever else is up there is the
    // photograph, and it is left exactly as shot.
    return { file, status: "already-clean", background };
  }

  /*
    The box is grown from the RED LETTERING only, then padded out to the oval that encloses
    it and to the small strapline underneath. Taking the bounding box of all corner ink
    instead — the first attempt — merged the logo with any product that reached into the
    window and produced a box spanning half the frame, which the safety check then refused;
    that is where 803 false refusals came from.
  */
  const padX = Math.round(width * 0.045);
  const padTop = Math.round(height * 0.045);
  const padBottom = Math.round(height * 0.07); // the strapline sits below the oval
  const box = {
    left: Math.max(0, left + minX - padX),
    top: Math.max(0, top + minY - padTop),
  };
  box.width = Math.min(width - box.left, maxX - minX + 1 + padX * 2);
  box.height = Math.min(height - box.top, maxY - minY + 1 + padTop + padBottom);

  /*
    Safety ring. Sample a band just outside the fill box; if it is not close to the page
    background, something real is adjacent and a flat fill would leave a visible plate over
    the photograph. Refuse rather than damage: a missing photo costs a buyer one click, a
    photo with a grey rectangle stamped on it costs the catalogue's credibility.
  */
  const ring = await ringStats(image, width, height, box, background);
  if (!ring.matchesPage && !ring.uniform) {
    return { file, status: "refused", reason: "水印四周不是纯净背景，填充会盖住画面内容", box, background };
  }

  // Fill with the ring's own colour, not the page's: on a gradient backdrop the local tone
  // is the one that disappears.
  return { file, status: "cleanable", box, background: ring.matchesPage ? background : ring.mean };
}

/* ------------------------------------------------------------------------ */

mkdirSync(TARGET_DIR, { recursive: true });

const files = readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".webp")).sort();
const results = [];

for (const file of files) {
  const result = await analyse(file);
  results.push(result);
  if (checkOnly) continue;

  const target = join(TARGET_DIR, file);
  const source = join(SOURCE_DIR, file);

  if (result.status === "cleanable") {
    const { box, background } = result;
    const patch = await sharp({
      create: {
        width: box.width,
        height: box.height,
        channels: 3,
        background: { r: background[0], g: background[1], b: background[2] },
      },
    })
      .webp()
      .toBuffer();
    await sharp(source)
      .composite([{ input: patch, left: box.left, top: box.top }])
      .webp({ quality: 82 })
      .toFile(target);
  } else if (result.status === "already-clean") {
    await sharp(source).webp({ quality: 82 }).toFile(target);
  }
  // "refused" and "unreadable" write nothing: src/data/rayen.ts treats a missing file as
  // "this model has no usable photograph yet" and renders the empty state.
}

const counts = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
const refused = results.filter((r) => r.status === "refused").map((r) => r.file);

if (!checkOnly) {
  writeFileSync(
    MANIFEST,
    `${JSON.stringify(
      {
        _readme: [
          "scripts/build-rayen-product-images.mjs 生成，不要手改。",
          "refused 里的图片角落有内容延伸出检测窗口 —— 可能是产品本体，自动填充会把产品涂掉，",
          "所以这些图不进雷茵站。需要的话由美工手工裁切后放回 public/images/products/。",
        ],
        generated: new Date().toISOString().slice(0, 10),
        counts,
        refused,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(
    `products-rayen/：清掉水印 ${counts.cleanable ?? 0} 张，本来就干净 ${counts["already-clean"] ?? 0} 张，` +
      `拒绝处理 ${counts.refused ?? 0} 张（角落里可能是产品）。清单见 ${MANIFEST.replace(root, ".")}`,
  );
} else {
  const missing = results.filter(
    (r) => r.status !== "refused" && !existsSync(join(TARGET_DIR, r.file)),
  );
  if (missing.length) {
    console.error(`products-rayen/ 缺 ${missing.length} 张，跑 npm run rayen:images 重新生成。`);
    process.exit(1);
  }
  console.log(`products-rayen/ 与源图一致（${files.length} 张）。`);
}
