import { mkdirSync, rmSync } from "node:fs";
import sharp from "sharp";
const [S, OUT] = process.argv.slice(2);
rmSync(OUT, { recursive: true, force: true });

/* PDF page -> model, from the dark title pages read one by one. */
const MAIN = [
  [5,"D-5061"],[8,"D-5062"],[11,"D-5063"],[14,"D-1032"],[17,"D-1033"],[20,"D-1067"],
  [23,"D-1068"],[26,"D-3012"],[28,"D-3013"],[30,"D-3001"],[33,"D-3002"],[36,"D-3015"],
  [39,"D-3016"],[42,"D-1031"],[45,"D-1051"],[48,"DZ-2031"],[52,"DZ-2086"],[55,"DZ-2087"],
  [58,"DZ-2039"],[61,"D-3010"],[63,"D-3011"],[65,"D-3011A"],[67,"D-3019"],[69,"D-3021"],
  [72,"T-1073"],[73,"T-1075"],[74,"T-1076"],[75,"T-1077"],[76,"T-1078"],[78,"T-1079"],
  [81,"JL606"],[83,"JL607"],[85,"JL608"],[87,"JL609"],
];
/* The four glass-door top patches sit on the RIGHT page of their spread. */
const RIGHT = [[38,"D-3017"],[41,"D-3018"]];

const page = (n) => `${S}/hi/p${String(n).padStart(2, "0")}.png`;

async function crop(n, model, box) {
  const m = await sharp(page(n)).metadata();
  const dir = `${OUT}/${model}`;
  mkdirSync(dir, { recursive: true });
  await sharp(page(n))
    .extract({
      left: Math.round(m.width * box[0]),
      top: Math.round(m.height * box[1]),
      width: Math.round(m.width * (box[2] - box[0])),
      height: Math.round(m.height * (box[3] - box[1])),
    })
    .jpeg({ quality: 92 })
    .toFile(`${dir}/${model}-1-hero.jpg`);
}

/* Left page, below the BOCRIEO header and the model title, above the icon row. */
for (const [n, model] of MAIN) await crop(n, model, [0.02, 0.26, 0.44, 0.78]);
/* Right page, the dark panel only. */
for (const [n, model] of RIGHT) await crop(n, model, [0.47, 0.03, 0.99, 0.50]);
console.log("cropped", MAIN.length + RIGHT.length, "heroes ->", OUT);
