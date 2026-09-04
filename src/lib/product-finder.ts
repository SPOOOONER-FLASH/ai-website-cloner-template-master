import type { Product } from "@/data/types";

/**
 * Product Finder core — faceted filtering over the catalogue.
 *
 * Pure functions with no React and no I/O, so the behaviour is testable without a
 * browser and the page component stays thin.
 *
 * Facets are DERIVED FROM THE DATA, never hard-coded. Add a product with a new finish
 * and that finish appears as a filter option on the next build. This matters because the
 * catalogue is about to be edited through a CMS by people who will not be touching code.
 */

/** Dimensions we can filter on today. Spec-based numeric filters wait for spec data. */
export type FacetKey =
  | "category"
  | "subCategory"
  | "series"
  | "material"
  | "finish"
  | "doorType"
  | "certification";

export interface FacetOption {
  value: string;
  /** How many products carry this value, given the OTHER active filters. */
  count: number;
}

export interface Facet {
  key: FacetKey;
  label: string;
  options: FacetOption[];
}

/** Active selection: facet key -> chosen values. An absent or empty key means "any". */
export type Selection = Partial<Record<FacetKey, string[]>>;

export const FACET_LABELS: Record<FacetKey, string> = {
  category: "Category",
  subCategory: "Type",
  series: "Series",
  material: "Material",
  finish: "Finish",
  doorType: "Door type",
  certification: "Certification",
};

/**
 * The same facets in Spanish trade language.
 *
 * Not literal translations. "Acabado" is what a Spanish-speaking specifier writes for a
 * finish; "terminado" would be understood and would read as a translation. Same list as
 * FACET_LABELS by construction — the Record<FacetKey, string> type means adding a facet
 * fails to compile until this one has it too, which is the only reliable way to keep a
 * mirrored UI from silently falling behind.
 */
export const FACET_LABELS_ES: Record<FacetKey, string> = {
  category: "Categoría",
  subCategory: "Tipo",
  series: "Serie",
  material: "Material",
  finish: "Acabado",
  doorType: "Tipo de puerta",
  certification: "Certificación",
};

/**
 * The rail shows two facets; the rest live behind a "More filters" panel.
 *
 * All seven at once produced a column hundreds of rows long — 41 materials, 78 finishes,
 * 87 door types — which buries the two dimensions almost everyone actually starts from.
 * Category and Type answer "what kind of product"; the others narrow an already-chosen
 * kind, so they are a second step rather than a competing first one.
 */
export const PRIMARY_FACETS: FacetKey[] = ["category", "subCategory"];
export const SECONDARY_FACETS: FacetKey[] = [
  "series",
  "material",
  "finish",
  "doorType",
  "certification",
];

/**
 * Results per page.
 *
 * 20, set by the client. The number is a page-weight decision more than a browsing
 * one: every card carries a photograph, so this is what bounds how many images a
 * single view can ask for.
 */
export const PAGE_SIZE = 20;

export type VisiblePageItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * Three consecutive page choices plus the distant endpoints of the catalogue.
 *
 * The endpoints communicate the real catalogue depth (`1 2 3 … 22`) while the moving
 * window keeps the control compact (`1 … 10 11 12 … 22`). Ellipses are separate tokens
 * so the component can render them as inert text rather than misleading buttons.
 */
export function visiblePageNumbers(page: number, count: number): VisiblePageItem[] {
  if (count <= 0) return [];
  if (count <= 4) return Array.from({ length: count }, (_, index) => index + 1);

  const current = Math.min(Math.max(Math.trunc(page) || 1, 1), count);
  const start = Math.min(Math.max(current - 1, 1), count - 2);
  const window = [start, start + 1, start + 2];
  const items: VisiblePageItem[] = [];

  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("ellipsis-start");
  }

  items.push(...window);

  const windowEnd = window.at(-1) ?? count;
  if (windowEnd < count) {
    if (windowEnd < count - 1) items.push("ellipsis-end");
    items.push(count);
  }

  return items;
}

