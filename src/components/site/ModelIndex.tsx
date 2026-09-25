"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/data/site";
import {
  groupModelIndex,
  modelSearchKey,
  type ModelIndexEntry,
} from "@/lib/model-index";

/**
 * The model-code index: every published model number, and the page it resolves to.
 *
 * See src/lib/model-index.ts for why this renders the whole list rather than only search
 * results. In short: the list is the asset, the filter is a convenience. A crawler and a
 * reader with JavaScript off both get the complete index.
 *
 * The entries arrive as a prop from the server component, already sorted, so nothing here
 * reads the catalogue and nothing here decides what is published.
 */

const COPY = {
  en: {
    heading: "Every model number, and where it goes",
    lede: (n: number) =>
      `All ${n} published model numbers, as they are printed on a drawing or a purchase order. Type any part of one to narrow the list.`,
    placeholder: "Model number — 306 PS, LH852, 70720",
    clear: "Clear",
    showing: (shown: number, total: number) =>
      shown === total ? `${total} models` : `${shown} of ${total} models`,
    none: "No model number contains that.",
    noneHelp:
      "Separators do not matter — 306 PS, 306-PS and 306ps all find the same part. If it is still not here, the number may be a renamed or withheld record: the three tables below say which.",
  },
  es: {
    heading: "Todos los números de modelo, y a dónde llevan",
    lede: (n: number) =>
      `Los ${n} números de modelo publicados, tal como aparecen en un plano o en un pedido. Escriba cualquier parte de uno para filtrar la lista.`,
    placeholder: "Número de modelo — 306 PS, LH852, 70720",
    clear: "Borrar",
    showing: (shown: number, total: number) =>
      shown === total ? `${total} modelos` : `${shown} de ${total} modelos`,
    none: "Ningún número de modelo contiene eso.",
    noneHelp:
      "Los separadores no importan: 306 PS, 306-PS y 306ps encuentran la misma pieza. Si aun así no está, puede ser un registro renombrado o sin fotografía publicada: las tres tablas de abajo dicen cuál.",
  },
  pt: {
    heading: "Todos os números de modelo, e para onde levam",
    lede: (n: number) =>
      `Os ${n} números de modelo publicados, como aparecem num desenho ou num pedido de compra. Digite qualquer parte de um para filtrar a lista.`,
    placeholder: "Número de modelo — 306 PS, LH852, 70720",
    clear: "Limpar",
    showing: (shown: number, total: number) =>
      shown === total ? `${total} modelos` : `${shown} de ${total} modelos`,
    none: "Nenhum número de modelo contém isso.",
    noneHelp:
      "Os separadores não importam: 306 PS, 306-PS e 306ps encontram a mesma peça. Se mesmo assim não estiver aqui, pode ser um registro renomeado ou sem fotografia publicada: as três tabelas abaixo dizem qual.",
  },
} as const;

export function ModelIndex({
  locale,
  entries,
}: {
  locale: Locale;
  entries: ModelIndexEntry[];
}) {
  const copy = COPY[locale] ?? COPY.en;
  const [query, setQuery] = useState("");

  const key = modelSearchKey(query);
  const shown = useMemo(
    () => (key ? entries.filter((e) => e.searchKey.includes(key)) : entries),
    [entries, key],
  );
  const groups = useMemo(() => groupModelIndex(shown), [shown]);

  return (
    <section
      id="model-index"
      className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32"
    >
      <div className="col-span-full lg:col-span-5 xl:col-span-9">
        <h2 className="text-h2 text-ink">{copy.heading}</h2>
        <p className="mt-16 text-c1 text-ink-secondary">{copy.lede(entries.length)}</p>
      </div>

      <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-15 xl:col-start-10">
        {/*
          A plain input, not a form. There is nothing to submit: the list below is already
          on the page and this filters it. A form would offer the reader an Enter key that
          reloads the page and loses their place.
        */}
        <div className="flex items-baseline gap-x-16">
          <input
            type="search"
            inputMode="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            aria-controls="model-index-list"
            className="w-full border-b border-line bg-transparent pb-8 text-h3 text-ink placeholder:text-ink-tertiary focus:border-ink focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="short-marker short-marker-compact shrink-0 text-c2 text-brand hover:text-brand-hover"
            >
              {copy.clear}
            </button>
          ) : null}
        </div>

        <p aria-live="polite" className="mt-12 text-c2 text-ink-secondary">
          {copy.showing(shown.length, entries.length)}
        </p>

        <div id="model-index-list" className="mt-32">
          {shown.length === 0 ? (
            <div className="border-t border-line pt-24">
              <p className="text-c1 text-ink">{copy.none}</p>
              <p className="mt-12 max-w-[60ch] text-c2 text-ink-secondary">{copy.noneHelp}</p>
            </div>
          ) : (
            groups.map(([letter, rows]) => (
              <div key={letter} className="mb-40">
                <p className="border-b border-line pb-8 text-kicker uppercase tracking-[0.14em] text-ink-secondary">
                  {letter}
                </p>
                <ul className="mt-12">
                  {rows.map((entry) => (
                    <li
                      key={entry.href}
                      className="flex flex-wrap items-baseline justify-between gap-x-24 gap-y-2 border-b border-line py-8"
                    >
                      <Link
                        href={entry.href}
                        className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                      >
                        {entry.model}
                      </Link>
                      <span className="text-c2 text-ink-secondary">{entry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
