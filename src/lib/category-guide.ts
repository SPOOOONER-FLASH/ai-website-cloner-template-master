import type { Locale } from "../data/site.ts";
import type { NewsArticle, Product } from "../data/types.ts";
import { specLabel, t as tr } from "./i18n.ts";

/**
 * The "how to choose" block on a category page, computed from the catalogue.
 *
 * ---------------------------------------------------------------------------
 * WHY IT EXISTS
 *
 * 2026-09-28 audit (QuickCreator "thin category page" article): with the product grid
 * removed, our category pages kept one summary sentence, one sourcing line and a note
 * saying the catalogue was still being prepared. The test the article proposes is the
 * right one: delete the grid and see whether the page still answers "what is in this
 * range, how do I choose, what should I read first". Ours did not.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS COMPUTED, NOT WRITTEN
 *
 * Sixteen categories in three languages is 48 intros, and a hand-written intro invites
 * plausible numbers nobody checked. Every sentence here is a count over published spec
 * rows, so it cannot state a backset the range does not have, and it changes by itself
 * when a model is added. Models that do not state a value are counted as "not stated",
 * never folded into the majority.
 *
 * Distinct per page by construction: the values, counts and linked guides come from
 * that category's own records. The FAQ it produces is rendered on the page, and the
 * FAQPage markup is built from the same items, so the two cannot drift apart.
 */

/** Rows that describe the whole range rather than a choice inside it. */
const NOT_A_CHOICE = new Set(["Application", "Product Type", "Type", "Model", "Brand"]);
/** How many spec rows the block explains. More reads as a spec dump. */
export const MAX_FACTORS = 3;
/** How many distinct values one row lists before summarizing the rest. */
const MAX_VALUES = 4;
/** Articles linked under "read before ordering". */
export const MAX_ARTICLES = 5;

export interface GuideValue {
  value: string;
  count: number;
}

