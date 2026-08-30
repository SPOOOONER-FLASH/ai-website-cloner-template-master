/**
 * Rebuilds `seoTitle` and `seoDescription` for every product, to the lengths Google and
 * Bing actually render.
 *
 * The catalogue shipped with descriptions averaging 39 characters — "ABS panic exit
 * device." is the whole meta description on some pages. Google renders around 155 and
 * Bing a little more, so nine tenths of the snippet was going unused on 397 of 471
 * pages. Titles were similarly short at a median of 40 against a ~60 budget.
 *
 * ---------------------------------------------------------------------------
 * The rule this obeys
 *
 * Every clause is assembled from fields that already exist on the product. Nothing is
 * inferred, and no claim is manufactured to reach a character count — that is the
 * project's standing content rule, and it matters most exactly here, where the output
 * is what a buyer reads before clicking. A product with thin data gets a shorter
 * description, and the report says so rather than padding it.
 *
 * The one piece of boilerplate is the closing sentence, and it repeats copy already
 * published on this site rather than being written fresh: Guangdong manufacture and
 * export reach, both from src/data/site.ts and the company page.
 *
 * Certifications are deliberately NOT used. Only four test reports exist and they name
 * specific models; putting a certification claim on a sibling model's meta description
 * would be the exact failure the content rules warn about.
 *
 *   node scripts/generate-product-seo.mjs           # report, with before/after
 *   node scripts/generate-product-seo.mjs --write   # apply
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const write = process.argv.includes("--write");
const showAll = process.argv.includes("--all");
const DIR = "content/products";

const BRAND = "Canton Hyland";
const TITLE_MAX = 62;      // ~600px at typical desktop rendering
const DESC_MAX = 165;

/** Free text got typed into some attribute fields; it does not belong in a snippet. */
const isValueLike = (v) => {
  const s = String(v ?? "").trim();
  return s.length > 0 && s.length <= 30 && !/[.,;:]/.test(s) && s.split(/\s+/).length <= 4;
};

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

/** slug -> display name, read from the same file the site renders from. */
const CATEGORY_NAMES = (() => {
  const raw = JSON.parse(readFileSync("content/categories.json", "utf8"));
  const list = Array.isArray(raw) ? raw : (raw.categories ?? raw.items ?? []);
  const map = new Map();
  for (const c of list) map.set(c.slug, c.name);
  return map;
})();
const categoryName = (slug) => (slug ? (CATEGORY_NAMES.get(slug) ?? "") : "");

/**
 * Title: model and name first, because that is what a buyer with a schedule searches.
 * Material is added only when it fits and is not already implied by the name.
 */
function buildTitle(p) {
  const core = clean(`${p.model} ${p.name}`);
  const suffix = ` | ${BRAND}`;
  const material = isValueLike(p.material) ? clean(p.material) : "";
  const category = categoryName(p.categoryPath?.[0]);

  const candidates = [];
  if (material && !core.toLowerCase().includes(material.toLowerCase())) {
    candidates.push(`${core} — ${material}`);
  }
  // Where the material is blank — several accessories have none recorded — the category
  // is the next most useful qualifier, and it is a fact already on the record. Without
  // it these come out as "L001 Latch | Canton Hyland", using a third of the budget.
  if (category && !core.toLowerCase().includes(category.toLowerCase())) {
    candidates.push(`${core} — ${category}`);
  }
  candidates.push(core);

  for (const c of candidates) {
    if ((c + suffix).length <= TITLE_MAX) return c + suffix;
  }
  // Nothing fits: keep the identifier and drop the brand rather than truncate mid-model.
  return core.length <= TITLE_MAX ? core : core.slice(0, TITLE_MAX - 1).trimEnd() + "…";
}

/**
 * Description: a factual opening built from the product's own attributes, then as much
 * of the published company boilerplate as still fits under the budget.
 */
function buildDescription(p) {
  const name = clean(p.name).toLowerCase();
  const material = isValueLike(p.material) ? clean(p.material) : "";
  const finishes = (p.finishes ?? []).filter(isValueLike).map(clean);
  const doorTypes = (p.doorTypes ?? []).filter(isValueLike).map(clean);

  // Opening clause: brand, model, what it is, what it is made of.
  let lead = `${BRAND} ${clean(p.model)} ${name}`;
  // Material keeps its own casing: "304SS" and "ABS" are codes, not words.
  if (material) lead += ` in ${material}`;
  lead += ".";

  const parts = [lead];

  if (finishes.length) {
    const list = finishes.slice(0, 4);
    parts.push(
      list.length === 1
        ? `Available in ${list[0]} finish.`
        : `Finishes: ${list.join(", ")}.`,
    );
  }

  if (doorTypes.length) {
    const list = doorTypes.slice(0, 3).map((d) => d.toLowerCase());
    parts.push(`For ${list.join(", ")} applications.`);
  }

  // Published boilerplate, longest that still fits, then progressively shorter.
  const tails = [
    "Manufactured in Guangdong, China and exported to over thirty markets — request a quotation.",
    "Manufactured in Guangdong, China and exported to over thirty markets.",
    "Manufactured in Guangdong, China. Request a quotation.",
    "Made in Guangdong, China.",
  ];

  const base = parts.join(" ");
  for (const tail of tails) {
    const full = `${base} ${tail}`;
    if (full.length <= DESC_MAX) return full;
  }
  return base.length <= DESC_MAX ? base : base.slice(0, DESC_MAX - 1).trimEnd() + "…";
}

