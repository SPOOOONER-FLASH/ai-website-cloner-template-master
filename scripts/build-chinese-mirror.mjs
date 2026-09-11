/**
 * Build the Chinese product mirror for the RAYEN 雷茵 site.
 *
 * Reads content/products/*.json + content/categories.json + content/i18n/zh-terms.json,
 * writes src/data/generated/products-zh.json.
 *
 * WHY A GENERATOR AND NOT 435 HAND-WRITTEN JSON FILES
 * The Spanish locale put nameEs/specsEs on every product record, which works but means
 * the translation of "Material" lives in 390 places. Here the word lives once, in
 * zh-terms.json, and this script is the only thing that spreads it. When a term is wrong
 * it is fixed in one line and re-derived, and no product file carries a second brand's
 * content. See AGENTS.md: write the generator, then run it; do not write the output.
 *
 * WHAT IS TRANSLATED AND WHAT IS DELIBERATELY NOT
 * Spec LABELS must be 100% covered — a missing one fails --check, because a half-Chinese
 * spec table is the kind of sloppiness that makes a buyer doubt the dimensions too.
 * Spec VALUES are phrase-then-token translated; dimensions (300 × 75mm, Ø32mm, 1.5mm)
 * pass through untouched because they are already language-neutral and are the actual
 * thing a Chinese buyer came to read. A value with no dictionary hit stays English.
 * Mixed Chinese/English spec tables are normal in this trade; an invented Chinese
 * value would not be.
 *
 * SUMMARIES ARE GENERATED, NOT TRANSLATED
 * The English summaries are marketing prose. Machine-translating 435 of them produces
 * 435 sentences nobody has read. Instead each Chinese summary is assembled from the
 * product's OWN structured fields, so it cannot say anything the spec table does not.
 * Same principle as the FAQPage work in commit cf41054b1b.
 *
 * BRAND HYGIENE
 * Product images resolve to /images/products-rayen/, the set produced by
 * scripts/build-rayen-product-images.mjs with the Hyland oval painted off.
 *
 * This used to say "/images/products/ — the unbranded originals", and that was simply
 * wrong: 660 of those 1595 files have a Hyland mark burned in by whoever shot them, and
 * products-hyde/ is that set with a SECOND watermark on top. The error survived review
 * because the directory name says unbranded and because Hyland is this factory's own
 * export brand, so nothing about the pictures looked stolen. It was caught by opening the
 * rendered category grid and squinting at a 40px corner.
 *
 * Alt text and series names are likewise regenerated — "Hyland 300" becomes "300 系列".
 * A RAYEN page must not carry HYDE's or Stahlock's marks, in pixels or in words.
 *
 * Usage:
 *   node scripts/build-chinese-mirror.mjs            # write the mirror
 *   node scripts/build-chinese-mirror.mjs --check    # fail if a spec label is missing
 *   node scripts/build-chinese-mirror.mjs --report   # list values still in English
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS_DIR = join(root, "content", "products");
const OUT_FILE = join(root, "src", "data", "generated", "products-zh.json");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

const terms = readJson(join(root, "content", "i18n", "zh-terms.json"));
const categoriesFile = readJson(join(root, "content", "categories.json"));

/* ---------------------------------------------------------------------------
 * Category names. categories.json already carries nameZh on all 15 parents and
 * all 21 children — that tree is the taxonomy, so it stays the source of truth
 * rather than being duplicated into zh-terms.json.
 * ------------------------------------------------------------------------ */
const categoryZh = new Map();
const categoryEn = new Map();
const walkCategories = (nodes) => {
  for (const node of nodes ?? []) {
    if (node.nameZh) categoryZh.set(node.slug, node.nameZh);
    if (node.name) categoryEn.set(node.slug, node.name);
    walkCategories(node.children);
  }
};
walkCategories(categoriesFile.categories);

/* ---------------------------------------------------------------------------
 * Value translation: exact phrase first, then longest-first token replacement.
 *
 * Tokens are matched on word boundaries. Without that, "and" → "和" turns
 * "Standoff" into "St和off" and "No" → "否" turns "Nominal" into "否minal".
 * That bug ships silently because nobody reads all 435 spec tables.
 * ------------------------------------------------------------------------ */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const tokenRules = [...terms.tokens]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([from, to]) => {
    const lead = /^\w/.test(from) ? "\\b" : "";
    const tail = /\w$/.test(from) ? "\\b" : "";
    return { re: new RegExp(`${lead}${escapeRe(from)}${tail}`, "gi"), to };
  });

/** An unmatched English word, i.e. the value is not finished. Unit codes (SS, PB, mm) pass. */
const HAS_ENGLISH_WORD = /[A-Za-z]{3,}/;

