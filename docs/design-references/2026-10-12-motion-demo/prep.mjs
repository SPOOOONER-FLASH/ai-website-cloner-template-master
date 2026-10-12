// Copies the real HYDE images this demo uses and computes its numbers from the site's own data.
// Nothing here is invented: counts come from content/products with the site's own publish rule
// (on the HYDE catalogue and has a hero photograph), photos come from public/images and the
// catalogue's white-field plates.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json" with { type: "json" };

// The repository root: this demo lives in docs/design-references/<date>-motion-demo/.
const SITE = path.resolve(import.meta.dirname, "../../..");
const OUT = path.resolve(import.meta.dirname, "public/img");
fs.mkdirSync(OUT, { recursive: true });

const products = fs.readdirSync(path.join(SITE, "content/products"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(SITE, "content/products", f), "utf8")))
  .filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);
const categories = JSON.parse(fs.readFileSync(path.join(SITE, "content/categories.json"), "utf8")).categories;

// Same eight groups as the Canton Fair flyer; `model` is the photograph shown for the group.
const GROUPS = [
  ["Panic exit devices", ["panic-exit-devices"], "307-panic-exit-device"],
  ["Lock cases & cylinders", ["lock-cases", "lock-cylinders"], "lc14-85-50mm-lock-case"],
  ["Lever handles", ["lever-handles"], "3431-sset-lever-handle"],
  ["Stainless steel handles", ["stainless-steel-handles"], "9014-ssbk-stainless-steel-handle"],
  ["Knob & tubular locks", ["knob-locks"], "575-abet-tubular-lock"],
  ["Rim, grip & hook locks", ["night-latches-rim-locks", "grip-handle-sets", "sliding-hook-locks"], "564-mb-night-latch-and-rim-lock"],
  ["Hinges & accessories", ["brass-steel-hinges", "hardware-accessories"], "b025-brass-and-steel-hinges"],
  ["Glass door & bathroom", ["glass-door-accessories", "bathroom-accessories"], "f101-glass-door-patch-fittings"],
];
const families = GROUPS.map(([title, slugs, slug]) => {
  const count = products.filter((p) => slugs.includes(p.categoryPath?.[0])).length;
  const p = products.find((x) => x.slug === slug);
  return { title, slugs, count, model: p.model, slug, img: `img/${slug}.webp`, url: `https://cantonlock.com/products/${slugs[0]}/` };
});

const RANGE = ["307-panic-exit-device", "311-panic-exit-device", "305-fire-door-panic-exit-device", "9014-ssbk-stainless-steel-handle",
  "9001-stainless-steel-handle", "3431-sset-lever-handle", "575-abet-tubular-lock", "564-mb-night-latch-and-rim-lock",
  "lc14-85-50mm-lock-case", "b025-brass-and-steel-hinges", "f101-glass-door-patch-fittings", "578-acet-light-duty-cylindrical-lock"];
const range = RANGE.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean)
  .map((p) => ({ model: p.model, name: p.name, slug: p.slug, img: `img/${p.slug}.webp`,
    specs: (p.specs || []).filter((s) => !/minimum order/i.test(s.label)).slice(0, 2) }));

const hot = products.find((p) => p.slug === "307-panic-exit-device");
const hotspot = { model: hot.model, name: hot.name, img: "img/307-panic-exit-device.webp",
  specs: hot.specs.filter((s) => ["Material", "Size", "Fire Rating", "Application"].includes(s.label)) };

const PHOTOS = {
  "editorial/home-panic-exit-bars.webp": "hero-1.webp",
  "editorial/hero-civic-corridor.webp": "hero-2.webp",
  "editorial/hyde-real-lever-set-dark.webp": "hero-3.webp",
  "editorial/hyde-real-cylinder-dark.webp": "hero-4.webp",
  "company/press-shop.webp": "f-stamp.webp",
  "company/factory-cnc-machining.webp": "f-cnc.webp",
  "company/factory-polishing-workshop.webp": "f-polish.webp",
  "company/factory-assembly-quality-line.webp": "f-assembly.webp",
  "company/facility-yard.webp": "f-yard.webp",
};
for (const [src, dst] of Object.entries(PHOTOS)) fs.copyFileSync(path.join(SITE, "public/images", src), path.join(OUT, dst));

// White-field catalogue plates -> 1100px webp (Pillow; already used by the catalogue scripts).
const plates = [...new Set([...families.map((f) => f.slug), ...range.map((r) => r.slug), "307-panic-exit-device"])];
const py = `
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
for slug in sys.argv[3:]:
    im = Image.open(f"{src}/{slug}.jpg").convert("RGB"); im.thumbnail((1100, 1100)); im.save(f"{out}/{slug}.webp", quality=86)
`;
execFileSync("py", ["-c", py, path.join(SITE, "tmp/catalogue-plates-hi"), OUT, ...plates], { stdio: "inherit" });

// Dot-matrix world for the export map: one dot per 2.4 degrees that falls on land.
const land = feature(land110, land110.objects.land);
const dots = [];
for (let lat = 78; lat >= -56; lat -= 2.4) for (let lon = -170; lon <= 180; lon += 2.4)
  if (geoContains(land, [lon, lat])) dots.push([+lon.toFixed(1), +lat.toFixed(1)]);

for (const c of ["ink", "white"]) for (const k of ["horizontal", "stacked", "icon"])
  fs.copyFileSync(path.join(SITE, `docs/brand/hyde-2026/marks/hyde-${k}-${c}.svg`), path.join(OUT, `hyde-${k}-${c}.svg`));

const data = {
  snapshot: "2026-10-12",
  facts: { products: products.length, categories: categories.length, founded: 1998, iso: 2002, staff: "101–200", languages: 10,
    withVideo: products.filter((p) => p.videos?.length).length },
  families, range, hotspot, dots,
};
fs.writeFileSync("src/data.json", JSON.stringify(data, null, 2));
console.log(`products ${products.length}, categories ${categories.length}, families ${families.map((f) => f.count).join("/")}, range ${range.length}, dots ${dots.length}`);
