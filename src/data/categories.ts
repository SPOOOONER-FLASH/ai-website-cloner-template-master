import type { Category } from "./types";

/**
 * Product category tree — mirrors the client's own Alibaba storefront categories,
 * read from https://cnhyland.en.alibaba.com/productlist.html on 2026-08-15.
 *
 * The shape of this tree IS the URL structure: /products/[category]/[slug].
 * Renaming a slug changes a live URL, so treat slugs as stable once published.
 *
 * Sub-categories are a FILTER DIMENSION only (decision 3) — they never become a URL
 * segment. They are used by the P4 listing page.
 */
export const categories: Category[] = [
  {
    slug: "panic-exit-devices",
    name: "Panic Exit Devices",
    nameZh: "逃生推杠",
    summary:
      "Push bars and touch bars for escape routes, including fire-door, alarmed, double-door and two-point locking versions.",
    image: {
      src: "/images/products/cat-panic-exit-device.webp",
      ratio: "1 / 1",
      label: "Stainless steel panic exit device with horizontal push bar",
    },
    children: [
      { slug: "fire-door", name: "Fire Door Devices", nameZh: "防火门推杠", summary: "Rated devices for fire-rated escape doors.", image: { ratio: "1 / 1", label: "Fire door panic device" } },
      { slug: "alarmed", name: "Alarmed Devices", nameZh: "带报警推杠", summary: "Push bars with integrated exit alarm.", image: { ratio: "1 / 1", label: "Alarmed panic bar" } },
      { slug: "multi-point", name: "Multi-Point Locking", nameZh: "多点锁推杠", summary: "Two- and three-point locking for tall or double doors.", image: { ratio: "1 / 1", label: "Two point locking exit device" } },
    ],
  },
  {
    slug: "lever-handle-locks",
    name: "Lever Handle Locks",
    nameZh: "执手锁",
    summary:
      "Lever handle sets in stainless steel and zinc alloy, for commercial and residential doors, in tubular and mortise preparations.",
    image: {
      src: "/images/products/cat-lever-handle-lock.webp",
      ratio: "1 / 1",
      label: "Stainless steel lever handle lock set on backplate",
    },
    children: [
      { slug: "tubular-lever", name: "Tubular Lever", nameZh: "管式执手", summary: "Bored-hole lever sets for interior doors.", image: { ratio: "1 / 1", label: "Tubular lever lock" } },
      { slug: "mortise-lever", name: "Mortise Lever", nameZh: "插芯执手", summary: "Lever sets on plate for mortise lock cases.", image: { ratio: "1 / 1", label: "Mortise lever set" } },
    ],
  },
  {
    slug: "knob-locks",
    name: "Knob Locks",
    nameZh: "球形锁",
    summary:
      "Cylindrical and tubular knob locks for entry, privacy, passage and communication functions.",
    image: {
      src: "/images/products/cylindrical-knob-lock.webp",
      ratio: "1 / 1",
      label: "Stainless steel cylindrical knob lock set",
    },
    children: [
      { slug: "cylindrical-knob", name: "Cylindrical Knob", nameZh: "筒式球形锁", summary: "Heavy-duty cylindrical knob sets for commercial traffic.", image: { ratio: "1 / 1", label: "Cylindrical knob lock" } },
      { slug: "tubular-knob", name: "Tubular Knob", nameZh: "管式球形锁", summary: "Tubular knob sets for residential and light commercial use.", image: { ratio: "1 / 1", label: "Tubular knob lock" } },
    ],
  },
  {
    slug: "mortise-locks",
    name: "Mortise Locks & Cylinders",
    nameZh: "插芯锁体与锁芯",
    summary:
      "Mortise lock cases and profile cylinders, including master key and construction key systems.",
    image: {
      src: "/images/products/lc14-8550-mortise-lock-case.webp",
      ratio: "1 / 1",
      label: "Four bolt mortise lock case with stainless steel forend",
    },
    children: [
      { slug: "lock-case", name: "Mortise Lock Bodies", nameZh: "锁体", summary: "Lock cases in Euro and multi-bolt configurations.", image: { ratio: "1 / 1", label: "Mortise lock body" } },
      { slug: "profile-cylinder", name: "Profile Cylinders", nameZh: "锁芯", summary: "Euro profile cylinders, master keyed on request.", image: { ratio: "1 / 1", label: "Profile cylinder" } },
    ],
  },
  {
    slug: "deadbolt-locks",
    name: "Deadbolt Locks",
    nameZh: "深栓锁",
    summary: "Single and double cylinder deadbolts, ANSI Grade 3, for timber and steel doors.",
    image: {
      src: "/images/products/ansi-grade-3-keyed-deadbolt.webp",
      ratio: "1 / 1",
      label: "ANSI Grade 3 keyed deadbolt lock set with strike plate",
    },
  },
  {
    slug: "door-handles",
    name: "Door Handles & Pulls",
    nameZh: "拉手",
    summary:
      "Grip handle sets, storefront push-pull handles, concealed sliding door pulls and glass door pull handles.",
    image: {
      src: "/images/products/600-concealed-sliding-door-handle.webp",
      ratio: "1 / 1",
      label: "Concealed sliding door flush pull handle",
    },
  },
  {
    slug: "glass-door-fittings",
    name: "Glass Door Fittings",
    nameZh: "玻璃门夹具",
    summary: "Patch fittings and pull handles for frameless toughened glass assemblies.",
    image: {
      src: "/images/products/glass-door-patch-fitting-set.webp",
      ratio: "1 / 1",
      label: "Stainless steel glass door patch fitting set",
    },
  },
  {
    slug: "floor-hinges",
    name: "Floor Hinges",
    nameZh: "地弹簧",
    summary: "Concealed floor springs and pivot sets for wooden and glass doors.",
    image: {
      src: "/images/products/wooden-door-floor-hinge.webp",
      ratio: "1 / 1",
      label: "Wooden door floor hinge with cover plates and pivot brackets",
    },
  },
  {
    slug: "building-hardware",
    name: "Building Hardware",
    nameZh: "建筑五金配件",
    summary:
      "Hinges, night latches, bolts, door viewers, stoppers and the accessories that complete a hardware schedule.",
    image: {
      src: "/images/products/stainless-steel-door-hinge.webp",
      ratio: "1 / 1",
      label: "Pair of stainless steel ball bearing door hinges",
    },
    children: [
      { slug: "hinges", name: "Hinges", nameZh: "合页", summary: "Ball bearing and anti-pry security hinges.", image: { ratio: "1 / 1", label: "Door hinge" } },
      { slug: "rim-locks", name: "Night Latches & Rim Locks", nameZh: "外装门锁", summary: "Surface-mounted night latches and rim locks.", image: { ratio: "1 / 1", label: "Night latch" } },
      { slug: "accessories", name: "Accessories", nameZh: "配件", summary: "Bolts, viewers, stoppers, chains and house numbers.", image: { ratio: "1 / 1", label: "Building hardware accessory" } },
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

/** Find a category by its path of slugs, e.g. ["knob-locks", "tubular-knob"]. */
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
