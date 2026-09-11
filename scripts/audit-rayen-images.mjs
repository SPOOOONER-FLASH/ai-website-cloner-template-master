/**
 * Second-pass audit of every image the RAYEN site publishes: is it cropped, is the mark on it.
 *
 * WHY THIS EXISTS ALONGSIDE THE PIPELINE'S OWN --check FLAGS
 * Client instruction, 2026-09-11: 「全部产品图片你做二次审查，缩放对不对，雷茵logo有没有」.
 *
 * scripts/brand-rayen-images.mjs --check already answers "is the mark on it", and it answers
 * it well — it compares the file's SHA against the one the stamper recorded, so any later
 * edit trips it. But it is still the stamper marking its own homework: it proves the bytes
 * are the bytes that were written, not that a mark is VISIBLE in them. If the stamp had
 * landed at the wrong opacity, on the wrong ink, or off the edge of a very small canvas, the
 * ledger would agree with itself and the buyer would still see nothing. The client is
 * looking at the live site and saying he cannot see the logo, which is exactly the
 * discrepancy a self-checking ledger cannot resolve.
 *
 * So this reads the pixels instead.
 *
 * IS THE MARK VISIBLE
 * The mark's rectangle is recomputed from the same proportions the stamper uses, and the
 * logo's own alpha mask is rendered at that size. Inside that rectangle the patch is
 * compared against a blurred copy of itself — which leaves what is the size of a letter
 * stroke and discards what is the size of a door edge — and the fine detail under the ink
 * is set against the fine detail beside it.
 *
 * That number is then measured against the SAME image before branding, in
 * public/images/products. The difference is the mark and nothing else: whatever the corner
 * happens to contain cancels out, which is what makes this work on a photograph of a
 * carpeted corridor as well as on a white drawing. See the note on MARK_GAIN for the
 * calibration that forced this design — an absolute threshold cannot separate a faint mark
 * on white paper from a real mark on a busy photograph, and picking one trades a false
 * alarm for a miss.
 *
 * It is a stronger statement than "the ledger says so": it is "the mark changed these
 * pixels". It catches never-stamped, stamped-invisibly, and stamped-then-overwritten.
 *
 * IS IT CROPPED (plates only)
 * Every RAYEN surface renders product images in a 1:1 frame with object-fit cover, so
 * anything that is not square loses its edges — and for a 1200mm pull handle shot upright,
 * the edges are the product. square-rayen-plates.mjs pads the white-background plates for
 * this reason; this counts what is left and says how much of the frame would be lost, so a
 * number can be argued with rather than a pass/fail. Scenes are exempt on purpose: cropping
 * a photograph of a corridor loses corridor.
 *
 * Usage:
 *   node scripts/audit-rayen-images.mjs            # report
 *   node scripts/audit-rayen-images.mjs --json     # machine-readable
 *   node scripts/audit-rayen-images.mjs --check    # CI: exit 1 on any unmarked image
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(root, "public", "images", "products-rayen");
const CATEGORIES = join(root, "content", "categories.json");
const LOGO = join(root, "public", "images", "rayen", "logo.webp");

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes("--json");
const CHECK = argv.includes("--check");

/* Same proportions as scripts/brand-rayen-images.mjs. Kept in step by hand, on purpose:
   importing them would make this audit agree with the stamper by construction. */
const WIDTH_FRACTION = 0.16;
const MIN_WIDTH = 64;
const MAX_WIDTH = 260;
const MARGIN_FRACTION = 0.035;

/**
 * How far from square before the 1:1 frame is eating something.
 *
 * 2% is about six pixels on a 300px card — below that the crop takes anti-aliasing, not
 * product. Above it, the number reported is what fraction of the long side is lost.
 */
const SQUARE_TOLERANCE = 0.02;

/**
 * A corner is "white" if every channel is above this — the same floor
 * scripts/square-rayen-plates.mjs uses, so both agree on what a plate is.
 */
const WHITE_FLOOR = 238;

