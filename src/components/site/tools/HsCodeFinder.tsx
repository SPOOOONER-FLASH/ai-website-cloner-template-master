"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/site/Button";
import { contactHref } from "@/lib/inquiry-prefill";
import { FIELD_CLASS, RESULT_KICKER, prefixOf } from "./shared";

/**
 * Door hardware → HS code (2026-10-19). Items and codes come from src/lib/tools/hs-codes.ts,
 * translated on the server; this file only chooses one and shows it with its products.
 */
export interface HsCopy {
  choose: string;
  hs6: string;
  heading8301: string;
  heading8302: string;
  india: string;
  indiaNone: string;
  sixDigitRule: string;
  quoteCta: string;
}

export interface HsItemView {
  id: string;
  label: string;
  hs: string;
  india: string | null;
  note?: string;
}

export function HsCodeFinder({
  locale,
  copy,
  items,
  products,
}: {
  locale: string;
  copy: HsCopy;
  items: HsItemView[];
  products: Record<string, ReactNode>;
}) {
  const [id, setId] = useState(items[0].id);
  const item = items.find((i) => i.id === id) ?? items[0];
  const quote = contactHref(prefixOf(locale), {
    product: item.label,
    note: `HS ${item.hs}`,
    from: "tools/door-hardware-hs-code-finder",
  });

  return (
    <>
      <section className="col-content grid grid-cols gap-x gap-y-48">
        <p className="sr-only" aria-live="polite">
          {item.label}: HS {item.hs}
        </p>
        <label className="col-span-full block space-y-8 text-c1 text-ink lg:col-span-5 xl:col-span-9">
          <span>{copy.choose}</span>
          <select className={FIELD_CLASS} value={id} onChange={(e) => setId(e.target.value)}>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
        <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
          <p className={RESULT_KICKER}>{copy.hs6}</p>
          <p className="mt-8 text-h1 tabular-nums text-ink">{item.hs}</p>
          <p className="mt-8 text-c1 text-ink-secondary">
            {item.hs.startsWith("8301") ? copy.heading8301 : copy.heading8302}
          </p>
          <p className={`mt-32 ${RESULT_KICKER}`}>{copy.india}</p>
          <p className="mt-8 text-h3 tabular-nums text-ink">{item.india ?? "—"}</p>
          {item.india ? null : <p className="mt-8 text-c2 text-ink-secondary">{copy.indiaNone}</p>}
          {item.note ? <p className="mt-24 text-c1 text-ink">{item.note}</p> : null}
          <p className="mt-24 text-c2 text-ink-secondary">{copy.sixDigitRule}</p>
          <Button href={quote} className="mt-32">
            {copy.quoteCta}
          </Button>
        </div>
      </section>
      {products[item.id] ?? null}
    </>
  );
}
