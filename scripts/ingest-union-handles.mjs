/**
 * Ingest the supplier handle packs into the catalogue as RAYEN 雷茵 products.
 *
 * Reads content/rayen/union-handles.json — the curated classification, the dimensions
 * read off each model's own drawing, and the image plan. Writes:
 *   - public/images/products/<slug>[-n].webp
 *   - content/products/<slug>.json
 *
 * WHY A MANIFEST PLUS A GENERATOR
 * The judgement calls in this import are the whole job: which category a model belongs
 * to, which number on the drawing is the centre distance, and which three models do not
 * have enough evidence to publish at all. Those live in the manifest where a person can
 * check them against the drawings. This file only spreads them. Re-run after editing the
 * manifest; never hand-edit the generated product JSON.
 *
 * IMAGE ORDER IS A DECISION, NOT AN ACCIDENT
 * Plate first (that is what the listing thumbnail shows), then the DIMENSION DRAWING, then
 * detail shots, then installed scenes. The drawing sits second because for a pull handle
 * the buyer's first question is "will it fit my door" — the centre distance decides the
 * order, and burying it under five lifestyle photographs is how a catalogue loses an
 * enquiry it had already won.
 *
 * WHAT IS DELIBERATELY NOT WRITTEN
 * Four models have no drawing in the pack (G1216, G2110, T2973, MUL1022). They ship with
 * an empty spec table rather than dimensions borrowed from a sibling model: G* and T* of
 * the same family are different lengths and different fixings, so "close enough" here is
 * a wrong hole position. See AGENTS.md.
 *
 * Usage: node scripts/ingest-union-handles.mjs [--check]
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { doorTypesFor } from "./rayen-door-types.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
/*
  Which manifest to ingest. Defaults to the first batch so the existing npm script and
  every earlier invocation keep working; the second batch passes its own file.

  Two manifests rather than one merged file because they are different consignments with
  different evidence: batch 1 is the Japanese UNION door hardware, batch 2 is grab bars and
  bathroom fittings from OAS / PRE / HG. Merging them would bury which decision belonged to
  which delivery, and the `heldBack` reasons only make sense next to their own batch.
*/
const manifestArg = process.argv.slice(2).find((a) => !a.startsWith("--"));
const manifestPath = manifestArg
  ? (manifestArg.includes("/") || manifestArg.includes("\\")
      ? manifestArg
      : join(root, "content", "rayen", manifestArg))
  : join(root, "content", "rayen", "union-handles.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const IMAGE_DIR = join(root, "public", "images", "products");
const PRODUCT_DIR = join(root, "content", "products");

const checkOnly = process.argv.includes("--check");
const excluded = new Set(manifest.excludeImages);

/**
 * Sort key for one supplier file.
 *
 * The supplier encodes the shot type in the filename: D000/L000 plate, D400 detail,
 * D900/D921 drawing, D500+ installed scene. Parsing it beats sorting alphabetically,
 * which would put the drawing between two plates.
 */
function shotRank(file) {
  if (/D9\d\dSZ/i.test(file)) return 1; // drawing
  if (/(D|L)0\d\d Z|(D|L)0\d\dZ/i.test(file)) return 0; // product plate
  if (/(D|L)1\d\dZ/i.test(file)) return 2; // component detail
  if (/(D|L)4\d\dZ/i.test(file)) return 3; // arrangement / range shot
  return 4; // installed scene
}

/**
 * The client's own running order, given 2026-09-11 as a screenshot of their listing sheet:
 *
 *   窗口图片 → 参数图 → 其他表面处理颜色展示图 → 安装实景效果图
 *
 * Two things change against shotRank above, and the client stated both outright
 * (「参数图放第一张」, 「确保参数尺寸是第一张图」):
 *
 *   · the DIMENSION DRAWING leads the gallery. Earlier batches led with a product plate on
 *     the argument that the thumbnail is what a buyer sees first. That argument still holds,
 *     which is why the thumbnail is now picked separately below — but INSIDE the gallery the
 *     fitting dimensions come before the photography.
 *   · the supplier marks the intended thumbnail in the filename with 窗图 (window image).
 *     Where one exists it becomes heroImage whatever its shot type; 18 of this batch's 33
 *     models carry one. Where none exists the first product plate keeps the job.
 *
 * Opt-in per manifest (`"imageOrder": "drawing-first"`) rather than flipped globally:
 * batches 1–4 shipped in the old order and their source packs are not on this machine, so
 * changing the default would reorder products this run can neither regenerate nor check.
 */
const DRAWING_FIRST = manifest.imageOrder === "drawing-first";
/* The supplier marks the intended thumbnail in the filename. Batches 1–7 wrote 「窗図/窗图」
   (window image); the G1255 pack that arrived 2026-09-17 writes 「主图」 instead. Same
   intent, different word — and without this the hero silently falls back to the first
   product plate, which is a quieter failure than it sounds: the card still looks fine. */
/* …and 「首图」 is the third word for it, on the 2026-09-21 batch: G1110, G1189, G1240,
   T1278 and T51 all mark their thumbnail that way. Keep adding spellings here rather than
   renaming the supplier's files — the files are the evidence and get re-delivered. */
const isWindowShot = (file) =>
  file.includes("窗图") || file.includes("窗図") || file.includes("主图") || file.includes("首图");
/*
  UNION encodes the shot type in the filename (D9xxSZ = drawing). The RAYEN catalogue
  batch has no such convention — its pictures are cut out of the printed book by
  scripts/../cut.mjs — so those are named for what they are instead.
*/
/* D900SZ, but also D901_A_SZoW and D922SZXW — the supplier interleaves a variant letter
   and suffixes after the number. T1138's long-length drawing is `D901_A_SZoW`, which the
   original contiguous pattern missed: it would have been filed as an ordinary photograph
   and lost both its 「dimension drawing」 label and its place at the head of the gallery. */
/* `-drawing-1` / `-drawing-2`: RY8005 and RY8006 are drawn twice, once per leaf width
   (34/36mm and 30mm). One number per picture, because the two are different parts to
   order — not the same drawing at two scales. */
const isDrawing = (file) =>
  /(D|L)9\d\d[_A-Za-z]*SZ/i.test(file) || /-drawing(-\d+)?\.[a-z]+$/i.test(file);

/*
  `imageDir` overrides the folder name when the model number is not unique.

  The hinge catalogue numbers by SIZE — `4x3x3.0-4BB` is a 101.6 × 76.2 × 3.0mm hinge with
  four ball bearings — so the same code names a stainless one and a copper one. Keyed on the
  model, both would have read the same folder and the copper hinge would have shipped with the
  stainless photograph. Everything before batch 8 has unique model numbers and is unaffected.
*/
function imagesFor(model) {
  const dir = join(manifest.sourceRoot, model);
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => /\.jpg$/i.test(f) && !excluded.has(f));

  if (!DRAWING_FIRST) {
    return files
      .sort((a, b) => shotRank(a) - shotRank(b) || a.localeCompare(b))
      .map((f) => join(dir, f));
  }

  /* Drawing first, then the same shot order as before. */
  const ordered = files
    .slice()
    .sort(
      (a, b) =>
        (isDrawing(a) ? 0 : 1 + shotRank(a)) - (isDrawing(b) ? 0 : 1 + shotRank(b)) ||
        a.localeCompare(b),
    );

  /* Lift the thumbnail out in front of it. */
  const heroAt = ordered.findIndex(isWindowShot);
  const fallbackAt = ordered.findIndex((f) => !isDrawing(f));
  const at = heroAt >= 0 ? heroAt : fallbackAt;
  if (at < 0) return ordered.map((f) => join(dir, f));
  const [hero] = ordered.splice(at, 1);
  return [hero, ...ordered].map((f) => join(dir, f));
}

