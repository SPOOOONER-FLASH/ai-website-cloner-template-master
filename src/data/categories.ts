import type { Category } from "./types";

/**
 * Product category tree.
 *
 * The shape of this tree IS the URL structure: /products/[category]/[slug].
 * Renaming a slug changes a live URL, so treat slugs as stable once published.
 *
 * Sub-categories are drafted where the split is obvious. They are not yet used
 * by any route — /products/[category] currently means top level only. Deepening
 * to /products/[category]/[subcategory] is a later decision; see BUILD_PLAN.md.
 */
export const categories: Category[] = [
  {
    slug: "locks",
    name: "Mortise Locks",
    nameZh: "门锁",
    summary:
      "Mortise lock bodies for timber, steel and aluminium doors, in Euro-profile and ANSI preparations.",
    image: { ratio: "1 / 1", label: "分类图 门锁 1:1", labelZh: "门锁" },
    children: [
      {
        slug: "euro-mortise",
        name: "Euro-Profile Mortise",
        nameZh: "欧标门锁",
        summary: "DIN-standard lock bodies with Euro cylinder preparation.",
        image: { ratio: "1 / 1", label: "分类图 欧标门锁 1:1" },
      },
      {
        slug: "ansi-mortise",
        name: "ANSI Mortise",
        nameZh: "美标门锁",
        summary: "ANSI/BHMA-prepared lock bodies for the North American market.",
        image: { ratio: "1 / 1", label: "分类图 美标门锁 1:1" },
      },
      {
        slug: "tubular-latch",
        name: "Tubular Latches",
        nameZh: "管状锁舌",
        summary: "Bored-hole latches for interior passage and privacy sets.",
        image: { ratio: "1 / 1", label: "分类图 管状锁舌 1:1" },
      },
    ],
  },
  {
    slug: "levers",
    name: "Lever Handles",
    nameZh: "执手",
    summary:
      "Lever handles on rose and on plate, in solid brass and stainless steel, across the full finish range.",
    image: { ratio: "1 / 1", label: "分类图 执手 1:1", labelZh: "执手" },
    children: [
      {
        slug: "lever-on-rose",
        name: "Lever on Rose",
        nameZh: "圆座执手",
        summary: "Concealed-fix levers on a round or square rose.",
        image: { ratio: "1 / 1", label: "分类图 圆座执手 1:1" },
      },
      {
        slug: "lever-on-plate",
        name: "Lever on Plate",
        nameZh: "板式执手",
        summary: "Levers on a backplate with integrated cylinder or thumbturn aperture.",
        image: { ratio: "1 / 1", label: "分类图 板式执手 1:1" },
      },
      {
        slug: "pull-handles",
        name: "Pull Handles",
        nameZh: "拉手",
        summary: "Back-to-back and single-sided pulls for entrance and glass doors.",
        image: { ratio: "1 / 1", label: "分类图 拉手 1:1" },
      },
    ],
  },
  {
    slug: "glass-fittings",
    name: "Glass Door Fittings",
    nameZh: "玻璃门夹",
    summary:
      "Patch fittings, clamps and floor-spring accessories for frameless toughened glass assemblies.",
    image: { ratio: "1 / 1", label: "分类图 玻璃门夹 1:1", labelZh: "玻璃门夹" },
    children: [
      {
        slug: "patch-fittings",
        name: "Patch Fittings",
        nameZh: "玻璃门夹具",
        summary: "Top, bottom and corner patches for frameless glass doors.",
        image: { ratio: "1 / 1", label: "分类图 玻璃门夹具 1:1" },
      },
      {
        slug: "glass-clamps",
        name: "Glass Clamps",
        nameZh: "玻璃固定夹",
        summary: "Fixed-panel clamps and sidelight connectors.",
        image: { ratio: "1 / 1", label: "分类图 玻璃固定夹 1:1" },
      },
    ],
  },
  {
    slug: "exit-devices",
    name: "Panic Exit Devices",
    nameZh: "逃生推杠",
    summary:
      "Touch bars and push bars for escape routes, with matching outside access trim.",
    image: { ratio: "1 / 1", label: "分类图 逃生推杠 1:1", labelZh: "逃生推杠" },
    children: [
      {
        slug: "touch-bars",
        name: "Touch Bars",
        nameZh: "触压式推杠",
        summary: "Low-profile touch bars for single and double doors.",
        image: { ratio: "1 / 1", label: "分类图 触压式推杠 1:1" },
      },
      {
        slug: "push-bars",
        name: "Push Bars",
        nameZh: "横杆式推杠",
        summary: "Cross-bar devices for high-traffic escape doors.",
        image: { ratio: "1 / 1", label: "分类图 横杆式推杠 1:1" },
      },
    ],
  },
  {
    slug: "cylinders",
    name: "Cylinders",
    nameZh: "锁芯",
    summary:
      "Euro-profile and rim cylinders, keyed alike and master-key ready, with anti-drill protection.",
    image: { ratio: "1 / 1", label: "分类图 锁芯 1:1", labelZh: "锁芯" },
    children: [
      {
        slug: "euro-cylinders",
        name: "Euro-Profile Cylinders",
        nameZh: "欧标锁芯",
        summary: "Double, single and thumbturn cylinders in the DIN profile.",
        image: { ratio: "1 / 1", label: "分类图 欧标锁芯 1:1" },
      },
      {
        slug: "rim-cylinders",
        name: "Rim Cylinders",
        nameZh: "外装锁芯",
        summary: "Rim cylinders for night latches and surface-mounted locks.",
        image: { ratio: "1 / 1", label: "分类图 外装锁芯 1:1" },
      },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    nameZh: "配件",
    summary:
      "Hinges, door stops, flush bolts, escutcheons and the fixings that complete a hardware schedule.",
    image: { ratio: "1 / 1", label: "分类图 配件 1:1", labelZh: "配件" },
    children: [
      {
        slug: "hinges",
        name: "Hinges",
        nameZh: "合页",
        summary: "Butt, concealed and pivot hinges rated for commercial traffic.",
        image: { ratio: "1 / 1", label: "分类图 合页 1:1" },
      },
      {
        slug: "door-stops",
        name: "Door Stops",
        nameZh: "门吸",
        summary: "Floor and wall-mounted stops, magnetic and mechanical.",
        image: { ratio: "1 / 1", label: "分类图 门吸 1:1" },
      },
      {
        slug: "escutcheons",
        name: "Escutcheons",
        nameZh: "锁孔盖板",
        summary: "Cylinder and thumbturn escutcheons matching the lever finish range.",
        image: { ratio: "1 / 1", label: "分类图 锁孔盖板 1:1" },
      },
    ],
  },
];

/* -------------------------------------------------------------------------
 * Lookup helpers — pure functions over the tree, no side effects.
 * ---------------------------------------------------------------------- */

/** Top-level categories, in menu order. */
export function getTopLevelCategories(): Category[] {
  return categories;
}

/** Find a category by its path of slugs, e.g. ["levers", "lever-on-rose"]. */
export function findCategoryByPath(path: string[]): Category | undefined {
  let level: Category[] | undefined = categories;
  let found: Category | undefined;

  for (const slug of path) {
    found = level?.find((c) => c.slug === slug);
    if (!found) return undefined;
    level = found.children;
  }
  return found;
}

/**
 * Every category path in the tree, flattened.
 * generateStaticParams() needs this to enumerate routes for the static export.
 */
export function getAllCategoryPaths(): string[][] {
  const out: string[][] = [];

  const walk = (nodes: Category[], prefix: string[]) => {
    for (const node of nodes) {
      const path = [...prefix, node.slug];
      out.push(path);
      if (node.children?.length) walk(node.children, path);
    }
  };

  walk(categories, []);
  return out;
}
