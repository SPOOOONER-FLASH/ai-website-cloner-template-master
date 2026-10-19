import type {
  HeroCarouselContent,
  HeroModuleContent,
  PageTeaserContent,
} from "@/types/fsb-modules";
import { spacers } from "./home";

export { spacers };

/**
 * The Portuguese homepage content.
 *
 * Same module order and the same images as the English and Spanish pages — the layout is
 * the layout, and a third arrangement would be a third thing to keep in step for no
 * reason. Only the words change, and the hrefs, which point into /pt where a Portuguese
 * page exists and into the English tree where one does not yet.
 *
 * ⚠ THE HREFS ARE NOT ALL /pt, AND THAT IS DELIBERATE. `/downloads` and `/faq` on the
 * Spanish page point at the English routes for the same reason: sending a reader to /pt/…
 * that does not exist is a 404 dressed as a translation. When those routes are built, the
 * prefixes change here in the same commit.
 */

export const hero1: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 943",
    src: "/images/editorial/hero-warm-residential-entry.webp",
    label: "Soleira residencial em madeira e pedra calcária aberta para um pátio ajardinado",
  },
  title: "Maçanetas de alavanca",
  body: "Conjuntos de maçanetas tubulares e de embutir em aço inoxidável, latão e preto fosco, para residências e portas comerciais leves.",
  linkLabel: "Ver maçanetas",
  href: "/pt/products/lever-handles",
};

/** Mesma ordem da versão inglesa: as barras antipânico são a linha principal. */
export const heroCarousel: HeroCarouselContent = {
  ariaLabel: "Ferragens em destaque",
  slides: [
    {
      variant: "stacked",
      media: {
        ratio: "1800 / 900",
        src: "/images/editorial/home-panic-exit-double-door.webp",
        label: "Ferragens antipânico 306-D em porta de duas folhas: barras nas duas folhas e hastes verticais aparentes na folha fechada, abrindo para um pátio externo",
      },
      title: "Barras antipânico",
      body: "Um empurrão e a porta abre. Barras antipânico, guarnições externas e caixas de fechadura para portas de saída de emergência e corta-fogo, pensadas como um conjunto.",
      linkLabel: "Explorar barras antipânico",
      href: "/pt/products/panic-exit-devices",
    },
    /* Brazil only (client, 2026-10-12): the fire-door landing page exists in Portuguese alone. */
    {
      variant: "stacked",
      media: {
        ratio: "1800 / 900",
        src: "/images/editorial/home-brazil-fire-door.webp",
        label: "Barra antipânico 305 para porta corta-fogo, fotografada sobre fundo branco",
      },
      title: "Ferragens para porta corta-fogo",
      body: "Barras antipânico de 650 a 1110 mm, maçanetas externas com chave, fechaduras e cilindros, com os documentos de cada modelo.",
      linkLabel: "Ver ferragens corta-fogo",
      href: "/pt/ferragens-porta-corta-fogo",
    },
    {
      variant: "stacked",
      media: {
        ratio: "1672 / 941",
        src: "/images/editorial/argentina-ar4-entry.webp",
        label: "Entrada arquitetônica contemporânea em Buenos Aires",
      },
      title: "HYDE Argentina AR-4",
      body: "Caixas de fechadura de embutir compactas selecionadas para distribuidores argentinos, marca própria e pedidos OEM.",
      linkLabel: "Ver a coleção AR-4",
      href: "/products/argentina-ar4",
    },
    {
      variant: "stacked",
      media: {
        ratio: "1800 / 900",
        src: "/images/editorial/home-argentina-collection.webp",
        label: "Fechadura de embutir AR5-115 com a testa longa separada, niquelada, sobre fundo branco",
      },
      title: "Coleção HYDE Argentina",
      body: "Fechaduras de embutir, ferrolhos e fechaduras para perfis estreitos feitas em moldes HYDE para distribuidores argentinos, com medidas de testa e caixa de cada modelo.",
      linkLabel: "Ver a coleção Argentina",
      href: "/products/argentina",
    },
    hero1,
    {
      variant: "stacked",
      media: {
        ratio: "2400 / 943",
        src: "/images/editorial/hero-civic-corridor.webp",
        label: "Corredor de edifício público com divisórias envidraçadas e portas de evacuação",
      },
      title: "Caixas de fechadura",
      body: "Caixas de fechadura por distância ao eixo, entre-eixos e tipo de trinco, com cada medida escrita no milímetro para que a maçaneta, o cilindro e a contra-testa encaixem de primeira.",
      linkLabel: "Ver caixas de fechadura",
      href: "/pt/products/lock-cases",
    },
  ],
};

export const teaser1: PageTeaserContent = {
  heading: "Compre por gama ou por obra",
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-real-lever-set-dark.webp",
        label:
          "Conjunto completo de fechadura tubular com maçaneta sobre fundo escuro: duas maçanetas em roseta com o quadrado e o mecanismo à vista, o trinco tubular, a contra-testa, a placa e três parafusos de fixação — todas as peças no mesmo acabamento",
      },
      title: "Para distribuidores",
      subtitle: "Fornecimento a partir do catálogo de exportação da Canton Hyland",
      href: "/pt/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-real-cylinder-dark.webp",
        label:
          "Cilindro de perfil europeu com botão, fotografado sobre fundo escuro junto ao parafuso de fixação e a três chaves — o parafuso atravessa a leva, o ponto a partir do qual se medem as duas metades do cilindro",
      },
      title: "Para prescritores",
      subtitle: "Prepare um quadro de ferragens com a nossa equipe técnica",
      href: "/pt/products",
    },
  ],
};

