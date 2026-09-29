import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import type { FAQPage, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { categoryFaqItems } from "@/lib/category-guide";
import { specValueFor } from "@/lib/imperial";
import { specLabel, t as tr, tx } from "@/lib/i18n";

/**
 * Per-model figures and the computed questions on a collection page.
 *
 * The collection pages scored 38–41 on scripts/audit-geo-citability.mjs (2026-09-28), the
 * lowest indexable page type: a count, a definition and a list of names, 1–2 figures per
 * page. The figures a buyer asks for are already on each record — a latch's backset, an
 * indicator's plate size, a door viewer's door thickness — so this prints, per model, the
 * spec rows that carry a measurement (up to three), in the reader's language, with the
 * record's own units. Nothing is summarised or rounded; a model with no measured row shows
 * its material instead, and a model with neither is listed by name only.
 *
 * The questions come from categoryFaqItems (src/lib/category-guide.ts) over the same
 * products, rendered visibly and mirrored in one FAQPage — the rule every FAQ block on the
 * site follows. A collection of fewer than three models gets no questions.
 */
const MEASURED = /\d\s?(?:mm|cm|kg|°|")|\d\s?[×x*]\s?\d/i;
const MAX_ROWS = 3;

function figuresFor(product: Product, locale: Locale): string[] {
  const english = product.specs ?? [];
  const localised = tr(product, "specs", locale) ?? english;
  const out: string[] = [];
  english.forEach((row, i) => {
    if (out.length >= MAX_ROWS || !row.value || !MEASURED.test(row.value)) return;
    const value = localised[i]?.label === row.label ? localised[i].value : row.value;
    out.push(`${specLabel(row.label, locale)} ${specValueFor(value, locale)}`);
  });
  if (!out.length) {
    const material = english.findIndex((row) => row.label === "Material" && row.value);
    if (material >= 0) out.push(`${specLabel("Material", locale)} ${localised[material]?.value ?? english[material].value}`);
  }
  return out;
}

export function CollectionFacts({ products, name, locale = "en" }: { products: Product[]; name: string; locale?: Locale }) {
  const rows = products.map((p) => ({ product: p, figures: figuresFor(p, locale) })).filter((r) => r.figures.length);
  const faq = categoryFaqItems(name, products, [], locale);
  if (!rows.length && !faq.length) return null;
  const schema: WithContext<FAQPage> | null = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      }
    : null;

  return (
    <section className="layout mt-64 lg:mt-96" aria-labelledby="collection-facts-heading">
      {schema ? <JsonLd data={schema} /> : null}
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full lg:col-span-7 xl:col-span-14">
          <h2 id="collection-facts-heading" className="drawer-eyebrow">
            {tx(locale, "{name}: the published figures, model by model", {
              es: "{name}: las cifras publicadas, modelo a modelo",
              pt: "{name}: os valores publicados, modelo a modelo",
            }).replace("{name}", name)}
          </h2>
          {rows.length ? (
            <ul className="mt-16 border-t border-line">
              {rows.map(({ product, figures }) => (
                <li key={product.slug} className="border-b border-line py-12 text-c1 text-ink">
                  <span className="font-semibold">{product.modelTbc ? tr(product, "name", locale) : product.model}</span>
                  {" — "}
                  {figures.join("; ")}.
                </li>
              ))}
            </ul>
          ) : null}
          {faq.length ? (
            <dl className="mt-32">
              {faq.map((item) => (
                <div key={item.question} className="border-b border-line py-16">
                  <dt className="text-c1 text-ink">
                    <h3 className="text-c1 font-semibold text-ink">{item.question}</h3>
                  </dt>
                  <dd className="mt-4 text-c2 text-ink-secondary">{item.answer}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}
