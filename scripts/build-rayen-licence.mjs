/**
 * Prepare the business licence for publication: legible, but useless to a forger.
 *
 * WHY PUBLISH IT AT ALL
 * A Chinese buyer checking whether a supplier is a real company looks for the 营业执照 and the
 * 统一社会信用代码, and checks the code on gsxt.gov.cn. A B2B site without one reads as a
 * trading shell. So it goes up.
 *
 * WHAT "保护" MEANS HERE, AND WHAT IT DELIBERATELY DOES NOT MEAN
 * Client, 2026-09-14: 「营业执照你保护下，然后搭上水印」.
 *
 * The risk is not that someone reads the licence — every field on it is already public
 * record, queryable by anyone with the credit code. The risk is that someone LIFTS the image
 * and uses a clean, high-resolution copy to impersonate the company: a fake quotation, a fake
 * storefront, a fake bank instruction. So the protection is aimed at reuse, not at reading:
 *
 *   1. A tiled diagonal watermark across the whole document, including over the seal and the
 *      QR code. It cannot be cropped out, and removing it convincingly is real work.
 *   2. The long edge is capped. Enough to read every field on a phone; not a print-quality
 *      scan.
 *
 * WHAT IS NOT REDACTED, ON PURPOSE
 * The credit code, the company name, the legal representative and the registered address all
 * stay readable. Blacking out the credit code would be the one change that makes publishing
 * the licence pointless: the code is how a buyer verifies the company is real, and it is
 * published by the government already. Hiding it would leave a picture that proves nothing.
 *
 * The QR code stays too — it resolves to that same public record.
 *
 * Usage:
 *   node scripts/build-rayen-licence.mjs <source-image>
 *   node scripts/build-rayen-licence.mjs <source-image> --crop=x,y,w,h   # trim to the document
 *   node scripts/build-rayen-licence.mjs <source-image> --rotate=-1.5
 */

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(root, "public", "images", "rayen");
const OUT = join(OUT_DIR, "business-licence.webp");

const argv = process.argv.slice(2);
const source = argv.find((a) => !a.startsWith("--"));
const crop = (argv.find((a) => a.startsWith("--crop=")) ?? "").slice(7);
const rotate = Number((argv.find((a) => a.startsWith("--rotate=")) ?? "--rotate=0").slice(9));

if (!source || !existsSync(source)) {
  console.error(
    "用法：node scripts/build-rayen-licence.mjs <营业执照图片> [--crop=x,y,w,h] [--rotate=角度]",
  );
  process.exit(1);
}

/* Long edge, in pixels. Every field stays readable at this size; a print-quality forgery
   base does not survive it. */
const MAX_EDGE = 1400;

const MARK_ZH = "雷茵五金 · 仅供官网展示";
const MARK_LATIN = "RAYEN · WEBSITE COPY";

/**
 * A tile of watermark text, repeated across the document.
 *
 * Two lines per tile, one Chinese and one latin, so the mark reads as deliberate to either
 * audience rather than as damage. Rendered at an angle because horizontal text lines up with
 * the document's own rows and is far easier to paint out.
 */
function watermarkTile(w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <pattern id="m" width="${Math.round(w / 2.4)}" height="${Math.round(h / 4.5)}"
        patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
        <text x="0" y="16" font-family="Microsoft YaHei, Noto Sans SC, sans-serif"
          font-size="19" fill="#0b4a63" fill-opacity="0.19">${MARK_ZH}</text>
        <text x="0" y="38" font-family="Arial, Helvetica, sans-serif"
          font-size="14" letter-spacing="2" fill="#0b4a63" fill-opacity="0.15">${MARK_LATIN}</text>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#m)"/>
  </svg>`;
  return Buffer.from(svg);
}

async function main() {
  let image = sharp(source).rotate(); // honour EXIF orientation first
  if (rotate) image = image.rotate(rotate, { background: "#ffffff" });

  if (crop) {
    const [x, y, w, h] = crop.split(",").map((n) => Number(n.trim()));
    if ([x, y, w, h].some((n) => !Number.isFinite(n))) {
      console.error(`--crop 读不懂：${crop}，要的是 x,y,w,h 四个数字`);
      process.exit(1);
    }
    image = image.extract({ left: x, top: y, width: w, height: h });
  }

  const flat = await image.toBuffer();
  const meta = await sharp(flat).metadata();
  const scale = Math.min(1, MAX_EDGE / Math.max(meta.width, meta.height));
  const width = Math.round(meta.width * scale);
  const height = Math.round(meta.height * scale);

  const resized = await sharp(flat).resize(width, height).toBuffer();

  mkdirSync(OUT_DIR, { recursive: true });
  await sharp(resized)
    .composite([{ input: watermarkTile(width, height), blend: "over" }])
    .webp({ quality: 88 })
    .toFile(OUT);

  console.log(`营业执照已处理 → ${OUT}`);
  console.log(`   原图 ${meta.width}×${meta.height} → ${width}×${height}（长边上限 ${MAX_EDGE}）`);
  console.log(`   平铺水印：「${MARK_ZH}」/「${MARK_LATIN}」，盖过公章与二维码，裁不掉`);
  console.log(`   统一社会信用代码、公司名称、法定代表人、住所都保持可读 ——`);
  console.log(`   买家要拿这个号去 gsxt.gov.cn 查，盖掉就等于没发。`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