/**
 * The English summary, composed from the record's own fields.
 *
 * Same rule as the Spanish and Chinese sides: assembled from structured data, so the
 * sentence cannot claim anything the spec table does not carry. Where there are no
 * dimensions it says what the product is and stops.
 */
function buildSummary(entry) {
  /*
    What the thing IS, taken off the record rather than guessed from its category.

    The guess used to be "lever handle in lever-handles, pull handle everywhere else",
    which was true while this ingest only ever carried handles. The hinge and door-stop
    catalogues broke it quietly: every one of the 55 ball-bearing hinges, all 21 concealed
    hinges and the four JL hydraulic hinges shipped with a summary — and therefore an SEO
    description — reading "Stainless Steel 304/316L pull handle."

    The handle categories keep their wording so the 200-odd records already published do
    not churn; anything else is described by its own name.
  */
  const HANDLE = new Set([
    "stainless-steel-handles",
    "glass-door-accessories",
    "grip-handle-sets",
    "night-latches-rim-locks",
  ]);
  /*
    lever-handles also holds things that are not levers: p77's concealed door locks and its
    sixteen knobs. Calling a knob a "lever handle" in its SEO description is the same defect
    as the hinges above, so "lever handle" is kept only for records whose own name says
    lever — which is every one published before 2026-09-24, so none of them churn.
  */
  const kind =
    entry.categoryPath[0] === "lever-handles" && /lever/i.test(entry.name)
      ? "lever handle"
      : HANDLE.has(entry.categoryPath[0])
        ? "pull handle"
        : entry.name.toLowerCase();
  const centre = entry.specs.find((s) => s.label === "Center distance")?.value;
  const length = entry.specs.find((s) => s.label === "Overall length")?.value;
  const lever = entry.specs.find((s) => s.label === "Lever length")?.value;

  /*
    No material printed means none written. p77's knobs have only a code and a photograph,
    and the first ingest of them produced "undefined lever handle." as both summary and SEO
    description. A sentence that starts with the noun is less informative, not wrong.
  */
  const head = entry.material
    ? `${entry.material} ${kind}`
    : kind.charAt(0).toUpperCase() + kind.slice(1);
  if (centre && length) return `${head}, ${length} overall on ${centre} fixing centers.`;
  if (centre) return `${head} on ${centre} fixing centers.`;
  if (lever) return `${head}, ${lever} lever.`;
  return `${head}.`;
}

