import type { Locale } from "@/data/site";
export type MenuLocale = Locale;
export type MenuVariant = "rfq-concierge" | "specify-source-company";

export const MENU_VARIANT: MenuVariant = "rfq-concierge";

export interface MenuExperienceLink {
  label: string;
  href: string;
  detail?: string;
}

export interface MenuExperienceGroup {
  title: string;
  links: MenuExperienceLink[];
}

export interface ConciergeExperience {
  kind: "rfq-concierge";
  eyebrow: string;
  title: string;
  primary: Array<Required<MenuExperienceLink>>;
  groups: MenuExperienceGroup[];
  exportDesk: string;
  exportPromise: string;
}

export interface SpecifyExperience {
  kind: "specify-source-company";
  eyebrow: string;
  title: string;
  groups: MenuExperienceGroup[];
  cards: Array<Required<MenuExperienceLink> & { image: string; alt: string }>;
  exportDesk: string;
  exportPromise: string;
}

export type MenuExperience = ConciergeExperience | SpecifyExperience;

const concierge: Record<MenuLocale, ConciergeExperience> = {
  en: {
    kind: "rfq-concierge",
    eyebrow: "Specify, source, enquire",
    title: "What are you trying to specify?",
    primary: [
      {
        label: "I know the model",
        detail: "Browse and filter published models",
        href: "/product-finder/",
      },
      {
        label: "I know the door",
        detail: "Choose an opening and build the hardware set",
        href: "/configurator/",
      },
      {
        label: "I need an engineer",
        detail: "Send the door schedule to our export team",
        href: "/contact/",
      },
    ],
    groups: [
      {
        title: "Explore",
        links: [
          { label: "Products", href: "/products/" },
          { label: "Applications", href: "/projects/" },
          { label: "News + Press", href: "/news/" },
        ],
      },
      {
        title: "Evidence",
        links: [
          { label: "Company", href: "/company/" },
          { label: "Certificates", href: "/certifications/" },
          { label: "Order codes", href: "/finishes/" },
          { label: "Model lookup", href: "/model-lookup/" },
          { label: "Glossary", href: "/glossary/" },
          { label: "Downloads", href: "/downloads/" },
          { label: "Services", href: "/services/" },
        ],
      },
    ],
    exportDesk: "Export desk",
    exportPromise: "One contact from sample review to production order.",
  },
  es: {
    kind: "rfq-concierge",
    eyebrow: "Especificar, abastecer, consultar",
    title: "¿Qué necesita especificar?",
    primary: [
      {
        label: "Conozco el modelo",
        detail: "Explore y filtre los modelos publicados",
        href: "/es/product-finder/",
      },
      {
        label: "Conozco la puerta",
        detail: "Elija una abertura y forme el conjunto de herrajes",
        href: "/es/configurator/",
      },
      {
        label: "Necesito un ingeniero",
        detail: "Envíe el cuadro de puertas a nuestro equipo de exportación",
        href: "/es/contact/",
      },
    ],
    groups: [
      {
        title: "Explorar",
        links: [
          { label: "Productos", href: "/es/products/" },
          { label: "Aplicaciones", href: "/es/projects/" },
          { label: "Noticias + Prensa", href: "/es/news/" },
        ],
      },
      {
        title: "Evidencia",
        links: [
          { label: "Empresa", href: "/es/company/" },
          { label: "Certificados", href: "/es/certifications/" },
          { label: "Códigos de pedido", href: "/es/finishes/" },
          { label: "Buscador de modelos", href: "/es/model-lookup/" },
          { label: "Glosario", href: "/es/glossary/" },
          { label: "Descargas", href: "/es/downloads/" },
          { label: "Servicios", href: "/es/services/" },
        ],
      },
    ],
    exportDesk: "Equipo de exportación",
    exportPromise: "Un solo contacto desde la muestra hasta el pedido de producción.",
  },
  pt: {
    kind: "rfq-concierge",
    eyebrow: "Especificar, abastecer, consultar",
    title: "O que precisa de especificar?",
    primary: [
      {
        label: "Sei o modelo",
        detail: "Percorra e filtre os modelos publicados",
        href: "/pt/product-finder/",
      },
      {
        label: "Sei a porta",
        detail: "Escolha um vão e monte o conjunto de ferragens",
        href: "/pt/configurator/",
      },
      {
        label: "Preciso de um engenheiro",
        detail: "Envie o quadro de ferragens à nossa equipe de exportação",
        href: "/pt/contact/",
      },
    ],
    groups: [
      {
        title: "Explorar",
        links: [
          { label: "Produtos", href: "/pt/products/" },
          { label: "Aplicações", href: "/pt/projects/" },
          { label: "Notícias + Imprensa", href: "/pt/news/" },
        ],
      },
      {
        title: "Evidência",
        links: [
          { label: "Empresa", href: "/pt/company/" },
          { label: "Certificados", href: "/pt/certifications/" },
          { label: "Códigos de pedido", href: "/pt/finishes/" },
          { label: "Procurar modelo", href: "/pt/model-lookup/" },
          { label: "Glossário", href: "/pt/glossary/" },
          { label: "Downloads", href: "/pt/downloads/" },
          { label: "Serviços", href: "/pt/services/" },
        ],
      },
    ],
    exportDesk: "Equipe de exportação",
    exportPromise: "Um único contato, da amostra ao pedido de produção.",
  },
};

