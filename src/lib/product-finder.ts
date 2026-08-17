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

/** Every value a product contributes to a given facet. */
function valuesFor(product: Product, key: FacetKey): string[] {
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
export function matches(product: Product, selection: Selection): boolean {
  return (Object.entries(selection) as [FacetKey, string[] | undefined][]).every(
    ([key, chosen]) => {
      if (!chosen?.length) return true;
      const values = valuesFor(product, key);
      return chosen.some((value) => values.includes(value));
    },
  );
}

/** Free-text search across the fields a buyer actually types into. */
export function matchesQuery(product: Product, query: string): boolean {
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

export function filterProducts(
  products: Product[],
  selection: Selection,
  query = "",
): Product[] {
  return products.filter((p) => matches(p, selection) && matchesQuery(p, query));
}

/**
 * Build the facet list, with counts.
 *
 * Counts for a facet are computed against the selection with THAT facet removed, so a
 * ticked box does not drive its own siblings to zero. Without this, ticking "Satin
 * stainless" makes every other finish read "(0)" and the UI looks broken.
 */
export function buildFacets(
  products: Product[],
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

export function selectionToParams(selection: Selection, query = ""): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(selection)) {
    if (values?.length) params.set(key, values.join(","));
  }
  if (query.trim()) params.set("q", query.trim());
  return params;
}

export function selectionFromParams(params: URLSearchParams): {
  selection: Selection;
  query: string;
} {
  const selection: Selection = {};
  for (const key of Object.keys(FACET_LABELS) as FacetKey[]) {
    const raw = params.get(key);
    if (raw) selection[key] = raw.split(",").filter(Boolean);
  }
  return { selection, query: params.get("q") ?? "" };
}
