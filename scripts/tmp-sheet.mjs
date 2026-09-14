import { readdirSync } from "node:fs";
import sharp from "sharp";
const OUT = process.argv[2];
const models = readdirSync(OUT).sort();
const tiles = [];
for (let i = 0; i < models.length; i++) {
  const f = `${OUT}/${models[i]}/${models[i]}-1-hero.jpg`;
  const b = await sharp(f).resize({ width: 280, height: 190, fit: "contain", background: "#fff" }).png().toBuffer();
  tiles.push({ input: b, left: (i % 6) * 285, top: Math.floor(i / 6) * 195 });
}
await sharp({ create: { width: 1710, height: Math.ceil(models.length / 6) * 195, channels: 3, background: "#ccc" } })
  .composite(tiles).png().toFile(`${OUT}/sheet.png`);
console.log(models.join(" "));
