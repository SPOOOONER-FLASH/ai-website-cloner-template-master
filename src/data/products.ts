import type { Product } from "./types";

/**
 * Canton Hyland product catalogue — 12 products from the client's own material.
 *
 * SOURCES, and what each one actually supports:
 *   - Product names, model codes and photography: the client's asset pack delivered
 *     2026-08-15 (WeChat). First-party, no stock library.
 *   - Category tree and product range: the client's cantonlock.com catalogue, checked
 *     2026-08-16. Alibaba remains a secondary source for delivered product imagery.
 *   - Company standards claims: the client's own English profile (公司英文简介.docx).
 *
 * ⚠ SPEC TABLES ARE MOSTLY EMPTY, ON PURPOSE.
 * Alibaba product DETAIL pages are captcha-protected and could not be read, so no
 * dimension, material or finish data was obtainable. Rather than invent plausible
 * numbers, `specs` carries only values that are stated in the client's own product
 * names (e.g. "LC14 85×50" gives centre distance and backset). Everything else waits
 * for the client's catalogue. An empty spec table is honest; a fabricated one is not.
 *
 * ⚠ CERTIFICATIONS ARE DELIBERATELY CONSERVATIVE.
 * The four certificate scans each name a SPECIFIC model (KD070/30-290, KD070/20-101,
 * 607 SS ET). None of them names the models below, so they are published as company
 * credentials in src/data/company.ts and NOT attached to individual products.
 * Per-product entries carry only:
 *   - ISO 9001, stated company-wide by the client and dated 2002
 *   - ANSI Grade 3, only where the client's own product name asserts it
 * Every claim still needs checking against a real test report before launch.
 */
