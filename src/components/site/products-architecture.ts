import { localised } from "../../lib/localised.ts";
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

export interface ProductFamilyDefinition {
  slug: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface ProductStoryDefinition {
  role: "range" | "application" | "technical";
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  alt: LocalizedText;
  href: string;
}

export const PRODUCT_FAMILIES: readonly ProductFamilyDefinition[] = [
  {
    slug: "lever-handles",
    label: { en: "Lever handles", es: "Manijas de palanca", pt: "Maçanetas" },
    description: {
      en: "Lever sets for commercial and residential openings.",
      es: "Juegos de manija para puertas comerciales y residenciales.",
      pt: "Conjuntos de maçaneta para portas comerciais e residenciais.",
    },
  },
  {
    slug: "panic-exit-devices",
    label: { en: "Panic exit devices", es: "Barras antipánico", pt: "Barras antipânico" },
    description: {
      en: "Push and touch-bar families for escape routes.",
      es: "Familias de barras de empuje y de toque para evacuación.",
      pt: "Famílias de barra de empurrar e de toque para rotas de fuga.",
    },
  },
  {
    slug: "lock-cases",
    label: { en: "Lock cases", es: "Cerraduras de embutir", pt: "Fechaduras de embutir" },
    description: {
      en: "Mortise cases across backset and bolt configurations.",
      es: "Cajas de embutir con distintas entradas y configuraciones de pestillo.",
      pt: "Caixas de embutir em vários backsets e configurações de lingueta.",
    },
  },
  {
    slug: "door-closers",
    label: { en: "Door control", es: "Control de puertas", pt: "Controle de porta" },
    description: {
      en: "Surface closers and concealed floor-spring applications.",
      es: "Cierrapuertas de superficie y aplicaciones con bisagra de piso oculta.",
      pt: "Molas aéreas de sobrepor e aplicações com mola de piso embutida.",
    },
  },
  {
    slug: "brass-steel-hinges",
    label: { en: "Door hinges", es: "Bisagras para puertas", pt: "Dobradiças" },
    description: {
      en: "Brass, stainless-steel and steel hinge ranges.",
      es: "Gamas de bisagras de latón, acero inoxidable y acero.",
      pt: "Linhas de dobradiça em latão, aço inoxidável e aço.",
    },
  },
  {
    slug: "glass-door-accessories",
    label: { en: "Glass door hardware", es: "Herrajes para puertas de vidrio", pt: "Ferragens para porta de vidro" },
    description: {
      en: "Patch fittings and pull handles for frameless assemblies.",
      es: "Patch fittings y tiradores para conjuntos de vidrio sin marco.",
      pt: "Ferragens de aperto e puxadores para conjuntos sem caixilho.",
    },
  },
  {
    slug: "grip-handle-sets",
    label: { en: "Pull handles", es: "Tiradores", pt: "Puxadores" },
    description: {
      en: "Grip, pull and concealed handles for entrance and sliding doors.",
      es: "Tiradores y manijas ocultas para accesos y puertas corredizas.",
      pt: "Puxadores de pegar, de tubo e embutidos para entradas e portas de correr.",
    },
  },
  {
    slug: "lock-cylinders",
    label: { en: "Lock cylinders", es: "Cilindros", pt: "Cilindros" },
    description: {
      en: "Profile and keyed cylinders, including master-key applications.",
      es: "Cilindros de perfil y con llave, incluso para sistemas amaestrados.",
      pt: "Cilindros de perfil e com chave, inclusive para sistemas de chave-mestra.",
    },
  },
  {
    slug: "hardware-accessories",
    label: { en: "Hardware accessories", es: "Accesorios de herrajes", pt: "Acessórios de ferragem" },
    description: {
      en: "Viewers, stoppers, transfer devices, bolts, indicators and latches.",
      es: "Mirillas, topes, pasacables, pasadores, indicadores y picaportes.",
      pt: "Olho mágico, batentes, passa-fios, ferrolhos, indicadores e trincos.",
    },
  },
] as const;

export const PRODUCT_STORY: readonly ProductStoryDefinition[] = [
  {
    role: "range",
    title: { en: "Range", es: "Gama", pt: "Linha" },
    description: {
      en: "See the product families first, with complete silhouettes from our catalogue.",
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
      en: "Client catalogue photograph of a storefront push/pull lock mechanism",
      es: "Fotografía del catálogo del cliente de un mecanismo de cerradura de empuje y tracción",
      pt: "Fotografia do catálogo do cliente de um mecanismo de fechadura de empurrar e puxar",
    },
    href: "/projects/",
  },
  {
    role: "technical",
    title: { en: "Technical", es: "Construcción", pt: "Construção" },
    description: {
      en: "Check the backset, centres and fixing details before choosing a lock case.",
      es: "Compruebe la entrada, los entre-ejes y las fijaciones antes de elegir la cerradura.",
      pt: "Confira o backset, as distâncias entre eixos e as fixações antes de escolher a caixa de fechadura.",
    },
    image: "/images/editorial/hyde-real-lock-plate.webp",
    alt: {
      en: "Original catalogue photograph of the LC14 lock case with its faceplate and bolts",
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
      "Start with the complete system, then move from a hardware family to an exact published model.",
    rangeMeta: "Nine coordinated families · one catalogue",
    familiesHeading: "Nine ways into the catalogue",
    familiesBody:
      "Choose a family to explore its models. Use the complete catalogue below for additional ranges and side-by-side specifications.",
    brandLine: "Engineered by Canton Hyland",
    brandBody:
      "From the handle you touch to the mechanism inside the door, specify each part around the opening. Explore the construction, material and finish options in our published catalogue.",
    storyEyebrow: "Selection and specification",
    storyTitle: "From range to installed opening.",
    storyBody:
      "Door type and operating conditions shape the hardware choice. Review the application, compare the technical details and send your door schedule for selection support.",
    applicationLink: "Explore applications",
    technicalLink: "Explore lock cases",
    conversionEyebrow: "Specify and source",
    conversionTitle: "Finish with evidence, then talk to the factory.",
    downloads: "Open technical downloads",
    contact: "Send a project enquiry",
    finder: "Don’t know the model? Find by door type and material",
    configurator: "Build a hardware set",
    representative: "Canton Hyland product photography",
  },
  es: {
    collection: "Colección Canton",
    title: "Herrajes para puertas y ventanas",
    intro:
      "Empiece por el sistema completo y avance desde una familia de herrajes hasta un modelo publicado exacto.",
    rangeMeta: "Nueve familias coordinadas · un catálogo",
    familiesHeading: "Nueve entradas al catálogo",
    familiesBody:
      "Elija una familia para explorar sus modelos. Consulte el catálogo completo más abajo para ver otras gamas y comparar especificaciones.",
    brandLine: "Engineered by Canton Hyland",
    brandBody:
      "Desde la manija hasta el mecanismo interior, especifique cada pieza según la abertura. Explore las opciones de construcción, material y acabado en nuestro catálogo.",
    storyEyebrow: "Selección y especificación",
    storyTitle: "De la gama a la abertura instalada.",
    storyBody:
      "El tipo de puerta y las condiciones de uso determinan la elección. Revise la aplicación, compare los detalles técnicos y envíe su cuadro de puertas para recibir apoyo.",
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
      "Comece pelo sistema completo e avance de uma família de ferragens até um modelo publicado exato.",
    rangeMeta: "Nove famílias coordenadas · um catálogo",
    familiesHeading: "Nove entradas no catálogo",
    familiesBody:
      "Escolha uma família para explorar os seus modelos. Use o catálogo completo abaixo para ver outras linhas e comparar especificações lado a lado.",
    brandLine: "Engineered by Canton Hyland",
    brandBody:
      "Da maçaneta que você toca ao mecanismo dentro da porta, especifique cada peça em torno do vão. Explore as opções de construção, material e acabamento no nosso catálogo publicado.",
    storyEyebrow: "Seleção e especificação",
    storyTitle: "Da linha ao vão instalado.",
    storyBody:
      "O tipo de porta e as condições de uso determinam a escolha da ferragem. Veja a aplicação, compare os detalhes técnicos e envie o seu quadro de portas para apoio na seleção.",
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
  const copy = localised(COPY, locale);

  return {
    ...copy,
    families: PRODUCT_FAMILIES.map((family) => ({
      slug: family.slug,
      label: localised(family.label, locale),
      description: localised(family.description, locale),
      href: localizedHref(`/products/${family.slug}/`, locale),
    })),
    story: PRODUCT_STORY.map((chapter) => ({
      ...chapter,
      title: localised(chapter.title, locale),
      description: localised(chapter.description, locale),
      alt: localised(chapter.alt, locale),
      href: localizedHref(chapter.href, locale),
    })),
    photographySeries: PHOTOGRAPHY_SERIES.map((series) => ({
      ...series,
      label: localised(series.label, locale),
      detail: localised(series.detail, locale),
      href: localizedHref(series.href, locale),
    })),
  };
}
