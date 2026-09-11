"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/site";
import { ArrowLink } from "./ArrowLink";
import { capabilityCopy, capabilitySteps } from "@/data/capability";

/**
 * The production chain, advanced by scrolling.
 *
 * ---------------------------------------------------------------------------
 * WHAT THE MOTION IS FOR, AND WHY IT IS THIS SMALL
 *
 * The client asked for a scrolling or animated treatment of the factory's capability.
 * The temptation with that brief is parallax, counters that tick up, and steps that fade
 * in as they arrive. All three would be wrong here, and not on taste grounds: the
 * client's principal asked for professional rather than decorated, because a buyer
 * ordering a container of metal they cannot inspect is buying the belief that this
 * supplier does not make mistakes. An animation does not make a hole position correct,
 * and a page working hard to impress reads as a page compensating.
 *
 * So the only motion is the one that carries meaning: a heading that stays while seven
 * steps pass it, and a rule that fills as they do. That says "this is one continuous
 * sequence, not seven services" — which is the actual argument. Nothing fades, nothing
 * moves sideways, no number counts up.
 *
 * ---------------------------------------------------------------------------
 * IT WORKS WITH JAVASCRIPT OFF
 *
 * Every step is in the markup at full opacity and full size. The observer only moves a
 * highlight; it never reveals content. Content that animates in is content that is
 * missing when the observer does not run — under `output: "export"` the first paint is
 * static HTML, and a crawler that does not execute the effect must still read all seven
 * steps. This is the same reason the copy is not injected client-side.
 *
 * `prefers-reduced-motion` removes the sticky behaviour too, not just transitions: for a
 * reader with vestibular sensitivity the moving-viewport effect IS the problem, and
 * turning off a 150ms colour transition while leaving the column pinned would miss it.
 *
 * ---------------------------------------------------------------------------
 * ROLLBACK
 *
 * Delete the one <CapabilityChain /> line from CompanyOverview. Nothing else imports it
 * and every figure it shows is computed in src/data/capability.ts, so nothing is left
 * behind to go stale.
 */
/**
 * `models` is a prop, and that is a bundle-size decision.
 *
 * This is a client component — the active-step highlight reads geometry on scroll. It
 * used to import publishedProducts just to call `.length` on it, and importing the
 * catalogue from client code ships the catalogue: 659 product records, with their specs
 * and summaries, downloaded so that one integer could be rendered.
 *
 * The parent is a server component and already has the number.
 */
export function CapabilityChain({
  locale = "en",
  models,
}: {
  locale?: Locale;
  models: number;
}) {
  const text = capabilityCopy[locale === "es" ? "es" : "en"];
  const steps = capabilitySteps({ models });
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter((n): n is HTMLLIElement => Boolean(n));
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /*
      The observer is only a "something moved" trigger. The active step is then decided
      by geometry — whichever step's box is nearest the middle of the viewport.

      The obvious version reads the index straight off the entry:

          for (const entry of entries) if (entry.isIntersecting) setActive(indexOf(entry.target))

      and it is wrong. `entries` is a batch, its order is not scroll order, and taking the
      last intersecting one in the batch makes the highlight jump around: measured on
      2026-09-07, scrolling to step 3 lit 05, step 5 lit 02, and step 7 lit 04. Nothing
      about that is visible in a screenshot of a stationary page, which is exactly why it
      survived until the highlight was read at four scroll positions in a row.

      Measuring instead of trusting the batch also removes the tuned root margin: there is
      no band to fall between, so no scroll position can leave the highlight stale.
    */
    const pick = () => {
      const middle = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      nodes.forEach((node, index) => {
        const { top, bottom } = node.getBoundingClientRect();
        const distance = Math.abs((top + bottom) / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      setActive(best);
    };

    /*
      A passive scroll listener rather than an observer, now that the decision is
      geometric. IntersectionObserver only fires when a threshold is crossed, so between
      crossings the highlight would sit stale; `pick` wants to run as the page moves.
      rAF-throttled it runs at most once per frame and only reads layout, so it stays off
      the scrolling critical path.
    */
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        pick();
      });
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps.length]);

  const contactHref = locale === "es" ? "/es/contact" : "/contact";

  return (
    <section className="col-content border-t border-line pt-48" aria-labelledby="capability-heading">
      <div className="grid grid-cols gap-x gap-y-48">
        {/*
          The sticky column. `self-start` is required — a grid item defaults to stretching
          to the row height, and a stretched item has no free space for `position: sticky`
          to travel through, so the whole effect silently does nothing.
        */}
        <div className="col-span-full self-start motion-safe:lg:sticky motion-safe:lg:top-96 lg:col-span-4 xl:col-span-8">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
            {text.eyebrow}
          </p>
          <h2 id="capability-heading" className="mt-16 text-h2 text-ink">
            {text.title}
          </h2>
          <p className="mt-24 max-w-[46ch] text-c1 text-ink-secondary">{text.intro}</p>

          {/*
            The progress readout is hidden from assistive technology. A screen reader is
            already being told which item of an ordered list it is on, and announcing
            "Step 3 / 7" again on every scroll event would be noise, not information.
          */}
          <div className="mt-32 hidden lg:block" aria-hidden="true">
            <p className="text-c2 tabular-nums text-ink-secondary">
              {text.progress} {steps[active]?.ordinal ?? "01"} / {String(steps.length).padStart(2, "0")}
            </p>
            <div className="mt-12 h-px w-full bg-line">
              <div
                className="h-px bg-ink motion-safe:transition-[width] motion-safe:duration-300"
                style={{ width: `${((active + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <ol className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
          {steps.map((step, index) => {
            const isActive = index === active;
            return (
              <li
                key={step.ordinal}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="border-t border-line py-40 first:border-t-0 first:pt-0 lg:py-56"
              >
                <div className="flex gap-24">
                  <span
                    className={[
                      "shrink-0 text-c2 tabular-nums motion-safe:transition-colors motion-safe:duration-300",
                      isActive ? "text-ink" : "text-ink-secondary",
                    ].join(" ")}
                  >
                    {step.ordinal}
                  </span>
                  <div>
                    <h3 className="text-h3 text-ink">
                      {locale === "es" ? step.titleEs : step.title}
                    </h3>
                    <p className="mt-16 max-w-[58ch] text-c1 text-ink-secondary">
                      {locale === "es" ? step.bodyEs : step.body}
                    </p>
                    {/*
                      A step without a countable fact shows nothing here. That gap is
                      deliberate and it is the honest version: stamping and polishing have
                      no figure we can evidence, and a made-up press tonnage on a page
                      whose whole purpose is trust would cost more than the blank does.
                    */}
                    {step.figure ? (
                      <p className="mt-24 text-c2 text-ink">
                        <span className="text-lead tabular-nums">{step.figure.value}</span>{" "}
                        <span className="text-ink-secondary">
                          {locale === "es" ? step.figure.labelEs : step.figure.label}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-48">
        <ArrowLink href={contactHref}>{text.cta}</ArrowLink>
      </div>
    </section>
  );
}
