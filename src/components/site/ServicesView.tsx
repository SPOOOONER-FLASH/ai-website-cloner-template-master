import Link from "next/link";
import type { Locale } from "@/data/site";
import { localisedHref } from "@/data/navigation";
import { MediaPlaceholder } from "./MediaPlaceholder";

/**
 * The OEM / private-label services page, in whichever language has its copy written.
 *
 * Copy lives here, one object per language, so a translation is one edit in one place.
 * Spanish and Portuguese are added by the copy session (Hyde 文案, 2026-09-24); until a
 * language has its object, that language has no /es or /pt route and no hreflang
 * (src/lib/spanish-mirror.ts), and its navigation keeps linking to the English page.
 */
export interface ServicesCopy {
  kicker: string;
  heading: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  imageLabel: string;
  briefAria: string;
  briefKicker: string;
  briefHeading: string;
  briefItems: readonly string[];
  briefCta: string;
  listHeading: string;
  services: readonly { number: string; title: string; body: string; outcome: string }[];
  toolingHeading: string;
  toolingBody: string;
  toolingNote: string;
  toolingCta: string;
  docsHeading: string;
  docsBody: string;
  docsCta: string;
}

export const SERVICES_COPY: Partial<Record<Locale, ServicesCopy>> & { en: ServicesCopy } = {
  en: {
    kicker: "Services",
    heading: "Bring us a drawing. Leave with a product.",
    intro:
      "Much of the door hardware and ironmongery we make leaves Xiaolan under our customers' brands, and it is the work we are best at. We tool new parts to your drawing or sample, rework a design that runs into someone else's patent, and put your name, your instructions and your packaging on the result. Since 1998, for brands and distributors across Europe, the Americas, Turkey and Southeast Asia.",
    primaryCta: "Send your drawing or sample",
    secondaryCta: "Or start from our catalog",
    imageLabel: "Representative architectural entrance combining glass, metal and coordinated door hardware",
    briefAria: "Send a service brief to Canton Hyland",
    briefKicker: "To quote a new part",
    briefHeading: "We need four things from you",
    briefItems: [
      "A drawing, sample or reference photograph",
      "Where you will sell it, and the standard it must meet",
      "Your expected annual quantity",
      "Your branding: logo, labels, instruction language, packaging",
    ],
    briefCta: "Send your brief",
    listHeading: "What we do for a private-label brand",
    services: [
      {
        number: "01",
        title: "New tooling to your design",
        body: "Send a drawing, a sample or a reference model. Our engineers work out the part, we cut the tooling, and you approve samples before a single production piece is made. Tooling cost and the minimum run are quoted per part; on our standard models, most minimums fall between 300 and 5,000 pieces.",
        outcome: "Send the drawing or sample, the target market and your expected annual quantity.",
      },
      {
        number: "02",
        title: "A design you are free to put your name on",
        body: "If the product you want is covered by another maker's patent, our engineers rework the internal parts or the appearance until it no longer conflicts with that patent, and we tell you exactly which features changed so your own patent check has something specific to review.",
        outcome: "Tell us which product it resembles and where you will sell it.",
      },
      {
        number: "03",
        title: "Your brand, on every layer",
        body: "Your logo on the part, your labels, installation instructions in your market's language, and cartons and barcodes to your specification. The hardware arrives ready to sell as yours.",
        outcome: "Send your logo files, label text and the languages you need.",
      },
      {
        number: "04",
        title: "Samples that decide the order",
        body: "Samples of the exact model, function and finish you will order, so the sample you approve is the product that ships, container after container. Samples are charged and the cost is credited against your first production order; a stocked model usually ships within days.",
        outcome: "Include the destination, the quantity and what the sample has to prove.",
      },
      {
        number: "05",
        title: "Drawings, datasheets and test reports",
        body: "Drawings, datasheets and installation instructions by model. A test report is only useful if it names the model you are buying and says whose name it was issued in, so that is how we answer every request for one.",
        outcome: "Ask by model number and tell us what the document is for.",
      },
      {
        number: "06",
        title: "Export, from Xiaolan to your port",
        body: "Quotation, packing and shipping arranged around your Incoterm and destination. Our team works in English and Spanish, and we have an office in Germany for buyers who want to meet in Europe.",
        outcome: "Share the Incoterm and destination port when you know them.",
      },
    ],
    toolingHeading: "Custom tooling",
    toolingBody: "We make the metal moulds for our own hardware, which is why a part can be shaped to one market: a hole spacing that matches local frames, a backset for one country's doors, a lever the buyer owns. In the UK and Commonwealth the trade calls this architectural ironmongery; the work is the same. Our 311 exit device was tooled here from a customer's sample, and our AR-4 lock bodies were configured for Argentina.",
    toolingNote: "Tooling cost and the minimum run for a new part are quoted per project, and who owns the mould is written into the same document as the price.",
    toolingCta: "How we tool a part for your market",
    docsHeading: "Documents already available",
    docsBody:
      "Catalogs, drawings and technical files for our standard range are ready to download. For a part we develop with you, the drawings are yours as well.",
    docsCta: "Open download center",
  },
  es: {
    kicker: "Servicios",
    heading: "Tráiganos un plano. Llévese un producto.",
    intro: "Buena parte de lo que fabricamos sale de Xiaolan con la marca de nuestros clientes, y es el trabajo que mejor hacemos. Hacemos moldes nuevos a partir de su plano o su muestra, modificamos un diseño que choca con la patente de otro fabricante y ponemos en el resultado su nombre, sus instrucciones y su embalaje. Desde 1998, para marcas y distribuidores de Europa, América, Turquía y el Sudeste Asiático.",
    primaryCta: "Envíenos su plano o su muestra",
    secondaryCta: "O empiece por nuestro catálogo",
    imageLabel: "Entrada arquitectónica representativa con vidrio, metal y herrajes de puerta coordinados",
    briefAria: "Enviar un encargo a Canton Hyland",
    briefKicker: "Para cotizar una pieza nueva",
    briefHeading: "Necesitamos cuatro datos",
    briefItems: [
      "Un plano, una muestra o una foto de referencia",
      "Dónde la va a vender y qué norma debe cumplir",
      "La cantidad anual prevista",
      "Su marca: logotipo, etiquetas, idioma de las instrucciones y embalaje",
    ],
    briefCta: "Enviar su encargo",
    listHeading: "Lo que hacemos para una marca propia",
    services: [
      {
        number: "01",
        title: "Moldes nuevos a partir de su diseño",
        body: "Envíenos un plano, una muestra o un modelo de referencia. Nuestros ingenieros resuelven la pieza, hacemos el molde y usted aprueba las muestras antes de fabricar una sola unidad de serie. El costo del molde y la serie mínima se cotizan por pieza; en nuestros modelos estándar, la mayoría de los mínimos está entre 300 y 5.000 piezas.",
        outcome: "Envíe el plano o la muestra, el mercado de destino y la cantidad anual prevista.",
      },
      {
        number: "02",
        title: "Un diseño que puede llevar su nombre",
        body: "Si el producto que busca está protegido por la patente de otro fabricante, nuestros ingenieros modifican las piezas internas o el aspecto hasta que deja de chocar con esa patente, y le indicamos exactamente qué cambió para que su propia revisión de patentes tenga algo concreto que examinar.",
        outcome: "Díganos a qué producto se parece y dónde lo va a vender.",
      },
      {
        number: "03",
        title: "Su marca, en cada capa",
        body: "Su logotipo en la pieza, sus etiquetas, instrucciones de instalación en el idioma de su mercado y cajas y códigos de barras según su especificación. El herraje llega listo para venderse como suyo.",
        outcome: "Envíe los archivos de su logotipo, el texto de las etiquetas y los idiomas que necesita.",
      },
      {
        number: "04",
        title: "Muestras que deciden el pedido",
        body: "Muestras del modelo, la función y el acabado exactos que va a pedir, para que la muestra que usted aprueba sea el producto que se envía, contenedor tras contenedor. Las muestras se cobran y su costo se descuenta de su primer pedido de producción; un modelo en stock suele despacharse en pocos días.",
        outcome: "Indique el destino, la cantidad y qué tiene que demostrar la muestra.",
      },
      {
        number: "05",
        title: "Planos, fichas técnicas e informes de ensayo",
        body: "Planos, fichas técnicas e instrucciones de instalación por modelo. Un informe de ensayo solo sirve si nombra el modelo que usted compra y dice a nombre de quién se emitió, y así respondemos cada vez que nos lo piden.",
        outcome: "Pida por número de modelo y díganos para qué necesita el documento.",
      },
      {
        number: "06",
        title: "Exportación, de Xiaolan a su puerto",
        body: "Cotización, embalaje y envío organizados según su Incoterm y su destino. Nuestro equipo trabaja en inglés y en español, y tenemos oficina en Alemania para los compradores que prefieren reunirse en Europa.",
        outcome: "Indique el Incoterm y el puerto de destino cuando los conozca.",
      },
    ],
    toolingHeading: "Moldes a medida",
    toolingBody: "Fabricamos los moldes metálicos de nuestros propios herrajes, y por eso una pieza se puede adaptar a un mercado: una separación de agujeros que coincide con los marcos locales, una entrada para las puertas de un país, una manija que es del comprador. Nuestra barra antipánico 311 se desarrolló aquí a partir de la muestra de un cliente, y nuestras cajas de cerradura AR-4 se configuraron para Argentina.",
    toolingNote: "El costo del molde y la serie mínima de una pieza nueva se cotizan por proyecto, y de quién es el molde se escribe en el mismo documento que el precio.",
    toolingCta: "Cómo hacemos el molde de una pieza para su mercado",
    docsHeading: "Documentos ya disponibles",
    docsBody: "Los catálogos, planos y archivos técnicos de nuestra gama estándar se pueden descargar. Si desarrollamos una pieza con usted, los planos también son suyos.",
    docsCta: "Abrir el centro de descargas",
  },
  pt: {
    kicker: "Serviços",
    heading: "Traga um desenho. Leve um produto.",
    intro: "Boa parte do que fabricamos sai de Xiaolan com a marca dos nossos clientes, e é o trabalho que fazemos melhor. Fazemos moldes novos a partir do seu desenho ou da sua amostra, alteramos um projeto que esbarra na patente de outro fabricante e colocamos no resultado o seu nome, as suas instruções e a sua embalagem. Desde 1998, para marcas e distribuidores da Europa, das Américas, da Turquia e do Sudeste Asiático.",
    primaryCta: "Envie seu desenho ou sua amostra",
    secondaryCta: "Ou comece pelo nosso catálogo",
    imageLabel: "Entrada arquitetônica representativa com vidro, metal e ferragens de porta coordenadas",
    briefAria: "Enviar uma solicitação à Canton Hyland",
    briefKicker: "Para cotar uma peça nova",
    briefHeading: "Precisamos de quatro informações",
    briefItems: [
      "Um desenho, uma amostra ou uma foto de referência",
      "Onde você vai vender e qual norma a peça precisa atender",
      "A quantidade anual prevista",
      "A sua marca: logotipo, etiquetas, idioma das instruções e embalagem",
    ],
    briefCta: "Enviar sua solicitação",
    listHeading: "O que fazemos para uma marca própria",
    services: [
      {
        number: "01",
        title: "Moldes novos a partir do seu projeto",
        body: "Envie um desenho, uma amostra ou um modelo de referência. Nossos engenheiros resolvem a peça, fazemos o molde e você aprova as amostras antes de fabricarmos uma única peça de série. O custo do ferramental e o lote mínimo são cotados por peça; nos nossos modelos padrão, a maioria dos mínimos fica entre 300 e 5.000 peças.",
        outcome: "Envie o desenho ou a amostra, o mercado de destino e a quantidade anual prevista.",
      },
      {
        number: "02",
        title: "Um projeto que pode levar o seu nome",
        body: "Se o produto que você procura está protegido pela patente de outro fabricante, nossos engenheiros alteram as peças internas ou a aparência até que deixe de conflitar com essa patente, e informamos exatamente o que mudou para que a sua própria análise de patentes tenha algo concreto para examinar.",
        outcome: "Diga com qual produto ele se parece e onde você vai vendê-lo.",
      },
      {
        number: "03",
        title: "A sua marca, em cada camada",
        body: "Seu logotipo na peça, suas etiquetas, instruções de instalação no idioma do seu mercado e caixas e códigos de barras conforme a sua especificação. A ferragem chega pronta para ser vendida como sua.",
        outcome: "Envie os arquivos do logotipo, o texto das etiquetas e os idiomas de que precisa.",
      },
      {
        number: "04",
        title: "Amostras que decidem o pedido",
        body: "Amostras do modelo, da função e do acabamento exatos que você vai pedir, para que a amostra aprovada seja o produto embarcado, contêiner após contêiner. As amostras são cobradas e o valor é abatido do seu primeiro pedido de produção; um modelo em estoque costuma ser despachado em poucos dias.",
        outcome: "Informe o destino, a quantidade e o que a amostra precisa comprovar.",
      },
      {
        number: "05",
        title: "Desenhos, fichas técnicas e relatórios de ensaio",
        body: "Desenhos, fichas técnicas e instruções de instalação por modelo. Um relatório de ensaio só serve se citar o modelo que você está comprando e disser em nome de quem foi emitido, e é assim que respondemos sempre que alguém pede um.",
        outcome: "Peça pelo número do modelo e diga para que precisa do documento.",
      },
      {
        number: "06",
        title: "Exportação, de Xiaolan até o seu porto",
        body: "Cotação, embalagem e embarque organizados conforme o seu Incoterm e o seu destino. Nossa equipe trabalha em inglês e em espanhol, e temos escritório na Alemanha para quem prefere se reunir na Europa.",
        outcome: "Informe o Incoterm e o porto de destino quando souber.",
      },
    ],
    toolingHeading: "Moldes sob medida",
    toolingBody: "Fabricamos os moldes metálicos das nossas próprias ferragens, e é por isso que uma peça pode ser adaptada a um mercado: um espaçamento de furos que coincide com os batentes locais, uma distância ao eixo para as portas de um país, uma maçaneta que é do comprador. Nossa barra antipânico 311 foi desenvolvida aqui a partir da amostra de um cliente, e nossas caixas de fechadura AR-4 foram configuradas para a Argentina.",
    toolingNote: "O custo do molde e o lote mínimo de uma peça nova são cotados por projeto, e de quem é o molde fica escrito no mesmo documento que o preço.",
    toolingCta: "Como fazemos o molde de uma peça para o seu mercado",
    docsHeading: "Documentos já disponíveis",
    docsBody: "Catálogos, desenhos e arquivos técnicos da nossa linha padrão estão prontos para download. Se desenvolvemos uma peça com você, os desenhos também são seus.",
    docsCta: "Abrir a central de downloads",
  },
};

