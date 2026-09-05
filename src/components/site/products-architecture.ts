export type ProductsLocale = "en" | "es";

interface LocalizedText {
  en: string;
  es: string;
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
    label: { en: "Lever handles", es: "Manijas de palanca" },
    description: {
      en: "Lever sets for commercial and residential openings.",
      es: "Juegos de manija para puertas comerciales y residenciales.",
    },
  },
  {
    slug: "panic-exit-devices",
    label: { en: "Panic exit devices", es: "Barras antipánico" },
    description: {
      en: "Push and touch-bar families for escape routes.",
      es: "Familias de barras de empuje y de toque para evacuación.",
    },
  },
  {
    slug: "lock-cases",
    label: { en: "Lock cases", es: "Cerraduras de embutir" },
    description: {
      en: "Mortise cases across backset and bolt configurations.",
      es: "Cajas de embutir con distintas entradas y configuraciones de pestillo.",
    },
  },
  {
    slug: "door-closers",
    label: { en: "Door control", es: "Control de puertas" },
    description: {
      en: "Surface closers and concealed floor-spring applications.",
      es: "Cierrapuertas de superficie y aplicaciones con bisagra de piso oculta.",
    },
  },
  {
    slug: "brass-steel-hinges",
    label: { en: "Door hinges", es: "Bisagras para puertas" },
    description: {
      en: "Brass, stainless-steel and steel hinge ranges.",
      es: "Gamas de bisagras de latón, acero inoxidable y acero.",
    },
  },
  {
    slug: "glass-door-accessories",
    label: { en: "Glass door hardware", es: "Herrajes para puertas de vidrio" },
    description: {
      en: "Patch fittings and pull handles for frameless assemblies.",
      es: "Patch fittings y tiradores para conjuntos de vidrio sin marco.",
    },
  },
  {
    slug: "grip-handle-sets",
    label: { en: "Pull handles", es: "Tiradores" },
    description: {
      en: "Grip, pull and concealed handles for entrance and sliding doors.",
      es: "Tiradores y manijas ocultas para accesos y puertas corredizas.",
    },
  },
  {
    slug: "lock-cylinders",
    label: { en: "Lock cylinders", es: "Cilindros" },
    description: {
      en: "Profile and keyed cylinders, including master-key applications.",
      es: "Cilindros de perfil y con llave, incluso para sistemas amaestrados.",
    },
  },
  {
    slug: "hardware-accessories",
    label: { en: "Hardware accessories", es: "Accesorios de herrajes" },
    description: {
      en: "Viewers, stoppers, transfer devices, bolts, indicators and latches.",
      es: "Mirillas, topes, pasacables, pasadores, indicadores y picaportes.",
    },
  },
] as const;

export const PRODUCT_STORY: readonly ProductStoryDefinition[] = [
  {
    role: "range",
    title: { en: "Range", es: "Gama" },
    description: {
      en: "See the product families first, with complete silhouettes from our catalogue.",
      es: "Vea primero las familias de productos, con siluetas completas del catálogo.",
    },
    image: "/images/editorial/hyde-real-product-atlas.webp",
    alt: {
      en: "Editorial atlas of nine architectural door-hardware families on a neutral field",
      es: "Atlas editorial de nueve familias de herrajes arquitectónicos sobre fondo neutro",
    },
    href: "/products/",
  },
  {
    role: "application",
    title: { en: "Application", es: "Aplicación" },
    description: {
      en: "Start with the door, its opening action and the way it will be used.",
      es: "Empiece por la puerta, su accionamiento y el uso previsto.",
    },
    image: "/images/editorial/hyde-real-application-detail.webp",
    alt: {
      en: "Client catalogue photograph of a storefront push/pull lock mechanism",
      es: "Fotografía del catálogo del cliente de un mecanismo de cerradura de empuje y tracción",
    },
    href: "/projects/",
  },
  {
    role: "technical",
    title: { en: "Technical", es: "Construcción" },
    description: {
      en: "Check the backset, centres and fixing details before choosing a lock case.",
      es: "Compruebe la entrada, los entre-ejes y las fijaciones antes de elegir la cerradura.",
    },
    image: "/images/editorial/hyde-real-lock-plate.webp",
    alt: {
      en: "Original catalogue photograph of the LC14 lock case with its faceplate and bolts",
      es: "Fotografía original de la cerradura LC14 con su frente y pestillos",
    },
    href: "/products/lock-cases/",
  },
] as const;

export const PHOTOGRAPHY_SERIES = [
  {
    image: "/images/editorial/hyde-real-lever-plate.webp",
    label: { en: "Lever systems", es: "Sistemas de manijas" },
    detail: { en: "Opening furniture", es: "Herrajes de accionamiento" },
    href: "/products/lever-handles/",
  },
  {
    image: "/images/editorial/hyde-real-hinge-plate.webp",
    label: { en: "Door hinges", es: "Bisagras para puertas" },
    detail: { en: "Varied constructions", es: "Construcciones variadas" },
    href: "/products/brass-steel-hinges/",
  },
  {
    image: "/images/editorial/hyde-real-pull-plate.webp",
    label: { en: "Glass hardware", es: "Herrajes para vidrio" },
    detail: { en: "Patch, lock and pull families", es: "Familias de patch, cerradura y tirador" },
    href: "/products/glass-door-accessories/",
  },
  {
    image: "/images/editorial/hyde-real-control-plate.webp",
    label: { en: "Door control", es: "Control de puertas" },
    detail: { en: "Surface and concealed systems", es: "Sistemas de superficie y ocultos" },
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
    finder: "Open Product Finder",
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
    finder: "Abrir el buscador de productos",
    configurator: "Formar un conjunto de herrajes",
    representative: "Fotografía de producto de Canton Hyland",
  },
} as const;

function localizedHref(href: string, locale: ProductsLocale): string {
  if (locale === "en") return href;
  return href === "/products/" ? "/es/products/" : `/es${href}`;
}

export function getProductsArchitecture(locale: ProductsLocale) {
  const copy = COPY[locale];

  return {
    ...copy,
    families: PRODUCT_FAMILIES.map((family) => ({
      slug: family.slug,
      label: family.label[locale],
      description: family.description[locale],
      href: localizedHref(`/products/${family.slug}/`, locale),
    })),
    story: PRODUCT_STORY.map((chapter) => ({
      ...chapter,
      title: chapter.title[locale],
      description: chapter.description[locale],
      alt: chapter.alt[locale],
      href: localizedHref(chapter.href, locale),
    })),
    photographySeries: PHOTOGRAPHY_SERIES.map((series) => ({
      ...series,
      label: series.label[locale],
      detail: series.detail[locale],
      href: localizedHref(series.href, locale),
    })),
  };
}
