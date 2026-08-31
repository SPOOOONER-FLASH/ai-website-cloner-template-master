import Link from "next/link";
import type { Product } from "@/data/types";
import { getProductByModel } from "@/data/products";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";

const ar4Models = ["AR4-110", "AR4-140", "AR4-101", "AR4-1121"] as const;

type Locale = "en" | "es";
type LocalizedProduct = Product & { nameEs?: string };

const copy = {
  en: {
    eyebrow: "Seasonal market focus · Argentina",
    title: "HYDE Argentina AR-4",
    body: "Four compact mortise lock bodies selected for Argentina-market distributors, private-label programmes and OEM enquiries.",
    cta: "Explore the AR-4 collection",
    model: "Model",
    material: "Nickel-plated iron lock case",
    aria: "HYDE Argentina AR-4 market collection",
  },
  es: {
    eyebrow: "Mercado de temporada · Argentina",
    title: "HYDE Argentina AR-4",
    body: "Cuatro cerraduras de embutir compactas para distribuidores del mercado argentino, marcas privadas y consultas OEM.",
    cta: "Explorar la colección AR-4",
    model: "Modelo",
    material: "Caja de hierro niquelado",
    aria: "Colección HYDE Argentina AR-4",
  },
} as const;

function ar4Products(): Product[] {
  return ar4Models
    .map((model) => getProductByModel(model))
    .filter((product): product is Product => product !== undefined);
}

function Ar4ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const localized = product as LocalizedProduct;
  const name = locale === "es" ? localized.nameEs ?? product.name : product.name;

  return (
    <Link
      href={`${locale === "es" ? "/es" : ""}/products/${product.categoryPath[0]}/${product.slug}/`}
      className="hard-shadow-card group flex flex-col bg-surface"
    >
      <MediaPlaceholder
        {...product.heroImage}
        sizes="(min-width: 1440px) 320px, (min-width: 744px) 48vw, 100vw"
      />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <p className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">
          {copy[locale].model} {product.model}
        </p>
        <h3 className="title-marker mt-8 text-h3 text-ink">{name}</h3>
        <p className="mt-auto border-t border-line pt-16 text-c2 text-ink-secondary">
          {copy[locale].material}
        </p>
      </div>
    </Link>
  );
}

export function ArgentinaAr4Showcase({
  locale = "en",
  pageHeading = false,
}: {
  locale?: Locale;
  pageHeading?: boolean;
}) {
  const products = ar4Products();
  const text = copy[locale];
  const href = locale === "es" ? "/es/products/argentina-ar4/" : "/products/argentina-ar4/";

  return (
    <section
      className="layout"
      aria-label={text.aria}
      data-content-module="argentina-ar4"
    >
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full xl:col-span-10">
          <p className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">{text.eyebrow}</p>
          {pageHeading ? (
            <h1 className="mt-8 text-h1 text-ink">{text.title}</h1>
          ) : (
            <h2 className="mt-8 text-h1 text-ink">{text.title}</h2>
          )}
        </div>

        <div className="col-span-full xl:col-span-8 xl:col-start-17">
          <p className="text-c1 text-ink">{text.body}</p>
          {!pageHeading ? (
            <ArrowLink href={href} className="mt-24">
              {text.cta}
            </ArrowLink>
          ) : null}
        </div>

        <div className="home-editorial-surface col-span-full mt-16">
          <div className="home-editorial-media">
            <MediaPlaceholder
              src="/images/editorial/argentina-ar4-entry.webp"
              ratio="1672 / 941"
              label={
                locale === "es"
                  ? "Umbral arquitectónico contemporáneo en Buenos Aires"
                  : "Contemporary architectural threshold in Buenos Aires"
              }
              sizes="(min-width: 1440px) 1376px, 100vw"
              priority={pageHeading}
            />
          </div>
        </div>

        <div
          className={cn(
            "col-span-full mt-16 grid grid-cols-1 gap-24 sm:grid-cols-2 xl:grid-cols-4",
            products.length < ar4Models.length && "border border-line p-24",
          )}
        >
          {products.map((product) => (
            <Ar4ProductCard key={product.model} product={product} locale={locale} />
          ))}
        </div>

        {pageHeading ? (
          <div className="col-span-full mt-8 flex justify-end">
            <ArrowLink href={locale === "es" ? "/es/contact/" : "/contact/"}>
              {locale === "es" ? "Consultar la colección" : "Discuss the collection"}
            </ArrowLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
