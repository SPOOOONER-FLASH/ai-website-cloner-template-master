import path from "node:path";
import sharp from "sharp";

const dir = import.meta.dirname;
const groups = {
  products: [
    ["A · FAMILY ATLAS — RECOMMENDED", "products-01-family-atlas.png"],
    ["B · CATEGORY MAP", "products-02-category-map.png"],
    ["C · DESIGNED AS A SYSTEM", "products-03-designed-system.png"],
    ["D · FAMILY TO INSTALLED OPENING", "products-04-family-to-opening.png"],
  ],
  menu: [
    ["A · SPECIFY / SOURCE / COMPANY — RECOMMENDED", "menu-01-specify-source-company.png"],
    ["B · PRODUCT FAMILIES", "menu-02-product-families.png"],
    ["C · APPLICATIONS FIRST", "menu-03-applications-first.png"],
    ["D · RFQ CONCIERGE", "menu-04-rfq-concierge.png"],
  ],
};

for (const [group, items] of Object.entries(groups)) {
  const tileWidth = 800;
  const tileHeight = 536;
  const imageWidth = 780;
  const imageHeight = 488;
  const composites = [];

  for (let index = 0; index < items.length; index += 1) {
    const [label, filename] = items[index];
    const left = (index % 2) * tileWidth;
    const top = Math.floor(index / 2) * tileHeight;
    const image = await sharp(path.join(dir, filename))
      .resize(imageWidth, imageHeight, { fit: "cover" })
      .png()
      .toBuffer();
    composites.push({ input: image, left: left + 10, top: top + 38 });
    composites.push({
      input: Buffer.from(
        `<svg width="${tileWidth}" height="38" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#11110f"/><text x="12" y="25" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="700">${label}</text></svg>`,
      ),
      left,
      top,
    });
  }

  await sharp({
    create: { width: 1600, height: 1072, channels: 3, background: "#d9dad5" },
  })
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(path.join(dir, `${group}-concepts-contact-sheet.webp`));
}

console.log("Built Products and menu concept contact sheets.");
