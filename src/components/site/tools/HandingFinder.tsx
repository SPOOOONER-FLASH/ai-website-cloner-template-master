"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/site/Button";
import { contactHref } from "@/lib/inquiry-prefill";
import { ansiHand, dinHand, type HingeSide, type Swing } from "@/lib/tools/handing";
import { CHIP_CLASS, RESULT_KICKER, fill, prefixOf } from "./shared";

/**
 * Door handing from two answers (2026-10-19). The rule is src/lib/tools/handing.ts; every
 * word arrives in `copy`, already translated on the server, so the seven overlay locales
 * read their own language without shipping the overlay bundle to the browser.
 */
export interface HandingCopy {
  hingesQ: string;
  left: string;
  right: string;
  swingQ: string;
  away: string;
  toward: string;
  result: string;
  /** {hand} */
  ansiLine: string;
  /** {din} */
  dinLine: string;
  dinLeft: string;
  dinRight: string;
  /** {hinges} {swing} */
  describe: string;
  describeHint: string;
  hingesLeftWords: string;
  hingesRightWords: string;
  awayWords: string;
  towardWords: string;
  reverseNote: string;
  quoteCta: string;
  product: string;
}

export function HandingFinder({
  locale,
  copy,
  products,
}: {
  locale: string;
  copy: HandingCopy;
  /** `in`: for doors that swing away from the outside; `out`: toward it. */
  products: { in: ReactNode; out: ReactNode };
}) {
  const [hinges, setHinges] = useState<HingeSide>("left");
  const [swing, setSwing] = useState<Swing>("away");
  const hand = ansiHand(hinges, swing);
  const din = dinHand(hinges, swing) === "left" ? copy.dinLeft : copy.dinRight;
  const words = fill(copy.describe, {
    hinges: hinges === "left" ? copy.hingesLeftWords : copy.hingesRightWords,
    swing: swing === "away" ? copy.awayWords : copy.towardWords,
  });
  const quote = contactHref(prefixOf(locale), {
    product: copy.product,
    note: `${fill(copy.ansiLine, { hand })} · ${fill(copy.dinLine, { din })}\n${words}`,
    from: "tools/door-handing-finder",
  });

  const choice = <T extends string>(value: T, current: T, set: (v: T) => void, label: string) => (
    <button type="button" className={CHIP_CLASS} aria-pressed={value === current} onClick={() => set(value)}>
      {label}
    </button>
  );

  return (
    <>
      <section className="col-content grid grid-cols gap-x gap-y-48">
        <p className="sr-only" aria-live="polite">
          {fill(copy.ansiLine, { hand })}. {fill(copy.dinLine, { din })}.
        </p>
        <div className="col-span-full space-y-32 lg:col-span-5 xl:col-span-9">
          <fieldset className="space-y-12">
            <legend className="text-c1 text-ink">{copy.hingesQ}</legend>
            <div className="flex flex-wrap gap-12">
              {choice<HingeSide>("left", hinges, setHinges, copy.left)}
              {choice<HingeSide>("right", hinges, setHinges, copy.right)}
            </div>
          </fieldset>
          <fieldset className="space-y-12">
            <legend className="text-c1 text-ink">{copy.swingQ}</legend>
            <div className="flex flex-wrap gap-12">
              {choice<Swing>("away", swing, setSwing, copy.away)}
              {choice<Swing>("toward", swing, setSwing, copy.toward)}
            </div>
          </fieldset>
        </div>
        <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
          <p className={RESULT_KICKER}>{copy.result}</p>
          <p className="mt-8 text-h1 text-ink">{hand}</p>
          <p className="mt-16 text-c1 text-ink">{fill(copy.ansiLine, { hand })}</p>
          <p className="mt-8 text-c1 text-ink">{fill(copy.dinLine, { din })}</p>
          {swing === "toward" ? <p className="mt-16 text-c2 text-ink-secondary">{copy.reverseNote}</p> : null}
          <p className={`mt-32 ${RESULT_KICKER}`}>{copy.describeHint}</p>
          <p className="mt-8 text-h3 text-ink">{words}</p>
          <Button href={quote} className="mt-32">
            {copy.quoteCta}
          </Button>
        </div>
      </section>
      {swing === "away" ? products.in : products.out}
    </>
  );
}
