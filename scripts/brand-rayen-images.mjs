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
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const CATEGORIES = join(root, "content", "categories.json");

const argv = process.argv.slice(2);
const FORCE = argv.includes("--force");
const CHECK = argv.includes("--check");

/*
  TWO MARKS, ONE PER LANGUAGE — and therefore two sets of image files.

  Client, 2026-09-13: 「en 站点的全部产品都得打上绿色的 logo，中文站都用黑色的，不要混淆」.

  This could not be done by choosing a logo at render time, because the mark is not drawn by
  the page — it is baked into the pixels of the .webp. One file cannot carry two marks, so
  the only way to have the English catalogue show the teal wordmark and the Chinese one show
  the black 雷茵 lockup is to ship two derivative sets and have each locale read its own:

      public/images/products-rayen/      黑色「RAYEN 雷茵」   ← 中文站
      public/images/products-rayen-en/   青绿 RAYEN 字标      ← 英文站

  Both are generated from the SAME unbranded source by the same pipeline, so they cannot
  drift in content — only in which mark sits in the corner. src/data/rayen.ts rewrites the
  path for the English locale; nothing else in the site needs to know.

  The cost is disk (two copies of ~1,100 images) and one more pass in the chain. The cost of
  not doing it is a Chinese logo on an English page, which is the "混淆" the client named.
*/
const LOCALES = {
  zh: {
    dir: join(root, "public", "images", "products-rayen"),
    logo: join(root, "public", "images", "rayen", "logo.webp"),
    ledger: join(root, "content", "rayen", "image-branding.json"),
    label: "中文站（黑色 RAYEN 雷茵）",
  },
  en: {
    dir: join(root, "public", "images", "products-rayen-en"),
    logo: join(root, "public", "images", "rayen", "logo-latin.webp"),
    ledger: join(root, "content", "rayen", "image-branding-en.json"),
    label: "英文站（青绿 RAYEN 字标）",
  },
};

const localeArg = (argv.find((a) => a.startsWith("--locale=")) ?? "").slice(9);
/*
  EN FIRST, ON PURPOSE.

  Every script in this chain writes in place, so products-rayen is unbranded only until the
  zh pass touches it. Seeding the English set from it therefore has exactly one safe moment:
  before that pass. Running zh first left the English set with 34 images — the guard below
  correctly refused the other 1,078 rather than stamping teal over black, which is the right
  failure, but a pipeline that depends on a guard firing is a pipeline that is ordered wrong.

  So en is stamped first, from the clean master, and zh second. The SHA guard stays as the
  backstop for incremental runs, where the master may already be branded from last time.
*/
const TARGETS = localeArg ? [LOCALES[localeArg]] : [LOCALES.en, LOCALES.zh];
if (localeArg && !LOCALES[localeArg]) {
  console.error(`--locale 只能是 zh 或 en，收到 ${localeArg}`);
  process.exit(1);
}

/*
  Proportions, so a 400px plate and a 2500px plate get the same-looking mark.

  0.16 → 0.20 on 2026-09-11, when the client supplied the new wordmark. The old lockup was
  "RAYEN 雷茵" at 3.42:1; the new one is the Latin wordmark alone at 5.83:1. Width is what
  is pinned here, so the same fraction would have made the mark 41% SHORTER — a quieter
  mark than before, on the same day the client said he could not see it on the live site.
  0.20 restores roughly the area the old mark covered (0.21 matches it exactly; 0.20 keeps
  the mark under a fifth of the frame, which matters more on a 1200mm handle shot upright).

  scripts/audit-rayen-images.mjs repeats these numbers rather than importing them, so that
  the audit cannot agree with the stamper by construction. Change one, change the other.
*/
const WIDTH_FRACTION = 0.2;
const MIN_WIDTH = 64;
const MAX_WIDTH = 320;
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

  /*
    The category covers on 产品中心 too.

    They are not any product's photograph, so the loop above never saw them, and for three
    weeks the first six pictures on the RAYEN catalogue page were the only unbranded ones on
    the site. Worse, until src/data/rayen.ts was fixed the same day they were being served
    straight out of /images/products/ with the Hyland 海得 oval still on them. Consistency is
    the argument (AGENTS.md): six unmarked cards above sixty marked ones reads as a page
    assembled from two different sources, which is exactly what it was.
  */
  const walk = (nodes) => {
    for (const node of nodes ?? []) {
      const src = node.image?.src;
      if (src) names.add(String(src).slice(String(src).lastIndexOf("/") + 1));
      walk(node.children);
    }
  };
  walk(JSON.parse(readFileSync(CATEGORIES, "utf8")).categories);

  return names;
}