/* ------------------------------------------------------------------------ *
 * Spanish mirrors.
 *
 * The es pages shipped with whatever `summaryEs` held — a median 59 characters against
 * the same ~165 budget, which is the bulk of Bing's "description too short" report, and
 * four modelTbc products shared two identical titles between them. Same rules as the
 * English build: every clause comes from fields already on the product, Spanish terms
 * come from src/data/es-glossary.ts (read as text, like scripts/translate-products-es.mjs),
 * and a term with no glossary entry SKIPS its clause — an invented Spanish term is an
 * invented fact.
 * ------------------------------------------------------------------------ */
const GLOSSARY = (() => {
  const source = readFileSync("src/data/es-glossary.ts", "utf8");
  const grab = (name) => {
    const start = source.indexOf(`export const ${name}`);
    if (start < 0) return "{}";
    const open = source.indexOf("{", start);
    let depth = 0;
    for (let i = open; i < source.length; i++) {
      if (source[i] === "{") depth += 1;
      else if (source[i] === "}") {
        depth -= 1;
        if (!depth) return source.slice(open, i + 1).replace(/\/\/.*$/gm, "");
      }
    }
    return "{}";
  };
  return {
    values: eval(`(${grab("SPEC_VALUES_ES")})`),
    categories: eval(`(${grab("CATEGORY_NAMES_ES")})`),
  };
})();

/** Glossary lookup; "" when the term has no entry, so the clause is skipped. */
const esTerm = (term) => GLOSSARY.values[clean(term)] ?? "";
const esCategory = (slug) => (slug ? (GLOSSARY.categories[slug] ?? "") : "");

/** Lower-case the leading letter for mid-sentence use; keep all-caps codes intact. */
const lowerLead = (s) => {
  const c = clean(s);
  if (c.length > 1 && c === c.toUpperCase()) return c;
  return c.charAt(0).toLowerCase() + c.slice(1);
};

function buildTitleEs(p) {
  const name = clean(p.nameEs ?? p.name);
  const model = clean(p.model);
  const suffix = ` | ${BRAND}`;

  const candidates = [];
  if (p.modelTbc) {
    // The model is an English descriptor, not a confirmed order code, but it is the only
    // thing that makes the title unique: two knob-locks and two lever sets otherwise
    // share one title each. It trails the Spanish name rather than leading it.
    candidates.push(`${name} — ${model}`, `${model} ${name}`, model);
  } else {
    const head = `${model} ${name}`;
    const material = isValueLike(p.material) ? esTerm(p.material) : "";
    const category = esCategory(p.categoryPath?.[0]);
    if (material && !head.toLowerCase().includes(material.toLowerCase())) {
      candidates.push(`${head} — ${material}`);
    }
    if (category && !head.toLowerCase().includes(category.toLowerCase())) {
      candidates.push(`${head} — ${category}`);
    }
    candidates.push(head);
  }

  for (const c of candidates) {
    if ((c + suffix).length <= TITLE_MAX) return c + suffix;
  }
  for (const c of candidates) {
    if (c.length <= TITLE_MAX) return c;
  }
  const fallback = candidates.at(-1);
  return fallback.slice(0, TITLE_MAX - 1).trimEnd() + "…";
}

