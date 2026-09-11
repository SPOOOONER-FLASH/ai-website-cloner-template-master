/**
 * Put the RAYEN mark on the product photography.
 *
 * WHY
 * Client instruction, 2026-09-10: 「所有产品logo换成雷茵的」. The images came from a supplier's
 * packs, and where a supplier's own brand would sit, ours should. A buyer who saves one of
 * these photographs, or finds it again on a search page, should be able to tell whose
 * factory it came from.
 *
 * There is nothing left to remove first — the site logo is already ours, no product plate or
 * scene carries another firm's mark, the two drawings that did were fixed in
 * scripts/delocalize-drawings.mjs, and no RAYEN-published image ever carried a watermark
 * (the sixteen whose marks could not be cleaned are excluded from publication, not shown).
 * So this only adds.
 *
 * WHY A FIXED CORNER AND A LIGHT TOUCH
 * Consistency IS the argument (AGENTS.md). A mark that wanders — bottom-right here,
 * top-left there because something was in the way — reads as images assembled from
 * different places, which is precisely the impression the mark exists to prevent. So it is
 * always the same corner, always the same proportion of the frame.
 *
 * And it is quiet. A heavy watermark across the middle of a lever handle says the supplier
 * is more worried about theft than about the buyer being able to see the part, and the
 * buyer here is trying to read a hole position. At this weight it identifies the source
 * without competing with the product.
 *
 * LIGHT OR DARK, DECIDED PER IMAGE
 * The catalogue is half cut-outs on white paper and half interiors shot in dark timber. One
 * ink cannot serve both: black on a dark door is invisible, white on a white plate is
 * invisible. So the patch under the mark is sampled and the version that will actually read
 * is chosen. An invisible watermark is not restraint, it is a wasted pass.
 *
 * REVERSIBLE
 * This runs LAST in the rayen:images chain and only ever adds pixels. Drop the step and
 * re-run the chain and every image comes back unbranded from source — nothing here is
 * destructive to anything but its own output.
 *
 * Usage:
 *   node scripts/brand-rayen-images.mjs           # stamp what is unstamped
 *   node scripts/brand-rayen-images.mjs --force   # restamp everything
 *   node scripts/brand-rayen-images.mjs --check   # CI: fail if anything is unstamped
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(root, "public", "images", "products-rayen");
const PRODUCTS = join(root, "content", "products");
const LOGO = join(root, "public", "images", "rayen", "logo.webp");
const LEDGER = join(root, "content", "rayen", "image-branding.json");

const argv = process.argv.slice(2);
const FORCE = argv.includes("--force");
const CHECK = argv.includes("--check");

/* Proportions, so a 400px plate and a 2500px plate get the same-looking mark. */
const WIDTH_FRACTION = 0.16;
const MIN_WIDTH = 64;
const MAX_WIDTH = 260;
const MARGIN_FRACTION = 0.035;
const OPACITY_ON_LIGHT = 0.42;
const OPACITY_ON_DARK = 0.55;

const sha = (buffer) => createHash("sha256").update(buffer).digest("hex");

/** Every image the RAYEN site actually publishes. Branding a file nobody sees is noise. */
function publishedImages() {
  const names = new Set();
  for (const file of readdirSync(PRODUCTS)) {
    if (!file.endsWith(".json")) continue;
    let product;
    try {
      product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
    } catch {
      continue;
    }
    if (!(product.sites ?? []).includes("rayen")) continue;
    for (const image of [product.heroImage, ...(product.gallery ?? []), ...(product.images ?? [])]) {
      if (!image?.src) continue;
      names.add(String(image.src).slice(String(image.src).lastIndexOf("/") + 1));
    }
  }
  return names;
}

/**
 * Two inks, built once.
 *
 * The dark one is the logo as drawn. The light one is its silhouette in white — the red
 * keystone is dropped there on purpose: a two-colour mark at 55% over a photograph turns
 * into a smudge, where a single-colour silhouette stays a shape you can recognise.
 */
async function inks(width) {
  const dark = await sharp(readFileSync(LOGO)).resize({ width }).png().toBuffer();
  const { data, info } = await sharp(readFileSync(LOGO))
    .resize({ width })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
  }
  const light = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toBuffer();
  return { dark, light, height: info.height };
}

/** Mean brightness of the patch the mark will sit on. */
async function patchBrightness(source, left, top, width, height) {
  const { data, info } = await sharp(source)
    .extract({ left, top, width, height })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    n += 1;
  }
  return sum / Math.max(1, n);
}

