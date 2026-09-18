/**
 * The Portuguese landing page for fire-door hardware. Copy as data, not as JSX.
 *
 * ---------------------------------------------------------------------------
 * WHY A SINGLE PAGE AND NOT A PORTUGUESE MIRROR
 *
 * Client instruction, 2026-09-16: 「葡语落地页先做起来，逃生器械那组」, after a Brazilian
 * enquiry from SAGA Portas (Guarulhos, São Paulo). The full research is in
 * docs/research/2026-09-16-brazil-saga-portas.md.
 *
 * A third locale is not a translation job, it is a permanent maintenance obligation: every
 * product page, every article, every navigation string, forever, and the Spanish mirror has
 * already produced one incident where re-running the translator reverted hand-improved rows
 * to English. The repository holds **zero** measured Brazilian demand — no Search Console
 * impressions, no Bing queries, nothing in docs/research. One enquiry is a reason to answer
 * the enquiry well, not a reason to triple the surface area.
 *
 * So: one page, at the vocabulary a Brazilian specifier actually types, linking into the
 * English catalogue. If Brazil turns into a market, this page is the evidence for widening;
 * if it does not, it cost one file.
 *
 * ---------------------------------------------------------------------------
 * THE CERTIFICATION SECTION IS THE POINT OF THE PAGE
 *
 * SAGA's own two sites never mention EN 1125. Every page of theirs is ABNT NBR 11742,
 * NBR 15281 and AVCB — the São Paulo fire brigade's inspection certificate. Their whole
 * business is compliance paperwork for condominium fire doors.
 *
 * For that buyer, a supplier who overstates a certificate is not a bad supplier, they are a
 * liability that surfaces at an inspection, after the buyer's own brand is already on the
 * product. So this page states exactly three documents, with issuer, reference, date and
 * **the single model each one covers**, and says plainly that we hold no ABNT, no
 * ANSI/BHMA and no UL listing.
 *
 * That is not modesty. It is the only thing on the page that a compliance buyer cannot get
 * from a hundred other Alibaba suppliers, and it is the same argument the site already
 * makes in English at /news/what-a-test-report-actually-covers/.
 *
 * ⚠ Every figure below is traceable: certificate details from src/data/company.ts, counts
 * from content/products, and the finish/standard wording from the English pages they link
 * to. Nothing here is translated from a claim the English site does not already make.
 */

export interface PtSection {
  heading: string;
  body: string[];
}

