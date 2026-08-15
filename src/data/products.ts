import type { Product } from "./types";

/**
 * Sample product records — THREE only, to prove the shape.
 *
 * ⚠ EVERY CERTIFICATION CLAIM MUST BE CHECKED LINE BY LINE AGAINST A REAL TEST
 * REPORT BEFORE LAUNCH. This is a compliance risk, not a content bug.
 *
 * Certification status as confirmed by the client 2026-08-15:
 *   ISO 9001              — real, continuously certified since 2002. OK to use.
 *   ANSI/BHMA Grade 3     — real. OK to use.
 *   EN 12209, EN 1906,
 *   EN 1935, CE           — NOT YET VERIFIED. Removed from this file until the
 *                           client confirms. Do not re-add them speculatively.
 *
 * ⚠ Everything else here — dimensions, materials, finishes, cycle ratings — is
 * still invented placeholder data to exercise the content model. Replace with
 * real catalogue data in P11.
 *
 * The three samples deliberately sit in three different categories and have
 * different spec-row counts, so any listing or detail component built on top of
 * this has to handle the variation from day one.
 */
export const products: Product[] = [
  {
    model: "HY007-S",
    slug: "hy007-s",
    name: "Solid Lever Handle on Round Rose",
    nameZh: "实心圆座执手",
    series: "Hyland 007",
    categoryPath: ["levers", "lever-on-rose"],
    summary:
      "A solid brass lever on a concealed-fix round rose, weighted for commercial traffic and available across the full finish range.",
    summaryZh: "实心黄铜执手，圆形暗装底座，适用于商业高频使用场景。",
    specs: [
      { label: "Lever length", value: "132", unit: "mm" },
      { label: "Lever projection", value: "62", unit: "mm" },
      { label: "Rose diameter", value: "52", unit: "mm" },
      { label: "Rose thickness", value: "11", unit: "mm" },
      { label: "Spindle", value: "8 x 8", unit: "mm" },
      { label: "Door thickness range", value: "38–50", unit: "mm" },
      { label: "Return spring", value: "Cassette, 60 N" },
      { label: "Cycle rating", value: "200,000" },
    ],
    material: "Solid brass, investment cast",
    finishes: ["Satin stainless (SSS)", "Polished brass (PB)", "Matt black (PVD)", "Antique bronze"],
    doorTypes: ["Timber", "Steel", "Aluminium"],
    certifications: [
      { name: "ANSI/BHMA Grade 3", standard: "ANSI/BHMA A156.13" },
      { name: "ISO 9001", standard: "ISO 9001:2015" },
    ],
    heroImage: { ratio: "1 / 1", label: "产品主图 HY007-S 1:1", labelZh: "HY007-S 主图" },
    gallery: [
      { ratio: "1 / 1", label: "产品图 细节 1:1" },
      { ratio: "3 / 2", label: "产品图 安装示意 3:2" },
      { ratio: "3 / 2", label: "工程实景 3:2" },
    ],
    attachmentIds: ["dl-hy007s-datasheet", "dl-hy007s-cad", "dl-hy007s-install"],
    relatedModels: ["LC04-8570", "BL031"],
    seoTitle: "HY007-S Solid Lever Handle on Rose | Canton Hyland",
    seoDescription:
      "Solid brass lever handle on a concealed round rose. ANSI/BHMA Grade 3, 200,000-cycle rated, four finishes. Datasheet and CAD available.",
  },
  {
    model: "BL031",
    slug: "bl031",
    name: "Top Patch Fitting for Frameless Glass",
    nameZh: "玻璃门上夹",
    series: "Bladeline 03",
    categoryPath: ["glass-fittings", "patch-fittings"],
    summary:
      "A machined top patch for frameless toughened glass, taking a standard floor-spring top pivot with a concealed adjustment screw.",
    summaryZh: "精加工玻璃门上夹，配合标准地弹簧顶轴，暗藏调节螺丝。",
    specs: [
      { label: "Glass thickness", value: "10–12", unit: "mm" },
      { label: "Body width", value: "148", unit: "mm" },
      { label: "Body height", value: "98", unit: "mm" },
      { label: "Max door weight", value: "120", unit: "kg" },
      { label: "Pivot spacing", value: "Standard DIN" },
    ],
    material: "Die-cast aluminium body, stainless steel cover",
    finishes: ["Satin stainless (SSS)", "Mirror polished", "Matt black (PVD)"],
    doorTypes: ["Frameless glass"],
    certifications: [
      { name: "ISO 9001", standard: "ISO 9001:2015" },
    ],
    heroImage: { ratio: "1 / 1", label: "产品主图 BL031 1:1", labelZh: "BL031 主图" },
    gallery: [
      { ratio: "1 / 1", label: "产品图 细节 1:1" },
      { ratio: "3 / 2", label: "产品图 剖面图 3:2" },
    ],
    attachmentIds: ["dl-bl031-datasheet", "dl-bl031-cad"],
    relatedModels: ["HY007-S"],
    seoTitle: "BL031 Top Patch Fitting for Frameless Glass | Canton Hyland",
    seoDescription:
      "Top patch fitting for 10–12 mm toughened glass, rated to 120 kg. Three finishes, DIN pivot spacing, CAD files available.",
  },
  {
    model: "LC04-8570",
    slug: "lc04-8570",
    name: "Euro-Profile Mortise Lock Body, 85/70",
    nameZh: "欧标插芯门锁体 85/70",
    series: "Lockcore 04",
    categoryPath: ["locks", "euro-mortise"],
    summary:
      "A DIN mortise lock body with 85 mm centres and 70 mm backset, reversible latch, and a hardened anti-saw deadbolt.",
    summaryZh: "欧标插芯锁体，中心距 85mm，锁舌进深 70mm，斜舌可换向，方舌含防锯钢珠。",
    specs: [
      { label: "Centre distance", value: "85", unit: "mm" },
      { label: "Backset", value: "70", unit: "mm" },
      { label: "Forend length", value: "235", unit: "mm" },
      { label: "Forend width", value: "24", unit: "mm" },
      { label: "Follower", value: "8 x 8", unit: "mm" },
      { label: "Deadbolt throw", value: "20 (double turn)", unit: "mm" },
      { label: "Latch", value: "Reversible, no disassembly" },
      { label: "Deadbolt core", value: "Hardened steel pin" },
      { label: "Cycle rating", value: "200,000" },
      { label: "Handing", value: "Non-handed" },
    ],
    material: "Zinc-plated steel case, stainless steel forend",
    finishes: ["Zinc plated", "Satin stainless forend"],
    doorTypes: ["Timber", "Steel"],
    certifications: [
      { name: "ANSI/BHMA Grade 3", standard: "ANSI/BHMA A156.13" },
      { name: "ISO 9001", standard: "ISO 9001:2015" },
    ],
    heroImage: { ratio: "1 / 1", label: "产品主图 LC04-8570 1:1", labelZh: "LC04-8570 主图" },
    gallery: [
      { ratio: "1 / 1", label: "产品图 细节 1:1" },
      { ratio: "3 / 2", label: "产品图 尺寸图 3:2" },
      { ratio: "3 / 2", label: "产品图 开孔图 3:2" },
      { ratio: "3 / 2", label: "工程实景 3:2" },
    ],
    attachmentIds: ["dl-lc04-datasheet", "dl-lc04-cad", "dl-lc04-cert-en12209"],
    relatedModels: ["HY007-S"],
    seoTitle: "LC04-8570 Euro Mortise Lock Body 85/70 | Canton Hyland",
    seoDescription:
      "DIN mortise lock body, 85 mm centres, 70 mm backset. Reversible latch, hardened deadbolt, ANSI/BHMA Grade 3. Dimensioned drawings available.",
  },
];

/* -------------------------------------------------------------------------
 * Lookup helpers — pure functions, no side effects.
 * ---------------------------------------------------------------------- */

/** Find one product by model number (the business key). */
export function getProductByModel(model: string): Product | undefined {
  return products.find((p) => p.model === model);
}

/** Find one product by its top-level category slug and its own slug — the URL pair. */
export function getProductBySlug(categorySlug: string, slug: string): Product | undefined {
  return products.find((p) => p.categoryPath[0] === categorySlug && p.slug === slug);
}

/** All products whose category path starts with the given slug. */
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categoryPath[0] === categorySlug);
}

/**
 * Resolve Product.relatedModels into real records, skipping any model that is
 * not in the catalogue yet.
 */
export function getRelatedProducts(product: Product): Product[] {
  return product.relatedModels
    .map(getProductByModel)
    .filter((p): p is Product => p !== undefined);
}

/**
 * Every { category, slug } pair — generateStaticParams() needs this to enumerate
 * /products/[category]/[slug] routes for the static export.
 */
export function getAllProductParams(): { category: string; slug: string }[] {
  return products.map((p) => ({ category: p.categoryPath[0], slug: p.slug }));
}
