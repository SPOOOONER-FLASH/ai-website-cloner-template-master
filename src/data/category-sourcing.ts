import { getProductsByCategory } from "./products";

/**
 * The sourcing line on each category page.
 *
 * WHY IT EXISTS. `scripts/audit-keyword-coverage.mjs` measured the built export and found
 * that 0 of 15 category pages carried a single transactional word in their own copy — no
 * lead time, no OEM, no quote, nothing a buyer says when they are trying to buy rather
 * than to learn. The words the audit first appeared to find (manufacturer, factory,
 * price, export) were the header and footer, present on all 941 pages including the 404,
 * and a word on every page distinguishes none of them.
 *
 * EVERY CLAUSE IS A PUBLISHED FACT. This is not a keyword paragraph.
 *   · manufactured in Guangdong — company record, published site-wide
 *   · the model count — read from the catalogue at build time, never typed
 *   · lead time from 30 days — confirmed by the client 2026-09-01
 *   · OEM and private label — already published on /services/
 * Nothing here is a range, a price, an MOQ or a payment term, because we do not have
 * those numbers. Writing "MOQ" on a page that cannot state the MOQ is keyword stuffing,
 * and a buyer orders against it. When the client supplies them, add them here — one
 * place, both languages, every category — rather than into fifteen hand-written pages.
 *
 * The singular head term is deliberate. Search Console's referring-anchor export shows
 * external links arrive almost entirely in the singular — "lever handle", "lock case",
 * "panic exit device" — while our page names are plural. Google stems the two together,
 * so this is not a ranking trick and no title was rewritten for it; it simply reads more
 * naturally in a sentence than the plural would.
 */

/** Singular head term per category, for use mid-sentence. */
const SINGULAR: Record<string, { en: string; es: string }> = {
  "panic-exit-devices": { en: "panic exit device", es: "barra antipánico" },
  "night-latches-rim-locks": { en: "night latch and rim lock", es: "cerradura de sobreponer" },
  "stainless-steel-handles": { en: "stainless steel handle", es: "manija de acero inoxidable" },
  "lever-handles": { en: "lever handle", es: "manija de palanca" },
  "knob-locks": { en: "knob lock", es: "cerradura de pomo" },
  "bathroom-accessories": { en: "bathroom accessory", es: "accesorio de baño" },
  "brass-steel-hinges": { en: "brass and steel door hinge", es: "bisagra de latón y acero" },
  deadbolts: { en: "deadbolt", es: "cerrojo" },
  "door-closers": { en: "door closer", es: "cierrapuertas" },
  "grip-handle-sets": { en: "grip handle set", es: "juego de manija con placa" },
  "glass-door-accessories": { en: "glass door fitting", es: "herraje para puerta de vidrio" },
  "hardware-accessories": { en: "door hardware accessory", es: "accesorio de herrajes" },
  "lock-cases": { en: "mortise lock case", es: "caja de cerradura de embutir" },
  "lock-cylinders": { en: "lock cylinder", es: "cilindro de cerradura" },
  "sliding-hook-locks": { en: "sliding hook lock", es: "cerradura de gancho para puerta corredera" },
};

export function categorySourcingLine(slug: string, locale: "en" | "es"): string | null {
  const term = SINGULAR[slug];
  if (!term) return null;

  const count = getProductsByCategory(slug).length;
  if (!count) return null;

  if (locale === "es") {
    return (
      `Canton Hyland fabrica cada ${term.es} de esta gama en Guangdong, China, ` +
      `con ${count} ${count === 1 ? "modelo publicado" : "modelos publicados"}. ` +
      `El plazo de producción parte de 30 días desde la confirmación del pedido, ` +
      `y producimos bajo marca propia del cliente (OEM). ` +
      `Escriba al equipo de exportación con su cuadro de puertas para recibir ` +
      `modelos, acabados y una fecha confirmada.`
    );
  }

  return (
    `Canton Hyland manufactures every ${term.en} in this range in Guangdong, China, ` +
    `with ${count} published ${count === 1 ? "model" : "models"}. ` +
    `Production lead time starts at 30 days from order confirmation, and we produce ` +
    `under our customers' own brands (OEM and private label). ` +
    `Send your door schedule to the export team for model numbers, finishes and a ` +
    `confirmed date.`
  );
}
