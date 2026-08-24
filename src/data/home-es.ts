import type {
  HeroCarouselContent,
  HeroModuleContent,
  PageTeaserContent,
  TextModuleContent,
} from "@/types/fsb-modules";
import { spacers } from "./home";

export { spacers };

export const hero1: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 943",
    src: "/images/editorial/hero-warm-residential-entry.webp",
    label: "Umbral residencial de madera y piedra caliza abierto hacia un patio ajardinado",
  },
  title: "Cerradura tubular moderna",
  body: "Una manilla negra de líneas limpias para interiores residenciales contemporáneos.",
  linkLabel: "Ver producto",
  href: "/products/lever-handles/black-tubular-lever-lock-set",
};

/**
 * Mismo orden que la versión inglesa: los dispositivos antipánico son la línea
 * insignia y ocupan el primer fotograma.
 */
export const heroCarousel: HeroCarouselContent = {
  ariaLabel: "Herrajes destacados",
  slides: [
    {
      variant: "stacked",
      media: {
        ratio: "2400 / 943",
        src: "/images/editorial/hero-cultural-entrance.webp",
        label: "Entrada arquitectónica de piedra, vidrio y metal con luz natural neutra",
      },
      title: "Dispositivos Antipánico",
      body: "Herrajes de liberación rápida para una evacuación fiable en edificios comerciales.",
      linkLabel: "Explorar dispositivos",
      href: "/products/panic-exit-devices/305-fire-door-panic-exit-device",
    },
    hero1,
    {
      variant: "stacked",
      media: {
        ratio: "2400 / 943",
        src: "/images/editorial/hero-civic-corridor.webp",
        label: "Pasillo de edificio público con particiones acristaladas y puertas de evacuación",
      },
      title: "Cerraduras Cortafuego",
      body: "Soluciones robustas para puertas de alto tránsito y aplicaciones con resistencia al fuego.",
      linkLabel: "Ver cerraduras",
      href: "/products/door-locks",
    },
  ],
};

export const teaser1: PageTeaserContent = {
  heading: "Dos formas de trabajar con nosotros",
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/material-brushed-steel.webp",
        label: "Estudio de material de acero inoxidable cepillado con grano direccional",
      },
      title: "Para distribuidores",
      subtitle: "Suministro desde el catálogo de exportación de Canton Hyland",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/material-metal-stone-detail.webp",
        label: "Estudio representativo de unión entre metal, piedra, madera y vidrio",
      },
      title: "Para prescriptores",
      subtitle: "Prepare un cuadro de herrajes con nuestro equipo técnico",
      href: "/products",
    },
  ],
};

export const hero2: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 1159",
    src: "/images/editorial/home-commercial-egress.webp",
    label: "Arquitectura de ruta de evacuación comercial con puertas dobles y pasillo tranquilo",
  },
  title: "Dispositivos antipánico",
  body: "Nuestra gama principal de seguridad para salidas rápidas en edificios comerciales.",
  linkLabel: "Explorar la gama principal",
  href: "/products/panic-exit-devices",
};

export const text1: TextModuleContent = {
  heading: "Aplicaciones de Canton Hyland",
  body: "Dispositivos antipánico, cerraduras, manillas y cierrapuertas para edificios comerciales, institucionales y residenciales en mercados de exportación.",
  linkLabel: "Ver proyectos",
  href: "/es/projects",
};

export const teaser2: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/project-commercial-egress.webp",
        label: "Estudio representativo de evacuación comercial con puertas dobles de salida",
      },
      title: "Evacuación comercial",
      subtitle: "Estudio representativo de herrajes para circulación y salidas reglamentarias",
      href: "/es/projects/commercial-fire-egress-hardware",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/project-hospitality-residential.webp",
        label: "Estudio representativo de herrajes para hotelería y vivienda",
      },
      title: "Hotelería + vivienda",
      subtitle: "Estudios de acceso y pasillo para conjuntos coordinados de herrajes",
      href: "/es/projects/hospitality-residential-door-package",
    },
  ],
};

export const hero3: HeroModuleContent = {
  variant: "side",
  media: {
    ratio: "3 / 2",
    src: "/images/editorial/home-design-context.webp",
    label: "Ritmo arquitectónico de puertas y encuentros de madera, piedra y metal",
  },
  title: "Diseñado para",
  body: "Nueve familias de producto",
  linkLabel: "Ver catálogo",
  href: "/products",
};

export const hero4: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "3 / 2",
    src: "/images/company/factory-cnc-production.webp",
    label: "Equipos de mecanizado CNC de Canton Hyland en un taller de herrajes",
  },
  title: "Nuestra empresa",
  body: "Fabricamos herrajes comerciales y residenciales desde 1998, con ISO 9001 desde 2002 y capacidad OEM para mercados internacionales.",
  linkLabel: "Conocer Canton Hyland",
  href: "/es/company",
};

export const text2: TextModuleContent = {
  heading: "Servicio + Descargas",
  body: "Desarrollamos soluciones OEM adaptadas a cada mercado y apoyamos al comprador con documentación técnica y de exportación.",
  linkLabel: "Descargas",
  href: "/downloads",
};

export const teaser3: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/material-bronze-patina.webp",
        label: "Superficie de bronce con pátina natural y variación tonal",
      },
      title: "Cuéntenos su proyecto",
      subtitle: "Le pondremos en contacto con el equipo de exportación adecuado",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/industrial-precision-parts.webp",
        label: "Estudio editorial representativo de componentes mecanizados de precisión",
      },
      title: "Documentación y normas",
      subtitle: "Consulte grados, ensayos, acabados y plazos",
      href: "/es/company",
    },
  ],
};

export const text3: TextModuleContent = {
  heading: "Ingeniería para exportación",
  body: "Selección de acabados, sistemas de llave y detalle de especificación para cada mercado.",
  linkLabel: "Contactar",
  href: "/es/contact",
};

export const hero5: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 1464",
    src: "/images/editorial/home-editorial-insight.webp",
    label: "Estudio abstracto de luz arquitectónica con superficies de vidrio y metal",
  },
  title: "Especificación de herrajes",
  linkLabel: "Hablar con exportación",
  href: "/es/contact",
};
