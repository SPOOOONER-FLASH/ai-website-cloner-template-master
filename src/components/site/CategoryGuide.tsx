import Link from "next/link";
import type { FAQPage, WithContext } from "schema-dts";
import type { Category, NewsArticle, Product } from "@/data/types";
import type { Locale } from "@/data/site";
import { positioningFor } from "@/data/category-positioning";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedNews } from "@/data/news";
import { JsonLd } from "@/components/site/JsonLd";
import { dict, fill, t as tr } from "@/lib/i18n";
import { hasPortugueseMirror, hasSpanishMirror } from "@/lib/spanish-mirror";
import { categoryFaqItems, guideArticles, guideFactors, valueList } from "@/lib/category-guide";

/**
 * "How to choose" for one category: what the range covers, what to read before ordering,
 * and the questions its own records answer. Every figure is counted from published spec
 * rows — see src/lib/category-guide.ts for why nothing here is hand-written.
 */
const COPY = {
  en: {
    heading: "Choosing {name}",
    intro: "What the {n} published models in this range state, counted from their own specification tables.",
    spec: "Specification",
    values: "Published values (number of models)",
    notStated: "{missing} of {n} models do not state this yet.",
    read: "Read before ordering",
    compare: "Compare every model side by side",
    finder: "Filter the catalog by material, finish and door type",
    faq: "Questions about {name}",
  },
  es: {
    heading: "Cómo elegir {name}",
    intro: "Lo que indican los {n} modelos publicados de esta gama, contado a partir de sus propias fichas técnicas.",
    spec: "Especificación",
    values: "Valores publicados (número de modelos)",
    notStated: "{missing} de {n} modelos aún no indican este dato.",
    read: "Lectura antes de pedir",
    compare: "Comparar todos los modelos en paralelo",
    finder: "Filtrar el catálogo por material, acabado y tipo de puerta",
    faq: "Preguntas sobre {name}",
  },
  pt: {
    heading: "Como escolher {name}",
    intro: "O que indicam os {n} modelos publicados desta gama, contado a partir das suas próprias fichas técnicas.",
    spec: "Especificação",
    values: "Valores publicados (número de modelos)",
    notStated: "{missing} de {n} modelos ainda não indicam este dado.",
    read: "Leitura antes de encomendar",
    compare: "Comparar todos os modelos lado a lado",
    finder: "Filtrar o catálogo por material, acabamento e tipo de porta",
    faq: "Perguntas sobre {name}",
  },
} as const;

function availableIn(locale: Locale, path: string): boolean {
  if (locale === "es") return hasSpanishMirror(path);
  if (locale === "pt") return hasPortugueseMirror(path);
  return true;
}

export function CategoryGuide({
  category,
  products,
  locale = "en",
  extraFaq = [],
}: {
  category: Category;
  products: Product[];
  locale?: Locale;
  /** Questions another block on the same page renders (CategoryBuyingGuide); one FAQPage per page. */
  extraFaq?: { question: string; answer: string }[];
}) {
  const factors = guideFactors(products, locale);
  if (!factors.length) return null;

  const t = dict(COPY, locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  const name = tr(category, "name", locale);
  const pitch = positioningFor([category.slug]);
  const pitchText = pitch ? (locale === "es" ? pitch.pitchEs : locale === "pt" ? pitch.pitchPt : pitch.pitch) : null;

  const types = (category.children ?? [])
    .filter((child) => products.some((p) => p.categoryPath[1] === child.slug))
    .map((child) => tr(child, "name", locale));
  const faq = categoryFaqItems(name, products, types, locale);

  const tagged: Array<{ article: NewsArticle; section: "guides" | "news" }> = [
    ...getPublishedGuides().map((article) => ({ article, section: "guides" as const })),
    ...getPublishedNews().map((article) => ({ article, section: "news" as const })),
  ].filter(({ article, section }) => availableIn(locale, `/${section}/${article.slug}`));
  const sectionOf = new Map(tagged.map(({ article, section }) => [article.slug, section]));
  const articles = guideArticles(
    products,
    tagged.map(({ article }) => article),
  );

  const faqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...faq, ...extraFaq].map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="category-guide-heading">
      {faq.length || extraFaq.length ? <JsonLd data={faqSchema} /> : null}
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full xl:col-span-10">
          <h2 id="category-guide-heading" className="text-h2 text-ink">
            {fill(t.heading, { name: name.toLowerCase() })}
          </h2>
          {pitchText ? <p className="mt-16 max-w-[60ch] text-lead text-ink">{pitchText}</p> : null}
          <p className="mt-16 max-w-[60ch] text-c1 text-ink-secondary">
            {fill(t.intro, { n: products.length })}
          </p>
        </div>

        <div className="col-span-full xl:col-span-12 xl:col-start-13">
          <table className="w-full border-collapse text-c1">
            <thead>
              <tr className="border-y border-line">
                <th scope="col" className="py-12 pe-16 text-start font-regular text-ink-secondary">{t.spec}</th>
                <th scope="col" className="py-12 text-start font-regular text-ink-secondary">{t.values}</th>
              </tr>
            </thead>
            <tbody>
              {factors.map((factor) => (
                <tr key={factor.label} className="border-b border-line align-top">
                  <th scope="row" className="py-12 pe-16 text-start font-regular text-ink">{factor.display}</th>
                  <td className="py-12 tabular-nums text-ink">
                    {valueList(factor, locale)}
                    {factor.stated < products.length ? (
                      <span className="mt-4 block text-c2 text-ink-secondary">
                        {fill(t.notStated, { missing: products.length - factor.stated, n: products.length })}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-48 text-h4 text-ink">{t.read}</h3>
          <ul className="mt-16 space-y-8 text-c1">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`${prefix}/${sectionOf.get(article.slug)}/${article.slug}/`}
                  className="text-ink underline decoration-line underline-offset-4 hover:text-brand-hover"
                >
                  {tr(article, "title", locale)}
                </Link>
              </li>
            ))}
            {products.length >= 3 ? (
              <li>
                <Link
                  href={`${prefix}/compare/${category.slug}/`}
                  className="text-ink underline decoration-line underline-offset-4 hover:text-brand-hover"
                >
                  {t.compare}
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                href={`${prefix}/product-finder/`}
                className="text-ink underline decoration-line underline-offset-4 hover:text-brand-hover"
              >
                {t.finder}
              </Link>
            </li>
          </ul>
        </div>

        {faq.length ? (
          <div className="col-span-full mt-24 border-t border-line pt-24 xl:col-span-12 xl:col-start-13">
            <h3 className="text-h3 text-ink">{fill(t.faq, { name: name.toLowerCase() })}</h3>
            <dl className="mt-16">
              {faq.map((item) => (
                <div key={item.question} className="border-b border-line py-16">
                  <dt className="text-c1 text-ink">{item.question}</dt>
                  <dd className="mt-4 text-c2 text-ink-secondary">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  );
}