function buildDescriptionEs(p) {
  const name = lowerLead(p.nameEs ?? p.name);
  const model = clean(p.model);
  const material = isValueLike(p.material) ? lowerLead(esTerm(p.material)) : "";
  const finishes = (p.finishes ?? []).filter(isValueLike).map(clean);
  const doorTypes = (p.doorTypes ?? [])
    .filter(isValueLike)
    .map((d) => lowerLead(esTerm(d)))
    .filter(Boolean);

  // modelTbc: the English descriptor stays out of the sentence; the title carries it.
  let lead = p.modelTbc ? `${BRAND} ${name}` : `${BRAND} ${model} ${name}`;
  if (material) lead += ` en ${material}`;
  lead += ".";

  const parts = [lead];
  if (finishes.length) {
    const list = finishes.slice(0, 4);
    parts.push(
      list.length === 1 ? `Acabado ${list[0]}.` : `Acabados: ${list.join(", ")}.`,
    );
  }
  if (doorTypes.length) {
    parts.push(`Para ${doorTypes.slice(0, 3).join(", ")}.`);
  }

  // The same published facts as the English boilerplate, in the site's Spanish register.
  const tails = [
    "Fabricado en Guangdong, China y exportado a más de treinta mercados — solicite presupuesto.",
    "Fabricado en Guangdong, China y exportado a más de treinta mercados.",
    "Fabricado en Guangdong, China. Solicite presupuesto.",
    "Fabricado en Guangdong, China.",
  ];

  const base = parts.join(" ");
  for (const tail of tails) {
    const full = `${base} ${tail}`;
    if (full.length <= DESC_MAX) return full;
  }
  return base.length <= DESC_MAX ? base : base.slice(0, DESC_MAX - 1).trimEnd() + "…";
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
let changed = 0;
const before = { t: [], d: [] };
const after = { t: [], d: [] };
const afterEs = { t: [], d: [] };
const short = [];
const shortEs = [];
const samples = [];

for (const f of files) {
  const path = `${DIR}/${f}`;
  const p = JSON.parse(readFileSync(path, "utf8"));

  before.t.push((p.seoTitle ?? "").length);
  before.d.push((p.seoDescription ?? "").length);

  const title = buildTitle(p);
  const description = buildDescription(p);
  const titleEs = buildTitleEs(p);
  const descriptionEs = buildDescriptionEs(p);

  after.t.push(title.length);
  after.d.push(description.length);
  afterEs.t.push(titleEs.length);
  afterEs.d.push(descriptionEs.length);

  if (description.length < 110) short.push({ f, len: description.length, description });
  if (descriptionEs.length < 110) shortEs.push({ f, len: descriptionEs.length, descriptionEs });
  if (samples.length < 8 && (p.seoDescription ?? "").length < 40) {
    samples.push({ f, oldT: p.seoTitle, newT: title, oldD: p.seoDescription, newD: description });
  }

  if (
    p.seoTitle !== title ||
    p.seoDescription !== description ||
    p.seoTitleEs !== titleEs ||
    p.seoDescriptionEs !== descriptionEs
  ) {
    p.seoTitle = title;
    p.seoDescription = description;
    p.seoTitleEs = titleEs;
    p.seoDescriptionEs = descriptionEs;
    changed++;
    if (write) writeFileSync(path, `${JSON.stringify(p, null, 2)}\n`);
  }
}

const stat = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return { min: s[0], p50: s[(s.length / 2) | 0], p90: s[(s.length * 0.9) | 0], max: s[s.length - 1] };
};

console.log(`products: ${files.length}   rewritten: ${changed}`);
console.log(`\ntitle       before ${JSON.stringify(stat(before.t))}`);
console.log(`            after  ${JSON.stringify(stat(after.t))}   budget ≤ ${TITLE_MAX}`);
console.log(`description before ${JSON.stringify(stat(before.d))}`);
console.log(`            after  ${JSON.stringify(stat(after.d))}   budget ≤ ${DESC_MAX}`);
console.log(`title ES    after  ${JSON.stringify(stat(afterEs.t))}`);
console.log(`descript ES after  ${JSON.stringify(stat(afterEs.d))}`);
console.log(`\nover title budget:       ${after.t.filter((n) => n > TITLE_MAX).length}`);
console.log(`over description budget: ${after.d.filter((n) => n > DESC_MAX).length}`);
console.log(`\nstill under 110 chars (thin source data, not padded): ${short.length}`);
short.slice(0, showAll ? short.length : 6).forEach((s) => console.log(`  ${s.len}  ${s.f}  ${s.description}`));
console.log(`es still under 110 chars: ${shortEs.length}`);
shortEs.slice(0, showAll ? shortEs.length : 6).forEach((s) => console.log(`  ${s.len}  ${s.f}  ${s.descriptionEs}`));

console.log("\nbefore / after:");
for (const s of samples) {
  console.log(`\n  ${s.f}`);
  console.log(`    title  ${(s.oldT ?? "").length} -> ${s.newT.length}`);
  console.log(`      old: ${s.oldT}`);
  console.log(`      new: ${s.newT}`);
  console.log(`    desc   ${(s.oldD ?? "").length} -> ${s.newD.length}`);
  console.log(`      old: ${s.oldD}`);
  console.log(`      new: ${s.newD}`);
}

if (!write) console.log("\nReport only. Re-run with --write to apply.");
