import { dict } from "../../lib/i18n.ts";
import { localisedHref } from "../../lib/spanish-mirror.ts";
import type { Locale } from "@/data/site";
/* Kept as a named alias so call sites read well; it is just Locale now. */
export type ProductsLocale = Locale;

interface LocalizedText {
  en: string;
  es: string;
  /* Optional while the tree fills in: `localised()` falls back to English, never Spanish. */
  pt?: string;
}

/**
 * One category entry on /products. Its name and one-line summary are the category's own
 * (content/categories.json, read with `t()` so all ten locales translate), so they cannot
 * drift from the category page they open. `thumbnail` is the product whose real photograph
 * stands for the category: a white-field catalog shot of one part in one finish.
 */
export interface ProductFamilyDefinition {
  slug: string;
  thumbnail: string;
}

export interface ProductGroupDefinition {
  title: LocalizedText;
  families: readonly ProductFamilyDefinition[];
}

export interface ProductStoryDefinition {
  role: "range" | "application" | "technical";
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  alt: LocalizedText;
  href: string;
}

/*
  EVERY CATEGORY, IN FIVE GROUPS (client, 2026-09-30: 「这个nine ways 是不是要优化下」).

  The block used to list nine hand-picked families. Those nine held 330 of the 549 models
  on the site; knob locks, the stainless steel levers (the 9014's own category), bathroom
  accessories, floor springs, night latches, deadbolts, grab bars and sliding hook locks
  had no door from this page at all. It also spoke in taglines ("The first handshake a
  building gives") where a buyer wanted a fact.

  Now every top-level category is here, grouped by the job it does on a door. A category
  with no published model is skipped at render time, and products-architecture.test.ts
  fails if a category in content/categories.json is missing from every group.
*/
export const PRODUCT_GROUPS: readonly ProductGroupDefinition[] = [
  {
    title: { en: "Handles", es: "Manijas y tiradores", pt: "Maçanetas e puxadores" },
    families: [
      { slug: "stainless-steel-handles", thumbnail: "9001-stainless-steel-handle" },
      { slug: "lever-handles", thumbnail: "3431-sset-lever-handle" },
      { slug: "grip-handle-sets", thumbnail: "70710-sn-grip-handle-set" },
    ],
  },
  {
    title: { en: "Locks and cylinders", es: "Cerraduras y cilindros", pt: "Fechaduras e cilindros" },
    families: [
      { slug: "lock-cases", thumbnail: "1121-lock-case" },
      { slug: "lock-cylinders", thumbnail: "54-dk-lock-cylinder" },
      { slug: "knob-locks", thumbnail: "575-sset-tubular-lock" },
      { slug: "deadbolts", thumbnail: "d101-ss-deadbolts" },
      { slug: "night-latches-rim-locks", thumbnail: "260-night-latch-and-rim-lock" },
      { slug: "sliding-hook-locks", thumbnail: "s02-cp-sliding-hook-lock" },
    ],
  },
  {
    title: { en: "Exit devices and door control", es: "Barras antipánico y control de puertas", pt: "Barras antipânico e controle de porta" },
    families: [
      { slug: "panic-exit-devices", thumbnail: "305-fire-door-panic-exit-device" },
      { slug: "door-closers", thumbnail: "ju-051-door-closer" },
      { slug: "floor-springs-and-pivots", thumbnail: "d-3001-floor-spring" },
    ],
  },
  {
    title: { en: "Hinges and glass doors", es: "Bisagras y puertas de vidrio", pt: "Dobradiças e portas de vidro" },
    families: [
      { slug: "brass-steel-hinges", thumbnail: "ssh012-brass-and-steel-hinges" },
      { slug: "glass-door-accessories", thumbnail: "100-glass-door-handle" },
    ],
  },
  {
    title: { en: "Bathroom and accessories", es: "Baño y accesorios", pt: "Banheiro e acessórios" },
    families: [
      { slug: "bathroom-accessories", thumbnail: "bh05-hook-rail" },
      { slug: "care-grab-bars", thumbnail: "bh01-grab-bar" },
      { slug: "hardware-accessories", thumbnail: "500-indicator" },
    ],
  },
] as const;

/** Every category in the groups, in page order. */
export const PRODUCT_FAMILIES: readonly ProductFamilyDefinition[] = PRODUCT_GROUPS.flatMap((group) => group.families);

