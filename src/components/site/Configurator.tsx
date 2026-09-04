"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ProductVideo } from "./ProductVideo";
import { FinderModeSwitch } from "./FinderModeSwitch";
import { cn } from "@/lib/utils";
import type { FinderProduct } from "@/lib/product-finder";
import {
  STEPS,
  STEPS_ES,
  answersFromParams,
  answersToParams,
  nextStep,
  noteFor,
  optionsFor,
  remaining,
  reviseAt,
  specificationLine,
  stepPath,
  type Answers,
  type ConfiguratorStep,
  type StepKey,
} from "@/lib/configurator";

/**
 * The guided configurator.
 *
 * One question at a time, each answer narrowing what is left, ending at the models that
 * match. The rules live in src/lib/configurator.ts with a test that walks the real
 * catalogue; this file is the surface.
 *
 * WHAT THE ANIMATION IS FOR. Not decoration. Each transition carries one piece of
 * information the reader would otherwise have to work out:
 *
 *   - Options stagger in, so it reads as a new question rather than a changed page.
 *   - The count on each card animates from the previous number, which makes the
 *     narrowing visible — 67 knob locks becoming 12 is the thing the tool does.
 *   - The preview image cross-fades to a product that actually matches, so the abstract
 *     choice ("heavy duty cylindrical") acquires a picture before it is made.
 *
 * Everything respects `prefers-reduced-motion` through the shared `.motion-safe-*`
 * classes in globals.css.
 *
 * STATE LIVES IN THE URL. A configuration is something a specifier sends to a colleague
 * or pastes into an enquiry, which is how FSB's does it too. `router.replace` rather than
 * `push`, so answering five questions does not put five entries in the back button —
 * "back" should leave the configurator, and the in-page back is the progress rail.
 */

interface ConfiguratorProps {
  products: FinderProduct[];
  locale?: "en" | "es";
}

const COPY = {
  en: {
    restart: "Start again",
    back: "Change",
    matchOne: "1 model matches",
    matchMany: (n: number) => `${n} models match`,
    narrowing: (n: number) => `${n} ${n === 1 ? "product" : "products"}`,
    unitOne: "product",
    unitMany: "products",
    nothingMatches: "No model matches this combination.",
    seeProduct: "Open the product page",
    quote: "Request a quote for this configuration",
    quoteHelp:
      "The link carries your selections, so the export team sees the same configuration you do.",
    yourChoices: "Your selection",
    allProducts: "Every model in the catalogue",
    step: "Step",
    of: "of",
    noPhoto: "Photography for this model is being prepared.",
    schedule: "Your specification so far",
    scheduleHelp:
      "This is the line that goes on a door schedule. It fills in as you answer, and you can copy it straight out.",
  },
  es: {
    restart: "Empezar de nuevo",
    back: "Cambiar",
    matchOne: "1 modelo coincide",
    matchMany: (n: number) => `${n} modelos coinciden`,
    narrowing: (n: number) => `${n} ${n === 1 ? "producto" : "productos"}`,
    unitOne: "producto",
    unitMany: "productos",
    nothingMatches: "Ningún modelo coincide con esta combinación.",
    seeProduct: "Abrir la ficha del producto",
    quote: "Solicitar cotización de esta configuración",
    quoteHelp:
      "El enlace lleva sus selecciones, así el equipo de exportación ve la misma configuración que usted.",
    yourChoices: "Su selección",
    allProducts: "Todos los modelos del catálogo",
    step: "Paso",
    of: "de",
    noPhoto: "La fotografía de este modelo está en preparación.",
    schedule: "Su especificación hasta aquí",
    scheduleHelp:
      "Esta es la línea que va en una relación de puertas. Se completa a medida que responde, y puede copiarla tal cual.",
  },
} as const;

/**
 * Slugs read better as words.
 *
 * The hyphen is not the test. It used to be, and a one-word slug fell straight through:
 * the first question listed "Hardware accessories", "Panic exit devices" and then
 * `deadbolts`, lower-case, in a column of capitalised labels. A value is a slug when it
 * is entirely lower-case, whether or not it happens to contain a hyphen.
 *
 * Values that are already prose — "Stainless Steel", "Polished Brass" — carry their own
 * capitalisation from the catalogue and are returned untouched, so this never overrides an
 * editor's choice.
 */
