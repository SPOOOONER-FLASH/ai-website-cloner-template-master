import Link from "next/link";
import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";

/**
 * A side-by-side spec table for one category.
 *
 * WHY IT EXISTS. Search Console shows `door stopper ds013 vs ds011` — six impressions,
 * average position 5.5, zero clicks. We publish both products and had no page that put
 * them next to each other, so there was nothing for the result to satisfy. A buyer
 * choosing inside a range is comparing, and every product page we had asked them to hold
 * the other model in their head.
 *
 * WHERE IT RENDERS. Twice: inside the category page, and as the body of the standalone
 * /compare/<category>/ page. It shipped category-only first, because 447 of our pages
 * are still "discovered, not indexed" and minting URLs against a crawl queue that is
 * already backed up can make things worse rather than better. The client decided to
 * publish the standalone pages too — a comparison query wants a page titled like a
 * comparison — so the scope was held to one page per category rather than one per pair.
 * The category page links out; the compare page does not link to itself.
 *
 * WHAT IT SHOWS. The columns are chosen from the data, not fixed: the labels most of
 * this category actually carries, so lock cases compare on backset and centre distance
 * while door viewers compare on viewing angle and door thickness. A cell with no value
 * is left visibly empty — an em dash is honest, and it also shows the client exactly
 * which record needs filling.
 */

/** How many models are worth a table. Two is a sentence; twenty-five is a spreadsheet. */
const MIN_ROWS = 3;
const MAX_ROWS = 24;
/** Labels every product has are useless for telling them apart. */
const MAX_COLUMNS = 5;

const COPY = {
  en: {
    heading: "Compare models in this range",
    intro:
      "The specifications that differ between models, side by side. An empty cell means we have not published that figure for that model yet.",
    model: "Model",
    more: (n: number) => `Showing the first ${MAX_ROWS} of ${n} models — open a product for its full table.`,
    openCompare: "Open the full comparison page",
  },
  es: {
    heading: "Comparar modelos de esta gama",
    intro:
      "Las especificaciones que distinguen un modelo de otro, en paralelo. Una celda vacía significa que aún no publicamos ese dato para ese modelo.",
    model: "Modelo",
    more: (n: number) => `Se muestran los primeros ${MAX_ROWS} de ${n} modelos — abra un producto para su tabla completa.`,
    openCompare: "Abrir la página de comparación",
  },
} as const;

/** Labels that describe the whole category rather than distinguishing inside it. */
const NEVER_COMPARE = new Set(["Application", "Product Type", "Type"]);

export function SpecMatrix({
  products,
  categorySlug,
  locale = "en",
  showCompareLink = false,
}: {
  products: Product[];
  categorySlug: string;
  locale?: Locale;
  /** Category pages link out to the standalone /compare/ page; that page does not. */
  showCompareLink?: boolean;
}) {
  if (products.length < MIN_ROWS) return null;
  const t = COPY[locale];
  const es = locale === "es";

  /*
    Pick the columns from the data.

    A label carried by every single product tells the reader nothing — if all 45 lock
    cases are iron, "Material" is a category fact, not a comparison. A label carried by
    one product is noise. What is useful sits in between, so the candidates are ranked by
    coverage and then filtered to those that actually vary.
  */
  const counts = new Map<string, number>();
  const values = new Map<string, Set<string>>();
  for (const product of products) {
    for (const row of product.specs ?? []) {
      counts.set(row.label, (counts.get(row.label) ?? 0) + 1);
      if (!values.has(row.label)) values.set(row.label, new Set());
      values.get(row.label)!.add(row.value);
    }
  }

  const columns = [...counts.entries()]
    .filter(([label, n]) => {
      if (NEVER_COMPARE.has(label)) return false;
      if (n < Math.max(MIN_ROWS, products.length * 0.3)) return false;
      // At least two distinct values, or the column is a constant.
      return (values.get(label)?.size ?? 0) > 1;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_COLUMNS)
    .map(([label]) => label);

  if (!columns.length) return null;

  /* Rows: the models that actually fill at least half the chosen columns. */
  const rows = products
    .map((product) => {
      const cells = columns.map((label) => {
        /*
          Columns are chosen on the English labels because that is where coverage is
          complete. `specsEs` is written by scripts/translate-products-es.mjs as a
          positional mirror of `specs`, so the Spanish value for a column is the entry at
          the same index — looking it up by translated label would fail on every row the
          glossary has not reached.
        */
        const index = (product.specs ?? []).findIndex((r) => r.label === label);
        if (index < 0) return null;
        return (es ? product.specsEs?.[index]?.value : product.specs?.[index]?.value) ?? null;
      });
      return { product, cells, filled: cells.filter(Boolean).length };
    })
    .filter((r) => r.filled >= Math.ceil(columns.length / 2))
    .sort((a, b) => b.filled - a.filled);

  if (rows.length < MIN_ROWS) return null;

  const shown = rows.slice(0, MAX_ROWS);
  const href = (slug: string) => (es ? `/es/products/${categorySlug}/${slug}/` : `/products/${categorySlug}/${slug}/`);

  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="compare-heading">
      <div className="col-content">
        <h2 id="compare-heading" className="text-h2 text-ink">
          {t.heading}
        </h2>
        <p className="mt-16 max-w-[68ch] text-c1 text-ink-secondary">{t.intro}</p>

        {/* The table is wider than a phone; it scrolls in its own box, never the page. */}
        <div className="mt-32 overflow-x-auto">
          <table className="w-full min-w-[64rem] border-collapse text-c1">
            <thead>
              <tr className="border-y border-line">
                <th scope="col" className="py-12 pr-16 text-left font-regular text-ink-secondary">
                  {t.model}
                </th>
                {columns.map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="py-12 pr-16 text-left font-regular text-ink-secondary"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map(({ product, cells }) => (
                <tr key={product.slug} className="border-b border-line">
                  <th scope="row" className="py-12 pr-16 text-left font-regular">
                    <Link
                      href={href(product.slug)}
                      className="short-marker short-marker-compact text-ink hover:text-brand-hover"
                    >
                      {product.modelTbc ? product.name : product.model}
                    </Link>
                  </th>
                  {cells.map((cell, i) => (
                    <td
                      key={columns[i]}
                      className="py-12 pr-16 tabular-nums text-ink"
                    >
                      {cell ?? <span className="text-ink-tertiary">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length > MAX_ROWS ? (
          <p className="mt-16 text-c2 text-ink-secondary">{t.more(rows.length)}</p>
        ) : null}

        {/*
          Both locales now. The `!es` guard was correct while /es/compare/ did not exist —
          it kept a Spanish category page from linking into a 404. The Spanish mirror
          shipped 2026-09-03, so the guard would now be hiding a real page from exactly
          the readers it was written for.
        */}
        {showCompareLink ? (
          <Link
            href={es ? `/es/compare/${categorySlug}/` : `/compare/${categorySlug}/`}
            className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
          >
            {t.openCompare}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
