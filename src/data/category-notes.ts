import { getProductsByCategory } from "./products";
import type { Locale } from "@/data/site";

/**
 * A short buyer's note on a category page, for the one question a category keeps getting
 * asked under the wrong name.
 *
 * WHY IT EXISTS. Buyers in many countries search for and order a "copper hinge". What they
 * mean is brass (copper and zinc); unalloyed copper is too soft to carry a door
 * (client, 2026-09-24 — docs/collaboration/tasks/2026-09-24-copper-hinge-brief.md). Search
 * synonyms, B024/B025 copy and the guide catch the word; the hinge category page did not.
 *
 * RULES.
 *   · Never write "pure copper" / "cobre puro" / "cobre puro" (brief). src/data/category-notes.test.ts
 *     fails if any of them appears.
 *   · The brass models are read from each record's `material` at build time, never typed, so
 *     a new brass hinge joins the sentence and a re-classified one leaves it.
 *   · Antique copper (AC) is a finish, not a metal — the same point the guide makes.
 */

export interface CategoryNote {
  heading: string;
  body: string;
  link: { href: string; label: string };
}

type NoteLocale = Extract<Locale, "en" | "es" | "pt">;

function brassModels(slug: string): string[] {
  return getProductsByCategory(slug)
    .filter((p) => p.material.trim().toLowerCase() === "brass")
    .map((p) => p.model);
}

function joinModels(models: string[], and: string): string {
  if (models.length <= 1) return models.join("");
  return `${models.slice(0, -1).join(", ")} ${and} ${models.at(-1)}`;
}

const GUIDE = "copper-or-brass-hinges-2026";

function hingeNote(locale: NoteLocale): CategoryNote | null {
  const models = brassModels("brass-steel-hinges");
  if (!models.length) return null;

  if (locale === "es") {
    const list = joinModels(models, "y");
    return {
      heading: "¿Busca una bisagra de cobre?",
      body:
        `En herrajes, «bisagra de cobre» casi siempre quiere decir latón, una aleación de cobre y zinc: el cobre sin alear es demasiado blando para sostener una puerta. ` +
        `En esta gama, ${list} ${models.length > 1 ? "son" : "es"} de latón; las demás son de acero inoxidable, hierro o aleación de zinc, y varias se ofrecen en acabado cobre antiguo (AC). ` +
        `AC es un color de acabado, no el metal, así que en el pedido conviene escribir el metal base y el acabado por separado.`,
      link: { href: `/es/guides/${GUIDE}/`, label: "¿Bisagras de cobre o de latón?" },
    };
  }

  if (locale === "pt") {
    const list = joinModels(models, "e");
    return {
      heading: "Procura uma dobradiça de cobre?",
      body:
        `Em ferragens, «dobradiça de cobre» quase sempre quer dizer latão, uma liga de cobre e zinco: o cobre sem liga é mole demais para sustentar uma porta. ` +
        `Nesta linha, ${list} ${models.length > 1 ? "são" : "é"} de latão; as demais são de aço inoxidável, ferro ou liga de zinco, e várias saem no acabamento cobre antigo (AC). ` +
        `AC é uma cor de acabamento, não o metal, por isso no pedido vale escrever o metal base e o acabamento separadamente.`,
      link: { href: `/pt/guides/${GUIDE}/`, label: "Dobradiças de cobre ou de latão?" },
    };
  }

  const list = joinModels(models, "and");
  return {
    heading: "Looking for a copper hinge?",
    body:
      `In door hardware, a copper hinge almost always means brass, an alloy of copper and zinc: copper on its own is too soft to carry a door. ` +
      `In this range the ${list} ${models.length > 1 ? "are" : "is"} made of brass; the others are stainless steel, iron or zinc alloy, and several are offered in an antique copper (AC) finish. ` +
      `AC is a finish color, not the metal, so write the base metal and the finish separately on the order.`,
    link: { href: `/guides/${GUIDE}/`, label: "Copper hinges or brass hinges?" },
  };
}

export function categoryNote(slug: string, locale: NoteLocale): CategoryNote | null {
  if (slug === "brass-steel-hinges") return hingeNote(locale);
  return null;
}