export const PRODUCT_STORY: readonly ProductStoryDefinition[] = [
  {
    role: "range",
    title: { en: "Range", es: "Gama", pt: "Linha" },
    description: {
      en: "See the product families first, with complete silhouettes from our catalog.",
      es: "Vea primero las familias de productos, con siluetas completas del catálogo.",
      pt: "Veja primeiro as famílias de produto, com silhuetas completas do nosso catálogo.",
    },
    image: "/images/editorial/hyde-real-product-atlas.webp",
    alt: {
      en: "Editorial atlas of nine architectural door-hardware families on a neutral field",
      es: "Atlas editorial de nueve familias de herrajes arquitectónicos sobre fondo neutro",
      pt: "Atlas editorial de nove famílias de ferragens arquitetônicas sobre fundo neutro",
    },
    href: "/products/",
  },
  {
    role: "application",
    title: { en: "Application", es: "Aplicación", pt: "Aplicação" },
    description: {
      en: "Start with the door, its opening action and the way it will be used.",
      es: "Empiece por la puerta, su accionamiento y el uso previsto.",
      pt: "Comece pela porta, pelo modo de abertura e pelo uso previsto.",
    },
    image: "/images/editorial/hyde-real-application-detail.webp",
    alt: {
      en: "Client catalog photograph of a storefront push/pull lock mechanism",
      es: "Fotografía del catálogo del cliente de un mecanismo de cerradura de empuje y tracción",
      pt: "Fotografia do catálogo do cliente de um mecanismo de fechadura de empurrar e puxar",
    },
    href: "/projects/",
  },
  {
    role: "technical",
    title: { en: "Technical", es: "Construcción", pt: "Construção" },
    description: {
      en: "Check the backset, centers and fixing details before choosing a lock case.",
      es: "Compruebe la entrada, los entre-ejes y las fijaciones antes de elegir la cerradura.",
      pt: "Confira o backset, as distâncias entre eixos e as fixações antes de escolher a caixa de fechadura.",
    },
    image: "/images/editorial/hyde-real-lock-plate.webp",
    alt: {
      en: "Original catalog photograph of the LC14 lock case with its faceplate and bolts",
      es: "Fotografía original de la cerradura LC14 con su frente y pestillos",
      pt: "Fotografia original da caixa de fechadura LC14 com a sua testa e as linguetas",
    },
    href: "/products/lock-cases/",
  },
] as const;

export const PHOTOGRAPHY_SERIES = [
  {
    image: "/images/editorial/hyde-real-lever-plate.webp",
    label: { en: "Lever systems", es: "Sistemas de manijas", pt: "Sistemas de maçaneta" },
    detail: { en: "Opening furniture", es: "Herrajes de accionamiento", pt: "Ferragens de acionamento" },
    href: "/products/lever-handles/",
  },
  {
    image: "/images/editorial/hyde-real-hinge-plate.webp",
    label: { en: "Door hinges", es: "Bisagras para puertas", pt: "Dobradiças" },
    detail: { en: "Varied constructions", es: "Construcciones variadas", pt: "Construções variadas" },
    href: "/products/brass-steel-hinges/",
  },
  {
    image: "/images/editorial/hyde-real-pull-plate.webp",
    label: { en: "Glass hardware", es: "Herrajes para vidrio", pt: "Ferragens para vidro" },
    detail: { en: "Patch, lock and pull families", es: "Familias de patch, cerradura y tirador", pt: "Famílias de aperto, fechadura e puxador" },
    href: "/products/glass-door-accessories/",
  },
  {
    image: "/images/editorial/hyde-real-control-plate.webp",
    label: { en: "Door control", es: "Control de puertas", pt: "Controle de porta" },
    detail: { en: "Surface and concealed systems", es: "Sistemas de superficie y ocultos", pt: "Sistemas de sobrepor e embutidos" },
    href: "/products/door-closers/",
  },
] as const;