/** Apply a flat opacity to a premultiplied-alpha PNG buffer. */
async function fade(buffer, opacity) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    data[i + 3] = Math.round(data[i + 3] * opacity);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer();
}

async function main() {
  if (!existsSync(LOGO)) {
    console.error("找不到 public/images/rayen/logo.webp");
    process.exit(1);
  }

  const ledger = existsSync(LEDGER)
    ? (() => {
        try {
          return JSON.parse(readFileSync(LEDGER, "utf8"));
        } catch {
          return { stamped: {} };
        }
      })()
    : { stamped: {} };
  const stamped = ledger.stamped ?? {};

  const wanted = publishedImages();
  const files = readdirSync(DIR).filter((f) => /\.(webp|png|jpe?g)$/i.test(f) && wanted.has(f));

  let done = 0;
  let skipped = 0;
  const unstamped = [];
  const failed = [];

  for (const name of files) {
    const file = join(DIR, name);
    let source;
    try {
      source = readFileSync(file);
    } catch (error) {
      failed.push(`${name}（读不到 ${error.code ?? "unknown"}）`);
      continue;
    }

    /*
      Idempotency by content, not by a flag.

      The ledger stores the SHA of what this script last wrote. If the file still has that
      SHA it is already stamped and is left alone; if it differs, something upstream
      regenerated it and it needs stamping again. A boolean "done" flag would go stale the
      moment the watermark pass re-ran, and the alternative — stamping every time — would
      pile marks on top of each other.
    */
    const current = sha(source);
    if (!FORCE && stamped[name] === current) {
      skipped += 1;
      continue;
    }
    if (CHECK) {
      unstamped.push(name);
      continue;
    }

    try {
      const meta = await sharp(source).metadata();
      if (!meta.width || !meta.height) continue;

      const markWidth = Math.round(
        Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, meta.width * WIDTH_FRACTION)),
      );
      const { dark, light, height: markHeight } = await inks(markWidth);
      const margin = Math.round(Math.min(meta.width, meta.height) * MARGIN_FRACTION);

      const left = Math.max(0, meta.width - markWidth - margin);
      const top = Math.max(0, meta.height - markHeight - margin);
      /* An image smaller than its own mark plus margins has nowhere to put it. */
      if (markWidth + margin > meta.width || markHeight + margin > meta.height) {
        failed.push(`${name}（${meta.width}×${meta.height} 放不下标）`);
        continue;
      }

      const brightness = await patchBrightness(
        source,
        left,
        top,
        Math.min(markWidth, meta.width - left),
        Math.min(markHeight, meta.height - top),
      );
      const onLight = brightness >= 140;
      const mark = await fade(onLight ? dark : light, onLight ? OPACITY_ON_LIGHT : OPACITY_ON_DARK);

      const out = await sharp(source)
        .composite([{ input: mark, left, top }])
        .webp({ quality: 92 })
        .toBuffer();
      writeFileSync(file, out);
      stamped[name] = sha(out);
      done += 1;
    } catch (error) {
      failed.push(`${name}（${error.message?.slice(0, 60) ?? "unknown"}）`);
    }
  }

  if (CHECK) {
    if (unstamped.length) {
      console.error(`⚠ ${unstamped.length} 张在售产品图没有雷茵标：`);
      for (const line of unstamped.slice(0, 10)) console.error(`   ${line}`);
      console.error("   跑 node scripts/brand-rayen-images.mjs");
      process.exit(1);
    }
    console.log(`产品图品牌标检查通过：${files.length} 张都带标。`);
    return;
  }

  writeFileSync(
    LEDGER,
    `${JSON.stringify(
      {
        _readme: [
          "brand-rayen-images.mjs 生成，不要手改。",
          "记的是每张图打完标之后的 SHA。文件还是这个 SHA 就说明标已经在上面了，跳过；",
          "对不上就说明上游重新生成过，需要重新打 —— 用布尔开关记「打过了」，",
          "去水印那一步一重跑就失效，而每次都打会把标一层层叠上去。",
        ],
        ranAt: new Date().toISOString(),
        count: Object.keys(stamped).length,
        stamped,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`雷茵标：新打 ${done} 张，已有 ${skipped} 张，共 ${files.length} 张在售产品图。`);
  if (failed.length) {
    console.error(`⚠ ${failed.length} 张没打上：`);
    for (const line of failed.slice(0, 10)) console.error(`   ${line}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
