import Link from "next/link";
import type { Locale } from "@/data/site";
import collection from "@/data/generated/brazil-collection.json";
import { dict } from "@/lib/i18n";
import { ArrowLink } from "../ArrowLink";
import { MediaPlaceholder } from "../MediaPlaceholder";

/*
  The home page's door into the Brazil collection (client 2026-10-12: 「都加……对所有人展示」 — shown
  to every visitor, not only Brazilians). Same grammar as the Argentina module above it: heading,
  one paragraph, one link, four washed plates. No customer is named; the page says only that large
  Brazilian makers buy from us.
*/
type Pick = "double" | "single" | "touch" | "trim";
const picks: { key: Pick; id: string }[] = [
  { key: "double", id: "306-d-panic-exit-device" },
  { key: "single", id: "br5-s" },
  { key: "touch", id: "br3-st" },
  { key: "trim", id: "br5-tk" },
];

const copy = {
  en: {
    eyebrow: "Market focus · Brazil",
    title: "Panic bars for Brazil",
    body: "Leading Brazilian fire-door makers buy their panic bars from us: single and double doors, side latch or top-and-bottom rods, with or without an outside lever.",
    cta: "See the Brazil collection",
    model: "Model",
    names: {
      double: "Double-door panic bar",
      single: "Single-door panic bar",
      touch: "Touch bar",
      trim: "Outside lever with key",
    } satisfies Record<Pick, string>,
  },
  es: {
    eyebrow: "Mercado en foco · Brasil",
    title: "Barras antipánico para Brasil",
    body: "Grandes fabricantes brasileños de puertas cortafuego nos compran sus barras antipánico: puertas de una o dos hojas, cierre lateral o varillas verticales, con o sin manija exterior.",
    cta: "Ver la colección Brasil",
    model: "Modelo",
    names: {
      double: "Barra antipánico para puerta doble",
      single: "Barra antipánico para puerta simple",
      touch: "Barra táctil",
      trim: "Manija exterior con llave",
    } satisfies Record<Pick, string>,
  },
  pt: {
    eyebrow: "Mercado em foco · Brasil",
    title: "Barras antipânico para o Brasil",
    body: "Grandes fabricantes brasileiros de portas corta-fogo compram de nós as suas barras antipânico: uma ou duas folhas, trava lateral ou travamento vertical, com ou sem maçaneta externa.",
    cta: "Ver a coleção Brasil",
    model: "Modelo",
    names: {
      double: "Barra antipânico de duas folhas",
      single: "Barra antipânico de uma folha",
      touch: "Barra tipo touch",
      trim: "Maçaneta externa com chave",
    } satisfies Record<Pick, string>,
  },
} as const;

export function BrazilHomeShowcase({ locale = "en" }: { locale?: Locale }) {
  const text = dict(copy, locale);
  /* The collection exists in English and Portuguese only (PARTIAL_ROUTES). */
  const href = locale === "pt" ? "/pt/products/brazil/" : "/products/brazil/";
  const tiles = picks
    .map(({ key, id }) => ({ key, item: collection.find((entry) => entry.id === id) }))
    .filter((tile): tile is { key: Pick; item: (typeof collection)[number] } => tile.item !== undefined);

  return (
    <section className="layout mt-96 lg:mt-136" aria-label={text.title} data-content-module="brazil-collection-home">
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full xl:col-span-10">
          <p className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">{text.eyebrow}</p>
          <h2 className="mt-8 text-h1 text-ink">{text.title}</h2>
        </div>
        <div className="col-span-full xl:col-span-8 xl:col-start-17">
          <p className="text-c1 text-ink">{text.body}</p>
          <ArrowLink href={href} className="mt-24">{text.cta}</ArrowLink>
        </div>

        {/* Two by two on a phone, four across from xl, like the Argentina rows above. */}
        <div className="col-span-full mt-16 grid grid-cols-2 gap-16 xl:grid-cols-4 xl:gap-24">
          {tiles.map(({ key, item }) => {
            const name = text.names[key];
            return (
              <Link
                key={item.id}
                href={href}
                aria-label={`${name}, ${text.model} ${item.model}`}
                className="group relative block overflow-hidden border border-ink bg-surface"
              >
                <MediaPlaceholder
                  src={item.image}
                  label={`HYDE ${item.model} ${name}`}
                  ratio="1 / 1"
                  sizes="(min-width: 1440px) 330px, (min-width: 1280px) 24vw, 48vw"
                  className="object-contain"
                />
                {/* The wash lifts only to 85%: a dark housing behind the label must keep it at 4.5:1. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-surface/60 transition-opacity duration-[var(--motion-medium)] ease-[var(--motion-ease)] group-hover:opacity-85 group-focus-visible:opacity-85"
                />
                <span aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-16 text-center">
                  <span className="text-balance text-c1 font-semibold leading-tight text-ink">{name}</span>
                  <span className="text-c2 font-semibold uppercase tracking-[0.12em] text-ink">{item.model}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
