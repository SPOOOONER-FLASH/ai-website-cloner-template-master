import moves from "../../content/taxonomy-moves.json" with { type: "json" };
import { findCategoryByPath } from "../data/categories.ts";
import { getProductBySlug, isPublished, products } from "../data/products.ts";

/**
 * What happened to a model number that no longer resolves.
 *
 * ---------------------------------------------------------------------------
 * WHY A FACTORY NEEDS THIS PAGE
 *
 * A door-hardware quotation outlives the catalogue that produced it. A specifier opens a
 * 2023 schedule, types `023 PS panic exit device` into a search box, and either finds out
 * what that part is called now or concludes the supplier has vanished. MIWA publishes a
 * 廃止品対照表 for exactly this reason, and it is the least glamorous page on their site.
 *
 * Ours has three kinds of answer, and they are genuinely different — conflating them
 * would be the dishonest version of this page:
 *
 *   renamed        The record still exists under a corrected name. The old URL 301s.
 *                  Nothing about the part changed; what changed is that its name now
 *                  matches its own specification.
 *
 *   retiredPath    A whole category slug was withdrawn and everything under it moved.
 *
 *   notShown       The model is in the catalogue and has no published photograph, so the
 *                  site does not list it. NOT discontinued. We are careful about that
 *                  word: calling a live product discontinued costs an order, and calling
 *                  a discontinued product live costs trust.
 *
 * ---------------------------------------------------------------------------
 * THE `notShown` LIST IS PRINTED WITHOUT LINKS, DELIBERATELY
 *
 * `src/data/withheld-products.test.ts` asserts that nothing on the built site links to a
 * product page with no photograph — the client asked for those records to come down on
 * 2026-09-09 after the finder was found listing all 598. That rule stands, and this page
 * does not get an exemption from it: the model numbers are printed as text, so a buyer
 * searching for one finds the answer, and nobody is sent to an empty page.
 *
 * It is the right outcome on its own terms too. The page a buyer would land on has no
 * photograph. Telling them "this is ours, ask us for a photograph" is worth more than
 * showing them a blank.
 */

export type MergeReason = "renamed-to-match-type" | "duplicate-merged" | "type-corrected";

export interface RenamedRecord {
  /** The retired URL path, without the origin. */
  fromPath: string;
  /** Model number of the surviving record. */
  model: string;
  name: string;
  nameEs?: string;
  namePt?: string;
  /** Path of the surviving page. */
  toPath: string;
  reason: MergeReason;
}

export interface RetiredPath {
  fromPath: string;
  toPath: string;
  categoryName: string;
  categoryNameEs?: string;
  categoryNamePt?: string;
  moved: number;
}

export interface NotShownModel {
  model: string;
  name: string;
  nameEs?: string;
  namePt?: string;
  categorySlug: string;
  categoryName: string;
  categoryNameEs?: string;
  categoryNamePt?: string;
}

interface MergeEntry {
  from: string;
  to: string;
  category: string;
  reason?: string;
}

const KNOWN_REASONS: ReadonlySet<string> = new Set<MergeReason>([
  "renamed-to-match-type",
  "duplicate-merged",
  "type-corrected",
]);

/**
 * Renamed records, newest data first.
 *
 * A merge whose surviving record cannot be found is dropped rather than printed with a
 * dead link. That is not defensive padding — `to` is a slug in a JSON file, and the slug
 * moving again is exactly the kind of drift this page is supposed to catch, not repeat.
 */
export const renamedRecords: RenamedRecord[] = (moves.productMerges as MergeEntry[])
  .map((merge): RenamedRecord | null => {
    const product = getProductBySlug(merge.category, merge.to);
    if (!product || !isPublished(product)) return null;

    const category = product.categoryPath?.[0] ?? merge.category;
    const reason = KNOWN_REASONS.has(merge.reason ?? "")
      ? (merge.reason as MergeReason)
      : "renamed-to-match-type";

    return {
      fromPath: `/products/${merge.category}/${merge.from}/`,
      model: product.model,
      name: product.name,
      nameEs: product.nameEs,
      namePt: product.namePt,
      toPath: `/products/${category}/${product.slug}/`,
      reason,
    };
  })
  .filter((entry): entry is RenamedRecord => entry !== null);

/** Whole category slugs that were withdrawn. */
export const retiredPaths: RetiredPath[] = Object.entries(
  moves.categoryAliases as Record<string, { canonical: string; productSlugs: string[] }>,
).map(([from, alias]) => {
  const category = findCategoryByPath([alias.canonical]);
  return {
    fromPath: `/products/${from}/`,
    toPath: `/products/${alias.canonical}/`,
    categoryName: category?.name ?? alias.canonical,
    categoryNameEs: category?.nameEs,
    categoryNamePt: category?.namePt,
    moved: alias.productSlugs.length,
  };
});

/**
 * Models in the catalogue with no published page, sorted by model number.
 *
 * `localeCompare` with `numeric` is what puts `100-30MM` before `1000` and `5807 E`
 * beside `5807 F`. A plain sort interleaves them by character and the list stops being
 * scannable, which defeats the point of a lookup.
 */
export const notShownModels: NotShownModel[] = products
  .filter((product) => !isPublished(product))
  .map((product) => {
    const slug = product.categoryPath?.[0] ?? "";
    const category = findCategoryByPath([slug]);
    return {
      model: product.model,
      name: product.name,
      nameEs: product.nameEs,
      namePt: product.namePt,
      categorySlug: slug,
      categoryName: category?.name ?? slug,
      categoryNameEs: category?.nameEs,
      categoryNamePt: category?.namePt,
    };
  })
  .sort((a, b) =>
    a.categoryName === b.categoryName
      ? a.model.localeCompare(b.model, "en", { numeric: true })
      : a.categoryName.localeCompare(b.categoryName, "en"),
  );

/** Grouped for rendering: one block per category, in the order above. */
export const notShownByCategory: {
  category: string;
  categoryEs?: string;
  categoryPt?: string;
  models: NotShownModel[];
}[] = notShownModels.reduce<
  { category: string; categoryEs?: string; categoryPt?: string; models: NotShownModel[] }[]
>(
    (groups, model) => {
      const last = groups[groups.length - 1];
      if (last && last.category === model.categoryName) {
        last.models.push(model);
        return groups;
      }
      groups.push({
        category: model.categoryName,
        categoryEs: model.categoryNameEs,
        categoryPt: model.categoryNamePt,
        models: [model],
      });
      return groups;
    },
    [],
  );
