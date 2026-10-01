import bauFile from "../../content/bau-2027.json";
import { getProductBySlug } from "./products";

/**
 * The BAU 2027 column, /bau-2027/ and /de/bau-2027/ (client, 2026-09-28: layout B,
 * product first). Every string comes from content/bau-2027.json, which the copy session
 * wrote from confirmed facts only; nothing here adds a claim.
 */
export type BauLocale = "en" | "de";
export type BauCopy = (typeof bauFile)["en"];

export const bauEvent = bauFile.event;

export function bauCopy(locale: BauLocale): BauCopy {
  return bauFile[locale];
}

export interface BauFeatured {
  /** The model code as a buyer writes it: "307", "LC14". */
  model: string;
  title: string;
  body: string;
  href: string;
  image?: { src: string; label: string };
}

/**
 * The featured cards. A card with a product slug takes its photograph from that product's
 * own record (a real photograph, never a composite), and its title and body from the copy
 * split at the first colon. The master-key card has no single product, so it is text only.
 */
export function bauFeatured(locale: BauLocale): BauFeatured[] {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return bauFile.featured.map((item) => {
    const text = item[locale];
    const split = text.indexOf(": ");
    if ("slug" in item && item.slug) {
      const product = getProductBySlug(item.category, item.slug);
      if (!product) throw new Error(`BAU featured product not on the HYDE catalog: ${item.category}/${item.slug}`);
      return {
        model: product.model.split(" ")[0],
        title: split > 0 ? text.slice(0, split) : product.name,
        body: split > 0 ? text.slice(split + 2) : text,
        href: `${prefix}/products/${item.category}/${item.slug}/`,
        image: product.heroImage?.src ? { src: product.heroImage.src, label: product.heroImage.label } : undefined,
      };
    }
    return {
      model: text.split(",")[0].replace(/\.$/, ""),
      title: "",
      body: text,
      href: `${prefix}${"href" in item && item.href ? item.href : "/products/"}`,
    };
  });
}

/**
 * Messe München's own exhibitor banner (client, 2026-10-01), generated in the BAU exhibitor
 * service for Hall C4, Stand 523 and linking to our entry in the official exhibitor directory —
 * a third party confirming the stand, which is worth more to a cautious buyer than our own
 * claim. Self-hosted (originals in docs/design-references/bau-2027-official-banners/, all five
 * sizes per language) so the page loads nothing from the banner server. One placement only:
 * the 300×250 beside the “about our stand” paragraph (the sticky form column is already
 * taller than a laptop screen, so a banner there would only show at the end of the page).
 */
export const bauOfficialBanner: Record<BauLocale, { href: string; src: string; alt: string; caption: string }> = {
  en: {
    href: "https://exhibitors.bau-muenchen.com/company/1535812",
    src: "/images/bau-2027/bau-2027-banner-en-300x250.webp",
    alt: "BAU 2027, January 11–15, 2027, Messe München. Visit us in Hall C4, Stand 523",
    caption: "Our entry in the official BAU 2027 exhibitor directory",
  },
  de: {
    href: "https://exhibitors.bau-muenchen.com/firma/1535812",
    src: "/images/bau-2027/bau-2027-banner-de-300x250.webp",
    alt: "BAU 2027, 11.–15. Januar 2027, Messe München. Besuchen Sie uns in Halle C4, Stand 523",
    caption: "Unser Eintrag im offiziellen Ausstellerverzeichnis der BAU 2027",
  },
};
