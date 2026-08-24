/**
 * Renders the site-wide Open Graph fallback image to public/seo/og-default.png.
 *
 * 132 built pages were shipping without an og:image — every section page, and every
 * product that still has no photography. A link to those pages pastes into WhatsApp,
 * LinkedIn or a Slack channel as a bare grey box, which for a site whose whole job is
 * to collect enquiries is a wasted impression.
 *
 * This is assembled from assets already in the repository — the HYDE horizontal
 * logotype and the brand red from globals.css — rather than being a new piece of
 * design, so it stays consistent with whatever the brand work settles on.
 *
 *   node scripts/build-og-image.mjs
 */
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const W = 1200;
const H = 630;                       // the ratio every platform crops toward
const BRAND = "#e32322";             // --color-brand
const INK = "#121212";               // --color-ink
const SURFACE = "#ffffff";           // --color-surface

const LOGO = "public/images/brand/hyde/hyde-logo-horizontal-black.svg";
const OUT_DIR = "public/seo";
const OUT = `${OUT_DIR}/og-default.png`;

mkdirSync(OUT_DIR, { recursive: true });

const logo = await sharp(readFileSync(LOGO)).resize({ width: 420 }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();

const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${SURFACE}"/>
  <rect x="0" y="${H - 14}" width="${W}" height="14" fill="${BRAND}"/>
  <text x="80" y="392" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="46" font-weight="600" fill="${INK}">Architectural door hardware</text>
  <text x="80" y="452" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="28" fill="#6e6e73">Panic exit devices · Mortise locks · Lever handles · Hinges</text>
  <text x="80" y="524" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="24" fill="#8e8e93">Canton Hyland Hardware (Group) Co., Ltd. · Guangdong, China</text>
</svg>`);

await sharp(text)
  .composite([{ input: logo, left: 80, top: 190 - Math.round((logoMeta.height ?? 0) / 2) + 40 }])
  .png()
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`${OUT}  ${meta.width}x${meta.height}  ${meta.format}`);
