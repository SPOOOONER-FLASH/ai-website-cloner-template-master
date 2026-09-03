"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { cn } from "@/lib/utils";
import type { FinderProduct } from "@/lib/product-finder";
import {
  STEPS,
  STEPS_ES,
  answersFromParams,
  answersToParams,
  nextStep,
  optionsFor,
  remaining,
  reviseAt,
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
    eyebrow: "Guided selection",
    restart: "Start again",
    back: "Change",
    matchOne: "1 model matches",
    matchMany: (n: number) => `${n} models match`,
    narrowing: (n: number) => `${n} products`,
    seeProduct: "Open the product page",
    quote: "Request a quote for this configuration",
    quoteHelp:
      "The link carries your selections, so the export team sees the same configuration you do.",
    yourChoices: "Your selection",
    allProducts: "Every model in the catalogue",
    step: "Step",
    of: "of",
    noPhoto: "Photography for this model is being prepared.",
  },
  es: {
    eyebrow: "Selección guiada",
    restart: "Empezar de nuevo",
    back: "Cambiar",
    matchOne: "1 modelo coincide",
    matchMany: (n: number) => `${n} modelos coinciden`,
    narrowing: (n: number) => `${n} productos`,
    seeProduct: "Abrir la ficha del producto",
    quote: "Solicitar cotización de esta configuración",
    quoteHelp:
      "El enlace lleva sus selecciones, así el equipo de exportación ve la misma configuración que usted.",
    yourChoices: "Su selección",
    allProducts: "Todos los modelos del catálogo",
    step: "Paso",
    of: "de",
    noPhoto: "La fotografía de este modelo está en preparación.",
  },
} as const;

/** Slugs read better as words in the answer summary. */
const humanise = (value: string) =>
  value.includes("-") && value === value.toLowerCase()
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
    The preview follows the leading candidate. It is deliberately taken from the products
    still matching rather than from the option being hovered: the picture should show
    where the reader IS, not where a passing cursor might go.
  */
  const preview = left.find((p) => p.heroImage?.src) ?? null;

  return (
    <div className="grid w-full grid-cols gap-x gap-y-48">
      {/* ── Progress rail ─────────────────────────────────────────────── */}
      <div className="col-span-full">
        <p className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">{t.eyebrow}</p>
        <ol className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-8">
          {path.map((key, index) => {
            const stepDef = steps.find((s) => s.key === key) as ConfiguratorStep;
            const answer = answers[key];
            const current = step?.key === key;
            return (
              <li key={key} className="flex items-center gap-8">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-ink-tertiary">
                    ›
                  </span>
                ) : null}
                {answer ? (
                  <button
                    type="button"
                    onClick={() => go(reviseAt(answers, key))}
                    className="config-crumb config-crumb-done"
                    title={`${t.back}: ${stepDef.question}`}
                  >
                    {humanise(answer)}
                  </button>
                ) : (
                  <span
                    aria-current={current ? "step" : undefined}
                    className={cn("config-crumb", current && "config-crumb-current")}
                  >
                    {stepDef.question}
                  </span>
                )}
              </li>
            );
          })}
          {Object.keys(answers).length ? (
            <li className="ml-8">
              <button type="button" onClick={() => go({})} className="config-reset">
                {t.restart}
              </button>
            </li>
          ) : null}
        </ol>
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
            <ul key={step.key} className="config-options mt-32">
              {options.map((option, index) => (
                <li
                  key={option.value}
                  className="config-option-in"
                  style={{ animationDelay: `${Math.min(index, 12) * 28}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => choose(step.key, option.value)}
                    className="config-option"
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
                    </span>
                  </button>
                </li>
              ))}
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
        <div className="config-preview">
          {preview?.heroImage?.src ? (
            /*
              Keyed on the slug so a different product genuinely remounts and the
              cross-fade runs. Keyed on nothing, React reuses the element and swaps the
              src, which reads as a flicker rather than a change.
            */
            <div key={preview.slug} className="config-preview-media">
              <MediaPlaceholder
                {...preview.heroImage}
                ratio="1 / 1"
                sizes="(min-width: 1440px) 420px, 100vw"
              />
            </div>
          ) : (
            <p className="p-24 text-c2 text-ink-secondary">{t.noPhoto}</p>
          )}
        </div>

        <p className="mt-16 text-c2 text-ink-secondary">
          <span className="config-count tabular-nums">{count}</span>{" "}
          {Object.keys(answers).length ? t.narrowing(count).replace(`${count} `, "") : t.allProducts}
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
