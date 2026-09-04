import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "../../..");
const publicDir = path.join(root, "public", "images", "editorial");
const outputDir = import.meta.dirname;

async function buildSheet(kind) {
  const tileWidth = 360;
  const tileHeight = 270;
  const imageWidth = 340;
  const imageHeight = 226;
  const columns = 5;
  const assets = Array.from({ length: 10 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      label: `${kind === "product-range" ? "PRODUCT" : "WALL"}-${number}`,
      source: path.join(publicDir, `hyde-editorial-${kind}-${number}.webp`),
    };
  });
  const rows = Math.ceil(assets.length / columns);
  const composites = [];

  for (let index = 0; index < assets.length; index += 1) {
    const asset = assets[index];
    const left = (index % columns) * tileWidth;
    const top = Math.floor(index / columns) * tileHeight;
    const image = await sharp(asset.source)
      .resize(imageWidth, imageHeight, { fit: "cover" })
      .webp({ quality: 82 })
      .toBuffer();
    composites.push({ input: image, left: left + 10, top: top + 34 });
    composites.push({
      input: Buffer.from(
        `<svg width="${tileWidth}" height="34" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#11110f"/><text x="12" y="23" fill="#ffffff" font-family="Arial, sans-serif" font-size="17" font-weight="700">${asset.label}</text></svg>`,
      ),
      left,
      top,
    });
  }

  const outputName = kind === "product-range" ? "product-contact-sheet.webp" : "wall-contact-sheet.webp";
  await sharp({
    create: { width: columns * tileWidth, height: rows * tileHeight, channels: 3, background: "#deddd8" },
  })
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(path.join(outputDir, outputName));
}

await buildSheet("product-range");
await buildSheet("exhibition-wall");
console.log("Built two editorial-library contact sheets.");
