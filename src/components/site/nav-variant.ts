import type { Locale } from "@/data/locales";
import { tx } from "@/lib/i18n-client";

/*
  Navigation preview switch, 2026-10-05. Client:「客户很多第一反应找我们要目录……把点击的逻辑
  做好……给几个预览吧」, with a buyer's first email asking only for the catalog, wholesale
  prices and minimum order quantities.

  Those three nouns — catalog, price, MOQ — appeared nowhere in the header. The catalog sat
  under "Buy it now › Downloads", the MOQ answer under "FAQ", and on a phone "Buy it now"
  opened a drawer asking "What are you trying to specify?", an architect's question put to
  an importer. Each variant below fixes that at a different cost:

    current      the live header, unchanged.
    procurement  "Catalog & prices" replaces "Buy it now" and opens a shelf that answers the
                 three questions; a separate "Request a quote" action; /wholesale/ is the
                 one page that answers all three. Recommended.
    light        keep five items; rename "Buy it now" to "Catalog & quote" and put the
                 catalog PDF first in its shelf. Lowest change.
    strip        procurement, plus a thin always-visible line above the nav row with the
                 catalog download, MOQ range and lead time. Most visible, one more row.

  Chosen at build time with NEXT_PUBLIC_NAV_VARIANT so each preview is the real site, not a
  mock-up. When the client picks one, the losers and this switch are deleted.
*/
export type NavVariant = "current" | "procurement" | "light" | "strip";

const VARIANTS: NavVariant[] = ["current", "procurement", "light", "strip"];
const requested = process.env.NEXT_PUBLIC_NAV_VARIANT as NavVariant | undefined;

export const NAV_VARIANT: NavVariant = requested && VARIANTS.includes(requested) ? requested : "current";

/** Variants whose header names catalog and prices and adds the /wholesale/ hub. */
export const buyerFirst = NAV_VARIANT === "procurement" || NAV_VARIANT === "strip";

/* The catalog is one English PDF; its URL never takes a locale prefix (see downloads.json). */
export const CATALOG_PDF = "/downloads/hyde-export-catalogue-2026.pdf";

export function buyerLabels(locale: Locale) {
  return {
    catalogPrices: tx(locale, "Catalog & prices", { es: "Catálogo y precios", pt: "Catálogo e preços" }),
    catalogQuote: tx(locale, "Catalog & quote", { es: "Catálogo y cotización", pt: "Catálogo e cotação" }),
    requestQuote: tx(locale, "Request a quote", { es: "Solicitar cotización", pt: "Pedir orçamento" }),
    requestQuoteDetail: tx(locale, "Send models, quantities and destination to the export team.", {
      es: "Envíe modelos, cantidades y destino al equipo de exportación.",
      pt: "Envie modelos, quantidades e destino à equipe de exportação.",
    }),
    catalogPdf: tx(locale, "Product catalog (PDF)", { es: "Catálogo de productos (PDF)", pt: "Catálogo de produtos (PDF)" }),
    catalogDetail: tx(locale, "79 pages, English, 6.4 MB. No form, download now.", {
      es: "79 páginas, en inglés, 6,4 MB. Sin formulario, descárguelo ya.",
      pt: "79 páginas, em inglês, 6,4 MB. Sem formulário, baixe agora.",
    }),
    prices: tx(locale, "Wholesale prices", { es: "Precios mayoristas", pt: "Preços de atacado" }),
    pricesMoq: tx(locale, "Wholesale prices and MOQ", { es: "Precios mayoristas y pedido mínimo", pt: "Preços de atacado e pedido mínimo" }),
    pricesDetail: tx(locale, "Quoted by model, finish and quantity. Usually emailed within one working day.", {
      es: "Cotizados por modelo, acabado y cantidad. Normalmente por correo en un día hábil.",
      pt: "Cotados por modelo, acabamento e quantidade. Normalmente por e-mail em um dia útil.",
    }),
    moq: tx(locale, "MOQ, lead time, payment", { es: "Pedido mínimo, plazo, pago", pt: "Pedido mínimo, prazo, pagamento" }),
    moqDetail: tx(locale, "Most models 300 to 5,000 pieces. Production from 30 days.", {
      es: "La mayoría de modelos, de 300 a 5.000 piezas. Producción desde 30 días.",
      pt: "A maioria dos modelos, de 300 a 5.000 peças. Produção a partir de 30 dias.",
    }),
    howToOrder: tx(locale, "How ordering works", { es: "Cómo se hace un pedido", pt: "Como funciona o pedido" }),
    howToOrderDetail: tx(locale, "Catalog, quotation, sample, production, shipment.", {
      es: "Catálogo, cotización, muestra, producción, envío.",
      pt: "Catálogo, cotação, amostra, produção, embarque.",
    }),
    alibaba: tx(locale, "Prefer Alibaba? Our verified storefront", {
      es: "¿Prefiere Alibaba? Nuestra tienda verificada",
      pt: "Prefere o Alibaba? Nossa loja verificada",
    }),
    stripMoq: tx(locale, "MOQ 300–5,000 pcs by model", { es: "Pedido mínimo 300–5.000 pzs según modelo", pt: "Pedido mínimo 300–5.000 pçs por modelo" }),
    stripLead: tx(locale, "Production from 30 days", { es: "Producción desde 30 días", pt: "Produção a partir de 30 dias" }),
    stripTerms: tx(locale, "EXW · FOB · DDP", { es: "EXW · FOB · DDP", pt: "EXW · FOB · DDP" }),
  };
}
