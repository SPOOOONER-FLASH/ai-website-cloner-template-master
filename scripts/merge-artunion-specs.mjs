/**
 * Merge the verified artunion facts into content/products/*.json.
 *
 * Reads the cache written by scripts/scrape-artunion-specs.mjs and adds at most three rows
 * to a product's spec table:
 *
 *   Weight        ← 重量
 *   Fixing screw  ← the 取付ビス line of 施工
 *   Fixing hole   ← the 取付穴 line of 施工 (including the glass/flush-door alternative)
 *
 * WHAT MAKES A MERGE ALLOWED
 * One of two things, never a guess:
 *
 *   1. CONFIRMED — the scraped ピッチ equals the centre distance we read off our own
 *      drawing. Two independent sources agreeing on a dimension is the strongest evidence
 *      available here, and it pins down WHICH length variant the product is.
 *   2. SOLE — UNION publishes exactly one length for that model, so there is no variant to
 *      pick wrongly.
 *
 * Anything else is skipped and listed. A model where the drawing has no centre distance and
 * UNION publishes four lengths cannot be resolved from a spreadsheet, and putting the wrong
 * length's weight on a product is exactly the invented-number failure AGENTS.md exists to
 * prevent.
 *
 * WHAT IS NEVER MERGED, whatever the evidence
 *   価格     — client instruction: do not copy prices.
 *   施工実績 — UNION's built references. They are not our projects.
 *   機能     — UNION's branded programme names.
 *   カタログ — page numbers in UNION's catalogue.
 *
 * Existing rows are never overwritten. If a product already states a weight, ours stands;
 * a silent overwrite would make our own drawing-derived numbers unreviewable.
 *
 * Usage:
 *   node scripts/merge-artunion-specs.mjs --dry    # show what would change
 *   node scripts/merge-artunion-specs.mjs          # write
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const CACHE = join(root, "content", "rayen", "artunion-specs.json");
const DRY = process.argv.includes("--dry");

const cache = JSON.parse(readFileSync(CACHE, "utf8"));

/*
  NO DRAWING, NO SPEC ROWS — even when artunion publishes them.

  src/data/product-sites.test.ts holds the rule that a model without a drawing ships an
  empty spec table. Its stated reason is "dimensions copied from a sibling", and what we
  have here is better than that: UNION's own published record, keyed on the same model
  number. It was still tempting to call the rule inapplicable and merge anyway.

  It is not inapplicable, because the safety argument for every other row in this merge is
  that TWO independent sources agree on the centre distance. For a model we hold no drawing
  for there is no second source, nothing to check against, and no way to notice if the
  record belongs to a different length or a superseded revision. G1216 and T2973 are the
  only two affected, and two weight rows are not worth the one invariant that keeps every
  other number on this site checkable.

  If the client later supplies drawings for them, they leave this list on their own.
*/
const drawings = JSON.parse(readFileSync(join(root, "content", "rayen", "union-handles.json"), "utf8"));
const UNDRAWN = new Set(
  (drawings.models ?? []).filter((entry) => !entry.drawing).map((entry) => entry.slug),
);

const digits = (value) => (String(value).match(/\d+(?:\.\d+)?/g) ?? []).map(Number);

function pitchAgrees(scraped, drawn) {
  if (!scraped || !drawn) return null;
  const a = digits(scraped);
  const b = digits(drawn);
  if (!a.length || !b.length) return null;
  return a.some((x) => b.some((y) => Math.abs(x - y) < 0.51));
}

function pickSpec(product, labels) {
  for (const label of labels) {
    const hit = (product.specs ?? []).find((s) => s.label === label);
    if (hit) return String(hit.value ?? "").trim();
  }
  return "";
}

/**
 * 施工 arrives as one run-on string: "取付ビス　M6 / 取付穴　φ12mm / フラッシュドア取付時 φ8mm".
 *
 * Split it into the screw and the hole, and keep the conditional hole size attached to the
 * hole rather than dropped — "φ12mm, φ8mm on a flush door" is the whole point of the row.
 * A fitter who gets only the first number drills the wrong hole in somebody's door.
 */
/*
  ONE ROW PER DOOR TYPE. NO PROSE INSIDE A VALUE.

  The first version of this emitted "φ12mm, on flush doors: φ8mm" as a single value, and the
  Chinese mirror turned it into 「φ10mm, on 玻璃门: φ12mm」 — half-translated, which is the
  one output the mirror is explicitly built to never produce. The problem is not the
  translation table; it is that a sentence was put where a dimension belongs.

  Every other row in this table is <label, dimension>. The door type is a label, so it goes
  in the label, and the value stays a number the mirror never has to touch.
*/
const DOOR_TYPE_LABEL = {
  "ガラスドア取付時": "Fixing hole (glass door)",
  "フラッシュドア取付時": "Fixing hole (flush door)",
  "木製ドア取付時": "Fixing hole (timber door)",
};

