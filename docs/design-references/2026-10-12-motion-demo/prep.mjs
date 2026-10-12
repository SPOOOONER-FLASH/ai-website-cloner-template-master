// Copies the real HYDE images this demo uses and computes its numbers from the site's own data.
// Nothing here is invented: counts come from content/products with the site's own publish rule
// (on the HYDE catalogue and has a hero photograph), photos come from public/images and the
// catalogue's white-field plates.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { geoContains, geoEqualEarth } from "d3-geo";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json" with { type: "json" };
import countries110 from "world-atlas/countries-110m.json" with { type: "json" };

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

// The same map for the live homepage (src/components/site/ExportMap.tsx): dots, market
// countries and their points projected once here, so the site needs neither d3-geo nor the
// world atlas. Countries are the client's own list (2026-10-12): every Western European
// country, the US and Canada, seven South American countries, Japan, Korea, Australia, plus
// the markets the company page already named (Russia, Turkey, Southeast Asia). Names are not
// stored: the site renders ISO codes through Intl.DisplayNames in each of its ten languages.
const W = 1000, H = 500;
const proj = geoEqualEarth().rotate([-15, 0]).fitExtent([[0, 0], [W, H]], { type: "Sphere" }).scale(205).translate([W / 2 + 10, H / 2 + 40]);
const xy = (lonlat) => proj(lonlat).map((v) => +v.toFixed(1));
// [iso2, ISO numeric, group, route target (capital), label: false | [dx, dy, anchor]]
const MARKETS = [
  ["DE", "276", "europe", [13.4, 52.5], [6, -8, "start"]],
  ["FR", "250", "europe", [2.35, 48.86], false],
  ["GB", "826", "europe", [-0.13, 51.5], [-8, 4, "end"]],
  ["ES", "724", "europe", [-3.7, 40.4], [-8, 14, "end"]],
  ["IT", "380", "europe", [12.5, 41.9], [6, 16, "start"]],
  ["NL", "528", "europe", [4.9, 52.37], false],
  ["BE", "056", "europe", [4.35, 50.85], false],
  ["LU", "442", "europe", [6.13, 49.6], false],
  ["AT", "040", "europe", [16.37, 48.2], false],
  ["CH", "756", "europe", [7.45, 46.95], false],
  ["PT", "620", "europe", [-9.14, 38.72], false],
  ["IE", "372", "europe", [-6.26, 53.35], false],
  ["RU", "643", "europe", [37.6, 55.75], [4, -20, "start"]],
  ["TR", "792", "europe", [32.85, 39.9], [8, 16, "start"]],
  ["US", "840", "americas", [-77.0, 38.9], [-8, 14, "end"]],
  ["CA", "124", "americas", [-75.7, 45.4], [-8, -8, "end"]],
  ["VE", "862", "americas", [-66.9, 10.5], [8, -4, "start"]],
  ["CO", "170", "americas", [-74.1, 4.7], [-8, 2, "end"]],
  ["EC", "218", "americas", [-78.5, -0.2], [-8, 12, "end"]],
  ["PE", "604", "americas", [-77.0, -12.0], [-8, 4, "end"]],
  ["BR", "076", "americas", [-47.9, -15.8], [8, 4, "start"]],
  ["CL", "152", "americas", [-70.7, -33.4], [-8, 4, "end"]],
  ["AR", "032", "americas", [-58.4, -34.6], [8, 10, "start"]],
  ["KR", "410", "asiaPacific", [127.0, 37.55], [-6, -10, "end"]],
  ["JP", "392", "asiaPacific", [139.7, 35.7], [8, 4, "start"]],
  ["AU", "036", "asiaPacific", [149.1, -35.3], [8, 4, "start"]],
];
// Southeast Asia is a region on the company page, so it is one route and one label.
const SEA = { ids: ["704", "764", "458", "360", "608", "116", "104", "418"], at: [101.7, 3.1], label: [8, 14, "start"] };
const countries = feature(countries110, countries110.objects.countries).features;
const marketIds = new Set([...MARKETS.map((m) => m[1]), ...SEA.ids]);
const marketShapes = countries.filter((c) => marketIds.has(c.id));
if (marketShapes.length !== marketIds.size) throw new Error(`market country missing from the atlas: ${[...marketIds].filter((id) => !countries.some((c) => c.id === id))}`);
const toPath = (list) => list.map(([lon, lat]) => { const [x, y] = proj([lon, lat]).map(Math.round); return `M${x} ${y}h0`; }).join("");
const inMarket = dots.filter((d) => marketShapes.some((c) => geoContains(c, d)));
const marketSet = new Set(inMarket);
const siteMap = {
  generatedBy: "docs/design-references/2026-10-12-motion-demo/prep.mjs",
  viewBox: [W, H],
  // Whole pixels: a 3px dot does not need a decimal, and the path ships in the homepage HTML.
  dots: toPath(dots.filter((d) => !marketSet.has(d))),
  marketDots: toPath(inMarket),
  origin: { key: "zhongshan", ...Object.fromEntries(xy([113.39, 22.52]).map((v, i) => [i ? "y" : "x", v])) },
  targets: [
    ...MARKETS.map(([iso, , group, at, label]) => { const [x, y] = xy(at); return { iso, group, x, y, label: label && { dx: label[0], dy: label[1], anchor: label[2] } }; }),
    (() => { const [x, y] = xy(SEA.at); return { iso: "SEA", group: "asiaPacific", x, y, label: { dx: SEA.label[0], dy: SEA.label[1], anchor: SEA.label[2] } }; })(),
  ],
};
fs.writeFileSync(path.join(SITE, "src/data/generated/export-map.json"), `${JSON.stringify(siteMap, null, 1)}\n`);

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