const humanise = (value: string) =>
  value === value.toLowerCase()
    ? value.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())
    : value;

/**
 * A number that counts to its new value.
 *
 * The narrowing is the product's whole point and a number that simply swaps hides it.
 * Short enough not to be in the way — the reader is choosing, not watching.
 */
function useCountUp(target: number, ms = 380): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const start = performance.now();
    const initial = from.current;
    if (initial === target) return;

    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      // easeOutCubic: fast first, settles gently on the final number.
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(initial + (target - initial) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);

  return value;
}

/**
 * Reveals a string left to right, holding the unresolved tail as em dashes.
 *
 * WHAT IT IS FOR. Reaching one model is the payoff of the whole questionnaire, and the
 * model number arriving as a plain text swap is the one moment in the tool that reads as
 * nothing happening. Resolving it makes the arrival legible — and it uses the same
 * character the schedule line above already uses for a position not yet decided, so the
 * two are speaking the same language rather than the number acquiring an effect of
 * its own.
 *
 * NOT A SCRAMBLE. No random glyphs: this is a real orderable part number, and characters
 * that are briefly wrong before becoming right is exactly the wrong impression to give
 * about a field a buyer is going to copy into a purchase order.
 *
 * 360ms, and it does not run at all under `prefers-reduced-motion` — the reader still
 * gets the number, immediately, which is the point of the reduced-motion request rather
 * than an exception to it.
 */