export const products: Product[] = [
  /* ---------------- Panic exit devices ---------------- */
  {
    model: "305",
    slug: "305-fire-door-panic-exit-device",
    name: "Fire Door Panic Exit Device",
    nameZh: "防火门逃生推杠",
    series: "Hyland 300",
    categoryPath: ["panic-exit-devices", "fire-door"],
    summary:
      "A single-point push bar for fire-rated escape doors, with outside lever trim and a cylinder aperture.",
    specs: [],
    material: "Steel / stainless steel",
    finishes: ["Satin stainless", "Powder-coated black"],
    doorTypes: ["Timber fire door", "Steel fire door"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/305-fire-door-panic-exit-device.webp",
      ratio: "1 / 1",
      label: "Hyland 305 fire door panic exit device with push bar and outside lever trim",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["309-D", "314", "320"],
    seoTitle: "305 Fire Door Panic Exit Device | Canton Hyland",
    seoDescription:
      "Single-point panic exit device for fire-rated escape doors, with outside lever trim. Manufactured by Canton Hyland under ISO 9001.",
  },
  {
    model: "309-D",
    slug: "309-d-double-door-panic-exit-device",
    name: "Double Door Panic Exit Device",
    nameZh: "双门逃生推杠",
    series: "Hyland 300",
    categoryPath: ["panic-exit-devices", "multi-point"],
    summary:
      "A paired device set for double escape doors, coordinating the active and inactive leaf.",
    specs: [],
    material: "Steel / stainless steel",
    finishes: ["Satin stainless"],
    doorTypes: ["Double leaf escape door"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/309-d-double-door-panic-exit-device.webp",
      ratio: "1 / 1",
      label: "Hyland 309-D panic exit device set for double escape doors",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["305", "320"],
    seoTitle: "309-D Double Door Panic Exit Device | Canton Hyland",
    seoDescription:
      "Paired panic exit device for double escape doors. Canton Hyland, manufactured under ISO 9001.",
  },
  {
    model: "314",
    slug: "314-alarm-panic-bar-exit-device",
    name: "Alarm Panic Bar Exit Device",
    nameZh: "带报警逃生推杠",
    series: "Hyland 300",
    categoryPath: ["panic-exit-devices", "alarmed"],
    summary:
      "A push bar with an integrated exit alarm, for doors that must stay available for escape but not for casual use.",
    specs: [],
    material: "Aluminium / steel",
    finishes: ["Anodised silver", "Powder-coated black"],
    doorTypes: ["Timber", "Steel", "Aluminium"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/314-alarm-panic-bar-exit-device.webp",
      ratio: "1 / 1",
      label: "Hyland 314 panic bar with integrated exit alarm module",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["305", "309-D"],
    seoTitle: "314 Alarm Panic Bar Exit Device | Canton Hyland",
    seoDescription:
      "Panic bar with integrated exit alarm for controlled escape doors. Canton Hyland, ISO 9001.",
  },
  {
    model: "320",
    slug: "320-two-point-locking-exit-device",
    name: "Two Point Locking Exit Device",
    nameZh: "两点锁逃生推杠",
    series: "Hyland 300",
    categoryPath: ["panic-exit-devices", "multi-point"],
    summary:
      "A two-point locking push bar engaging head and threshold, for tall doors and higher security requirements.",
    specs: [],
    material: "Steel / stainless steel",
    finishes: ["Satin stainless"],
    doorTypes: ["Timber", "Steel"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/320-two-point-locking-exit-device.webp",
      ratio: "1 / 1",
      label: "Hyland 320 two point locking panic exit device with vertical rods",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["305", "309-D"],
    seoTitle: "320 Two Point Locking Exit Device | Canton Hyland",
    seoDescription:
      "Two-point locking panic exit device engaging head and threshold. Canton Hyland, ISO 9001.",
  },

  /* ---------------- Mortise ---------------- */
  {
    model: "LC14 85×50",
    slug: "lc14-8550-four-bolt-mortise-lock-case",
    name: "Four Bolt Mortise Lock Case",
    nameZh: "四方舌插芯锁体",
    series: "Hyland LC14",
    categoryPath: ["lock-cases"],
    summary:
      "A four-bolt mortise lock case with 85 mm centres and 50 mm backset, for Euro profile cylinders.",
    // The only specs stated in the client's own product name. Nothing else is invented.
    specs: [
      { label: "Centre distance", value: "85", unit: "mm" },
      { label: "Backset", value: "50", unit: "mm" },
      { label: "Bolts", value: "Four" },
      { label: "Cylinder", value: "Euro profile" },
    ],
    material: "Steel case, stainless steel forend",
    finishes: ["Zinc plated", "Satin stainless forend"],
    doorTypes: ["Timber", "Steel"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/lc14-8550-mortise-lock-case.webp",
      ratio: "1 / 1",
      label: "Hyland LC14 four bolt mortise lock case, 85 mm centres and 50 mm backset",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["Stainless Steel Lever Handle Lock"],
    seoTitle: "LC14 85×50 Four Bolt Mortise Lock Case | Canton Hyland",
    seoDescription:
      "Four bolt mortise lock case, 85 mm centres, 50 mm backset, Euro profile cylinder. Canton Hyland, ISO 9001.",
  },

  /* ---------------- Lever handle locks ---------------- */
  {
    model: "Black Tubular Lever Lock Set",
    modelTbc: true,
    slug: "black-tubular-lever-lock-set",
    name: "Black Tubular Lever Lock Set",
    nameZh: "黑色管式执手锁",
    series: "Hyland Tubular",
    categoryPath: ["lever-handles"],
    summary:
      "A square-profile tubular lever set in matt black, with keyed outside lever and adjustable latch.",
    specs: [],
    material: "Zinc alloy",
    finishes: ["Matt black"],
    doorTypes: ["Timber"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/black-tubular-lever-lock-set.webp",
      ratio: "1 / 1",
      label: "Matt black square tubular lever lock set with latch and strike",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["Stainless Steel Lever Handle Lock", "Tubular Knob Lock"],
    seoTitle: "Black Tubular Lever Lock Set | Canton Hyland",
    seoDescription:
      "Square-profile tubular lever lock set in matt black zinc alloy. Canton Hyland, ISO 9001.",
  },
  {
    model: "Stainless Steel Lever Handle Lock",
    modelTbc: true,
    slug: "stainless-steel-lever-handle-lock",
    name: "Stainless Steel Lever Handle Lock",
    nameZh: "不锈钢执手锁",
    series: "Hyland Lever",
    categoryPath: ["lever-handles"],
    summary:
      "A stainless steel lever set on backplate, for mortise lock cases with Euro cylinder preparation.",
    specs: [],
    material: "Stainless steel",
    finishes: ["Satin stainless"],
    doorTypes: ["Timber", "Steel"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/stainless-steel-lever-handle-lock.webp",
      ratio: "1 / 1",
      label: "Stainless steel lever handle lock on backplate with cylinder aperture",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["LC14 85×50", "Black Tubular Lever Lock Set"],
    seoTitle: "Stainless Steel Lever Handle Lock | Canton Hyland",
    seoDescription:
      "Stainless steel lever handle set on backplate for mortise lock cases. Canton Hyland, ISO 9001.",
  },

  /* ---------------- Knob locks ---------------- */
  {
    model: "Tubular Knob Lock",
    modelTbc: true,
    slug: "tubular-knob-lock",
    name: "Tubular Knob Lock",
    nameZh: "管式球形锁",
    series: "Hyland Knob",
    categoryPath: ["knob-locks", "tubular-locks"],
    summary:
      "A tubular knob lock set for residential and light commercial doors, in entry, privacy and passage functions.",
    specs: [],
    material: "Stainless steel / zinc alloy",
    finishes: ["Satin stainless", "Polished brass"],
    doorTypes: ["Timber"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/tubular-knob-lock.webp",
      ratio: "1 / 1",
      label: "Stainless steel tubular knob lock set with latch and strike plate",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["Cylindrical Knob Lock", "Black Tubular Lever Lock Set"],
    seoTitle: "Tubular Knob Lock | Canton Hyland",
    seoDescription:
      "Tubular knob lock set in entry, privacy and passage functions. Canton Hyland, ISO 9001.",
  },
  {
    model: "Cylindrical Knob Lock",
    modelTbc: true,
    slug: "cylindrical-knob-lock",
    name: "Cylindrical Knob Lock",
    nameZh: "筒式球形锁",
    series: "Hyland Knob",
    categoryPath: ["knob-locks", "heavy-duty-cylindrical-locks"],
    summary:
      "A heavy-duty cylindrical knob lock for commercial traffic, available in communication and classroom functions.",
    specs: [],
    material: "Stainless steel",
    finishes: ["Satin stainless"],
    doorTypes: ["Timber", "Steel"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/cylindrical-knob-lock.webp",
      ratio: "1 / 1",
      label: "Stainless steel cylindrical knob lock set for commercial doors",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["Tubular Knob Lock"],
    seoTitle: "Cylindrical Knob Lock | Canton Hyland",
    seoDescription:
      "Heavy-duty cylindrical knob lock for commercial doors. Canton Hyland, ISO 9001.",
  },

  /* ---------------- Deadbolt ---------------- */
  {
    model: "ANSI Grade 3 Keyed Deadbolt",
    modelTbc: true,
    slug: "ansi-grade-3-keyed-deadbolt-lock-set",
    name: "ANSI Grade 3 Keyed Deadbolt Lock Set",
    nameZh: "美标三级深栓锁",
    series: "Hyland Deadbolt",
    categoryPath: ["deadbolts"],
    summary:
      "A single cylinder keyed deadbolt with hardened bolt, supplied with strike plate and fixings.",
    specs: [],
    material: "Stainless steel / zinc alloy",
    finishes: ["Satin stainless", "Polished brass"],
    doorTypes: ["Timber", "Steel"],
    // ANSI Grade 3 is asserted by the client's own product name and company profile.
    certifications: [
      { name: "ANSI Grade 3", standard: "ANSI/BHMA" },
      { name: "ISO 9001", standard: "ISO 9001:2015" },
    ],
    heroImage: {
      src: "/images/products/ansi-grade-3-keyed-deadbolt.webp",
      ratio: "1 / 1",
      label: "ANSI Grade 3 keyed deadbolt lock set with cylinder, thumbturn and strike",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["Tubular Knob Lock", "Night Latch & Rim Lock"],
    seoTitle: "ANSI Grade 3 Keyed Deadbolt Lock Set | Canton Hyland",
    seoDescription:
      "Single cylinder keyed deadbolt, ANSI Grade 3, with hardened bolt and strike plate. Canton Hyland, ISO 9001.",
  },

  /* ---------------- Glass door ---------------- */
  {
    model: "Glass Door Patch Fitting Set",
    modelTbc: true,
    slug: "glass-door-patch-fitting-set",
    name: "Glass Door Patch Fitting Set",
    nameZh: "玻璃门夹具套装",
    series: "Hyland Glass",
    categoryPath: ["glass-door-accessories", "patch-fittings"],
    summary:
      "A stainless steel patch fitting set for frameless toughened glass doors, with matching pivots and cover plates.",
    specs: [],
    material: "Stainless steel",
    finishes: ["Satin stainless", "Mirror polished"],
    doorTypes: ["Frameless glass"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/glass-door-patch-fitting-set.webp",
      ratio: "1 / 1",
      label: "Stainless steel glass door patch fitting set with cover plates and pivots",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["Wooden Door Floor Hinge"],
    seoTitle: "Glass Door Patch Fitting Set | Canton Hyland",
    seoDescription:
      "Stainless steel patch fitting set for frameless toughened glass doors. Canton Hyland, ISO 9001.",
  },

  /* ---------------- Floor hinge ---------------- */
  {
    model: "Wooden Door Floor Hinge",
    modelTbc: true,
    slug: "wooden-door-floor-hinge",
    name: "Wooden Door Floor Hinge",
    nameZh: "木门地弹簧",
    series: "Hyland Floor Spring",
    categoryPath: ["door-closers"],
    summary:
      "A concealed floor spring for wooden doors, supplied with pivot brackets, cover plates and top centre.",
    specs: [],
    material: "Steel body, stainless steel cover plates",
    finishes: ["Satin stainless"],
    doorTypes: ["Timber", "Frameless glass"],
    certifications: [{ name: "ISO 9001", standard: "ISO 9001:2015" }],
    heroImage: {
      src: "/images/products/wooden-door-floor-hinge.webp",
      ratio: "1 / 1",
      label: "Wooden door floor hinge with cover plates, pivot brackets and top centre",
    },
    gallery: [],
    attachmentIds: [],
    relatedModels: ["Glass Door Patch Fitting Set"],
    seoTitle: "Wooden Door Floor Hinge | Canton Hyland",
    seoDescription:
      "Concealed floor spring for wooden and glass doors, with pivot brackets and cover plates. Canton Hyland, ISO 9001.",
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
