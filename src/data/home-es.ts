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
  title: "Manijas de palanca",
  body: "Juegos de manija tubulares y de embutir en acero inoxidable, latón y negro mate para puertas residenciales y comerciales ligeras.",
  linkLabel: "Ver manijas de palanca",
  href: "/es/products/lever-handles",
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
        src: "/images/editorial/home-panic-exit-bars.webp",
        label: "Estudio representativo de puertas cortafuego comerciales con barras antipánico claramente visibles",
      },
      title: "Dispositivos antipánico",
      body: "Herrajes de liberación rápida para una evacuación fiable en edificios comerciales.",
      linkLabel: "Explorar dispositivos",
      href: "/es/products/panic-exit-devices",
    },
    hero1,
    {
      variant: "stacked",
      media: {
        ratio: "2400 / 943",
        src: "/images/editorial/hero-civic-corridor.webp",
        label: "Pasillo de edificio público con particiones acristaladas y puertas de evacuación",
      },
      title: "Cajas de cerradura",
      body: "Cuerpos de cerradura con distintas entradas, distancias entre ejes y configuraciones de bulones para cuadros de puertas comerciales.",
      linkLabel: "Ver cajas de cerradura",
      href: "/es/products/lock-cases",
    },
  ],
};

export const teaser1: PageTeaserContent = {
  heading: "Compre por gama o por proyecto",
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-source-by-range-2026.webp",
        label: "Caja de muestras de herrajes con manilla, bisagra y cerradura de embutir",
      },
      title: "Para distribuidores",
      subtitle: "Suministro desde el catálogo de exportación de Canton Hyland",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-source-by-project-2026.webp",
        label: "Muestra de puerta para especificación con cerradura, bisagra, manilla, acabados y cuadro en blanco",
      },
      title: "Para prescriptores",
      subtitle: "Prepare un cuadro de herrajes con nuestro equipo técnico",
      href: "/es/products",
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
  href: "/es/products/panic-exit-devices",
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
      subtitle: "Estudio representativo de herrajes para circulación y rutas de evacuación con criterios normativos",
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
    src: "/images/editorial/hyde-nine-families-showroom-2026.webp",
    label: "Exposición real de familias coordinadas de herrajes para puertas",
  },
  title: "Diseñado para",
  body: "Nueve familias, un solo cuadro coordinado",
  linkLabel: "Ver catálogo",
  href: "/es/products",
};

export const hero4: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "3 / 2",
    src: "/images/editorial/hyde-materials-engineering-2026.webp",
    label: "Muestras de ingeniería de herrajes con cerradura, bisagra, cierrapuertas, manilla, tornillería y acabados",
  },
  title: "Materiales + ingeniería",
  body: "La coordinación de acabados, la planificación de llaves maestras y la documentación de exportación apoyan cuadros de herrajes comerciales y residenciales en mercados internacionales.",
  linkLabel: "Cómo trabajamos",
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
        src: "/images/editorial/hyde-engineering-contact-2026.webp",
        label: "Mesa de muestras con cerradura, bisagra, manilla, acabados y cuadro de proyecto en blanco",
      },
      title: "Envíenos sus requisitos de herrajes",
      subtitle: "Asignaremos su proyecto al especialista de exportación adecuado",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-installation-faq-2026.webp",
        label: "Cerradura de embutir, bisagra y cierrapuertas organizados para resolver dudas de instalación",
      },
      title: "Especifique con confianza",
      subtitle: "Respuestas sobre instalación, acabados, normas y plazos",
      href: "/faq",
    },
  ],
};

export const text3: TextModuleContent = {
  heading: "Ingeniería para exportación",
  body: "Selección de acabados, sistemas de llave maestra y detalles de especificación para cada mercado.",
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
