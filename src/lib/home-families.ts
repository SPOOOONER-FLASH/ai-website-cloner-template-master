import { publishedProducts } from "@/data/products";
import type { Locale } from "@/data/site";
import { dict } from "@/lib/i18n";

/**
 * The eight product families the homepage shows (FamilyIndex, and the bars under ExportMap),
 * grouped the way the Canton Fair flyer groups them. Client 2026-10-12, after the motion
 * demo: 「这三部分特别好……直接加入现在的首页」.
 *
 * Counts are computed, never typed: published HYDE products (the site's own rule — on the
 * HYDE catalogue and with a photograph) whose first category is in the group. `lead` is the
 * model shown for the group; it must be published, or the build fails rather than showing a
 * family with no picture.
 *
 * CHANGING A `lead`: scripts/build-product-image-config.mjs reads these slugs to give their
 * photographs responsive variants. Run it and `node scripts/generate-editorial-srcsets.mjs`,
 * or static-export-performance fails the release on a homepage <img> without a srcset — which
 * is what stopped r41 on 2026-10-12.
 */
const GROUPS = [
  { key: "panic", slugs: ["panic-exit-devices"], lead: "307-panic-exit-device" },
  { key: "lockCases", slugs: ["lock-cases", "lock-cylinders"], lead: "lc14-85-50mm-lock-case" },
  { key: "levers", slugs: ["lever-handles"], lead: "3431-sset-lever-handle" },
  { key: "stainless", slugs: ["stainless-steel-handles"], lead: "9014-ssbk-stainless-steel-handle" },
  { key: "knobs", slugs: ["knob-locks"], lead: "575-abet-tubular-lock" },
  { key: "rim", slugs: ["night-latches-rim-locks", "grip-handle-sets", "sliding-hook-locks"], lead: "564-mb-night-latch-and-rim-lock" },
  { key: "hinges", slugs: ["brass-steel-hinges", "hardware-accessories"], lead: "b025-brass-and-steel-hinges" },
  { key: "glass", slugs: ["glass-door-accessories", "bathroom-accessories"], lead: "f101-glass-door-patch-fittings" },
] as const;

export type FamilyKey = (typeof GROUPS)[number]["key"];

const familyNames = {
  en: {
    panic: "Panic exit devices",
    lockCases: "Lock cases & cylinders",
    levers: "Lever handles",
    stainless: "Stainless steel handles",
    knobs: "Knob & tubular locks",
    rim: "Rim, grip & hook locks",
    hinges: "Hinges & accessories",
    glass: "Glass door & bathroom",
  },
  es: {
    panic: "Barras antipánico",
    lockCases: "Cajas de cerradura y cilindros",
    levers: "Manillas",
    stainless: "Manillas de acero inoxidable",
    knobs: "Pomos y cerraduras tubulares",
    rim: "Cerrojos de sobreponer, juegos y ganchos",
    hinges: "Bisagras y accesorios",
    glass: "Vidrio y baño",
  },
  pt: {
    panic: "Barras antipânico",
    lockCases: "Caixas de fechadura e cilindros",
    levers: "Maçanetas de alavanca",
    stainless: "Maçanetas de aço inoxidável",
    knobs: "Fechaduras de bola e tubulares",
    rim: "Fechaduras de sobrepor, conjuntos e gancho",
    hinges: "Dobradiças e acessórios",
    glass: "Vidro e banheiro",
  },
};

export interface HomeFamily {
  key: FamilyKey;
  name: string;
  count: number;
  href: string;
  lead: { model: string; src: string; name: string };
}

export function homeFamilies(locale: Locale): HomeFamily[] {
  const names = dict(familyNames, locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  return GROUPS.map((group) => {
    const lead = publishedProducts.find((p) => p.slug === group.lead);
    if (!lead?.heroImage.src) throw new Error(`Homepage family "${group.key}": lead product ${group.lead} is not published`);
    return {
      key: group.key,
      name: names[group.key],
      count: publishedProducts.filter((p) => (group.slugs as readonly string[]).includes(p.categoryPath[0])).length,
      href: `${prefix}/products/${group.slugs[0]}/`,
      lead: { model: lead.model, src: lead.heroImage.src, name: lead.name },
    };
  });
}