export interface GuideFactor {
  /** English label: the key the positional lookup uses. */
  label: string;
  /** Label as shown in this locale. */
  display: string;
  values: GuideValue[];
  /** Distinct values beyond MAX_VALUES. */
  otherValues: number;
  /** Models that state this row at all. */
  stated: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** The localized value of one spec row, found by position like SpecMatrix does. */
function valueFor(product: Product, label: string, locale: Locale): string | null {
  const index = (product.specs ?? []).findIndex((row) => row.label === label);
  if (index < 0) return null;
  const localeRows = tr(product, "specs", locale);
  return (localeRows?.[index]?.value ?? product.specs?.[index]?.value)?.trim() || null;
}

/**
 * The spec rows that decide a purchase in this range.
 *
 * A row qualifies when at least a third of the range states it. A row with one value
 * across the range still qualifies, unlike in SpecMatrix: "all 51 state iron" does not
 * separate two models but it does answer "what is this made of", which is half of what
 * a buyer reading a category page is asking.
 */
export function guideFactors(products: Product[], locale: Locale = "en"): GuideFactor[] {
  if (products.length < 3) return [];
  const counts = new Map<string, number>();
  for (const product of products) {
    const seen = new Set<string>();
    for (const row of product.specs ?? []) {
      if (seen.has(row.label)) continue;
      seen.add(row.label);
      counts.set(row.label, (counts.get(row.label) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([label, n]) => !NOT_A_CHOICE.has(label) && n >= Math.max(3, products.length / 3))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MAX_FACTORS)
    .map(([label, stated]) => {
      const tally = new Map<string, number>();
      for (const product of products) {
        const value = valueFor(product, label, locale);
        if (value) tally.set(value, (tally.get(value) ?? 0) + 1);
      }
      const ranked = [...tally.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
      return {
        label,
        display: specLabel(label, locale),
        values: ranked.slice(0, MAX_VALUES),
        otherValues: Math.max(0, ranked.length - MAX_VALUES),
        stated,
      };
    })
    .filter((factor) => factor.values.length > 0);
}

/**
 * Guides and articles whose curated model list names a model in this range.
 *
 * `relatedModels` is written by hand per article, so a match is an editor's statement
 * that the article is about these products. Ranked by how many of the range's models
 * it names, then newest first.
 */
export function guideArticles(products: Product[], articles: NewsArticle[]): NewsArticle[] {
  const models = new Set(products.map((p) => p.model.toUpperCase()));
  return articles
    .map((article) => ({
      article,
      hits: (article.relatedModels ?? []).filter((m) => models.has(m.toUpperCase())).length,
    }))
    .filter((entry) => entry.hits > 0)
    .sort(
      (a, b) =>
        b.hits - a.hits ||
        b.article.publishedAt.localeCompare(a.article.publishedAt) ||
        a.article.slug.localeCompare(b.article.slug),
    )
    .slice(0, MAX_ARTICLES)
    .map((entry) => entry.article);
}

const COPY = {
  en: {
    list: (values: GuideValue[], others: number) =>
      values.map((v) => `${v.value} (${v.count})`).join(", ") + (others ? `, and ${others} more` : ""),
    countQ: (name: string) => `How many ${name.toLowerCase()} does Canton Hyland publish?`,
    countA: (n: number, types: string[]) =>
      `${n} published models${types.length ? `, in ${types.length} types: ${types.join(", ")}` : ""}. Every model has its own page with the specifications we have confirmed.`,
    factorQ: (label: string, name: string) =>
      `Which ${label.toLowerCase()} options are available for Canton Hyland ${name.toLowerCase()}?`,
    factorA: (list: string, stated: number, total: number) =>
      `By number of published models: ${list}.${stated < total ? ` ${total - stated} of ${total} models do not state this yet; ask the export team before ordering.` : ""}`,
  },
  es: {
    list: (values: GuideValue[], others: number) =>
      values.map((v) => `${v.value} (${v.count})`).join(", ") + (others ? ` y ${others} más` : ""),
    countQ: (name: string) => `¿Cuántos modelos de ${name.toLowerCase()} publica Canton Hyland?`,
    countA: (n: number, types: string[]) =>
      `${n} modelos publicados${types.length ? `, en ${types.length} tipos: ${types.join(", ")}` : ""}. Cada modelo tiene su propia página con las especificaciones confirmadas.`,
    factorQ: (label: string, name: string) =>
      `¿Qué opciones de ${label.toLowerCase()} hay en ${name.toLowerCase()} de Canton Hyland?`,
    factorA: (list: string, stated: number, total: number) =>
      `Por número de modelos publicados: ${list}.${stated < total ? ` ${total - stated} de ${total} modelos aún no indican este dato; consulte al equipo de exportación antes de pedir.` : ""}`,
  },
  pt: {
    list: (values: GuideValue[], others: number) =>
      values.map((v) => `${v.value} (${v.count})`).join(", ") + (others ? ` e mais ${others}` : ""),
    countQ: (name: string) => `Quantos modelos de ${name.toLowerCase()} a Canton Hyland publica?`,
    countA: (n: number, types: string[]) =>
      `${n} modelos publicados${types.length ? `, em ${types.length} tipos: ${types.join(", ")}` : ""}. Cada modelo tem a sua própria página com as especificações confirmadas.`,
    factorQ: (label: string, name: string) =>
      `Que opções de ${label.toLowerCase()} existem em ${name.toLowerCase()} da Canton Hyland?`,
    factorA: (list: string, stated: number, total: number) =>
      `Por número de modelos publicados: ${list}.${stated < total ? ` ${total - stated} de ${total} modelos ainda não indicam este dado; consulte a equipe de exportação antes de encomendar.` : ""}`,
  },
} as const;

function copyFor(locale: Locale) {
  return locale === "es" ? COPY.es : locale === "pt" ? COPY.pt : COPY.en;
}

/** "60/70mm (40), 60mm (3)" — the value list used in both the table and the FAQ. */
export function valueList(factor: GuideFactor, locale: Locale = "en"): string {
  return copyFor(locale).list(factor.values, factor.otherValues);
}

/**
 * Questions this category page can answer from its own records.
 *
 * `types` are the category's sub-category names that actually hold a model, in this
 * locale. Returns nothing for a range too small to have factors, rather than a lone
 * count question.
 */
export function categoryFaqItems(
  name: string,
  products: Product[],
  types: string[],
  locale: Locale = "en",
): FaqItem[] {
  const factors = guideFactors(products, locale);
  if (!factors.length) return [];
  const c = copyFor(locale);
  return [
    { question: c.countQ(name), answer: c.countA(products.length, types) },
    ...factors.map((factor) => ({
      question: c.factorQ(factor.display, name),
      answer: c.factorA(valueList(factor, locale), factor.stated, products.length),
    })),
  ];
}