/**
 * The subset of a product the finder actually reads.
 *
 * WHY THIS EXISTS. The finder is a client component, so whatever it is handed is
 * serialised into the RSC flight payload embedded in the page. Handing it the full
 * `Product` put every spec row, every Spanish spec row, every gallery entry and every
 * SEO string for all 435 records into an inline <script>: /product-finder/ exported at
 * **1.29 MB, 94% of it that payload**, and Bing Site Scan flagged five URLs as
 * "Html size is too long" (soft limit 1 MB) — above that a crawler may not take the
 * whole page.
 *
 * None of those fields are read here. Project to this shape at the page boundary.
 * The functions below are generic over it so the category page, which passes full
 * products from a server component, keeps working unchanged.
 */
export type FinderProduct = Pick<
  Product,
  | "slug"
  | "model"
  | "modelTbc"
  | "name"
  | "nameEs"
  | "nameZh"
  | "series"
  | "categoryPath"
  | "material"
  | "finishes"
  | "doorTypes"
  | "certifications"
  | "heroImage"
  | "summary"
  /*
    Carried so the configurator can END ON A MOVING PICTURE. 35 products have a
    demonstration clip, and a guided tool that finishes on a hand actually working the
    lock answers the question the whole narrowing was for. It is a small field on a large
    array — 435 entries — so it is deliberately the LAST thing added: everything else
    here is needed to filter, this is needed only to finish.
  */
  | "videos"
>;

export function toFinderProduct(product: Product): FinderProduct {
  return {
    slug: product.slug,
    model: product.model,
    modelTbc: product.modelTbc,
    name: product.name,
    nameEs: product.nameEs,
    nameZh: product.nameZh,
    series: product.series,
    categoryPath: product.categoryPath,
    material: product.material,
    finishes: product.finishes,
    doorTypes: product.doorTypes,
    certifications: product.certifications,
    heroImage: product.heroImage,
    summary: product.summary,
    /* Only the first clip. A configurator result is one product, not a playlist. */
    videos: product.videos?.length ? [product.videos[0]] : undefined,
  };
}

/** Every value a product contributes to a given facet. */
function valuesFor(product: FinderProduct, key: FacetKey): string[] {
  switch (key) {
    case "category":
      return product.categoryPath[0] ? [product.categoryPath[0]] : [];
    case "subCategory":
      return product.categoryPath[1] ? [product.categoryPath[1]] : [];
    case "series":
      return product.series ? [product.series] : [];
    case "material":
      return product.material ? [product.material] : [];
    case "finish":
      return product.finishes ?? [];
    case "doorType":
      return product.doorTypes ?? [];
    case "certification":
      return (product.certifications ?? []).map((c) => c.name);
  }
}

/**
 * Does a product satisfy the selection?
 *
 * Within one facet the values are OR'd (satin OR black), across facets they are AND'd
 * (a satin lever AND a timber door). That is what every faceted search does, and getting
 * it backwards produces a finder that returns nothing as soon as you tick two boxes.
 */
export function matches(product: FinderProduct, selection: Selection): boolean {
  return (Object.entries(selection) as [FacetKey, string[] | undefined][]).every(
    ([key, chosen]) => {
      if (!chosen?.length) return true;
      const values = valuesFor(product, key);
      return chosen.some((value) => values.includes(value));
    },
  );
}

