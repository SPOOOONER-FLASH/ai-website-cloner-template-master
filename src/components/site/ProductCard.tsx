import type { FinderProduct } from "@/lib/product-finder";
import type { Locale } from "@/data/site";
import { localiseProductValues } from "@/lib/spanish-product";
import { cn } from "@/lib/utils";
import { CatalogueProductLink } from "./CatalogueNavigation";
import { MediaPlaceholder } from "./MediaPlaceholder";

interface ProductCardProps {
  /* The narrow shape, not the full record: this card reads a dozen fields and a full
     Product still satisfies it structurally, so server callers pass theirs unchanged. */
  product: FinderProduct;
  className?: string;
  /**
   * Pass on the cards in the first visible row so their photographs are fetched eagerly.
   * A 20-card grid is right to lazy-load; its first row is not — see MediaPlaceholder.
   */
  priority?: boolean;
  locale?: Locale;
}

/** Shared catalogue card for listings and related products. */
export function ProductCard({ product, className, priority, locale = "en" }: ProductCardProps) {
  const es = locale === "es";
  const href = `${es ? "/es" : ""}/products/${product.categoryPath[0]}/${product.slug}/`;
  const material = localiseProductValues([product.material].filter(Boolean), locale);
  const heroImage = {
    ...product.heroImage,
    label: es ? product.heroImage.labelEs ?? product.heroImage.label : product.heroImage.label,
  };
  return (
    <CatalogueProductLink
      href={href}
      className={cn(
        "hard-shadow-card group flex flex-col bg-surface",
        className,
      )}
    >
      <MediaPlaceholder {...heroImage} priority={priority} />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <p className="title-marker text-h3 text-ink">
          {(es && product.nameEs) || product.name}
        </p>
        <p className="mt-8 text-c1 text-ink-secondary">
          {product.modelTbc
            ? es
              ? "Referencia disponible a pedido"
              : "Reference available on request"
            : `${es ? "Modelo" : "Model"} ${product.model}`}
        </p>
        <p className="mt-24 border-t border-line pt-16 text-c2 text-ink-secondary">
          {material.join(" · ")}
        </p>
      </div>
    </CatalogueProductLink>
  );
}