const specify: Record<MenuLocale, SpecifyExperience> = {
  en: {
    kind: "specify-source-company",
    eyebrow: "Direct routes",
    title: "Specify. Source. Know the factory.",
    groups: [
      {
        title: "Specify",
        links: [
          { label: "Products", detail: "Nine product families", href: "/products/" },
          { label: "Product Finder", detail: "Filter and compare", href: "/product-finder/" },
          { label: "Configurator", detail: "Build a hardware set", href: "/configurator/" },
        ],
      },
      {
        title: "Source",
        links: [
          { label: "Applications", href: "/projects/" },
          { label: "Services", href: "/services/" },
          { label: "Downloads", href: "/downloads/" },
          { label: "Certificates", href: "/certifications/" },
          { label: "Order codes", href: "/finishes/" },
          { label: "Model lookup", href: "/model-lookup/" },
          { label: "Glossary", href: "/glossary/" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About us", href: "/company/" },
          { label: "News", href: "/news/" },
          { label: "Events", href: "/events/" },
          { label: "Contact", href: "/contact/" },
        ],
      },
    ],
    cards: [
      {
        label: "Product Finder",
        detail: "Filter published models by family, finish and door condition.",
        href: "/product-finder/",
        image: "/images/editorial/hyde-real-product-atlas.webp",
        alt: "Canton Hyland catalog product families",
      },
      {
        label: "Applications",
        detail: "See how coordinated hardware meets the opening.",
        href: "/projects/",
        image: "/images/editorial/hyde-hero-cylinder.webp",
        alt: "Client catalog photograph of a storefront push/pull lock",
      },
    ],
    exportDesk: "Export desk",
    exportPromise: "One contact from sample review to production order.",
  },
  es: {
    kind: "specify-source-company",
    eyebrow: "Rutas directas",
    title: "Especifique. Abastézcase. Conozca la fábrica.",
    groups: [
      {
        title: "Especificar",
        links: [
          { label: "Productos", detail: "Nueve familias", href: "/es/products/" },
          {
            label: "Buscador de productos",
            detail: "Filtrar y comparar",
            href: "/es/product-finder/",
          },
          {
            label: "Configurador",
            detail: "Formar un conjunto de herrajes",
            href: "/es/configurator/",
          },
        ],
      },
      {
        title: "Abastecer",
        links: [
          { label: "Aplicaciones", href: "/es/projects/" },
          { label: "Servicios", href: "/es/services/" },
          { label: "Descargas", href: "/es/downloads/" },
          { label: "Certificados", href: "/es/certifications/" },
          { label: "Códigos de pedido", href: "/es/finishes/" },
          { label: "Buscador de modelos", href: "/es/model-lookup/" },
          { label: "Glosario", href: "/es/glossary/" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Quiénes somos", href: "/es/company/" },
          { label: "Noticias", href: "/es/news/" },
          { label: "Ferias", href: "/events/" },
          { label: "Contacto", href: "/es/contact/" },
        ],
      },
    ],
    cards: [
      {
        label: "Buscador de productos",
        detail: "Filtre modelos publicados por familia, acabado y tipo de puerta.",
        href: "/es/product-finder/",
        image: "/images/editorial/hyde-real-product-atlas.webp",
        alt: "Familias de productos del catálogo Canton Hyland",
      },
      {
        label: "Aplicaciones",
        detail: "Vea cómo los herrajes coordinados responden a la abertura.",
        href: "/es/projects/",
        image: "/images/editorial/hyde-hero-cylinder.webp",
        alt: "Fotografía de una cerradura de empuje y tracción del catálogo Canton Hyland",
      },
    ],
    exportDesk: "Equipo de exportación",
    exportPromise: "Un solo contacto desde la muestra hasta el pedido de producción.",
  },
  pt: {
    kind: "specify-source-company",
    eyebrow: "Rotas diretas",
    title: "Especifique. Abasteça-se. Conheça a fábrica.",
    groups: [
      {
        title: "Especificar",
        links: [
          { label: "Produtos", detail: "Nove famílias", href: "/pt/products/" },
          {
            label: "Procurar produto",
            detail: "Filtrar e comparar",
            href: "/pt/product-finder/",
          },
          {
            label: "Configurador",
            detail: "Montar um conjunto de ferragens",
            href: "/pt/configurator/",
          },
        ],
      },
      {
        title: "Abastecer",
        links: [
          { label: "Aplicações", href: "/pt/projects/" },
          { label: "Serviços", href: "/pt/services/" },
          { label: "Downloads", href: "/pt/downloads/" },
          { label: "Certificados", href: "/pt/certifications/" },
          { label: "Códigos de pedido", href: "/pt/finishes/" },
          { label: "Procurar modelo", href: "/pt/model-lookup/" },
          { label: "Glossário", href: "/pt/glossary/" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Quem somos", href: "/pt/company/" },
          { label: "Notícias", href: "/pt/news/" },
          { label: "Feiras", href: "/events/" },
          { label: "Contato", href: "/pt/contact/" },
        ],
      },
    ],
    cards: [
      {
        label: "Procurar produto",
        detail: "Filtre modelos publicados por família, acabamento e tipo de porta.",
        href: "/pt/product-finder/",
        image: "/images/editorial/hyde-real-product-atlas.webp",
        alt: "Famílias de produtos do catálogo Canton Hyland",
      },
      {
        label: "Aplicações",
        detail: "Veja como as ferragens coordenadas respondem ao vão.",
        href: "/pt/projects/",
        image: "/images/editorial/hyde-hero-cylinder.webp",
        alt: "Fotografia de uma fechadura de empurrar e puxar do catálogo Canton Hyland",
      },
    ],
    exportDesk: "Equipe de exportação",
    exportPromise: "Um único contato, da amostra ao pedido de produção.",
  },
};

export function getMenuExperience(
  locale: MenuLocale,
  variant: "rfq-concierge",
): ConciergeExperience;
export function getMenuExperience(
  locale: MenuLocale,
  variant: "specify-source-company",
): SpecifyExperience;
export function getMenuExperience(
  locale: MenuLocale,
  variant?: MenuVariant,
): MenuExperience;
export function getMenuExperience(
  locale: MenuLocale,
  variant: MenuVariant = MENU_VARIANT,
): MenuExperience {
  return variant === "rfq-concierge" ? concierge[locale] : specify[locale];
}
