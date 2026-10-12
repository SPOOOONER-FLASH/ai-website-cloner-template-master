import type { Locale } from "@/data/site";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/data/types";
import { getProductByModel } from "@/data/products";
import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { dict, t } from "@/lib/i18n";
import argentinaCollection from "@/data/generated/argentina-collection.json";

const ar4Models = ["AR4-110", "AR4-140", "AR4-111", "AR4-1121"] as const;
type LocalizedProduct = Product & { nameEs?: string; namePt?: string };
type CollectionItem = (typeof argentinaCollection)[number];

/*
  The home page's AR-5 row (client 2026-10-12: 「四个框上面加多一栏给 ar-5 … 不要浪费这个位置了」):
  one model from each AR-5 group, so the row shows the range rather than four mortise bodies
  that look like the AR-4 row under it. AR-5 models have no product page of their own; each
  tile opens its card on the Argentina collection page.
*/
const ar5Picks = ["ar5-2000", "ar5-120", "ar5-113", "ar5-corrediza-123"] as const;
type Ar5Pick = (typeof ar5Picks)[number];

const copy = {
  en: {
    eyebrow: "Seasonal market focus · Argentina",
    title: "HYDE Argentina AR-4",
    body: "Four compact mortise lock bodies selected for Argentina-market distributors, private-label programs and OEM inquiries.",
    cta: "Explore the AR-4 collection",
    model: "Model",
    aria: "HYDE Argentina AR-4 market collection",
    homeTitle: "HYDE Argentina Collection",
    homeBody: "Mortise locks, deadlocks and sliding-door locks made on HYDE molds for Argentine distributors: the AR-5 range and the AR-4 selection.",
    homeCta: "Explore the Argentina collection",
    ar5: {
      "ar5-2000": "Mortise lock",
      "ar5-120": "Narrow-stile lock",
      "ar5-113": "Deadlock",
      "ar5-corrediza-123": "Sliding-door lock",
    } satisfies Record<Ar5Pick, string>,
  },
  es: {
    eyebrow: "Mercado de temporada · Argentina",
    title: "HYDE Argentina AR-4",
    body: "Cuatro cerraduras de embutir compactas para distribuidores del mercado argentino, marcas privadas y consultas OEM.",
    cta: "Explorar la colección AR-4",
    model: "Modelo",
    aria: "Colección HYDE Argentina AR-4",
    homeTitle: "Colección HYDE Argentina",
    homeBody: "Cerraduras de embutir, cerrojos y cerraduras para puertas corredizas fabricadas con matrices HYDE para distribuidores argentinos: la línea AR-5 y la selección AR-4.",
    homeCta: "Explorar la colección Argentina",
    ar5: {
      "ar5-2000": "Cerradura de embutir",
      "ar5-120": "Cerradura para batientes angostos",
      "ar5-113": "Cerrojo",
      "ar5-corrediza-123": "Cerradura para puerta corrediza",
    } satisfies Record<Ar5Pick, string>,
  },
  pt: {
    eyebrow: "Mercado sazonal · Argentina",
    title: "HYDE Argentina AR-4",
    body: "Quatro caixas de fechadura de embutir compactas para distribuidores do mercado argentino, marca própria e consultas OEM.",
    cta: "Ver a coleção AR-4",
    model: "Modelo",
    aria: "Coleção HYDE Argentina AR-4",
    homeTitle: "Coleção HYDE Argentina",
    homeBody: "Fechaduras de embutir, ferrolhos e fechaduras para portas de correr feitas em moldes HYDE para distribuidores argentinos: a linha AR-5 e a seleção AR-4.",
    homeCta: "Ver a coleção Argentina",
    ar5: {
      "ar5-2000": "Fechadura de embutir",
      "ar5-120": "Fechadura para perfis estreitos",
      "ar5-113": "Ferrolho",
      "ar5-corrediza-123": "Fechadura para porta de correr",
    } satisfies Record<Ar5Pick, string>,
  },
} as const;

function ar4Products(): Product[] {
  return ar4Models
    .map((model) => getProductByModel(model))
    .filter((product): product is Product => product !== undefined);
}

/*
  One tile per family, after Elabora's Piccolo page (client 2026-10-09: 「去别人网站看看怎么
  设计交互展示的……把这换掉」): the photograph washed pale with the family's name over it, and
  the wash lifting on hover or keyboard focus so the real part shows through. Interaction only —
  every image is our own; Elabora's photographs are theirs and are never used.

  The wash stops at 40%, not 0: Elabora clears it completely and its titles become hard to
  read over the bare photograph. 40% is the lowest that keeps the dark text at 4.5:1 over
  AR4-111's lock body (20% measured 3.57:1 at the 5th percentile, 2026-10-10).
*/
function Ar4Tile({ product, locale }: { product: Product; locale: Locale }) {
  /* English, never Spanish, for a locale with no name of its own yet. */
  const name = t(product as LocalizedProduct, "name", locale) ?? product.name;

  return (
    <Link
      href={`${locale === "en" ? "" : `/${locale}`}/products/${product.categoryPath[0]}/${product.slug}/`}
      aria-label={`${name}, ${dict(copy, locale).model} ${product.model}`}
      className="group relative block overflow-hidden border border-ink bg-surface"
    >
      <MediaPlaceholder
        {...product.heroImage}
        label={`HYDE ${product.model} ${name}`}
        ratio="1 / 1"
        sizes="(min-width: 1440px) 330px, (min-width: 1280px) 24vw, 48vw"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-surface/60 transition-opacity duration-[var(--motion-medium)] ease-[var(--motion-ease)] group-hover:opacity-40 group-focus-visible:opacity-40"
      />
      <span aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-16 text-center">
        <span className="text-balance text-c1 font-semibold leading-tight text-ink">{name}</span>
        <span className="text-c2 font-semibold uppercase tracking-[0.12em] text-ink">{product.model}</span>
      </span>
    </Link>
  );
}

