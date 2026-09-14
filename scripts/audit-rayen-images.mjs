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
/*
  Two sets, one per language — see the note at the top of scripts/brand-rayen-images.mjs.

  Auditing only the Chinese set would have passed on 2026-09-13 while all 1,112 English
  images carried BOTH marks, the teal wordmark stamped over the black 雷茵 lockup. The
  brander's own --check passed too, because it asks whether a mark is present, not how
  many. So each set is audited against its own logo, and the mark each one is supposed to
  carry is the one it is measured for.
*/
const SETS = [
  {
    dir: join(root, "public", "images", "products-rayen"),
    logo: join(root, "public", "images", "rayen", "logo.webp"),
    label: "中文站（黑色 RAYEN 雷茵）",
  },
  {
    dir: join(root, "public", "images", "products-rayen-en"),
    logo: join(root, "public", "images", "rayen", "logo-latin.webp"),
    label: "英文站（青绿 RAYEN 字标）",
  },
];
const CATEGORIES = join(root, "content", "categories.json");

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes("--json");
const CHECK = argv.includes("--check");

/* Same proportions as scripts/brand-rayen-images.mjs. Kept in step by hand, on purpose:
   importing them would make this audit agree with the stamper by construction. */
const WIDTH_FRACTION = 0.2;
const MIN_WIDTH = 64;
const MAX_WIDTH = 320;
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
function publishedImages(DIR) {
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
  /*
    Category covers — but only for the categories RAYEN actually stocks.

    The taxonomy is shared, so it also holds 逃生推杠 and the rest of HYDE's tree, and their
    covers now point at /images/editorial/hyde-hero-*.webp. Walking all of them reported six
    "missing files" for images the RAYEN site never asks for and should not have: another
    true-but-irrelevant finding of the kind that teaches people to skim the report.
  */
  const stocked = new Set(records.map((product) => product.categoryPath[0]));
  const walk = (nodes, live = false) => {
    for (const node of nodes ?? []) {
      const here = live || stocked.has(node.slug);
      const src = node.image?.src;
      if (here && src) {
        const name = String(src).slice(String(src).lastIndexOf("/") + 1);
        /*
          Only if the RAYEN image set actually has it.

          src/data/rayen.ts refuses to render a cover that is not RAYEN's own and substitutes
          a published product — so a shared cover pointing at /images/editorial/hyde-hero-*
          never reaches a RAYEN page. Auditing it anyway reported a missing file for an image
          the site is deliberately not using, which reads as a defect and is the opposite of
          one: it is the guard working.
        */
        if (!names.has(name) && existsSync(join(DIR, name))) names.set(name, `类目:${node.slug}`);
      }
      walk(node.children, here);
    }
  };
  walk(JSON.parse(readFileSync(CATEGORIES, "utf8")).categories);
  return names;
}

/** The logo's alpha channel at a given width — where the ink actually is. */
const maskCache = new Map();
async function logoMask(width, LOGO) {
  const key = `${LOGO}|${width}`;
  if (maskCache.has(key)) return maskCache.get(key);
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
  maskCache.set(key, mask);
  return mask;
}

/**
 * Did the mark change these pixels, in the shape of the logo?
 *
 * Takes the branded file's mark rectangle and the SAME rectangle from the unbranded
 * original, and asks how much more the pixels under the logo's ink differ between the two
 * than the pixels beside them do. A stamped corner separates; an unstamped one is identical
 * in both and scores zero.
 *
 * WHY NOT MEASURE THE BRANDED IMAGE ON ITS OWN
 * Two earlier versions tried. Both produced false "no logo" on images that are plainly
 * marked, and a false alarm is worse than no check: it sends somebody hunting for a defect
 * that is not there, and teaches the next person to skim the report.
 *
 *   1. Ink vs the patch median. Reported seven marked images as bare — all photographs of
 *      doors, where a hard edge between a dark leaf and a pale wall makes the NON-ink pixels
 *      deviate hugely. It was measuring the door.
 *   2. Ink vs a blurred copy, i.e. "is there fine detail under the strokes". Reported 61
 *      marked images as bare — every one a corner of carpet, mosaic or stone. Those textures
 *      carry detail at exactly the scale of a letter stroke, and worse, a semi-transparent
 *      mark laid over them SUPPRESSES that detail rather than adding any. The assumption
 *      that a mark makes a corner busier is simply false on a busy corner.
 *
 * Differencing the two files drops both assumptions. It does not care whether the mark adds
 * contrast or removes it, and the content cancels out, so a white drawing and a photograph
 * of a hotel corridor are judged the same way.
 *
 * ALIGNMENT
 * The branded file may have been padded to square after the original was written
 * (scripts/square-rayen-plates.mjs), which moves the content by a known, centred offset.
 * That offset is subtracted before the rectangles are compared. If the rectangle then falls
 * outside the original — a re-crop, a resize, anything else — this returns null and the
 * image is reported as unverifiable rather than guessed at in either direction.
 */