/**
 * ALL CHINESE OR ALL ENGLISH — never half.
 *
 * The first version of this shipped token replacement straight to the page and produced
 * "Fully 左右通用, 左开 or 右开 hand" 131 times. That is worse than the untouched English
 * sentence: a buyer reading it concludes the supplier ran the catalogue through a machine
 * and did not look at it, which is precisely the doubt this site exists to remove.
 *
 * So a token-translated value is only accepted when nothing English is left standing.
 * Otherwise the original English is kept verbatim and logged by --report, where it can be
 * given a proper phrase entry. English spec values beside Chinese labels are ordinary in
 * this trade; mangled ones are not.
 */
function translateValue(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const phrase = terms.phrases[trimmed];
  if (phrase) return phrase;
  let out = trimmed;
  for (const { re, to } of tokenRules) out = out.replace(re, to);
  return HAS_ENGLISH_WORD.test(out) ? trimmed : out;
}

const missingLabels = new Set();
function translateLabel(label) {
  const zh = terms.specLabels[label];
  if (zh) return zh;
  missingLabels.add(label);
  return label;
}

/* ---------------------------------------------------------------------------
 * Product and series names.
 * ------------------------------------------------------------------------ */
const missingNames = new Set();
function translateName(name) {
  if (!name) return "";
  const zh = terms.productNames[name];
  if (zh) return zh;
  missingNames.add(name);
  return name;
}

function translateSeries(series, fallbackName) {
  if (!series) return "";
  if (terms.series[series]) return terms.series[series];
  if (terms.productNames[series]) return `${terms.productNames[series]}系列`;
  // An unmapped series that still names an export brand must never reach the page.
  if (/^(hyland|hyde|stahlock)\b/i.test(series)) return `${fallbackName}系列`;
  return series;
}

/**
 * The English series label.
 *
 * Same brand-hygiene rule as the Chinese side: a series that still names an export brand
 * must not reach a RAYEN page. "Hyland 300" becomes "300 Series", not "Hyland 300".
 */
function seriesEn(series, fallbackName) {
  if (!series) return "";
  if (/^(hyland|hyde|stahlock)s*/i.test(series)) {
    const rest = series.replace(/^(hyland|hyde|stahlock)s*/i, "").trim();
    return rest ? `${rest} Series` : `${fallbackName} Series`;
  }
  return series;
}

/* ---------------------------------------------------------------------------
 * The generated Chinese summary.
 *
 * Shape: 「{材质}{品名}，适用于{门型}。{规格1}，{规格2}。」 — every clause comes from a
 * field on this same record, so the sentence cannot outrun the spec table. Where a
 * field is absent the clause is dropped rather than filled.
 * ------------------------------------------------------------------------ */
const SUMMARY_SPEC_PRIORITY = [
  "Backset",
  "Centre distance",
  "Center Distance",
  "Plate size",
  "Size",
  "Length",
  "Diameter",
  "Door thickness",
  "Deadbolt throw",
  "Cycle life",
];

function buildSummary(product, nameZh) {
  const parts = [];
  const material = translateValue(product.material ?? "");
  const head = material ? `${material}${nameZh}` : nameZh;
  const door = (product.doorTypes ?? [])[0];
  parts.push(door ? `${head}，适用于${translateValue(door)}。` : `${head}。`);

  const specs = product.specs ?? [];
  const picked = [];
  for (const label of SUMMARY_SPEC_PRIORITY) {
    const hit = specs.find((s) => s.label === label && String(s.value ?? "").trim());
    if (hit) picked.push(`${translateLabel(hit.label)} ${translateValue(hit.value)}`);
    if (picked.length === 2) break;
  }
  if (picked.length) parts.push(`${picked.join("，")}。`);
  return parts.join("");
}

/**
 * The English summary, assembled from the same fields as the Chinese one.
 *
 * Deliberately NOT product.summary from the record: those are imported marketing prose of
 * uneven quality, and half the RAYEN range has none at all. Composing both languages from
 * the same structured fields means the two sites cannot disagree about a product.
 */
