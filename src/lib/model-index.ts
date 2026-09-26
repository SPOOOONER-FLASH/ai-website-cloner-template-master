import { publishedProducts } from "@/data/products";
import type { Locale } from "@/data/site";
import { t } from "./i18n.ts";
import { type ModelIndexEntry, modelSearchKey } from "./model-index-core.ts";

export { type ModelIndexEntry, modelSearchKey, modelIndexGroup, groupModelIndex } from "./model-index-core.ts";

/**
 * A complete A–Z index of every published model number, and the page each one resolves to.
 *
 * ---------------------------------------------------------------------------
 * WHY AN INDEX AND NOT A SEARCH BOX
 *
 * The client asked for MIWA's `型式記号別INDEX` — the button in their catalogue viewer
 * that jumps from a model designation to the page it is printed on. The obvious
 * reading is "add a search box", and that would have been the wrong half of it.
 *
 * MIWA's asset is not the input field. It is that every designation they publish is
 * reachable, as a listed item, from one address. A search box produces nothing until
 * somebody types, which means it produces nothing at all for a crawler, and the 2026-09-20
 * Clarity reading is unambiguous about what that costs: all 33 of our AI citations landed
 * on pages whose text is in the HTML, and none on the 519 product pages that a machine has
 * to interact with a control to reach.
 *
 * So the index renders as links, server-side, all of them. The filter box on top narrows
 * what is already on the page. With JavaScript off, the box disappears and the index is
 * still complete — which is also what a crawler sees.
 *
 * ---------------------------------------------------------------------------
 * WHAT COUNTS AS A MODEL CODE
 *
 * `model` as the record states it, not a normalised form: `306 PS`, `LH852 GMBK`,
 * `70720 PB`. That is the string printed on a drawing and typed into a purchase order,
 * and rewriting it to look tidy would defeat the purpose of the page. `searchKey` is the
 * normalised form used for matching only — it never reaches the reader.
 */



const localePrefix = (locale: Locale) => (locale === "en" ? "" : `/${locale}`);

export function modelIndex(locale: Locale): ModelIndexEntry[] {
  return publishedProducts
    .map((product) => ({
      model: String(product.model),
      name: String(
        t(product, "name", locale),
      ),
      category: product.categoryPath[0],
      href: `${localePrefix(locale)}/products/${product.categoryPath[0]}/${product.slug}/`,
      searchKey: modelSearchKey(String(product.model)),
    }))
    .sort((a, b) =>
      a.model.localeCompare(b.model, "en", { numeric: true, sensitivity: "base" }),
    );
}

/**
 * The letter or digit an entry files under.
 *
 * Digits all collapse into one "0–9" group rather than ten groups of their own: the
 * catalogue's numeric models run 001 to 9082 and splitting them by first digit would put
 * 306 and 3431 in the same group while separating 306 from 305.
 */
