export type MenuLocale = "en" | "es";
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
          { label: "Descargas", href: "/es/downloads/" },
          { label: "Servicios", href: "/services/" },
        ],
      },
    ],
    exportDesk: "Equipo de exportación",
    exportPromise: "Un solo contacto desde la muestra hasta el pedido de producción.",
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
        alt: "Canton Hyland catalogue product families",
      },
      {
        label: "Applications",
        detail: "See how coordinated hardware meets the opening.",
        href: "/projects/",
        image: "/images/editorial/hyde-real-application-detail.webp",
        alt: "Client catalogue photograph of a storefront push/pull lock",
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
          { label: "Servicios", href: "/services/" },
          { label: "Descargas", href: "/es/downloads/" },
          { label: "Certificados", href: "/es/certifications/" },
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
        image: "/images/editorial/hyde-real-application-detail.webp",
        alt: "Fotografía de una cerradura de empuje y tracción del catálogo Canton Hyland",
      },
    ],
    exportDesk: "Equipo de exportación",
    exportPromise: "Un solo contacto desde la muestra hasta el pedido de producción.",
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
