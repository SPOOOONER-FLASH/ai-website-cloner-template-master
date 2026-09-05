#!/usr/bin/env node
/**
 * The geometry brief a 3D modeller needs so a render cannot invent a hole position.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE IS THE WHOLE ARGUMENT FOR RENDERING
 *
 * AGENTS.md forbids generating an imagined metal product, and a render is a generated
 * image. The rule survives only if the GEOMETRY is not imagined — if every dimension in
 * the model was measured before the model existed. FSB's own hero images are renders;
 * what makes theirs legitimate is that they are renders OF something.
 *
 * So this script does not design anything. It reads the dimensions the catalogue already
 * publishes — plate size, backset, centre distance, projection, cylinder cutout, bolt
 * throw — and prints them per model, next to the reference photographs, as the input a
 * modeller works from. Anything the catalogue does not state is printed as MISSING
 * rather than left blank, because a blank invites a guess and a guess is the failure
 * this whole discipline exists to prevent.
 *
 * A dimension that comes back MISSING is a question for the factory, not for the artist.
 *
 * ---------------------------------------------------------------------------
 * HOW THE HERO SET WAS CHOSEN
 *
 * Not by taste. Two sources of evidence, both the client's own:
 *
 *   SEARCH      Bing keyword tool, recorded 2026-09-04: `abs-015` at 169 impressions is
 *               the largest single keyword signal the site has.
 *   EXHIBITION  The client's own 展会样品核对清单 — fifteen models they are physically
 *               taking to the show. A model on that list is one they will be asked about
 *               in person, which is a stronger signal than a page view.
 *
 * Usage:  node scripts/build-render-brief.mjs [--out tmp/claude-render]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i > -1 ? args[i + 1] : d;
};

/*
  The hero set. `pair` marks the two models the client's own checklist sells together —
  row 9 reads "Panic Exit Device 310+015", the bar and the outside handle it is operated
  from. That is the ONLY set in this list documented as a set, and it is the answer to
  the note on the rejected batch: 这个盒子里面配件…因为这样才是一套. A set image is
  legitimate when the factory sells the set, and not otherwise.
*/
const HERO_SET = [
  { slug: "015-panic-exit-device", why: "Bing 第一关键词 abs-015，169 次展示", shot: "single", pair: "310-panic-exit-device" },
  { slug: "310-panic-exit-device", why: "展会清单 9：310+015 是厂里成套卖的组合", shot: "pair", pair: "015-panic-exit-device" },
  { slug: "305-fire-door-panic-exit-device", why: "展会清单 7", shot: "single" },
  { slug: "307-panic-exit-device", why: "展会清单 10；库存里自己有", shot: "single" },
  { slug: "308-s-s-panic-exit-device", why: "展会清单 12", shot: "single" },
  { slug: "301-panic-exit-device", why: "展会清单 14，土耳其款", shot: "single" },
  { slug: "311-panic-exit-device", why: "展会清单 15", shot: "single" },
  { slug: "564-night-latch-and-rim-lock", why: "展会清单 11", shot: "single" },
  { slug: "587-pbet-light-duty-cylindrical-lock", why: "展会清单 5，球形锁", shot: "single" },
  { slug: "lc14-85-50mm-lock-case", why: "展会清单 6，四圆钢舌", shot: "single" },
  { slug: "hy007-s-lock-case", why: "展会清单 4，窄框铝门锁体", shot: "single" },
  { slug: "9001-stainless-steel-handle", why: "不锈钢拉手，展品库存已在备货", shot: "single" },
  { slug: "b024-brass-and-steel-hinges", why: "不锈钢合页，展品库存已在备货", shot: "single" },
];

/*
  Which spec labels carry geometry. A model is built from these and nothing else; a label
  outside this list may be true and useful on the page, but it does not constrain a shape,
  and printing it here would pad the brief with facts a modeller cannot act on.
*/
const GEOMETRY_LABELS = [
  "Plate size", "Plate thickness", "Plate width", "Plate height",
  "Backset", "Centre distance", "Center Distance", "Grip centre distance", "Fixing centre", "Fixing centres",
  "Projection", "Cylinder cutout", "Cross bore", "Spindle Hole", "Spindle", "Spindle length",
  "Deadbolt throw", "Latch extension", "Latch throw", "Bolt projection",
  "Size", "Sizes", "Length", "Width", "Height", "Thickness", "Diameter",
  "Tube diameter", "Tube Thickness", "Rose diameter", "Rosette Diameter", "Rose thickness", "Rose depth",
  "Lever length", "Lever section", "Lever drop", "Drop",
  "Bar section", "Bar Length", "Case depth", "Case height", "Door thickness",
  "Faceplate to cylinder centre", "Cylinder centre to back", "Hole Count", "Opening Angle",
];

/* Dimensions without which a part cannot be installed, by family. */
const MUST_HAVE = {
  "panic-exit-devices": ["Plate size", "Grip centre distance", "Projection", "Cylinder cutout"],
  "lock-cases": ["Backset", "Centre distance", "Deadbolt throw", "Faceplate"],
  "night-latches-rim-locks": ["Size", "Backset", "Cylinder"],
  "knob-locks": ["Backset", "Cross bore", "Door thickness"],
  "stainless-steel-handles": ["Length", "Tube diameter", "Fixing centre", "Projection"],
  "brass-steel-hinges": ["Size", "Thickness", "Hole Count"],
  "lever-handles": ["Backset", "Rose diameter", "Lever length", "Spindle"],
};

const brief = [];
for (const entry of HERO_SET) {
  const file = join("content/products", `${entry.slug}.json`);
  if (!existsSync(file)) {
    brief.push({ ...entry, error: "目录里没有这个 slug" });
    continue;
  }
  const p = JSON.parse(readFileSync(file, "utf8"));
  const family = p.categoryPath?.[0] ?? "";
  const specs = p.specs ?? [];

  const geometry = specs
    .filter((s) => GEOMETRY_LABELS.includes(s.label))
    .map((s) => ({ label: s.label, value: s.value }));

  const have = new Set(geometry.map((g) => g.label));
  const missing = (MUST_HAVE[family] ?? []).filter((label) => !have.has(label));

  /* Every angle we hold. A render needs a reference per face; one view is one face. */
  const views = [p.heroImage?.src, ...(p.gallery ?? []).map((g) => g.src)].filter(Boolean);

  brief.push({
    ...entry,
    model: p.model,
    name: p.name,
    family,
    material: p.material ?? "",
    finishes: p.finishes ?? [],
    geometry,
    missing,
    views: views.length,
    viewFiles: views,
  });
}

const outDir = flag("out", "tmp/claude-render");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "render-brief.json"), JSON.stringify(brief, null, 1));

console.log(`${brief.length} 个型号\n`);
let totalMissing = 0;
for (const b of brief) {
  if (b.error) {
    console.log(`  !! ${b.slug}: ${b.error}`);
    continue;
  }
  totalMissing += b.missing.length;
  console.log(
    `${String(b.model).padEnd(10)} ${b.family.padEnd(26)} 尺寸 ${String(b.geometry.length).padStart(2)} 条  视图 ${b.views}` +
      (b.missing.length ? `  缺: ${b.missing.join(", ")}` : "  齐"),
  );
}
console.log(`\n共缺 ${totalMissing} 条关键尺寸 —— 这些是问工厂的问题，不是给美术的空白。`);
console.log(`brief -> ${join(outDir, "render-brief.json")}`);
