import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Explicit, visually inspected crops of first-party catalogue photographs.
// Only complete individual products are selected. No inpainting, invented parts,
// color replacement, geometry edits, or claimed compatible assembled set.
const root = "public/images/products/";
const output = "public/images/editorial/";
const photos = {
  lever: ["9001-stainless-steel-handle.webp", [65, 145, 675, 510]],
  panic: ["305-fire-door-panic-exit-device.webp", [20, 210, 950, 620]],
  hinge: ["stainless-steel-door-hinge.webp", [0, 180, 1000, 710]],
  lock: ["lc14-85-50mm-lock-case.webp", [15, 155, 175, 535]],
  pull: ["stainless-steel-glass-door-pull-handle.webp", [490, 180, 330, 690]],
  flush: ["600-concealed-sliding-door-handle.webp", [320, 285, 180, 475]],
  cylinder: ["70sn-lock-cylinder.webp", [0, 120, 800, 600]],
  control: ["wooden-door-floor-hinge.webp", [145, 180, 760, 675]],
  accessory: ["../products-hyde/stainless-steel-flush-bolt.webp", [25, 90, 890, 795]],
};
const layers = [
  ["lever", 80, 90, 360, 280],
  ["panic", 580, 90, 640, 300],
  ["pull", 1430, 130, 250, 750],
  ["hinge", 90, 480, 350, 320],
  ["lock", 550, 480, 145, 440],
  ["cylinder", 800, 540, 270, 230],
  ["accessory", 1120, 540, 270, 250],
  ["control", 120, 940, 470, 280],
  ["flush", 880, 930, 110, 290],
];
async function crop(name, w, h) {
  const [file, box] = photos[name];
  const [left, top, width, height] = box;
  return sharp(root + file).extract({ left, top, width, height })
    .resize(w, h, { fit: "contain", background: "#ffffff" }).toBuffer();
}
async function provenance(file, sources, operation) {
  const records = await Promise.all(sources.map(async (source) => ({
    source, sha256: createHash("sha256").update(await readFile(source)).digest("hex"),
  })));
  await writeFile(output + file + ".json", JSON.stringify({
    kind: "real-photograph-composition", operation, sources: records,
    productGeometry: "Original pixels retained; uniform resize and complete-object crop only.",
    scope: "Catalogue overview, not an assembled set or dimension drawing.",
  }, null, 2) + "\n");
}
const atlas = "hyde-real-product-atlas.webp";
await sharp({ create: { width: 1800, height: 1300, channels: 3, background: "#ffffff" } })
  .composite(await Promise.all(layers.map(async ([name, left, top, w, h]) => ({
    input: await crop(name, w, h), left, top,
  })))).webp({ quality: 92 }).toFile(output + atlas);
await provenance(atlas, Object.values(photos).map(([file]) => root + file), "Independent complete catalogue products composed on white; crops defined in script.");

for (const name of ["lever", "hinge", "pull", "control", "lock", "panic", "cylinder"]) {
  const file = `hyde-real-${name}-plate.webp`;
  const input = await crop(name, 740, 560);
  await sharp({ create: { width: 1200, height: 800, channels: 3, background: "#ffffff" } })
    .composite([{ input, left: 230, top: 120 }]).webp({ quality: 92 }).toFile(output + file);
  await provenance(file, [root + photos[name][0]], "Complete product cropped from its first-party source and uniformly resized on white.");
}

const applicationSource = "public/images/company/hero-designed-for.webp";
const application = "hyde-real-application-detail.webp";
await sharp(applicationSource).webp({ quality: 92 }).toFile(output + application);
await provenance(application, [applicationSource], "First-party storefront push/pull lock photograph from client asset pack. Format conversion only; no invented installation context.");
console.log("Created real-photo atlas, seven product plates, and one first-party application detail.");