function Ar5Tile({ item, locale }: { item: CollectionItem; locale: Locale }) {
  const text = dict(copy, locale);
  const name = text.ar5[item.id as Ar5Pick];
  /* The collection exists in English and Spanish only (PARTIAL_ROUTES). */
  const page = locale === "es" ? "/es/products/argentina/" : "/products/argentina/";
  return (
    <Link
      href={`${page}#${item.id}`}
      aria-label={`${name}, ${text.model} ${item.model}`}
      className="group relative block overflow-hidden border border-ink bg-surface"
    >
      <MediaPlaceholder
        src={item.image}
        label={`HYDE ${item.model} ${name}`}
        ratio="1 / 1"
        sizes="(min-width: 1440px) 330px, (min-width: 1280px) 24vw, 48vw"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-surface/60 transition-opacity duration-[var(--motion-medium)] ease-[var(--motion-ease)] group-hover:opacity-40 group-focus-visible:opacity-40"
      />
      <span aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-16 text-center">
        <span className="text-balance text-c1 font-semibold leading-tight text-ink">{name}</span>
        <span className="text-c2 font-semibold uppercase tracking-[0.12em] text-ink">{item.model}</span>
      </span>
    </Link>
  );
}

function RowLabel({ series, children }: { series: string; children?: ReactNode }) {
  return (
    <div className="col-span-full mt-16 flex flex-wrap items-baseline justify-between gap-x-32 gap-y-8 border-b border-line pb-12">
      <h3 className="text-h3 font-semibold text-ink">{series}</h3>
      {children}
    </div>
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
  const text = dict(copy, locale);
  /* Argentina AR4 is a market collection built in English and Spanish only — it is the
     one documented exception in PORTUGUESE_MIRROR_PREFIXES — so Portuguese goes to the
     English page rather than to a /pt/ URL that does not exist. */
  const href = locale === "es" ? "/es/products/argentina-ar4/" : "/products/argentina-ar4/";
  const collectionHref = locale === "es" ? "/es/products/argentina/" : "/products/argentina/";
  const ar5Items = ar5Picks
    .map((id) => argentinaCollection.find((item) => item.id === id))
    .filter((item): item is CollectionItem => item !== undefined);
  const ar4Tiles = (
    /* Two by two on a phone — a square tile needs no scroll rail — four across from xl. */
    <div className="col-span-full mt-16 grid grid-cols-2 gap-16 xl:grid-cols-4 xl:gap-24">
      {products.map((product) => (
        <Ar4Tile key={product.model} product={product} locale={locale} />
      ))}
    </div>
  );

  /*
    The home page (client 2026-10-12: 「ar4 做到阿根廷集合那里去，四个框上面加多一栏给 ar-5」):
    the module is the Argentina collection now, and the place the Buenos Aires photograph held
    shows the AR-5 range instead. The AR-4 page itself (pageHeading) keeps its photograph.
  */
  if (!pageHeading) {
    return (
      <section className="layout" aria-label={text.homeTitle} data-content-module="argentina-ar4">
        <div className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full xl:col-span-10">
            <p className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">{text.eyebrow}</p>
            <h2 className="mt-8 text-h1 text-ink">{text.homeTitle}</h2>
          </div>
          <div className="col-span-full xl:col-span-8 xl:col-start-17">
            <p className="text-c1 text-ink">{text.homeBody}</p>
            <ArrowLink href={collectionHref} className="mt-24">{text.homeCta}</ArrowLink>
          </div>

          <RowLabel series="AR-5" />
          <div className="col-span-full grid grid-cols-2 gap-16 xl:grid-cols-4 xl:gap-24">
            {ar5Items.map((item) => (
              <Ar5Tile key={item.id} item={item} locale={locale} />
            ))}
          </div>

          <RowLabel series="AR-4">
            <ArrowLink href={href}>{text.cta}</ArrowLink>
          </RowLabel>
          {ar4Tiles}
        </div>
      </section>
    );
  }

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

        {ar4Tiles}

        {pageHeading ? (
          <div className="col-span-full mt-8 flex flex-wrap justify-end gap-x-32 gap-y-12">
            {/* The full Argentina collection exists in English and Spanish only (PARTIAL_ROUTES). */}
            <ArrowLink href={locale === "es" ? "/es/products/argentina/" : "/products/argentina/"}>
              {locale === "es"
                ? `Los ${argentinaCollection.length} modelos para Argentina`
                : `All ${argentinaCollection.length} Argentina models`}
            </ArrowLink>
            <ArrowLink href={`${locale === "en" ? "" : `/${locale}`}/contact/`}>
              {locale === "es" ? "Consultar la colección" : "Discuss the collection"}
            </ArrowLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