/** Is this a cut-out on paper (a plate), or a photograph of a room (a scene)? */
async function isPlate(file, width, height) {
  const probe = Math.max(2, Math.round(Math.min(width, height) * 0.04));
  for (const corner of [
    { left: 0, top: 0 },
    { left: width - probe, top: 0 },
    { left: 0, top: height - probe },
    { left: width - probe, top: height - probe },
  ]) {
    const { data, info } = await sharp(file)
      .extract({ ...corner, width: probe, height: probe })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let sum = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      sum += data[i] + data[i + 1] + data[i + 2];
      n += 3;
    }
    if (sum / n < WHITE_FLOOR) return false;
  }
  return true;
}

/**
 * Every image the RAYEN site publishes — read from the generated Chinese mirror, not from
 * content/products.
 *
 * This matters, and the first version of this audit got it wrong. content/products is the
 * shared catalogue; the RAYEN site renders src/data/generated/products-zh.json, and the
 * mirror DROPS any image that scripts/build-rayen-product-images.mjs refused to clean
 * (426 of them — frames where what sits in the corner might be product rather than a
 * watermark, so erasing it would erase the part). Auditing the shared records reported 45
 * "missing files" that the site never asks for, which is noise dressed up as a defect, and
 * it would have sent somebody looking for a bug that is a deliberate exclusion.
 */
function publishedImages() {
  const names = new Map();
  const mirror = JSON.parse(
    readFileSync(join(root, "src", "data", "generated", "products-zh.json"), "utf8"),
  );
  /*
    The mirror translates the WHOLE catalogue — 703 models, HYDE's included — because the
    Chinese copy is useful wherever it is needed. The RAYEN site only lists the records
    whose `sites` says so, and it is only those the mark belongs on: stamping RAYEN on a
    Canton Hyland panic bar would be putting our name on somebody else's listing.
  */
  const records = (Array.isArray(mirror) ? mirror : (mirror.products ?? [])).filter((product) =>
    (product.sites ?? []).includes("rayen"),
  );
  for (const product of records) {
    for (const image of [product.heroImage, ...(product.gallery ?? []), ...(product.images ?? [])]) {
      if (!image?.src) continue;
      const name = String(image.src).slice(String(image.src).lastIndexOf("/") + 1);
      if (!names.has(name)) names.set(name, product.model ?? product.slug);
    }
  }
  const walk = (nodes) => {
    for (const node of nodes ?? []) {
      const src = node.image?.src;
      if (src) {
        const name = String(src).slice(String(src).lastIndexOf("/") + 1);
        if (!names.has(name)) names.set(name, `类目:${node.slug}`);
      }
      walk(node.children);
    }
  };
  walk(JSON.parse(readFileSync(CATEGORIES, "utf8")).categories);
  return names;
}

/** The logo's alpha channel at a given width — where the ink actually is. */
const maskCache = new Map();
async function logoMask(width) {
  if (maskCache.has(width)) return maskCache.get(width);
  const { data, info } = await sharp(readFileSync(LOGO))
    .resize({ width })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = new Uint8Array(info.width * info.height);
  for (let i = 0, p = 0; i < data.length; i += info.channels, p += 1) {
    alpha[p] = data[i + info.channels - 1];
  }
  const mask = { alpha, width: info.width, height: info.height };
  maskCache.set(width, mask);
  return mask;
}

/**
 * Does something logo-shaped sit in the corner where the logo goes?
 *
 * Returns how much more the pixels under the logo's ink depart from their surroundings than
 * the pixels beside them do. A stamped corner separates; a bare one does not.
 *
 * MEASURED AGAINST A LOCAL BASELINE, NOT THE PATCH MEDIAN
 * The first version compared each pixel to the median of the whole patch, and it reported
 * seven images as unmarked that are plainly marked — every one of them a photograph of a
 * door, where the corner holds a hard vertical edge between a dark leaf and a pale wall.
 * Against a patch median, that edge makes the NON-ink pixels deviate enormously and the
 * score goes negative: the metric was measuring the door, not the mark.
 *
 * Subtracting a blurred copy first removes anything at door-edge scale and leaves what is
 * the size of a letter stroke, which is what the mark is made of. Same idea as asking "is
 * there fine detail here", rather than "is this area uniform".
 *
 * A false "no logo" is worse than no check at all: it sends somebody hunting for a defect
 * that is not there, and the next person learns to ignore the report.
 */