function parseInstallation(raw) {
  const parts = String(raw ?? "")
    .split("/")
    .map((s) => s.replace(/　/g, " ").trim())
    .filter(Boolean);

  const rows = [];
  for (const part of parts) {
    if (part.startsWith("取付ビス")) {
      rows.push({ label: "Fixing screw", value: part.replace(/^取付ビス\s*/, "").trim() });
      continue;
    }
    if (part.startsWith("取付穴")) {
      rows.push({ label: "Fixing hole", value: part.replace(/^取付穴\s*/, "").trim() });
      continue;
    }
    const doorType = Object.keys(DOOR_TYPE_LABEL).find((jp) => part.startsWith(jp));
    if (doorType) {
      rows.push({ label: DOOR_TYPE_LABEL[doorType], value: part.slice(doorType.length).trim() });
    }
  }
  return rows.filter((row) => row.value);
}

/** Every label this script owns — so a re-run can replace its own rows instead of duplicating. */
const MANAGED_LABELS = new Set([
  "Weight",
  "Fixing screw",
  "Fixing hole",
  ...Object.values(DOOR_TYPE_LABEL),
]);

/* ------------------------------------------------------------------- merge */

const decisions = [];
let written = 0;

for (const file of readdirSync(PRODUCTS)) {
  if (!file.endsWith(".json")) continue;
  const path = join(PRODUCTS, file);
  let product;
  try {
    product = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    continue;
  }
  if (!(product.sites ?? []).includes("rayen")) continue;
  const model = String(product.model ?? "").trim();
  const record = cache.models?.[model];
  if (!record?.variants?.length) continue;

  if (UNDRAWN.has(product.slug)) {
    /* Undo an earlier run that did not yet know this rule, then leave the table empty. */
    const stripped = (product.specs ?? []).filter((s) => !MANAGED_LABELS.has(s.label));
    const removed = (product.specs ?? []).length - stripped.length;
    if (removed && !DRY) {
      product.specs = stripped;
      delete product.specSources?.artunion;
      if (product.specSources && !Object.keys(product.specSources).length) delete product.specSources;
      writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`, "utf8");
      written += 1;
    }
    decisions.push({
      model,
      basis: "undrawn",
      note: removed ? `没有图纸，撤回 ${removed} 行（见脚本顶部）` : "没有图纸，规格表保持为空",
    });
    continue;
  }

  const drawnPitch = pickSpec(product, ["Centre distance", "Fixing centre", "Fixing pitch"]);
  const confirmed = record.variants.find((v) => pitchAgrees(v.spec.pitch, drawnPitch) === true);
  const sole = record.variants.length === 1 ? record.variants[0] : null;
  const chosen = confirmed ?? sole;
  const basis = confirmed ? "confirmed" : sole ? "sole" : "ambiguous";

  if (!chosen) {
    decisions.push({ model, basis, note: `${record.variants.length} 个长度，图纸无中心距，无法定位` });
    continue;
  }

  const candidates = [
    { label: "Weight", value: chosen.spec.weight },
    ...parseInstallation(chosen.spec.installation),
  ].filter((row) => row.value);

  /*
    Drop the rows a previous run of THIS script added before re-adding them. Without it a
    format change like the one above leaves the old half-translated rows sitting next to the
    new ones forever, and a script you cannot re-run is a script that will be run once,
    wrongly, and then worked around by hand.

    Only rows we own, and only on products that carry our provenance stamp — a Weight the
    client supplied is not ours to delete.
  */
  const ours = Boolean(product.specSources?.artunion);
  const specs = (product.specs ?? []).filter((s) => !(ours && MANAGED_LABELS.has(s.label)));
  const have = new Set(specs.map((s) => s.label));
  const added = candidates.filter((row) => !have.has(row.label));

  if (!added.length) {
    decisions.push({ model, basis, note: "无可补充的行" });
    continue;
  }

  decisions.push({
    model,
    basis,
    note: `+${added.map((a) => `${a.label}=${a.value}`).join("  +")}  [${chosen.id}]`,
  });

  if (!DRY) {
    product.specs = [...specs, ...added];
    /*
      Say where it came from, on the record itself. A number whose provenance lives only in
      a commit message is a number the next person has to either re-derive or trust blindly.
    */
    product.specSources = {
      ...(product.specSources ?? {}),
      artunion: { id: chosen.id, basis, fetchedAt: cache.fetchedAt },
    };
    writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`, "utf8");
    written += 1;
  }
}

/* ------------------------------------------------------------------ report */

decisions.sort((a, b) => a.model.localeCompare(b.model));
for (const d of decisions) {
  const mark = d.basis === "confirmed" ? "✓" : d.basis === "sole" ? "·" : "⚠";
  console.log(`  ${mark} ${d.model.padEnd(9)} ${d.note}`);
}
const count = (basis) => decisions.filter((d) => d.basis === basis).length;
console.log(
  `\n${DRY ? "（试运行，未写入）" : `已写入 ${written} 个产品`}　` +
    `中心距双向印证 ${count("confirmed")}，唯一长度 ${count("sole")}，无法定位 ${count("ambiguous")}`,
);
