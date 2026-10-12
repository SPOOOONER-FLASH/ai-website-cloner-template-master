"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLink } from "../ArrowLink";
import { MediaPlaceholder } from "../MediaPlaceholder";
import { StoryFilm } from "../StoryFilm";
import { DoorDiagram, type DoorConfig } from "./DoorDiagram";
import { COLOUR_HEX, FAMILIES, functionLine, itemName, items, t, type BrazilItem, type Colour, type Lang, type Outside } from "./brazil-data";

/*
  The Brazil panic-bar collection (client 2026-10-12): proposal A's photo plates as the body,
  the door elevations as the selector, and proposal C's schedule as the second view —
  「结合 a 的多图视觉和 c 的选型器」. No customer and no count of customers is named: they are
  HYDE's downstream brands (「他们是我们的下游 所以不要泄密」); the page says only that large
  Brazilian makers buy from us.
*/
type DoorKey = "single-lateral" | "single-vertical" | "double" | "outside";

const DOORS: { key: DoorKey; config: DoorConfig; match: (i: BrazilItem) => boolean }[] = [
  { key: "single-lateral", config: { door: "single", locking: "lateral", trim: false }, match: (i) => i.family === "single" && i.locking !== "vertical" },
  { key: "single-vertical", config: { door: "single", locking: "vertical", trim: false }, match: (i) => i.family === "single" && i.locking === "vertical" },
  { key: "double", config: { door: "double", locking: "vertical", trim: false }, match: (i) => i.family === "double" },
  { key: "outside", config: { door: "single", locking: "lateral", trim: true }, match: (i) => i.family === "trim" || i.outside !== "none" },
];

const copy = {
  en: {
    lead: (n: number) =>
      `Leading Brazilian fire-door makers buy their panic bars from us. ${n} models from our own molds: one or two leaves, side latch or top-and-bottom rods, with or without an outside lever, in the colors the market asks for.`,
    chooseDoor: "Choose by door",
    doors: {
      "single-lateral": "Single door, side latch",
      "single-vertical": "Single door, top and bottom rods",
      double: "Double door",
      outside: "Opening from outside",
    } satisfies Record<DoorKey, string>,
    outsideLabel: "Outside access",
    colourLabel: "Color",
    any: "Any",
    showAll: "Show all",
    views: { photos: "Photos", table: "Table" },
    result: (n: number) => (n === 1 ? "1 model" : `${n} models`),
    filmTitle: "Made in our own molds",
    filmLine: "Factory footage. Not a render.",
    filmLabel: "A single-door panic bar from the latch housing along the bar, then the housing and vertical rod of a double-door bar.",
    film: { play: "Play film", pause: "Pause film" },
    oemTitle: "The factory behind the bar",
    oemBody: "Many of the panic bars sold in Brazil leave our factory under another name. Yours can carry your brand the same way, on the housing and on the bar.",
    none: "No catalog model fits this door yet. We cut new molds to a customer's sample or drawing: send us yours.",
    cols: { model: "Model", what: "Door and locking", outside: "Outside", colours: "Colors" },
    closing: "Send us the door, the quantity and the color. We answer with the model and a quotation.",
  },
  pt: {
    lead: (n: number) =>
      `Grandes fabricantes brasileiros de portas corta-fogo compram de nós as suas barras antipânico. ${n} modelos de moldes próprios: uma ou duas folhas, trava lateral ou travamento vertical, com ou sem maçaneta externa, nas cores que o mercado pede.`,
    chooseDoor: "Escolha pela porta",
    doors: {
      "single-lateral": "Uma folha, trava lateral",
      "single-vertical": "Uma folha, travamento vertical",
      double: "Duas folhas",
      outside: "Abertura pelo lado de fora",
    } satisfies Record<DoorKey, string>,
    outsideLabel: "Acesso externo",
    colourLabel: "Cor",
    any: "Qualquer",
    showAll: "Ver todas",
    views: { photos: "Fotos", table: "Tabela" },
    result: (n: number) => (n === 1 ? "1 modelo" : `${n} modelos`),
    filmTitle: "Feitas nos nossos moldes",
    filmLine: "Imagens de fábrica. Não é renderização.",
    filmLabel: "Barra antipânico de uma folha, da caixa do trinco ao longo da barra; depois a caixa e a haste vertical de uma barra de duas folhas.",
    film: { play: "Reproduzir", pause: "Pausar" },
    oemTitle: "A fábrica por trás da barra",
    oemBody: "Muitas das barras antipânico vendidas no Brasil saem da nossa fábrica com outro nome. A sua pode levar a sua marca do mesmo jeito, na caixa e na barra.",
    none: "Nenhum modelo do catálogo serve nesta porta ainda. Fazemos molde novo a partir da amostra ou do desenho do cliente: envie o seu.",
    cols: { model: "Modelo", what: "Porta e travamento", outside: "Lado de fora", colours: "Cores" },
    closing: "Envie a porta, a quantidade e a cor. Respondemos com o modelo e a cotação.",
  },
} as const;

