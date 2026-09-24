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
      en: "The first handshake a building gives. Lever sets in stainless steel, brass and matte black.",
      es: "El primer apretón de manos de un edificio. Manijas en acero inoxidable, latón y negro mate.",
      pt: "O primeiro aperto de mão de um prédio. Maçanetas em aço inoxidável, latão e preto fosco.",
    },
  },
  {
    slug: "panic-exit-devices",
    label: { en: "Panic exit devices", es: "Barras antipánico", pt: "Barras antipânico" },
    description: {
      en: "Made for the day nobody plans for. Push bars for escape and fire doors, single-point to multi-point.",
      es: "Hechas para el día que nadie planea. Barras de empuje para puertas de evacuación y cortafuego, de un punto a multipunto.",
      pt: "Feitas para o dia que ninguém planeja. Barras de empurrar para portas de saída de emergência e corta-fogo, de um ponto a multiponto.",
    },
  },
  {
    slug: "lock-cases",
    label: { en: "Lock cases", es: "Cerraduras de embutir", pt: "Fechaduras de embutir" },
    description: {
      en: "The part inside the door that keeps its word. Mortise cases by backset and bolt.",
      es: "La pieza de dentro que cumple su palabra. Cajas de embutir por entrada y pestillo.",
      pt: "A peça lá dentro que cumpre a palavra. Caixas de embutir por distância ao eixo e lingueta.",
    },
  },
  {
    slug: "door-closers",
    label: { en: "Door control", es: "Control de puertas", pt: "Controle de porta" },
    description: {
      en: "Every door, closed at the right speed. Surface closers sized by leaf weight and width.",
      es: "Cada puerta, cerrada a la velocidad justa. Cierrapuertas de superficie según el peso y el ancho de la hoja.",
      pt: "Cada porta fechada na velocidade certa. Molas aéreas de sobrepor pelo peso e pela largura da folha.",
    },
  },
  {
    slug: "brass-steel-hinges",
    label: { en: "Door hinges", es: "Bisagras para puertas", pt: "Dobradiças" },
    description: {
      en: "Carrying the door, quietly, for years. Brass, stainless steel and steel hinges.",
      es: "Sostienen la puerta en silencio, año tras año. Bisagras de latón, acero inoxidable y acero.",
      pt: "Sustentam a porta em silêncio, ano após ano. Dobradiças de latão, aço inoxidável e aço.",
    },
  },
  {
    slug: "glass-door-accessories",
    label: { en: "Glass door hardware", es: "Herrajes para puertas de vidrio", pt: "Ferragens para porta de vidro" },
    description: {
      en: "Holding glass without hiding it. Patch fittings and pulls for frameless doors.",
      es: "Sujetan el vidrio sin taparlo. Herrajes de fijación y tiradores para puertas de vidrio sin marco.",
      pt: "Seguram o vidro sem escondê-lo. Ferragens de fixação e puxadores para portas de vidro sem moldura.",
    },
  },
  {
    slug: "grip-handle-sets",
    label: { en: "Pull handles", es: "Tiradores", pt: "Puxadores" },
    description: {
      en: "What people reach for first. Grip, pull and concealed handles for entrance and sliding doors.",
      es: "Lo primero que busca la mano. Tiradores y manijas ocultas para accesos y puertas corredizas.",
      pt: "A primeira coisa que a mão procura. Puxadores de pegar, de tubo e embutidos para entradas e portas de correr.",
    },
  },
  {
    slug: "lock-cylinders",
    label: { en: "Lock cylinders", es: "Cilindros", pt: "Cilindros" },
    description: {
      en: "One key, the right doors. Profile and keyed cylinders, master-key systems included.",
      es: "Una llave, las puertas correctas. Cilindros de perfil y con llave, también para sistemas amaestrados.",
      pt: "Uma chave, as portas certas. Cilindros de perfil e com chave, também para sistemas de chave-mestra.",
    },
  },
  {
    slug: "hardware-accessories",
    label: { en: "Hardware accessories", es: "Accesorios de herrajes", pt: "Acessórios de ferragem" },
    description: {
      en: "The small parts that finish the job. Viewers, stops, transfer devices, bolts, indicators and latches.",
      es: "Las piezas pequeñas que rematan el trabajo. Mirillas, topes, pasacables, pasadores, indicadores y pestillos.",
      pt: "As peças pequenas que completam o serviço. Olhos mágicos, batentes, passa-fios, ferrolhos, indicadores e trincos.",
    },
  },
] as const;

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
      "Everything a door needs, from the lever in the hand to the lock case inside the leaf. Nine families, one standard: every dimension written down, every part made to work with the ones around it.",
    rangeMeta: "Nine coordinated families · one catalog",
    familiesHeading: "Nine ways into the catalog",
    familiesBody:
      "Each family opens onto its models and the figures that decide whether they fit. The complete catalog below compares them side by side.",
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
      "Todo lo que necesita una puerta, desde la manija en la mano hasta la caja de cerradura dentro de la hoja. Nueve familias y un mismo criterio: cada medida por escrito y cada pieza hecha para trabajar con las que la rodean.",
    rangeMeta: "Nueve familias coordinadas · un catálogo",
    familiesHeading: "Nueve entradas al catálogo",
    familiesBody:
      "Cada familia lleva a sus modelos y a las cifras que deciden si encajan. El catálogo completo, más abajo, los compara uno al lado del otro.",
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
      "Tudo o que uma porta precisa, da maçaneta na mão à caixa de fechadura dentro da folha. Nove famílias e um mesmo critério: cada medida registrada e cada peça feita para trabalhar com as que estão ao redor.",
    rangeMeta: "Nove famílias coordenadas · um catálogo",
    familiesHeading: "Nove entradas no catálogo",
    familiesBody:
      "Cada família leva aos seus modelos e aos números que decidem se eles servem. O catálogo completo, logo abaixo, compara todos lado a lado.",
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