export const ptLanding = {
  /** Portuguese, but the brand and model numbers stay as they are written on the parts. */
  kicker: "Fabricante · Guangdong, China",
  title: "Ferragens para porta corta-fogo, direto da fábrica",
  intro:
    "A Canton Hyland fabrica ferragens de porta há 28 anos em Zhongshan, Guangdong, e exporta para mais de trinta mercados. O catálogo publicado tem 519 modelos com fotografia e ficha técnica, dos quais 46 são dispositivos antipânico e acessórios de saída de emergência. Esta página é para quem compra ferragem de porta corta-fogo no Brasil: o que fabricamos, que documentos temos de fato, e quais não temos.",

  sections: [
    {
      heading: "O que fabricamos para porta corta-fogo",
      body: [
        "Barras antipânico (dispositivos de saída de emergência) de 650 a 1110 mm, em versões de uma folha, de duas folhas e com trancamento em vários pontos. Maçanetas externas com chave para barra antipânico — a peça que a maioria dos catálogos trata como acessório e que chega faltando num pedido. Fechaduras de embutir e cilíndricas, cilindros de perfil europeu de 45 a 90 mm, dobradiças e fechos.",
        "As maçanetas externas são uma linha de pedido separada, com acabamento e mão próprios. Um dispositivo pedido sem ela chega como uma porta que abre num sentido só, e isso costuma ser descoberto na obra. Se a sua porta também é entrada, diga-o na consulta.",
        "Trabalhamos em aço, aço inoxidável 201 e 304, latão maciço e zamak, e o metal está declarado modelo a modelo — não por família. Num acabamento, o metal base decide tanto quanto a cor: dois produtos podem ter exactamente o mesmo aspecto e resistências à corrosão diferentes.",
      ],
    },
    {
      heading: "Documentos: o que temos, com número e alcance",
      body: [
        "Um relatório de ensaio pertence a um modelo, não a uma gama. Por isso listamos os três documentos com emissor, referência, data e o modelo exacto que cada um cobre.",
        "EN 1125 — relatório de ensaio da Intertek Testing Services Shenzhen Ltd., filial de Cantão, referência 130722068GZU-001, emitido a 7 de Novembro de 2013. Cobre um modelo: KD070/30-290.",
        "Certificado CE de Conformidade com a EN 1125:2008, emitido pela CELAB, Itália, em 2010, para a série de dispositivos antipânico.",
        "ISO 9001:2015 — sistema de gestão da qualidade, certificado desde 2002.",
        "Os dois primeiros emissores restringem a redistribuição dos documentos, pelo que os fornecemos contra uma consulta ou concurso identificado, e não como descarga aberta.",
      ],
    },
    {
      heading: "O que não temos — e porque dizemos isto antes do orçamento",
      body: [
        "Não temos certificação ABNT. Não temos certificação ANSI/BHMA. Não consta nenhum listado UL entre as credenciais desta fábrica.",
        "Para uma obra em São Paulo isto é a primeira coisa a esclarecer, não a última. A NBR 11742 e a NBR 15281 são o que o Corpo de Bombeiros cobra numa vistoria de AVCB, e um certificado europeu não substitui um requisito brasileiro. Se o seu laudo técnico precisa de um documento que não temos, é melhor sabê-lo antes da amostra do que depois de a sua marca já estar na peça.",
        "O que podemos fazer é o ensaio: se a sua operação exige conformidade com uma norma ABNT específica, diga-nos o número da norma e o modelo, e tratamos disso como um projeto com custo e prazo — não como uma afirmação numa página.",
      ],
    },
    {
      heading: "Marca própria (OEM / ODM)",
      body: [
        "Fabricamos com a marca do cliente há 28 anos, e a maior parte do catálogo existe porque alguém mandou abrir o molde. Marca própria aqui significa a sua marca na peça e na embalagem, a sua numeração de modelo, e o seu acabamento — não uma etiqueta colada por cima da nossa.",
        "Se já revende ferragem de porta corta-fogo com numeração própria, esse é exactamente o trabalho que fazemos. Diga-nos os modelos que vende hoje e as quantidades por referência, e respondemos com o que corresponde no nosso catálogo, o que exigiria molde novo, e o que não fazemos.",
      ],
    },
    {
      heading: "Quantidade mínima, prazos e amostras",
      body: [
        "A quantidade mínima, o prazo de produção, a política de amostras, as condições de pagamento e o trabalho de OEM estão respondidos por extenso na nossa página de encomendas, em inglês. Não publicamos preços no site: o preço depende do acabamento, da quantidade e do molde, e um número genérico não serviria a ninguém.",
        "Para uma resposta útil à primeira, mande a largura e a espessura da folha, se o vão é de uma ou duas folhas, se a porta é corta-fogo e de que resistência, e se a face externa precisa de abrir.",
      ],
    },
  ] satisfies PtSection[],

  contact: {
    heading: "Falar connosco",
    body: "Escreva em português — respondemos em inglês ou espanhol, o que for mais claro para a parte técnica.",
    email: "lock@cantonlock.com",
    technicalEmail: "tec@cantonlock.com",
  },

  /** Where this page hands over to the English catalogue. */
  links: [
    { href: "/products/panic-exit-devices/", label: "Dispositivos antipânico — catálogo completo (46 modelos)" },
    { href: "/news/exit-device-push-bar-length/", label: "Comprimento da barra: 650 a 1110 mm, e qual serve a sua porta" },
    { href: "/news/ul-305-is-a-listing-not-a-grade/", label: "EN 1125, ANSI A156.3 e UL 305 não são o mesmo ensaio" },
    { href: "/news/what-a-test-report-actually-covers/", label: "Um relatório de ensaio cobre um modelo, não uma gama" },
    { href: "/news/trim-handle-or-panic-bar/", label: "Maçaneta externa ou barra: o que a face de fora precisa" },
    { href: "/faq/", label: "Quantidade mínima, prazos, amostras e pagamento" },
    { href: "/certifications/", label: "Certificados e relatórios, com alcance por modelo" },
  ],
} as const;