const COPY = {
  en: {
    collection: "Canton Product Collection",
    title: "Door & Window Hardware",
    intro:
      "Everything a door needs, from the lever in the hand to the lock case inside the leaf: door hardware in American terms, architectural ironmongery in British ones. One standard throughout: every dimension written down, every part made to work with the ones around it.",
    rangeMeta: "Coordinated families · one catalog",
    familiesHeading: "Every category in the catalog",
    familiesBody:
      "Grouped by the job each part does on a door. Each category opens onto its models and the figures that decide whether they fit.",
    brandLine: "Engineered by Canton Hyland",
    brandBody:
      "A door is a set of parts that have to agree with each other: lever, lock case, cylinder, strike. We supply them together, each specified against the others, so the opening works the day it is fitted.",
    storyEyebrow: "Selection and specification",
    storyTitle: "From range to installed opening.",
    storyBody:
      "The door decides the hardware: what it is made of, how it opens, who uses it and how often. Send us your door schedule and our engineers will match each opening to a model.",
    applicationLink: "Explore applications",
    technicalLink: "Explore lock cases",
    conversionEyebrow: "Specify and source",
    conversionTitle: "Finish with evidence, then talk to the factory.",
    downloads: "Open technical downloads",
    contact: "Send a project inquiry",
    finder: "Don’t know the model? Find by door type and material",
    configurator: "Build a hardware set",
    representative: "Canton Hyland product photography",
  },
  es: {
    collection: "Colección Canton",
    title: "Herrajes para puertas y ventanas",
    intro:
      "Todo lo que necesita una puerta, desde la manija en la mano hasta la caja de cerradura dentro de la hoja. Un mismo criterio en todo el catálogo: cada medida por escrito y cada pieza hecha para trabajar con las que la rodean.",
    rangeMeta: "Familias coordinadas · un catálogo",
    familiesHeading: "Todas las categorías del catálogo",
    familiesBody:
      "Agrupadas según lo que hace cada pieza en la puerta. Cada categoría lleva a sus modelos y a las cifras que deciden si encajan.",
    brandLine: "Engineered by Canton Hyland",
    brandBody:
      "Una puerta es un conjunto de piezas que tienen que entenderse entre sí: manija, caja de cerradura, cilindro y cerradero. Las suministramos juntas, cada una especificada en función de las demás, para que la puerta funcione el día que se monta.",
    storyEyebrow: "Selección y especificación",
    storyTitle: "De la gama a la abertura instalada.",
    storyBody:
      "La puerta decide los herrajes: de qué está hecha, cómo abre, quién la usa y cuántas veces al día. Envíenos su planilla de puertas y nuestros ingenieros asignarán un modelo a cada hueco.",
    applicationLink: "Explorar aplicaciones",
    technicalLink: "Explorar cerraduras de embutir",
    conversionEyebrow: "Especificar y abastecer",
    conversionTitle: "Termine con evidencia y luego hable con la fábrica.",
    downloads: "Abrir descargas técnicas",
    contact: "Enviar una consulta de proyecto",
    finder: "¿No sabe el modelo? Busque por tipo de puerta y material",
    configurator: "Formar un conjunto de herrajes",
    representative: "Fotografía de producto de Canton Hyland",
  },
  pt: {
    collection: "Coleção Canton",
    title: "Ferragens para portas e janelas",
    intro:
      "Tudo o que uma porta precisa, da maçaneta na mão à caixa de fechadura dentro da folha. Um mesmo critério em todo o catálogo: cada medida registrada e cada peça feita para trabalhar com as que estão ao redor.",
    rangeMeta: "Famílias coordenadas · um catálogo",
    familiesHeading: "Todas as categorias do catálogo",
    familiesBody:
      "Agrupadas pelo que cada peça faz na porta. Cada categoria leva aos seus modelos e aos números que decidem se eles servem.",
    brandLine: "Engineered by Canton Hyland",
    brandBody:
      "Uma porta é um conjunto de peças que precisam conversar entre si: maçaneta, caixa de fechadura, cilindro e contra-testa. Fornecemos tudo junto, cada peça especificada em função das outras, para que a porta funcione no dia da instalação.",
    storyEyebrow: "Seleção e especificação",
    storyTitle: "Da linha ao vão instalado.",
    storyBody:
      "A porta decide a ferragem: do que é feita, como abre, quem usa e quantas vezes por dia. Envie a sua planilha de portas e nossos engenheiros indicam um modelo para cada vão.",
    applicationLink: "Explorar aplicações",
    technicalLink: "Explorar fechaduras de embutir",
    conversionEyebrow: "Especificar e abastecer",
    conversionTitle: "Termine com evidência e depois fale com a fábrica.",
    downloads: "Abrir downloads técnicos",
    contact: "Enviar uma consulta de obra",
    finder: "Não sabe o modelo? Busque por tipo de porta e material",
    configurator: "Montar um conjunto de ferragens",
    representative: "Fotografia de produto da Canton Hyland",
  },
} as const;

/*
  Was hard-coded to `/es`. With a third locale that silently sent Portuguese pages into the
  Spanish tree — every link correct-looking and none of them right — so the prefix now comes
  from the locale, and `localisedHref` decides whether the target actually exists.
*/
function localizedHref(href: string, locale: Locale): string {
  return localisedHref(href, locale);
}

export function getProductsArchitecture(locale: Locale) {
  const copy = dict(COPY, locale);

  return {
    ...copy,
    groups: PRODUCT_GROUPS.map((group) => ({
      title: dict(group.title, locale),
      families: group.families.map((family) => ({
        ...family,
        href: localizedHref(`/products/${family.slug}/`, locale),
      })),
    })),
    story: PRODUCT_STORY.map((chapter) => ({
      ...chapter,
      title: dict(chapter.title, locale),
      description: dict(chapter.description, locale),
      alt: dict(chapter.alt, locale),
      href: localizedHref(chapter.href, locale),
    })),
    photographySeries: PHOTOGRAPHY_SERIES.map((series) => ({
      ...series,
      label: dict(series.label, locale),
      detail: dict(series.detail, locale),
      href: localizedHref(series.href, locale),
    })),
  };
}