/* ------------------------------------------------------------------------ */

/*
  A style family needs at least two PUBLISHED members to mean anything.

  Three models (G1289, G1293, G2750) were written with a family in the manifest and
  turned out to be alone in it: the first two shipped in single-model packs, and
  G2750's two packmates were held back for lack of a product photograph. A family of
  one is a field that claims a pairing the site cannot show — so it is computed here
  rather than trusted from the manifest, and it corrects itself the day the missing
  models arrive. src/data/product-sites.test.ts is what caught this.

  COUNTED ACROSS EVERY MANIFEST, NOT JUST THIS ONE.

  A pairing is a fact about the catalogue — T2110 the solid-door handle and G2110 the glass
  one are the same design — and has nothing to do with which consignment each arrived in.
  Counting within one manifest only happened to work while both halves of every family sat
  in the same file. On 2026-09-14 G2110 moved to union-handles-rebuilt.json to pick up the
  dimension drawing UNION publishes for it, its partner stayed in union-handles.json, and
  the family silently collapsed to one member: the field was dropped from G2110 and
  src/data/product-sites.test.ts reported 「2110 只有 T2110」.
*/
const familyCount = new Map();
for (const file of readdirSync(join(root, "content", "rayen"))) {
  if (!file.endsWith(".json")) continue;
  let other;
  try {
    other = JSON.parse(readFileSync(join(root, "content", "rayen", file), "utf8"));
  } catch {
    continue;
  }
  /* Array.isArray, not `?? []`: artunion-specs.json also has a `models` key, but its is an
     object keyed by model number — the spec cache, not a manifest. */
  if (!Array.isArray(other.models)) continue;
  for (const entry of other.models) {
    if (!entry.styleFamily) continue;
    familyCount.set(entry.styleFamily, (familyCount.get(entry.styleFamily) ?? 0) + 1);
  }
}

mkdirSync(IMAGE_DIR, { recursive: true });
const written = [];
const missing = [];

