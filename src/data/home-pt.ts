import type {
  HeroCarouselContent,
  HeroModuleContent,
  PageTeaserContent,
  TextModuleContent,
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
        ratio: "2400 / 943",
        src: "/images/editorial/home-panic-exit-bars.webp",
        label: "Estudo representativo de portas corta-fogo comerciais com barras antipânico bem visíveis",
      },
      title: "Barras antipânico",
      body: "Um empurrão e a porta abre. Barras antipânico, guarnições externas e caixas de fechadura para portas de saída de emergência e corta-fogo, pensadas como um conjunto.",
      linkLabel: "Explorar barras antipânico",
      href: "/pt/products/panic-exit-devices",
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
      body: "Caixas de fechadura por distância ao eixo, entre-eixos e tipo de lingueta, com cada medida escrita no milímetro para que a maçaneta, o cilindro e a contra-testa encaixem de primeira.",
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
          "Conjunto completo de fechadura tubular com maçaneta sobre fundo escuro: duas maçanetas em roseta com o quadrado e o mecanismo à vista, a lingueta tubular, a contra-testa, a placa e três parafusos de fixação — todas as peças no mesmo acabamento",
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

export const hero2: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 1159",
    src: "/images/editorial/home-commercial-egress.webp",
    label: "Arquitectura de rota de evacuação comercial com portas duplas e corredor tranquilo",
  },
  title: "Barras antipânico",
  body: "A nossa linha principal, e a que conhecemos melhor: barras antipânico para portas de saída de emergência e corta-fogo, de dispositivos de sobrepor de um ponto a conjuntos multiponto para portas de duas folhas.",
  linkLabel: "Ver as barras antipânico",
  href: "/pt/products/panic-exit-devices",
};

export const text1: TextModuleContent = {
  heading: "Aplicações da Canton Hyland",
  body: "Nossas barras antipânico, fechaduras, maçanetas e molas aéreas são instaladas em prédios comerciais, institucionais e residenciais nos mercados para onde exportamos, muitas vezes com a marca dos nossos clientes.",
  linkLabel: "Ver aplicações",
  href: "/pt/projects",
};

export const teaser2: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/project-commercial-egress.webp",
        label: "Estudo representativo de evacuação comercial com portas duplas de saída",
      },
      title: "Evacuação comercial",
      subtitle: "Estudo representativo de ferragens para circulação e rotas de evacuação com critérios normativos",
      href: "/pt/projects/commercial-fire-egress-hardware",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/project-hospitality-residential.webp",
        label: "Estudo representativo de ferragens para hotelaria e habitação",
      },
      title: "Hotelaria + habitação",
      subtitle: "Estudos de acesso e corredor para conjuntos coordenados de ferragens",
      href: "/pt/projects/hospitality-residential-door-package",
    },
  ],
};

export const hero3: HeroModuleContent = {
  variant: "side",
  media: {
    ratio: "3 / 2",
    src: "/images/editorial/hyde-real-product-atlas.webp",
    label: "Fotografias reais do catálogo de ferragens selecionadas para portas",
  },
  title: "Desenhado para",
  body: "Ferragens selecionadas, um só quadro coordenado",
  linkLabel: "Ver catálogo",
  href: "/pt/products",
};

export const hero4: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "1 / 1",
    src: "/images/editorial/hyde-client-lc04-selection.webp",
    label: "Fechadura de embutir com quatro trincos, contra-testa e caixa de cerradero",
  },
  title: "Materiais + engenharia",
  body: "Acabamentos iguais em toda a planilha de portas, sistemas de chave-mestra planejados antes de cortar o primeiro cilindro e documentação de exportação pronta quando o contêiner sai.",
  linkLabel: "Como trabalhamos",
  href: "/pt/company",
};

export const text2: TextModuleContent = {
  heading: "Serviço + Downloads",
  body: "Moldes novos a partir do seu desenho ou da sua amostra, e a sua marca na peça. Se o projeto que você traz estiver protegido pela patente de outro fabricante, nossos engenheiros alteram as peças ou a aparência até que ele deixe de conflitar com essa patente.",
  linkLabel: "Downloads",
  href: "/pt/downloads",
};

export const teaser3: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-hero-lockcase.webp",
        label: "Fotografia original de ferragens de controlo de portas",
      },
      title: "Envie-nos os seus requisitos de ferragens",
      subtitle: "Atribuímos a sua obra ao especialista de exportação adequado",
      href: "/pt/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-client-black-hinge.webp",
        label: "Dobradiça preta com furos de fixação alternados sobre fundo claro",
      },
      title: "Especifique com confiança",
      subtitle: "Respostas sobre instalação, acabamentos, normas e prazos",
      href: "/pt/faq",
    },
  ],
};

export const text3: TextModuleContent = {
  heading: "Engenharia para exportação",
  body: "Seleção de acabamentos, sistemas de chave-mestra e detalhes de especificação para cada mercado.",
  linkLabel: "Fale conosco",
  href: "/pt/contact",
};

export const hero5: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 1464",
    src: "/images/editorial/home-editorial-insight.webp",
    label: "Estudo abstracto de luz arquitectónica com superfícies de vidro e metal",
  },
  title: "Especificação de ferragens",
  linkLabel: "Falar com a equipe de exportação",
  href: "/pt/contact",
};
