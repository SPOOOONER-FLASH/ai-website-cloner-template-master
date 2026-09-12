import type { FinderProduct } from "@/lib/product-finder";
import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import { localiseProductValues } from "@/lib/spanish-product";
import { cn } from "@/lib/utils";
import { CatalogueProductLink } from "./CatalogueNavigation";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { cardFigure } from "@/lib/card-figure";

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
  /*
    Two kinds of caller reach this card. Category and related-product surfaces render on
    the server and hand over the whole Product, so the figure is read straight from
    `specs`. The product finder is a client component fed FinderProduct, which carries a
    precomputed `figure` instead precisely so the spec arrays stay out of the bundle.
    Prefer the live specs when they are here; fall back to what the build worked out.
  */
  const figure = cardFigure(product as Partial<Product>, locale) ?? product.figure?.[locale];
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
      {/*
        The figure sits ON the photograph, the way the client's own Alibaba listings do
        it — but as text, not baked pixels. See src/lib/card-figure.ts for why that
        distinction is not cosmetic.

        Anchored to the bottom edge and only as tall as one line, because the product
        occupies the middle of every plate in this catalogue; a band across the centre
        would cover the thing the buyer came to look at. It is absent entirely when the
        catalogue states no figure — 276 of 636 published products — rather than filled
        with something weaker.
      */}
      <div className="relative">
        <MediaPlaceholder {...heroImage} priority={priority} />
        {figure ? (
          <p className="absolute inset-x-0 bottom-0 bg-surface/85 px-12 py-8 text-c2 tabular-nums text-ink backdrop-blur-[2px]">
            <span className="text-ink-secondary">{figure.label}</span> {figure.value}
          </p>
        ) : null}
      </div>
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