/**
 * Two inks, built once.
 *
 * The dark one is the logo as drawn. The light one is its silhouette in white — the red
 * keystone is dropped there on purpose: a two-colour mark at 55% over a photograph turns
 * into a smudge, where a single-colour silhouette stays a shape you can recognise.
 */
async function inks(width, LOGO) {
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

/**
 * Stamp one locale's set.
 *
 * The English set does not exist until the first run — it is a copy of the unbranded
 * derivatives with a different mark on it — so the directory is created and any file the
 * Chinese set has but this one does not is copied across UNBRANDED first. That copy is the
 * one thing this function must get right: taking the file from products-rayen AFTER it has
 * been stamped would put the black 雷茵 lockup underneath the teal one.
 *
 * scripts/square-rayen-plates.mjs writes the unbranded squared images into products-rayen,
 * and this runs immediately after, so "unbranded" is simply "not yet in this ledger".
 */
async function brandOne({ dir: DIR, logo: LOGO, ledger: LEDGER, label }) {
  if (!existsSync(LOGO)) {
    console.error(`找不到 ${LOGO}`);
    process.exit(1);
  }
  mkdirSync(DIR, { recursive: true });

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

  /*
    Seed the English set from the master — but ONLY from files that are still unbranded.

    The first version copied whatever was in products-rayen, and produced exactly the failure
    this pipeline keeps producing: the teal wordmark stamped on top of the black 雷茵 lockup,
    both legible, on all 1,112 English images. Same root cause as the 「截 截面形状」 double
    print and the doubled mark of 2026-09-12 — every script here writes IN PLACE, so "copy
    the master" silently means "copy the master as it is right now", which after the zh pass
    is a branded file.

    The zh ledger records each file's SHA after the black mark went on. If the file still has
    that SHA it is branded and must not be used as a base; if it differs, squaring has
    rewritten it since and it is clean. That is an exact test rather than an assumption about
    run order, so it holds for a full chain run and an incremental one alike.
  */
  const MASTER = LOCALES.zh.dir;
  if (DIR !== MASTER && !CHECK) {
    const zhLedger = existsSync(LOCALES.zh.ledger)
      ? (JSON.parse(readFileSync(LOCALES.zh.ledger, "utf8")).stamped ?? {})
      : {};
    const alreadyBranded = [];
    for (const name of readdirSync(MASTER)) {
      if (!/\.(webp|png|jpe?g)$/i.test(name) || !wanted.has(name)) continue;
      if (existsSync(join(DIR, name))) continue;
      const source = readFileSync(join(MASTER, name));
      if (zhLedger[name] === sha(source)) {
        alreadyBranded.push(name);
        continue;
      }
      writeFileSync(join(DIR, name), source);
    }
    if (alreadyBranded.length) {
      console.error(
        `⚠ ${alreadyBranded.length} 张 products-rayen 里的图已经打了中文标，不能拿来做英文图的底` +
          `（会叠成两个标）。\n   先删掉两个目录再整条重跑：` +
          `rm -rf public/images/products-rayen public/images/products-rayen-en && npm run rayen:images`,
      );
      process.exit(1);
    }
  }

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
      const { dark, light, height: markHeight } = await inks(markWidth, LOGO);
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
    console.log(`  ${label}：${files.length} 张都带标。`);
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

  console.log(`${label}：新打 ${done} 张，已有 ${skipped} 张，共 ${files.length} 张。`);
  if (failed.length) {
    console.error(`⚠ ${failed.length} 张没打上：`);
    for (const line of failed.slice(0, 10)) console.error(`   ${line}`);
  }
}

async function main() {
  if (CHECK) console.log("产品图品牌标检查：");
  for (const target of TARGETS) await brandOne(target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
