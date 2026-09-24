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
  body: "Juegos de manijas tubulares y de embutir en acero inoxidable, latón y negro mate, para vivienda y puertas comerciales ligeras.",
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
      body: "Un empujón y la puerta se abre. Barras antipánico, guarniciones exteriores y cajas de cerradura para puertas de evacuación y cortafuego, pensadas como un conjunto.",
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
      body: "Cajas de cerradura por entrada, distancia entre ejes y tipo de pestillo, con cada medida escrita al milímetro para que la manija, el cilindro y el cerradero encajen a la primera.",
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
        src: "/images/editorial/hyde-real-lever-set-dark.webp",
        label:
          "Juego completo de cerradura tubular de manija sobre fondo oscuro: dos manijas sobre roseta con el cuadradillo y el mecanismo a la vista, el pestillo tubular, el cerradero, la placa y tres tornillos de fijación —todas las piezas en un mismo acabado",
      },
      title: "Para distribuidores",
      subtitle: "Suministro desde el catálogo de exportación de Canton Hyland",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-real-cylinder-dark.webp",
        label:
          "Cilindro de perfil europeo con perilla fotografiada sobre fondo oscuro junto a su tornillo de fijación y tres llaves —el tornillo atraviesa la leva, el punto desde el que se miden las dos mitades del cilindro",
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
  body: "Nuestra gama principal, y la que mejor conocemos: barras antipánico para puertas de evacuación y cortafuego, desde dispositivos de sobreponer de un punto hasta juegos multipunto para puertas de dos hojas.",
  linkLabel: "Explorar la gama principal",
  href: "/es/products/panic-exit-devices",
};

export const text1: TextModuleContent = {
  heading: "Aplicaciones de Canton Hyland",
  body: "Nuestras barras antipánico, cerraduras, manijas y cierrapuertas se instalan en edificios comerciales, institucionales y residenciales de los mercados a los que exportamos, muchas veces con la marca de nuestros clientes.",
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
    src: "/images/editorial/hyde-real-product-atlas.webp",
    label: "Fotografías reales del catálogo de herrajes seleccionados para puertas",
  },
  title: "Diseñado para",
  body: "Herrajes seleccionados, un solo cuadro coordinado",
  linkLabel: "Ver catálogo",
  href: "/es/products",
};

export const hero4: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "1 / 1",
    src: "/images/editorial/hyde-client-lc04-selection.webp",
    label: "Cerradura de embutir con cuatro pestillos, cerradero y caja de cerradero",
  },
  title: "Materiales + ingeniería",
  body: "Acabados iguales en toda una planilla de puertas, sistemas de llave maestra planificados antes de cortar el primer cilindro y documentación de exportación lista cuando sale el contenedor.",
  linkLabel: "Cómo trabajamos",
  href: "/es/company",
};

export const text2: TextModuleContent = {
  heading: "Servicio + Descargas",
  body: "Moldes nuevos a partir de su plano o su muestra, y su marca en la pieza. Si el diseño que nos trae está protegido por la patente de otro fabricante, nuestros ingenieros modifican las piezas o el aspecto hasta que deja de chocar con esa patente.",
  linkLabel: "Descargas",
  href: "/es/downloads",
};

export const teaser3: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-hero-lockcase.webp",
        label: "Fotografía original de herrajes de control de puertas",
      },
      title: "Envíenos sus requisitos de herrajes",
      subtitle: "Asignaremos su proyecto al especialista de exportación adecuado",
      href: "/es/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-client-black-hinge.webp",
        label: "Bisagra negra con orificios de fijación alternados sobre fondo claro",
      },
      title: "Especifique con confianza",
      subtitle: "Respuestas sobre instalación, acabados, normas y plazos",
      href: "/es/faq",
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
