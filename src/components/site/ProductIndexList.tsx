import Link from "next/link";
import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import { sortForDisplay } from "@/lib/product-finder";

interface ProductIndexListProps {
  products: Product[];
  /** Summary line, e.g. "All 67 mortise lock models". */
  label: string;
  locale?: Locale;
}

/**
 * A plain-text index of every model in a listing.
 *
 * The grids above it paginate in the client, so the built HTML carries only the first
 * 20 anchors — 181 of the 431 product pages had no server-rendered link anywhere on the
 * site. Answer engines (GPTBot, PerplexityBot, ClaudeBot) follow links and do not read
 * sitemaps, so those pages were invisible to them.
 *
 * `<details>` keeps the page visually unchanged while putting every anchor in the static
 * HTML: the element's content ships in the markup whether or not it is open, and it needs
 * no JavaScript to expand.
 */
export function ProductIndexList({ products, label, locale = "en" }: ProductIndexListProps) {
  const es = locale === "es";
  const base = es ? "/es" : "";
  if (!products.length) return null;
  const items = sortForDisplay(products);

  return (
    <details className="col-span-full mt-64 border-t border-line pt-24">
      <summary className="cursor-pointer text-c2 text-ink-secondary hover:text-brand">
        {label} — {es ? "índice completo de modelos" : "full model index"}
      </summary>
      {/*
        ── TAP SIZE ────────────────────────────────────────────────────────

        Measured on a 375px viewport: every one of these 435 links rendered 14px tall with
        8px between them. That is a third of the 44px minimum both Apple and WCAG 2.5.8
        give for a touch target, and with 8px of separation the neighbouring model is
        inside the same thumb.

        The fix is padding on the link rather than a taller row, so the whole strip is
        tappable and not just the text. `block` is what makes the padding count — an inline
        anchor's vertical padding does not affect the line box, which is exactly why the
        measured height stayed at the font's own 14px.

        Left at the compact size from `sm` up, where this is a mouse target in a
        three-column list and 44px of leading would turn an index into a scroll.
      */}
      <ul className="mt-24 grid grid-cols-1 gap-x-24 sm:grid-cols-2 sm:gap-y-8 xl:grid-cols-3">
        {items.map((product) => (
          <li key={product.slug}>
            <Link
              href={`${base}/products/${product.categoryPath[0]}/${product.slug}/`}
              className="block py-12 text-c2 text-ink-secondary hover:text-brand sm:py-0"
            >
              {product.modelTbc
                ? (es && product.nameEs) || product.name
                : `${product.model} — ${(es && product.nameEs) || product.name}`}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
