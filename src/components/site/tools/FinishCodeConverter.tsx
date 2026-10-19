"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/site/Button";
import { contactHref } from "@/lib/inquiry-prefill";
import { lookupFinish } from "@/lib/tools/finish-lookup";
import { CHIP_CLASS, FIELD_CLASS, RESULT_KICKER, prefixOf } from "./shared";

/**
 * Any finish code → every exact equivalent (2026-10-19). The answer is
 * src/lib/tools/finish-lookup.ts over src/lib/bhma-finish.ts; words arrive translated.
 */
export interface FinishCopy {
  input: string;
  examples: string;
  colHouse: string;
  colBase: string;
  colBhma: string;
  colUs: string;
  colName: string;
  base: { steel: string; brass: string; stainless: string };
  twoRows: string;
  unknown: string;
  /** {code} {reason} */
  unmapped: string;
  zincNote: string;
  quoteCta: string;
  product: string;
}

const EXAMPLES = ["US26D", "626", "652", "630", "US32D", "SC", "SN", "MB", "ORB", "SS"];

export function FinishCodeConverter({
  locale,
  copy,
  names,
  reasons,
  products,
}: {
  locale: string;
  copy: FinishCopy;
  /** BHMA number → translated finish name. */
  names: Record<string, string>;
  /** Our unmapped code → translated reason. */
  reasons: Record<string, string>;
  /** BHMA number → product grid. */
  products: Record<string, ReactNode>;
}) {
  const [query, setQuery] = useState("US26D");
  const result = lookupFinish(query);
  const rows = result.kind === "rows" ? result.rows : [];
  const bhmas = [...new Set(rows.map((r) => r.bhma))];
  const quote = contactHref(prefixOf(locale), {
    product: copy.product,
    note: rows.length ? rows.map((r) => `${r.house} / ${r.bhma} / ${r.us} (${copy.base[r.base]})`).join("\n") : query.trim(),
    from: "tools/finish-code-converter",
  });

  return (
    <>
      <section className="col-content grid grid-cols gap-x gap-y-48">
        <div className="col-span-full space-y-24 lg:col-span-5 xl:col-span-9">
          <label className="block space-y-8 text-c1 text-ink">
            <span>{copy.input}</span>
            <input className={FIELD_CLASS} value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
          </label>
          <div>
            <p className="text-c2 text-ink-secondary">{copy.examples}</p>
            <div className="mt-12 flex flex-wrap gap-8">
              {EXAMPLES.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={CHIP_CLASS}
                  aria-pressed={query.trim().toUpperCase() === code}
                  onClick={() => setQuery(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15" aria-live="polite">
          {result.kind === "rows" ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[30rem] border-collapse text-start">
                  <thead>
                    <tr className="border-b border-line">
                      {[copy.colBhma, copy.colUs, copy.colHouse, copy.colBase, copy.colName].map((h) => (
                        <th key={h} scope="col" className="py-12 pe-16 text-c2 font-semibold text-ink-secondary">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={`${r.house}-${r.base}`} className="border-b border-line">
                        <th scope="row" className="py-12 pe-16 text-h3 font-semibold tabular-nums text-ink">
                          {r.bhma}
                        </th>
                        <td className="py-12 pe-16 text-c1 text-ink">{r.us}</td>
                        <td className="py-12 pe-16 text-c1 text-ink">{r.house}</td>
                        <td className="py-12 pe-16 text-c1 text-ink">{copy.base[r.base]}</td>
                        <td className="py-12 text-c1 text-ink">{names[r.bhma] ?? r.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {new Set(rows.map((r) => r.base)).size > 1 ? (
                <p className="mt-16 text-c1 text-ink">{copy.twoRows}</p>
              ) : null}
            </>
          ) : result.kind === "unmapped" ? (
            <p className="text-c1 text-ink">
              {copy.unmapped.replace("{code}", result.code).replace("{reason}", reasons[result.code] ?? result.reason)}
            </p>
          ) : (
            <p className="text-c1 text-ink-secondary">{copy.unknown}</p>
          )}
          <p className={`mt-24 ${RESULT_KICKER}`}>BHMA A156.18</p>
          <p className="mt-8 text-c2 text-ink-secondary">{copy.zincNote}</p>
          <Button href={quote} className="mt-32">
            {copy.quoteCta}
          </Button>
        </div>
      </section>
      {bhmas.map((b) => (
        <div key={b}>{products[b] ?? null}</div>
      ))}
    </>
  );
}
