import type { PromoCard } from "@/data/types";

/** Select one compact promotion so campaign cards never stack over page imagery. */
export function selectActivePromoCard(
  cards: PromoCard[],
  dismissedHrefs: string[],
): PromoCard | undefined {
  return cards.find((card) => !dismissedHrefs.includes(card.ctaHref));
}

export function localisePromoCardCopy(card: PromoCard, locale: "en" | "es") {
  const spanish = locale === "es";
  const title = spanish ? card.titleEs ?? card.title : card.title;
  return {
    title,
    titleLight: spanish ? card.titleLightEs ?? card.titleLight : card.titleLight,
    body: spanish ? card.bodyEs ?? card.body : card.body,
    ctaLabel: spanish ? card.ctaLabelEs ?? card.ctaLabel : card.ctaLabel,
    ctaHref: spanish ? card.ctaHrefEs ?? card.ctaHref : card.ctaHref,
    closeLabel: `${spanish ? "Cerrar" : "Close"}: ${title}`,
  };
}