/** Free-text search across the fields a buyer actually types into. */
export function matchesQuery(product: FinderProduct, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    product.model,
    product.name,
    product.nameZh,
    product.series,
    product.summary,
    ...(product.finishes ?? []),
    ...(product.doorTypes ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export function filterProducts<T extends FinderProduct>(
  products: T[],
  selection: Selection,
  query = "",
): T[] {
  return products.filter((p) => matches(p, selection) && matchesQuery(p, query));
}

/** A product with no `heroImage.src` renders as a grey placeholder block. */
export function hasHeroImage(product: FinderProduct): boolean {
  return Boolean(product.heroImage?.src);
}

/**
 * Orders results so the first page is photographed product, not placeholders.
 *
 * 112 of 431 products still have no photography, and scattered through the grid they
 * made the catalogue look unfinished — the client asked for them off the first page.
 * This is a sort rather than a filter on purpose: those products are still findable,
 * still linkable and still counted, they just queue behind the ones that show something.
 * Within each group the incoming order is preserved, so this composes with search
 * relevance instead of overriding it.
 */
export function sortForDisplay<T extends FinderProduct>(products: T[]): T[] {
  const withImage: T[] = [];
  const without: T[] = [];
  for (const p of products) (hasHeroImage(p) ? withImage : without).push(p);
  return [...withImage, ...without];
}

export interface Page<T> {
  items: T[];
  /** 1-based, clamped into range. */
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
}

/**
 * Every query parameter this module owns.
 *
 * The finder mirrors its state into the address bar, and needs to know which keys are
 * its own so it can leave everyone else's alone —  was being wiped on every
 * keystroke before this existed.
 */
export const FACET_PARAM_NAMES = new Set<string>([
  ...(Object.keys(FACET_LABELS) as string[]),
  "q",
  "page",
]);

/** Slices results into one page, clamping an out-of-range page rather than 404ing. */
export function paginate<T>(items: T[], page: number, size = PAGE_SIZE): Page<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);
  const start = (current - 1) * size;
  return {
    items: items.slice(start, start + size),
    page: current,
    pageCount,
    total,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + size, total),
  };
}

/**
 * Build the facet list, with counts.
 *
 * Counts for a facet are computed against the selection with THAT facet removed, so a
 * ticked box does not drive its own siblings to zero. Without this, ticking "Satin
 * stainless" makes every other finish read "(0)" and the UI looks broken.
 */
export function buildFacets(
  products: FinderProduct[],
  selection: Selection = {},
  query = "",
): Facet[] {
  const keys = Object.keys(FACET_LABELS) as FacetKey[];

  return keys
    .map((key) => {
      const others: Selection = { ...selection };
      delete others[key];
      const pool = filterProducts(products, others, query);

      const counts = new Map<string, number>();
      for (const product of pool) {
        for (const value of valuesFor(product, key)) {
          counts.set(value, (counts.get(value) ?? 0) + 1);
        }
      }

      const options = [...counts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

      return { key, label: FACET_LABELS[key], options };
    })
    // A facet where every product shares one value tells the user nothing.
    .filter((facet) => facet.options.length > 1);
}

/** Toggle one value in a selection, returning a new object. */
export function toggleValue(
  selection: Selection,
  key: FacetKey,
  value: string,
): Selection {
  const current = selection[key] ?? [];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];

  const updated: Selection = { ...selection, [key]: next };
  if (!next.length) delete updated[key];
  return updated;
}

export function countActive(selection: Selection): number {
  return Object.values(selection).reduce((n, values) => n + (values?.length ?? 0), 0);
}

/* -------------------------------------------------------------------------
 * URL state — a filtered view has to be shareable and linkable.
 * ---------------------------------------------------------------------- */

export function selectionToParams(
  selection: Selection,
  query = "",
  page = 1,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(selection)) {
    if (values?.length) params.set(key, values.join(","));
  }
  if (query.trim()) params.set("q", query.trim());
  // Page 1 is the default; leaving it out keeps the common URL clean and means a link
  // to a filtered view and a link to its first page are the same string.
  if (page > 1) params.set("page", String(page));
  return params;
}

export function selectionFromParams(params: URLSearchParams): {
  selection: Selection;
  query: string;
  page: number;
} {
  const selection: Selection = {};
  for (const key of Object.keys(FACET_LABELS) as FacetKey[]) {
    const raw = params.get(key);
    if (raw) selection[key] = raw.split(",").filter(Boolean);
  }
  const page = Number.parseInt(params.get("page") ?? "1", 10);
  return {
    selection,
    query: params.get("q") ?? "",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}
