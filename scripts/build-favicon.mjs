/**
 * Builds the site favicon from the HYDE brand mark.
 *
 * The repository shipped with Next.js's default favicon.ico — a placeholder nobody
 * chose. This replaces it with the actual brand mark, which is what a buyer sees in
 * their tab strip and in a bookmark list.
 *
 * Two outputs, because they solve different problems:
 *
 *   src/app/icon.svg    Modern browsers. Carries a prefers-color-scheme rule so the
 *                       mark flips to white on a dark tab strip — a black-only icon
 *                       disappears entirely there, which is the usual favicon mistake.
 *   src/app/favicon.ico  Fallback for anything that ignores SVG icons. Black, because
 *                       an .ico cannot adapt and light tab strips are the common case.
 *
 * The brand mark is 234x204, so it is padded to a square and inset slightly — a glyph
 * that runs edge to edge reads as a smudge at 16px.
 *
 *   node scripts/build-favicon.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const OUT_SVG = "src/app/icon.svg";
const OUT_ICO = "src/app/favicon.ico";

/** The three rounded bars of the HYDE "H", re-laid onto a 256 square. */
function markSvg(fill) {
  // Source art is 234x204 inside a 234x204 viewBox. Centre it on 256 with an inset so
  // the glyph does not touch the edges at small sizes.
  const scale = 0.78;
  const w = 234 * scale;
  const h = 204 * scale;
  const dx = (256 - w) / 2;
  const dy = (256 - h) / 2;
  return `<g transform="translate(${dx.toFixed(2)} ${dy.toFixed(2)}) scale(${scale})">
    <rect x="12" y="12" width="34" height="180" rx="17" fill="${fill}"/>
    <rect x="29" y="85" width="141" height="34" rx="17" fill="${fill}"/>
    <rect x="188" y="12" width="34" height="180" rx="17" fill="${fill}"/>
  </g>`;
}

/* --- SVG icon, theme aware ------------------------------------------------ */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="HYDE">
  <style>
    .mark { fill: #000000; }
    @media (prefers-color-scheme: dark) { .mark { fill: #ffffff; } }
  </style>
  <g class="mark">${markSvg("currentColor").replace(/fill="currentColor"/g, "")}</g>
</svg>
`;
writeFileSync(OUT_SVG, svg);

/* --- ICO, built by hand ---------------------------------------------------
 * .ico is a tiny container: a 6-byte header, then one 16-byte directory entry per
 * image, then the images themselves. Since Vista an entry may hold a PNG verbatim,
 * which is what every current browser reads — so there is no need for a BMP encoder
 * or an extra dependency.
 */
const SIZES = [16, 32, 48];

const pngs = await Promise.all(
  SIZES.map((size) =>
    sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${markSvg("#000000")}</svg>`))
      .resize(size, size)
      .png()
      .toBuffer(),
  ),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // 1 = icon
header.writeUInt16LE(SIZES.length, 4);

let offset = 6 + 16 * SIZES.length;
const entries = SIZES.map((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size === 256 ? 0 : size, 0); // width  (0 means 256)
  e.writeUInt8(size === 256 ? 0 : size, 1); // height
  e.writeUInt8(0, 2);                        // palette size
  e.writeUInt8(0, 3);                        // reserved
  e.writeUInt16LE(1, 4);                     // colour planes
  e.writeUInt16LE(32, 6);                    // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});

mkdirSync("src/app", { recursive: true });
writeFileSync(OUT_ICO, Buffer.concat([header, ...entries, ...pngs]));

console.log(`${OUT_SVG}   theme-aware, flips to white on dark tab strips`);
console.log(`${OUT_ICO}  ${SIZES.join("/")}px, ${(Buffer.concat(pngs).length / 1024).toFixed(1)} KB`);
