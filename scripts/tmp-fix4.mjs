import { mkdirSync } from "node:fs";
import sharp from "sharp";
const [S, OUT] = process.argv.slice(2);
const page = (n) => `${S}/hi/p${String(n).padStart(2, "0")}.png`;
/* Product only — clear of the model title on the left of each dark panel and of the
   slogan in the top-right corner. */
const jobs = [
  [38, "D-3017", [0.716, 0.06, 0.995, 0.445]],
  [41, "D-3018", [0.716, 0.06, 0.995, 0.445]],
  [51, "D-1042", [0.246, 0.06, 0.495, 0.445]],
  [51, "D-1043", [0.748, 0.06, 0.995, 0.445]],
];
for (const [n, model, box] of jobs) {
  const m = await sharp(page(n)).metadata();
  mkdirSync(`${OUT}/${model}`, { recursive: true });
  await sharp(page(n))
    .extract({
      left: Math.round(m.width * box[0]),
      top: Math.round(m.height * box[1]),
      width: Math.round(m.width * (box[2] - box[0])),
      height: Math.round(m.height * (box[3] - box[1])),
    })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/${model}/${model}-1-hero.jpg`);
}
console.log("fixed 4");
