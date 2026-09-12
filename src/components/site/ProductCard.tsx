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
        {/*
          SAY THAT A DEMONSTRATION CLIP EXISTS, IN WORDS.

          292 products carry a clip and nothing on the card said so, so the catalogue's
          strongest asset was invisible until you had already chosen the page. The
          client's own Alibaba cards solve this with a play button over the photograph;
          this does it in text instead, and deliberately.

          A play glyph sits on top of the product — the one thing on the card a buyer is
          trying to read — and it promises playback that this card cannot deliver, since
          the clip is on the page behind it. A word in the meta line makes the same
          promise honestly, costs no pixels over the photograph, and is read by a screen
          reader in the order it matters. Restraint reads as confidence; see the
          "professional, not decorated" rule in AGENTS.md.
        */}
        <p className="mt-8 text-c1 text-ink-secondary">
          {product.modelTbc
            ? es
              ? "Referencia disponible a pedido"
              : "Reference available on request"
            : `${es ? "Modelo" : "Model"} ${product.model}`}
          {product.videos?.length ? (
            <span className="text-ink-tertiary"> · {es ? "Vídeo" : "Video"}</span>
          ) : null}
        </p>
        <p className="mt-24 border-t border-line pt-16 text-c2 text-ink-secondary">
          {material.join(" · ")}
        </p>
      </div>
    </CatalogueProductLink>
  );
}

