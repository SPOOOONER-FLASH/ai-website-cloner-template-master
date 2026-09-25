import demand from "../../docs/research/2026-09-11-alibaba-product-performance.json";
import { products, isPublished } from "./products";
import type { Product } from "./types";
import type { Locale } from "./site";
import { dict } from "../lib/i18n.ts";

/**
 * The models buyers actually asked about, as a homepage rail.
 *
 * ---------------------------------------------------------------------------
 * WHY THE SELECTION IS DATA AND THE NUMBERS ARE NOT PUBLISHED
 *
 * The client supplied their own Alibaba back-office figures on 2026-09-11 — thirty-day
 * impressions and ninety-day enquiry counts per listing. That is the only evidence we
 * have of what buyers want, and it is far better than picking flagship models by taste:
 * 307 had the fewest impressions on the sheet and the most enquiries, which no amount of
 * judgement would have guessed.
 *
 * So the ORDER here is real demand. The COUNTS stay out of the page. They are single
 * digits, and "5 enquiries" printed on a homepage reads as a small supplier no matter how
 * healthy the conversion rate behind it is — the honest thing and the flattering thing
 * happen to agree, which is rare enough to say out loud. The numbers live in
 * docs/research/2026-09-11-alibaba-product-performance.json where the next session can
 * check the ranking against them.
 *
 * ---------------------------------------------------------------------------
 * WHY 307 AND 311 ARE EXCLUDED
 *
 * They are the two models in the flagship block directly above. A rail that repeats the
 * section above it teaches the reader that the page is padding.
 */

interface DemandRow {
  model?: string;
  inquiries90d?: number;
  exposure30d?: number;
}

/** Already shown in FlagshipTooling, higher up the same page. */
const SHOWN_ABOVE = new Set(["307", "311"]);

/**
 * Ranked by enquiries first, impressions second.
 *
 * Enquiries first because the two disagree and enquiries are the thing we are optimising
 * for: the master key listing drew 256 impressions and three enquiries while a 47-view
 * cylinder drew two. Impressions break the tie rather than setting the order.
 */
export function demandRankedModels(): string[] {
  const rows = (demand as { products: DemandRow[] }).products;
  const best = new Map<string, { inquiries: number; exposure: number }>();

  for (const row of rows) {
    if (!row.model || SHOWN_ABOVE.has(row.model)) continue;
    const key = row.model.toUpperCase();
    const current = best.get(key);
    const inquiries = row.inquiries90d ?? 0;
    const exposure = row.exposure30d ?? 0;
    /*
      A model can appear twice — 307 has two listings, which is itself a finding (they
      split the impressions). Keep the stronger row so a duplicate cannot demote a model.
    */
    if (!current || inquiries > current.inquiries || (inquiries === current.inquiries && exposure > current.exposure)) {
      best.set(key, { inquiries, exposure });
    }
  }

  return [...best.entries()]
    .sort((a, b) => b[1].inquiries - a[1].inquiries || b[1].exposure - a[1].exposure)
    .map(([model]) => model);
}

/**
 * The rail's products, in demand order.
 *
 * Only published models: a model with no photograph is off every browse surface, and
 * putting one here would advertise a page that says "information available on request".
 * Capped at eight because the rail is a rail, not a second catalogue.
 */
export function demandShowcaseProducts(limit = 8): Product[] {
  const ranked = demandRankedModels();
  const byModel = new Map(products.map((product) => [product.model.toUpperCase(), product]));

  const picked: Product[] = [];
  for (const model of ranked) {
    // Client retired 305 from homepage promotion on 2026-09-15; historical data stays intact.
    if (model === "305") continue;
    const product = byModel.get(model);
    if (!product || !isPublished(product)) continue;
    picked.push(product);
    if (picked.length === limit) break;
  }
  return picked;
}

export const demandShowcaseCopy = {
  en: {
    eyebrow: "What buyers asked for this quarter",
    title: "Most-requested models",
    body: "Selected from ninety days of inquiries on our own Alibaba storefront rather than from a shortlist we drew up ourselves — the two do not agree, which is the point of looking.",
    cta: "Ask about any of these",
  },
  es: {
    eyebrow: "Lo que pidieron los compradores este trimestre",
    title: "Modelos más solicitados",
    body: "Seleccionados a partir de noventa días de consultas en nuestra propia tienda de Alibaba, y no de una lista que hubiéramos hecho nosotros — ambas no coinciden, que es justamente el motivo de mirar.",
    cta: "Consultar cualquiera de estos",
  },
  pt: {
    eyebrow: "O que os compradores pediram neste trimestre",
    title: "Modelos mais procurados",
    body: "Selecionados a partir de noventa dias de consultas na nossa própria loja do Alibaba, e não de uma lista que nós mesmos tivéssemos feito — as duas não coincidem, e é justamente por isso que se olha.",
    cta: "Perguntar sobre qualquer um deles",
  },
} as const;

export function demandShowcaseText(locale: Locale = "en") {
  return dict(demandShowcaseCopy, locale);
}