function Swatches({ item, lang }: { item: BrazilItem; lang: Lang }) {
  if (!item.colours.length) return null;
  return (
    <ul className="flex shrink-0 gap-4" aria-label={item.colours.map((c) => t[lang].colours[c]).join(", ")}>
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
        className="object-contain mix-blend-multiply transition-transform duration-[var(--motion-medium)] ease-[var(--motion-ease)] group-hover:scale-[1.03]"
        priority={priority}
      />
      <div className="mt-auto flex items-end justify-between gap-12">
        <p className="text-c2 text-ink-secondary">{functionLine(item, lang)}</p>
        <Swatches item={item} lang={lang} />
      </div>
    </>
  );
  const cls = "group flex h-full flex-col gap-12 bg-surface p-16 outline-offset-[-1px] hover:outline hover:outline-1 hover:outline-ink focus-visible:outline-2 lg:p-24";
  return item.href ? <a href={item.href} className={cls}>{body}</a> : <article className={cls}>{body}</article>;
}

function Schedule({ shown, lang }: { shown: BrazilItem[]; lang: Lang }) {
  const c = copy[lang];
  const base = t[lang];
  return (
    <div className="bg-surface px-16 py-8 lg:px-32">
      {FAMILIES.map((family) => {
        const rows = shown.filter((i) => i.family === family);
        if (!rows.length) return null;
        return (
          <section key={family} aria-label={base.families[family]} className="mt-24 first:mt-8">
            <h3 className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">
              {base.families[family]} <span className="tabular-nums">{rows.length}</span>
            </h3>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-c2">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">{c.cols.model}</th>
                    <th scope="col">{c.cols.what}</th>
                    <th scope="col">{c.cols.outside}</th>
                    <th scope="col">{c.cols.colours}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-t border-line align-middle">
                      <th scope="row" className="w-[44%] py-12 pr-24 font-normal">
                        <span className="flex items-center gap-16">
                          <MediaPlaceholder src={item.image} ratio="1 / 1" label={`HYDE ${item.model} ${itemName(item, lang)}`} sizes="72px" className="size-72 shrink-0 object-contain mix-blend-multiply" />
                          <span>
                            <span className="block font-semibold text-ink">{item.model}</span>
                            <span className="block text-ink-secondary">{itemName(item, lang)}</span>
                          </span>
                        </span>
                      </th>
                      <td className="py-12 pr-24 text-ink">{item.family === "trim" ? base.familyOne.trim : functionLine(item, lang)}</td>
                      <td className="py-12 pr-24 text-ink">{base.outside[item.outside]}</td>
                      <td className="py-12"><Swatches item={item} lang={lang} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function BrazilCollection({ lang = "en" }: { lang?: Lang }) {
  const c = copy[lang];
  const base = t[lang];
  const [door, setDoor] = useState<DoorKey | null>(null);
  const [outside, setOutside] = useState<Outside | "any">("any");
  const [colour, setColour] = useState<Colour | "any">("any");
  const [view, setView] = useState<"photos" | "table">("photos");

  const doorItems = useMemo(() => (door ? items.filter(DOORS.find((d) => d.key === door)!.match) : items), [door]);
  const shown = doorItems.filter((i) => (outside === "any" || i.outside === outside) && (colour === "any" || i.colours.includes(colour)));
  const outsideOptions = (["none", "lever", "lever-key"] as const).filter((o) => doorItems.some((i) => i.outside === o));
  const colourOptions = (Object.keys(COLOUR_HEX) as Colour[]).filter((col) => doorItems.some((i) => i.colours.includes(col)));
  const filtered = door !== null || outside !== "any" || colour !== "any";
  const reset = () => { setDoor(null); setOutside("any"); setColour("any"); };

  const chip = (active: boolean) =>
    cn("border px-12 py-8 text-c2 transition-colors", active ? "border-ink bg-ink text-surface" : "border-line bg-surface text-ink hover:border-ink");

  const plates = shown.map((item, i) => (
    <li key={item.id}>
      <Plate item={item} lang={lang} priority={i < 4} />
    </li>
  ));
  if (!filtered) {
    plates.splice(Math.min(4, plates.length), 0,
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
    plates.splice(Math.min(14, plates.length), 0,
      <li key="oem" className="col-span-2 flex flex-col justify-between gap-32 bg-surface-dark p-24 text-surface lg:p-40">
        <h2 className="text-balance text-h2 font-semibold">{c.oemTitle}</h2>
        <p className="max-w-[46ch] text-c1 text-surface/80">{c.oemBody}</p>
      </li>,
    );
  }

  return (
    <section aria-label={base.title} data-content-module="brazil-collection">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <h1 className="col-span-full text-balance text-d1 font-semibold leading-none text-ink xl:col-span-12">{base.title}</h1>
          <div className="col-span-full xl:col-span-10 xl:col-start-15 xl:self-end">
            <p className="text-c1 text-ink">{c.lead(items.length)}</p>
            <ArrowLink href={base.contactHref} className="mt-24">{base.contact}</ArrowLink>
          </div>

          <fieldset className="col-span-full mt-48">
            <legend className="text-h3 font-semibold text-ink">{c.chooseDoor}</legend>
            <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-16">
              {DOORS.map((d) => {
                const n = items.filter(d.match).length;
                const active = door === d.key;
                return (
                  <label
                    key={d.key}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-12 border bg-surface p-16 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink lg:p-24",
                      active ? "border-ink" : "border-line hover:border-ink-secondary",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => { setDoor(active ? null : d.key); setOutside("any"); setColour("any"); }}
                      className="sr-only"
                    />
                    <DoorDiagram {...d.config} title={c.doors[d.key]} />
                    <span className="flex items-baseline justify-between gap-8">
                      <span className="text-c1 font-semibold leading-tight text-ink">{c.doors[d.key]}</span>
                      <span className="text-c2 tabular-nums text-ink-secondary">{n}</span>
                    </span>
                    <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[3px] origin-left bg-ink transition-transform duration-[var(--motion-medium)] ease-[var(--motion-ease)]", active ? "scale-x-100" : "scale-x-0")} />
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="layout sticky top-0 z-10 mt-24 border-y border-line bg-surface/95 backdrop-blur-[2px]">
        <div className="col-content flex flex-wrap items-center gap-x-32 gap-y-12 py-12">
          {outsideOptions.length > 1 ? (
            <div role="group" aria-label={c.outsideLabel} className="flex flex-wrap items-center gap-8">
              <span className="text-c2 text-ink-secondary">{c.outsideLabel}</span>
              <button type="button" aria-pressed={outside === "any"} onClick={() => setOutside("any")} className={chip(outside === "any")}>{c.any}</button>
              {outsideOptions.map((o) => (
                <button key={o} type="button" aria-pressed={outside === o} onClick={() => setOutside(o)} className={chip(outside === o)}>{base.outside[o]}</button>
              ))}
            </div>
          ) : null}
          {colourOptions.length > 1 ? (
            <div role="group" aria-label={c.colourLabel} className="flex flex-wrap items-center gap-8">
              <span className="text-c2 text-ink-secondary">{c.colourLabel}</span>
              {colourOptions.map((col) => (
                <button
                  key={col}
                  type="button"
                  aria-pressed={colour === col}
                  onClick={() => setColour(colour === col ? "any" : col)}
                  title={base.colours[col]}
                  className={cn("grid size-32 place-items-center border transition-colors", colour === col ? "border-ink" : "border-line hover:border-ink")}
                >
                  <span className="size-20 border border-line" style={{ background: COLOUR_HEX[col] }} />
                  <span className="sr-only">{base.colours[col]}</span>
                </button>
              ))}
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-16">
            <p className="text-c2 tabular-nums text-ink" aria-live="polite">{c.result(shown.length)}</p>
            {filtered ? <button type="button" onClick={reset} className="short-marker text-c2 text-ink">{c.showAll}</button> : null}
            <div role="group" aria-label={`${c.views.photos} / ${c.views.table}`} className="flex border border-line">
              {(["photos", "table"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={cn("px-12 py-4 text-c2", view === v ? "bg-ink text-surface" : "text-ink-secondary hover:text-ink")}>
                  {c.views[v]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-alt py-24 lg:py-48">
        <div className="layout">
          <div className="col-content w-full">
            {!shown.length ? (
              <p className="max-w-[60ch] bg-surface p-32 text-c1 text-ink">{c.none}</p>
            ) : view === "photos" ? (
              <ul className="grid grid-flow-dense grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-16">{plates}</ul>
            ) : (
              <Schedule shown={shown} lang={lang} />
            )}
          </div>
        </div>
      </div>

      <div className="layout mt-96 lg:mt-136">
        <div className="col-content w-full">
          <p className="max-w-[34ch] text-balance text-h2 font-semibold text-ink">{c.closing}</p>
          <ArrowLink href={base.contactHref} className="mt-24">{base.contact}</ArrowLink>
        </div>
      </div>
    </section>
  );
}