for (const entry of manifest.models) {
  const sources = imagesFor(entry.imageDir ?? entry.model);
  if (!sources.length) {
    missing.push(entry.model);
    continue;
  }

  const refs = [];
  for (const [index, source] of sources.entries()) {
    const name = index === 0 ? `${entry.slug}.webp` : `${entry.slug}-${index + 1}.webp`;
    const target = join(IMAGE_DIR, name);
    if (!checkOnly) {
      await sharp(source).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
    }
    const drawing = isDrawing(source);
    /*
      A finish shot says which finish. The catalogue batch names these `-finish-a`, `-finish-b`
      … in the order the book prints them, which is the order `finishes` lists them, so the
      letter indexes straight into it. Five tiles of the same lever reading "view 3" … "view 7"
      is alt text that describes the file rather than the picture: a screen reader gets nothing,
      and neither does image search, when the only thing that differs between them is colour.
    */
    const finishAt = /-finish-([a-i])\.[a-z]+$/i.exec(source);
    /* a–i, not a–f: door stop 275 prints nine finishes. A six-letter alphabet silently
       labelled the last three "view 8".."view 10" instead of naming their colour. */
    const finish = finishAt ? (entry.finishes ?? [])["abcdefghi".indexOf(finishAt[1].toLowerCase())] : undefined;
    /* The installed photograph off the facing page. "view 11" describes the file, not the
       picture — a reader skimming alt text learns nothing from a number. */
    const scene = /-scene\.[a-z]+$/i.test(source);
    /* Which of the two leaf widths this drawing is. */
    const viewAt = /-drawing-(\d+)\.[a-z]+$/i.exec(source);
    const view = viewAt ? (entry.drawingNotes ?? [])[Number(viewAt[1]) - 1] : undefined;
    refs.push({
      src: `/images/products/${name}`,
      ratio: "1 / 1",
      label: drawing
        ? `${entry.model} ${entry.name}, dimension drawing${view ? ` — ${view}` : ""}`
        : finish
          ? `${entry.model} ${entry.name}, ${finish}`
          : scene
            ? `${entry.model} ${entry.name}, installed`
            : index === 0
            ? `${entry.model} ${entry.name}`
            : `${entry.model} ${entry.name}, view ${index + 1}`,
    });
  }

  const summary = buildSummary(entry);
  const record = {
    model: entry.model,
    slug: entry.slug,
    name: entry.name,
    nameZh: entry.nameZh,
    series: entry.name,
    categoryPath: entry.categoryPath,
    /*
      The style family. The supplier shipped these in seven packs, one per design, and the
      client's own note explains what that means: "有门把手的表示此款式搭配有同风格的门把手".
      Storing the family rather than a list of partner models means the pairing is written
      once and both directions are derived — a hand-maintained pair of lists is how a
      catalogue ends up telling a buyer that a lever matches a handle the lever's own page
      does not mention.
    */
    styleFamily: (familyCount.get(entry.styleFamily) ?? 0) >= 2 ? entry.styleFamily : undefined,
    /*
      RAYEN only. The client said on 2026-09-08 that this batch is for the Chinese site.
      These images came from a Japanese supplier's packs; HYDE and Stahlock sell the same
      factory's output to overseas buyers, where the provenance question is a different
      one. Not widening the scope without being asked.
    */
    sites: manifest.sites,
    summary,
    specs: entry.specs,
    material: entry.material,
    finishes: entry.finishes,
    doorTypes: doorTypesFor(entry),
    certifications: [],
    heroImage: refs[0],
    gallery: refs.slice(1),
    attachmentIds: [],
    relatedModels: [],
    seoTitle: `${entry.model} ${entry.name} | RAYEN`,
    seoDescription: summary,
  };

  /*
    A manifest that rebuilds an EXISTING record must not quietly drop spec rows.

    2026-09-17: the batch-8 manifest treated G1255 as a new model and wrote it from its two
    drawings. G1255 was already in the catalogue with ten spec rows — weight, available
    lengths, the M6 fixing screw and the phi12 / phi8 hole diameters — and the rebuild replaced
    them with five. Nothing failed. The page rendered, the card looked right, and the numbers
    a fitter drills to were gone. It was caught only because an orphaned door-prep SVG made a
    different test fail.

    Same shape as the two earlier losses this repo has already paid for, so this is a refusal
    rather than a warning: a warning in a two-hundred-line ingest log is a warning nobody
    reads. To overwrite deliberately — a genuine correction — name the model in the manifest's
    `overwrites` array, which puts the decision next to the data where it gets reviewed.
  */
  const target = join(PRODUCT_DIR, `${entry.slug}.json`);
  if (existsSync(target)) {
    const before = JSON.parse(readFileSync(target, "utf8"));
    const had = new Set((before.specs ?? []).map((row) => row.label));
    const has = new Set((entry.specs ?? []).map((row) => row.label));
    const lost = [...had].filter((label) => !has.has(label));
    if (lost.length && !(manifest.overwrites ?? []).includes(entry.model)) {
      console.error(
        `
⚠ ${entry.model} 目录里已经有了，这份清单会删掉它的 ${lost.length} 条规格：` +
          `
   ${lost.join("、")}` +
          `
   要么把这些行写进清单，要么把型号加进 "overwrites" 明示是有意覆盖。`,
      );
      process.exitCode = 1;
      continue;
    }
  }

  /*
    Fields this ingest does not own are carried over, not overwritten.

    2026-09-17: the Portuguese pass added `namePt`, `summaryPt`, `specsPt`, `seoTitlePt` and
    `seoDescriptionPt` to all 76 hinge records the same afternoon this manifest rewrote their
    summaries. The record is rebuilt from scratch here, so re-running the ingest would have
    deleted every one of them — a whole locale's translation, silently, with a green test run,
    because nothing in this file knows those keys exist.

    Same shape as the spec-loss guard above, and the answer is the same in spirit: this
    generator owns the keys it writes and nothing else. Whatever else the record carries stays.
  */
  let merged = record;
  if (existsSync(target)) {
    const before = JSON.parse(readFileSync(target, "utf8"));
    const kept = Object.fromEntries(
      Object.entries(before).filter(([key]) => !(key in record)),
    );
    if (Object.keys(kept).length) merged = { ...record, ...kept };
  }

  if (!checkOnly) {
    writeFileSync(target, `${JSON.stringify(merged, null, 2)}
`, "utf8");
  }
  written.push(`${entry.model} → ${entry.categoryPath.join("/")} (${refs.length} 图, ${entry.specs.length} 规格行)`);
}

if (missing.length) {
  console.error(`找不到素材目录：${missing.join(", ")}（源盘没挂上就会这样）`);
  process.exit(1);
}

console.log(written.join("\n"));
console.log(
  `\n${written.length} 个型号；${manifest.heldBack.length} 个证据不足未收：` +
    manifest.heldBack.map((h) => h.model).join("、"),
);
