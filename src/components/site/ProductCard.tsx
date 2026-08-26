import Link from "next/link";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "./MediaPlaceholder";

interface ProductCardProps {
  product: Product;
  className?: string;
  /**
   * Pass on the cards in the first visible row so their photographs are fetched eagerly.
   * A 20-card grid is right to lazy-load; its first row is not — see MediaPlaceholder.
   */
  priority?: boolean;
}

/** Shared catalogue card for listings and related products. */
export function ProductCard({ product, className, priority }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.categoryPath[0]}/${product.slug}/`}
      className={cn(
        "hard-shadow-card group flex flex-col bg-surface",
        className,
      )}
    >
      <MediaPlaceholder {...product.heroImage} priority={priority} />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <p className="title-marker text-h3 text-ink">
          {product.name}
        </p>
        <p className="mt-8 text-c1 text-ink-secondary">
          {product.modelTbc ? "Reference available on request" : `Model ${product.model}`}
        </p>
        <p className="mt-24 border-t border-line pt-16 text-c2 text-ink-secondary">
          {product.material}
        </p>
      </div>
    </Link>
  );
}