async function markContrast(file, meta) {
  const markWidth = Math.round(
    Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, meta.width * WIDTH_FRACTION)),
  );
  const mask = await logoMask(markWidth);
  const margin = Math.round(Math.min(meta.width, meta.height) * MARGIN_FRACTION);
  const left = Math.max(0, meta.width - mask.width - margin);
  const top = Math.max(0, meta.height - mask.height - margin);
  if (mask.width + margin > meta.width || mask.height + margin > meta.height) return null;

  const patch = await sharp(file)
    .extract({ left, top, width: mask.width, height: mask.height })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  /* The same patch with the letter strokes smeared away — the background, in other words. */
  const blurred = await sharp(patch.data, {
    raw: { width: patch.info.width, height: patch.info.height, channels: patch.info.channels },
  })
    .blur(Math.max(1, mask.height / 8))
    .raw()
    .toBuffer();

  const { data, info } = patch;
  const values = [];
  const base = [];
  for (let i = 0, p = 0; i < data.length; i += info.channels, p += 1) {
    values.push(data[i]);
    base.push(blurred[i]);
  }

  let inkSum = 0;
  let inkN = 0;
  let bareSum = 0;
  let bareN = 0;
  for (let p = 0; p < values.length; p += 1) {
    const delta = Math.abs(values[p] - base[p]);
    /* 128 rather than 0: the logo's own soft edges are not ink, and counting them as ink
       would let a blurry corner masquerade as a mark. */
    if (mask.alpha[p] > 128) {
      inkSum += delta;
      inkN += 1;
    } else {
      bareSum += delta;
      bareN += 1;
    }
  }
  if (!inkN || !bareN) return null;
  return inkSum / inkN - bareSum / bareN;
}

/**
 * The line between "marked" and "not marked" — measured as a DIFFERENCE, not a level.
 *
 * An absolute score cannot answer the question, and the calibration run says so plainly.
 * Scoring the unbranded originals in public/images/products (which carry no RAYEN mark by
 * definition — that directory feeds the HYDE pipeline) gives:
 *
 *   g1105-glass-door-handle-2    0.0     t1265-stainless-steel-handle   -0.1
 *   g1226-glass-door-handle      0.0     hb2902-grab-bar-6               0.2
 *   t2083-stainless-steel-...-7  −31.7   ← busy corner, and still unmarked
 *
 * Most unmarked images sit at zero, but t2083-...-7 sits at −31.7 because its corner is a
 * dense photograph. Its branded twin scores −20.6: plainly marked, and plainly below any
 * absolute threshold that the white drawings (1.2–2.2) also clear. One number cannot
 * separate those two groups, and picking one would have to trade a false alarm for a miss.
 *
 * So each image is compared against ITSELF before branding. The unbranded original of every
 * published image exists — products-rayen is derived from products — and the mark is exactly
 * the difference between them. t2083-...-7 moves −31.7 → −20.6, a gain of 11; an unstamped
 * file does not move at all. Content cancels out, which is the whole point.
 *
 * 0.8 is the floor: the faintest real mark in this catalogue (42% ink on a white drawing)
 * gains about 1.3, and re-encoding noise moves a file by hundredths.
 */
const MARK_GAIN = 0.8;
const UNSURE_GAIN = 0.3;

const names = publishedImages();
const missingFile = [];
const unmarked = [];
const unsure = [];
const cropped = [];
const noBaseline = [];
let checked = 0;