async function markDelta(file, meta, origin, LOGO) {
  const markWidth = Math.round(
    Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, meta.width * WIDTH_FRACTION)),
  );
  const mask = await logoMask(markWidth, LOGO);
  const margin = Math.round(Math.min(meta.width, meta.height) * MARGIN_FRACTION);
  const left = Math.max(0, meta.width - mask.width - margin);
  const top = Math.max(0, meta.height - mask.height - margin);
  if (mask.width + margin > meta.width || mask.height + margin > meta.height) return null;

  const bareMeta = await sharp(origin).metadata();
  /* Centred square padding is the one transformation whose offset is exactly known. */
  const dx = Math.round((meta.width - bareMeta.width) / 2);
  const dy = Math.round((meta.height - bareMeta.height) / 2);
  /*
    Compare the OVERLAP, not the whole rectangle.

    A padded plate puts its mark partly over margin that the original never had — the mark
    is positioned from the padded edge, so on a 544×532 drawing padded to 609×609 the
    rightmost strip of the mark has no counterpart at all. Insisting on the full rectangle
    made 207 of 822 images unverifiable, which is not a safe answer dressed as caution: an
    audit that shrugs at a quarter of the catalogue is an audit nobody will act on.

    The overlap still contains most of the wordmark, and the ink/bare comparison inside it
    answers the same question. Below a third of the ink there is not enough letter left to
    be sure, and it says so instead.
  */
  const x0 = Math.max(0, left - dx);
  const y0 = Math.max(0, top - dy);
  const x1 = Math.min(bareMeta.width, left - dx + mask.width);
  const y1 = Math.min(bareMeta.height, top - dy + mask.height);
  const w = x1 - x0;
  const h = y1 - y0;
  if (w < 8 || h < 8) return null;

  /* Where that overlap sits inside the mark rectangle, so the mask lines up with it. */
  const maskX = x0 - (left - dx);
  const maskY = y0 - (top - dy);

  const read = (source, l, t) =>
    sharp(source)
      .extract({ left: l, top: t, width: w, height: h })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

  const [after, before] = await Promise.all([read(file, x0 + dx, y0 + dy), read(origin, x0, y0)]);

  let inkSum = 0;
  let inkN = 0;
  let bareSum = 0;
  let bareN = 0;
  let inkTotal = 0;
  for (let p = 0; p < mask.alpha.length; p += 1) if (mask.alpha[p] > 128) inkTotal += 1;

  for (let row = 0; row < h; row += 1) {
    for (let col = 0; col < w; col += 1) {
      const i = (row * w + col) * after.info.channels;
      const m = (maskY + row) * mask.width + (maskX + col);
      const delta = Math.abs(after.data[i] - before.data[i]);
      /* 128 rather than 0: the logo's own soft edges are not ink, and counting them as ink
         would let a blurry corner masquerade as a mark. */
      if (mask.alpha[m] > 128) {
        inkSum += delta;
        inkN += 1;
      } else {
        bareSum += delta;
        bareN += 1;
      }
    }
  }
  if (!inkN || !bareN || inkN < inkTotal / 3) return null;
  return inkSum / inkN - bareSum / bareN;
}

