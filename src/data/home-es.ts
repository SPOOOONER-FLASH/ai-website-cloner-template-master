import type {
  HeroCarouselContent,
  HeroModuleContent,
  PageTeaserContent,
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
        ratio: "1800 / 900",
        src: "/images/editorial/home-panic-exit-double-door.webp",
        label: "Herrajes antipánico 306-D para puerta de dos hojas: barras en ambas hojas y varillas verticales vistas en la hoja cerrada, abierta a un patio exterior",
      },
      title: "Dispositivos antipánico",
      body: "Un empujón y la puerta se abre. Barras antipánico, guarniciones exteriores y cajas de cerradura para puertas de evacuación y cortafuego, pensadas como un conjunto.",
      linkLabel: "Explorar dispositivos",
      href: "/es/products/panic-exit-devices",
    },
    {
      variant: "stacked",
      media: {
        ratio: "1672 / 941",
        src: "/images/editorial/argentina-ar4-entry.webp",
        label: "Umbral arquitectónico contemporáneo en Buenos Aires",
      },
      title: "HYDE Argentina AR-4",
      body: "Cerraduras de embutir compactas seleccionadas para distribuidores argentinos, marcas privadas y pedidos OEM.",
      linkLabel: "Explorar la colección AR-4",
      href: "/es/products/argentina-ar4",
    },
    {
      variant: "stacked",
      media: {
        ratio: "1800 / 900",
        src: "/images/editorial/home-argentina-collection.webp",
        label: "Cerradura de embutir AR5-115 con su frente largo aparte, niquelada, sobre fondo blanco",
      },
      title: "Colección HYDE Argentina",
      body: "Cerraduras de embutir, cerrojos y cerraduras para batientes angostos fabricadas con matrices HYDE para distribuidores argentinos, con medidas de frente y caja de cada modelo.",
      linkLabel: "Explorar la colección Argentina",
      href: "/es/products/argentina",
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