export function ServicesView({ locale }: { locale: Locale }) {
  const c = SERVICES_COPY[locale] ?? SERVICES_COPY.en;
  const href = (path: string) => localisedHref(path, locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-5 xl:col-span-8">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{c.kicker}</p>
            <h1 className="mt-16 text-h1 text-ink">{c.heading}</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">{c.intro}</p>
            <div className="mt-32 flex flex-wrap gap-x-32 gap-y-16">
              <Link
                href={href("/contact")}
                className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
              >
                {c.primaryCta}
              </Link>
              <Link
                href={href("/product-finder")}
                className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
              >
                {c.secondaryCta}
              </Link>
            </div>
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24">
          <div className="col-span-full lg:col-span-7 xl:col-span-15">
            <MediaPlaceholder
              src="/images/editorial/project-glass-entrance.webp"
              ratio="3 / 2"
              label={c.imageLabel}
              className="h-full min-h-320"
              priority
            />
          </div>
          <Link
            href={href("/contact")}
            aria-label={c.briefAria}
            className="home-accent-surface short-marker-surface group col-span-full flex flex-col justify-between border border-line p-24 text-ink no-underline outline-offset-4 lg:col-span-4 lg:col-start-9 xl:col-span-8 xl:col-start-17"
          >
            <div>
              <p className="text-kicker text-ink-secondary">{c.briefKicker}</p>
              <h2 className="mt-24 text-h2 text-ink">{c.briefHeading}</h2>
            </div>
            <div className="mt-48 border-t border-line pt-16">
              <ul className="space-y-16 text-c1 text-ink-secondary">
                {c.briefItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="short-marker short-marker-arrow mt-32 inline-block text-c1 text-ink">
                {c.briefCta}
              </span>
            </div>
          </Link>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-48 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink">{c.listHeading}</h2>
          {c.services.map((service) => (
            <article
              key={service.number}
              className="col-span-full border-t border-line pt-16 sm:col-span-2 md:col-span-4 xl:col-span-8"
            >
              <div className="flex items-start justify-between gap-16">
                <h3 className="text-h3 text-ink">{service.title}</h3>
                <span className="text-kicker text-ink-secondary">{service.number}</span>
              </div>
              <p className="mt-24 text-c1 text-ink-secondary">{service.body}</p>
              <p className="mt-24 border-t border-line pt-16 text-c2 text-ink">{service.outcome}</p>
            </article>
          ))}
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <div className="col-span-full lg:col-span-5 xl:col-span-8">
            <h2 className="text-h2 text-ink">{c.toolingHeading}</h2>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{c.toolingBody}</p>
            <p className="mt-16 text-c1 text-ink-secondary">{c.toolingNote}</p>
            <Link
              href={href("/guides/custom-door-hardware-tooling-2026")}
              className="short-marker short-marker-compact mt-24 text-c1 text-brand hover:text-brand-hover"
            >
              {c.toolingCta}
            </Link>
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <div className="col-span-full lg:col-span-5 xl:col-span-8">
            <h2 className="text-h2 text-ink">{c.docsHeading}</h2>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{c.docsBody}</p>
            <Link
              href={href("/downloads")}
              className="short-marker short-marker-compact mt-24 text-c1 text-brand hover:text-brand-hover"
            >
              {c.docsCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