function buildSummaryEn(product) {
  const parts = [];
  const material = (product.material ?? "").trim();

  /*
    The material is only usable as an adjective when it IS one.

    Two ways this went wrong on live pages:

      "Stainless Steel stainless steel handle."  — the model is literally named after its
      material, so prefixing it says the same thing twice. 64 products read like this.

      "steel material with spray painting , different finishes are available . panic exit
      device trim for fire door."  — some `material` fields are a whole sentence copied
      from a supplier sheet (one is still in Spanish). Gluing a name onto the end of a
      paragraph does not make a summary, it makes the first thing a buyer reads look
      unedited.

    So: skip it if the name already carries it, and skip it if it is prose rather than a
    material — punctuation or length gives that away. A summary that just says
    "Glass door handle." is worse than nothing only if you believe more words are better.
  */
  const nameLower = product.name.toLowerCase();
  const isAdjective =
    material &&
    material.length <= 30 &&
    !/[.,;]/.test(material) &&
    !nameLower.startsWith(material.toLowerCase());
  const head = isAdjective ? `${material} ${nameLower}` : product.name;
  const door = (product.doorTypes ?? [])[0];
  parts.push(door ? `${head} for ${String(door).toLowerCase()}.` : `${head}.`);

  const specs = product.specs ?? [];
  const picked = [];
  for (const label of SUMMARY_SPEC_PRIORITY) {
    const hit = specs.find((row) => row.label === label && String(row.value ?? "").trim());
    if (hit) picked.push(`${hit.label.toLowerCase()} ${String(hit.value).trim()}`);
    if (picked.length === 2) break;
  }
  /*
    Capitalise it. The labels are lower-cased so they read as prose rather than as table
    headings ("centre distance P=640mm", not "Centre distance P=640mm"), but this clause is
    its own sentence following a full stop — and it shipped as
    「Stainless Steel glass door handle. centre distance P=640mm.」 on every English product
    page. On a site whose entire argument is that the numbers are looked after, a sentence
    that does not start with a capital is the cheapest possible way to suggest otherwise.
  */
  if (picked.length) {
    const clause = picked.join(", ");
    parts.push(`${clause.charAt(0).toUpperCase()}${clause.slice(1)}.`);
  }
  return parts.join(" ");
}

/* ---------------------------------------------------------------------------
 * Images. The unbranded originals, with alt text written fresh in Chinese —
 * the English labels say "Hyland 001 Panic Exit Device".
 * ------------------------------------------------------------------------ */
const PRODUCT_PREFIX = "/images/products/";
const BRANDED_PREFIX = "/images/products-hyde/";
const RAYEN_PREFIX = "/images/products-rayen/";
const RAYEN_IMAGE_DIR = join(root, "public", "images", "products-rayen");

/*
  Images resolve to the RAYEN set, produced by scripts/build-rayen-product-images.mjs.

  /images/products/ is NOT the clean original set it looks like: 660 of its 1595 files
  carry a burned-in Hyland oval, and /images/products-hyde/ is those with a second mark on
  top. The RAYEN set is the first of those with the oval painted out where that could be
  done without touching the photograph.

  Where it could not — 172 files, nearly all installed-scene shots with the logo over a
  corridor — there is no RAYEN file, and this returns undefined. The page then renders its
  empty state. That is the right trade: a model with no photograph is a gap, a model whose
  photograph carries another brand's name is a claim about who made it.
*/
const rayenImages = existsSync(RAYEN_IMAGE_DIR) ? new Set(readdirSync(RAYEN_IMAGE_DIR)) : new Set();

function toRayenSrc(src) {
  if (typeof src !== "string") return undefined;
  const base = src.startsWith(BRANDED_PREFIX)
    ? src.slice(BRANDED_PREFIX.length)
    : src.startsWith(PRODUCT_PREFIX)
      ? src.slice(PRODUCT_PREFIX.length)
      : null;
  /*
    Anything outside the two product-photo directories is dropped rather than passed
    through. In practice that is four /images/concepts/ application renders, which are
    exactly the imagined-scene material the client ruled out on 2026-09-04. They are
    harmless on the English site, where they are labelled as concepts; on a factory's own
    Chinese page they would sit in the gallery beside real photographs of real parts.
  */
  if (base === null) return undefined;
  return rayenImages.has(base) ? `${RAYEN_PREFIX}${base}` : undefined;
}

function zhImage(image, altZh) {
  if (!image) return undefined;
  const src = toRayenSrc(image.src);
  if (!src) return undefined;
  return { src, ratio: image.ratio ?? "1 / 1", label: altZh };
}

/* ------------------------------------------------------------------------ */

const files = readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".json")).sort();
const untranslated = new Map();
const products = [];

