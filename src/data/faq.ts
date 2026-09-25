import faq from "../../content/faq.json";
import type { Locale } from "@/data/site";
import { t } from "../lib/i18n.ts";
import { overlayFor, tx } from "../lib/i18n.ts";

/**
 * The FAQ.
 *
 * Answers are edited in the CMS. An empty `answer` is a deliberate state, not a bug:
 * questions about MOQ, lead times, payment terms and OEM policy are commercial answers
 * only the client can give, and a plausible-sounding guess on any of them would be
 * quoted back at them by a buyer. Unanswered questions are hidden from the public page
 * and listed by `npm run status` instead (the /status page was taken off the public site on 2026-09-23).
 */

export interface FaqItem {
  question: string;
  answer: string;
  questionEs?: string;
  answerEs?: string;
  questionPt?: string;
  answerPt?: string;
}

export interface FaqGroup {
  title: string;
  titleEs?: string;
  titlePt?: string;
  items: FaqItem[];
}

export const faqGroups = faq.groups as FaqGroup[];

/**
 * Only groups that still have at least one answered question, localised.
 *
 * A TRANSLATION FALLS BACK TO ENGLISH RATHER THAN DISAPPEARING. A question with no
 * translation yet is still a real answer to a real commercial question, and a buyer is
 * better served reading it in English than not seeing it at all — the alternative would
 * silently shorten the Spanish and Portuguese pages as new questions are added.
 *
 * The fallback also keeps the FAQPage structured data honest: `FaqJsonLd` renders from
 * this same function, so whatever the page shows is what the markup claims. The SEO audit
 * checks exactly that (`jsonld-faq-answer-not-visible`), and it would fail the moment the
 * two diverged.
 */
export function getAnsweredFaq(locale: Locale = "en"): FaqGroup[] {
  /*
    English, never the other translation. A Portuguese page that quietly falls back to
    Spanish looks finished and is not, and the two are close enough that a reader
    notices the wrongness before they notice the language.
  */
  /* The seven overlay locales keep their FAQ in content/i18n/<code>/faq.json, keyed by
     the English question, so a question reworded in English visibly loses its answer. */
  const overlay = overlayFor(locale)?.faq;

  return faqGroups
    .map((group) => ({
      ...group,
      title: tx(locale, group.title, { es: group.titleEs, pt: group.titlePt }),
      items: group.items
        .filter((item) => item.answer.trim().length > 0)
        .map((item) => {
          const translated = overlay?.[item.question];
          return {
            ...item,
            question: translated?.question ?? t(item, "question", locale),
            answer: translated?.answer ?? t(item, "answer", locale),
          };
        }),
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
