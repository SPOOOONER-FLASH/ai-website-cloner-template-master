import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import type { FAQPage, WithContext } from "schema-dts";
import { CATEGORY_GUIDES } from "@/data/category-buying-guides";
import { categoryFacts } from "@/lib/category-facts";
import { dict, fill, tx } from "@/lib/i18n";
import { JsonLd } from "./JsonLd";

/**
 * "How buyers specify …" — the buying guide under a category page.
 *
 * Copy: src/data/category-buying-guides.ts (why it exists, and the rule that every figure
 * is the catalogue's, not the writer's). Facts: src/lib/category-facts.ts. An item whose
 * facts are missing is not rendered, and the FAQPage markup below is built from the same
 * rendered list, so the markup can never claim an answer the page does not show.
 */
export function guideBlocks(categorySlug: string, products: Product[], locale: Locale) {
  const guide = CATEGORY_GUIDES[categorySlug];
  if (!guide) return null;
  const facts = categoryFacts(products, locale);
  const vars = Object.fromEntries(Object.entries(facts).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string | number>;
  const have = (key: string) => key in vars;
  const items = guide.items
    .filter((item) => (item.needs ?? []).every(have))
    .map((item) => ({
      question: fill(dict(item.question, locale), vars),
      answer: fill(dict(item.answer, locale), vars),
    }));
  return { intro: fill(dict(guide.intro, locale), vars), items };
}

export function CategoryBuyingGuide({
  categorySlug,
  categoryName,
  products,
  locale = "en",
  withSchema = true,
}: {
  categorySlug: string;
  categoryName: string;
  products: Product[];
  locale?: Locale;
  /** false when CategoryGuide on the same page carries these items in its FAQPage. */
  withSchema?: boolean;
}) {
  const blocks = guideBlocks(categorySlug, products, locale);
  if (!blocks) return null;
  const heading = tx(locale, "How buyers specify {category}", {
    es: "Cómo se especifica {category}",
    pt: "Como se especifica {category}",
  }).replace("{category}", categoryName.toLowerCase());
  const faq: WithContext<FAQPage> | null = withSchema && blocks.items.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blocks.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <section className="layout mt-64 lg:mt-96" aria-labelledby="category-buying-guide">
      {faq ? <JsonLd data={faq} /> : null}
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full lg:col-span-5 xl:col-span-9">
          <h2 id="category-buying-guide" className="text-h2 text-ink">
            {heading}
          </h2>
          <p className="mt-24 max-w-[62ch] text-c1 text-ink-secondary">{blocks.intro}</p>
        </div>
        {blocks.items.length ? (
          <dl className="col-span-full border-t border-ink lg:col-span-7 lg:col-start-6 xl:col-span-14 xl:col-start-11">
            {blocks.items.map((item) => (
              <div key={item.question} className="border-b border-line py-20">
                <dt className="text-c1 font-semibold text-ink">
                  <h3 className="text-c1 font-semibold text-ink">{item.question}</h3>
                </dt>
                <dd className="mt-8 max-w-[70ch] text-c1 text-ink-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
