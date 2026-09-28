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
 *   · Never write "pure copper" in any language (brief); say "copper on its own" instead. src/data/category-notes.test.ts
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

function brassModels(slug: string): string[] {
  return getProductsByCategory(slug)
    .filter((p) => p.material.trim().toLowerCase() === "brass")
    .map((p) => p.model);
}

function joinModels(models: string[], and: string): string {
  if (models.length <= 1) return models.join("");
  return `${models.slice(0, -1).join(", ")}${and}${models.at(-1)}`;
}

const GUIDE = "copper-or-brass-hinges-2026";

/*
  One template per locale. `and` is the joiner between the last two models (with its own
  spacing, since CJK takes none); `body(list, many)` gets the joined list and whether it is
  plural. Every locale says the same four things: copper hinge means brass; copper alone is
  too soft; which models are brass; AC is a finish, not the metal.
*/
const HINGE: Record<Locale, { heading: string; and: string; body: (list: string, many: boolean) => string; label: string }> = {
  en: {
    heading: "Looking for a copper hinge?",
    and: " and ",
    body: (list, many) =>
      `In door hardware, a copper hinge almost always means brass, an alloy of copper and zinc: copper on its own is too soft to carry a door. ` +
      `In this range the ${list} ${many ? "are" : "is"} made of brass; the others are stainless steel, iron or zinc alloy, and several are offered in an antique copper (AC) finish. ` +
      `AC is a finish color, not the metal, so write the base metal and the finish separately on the order.`,
    label: "Copper hinges or brass hinges?",
  },
  es: {
    heading: "¿Busca una bisagra de cobre?",
    and: " y ",
    body: (list, many) =>
      `En herrajes, «bisagra de cobre» casi siempre quiere decir latón, una aleación de cobre y zinc: el cobre sin alear es demasiado blando para sostener una puerta. ` +
      `En esta gama, ${list} ${many ? "son" : "es"} de latón; las demás son de acero inoxidable, hierro o aleación de zinc, y varias se ofrecen en acabado cobre antiguo (AC). ` +
      `AC es un color de acabado, no el metal, así que en el pedido conviene escribir el metal base y el acabado por separado.`,
    label: "¿Bisagras de cobre o de latón?",
  },
  pt: {
    heading: "Procura uma dobradiça de cobre?",
    and: " e ",
    body: (list, many) =>
      `Em ferragens, «dobradiça de cobre» quase sempre quer dizer latão, uma liga de cobre e zinco: o cobre sem liga é mole demais para sustentar uma porta. ` +
      `Nesta linha, ${list} ${many ? "são" : "é"} de latão; as demais são de aço inoxidável, ferro ou liga de zinco, e várias saem no acabamento cobre antigo (AC). ` +
      `AC é uma cor de acabamento, não o metal, por isso no pedido vale escrever o metal base e o acabamento separadamente.`,
    label: "Dobradiças de cobre ou de latão?",
  },
  fr: {
    heading: "Vous cherchez une paumelle en cuivre ?",
    and: " et ",
    body: (list, many) =>
      `En quincaillerie de porte, une « paumelle en cuivre » désigne presque toujours du laiton, un alliage de cuivre et de zinc : le cuivre seul est trop tendre pour porter une porte. ` +
      `Dans cette gamme, ${many ? "les modèles" : "le modèle"} ${list} ${many ? "sont" : "est"} en laiton ; les autres sont en acier inoxydable, en fer ou en alliage de zinc, et plusieurs sont proposés en finition cuivre vieilli (AC). ` +
      `AC est une couleur de finition, pas le métal : indiquez séparément le métal de base et la finition dans la commande.`,
    label: "Paumelles en cuivre ou en laiton ?",
  },
  de: {
    heading: "Sie suchen ein Kupferband?",
    and: " und ",
    body: (list, many) =>
      `Bei Türbeschlägen ist mit einem „Kupferband“ fast immer Messing gemeint, eine Legierung aus Kupfer und Zink: Kupfer allein ist zu weich, um eine Tür zu tragen. ` +
      `In diesem Sortiment ${many ? "sind" : "ist"} ${list} aus Messing; die übrigen sind aus Edelstahl, Eisen oder Zinklegierung, und mehrere gibt es in der Oberfläche Kupfer antik (AC). ` +
      `AC ist eine Oberflächenfarbe, nicht das Metall. Geben Sie in der Bestellung Grundmetall und Oberfläche deshalb getrennt an.`,
    label: "Kupferbänder oder Messingbänder?",
  },
  ja: {
    heading: "「銅の丁番」をお探しですか？",
    and: "と",
    body: (list) =>
      `ドア金物で「銅の丁番」と言えば、ほとんどの場合は銅と亜鉛の合金である真鍮を指します。銅だけでは柔らかすぎて扉を支えられません。` +
      `このシリーズでは${list}が真鍮製です。その他はステンレス、鉄、亜鉛合金で、いくつかはアンティークカッパー（AC）仕上げに対応しています。` +
      `ACは仕上げの色であって金属ではないため、注文時は母材と仕上げを分けて記載してください。`,
    label: "銅の丁番か真鍮の丁番か",
  },
  ko: {
    heading: "구리 경첩을 찾으시나요?",
    and: ", ",
    body: (list) =>
      `도어 하드웨어에서 '구리 경첩'은 거의 언제나 구리와 아연의 합금인 황동을 뜻합니다. 구리만으로는 너무 물러서 문을 지탱할 수 없습니다. ` +
      `이 제품군에서는 ${list}이(가) 황동 제품이며, 나머지는 스테인리스강, 철 또는 아연 합금이고, 그중 여러 제품은 앤티크 코퍼(AC) 마감으로 제공됩니다. ` +
      `AC는 금속이 아니라 마감 색상이므로 주문서에는 모재와 마감을 따로 적어 주십시오.`,
    label: "구리 경첩인가 황동 경첩인가?",
  },
  tr: {
    heading: "Bakır menteşe mi arıyorsunuz?",
    and: " ve ",
    body: (list) =>
      `Kapı donanımında “bakır menteşe” neredeyse her zaman pirinç anlamına gelir; pirinç, bakır ve çinko alaşımıdır. Tek başına bakır bir kapıyı taşıyamayacak kadar yumuşaktır. ` +
      `Bu seride ${list} pirinçtir; diğerleri paslanmaz çelik, demir veya çinko alaşımıdır ve birçoğu antik bakır (AC) kaplamayla sunulur. ` +
      `AC bir kaplama rengidir, metal değildir; bu nedenle siparişte ana metali ve kaplamayı ayrı ayrı yazın.`,
    label: "Bakır menteşe mi, pirinç menteşe mi?",
  },
  ru: {
    heading: "Ищете медную петлю?",
    and: " и ",
    body: (list, many) =>
      `В дверной фурнитуре «медная петля» почти всегда означает латунь, сплав меди и цинка: медь сама по себе слишком мягкая, чтобы держать дверь. ` +
      `В этой серии из латуни ${many ? "сделаны" : "сделана"} ${list}; остальные — из нержавеющей стали, железа или цинкового сплава, и некоторые выпускаются в отделке «античная медь» (AC). ` +
      `AC — это цвет отделки, а не металл, поэтому в заказе указывайте основной металл и отделку отдельно.`,
    label: "Медные или латунные петли?",
  },
  ar: {
    heading: "هل تبحث عن مفصلة نحاس أحمر؟",
    and: " و",
    body: (list) =>
      `في عُدد الأبواب، تعني «مفصلة النحاس الأحمر» في أغلب الأحيان النحاس الأصفر، وهو سبيكة من النحاس والزنك؛ فالنحاس وحده أليَن من أن يحمل بابًا. ` +
      `في هذه المجموعة، الطرازات ${list} مصنوعة من النحاس الأصفر؛ أما البقية فمن الفولاذ المقاوم للصدأ أو الحديد أو سبيكة الزنك، ويتوفر عدد منها بتشطيب النحاس العتيق (AC). ` +
      `AC لون تشطيب وليس المعدن نفسه، لذا اكتب المعدن الأساسي والتشطيب منفصلين في الطلب.`,
    label: "مفصلات نحاس أحمر أم مفصلات نحاس أصفر؟",
  },
};

function guideHref(locale: Locale): string {
  return locale === "en" ? `/guides/${GUIDE}/` : `/${locale}/guides/${GUIDE}/`;
}

function hingeNote(locale: Locale): CategoryNote | null {
  const models = brassModels("brass-steel-hinges");
  if (!models.length) return null;
  const t = HINGE[locale];
  return {
    heading: t.heading,
    body: t.body(joinModels(models, t.and), models.length > 1),
    link: { href: guideHref(locale), label: t.label },
  };
}

export function categoryNote(slug: string, locale: Locale): CategoryNote | null {
  if (slug === "brass-steel-hinges") return hingeNote(locale);
  return null;
}
