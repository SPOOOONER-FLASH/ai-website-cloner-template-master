"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLink } from "../ArrowLink";
import { MediaPlaceholder } from "../MediaPlaceholder";
import { StoryFilm } from "../StoryFilm";
import { COLOUR_HEX, FAMILIES, functionLine, itemName, items, t, type BrazilItem, type Family, type Lang } from "./brazil-data";

/*
  Proposal A — the catalogue (after fsbna.com/products/collections): one field of identical
  white plates, the model at the top, the part in the middle, what it does and the colours it
  comes in at the foot. Two editorial plates break the grid where FSB puts its archive
  stories: the factory film, and the one fact only the mould owner can state.
*/
const copy = {
  en: {
    lead: (n: number) =>
      `${n} panic bars, outside levers and parts, made in our own moulds for nine Brazilian brands. Choose by door, or read the whole range by model number.`,
    all: "All",
    byDoor: "By door",
    byModel: "By model number",
    filmTitle: "Made in our own moulds",
    filmLine: "Factory footage of the bars on this page. Not a render.",
    oemTitle: "Nine brands in Brazil. One factory behind them.",
    oemBody: "Every model here is already sold in Brazil under a customer's name. Your brand can go on the bar and the housing the same way.",
    filmLabel: "A single-door panic bar from the latch housing along the bar, then the housing and vertical rod of a double-door bar.",
    film: { play: "Play film", pause: "Pause film" },
  },
  pt: {
    lead: (n: number) =>
      `${n} barras antipânico, maçanetas externas e peças, fabricadas em moldes próprios para nove marcas brasileiras. Escolha pela porta ou veja a linha completa por modelo.`,
    all: "Todas",
    byDoor: "Por porta",
    byModel: "Por modelo",
    filmTitle: "Feitas nos nossos moldes",
    filmLine: "Imagens de fábrica das barras desta página. Não é renderização.",
    oemTitle: "Nove marcas no Brasil. Uma fábrica por trás.",
    oemBody: "Cada modelo daqui já é vendido no Brasil com a marca de um cliente. A sua marca pode ir na barra e na caixa do mesmo jeito.",
    filmLabel: "Barra antipânico de uma folha, da caixa do trinco ao longo da barra; depois a caixa e a haste vertical de uma barra de duas folhas.",
    film: { play: "Reproduzir", pause: "Pausar" },
  },
} as const;

function Swatches({ item, lang }: { item: BrazilItem; lang: Lang }) {
  return (
    <ul className="flex gap-4" aria-label={item.colours.map((c) => t[lang].colours[c]).join(", ")}>
      {item.colours.map((c) => (
        <li key={c} className="size-12 border border-line" style={{ background: COLOUR_HEX[c] }} title={t[lang].colours[c]} />
      ))}
    </ul>
  );
}

function Plate({ item, lang, priority }: { item: BrazilItem; lang: Lang; priority: boolean }) {
  const body = (
    <>
      <p className="text-c1 text-ink">{item.model}</p>
      <MediaPlaceholder
        src={item.image}
        ratio="1 / 1"
        label={`HYDE ${item.model} ${itemName(item, lang)}`}
        sizes="(min-width: 1280px) 22vw, 46vw"
        className="object-contain p-16 mix-blend-multiply transition-transform duration-[var(--motion-medium)] ease-[var(--motion-ease)] group-hover:scale-[1.03]"
        priority={priority}
      />
      <div className="mt-auto flex items-end justify-between gap-12">
        <p className="text-c2 text-ink-secondary">{functionLine(item, lang)}</p>
        <Swatches item={item} lang={lang} />
      </div>
    </>
  );
  const cls = "group flex h-full flex-col gap-12 bg-surface p-16 outline-offset-[-1px] hover:outline hover:outline-1 hover:outline-ink lg:p-24";
  return item.href ? (
    <a href={item.href} className={cls}>{body}</a>
  ) : (
    <article className={cls}>{body}</article>
  );
}

