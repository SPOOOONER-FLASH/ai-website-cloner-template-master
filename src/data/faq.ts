import faq from "../../content/faq.json";

/**
 * The FAQ.
 *
 * Answers are edited in the CMS. An empty `answer` is a deliberate state, not a bug:
 * questions about MOQ, lead times, payment terms and OEM policy are commercial answers
 * only the client can give, and a plausible-sounding guess on any of them would be
 * quoted back at them by a buyer. Unanswered questions are hidden from the public page
 * and listed on the internal /status dashboard instead.
 */

export interface FaqItem {
  question: string;
  answer: string;
  questionEs?: string;
  answerEs?: string;
}

export interface FaqGroup {
  title: string;
  titleEs?: string;
  items: FaqItem[];
}

export const faqGroups = faq.groups as FaqGroup[];

/**
 * Only groups that still have at least one answered question, localised.
 *
 * SPANISH FALLS BACK TO ENGLISH RATHER THAN DISAPPEARING. A question with no translation
 * yet is still a real answer to a real commercial question, and a Spanish-speaking buyer
 * is better served reading it in English than not seeing it at all — the alternative
 * would silently shorten the Spanish page as new questions are added.
 *
 * The fallback also keeps the FAQPage structured data honest: `FaqJsonLd` renders from
 * this same function, so whatever the page shows is what the markup claims. The SEO audit
 * checks exactly that (`jsonld-faq-answer-not-visible`), and it would fail the moment the
 * two diverged.
 */
export function getAnsweredFaq(locale: "en" | "es" = "en"): FaqGroup[] {
  const es = locale === "es";
  return faqGroups
    .map((group) => ({
      ...group,
      title: es ? group.titleEs ?? group.title : group.title,
      items: group.items
        .filter((item) => item.answer.trim().length > 0)
        .map((item) => ({
          ...item,
          question: es ? item.questionEs ?? item.question : item.question,
          answer: es ? item.answerEs ?? item.answer : item.answer,
        })),
    }))
    .filter((group) => group.items.length > 0);
}

/** Questions still waiting on the client. Surfaced on the internal dashboard. */
export function getUnansweredFaq(): { group: string; question: string }[] {
  return faqGroups.flatMap((group) =>
    group.items
      .filter((item) => !item.answer.trim())
      .map((item) => ({ group: group.title, question: item.question })),
  );
}
