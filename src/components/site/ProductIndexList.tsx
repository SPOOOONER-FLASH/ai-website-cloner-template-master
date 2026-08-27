import Link from "next/link";
import type { Product } from "@/data/types";
import { sortForDisplay } from "@/lib/product-finder";

interface ProductIndexListProps {
  products: Product[];
  /** Summary line, e.g. "All 67 mortise lock models". */
  label: string;
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
export function ProductIndexList({ products, label }: ProductIndexListProps) {
  if (!products.length) return null;
  const items = sortForDisplay(products);

  return (
    <details className="col-span-full mt-64 border-t border-line pt-24">
      <summary className="cursor-pointer text-c2 text-ink-secondary hover:text-brand">
        {label} — full model index
      </summary>
      <ul className="mt-24 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <li key={product.slug}>
            <Link
              href={`/products/${product.categoryPath[0]}/${product.slug}/`}
              className="text-c2 text-ink-secondary hover:text-brand"
            >
              {product.modelTbc ? product.name : `${product.model} — ${product.name}`}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
