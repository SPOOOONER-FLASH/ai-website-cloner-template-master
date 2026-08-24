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
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups = faq.groups as FaqGroup[];

/** Only groups that still have at least one answered question. */
export function getAnsweredFaq(): FaqGroup[] {
  return faqGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.answer.trim().length > 0),
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