for (const [name, owner] of names) {
  const file = join(DIR, name);
  if (!existsSync(file)) {
    missingFile.push(`${name}（${owner}）`);
    continue;
  }
  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch (error) {
    missingFile.push(`${name}（读不到：${error.message?.slice(0, 40)}）`);
    continue;
  }
  checked += 1;

  /*
    Only PLATES have to be square.

    The first version of this audit flagged all 701 non-square images and that was the wrong
    question. A scene — a corridor, a door in a hotel lobby — is a photograph, and a 1:1
    frame crops a photograph the way any crop does: it loses some room, not some product.
    scripts/square-rayen-plates.mjs makes exactly this distinction and leaves 555 scenes
    full-bleed on purpose. Reporting those as defects would bury the handful that matter
    under seven hundred that do not, which is how a real finding gets ignored.

    A plate is a part cut out on paper, and cropping one takes metal — the top of a 1200mm
    handle, the fixing at its foot. Those are the ones counted here.
  */
  const long = Math.max(meta.width, meta.height);
  const short = Math.min(meta.width, meta.height);
  const loss = (long - short) / long;
  if (loss > SQUARE_TOLERANCE && (await isPlate(file, meta.width, meta.height))) {
    cropped.push({ name, owner, size: `${meta.width}×${meta.height}`, loss: +(loss * 100).toFixed(1) });
  }

  const branded = await markContrast(file, meta);
  if (branded === null) {
    unmarked.push({ name, owner, reason: `${meta.width}×${meta.height} 放不下标` });
    continue;
  }

  /* The same image before the mark went on. Without it there is no baseline to subtract. */
  const origin = join(root, "public", "images", "products", name);
  if (!existsSync(origin)) {
    noBaseline.push({ name, owner, contrast: +branded.toFixed(1) });
    continue;
  }
  let bare;
  try {
    bare = await markContrast(origin, await sharp(origin).metadata());
  } catch {
    bare = null;
  }
  if (bare === null) {
    noBaseline.push({ name, owner, contrast: +branded.toFixed(1) });
    continue;
  }

  const gain = branded - bare;
  if (gain < UNSURE_GAIN) {
    unmarked.push({ name, owner, reason: `打标前后角落没有变化（增益 ${gain.toFixed(1)}）` });
  } else if (gain < MARK_GAIN) {
    unsure.push({ name, owner, contrast: +gain.toFixed(1) });
  }
}

if (JSON_OUT) {
  writeFileSync(
    join(root, "tmp", "rayen-image-audit.json"),
    `${JSON.stringify({ checked, unmarked, unsure, cropped, missingFile }, null, 2)}\n`,
    "utf8",
  );
}

console.log(`二次审查：${checked} 张在售图（产品图 + 类目封面）`);
console.log(
  `  雷茵标：${checked - unmarked.length - unsure.length - noBaseline.length} 张确认可见，` +
    `${unsure.length} 张存疑，${unmarked.length} 张没有`,
);
console.log(`  缩放：${checked - cropped.length} 张是正方形，${cropped.length} 张会被 1:1 画框裁掉`);

if (missingFile.length) {
  console.log(`\n⚠ ${missingFile.length} 张产品记录引用了但文件不在：`);
  for (const line of missingFile.slice(0, 20)) console.log(`   ${line}`);
}
if (unmarked.length) {
  console.log(`\n✖ ${unmarked.length} 张没有雷茵标：`);
  for (const row of unmarked.slice(0, 30)) console.log(`   ${row.name}（${row.owner}）— ${row.reason}`);
}
if (unsure.length) {
  console.log(`\n? ${unsure.length} 张存疑，建议人眼看一下（角落本身就有花纹时会这样）：`);
  for (const row of unsure.slice(0, 30)) console.log(`   ${row.name}（${row.owner}）对比度 ${row.contrast}`);
}
if (cropped.length) {
  console.log(`\n✖ ${cropped.length} 张不是正方形，1:1 画框会裁掉长边的一部分：`);
  for (const row of cropped.slice(0, 30)) {
    console.log(`   ${row.name}（${row.owner}）${row.size} — 裁掉 ${row.loss}%`);
  }
}

if (CHECK && (unmarked.length || cropped.length || missingFile.length)) process.exit(1);