function useResolvedText(text: string, ms = 360): string {
  const [shown, setShown] = useState(text);
  const target = useRef(text);

  useEffect(() => {
    /*
      Nothing to do when the text is already what is on screen — which is also the
      reduced-motion path, since `shown` is seeded from `text` and never touched.
      Returning early rather than calling setState keeps this effect from scheduling a
      render that would produce the value it already has.
    */
    if (target.current === text && shown === text) return;
    target.current = text;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - (1 - t) ** 3;
      const upto = Math.round(text.length * eased);
      /* Spaces stay spaces, so the shape of the number is visible before its digits. */
      setShown(
        text.slice(0, upto) +
          [...text.slice(upto)].map((c) => (c === " " ? " " : "—")).join(""),
      );
      if (t < 1) frame = requestAnimationFrame(tick);
      else setShown(text);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `shown` is deliberately not a dependency: it changes on every frame of the
    // animation, and listing it would restart the animation from each frame it produced.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, ms]);

  return shown;
}

export function Configurator({ products, locale = "en" }: ConfiguratorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = COPY[locale];
  const steps = locale === "es" ? STEPS_ES : STEPS;
  const base = locale === "es" ? "/es" : "";

  const answers = useMemo(() => answersFromParams(searchParams), [searchParams]);
  const left = useMemo(() => remaining(products, answers), [products, answers]);
  const step = useMemo(() => nextStep(products, answers, steps), [products, answers, steps]);
  const path = useMemo(() => stepPath(products, answers, steps), [products, answers, steps]);
  const options = useMemo(
    () => (step ? optionsFor(products, answers, step.key) : []),
    [products, answers, step],
  );

  const count = useCountUp(left.length);

  const go = useCallback(
    (next: Answers) => {
      const query = answersToParams(next).toString();
      /*
        `replace`, not `push`. Five answers would otherwise be five history entries and
        the browser back button would walk the questionnaire backwards one step at a time
        — which sounds helpful and is not: a reader pressing back wants to leave, and the
        progress rail above already offers a precise way back to any earlier answer.
      */
      router.replace(query ? `${base}/configurator/?${query}` : `${base}/configurator/`, {
        scroll: false,
      });
    },
    [router, base],
  );

  const choose = useCallback(
    (key: StepKey, value: string) => go({ ...answers, [key]: value }),
    [answers, go],
  );

  /*
    ── THE PREVIEW SHOWS THE FIELD, NOT A PRODUCT ─────────────────────────────

    It used to show one photograph — the first remaining candidate — which was arbitrary
    (the reader has not chosen it and cannot tell why it is the one on screen) and, worse,
    it hid the only thing the tool actually does. Narrowing 435 products to 6 is the whole
    value, and a single unchanging square communicates none of it.

    So the panel now shows the CANDIDATES THEMSELVES, and loses tiles as the field
    shrinks: nine, then six, then two, then one — large, with its demonstration clip if it
    has one. The convergence is the interface.

    This is the one place where copying FSB exactly would have been the weaker choice.
    Their preview composes a single imaginary product from Cloudinary layers because their
    configurator builds a made-to-order handle. Ours selects from 435 things that already
    exist and have been photographed, so the honest and more useful picture is the actual
    shortlist getting shorter. It is also the thing they cannot do.

    Capped at 9. Past that the tiles are too small to recognise a part in, and the count
    beneath already says how many there really are — a wall of 60 thumbnails would say
    "lots", which the number says better.
  */
  const candidates = useMemo(() => left.filter((p) => p.heroImage?.src).slice(0, 9), [left]);
  /* One left: show it properly, with its clip if there is one. */
  const settled = left.length === 1 ? left[0] : null;
  /* Resolves when the field reaches one; empty otherwise, so the hook stays unconditional. */
  const resolvedModel = useResolvedText(settled && !settled.modelTbc ? `${settled.model} — ` : "");

  return (
    <div className="grid w-full grid-cols gap-x gap-y-48">
      {/* ── Mode, progress rail, schedule line ────────────────────────── */}
      <div className="col-span-full">
        {/*
          The switch stands where an eyebrow used to. An eyebrow reading "Guided selection"
          only restated the heading below it; the switch occupies the same line and does
          something — it says which of the two tools you are in and hands you the other.
        */}
        <FinderModeSwitch active="configurator" locale={locale} />

        {/*
          ── ONE CONTROL, NOT THREE ──────────────────────────────────────

          This row was previously two blocks stacked, and they were showing the same five
          things: a rail of question chips separated by chevrons, and under it a grey band
          holding five em dashes. Measured at 1440: the band was 1,361px wide around
          290px of content — a thousand pixels of empty grey — and the five identical
          dashes told a reader nothing about which five decisions were coming.

          So the rail, the schedule line and the revise control are now one thing: five
          columns, each with its number, the name of the decision, and either the answer
          or a dash. It fills the width with information instead of grey, it teaches the
          shape of the task before the first click, and every answered column is the
          button that changes it.

          The schedule line idea is still FSB's — their article number assembles segment
          by segment as you answer, and that is the mechanic worth having. Ours assembles
          the line a specifier writes onto a door schedule, and now it is labelled the way
          a schedule is.
        */}
        <div className="mt-32">
          <div className="flex flex-wrap items-baseline justify-between gap-16">
            <h2 className="text-c2 uppercase tracking-[0.1em] text-ink-secondary">
              {t.schedule}
            </h2>
            {Object.keys(answers).length ? (
              <button type="button" onClick={() => go({})} className="config-reset">
                {t.restart}
              </button>
            ) : null}
          </div>

          <ol className="config-rail mt-12" aria-live="polite">
            {/*
              Driven by specificationLine rather than by mapping steps directly. It
              returns one slot per step, in step order, present whether answered or not —
              which is exactly the invariant this row depends on, and it is the one that
              already has a test walking the real catalogue. Iterating steps here instead
              would leave that test guarding a function nothing calls.
            */}
            {specificationLine(answers, steps).map(({ key, value: answer }, index) => {
              const stepDef = steps[index] as ConfiguratorStep;
              const current = step?.key === key;
              /*
                A step this configuration will never be asked — because the products left
                do not differ on it — is still shown, greyed. Hiding it would make the row
                change length as you answer, and the reader would lose the shape of the
                task they are partway through.
              */
              const asked = path.includes(key);

              return (
                <li
                  key={key}
                  className={cn(
                    "config-rail-cell",
                    current && "config-rail-cell-current",
                    !asked && !answer && "config-rail-cell-skipped",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  <span className="config-rail-index">{index + 1}</span>
                  <span className="config-rail-label">{stepDef.label}</span>
                  {answer ? (
                    <button
                      type="button"
                      onClick={() => go(reviseAt(answers, key))}
                      className="config-rail-value config-rail-value-set"
                      title={`${t.back}: ${stepDef.question}`}
                    >
                      {/*
                        Keyed on the value so the one-off entrance runs when this column
                        resolves, and only then. Animating the whole row on every answer
                        would read as the page reloading.
                      */}
                      <span key={answer} className="spec-slot-resolved">
                        {humanise(answer)}
                      </span>
                    </button>
                  ) : (
                    <span className="config-rail-value config-rail-value-empty">—</span>
                  )}
                </li>
              );
            })}
          </ol>

          <p className="mt-12 max-w-[64ch] text-c2 text-ink-secondary">{t.scheduleHelp}</p>
        </div>
      </div>

      {/* ── Question, or the result ───────────────────────────────────── */}
      <div className="col-span-full xl:col-span-14">
        {step ? (
          <>
            <h2 className="text-h2 text-ink">{step.question}</h2>
            {step.hint ? (
              <p className="mt-8 max-w-[56ch] text-c1 text-ink-secondary">{step.hint}</p>
            ) : null}

            {/*
              `key` on the list forces React to remount when the question changes, which
              restarts the stagger. Without it the options mutate in place and the change
              of question is easy to miss.
            */}
            {/*
              Two columns rather than three when the options carry definitions — see
              .config-options-noted for the measure this is protecting.
            */}
            <ul
              key={step.key}
              className={cn(
                "config-options mt-32",
                options.some((o) => noteFor(o.value, locale)) && "config-options-noted",
              )}
            >
              {options.map((option, index) => {
                /*
                  What the term means, where we have written one. See OPTION_NOTES in
                  src/lib/configurator.ts: these are trade definitions, not product
                  claims, and a value with no entry shows nothing rather than a sentence
                  invented to fill the card.
                */
                const note = noteFor(option.value, locale);
                return (
                <li
                  key={option.value}
                  className="config-option-in"
                  style={{ animationDelay: `${Math.min(index, 12) * 28}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => choose(step.key, option.value)}
                    className={cn("config-option", note && "config-option-with-note")}
                    /*
                      Spelled out, because the computed name from the markup is the label
                      and the bare count run together — "Tubular locks16". The number is
                      meaningful and should be read, but as a phrase.
                    */
                    aria-label={`${humanise(option.value)} — ${t.narrowing(option.count)}`}
                  >
                    {option.image ? (
                      <span className="config-option-media">
                        <MediaPlaceholder
                          src={option.image}
                          ratio="1 / 1"
                          label=""
                          sizes="120px"
                        />
                      </span>
                    ) : null}
                    <span className="config-option-body">
                      <span className="config-option-label">{humanise(option.value)}</span>
                      <span className="config-option-count">{option.count}</span>
                      {note ? <span className="config-option-note">{note}</span> : null}
                    </span>
                  </button>
                </li>
                );
              })}
            </ul>
          </>
        ) : (
          <>
            <h2 className="text-h2 text-ink">
              {left.length === 1 ? t.matchOne : t.matchMany(left.length)}
            </h2>
            <ul className="config-options mt-32">
              {left.map((product, index) => (
                <li
                  key={product.slug}
                  className="config-option-in"
                  style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
                >
                  <Link
                    href={`${base}/products/${product.categoryPath[0]}/${product.slug}/`}
                    className="config-result"
                  >
                    {product.heroImage?.src ? (
                      <span className="config-option-media">
                        <MediaPlaceholder
                          {...product.heroImage}
                          ratio="1 / 1"
                          sizes="120px"
                        />
                      </span>
                    ) : null}
                    <span className="config-option-body">
                      {!product.modelTbc ? (
                        <span className="config-result-model">{product.model}</span>
                      ) : null}
                      <span className="config-option-label">
                        {locale === "es" ? product.nameEs ?? product.name : product.name}
                      </span>
                      <span className="config-option-count">{t.seeProduct} ›</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={`${base}/contact/?${new URLSearchParams({
                product: left[0]?.name ?? "",
                configuration: Object.entries(answers)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", "),
              }).toString()}`}
              className="config-cta mt-48"
            >
              {t.quote}
            </Link>
            <p className="mt-16 max-w-[56ch] text-c2 text-ink-secondary">{t.quoteHelp}</p>
          </>
        )}
      </div>

      {/* ── Live preview ──────────────────────────────────────────────── */}
      <aside className="col-span-full xl:col-span-8 xl:col-start-17">
        {settled ? (
          /*
            One product left. It gets the whole panel, and its demonstration clip if it
            has one — a guided selection that ends on a hand actually working the lock
            answers the question the narrowing was for, which a still cannot.
          */
          <div key={settled.slug}>
            {settled.videos?.[0] ? (
              <div className="config-preview config-preview-media">
                <ProductVideo video={settled.videos[0]} />
              </div>
            ) : settled.heroImage?.src ? (
              <div className="config-preview config-preview-media">
                <MediaPlaceholder
                  {...settled.heroImage}
                  ratio="1 / 1"
                  sizes="(min-width: 1440px) 420px, 100vw"
                />
              </div>
            ) : (
              <p className="config-preview p-24 text-c2 text-ink-secondary">{t.noPhoto}</p>
            )}
            <p className="mt-12 text-c2 text-ink">
              {settled.modelTbc ? null : (
                <span className="config-settled-model tabular-nums">{resolvedModel}</span>
              )}
              {(locale === "es" && settled.nameEs) || settled.name}
            </p>
          </div>
        ) : candidates.length ? (
          /*
            Keyed on the slug list so the grid genuinely remounts when the field changes
            and the tiles re-stagger. Keyed on nothing, React reuses the elements and
            swaps their `src`, which reads as a flicker rather than as narrowing.
          */
          /*
            NO key ON THE LIST — the tiles are keyed individually by slug.

            It used to key the <ul> on the whole slug list, which remounted every tile on
            every answer: the survivors flashed out and back in alongside the ones that
            were actually eliminated. That reads as the panel reloading, which is the
            opposite of narrowing. Keyed per tile, React keeps the candidates that
            survived and only the new arrivals run the entrance.
          */
          <ul className="config-shortlist" data-count={candidates.length}>
            {candidates.map((product, index) => (
              <li
                key={product.slug}
                className="config-option-in"
                style={{ animationDelay: `${Math.min(index, 9) * 34}ms` }}
              >
                <MediaPlaceholder
                  {...product.heroImage}
                  ratio="1 / 1"
                  sizes="(min-width: 1440px) 140px, 30vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          /*
            TWO DIFFERENT EMPTINESSES, AND THEY WERE SAYING THE SAME THING.

            "Photography for this model is being prepared" is true when candidates exist
            and none of them has a photograph yet. It is simply false when NOTHING
            matches — and that is the state a stale shared URL lands on, because a
            configuration is meant to be pasted into an email and a product can be
            withdrawn between sending and opening. Telling that reader we are working on
            the photographs sends them to wait for something that will never arrive.

            The narrowing model guarantees no CHOICE leads to zero, and this is the case
            it cannot cover: a URL assembled somewhere else.
          */
          <p className="config-preview p-24 text-c2 text-ink-secondary">
            {left.length ? t.noPhoto : t.nothingMatches}
          </p>
        )}

        <p className="mt-16 text-c2 text-ink-secondary">
          <span className="config-count tabular-nums">{count}</span>{" "}
          {/*
            The unit, not the sentence with its number cut off. It used to build
            "1 products" and then strip the leading "1 ", which produced "products" beside
            a large animated 1 — and the whole point of that number is the moment it
            reaches one.
          */}
          {Object.keys(answers).length
            ? count === 1
              ? t.unitOne
              : t.unitMany
            : t.allProducts}
        </p>

        {Object.keys(answers).length ? (
          <dl className="mt-24 border-t border-line">
            <dt className="sr-only">{t.yourChoices}</dt>
            {(Object.entries(answers) as [StepKey, string][]).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-16 border-b border-line py-12">
                <dt className="text-c2 text-ink-secondary">
                  {steps.find((s) => s.key === key)?.question}
                </dt>
                <dd className="text-c2 text-ink">{humanise(value)}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </aside>
    </div>
  );
}