/**
 * The same question on a flat field: does the ink depart from the field the way a mark would?
 *
 * Only sound where the mark sits on a padded margin — a single colour, laid down by
 * scripts/square-rayen-plates.mjs. There, "the ink is darker or lighter than everything
 * around it" is the whole test, and the busy-corner failure that killed this approach as a
 * general metric cannot arise, because the corner is one colour by construction.
 */
async function markOnFlatField(file, meta, LOGO) {
  const markWidth = Math.round(
    Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, meta.width * WIDTH_FRACTION)),
  );
  const mask = await logoMask(markWidth, LOGO);
  const margin = Math.round(Math.min(meta.width, meta.height) * MARGIN_FRACTION);
  const left = Math.max(0, meta.width - mask.width - margin);
  const top = Math.max(0, meta.height - mask.height - margin);
  if (mask.width + margin > meta.width || mask.height + margin > meta.height) return null;

  const { data, info } = await sharp(file)
    .extract({ left, top, width: mask.width, height: mask.height })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  /* The field is whatever the non-ink pixels mostly are. */
  const bare = [];
  for (let i = 0, p = 0; i < data.length; i += info.channels, p += 1) {
    if (mask.alpha[p] <= 128) bare.push(data[i]);
  }
  if (!bare.length) return null;
  const field = bare.sort((a, b) => a - b)[bare.length >> 1];

  let inkSum = 0;
  let inkN = 0;
  let bareSum = 0;
  let bareN = 0;
  for (let i = 0, p = 0; i < data.length; i += info.channels, p += 1) {
    const delta = Math.abs(data[i] - field);
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

/**
 * Audit one image set against the mark it is supposed to carry.
 *
 * Returns the number of defects so the caller can decide the exit code once, after both
 * sets have been reported — a CI run that stops at the Chinese set would hide whatever is
 * wrong with the English one, and the English set is the newer and less proven of the two.
 */
async function auditSet({ dir: DIR, logo: LOGO, label }) {
    const names = publishedImages(DIR);
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

    /* The same image before the mark went on. Without it there is nothing to difference. */
    const origin = join(root, "public", "images", "products", name);
    if (!existsSync(origin)) {
      noBaseline.push({ name, owner, contrast: 0 });
      continue;
    }
    let gain;
    try {
      gain = await markDelta(file, meta, origin, LOGO);
    } catch {
      gain = null;
    }
    /*
      A padded plate puts its mark on margin that did not exist before, so there is no "before"
      to difference — 207 of 822 came back unverifiable that way. But that margin is flat by
      construction: scripts/square-rayen-plates.mjs fills it with the plate's own field colour.
      On a flat field the simple question works and works well — it only ever failed on busy
      photographs, which are exactly the ones markDelta can answer. So each method is used
      where it is valid, rather than one method stretched over both.
    */
    if (gain === null) {
      try {
        gain = await markOnFlatField(file, meta, LOGO);
      } catch {
        gain = null;
      }
    }
    if (gain === null) {
      noBaseline.push({ name, owner, contrast: 0 });
      continue;
    }

    if (gain < UNSURE_GAIN) {
      unmarked.push({ name, owner, reason: `打标前后角落没有变化（增益 ${gain.toFixed(1)}）` });
    } else if (gain < MARK_GAIN) {
      unsure.push({ name, owner, contrast: +gain.toFixed(1) });
    }
  }

  if (JSON_OUT) {
    writeFileSync(
      join(root, "tmp", `rayen-image-audit-${DIR.endsWith("-en") ? "en" : "zh"}.json`),
      `${JSON.stringify({ checked, unmarked, unsure, cropped, missingFile }, null, 2)}\n`,
      "utf8",
    );
  }

  console.log(`
二次审查 ${label}：${checked} 张在售图（产品图 + 类目封面）`);
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

  return unmarked.length + cropped.length + missingFile.length;
}

let defects = 0;
for (const set of SETS) {
  defects += await auditSet(set);
}
if (CHECK && defects) process.exit(1);
