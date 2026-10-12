"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLink } from "../ArrowLink";
import { MediaPlaceholder } from "../MediaPlaceholder";
import { DoorDiagram, type DoorConfig } from "./DoorDiagram";
import { COLOUR_HEX, functionLine, itemName, items, t, type BrazilItem, type Colour, type Lang, type Outside } from "./brazil-data";

/*
  Proposal B — start from the door (an installer knows the opening, not our model numbers).
  Four door elevations are the first choice; outside access and colour narrow it; the answer
  is the models that fit, each with its own elevation beside the photograph so the buyer can
  check the part against the door before asking for a price.
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
    lead: (n: number) => `${n} models made in our own moulds for nine Brazilian brands. Start from the door you are fitting.`,
    step1: "The door",
    step2: "Outside access",
    step3: "Colour",
    any: "Any",
    doors: {
      "single-lateral": "Single door, side latch",
      "single-vertical": "Single door, top and bottom rods",
      double: "Double door",
      outside: "Opening from outside",
    } satisfies Record<DoorKey, string>,
    result: (n: number) => (n === 1 ? "1 model fits" : `${n} models fit`),
    none: "No catalogue model fits this door yet. We cut new moulds to a customer's sample or drawing — send us yours.",
    quote: "Ask for this configuration",
    see: "See the model",
  },
  pt: {
    lead: (n: number) => `${n} modelos feitos em moldes próprios para nove marcas brasileiras. Comece pela porta que você vai equipar.`,
    step1: "A porta",
    step2: "Acesso externo",
    step3: "Cor",
    any: "Qualquer",
    doors: {
      "single-lateral": "Uma folha, trava lateral",
      "single-vertical": "Uma folha, travamento vertical",
      double: "Duas folhas",
      outside: "Abertura pelo lado de fora",
    } satisfies Record<DoorKey, string>,
    result: (n: number) => (n === 1 ? "1 modelo serve" : `${n} modelos servem`),
    none: "Nenhum modelo do catálogo serve nesta porta ainda. Fazemos molde novo a partir da amostra ou do desenho do cliente — envie o seu.",
    quote: "Pedir esta configuração",
    see: "Ver o modelo",
  },
} as const;

function ResultRow({ item, lang }: { item: BrazilItem; lang: Lang }) {
  const c = copy[lang];
  const base = t[lang];
  return (
    <li className="grid grid-cols-[96px_1fr] gap-16 border-t border-line py-16 sm:grid-cols-[160px_1fr_88px] sm:gap-24 lg:py-24">
      <MediaPlaceholder src={item.image} ratio="1 / 1" label={`HYDE ${item.model} ${itemName(item, lang)}`} sizes="160px" className="bg-surface object-contain mix-blend-multiply" />
      <div className="flex flex-col gap-8">
        <p className="text-c2 font-semibold uppercase tracking-[0.12em] text-ink">{item.model}</p>
        <h3 className="text-balance text-c1 font-semibold leading-tight text-ink">{itemName(item, lang)}</h3>
        <p className="text-c2 text-ink-secondary">{functionLine(item, lang)}</p>
        {item.specs.length ? (
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-12 gap-y-2 text-c2">
            {item.specs.map((s) => (
              <div key={s.labelEn} className="contents">
                <dt className="text-ink-secondary">{lang === "pt" ? s.labelPt : s.labelEn}</dt>
                <dd className="text-ink tabular-nums">{lang === "pt" ? s.valuePt : s.valueEn}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <p className="mt-4 text-c2 text-ink-secondary">{item.colours.map((col) => base.colours[col]).join(" · ")}</p>
        {item.href ? <ArrowLink href={item.href} className="mt-4">{c.see}</ArrowLink> : null}
      </div>
      {item.family === "single" || item.family === "double" ? (
        <div className="hidden sm:block" aria-hidden="true">
          <DoorDiagram door={item.family} locking={item.locking ?? "lateral"} trim={item.outside !== "none"} title="" />
        </div>
      ) : null}
    </li>
  );
}

export function BrazilCollectionB({ lang = "en" }: { lang?: Lang }) {
  const c = copy[lang];
  const base = t[lang];
  const [door, setDoor] = useState<DoorKey>("single-lateral");
  const [outside, setOutside] = useState<Outside | "any">("any");
  const [colour, setColour] = useState<Colour | "any">("any");

  const doorItems = useMemo(() => items.filter(DOORS.find((d) => d.key === door)!.match), [door]);
  const shown = doorItems.filter((i) => (outside === "any" || i.outside === outside) && (colour === "any" || i.colours.includes(colour)));
  const outsideOptions = (["none", "lever", "lever-key"] as const).filter((o) => doorItems.some((i) => i.outside === o));
  const colourOptions = (Object.keys(COLOUR_HEX) as Colour[]).filter((col) => doorItems.some((i) => i.colours.includes(col)));

  const chip = (active: boolean) =>
    cn("border px-12 py-8 text-c2 transition-colors", active ? "border-ink bg-ink text-surface" : "border-line text-ink hover:border-ink");

  return (
    <section className="layout" aria-label={base.title} data-content-module="brazil-collection-b">
      <div className="col-content grid w-full grid-cols gap-x gap-y-24">
        <h1 className="col-span-full text-balance text-h1 font-semibold text-ink xl:col-span-12">{base.title}</h1>
        <p className="col-span-full text-c1 text-ink xl:col-span-9 xl:col-start-16 xl:self-end">{c.lead(items.length)}</p>

        <fieldset className="col-span-full mt-40">
          <legend className="text-h3 font-semibold text-ink">{c.step1}</legend>
          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-16">
            {DOORS.map((d) => {
              const n = items.filter(d.match).length;
              const active = door === d.key;
              return (
                <label
                  key={d.key}
                  className={cn(
                    "group relative flex cursor-pointer flex-col gap-12 border bg-surface p-16 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink lg:p-24",
                    active ? "border-ink" : "border-line hover:border-ink-secondary",
                    !n && "opacity-50",
                  )}
                >
                  <input type="radio" name="brazil-door" value={d.key} checked={active} onChange={() => { setDoor(d.key); setOutside("any"); setColour("any"); }} className="sr-only" />
                  <DoorDiagram {...d.config} title={c.doors[d.key]} />
                  <span className="flex items-baseline justify-between gap-8">
                    <span className="text-c1 font-semibold leading-tight text-ink">{c.doors[d.key]}</span>
                    <span className="text-c2 tabular-nums text-ink-secondary">{n}</span>
                  </span>
                  <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[3px] bg-ink transition-transform origin-left", active ? "scale-x-100" : "scale-x-0")} />
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="col-span-full grid gap-24 lg:grid-cols-2">
          {outsideOptions.length > 1 ? (
            <fieldset>
              <legend className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">{c.step2}</legend>
              <div className="mt-8 flex flex-wrap gap-8">
                <button type="button" aria-pressed={outside === "any"} onClick={() => setOutside("any")} className={chip(outside === "any")}>{c.any}</button>
                {outsideOptions.map((o) => (
                  <button key={o} type="button" aria-pressed={outside === o} onClick={() => setOutside(o)} className={chip(outside === o)}>{base.outside[o]}</button>
                ))}
              </div>
            </fieldset>
          ) : null}
          {colourOptions.length > 1 ? (
            <fieldset>
              <legend className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">{c.step3}</legend>
              <div className="mt-8 flex flex-wrap gap-8">
                <button type="button" aria-pressed={colour === "any"} onClick={() => setColour("any")} className={chip(colour === "any")}>{c.any}</button>
                {colourOptions.map((col) => (
                  <button key={col} type="button" aria-pressed={colour === col} onClick={() => setColour(col)} className={cn(chip(colour === col), "inline-flex items-center gap-8")}>
                    <span className="size-12 border border-line" style={{ background: COLOUR_HEX[col] }} aria-hidden="true" />
                    {base.colours[col]}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}
        </div>

        <div className="col-span-full mt-16" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-16 border-b border-ink pb-12">
            <h2 className="text-h3 font-semibold text-ink tabular-nums">{c.result(shown.length)}</h2>
            <ArrowLink href={base.contactHref}>{c.quote}</ArrowLink>
          </div>
          {shown.length ? (
            <ul>{shown.map((item) => <ResultRow key={item.id} item={item} lang={lang} />)}</ul>
          ) : (
            <p className="max-w-[60ch] py-32 text-c1 text-ink">{c.none}</p>
          )}
        </div>
      </div>
    </section>
  );
}