export function BrazilCollectionA({ lang = "en" }: { lang?: Lang }) {
  const c = copy[lang];
  const base = t[lang];
  const [family, setFamily] = useState<Family | "all">("all");
  const [order, setOrder] = useState<"door" | "model">("door");

  const shown = useMemo(() => {
    const list = items.filter((i) => family === "all" || i.family === family);
    if (order === "model") return [...list].sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));
    return [...list].sort((a, b) => FAMILIES.indexOf(a.family) - FAMILIES.indexOf(b.family));
  }, [family, order]);

  const plates = shown.map((item, i) => (
    <li key={item.id}>
      <Plate item={item} lang={lang} priority={i < 4} />
    </li>
  ));
  /* The film plate takes two columns and two rows after the first row; the fact plate after the third. */
  if (family === "all") {
    plates.splice(
      Math.min(4, plates.length),
      0,
      <li key="film" className="col-span-2 row-span-2 flex min-h-[320px] flex-col bg-surface">
        <div className="relative flex-1">
          <div className="absolute inset-0">
            <StoryFilm fill src="/videos/stories/brazil-panic-bar.mp4" poster="/images/stories/brazil/film-poster.webp" width={1280} height={576} label={c.filmLabel} buttonLabels={c.film} />
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-12 p-24 lg:px-32">
          <h2 className="text-h3 font-semibold text-ink">{c.filmTitle}</h2>
          <p className="text-c2 text-ink-secondary">{c.filmLine}</p>
        </div>
      </li>,
    );
    plates.splice(
      Math.min(12, plates.length),
      0,
      <li key="oem" className="col-span-2 flex flex-col justify-between gap-32 bg-surface-dark p-24 text-surface lg:p-40">
        <h2 className="text-balance text-h2 font-semibold">{c.oemTitle}</h2>
        <p className="max-w-[46ch] text-c1 text-surface/80">{c.oemBody}</p>
      </li>,
    );
  }

  return (
    <section aria-label={base.title} data-content-module="brazil-collection-a">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <h1 className="col-span-full text-balance text-d1 font-semibold leading-none text-ink xl:col-span-12">{base.title}</h1>
          <div className="col-span-full xl:col-span-9 xl:col-start-16 xl:self-end">
            <p className="text-c1 text-ink">{c.lead(items.length)}</p>
            <ArrowLink href={base.contactHref} className="mt-24">{base.contact}</ArrowLink>
          </div>
        </div>
      </div>

      <div className="layout sticky top-0 z-10 mt-64 border-y border-line bg-surface/95 backdrop-blur-[2px]">
        <div className="col-content flex flex-wrap items-center justify-between gap-x-32 gap-y-12 py-12">
          <div role="group" aria-label={c.byDoor} className="flex flex-wrap gap-x-24 gap-y-8">
            {(["all", ...FAMILIES] as const).map((f) => {
              const n = f === "all" ? items.length : items.filter((i) => i.family === f).length;
              if (!n) return null;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={family === f}
                  onClick={() => setFamily(f)}
                  className={cn("py-4 text-c2 text-ink-secondary hover:text-ink", family === f && "text-ink underline decoration-1 underline-offset-[6px]")}
                >
                  {f === "all" ? c.all : base.families[f]} <span className="tabular-nums">{n}</span>
                </button>
              );
            })}
          </div>
          <div role="group" aria-label={c.byModel} className="flex border border-line">
            {(["door", "model"] as const).map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={order === o}
                onClick={() => setOrder(o)}
                className={cn("px-12 py-4 text-c2", order === o ? "bg-ink text-surface" : "text-ink-secondary hover:text-ink")}
              >
                {o === "door" ? c.byDoor : c.byModel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface-alt py-32 lg:py-48">
        <div className="layout">
          <ul className="col-content grid w-full grid-flow-dense grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-16">{plates}</ul>
        </div>
      </div>
    </section>
  );
}
