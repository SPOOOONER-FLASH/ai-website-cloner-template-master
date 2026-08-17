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
    ratio: "1920 / 754",
    src: "/images/company/hero-modern-tubular-lock.webp",
    label: "Manilla cuadrada de acero inoxidable satinado sobre una puerta de nogal",
  },
  title: "Cerradura tubular moderna",
  body: "Una manilla negra de líneas limpias para interiores residenciales contemporáneos.",
  linkLabel: "Ver producto",
  href: "/products/lever-handles/black-tubular-lever-lock-set",
};

export const heroCarousel: HeroCarouselContent = {
  ariaLabel: "Herrajes destacados",
  slides: [
    hero1,
    {
      variant: "stacked",
      media: {
        ratio: "1920 / 754",
        src: "/images/concepts/hero-panic-exit-device.webp",
        label: "Dispositivo antipánico instalado en una salida comercial",
      },
      title: "Dispositivos Antipánico",
      body: "Herrajes de liberación rápida para una evacuación fiable en edificios comerciales.",
      linkLabel: "Explorar dispositivos",
      href: "/products/panic-exit-devices/305-fire-door-panic-exit-device",
    },
    {
      variant: "stacked",
      media: {
        ratio: "1920 / 754",
        src: "/images/concepts/hero-heavy-duty-fire-door-lock.webp",
        label: "Cerradura de alta resistencia para puerta cortafuego",
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
        src: "/images/products/cat-panic-exit-device.webp",
        label: "Dispositivo antipánico de acero inoxidable con barra horizontal",
      },
      title: "Para distribuidores",
      subtitle: "Suministro desde el catálogo de exportación de Canton Hyland",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/products/cat-lever-handle-lock.webp",
        label: "Juego de manilla de acero inoxidable sobre placa",
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
    ratio: "2880 / 1391",
    src: "/images/company/hero-panic-exit-banner.webp",
    label: "Dispositivo antipánico Hyland instalado en puertas de emergencia",
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
        src: "/images/products/305-fire-door-panic-exit-device.webp",
        label: "Dispositivo antipánico 305 para puerta cortafuego",
      },
      title: "Dispositivo antipánico 305",
      subtitle: "Barra de un punto para puertas de evacuación resistentes al fuego",
      href: "/products/panic-exit-devices/305-fire-door-panic-exit-device",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/products/lc14-8550-mortise-lock-case.webp",
        label: "Caja de cerradura LC14 de cuatro bulones",
      },
      title: "Caja de cerradura LC14 85×50",
      subtitle: "Cuerpo para cilindro de perfil europeo",
      href: "/products/mortise-locks/lc14-8550-four-bolt-mortise-lock-case",
    },
  ],
};

export const hero3: HeroModuleContent = {
  variant: "side",
  media: {
    ratio: "970 / 646",
    src: "/images/company/hero-designed-for.webp",
    label: "Cerradura de empuje y tiro para puerta comercial",
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
    src: "/images/company/factory-assembly-quality-line.webp",
    label: "Línea de montaje y control de calidad de herrajes",
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
        src: "/images/products/glass-door-patch-fitting-set.webp",
        label: "Juego de herrajes para puerta de vidrio",
      },
      title: "Cuéntenos su proyecto",
      subtitle: "Le pondremos en contacto con el equipo de exportación adecuado",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/products/ansi-grade-3-keyed-deadbolt.webp",
        label: "Cerrojo con llave ANSI Grade 3",
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
    ratio: "3 / 2",
    src: "/images/company/showroom-emergency-hardware.webp",
    label: "Exposición de herrajes de seguridad y evacuación",
  },
  title: "Especificación de herrajes",
  linkLabel: "Hablar con exportación",
  href: "/es/contact",
};
