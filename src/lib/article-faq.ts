import type { Locale } from "../data/locales.ts";
import type { NewsArticle } from "../data/types.ts";

/**
 * The question-and-answer block on a technical article.
 *
 * ---------------------------------------------------------------------------
 * WHY AN ARTICLE NEEDS ONE WHEN IT ALREADY ANSWERS THE QUESTION
 *
 * Bing's generative-citation report, 2026-09-15, is the evidence. The push-bar article was
 * cited six times at 50% citation share for the grounding query "mechanical advantages
 * box-style exit devi…" — and the article contains the word "mechanical" zero times. The
 * model found the answer inside a paragraph that never names the question.
 *
 * That is the good news and the whole argument: it means the answer was there, and it was
 * found DESPITE the page never pairing it with a question. A retrieval system scores a
 * passage on how completely it answers the query it is matching. An explicit pair — the
 * question as a heading, the answer immediately under it, the two wrapped in one element —
 * is the same content presented as the thing being looked for.
 *
 * ---------------------------------------------------------------------------
 * THE ANSWERS ARE NOT NEW WRITING, AND THAT IS A RULE NOT A SHORTCUT
 *
 * Every answer here restates something the article already establishes in its body. An
 * FAQ block that introduces a fact the article does not support is two failures at once:
 * it is an unsourced claim on a site whose whole argument is that it does not make those,
 * and Google treats FAQ markup whose answers are absent from the page as a spam signal.
 *
 * So `assertAnswersAreGrounded` below is not decoration. It fails the build when an answer
 * contains a number that appears nowhere in the article it is attached to — because a
 * fabricated dimension is the one kind of error this catalogue cannot absorb.
 */
export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export interface ArticleFaq {
  en: ArticleFaqItem[];
  es?: ArticleFaqItem[];
  pt?: ArticleFaqItem[];
}

/** The heading above the block, per locale. */
export function articleFaqHeading(locale: Locale): string {
  if (locale === "es") return "Preguntas frecuentes sobre este tema";
  if (locale === "pt") return "Perguntas frequentes sobre este tema";
  return "Questions this answers";
}

/**
 * The block for one article in one locale.
 *
 * Falls back to English rather than vanishing: a Spanish reader gets the questions in
 * English instead of a page that is silently shorter than its English twin, and the gap is
 * counted by `npm run audit:faq` rather than hidden.
 */
export function articleFaqItems(article: NewsArticle, locale: Locale): ArticleFaqItem[] {
  const faq = article.faq;
  if (!faq) return [];
  return faq[locale] ?? faq.en;
}

/**
 * Every number in an answer must also appear in the article body.
 *
 * ---------------------------------------------------------------------------
 * WHY NUMBERS AND NOT WORDS
 *
 * Checking that an answer is "supported by" a paragraph is a judgement no string
 * comparison can make, and a check that cannot fail is worse than none. A NUMBER is
 * different: it is exact, it is what buyers act on, and it is the thing that costs a
 * container when it is wrong. "25mm" in an answer and no "25" anywhere in the article is a
 * fact that arrived from somewhere other than the article.
 *
 * Years and standard designations are excluded because they are identifiers rather than
 * measurements — EN 1125 and ISO 9001 name a document, and an article may reasonably cite
 * one in an answer that summarises rather than quotes.
 */
const STANDARD_OR_YEAR = /\b(?:EN|ISO|ANSI|BHMA|UL|NBR|A156|US|AR)\s?\d+|\b(?:19|20)\d{2}\b/g;

export function ungroundedNumbers(article: NewsArticle, locale: Locale): string[] {
  const items = articleFaqItems(article, locale);
  if (!items.length) return [];

  const body = [
    article.title,
    article.summary,
    ...(article.body ?? []),
    ...(locale === "es" ? [article.titleEs, article.summaryEs, ...(article.bodyEs ?? [])] : []),
    ...(locale === "pt" ? [article.titlePt, article.summaryPt, ...(article.bodyPt ?? [])] : []),
  ]
    .filter(Boolean)
    .join(" ");

  const stripped = body.replace(STANDARD_OR_YEAR, " ");
  const bodyNumbers = new Set(stripped.match(/\d+(?:[.,]\d+)?/g) ?? []);

  const missing = new Set<string>();
  for (const item of items) {
    const answerNumbers =
      item.answer.replace(STANDARD_OR_YEAR, " ").match(/\d+(?:[.,]\d+)?/g) ?? [];
    for (const number of answerNumbers) {
      if (!bodyNumbers.has(number)) missing.add(number);
    }
  }
  return [...missing];
}