for (const file of files) {
  const product = readJson(join(PRODUCTS_DIR, file));
  /*
    A record's own nameZh wins over the dictionary.

    The dictionary is keyed on the ENGLISH name, so every model sharing a name gets the
    same Chinese one — right for the imported catalogue, wrong for the 2026-09-08 handle
    import, where 「不锈钢拉手」 and 「门拉手」 are both "Stainless Steel Handle" upstream
    but sit in different categories here. Per-record beats per-name whenever the record
    bothered to say.
  */
  const nameZh = product.nameZh || translateName(product.name);
  const modelLabel = `雷茵 ${product.model} ${nameZh}`.trim();

  const specs = (product.specs ?? [])
    .filter((s) => String(s.value ?? "").trim())
    .map((s) => ({ label: translateLabel(s.label), value: translateValue(s.value) }));

  for (const spec of specs) {
    if (/[A-Za-z]{3,}/.test(spec.value)) {
      untranslated.set(spec.value, (untranslated.get(spec.value) ?? 0) + 1);
    }
  }

  const summary = buildSummary(product, nameZh);
  const summaryEn = buildSummaryEn(product);

  /*
    Promote a gallery frame when the hero itself could not be cleaned. Twelve models had a
    usable second or third view sitting behind an unusable first one, and showing the empty
    state on those would have been a self-inflicted gap.
  */
  const hero = zhImage(product.heroImage, modelLabel);
  const gallery = (product.gallery ?? [])
    .map((image, index) => zhImage(image, `${modelLabel} 第 ${index + 2} 张`))
    .filter(Boolean);
  const heroImage = hero ?? gallery.shift();

  products.push({
    slug: product.slug,
    model: product.model,
    name: nameZh,
    nameEn: product.name,
    series: translateSeries(product.series, nameZh),
    categoryPath: product.categoryPath ?? [],
    categoryNames: (product.categoryPath ?? []).map((slug) => categoryZh.get(slug) ?? slug),
    summary,
    specs,
    material: translateValue(product.material ?? ""),
    finishes: (product.finishes ?? []).map(translateValue),
    doorTypes: (product.doorTypes ?? []).map(translateValue),
    heroImage,
    gallery,
    relatedModels: product.relatedModels ?? [],
    /*
      站点作用域要带进镜像，因为雷茵站从 2026-09-09 起只展示 sites 含 "rayen" 的记录。
      缺省（字段不存在）= 两站都上，所以这里补成空数组而不是 undefined，
      让消费端一个 includes 就能判断，不用先判空。
    */
    sites: product.sites ?? [],
    styleFamily: product.styleFamily ?? "",
    // No brand suffix here — the route's metadata template appends "| RAYEN 雷茵".
    // Baking a second, differently-worded suffix in produced titles that disagreed with
    // every other page on the site.
    seoTitle: `${product.model} ${nameZh}`.trim(),
    seoDescription: summary.slice(0, 150),

    /*
      == 英文侧 ==
      不是把中文翻回去 —— 那是把一次有损转换再做一次。content/products 里本来就是英文，
      中文才是从它生成的。所以英文站直接用原文：规格标签、材质、表面处理全部是供应商
      图纸和目录上的原词，比任何回译都准。

      英文摘要和中文摘要用同一套拼装逻辑（材质 + 品名 + 门型 + 两条关键尺寸），
      所以两个语种说的是同一件事，不会一边写了一边没写。
    */
    en: {
      name: product.name,
      series: seriesEn(product.series, product.name),
      categoryNames: (product.categoryPath ?? []).map((slug) => categoryEn.get(slug) ?? slug),
      summary: summaryEn,
      specs: (product.specs ?? [])
        .filter((row) => String(row.value ?? "").trim())
        .map((row) => ({ label: row.label, value: String(row.value).trim() })),
      material: product.material ?? "",
      finishes: product.finishes ?? [],
      doorTypes: product.doorTypes ?? [],
      seoTitle: `${product.model} ${product.name}`.trim(),
      seoDescription: summaryEn.slice(0, 150),
    },
  });
}

const args = new Set(process.argv.slice(2));

if (args.has("--report")) {
  const sorted = [...untranslated].sort((a, b) => b[1] - a[1]);
  console.log(`仍含英文的规格值：${sorted.length} 条（按出现次数排序，前 40）`);
  for (const [value, count] of sorted.slice(0, 40)) console.log(`${count}\t${value}`);
  console.log(`\n未映射的品名：${[...missingNames].join(", ") || "无"}`);
}

if (missingLabels.size) {
  console.error(
    `zh-terms.json 缺少 ${missingLabels.size} 个规格标签的中文：\n  ${[...missingLabels].join("\n  ")}`,
  );
  if (args.has("--check")) process.exit(1);
}

if (missingNames.size && args.has("--check")) {
  console.error(`zh-terms.json 缺少品名：${[...missingNames].join(", ")}`);
  process.exit(1);
}

if (!args.has("--check")) {
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify({ products }, null, 2)}\n`, "utf8");
  console.log(
    `products-zh.json：${products.length} 个型号，${products.reduce((n, p) => n + p.specs.length, 0)} 条规格行，` +
      `${untranslated.size} 条值仍含英文（node scripts/build-chinese-mirror.mjs --report 看清单）`,
  );
}
