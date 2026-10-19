import Link from "next/link";
import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import { getProductByModel, getRelatedProducts, publishedProducts } from "@/data/products";
import { projects } from "@/data/projects";
import { siteSettings } from "@/data/navigation";
import { relatedBlock } from "@/lib/related-products";
import { productFaqHeading, productFaqItems } from "@/lib/product-faq";
import { ArrowLink } from "./ArrowLink";
import { BreadcrumbSeparator } from "./Breadcrumbs";
import { alibabaLinkFor } from "@/lib/alibaba";
import { Button } from "./Button";
import { ProductCard } from "./ProductCard";
import { CatalogueReturnLink } from "./CatalogueNavigation";
import { ProductDrawing, DoorPreparation, hasProductDrawings } from "./ProductDrawing";
import { ProductImageZoom } from "./ProductImageZoom";
import { ProductVideo } from "./ProductVideo";
import { watchPagePath, watchVideo } from "@/lib/video-pages";
import { specValueFor } from "@/lib/imperial";
import { Prose } from "./Prose";
import { localiseProductValues } from "@/lib/spanish-product";
import { EmailLink } from "./EmailLink";
import { productModelFor } from "@/data/product-models";
import { ProductModel } from "./ProductModel";
import { ProductVariants } from "./ProductVariants";
import { productVariants } from "@/lib/product-variants";
import { ProductSpecSheetLink, hasSpecSheet } from "./ProductSpecSheetLink";
import { ProductGallery } from "./ProductGallery";
import { SectionNav } from "./SectionNav";
import { CopyText } from "./CopyText";
import { MediaPlaceholder } from "./MediaPlaceholder";
import pageStyles from "./ProductPage.module.css";
import { dict, specLabel, t as tr } from "@/lib/i18n";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedNews } from "@/data/news";
import { articlesCitingModel } from "@/lib/citing-articles";
import { localisedHref } from "@/lib/spanish-mirror";

/** Target for the "watch it work" cue in the text column. One per page. */
const VIDEO_ANCHOR = "demonstration";

/* The generated 62-page book. One place, so a rename cannot leave a dead button. */
const CATALOGUE_PDF = "/downloads/hyde-export-catalogue-2026.pdf";

interface ProductDetailProps {
  product: Product;
  categoryName: string;
  locale?: Locale;
}

/**
 * The chrome around the product data, in both languages.
 *
 * The product's own words — name, summary, spec rows — come from the record's `*Es`
 * fields, which are composed from the spec rows rather than translated (see
 * scripts/translate-products-es.mjs). Only the fixed furniture lives here.
 */
const COPY = {
  en: {
    model: "Model",
    specifications: "Technical specifications",
    configuration: "Configuration",
    certifications: "Standards and certifications",
    downloads: "Downloads",
    nextSteps: "Next steps",
    compareRange: "Compare every model in this range",
    compareHelp:
      "One table, one row per model, across the specifications that differ between them.",
    citedGuide: "Guide that compares or cites this model",
    citedNews: "Article that cites this model",
    faqLink: "Ordering, lead times and samples",
    faqHelp:
      "Minimum order quantity, production lead time, sample policy, payment terms and OEM work — answered in full.",
    material: "Material",
    finishes: "Available finishes",
    doorTypes: "Suitable door types",
    onRequest: "Information available on request",
    /* Was "Reference available on request": it promised a reference we do not have. The
       factory code for these 13 records is unknown, and saying so is the honest version
       (monthly audit 09-28; Gemini's "placeholder text AI will not cite"). */
    referenceOnRequest: "Model code to be confirmed",
        quote: "Request a quote",
    quoteNeeds:
      "For a quotation, send the model and finish, the quantity, the destination country, and a drawing or photograph of anything you want changed.",
    downloadCatalogue: "Download the export catalog (PDF)",
    images: "Product images",
    watch: "Watch it work",
    breadcrumb: "Breadcrumb",
    orEmail: "Or email us about this model:",
    home: "Home",
    products: "Products",
    backToResults: "← Back to previous results",
    ask: "Ask a technical question",
    viewCertificate: "View certificate",
    noViews:
      "Additional product views are not yet available. Request drawings or samples from our export team.",
    noSpecs:
      "Verified dimensions are pending the current technical catalog. No values have been inferred from similar products.",
    noCertificates:
      "No product-specific certificate is published for this model. Company credentials remain available through the export team.",
    noDownloads:
      "Datasheets, CAD files and installation instructions are available on request while the verified download library is being prepared.",
    scope:
      "Certification scope must be checked against the named model before specification.",
    related: "Related products",
    applications: "Projects + Applications",
    representative: "Representative application",
    moreInSeries: "More in the {series} series",
    moreInCategory: "More in {category}",
    orderListing: "Order {model} on Alibaba",
    findStorefront: "Find {model} on our Alibaba storefront",
    listingHelp: "Opens this model's listing, with current pricing, MOQ and lead time.",
    storefrontHelp:
      "Opens our storefront already searched for this model — trade assurance, tiered pricing and order tracking are handled there.",
    inRange: "{count} models in this range",
    views: "Product views",
    previousView: "Previous view",
    nextView: "Next view",
    showView: "Show view {n}",
    onThisPage: "On this page",
    navSpecs: "Specifications",
    navDrawings: "Drawings",
    navVideo: "Video",
    navQuestions: "Questions",
    navOrdering: "Ordering",
    navCertifications: "Certifications",
    specsAside: "As the record states them. Where a row is missing, ask: we confirm it against your drawing rather than guess.",
    copySpecs: "Copy these rows for a tender",
    copied: "Copied",
    copyHelp: "Plain text: the model and its rows, ready to paste.",
    features: "Features",
    drawingsAside: "Drawings and files published for this model.",
    videoAside: "{seconds} seconds of the part working.",
    askModel: "Model and finish",
    askModelHelp: "{model}, and the finish or color",
    askQuantity: "Quantity",
    askQuantityFrom: "From {moq}",
    askQuantityHelp: "Per order, and per year if it repeats",
    askDestination: "Destination country",
    askDestinationHelp: "For freight and export documents",
    askChanges: "Changes",
    askChangesHelp: "A drawing or photograph of anything you want changed",
    emailAnswers: "Email these answers",
    copyList: "Copy the list",
  },
  es: {
    model: "Modelo",
    specifications: "Ficha técnica",
    configuration: "Configuración",
    certifications: "Normas y certificaciones",
    downloads: "Descargas",
    nextSteps: "Siguientes pasos",
    compareRange: "Comparar todos los modelos de esta gama",
    compareHelp:
      "Una tabla, una fila por modelo, con las especificaciones que los distinguen.",
    citedGuide: "Guía que compara o cita este modelo",
    citedNews: "Artículo que cita este modelo",
    faqLink: "Pedidos, plazos y muestras",
    faqHelp:
      "Pedido mínimo, plazo de producción, política de muestras, condiciones de pago y trabajo OEM —respondido en detalle.",
    material: "Material",
    finishes: "Acabados disponibles",
    doorTypes: "Tipos de puerta compatibles",
    onRequest: "Información disponible a pedido",
    referenceOnRequest: "Código de modelo por confirmar",
        quote: "Solicitar cotización",
    quoteNeeds:
      "Para cotizar, envíenos el modelo y el acabado, la cantidad, el país de destino y un plano o una foto de lo que quiera cambiar.",
    downloadCatalogue: "Descargar el catálogo de exportación (PDF)",
    images: "Imágenes del producto",
    watch: "Véalo funcionar",
    breadcrumb: "Ruta de navegación",
    orEmail: "O escríbanos sobre este modelo:",
    home: "Inicio",
    products: "Productos",
    backToResults: "← Volver a los resultados anteriores",
    ask: "Consultar a un ingeniero",
    viewCertificate: "Ver certificado",
    noViews:
      "Todavía no hay más vistas de este producto. Pida planos o muestras al equipo de exportación.",
    noSpecs:
      "Las dimensiones verificadas están pendientes del catálogo técnico vigente. No se ha inferido ningún valor a partir de productos similares.",
    noCertificates:
      "No hay certificado propio de este modelo. Las credenciales de la empresa siguen disponibles a través del equipo de exportación.",
    noDownloads:
      "Fichas técnicas, archivos CAD e instrucciones de instalación disponibles a pedido mientras se prepara la biblioteca de descargas.",
    scope:
      "Antes de especificar, verifique que el alcance del certificado incluya el modelo indicado.",
    related: "Productos relacionados",
    applications: "Proyectos + Aplicaciones",
    representative: "Aplicación representativa",
    moreInSeries: "Más modelos de la serie {series}",
    moreInCategory: "Más modelos en {category}",
    orderListing: "Comprar {model} en Alibaba",
    findStorefront: "Buscar {model} en nuestra tienda de Alibaba",
    listingHelp:
      "Abre la ficha de este modelo con el precio, el pedido mínimo y el plazo vigentes.",
    storefrontHelp:
      "Abre nuestra tienda con este modelo ya buscado; Alibaba gestiona el pago, el seguimiento y Trade Assurance.",
    inRange: "{count} modelos en esta gama",
    views: "Vistas del producto",
    previousView: "Vista anterior",
    nextView: "Vista siguiente",
    showView: "Mostrar la vista {n}",
    onThisPage: "En esta página",
    navSpecs: "Especificaciones",
    navDrawings: "Planos",
    navVideo: "Vídeo",
    navQuestions: "Preguntas",
    navOrdering: "Pedidos",
    navCertifications: "Certificaciones",
    specsAside: "Tal como las publica la ficha. Si falta una fila, pregúntenos: la confirmamos con su plano, no la suponemos.",
    copySpecs: "Copiar estas filas para un pliego",
    copied: "Copiado",
    copyHelp: "Texto plano: el modelo y sus filas, listo para pegar.",
    features: "Características",
    drawingsAside: "Planos y archivos publicados para este modelo.",
    videoAside: "{seconds} segundos de la pieza funcionando.",
    askModel: "Modelo y acabado",
    askModelHelp: "{model} y el acabado o color",
    askQuantity: "Cantidad",
    askQuantityFrom: "Desde {moq}",
    askQuantityHelp: "Por pedido, y por año si se repite",
    askDestination: "País de destino",
    askDestinationHelp: "Para el flete y los documentos de exportación",
    askChanges: "Cambios",
    askChangesHelp: "Un plano o una foto de lo que quiera cambiar",
    emailAnswers: "Enviar estas respuestas por correo",
    copyList: "Copiar la lista",
  },
  pt: {
    model: "Modelo",
    specifications: "Ficha técnica",
    configuration: "Configuração",
    certifications: "Normas e certificações",
    downloads: "Downloads",
    nextSteps: "Passos seguintes",
    compareRange: "Comparar todos os modelos desta gama",
    compareHelp:
      "Uma tabela, uma linha por modelo, com as especificações que os distinguem.",
    citedGuide: "Guia que compara ou cita este modelo",
    citedNews: "Artigo que cita este modelo",
    faqLink: "Encomendas, prazos e amostras",
    faqHelp:
      "Quantidade mínima, prazo de produção, política de amostras, condições de pagamento e trabalho OEM — respondido em detalhe.",
    material: "Material",
    finishes: "Acabamentos disponíveis",
    doorTypes: "Tipos de porta compatíveis",
    onRequest: "Informação disponível mediante pedido",
    referenceOnRequest: "Código do modelo a confirmar",
        quote: "Pedir orçamento",
    quoteNeeds:
      "Para cotar, envie o modelo e o acabamento, a quantidade, o país de destino e um desenho ou uma foto do que quiser alterar.",
    downloadCatalogue: "Baixar o catálogo de exportação (PDF)",
    images: "Imagens do produto",
    watch: "Veja funcionar",
    breadcrumb: "Trilho de navegação",
    orEmail: "Ou escreva-nos sobre este modelo:",
    home: "Início",
    products: "Produtos",
    backToResults: "← Voltar aos resultados anteriores",
    ask: "Falar com um engenheiro",
    viewCertificate: "Ver certificado",
    noViews:
      "Ainda não há mais vistas deste produto. Peça desenhos ou amostras à equipe de exportação.",
    noSpecs:
      "As dimensões verificadas dependem do catálogo técnico atual. Nenhum valor foi inferido a partir de produtos semelhantes.",
    noCertificates:
      "Não há certificado próprio deste modelo. As credenciais da empresa seguem disponíveis através da equipe de exportação.",
    noDownloads:
      "Fichas técnicas, arquivos CAD e instruções de instalação disponíveis mediante pedido enquanto a biblioteca de downloads é preparada.",
    scope:
      "Antes de especificar, verifique que o âmbito do certificado inclui o modelo indicado.",
    related: "Produtos relacionados",
    applications: "Obras + Aplicações",
    representative: "Aplicação representativa",
    moreInSeries: "Mais modelos da série {series}",
    moreInCategory: "Mais modelos em {category}",
    orderListing: "Comprar {model} no Alibaba",
    findStorefront: "Procurar {model} na nossa loja Alibaba",
    listingHelp:
      "Abre a ficha deste modelo com o preço, a quantidade mínima e o prazo actuais.",
    storefrontHelp:
      "Abre a nossa loja com este modelo já procurado; o Alibaba trata do pagamento, do seguimento e do Trade Assurance.",
    inRange: "{count} modelos nesta gama",
    views: "Vistas do produto",
    previousView: "Vista anterior",
    nextView: "Próxima vista",
    showView: "Mostrar a vista {n}",
    onThisPage: "Nesta página",
    navSpecs: "Especificações",
    navDrawings: "Desenhos",
    navVideo: "Vídeo",
    navQuestions: "Perguntas",
    navOrdering: "Encomendas",
    navCertifications: "Certificações",
    specsAside: "Tal como a ficha as publica. Se faltar uma linha, pergunte: confirmamos com o seu desenho, não supomos.",
    copySpecs: "Copiar estas linhas para um edital",
    copied: "Copiado",
    copyHelp: "Texto simples: o modelo e as suas linhas, pronto para colar.",
    features: "Características",
    drawingsAside: "Desenhos e arquivos publicados para este modelo.",
    videoAside: "{seconds} segundos da peça em funcionamento.",
    askModel: "Modelo e acabamento",
    askModelHelp: "{model} e o acabamento ou a cor",
    askQuantity: "Quantidade",
    askQuantityFrom: "A partir de {moq}",
    askQuantityHelp: "Por encomenda, e por ano se for recorrente",
    askDestination: "País de destino",
    askDestinationHelp: "Para o frete e os documentos de exportação",
    askChanges: "Alterações",
    askChangesHelp: "Um desenho ou uma foto do que quiser alterar",
    emailAnswers: "Enviar estas respostas por e-mail",
    copyList: "Copiar a lista",
  },
} as const;

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-t border-line pt-16 text-c1 text-ink-secondary">
      {children}
    </p>
  );
}

function ProductFact({
  label,
  values,
  fallback,
}: {
  label: string;
  values: string[];
  fallback: string;
}) {
  return (
    <div className="border-t border-line pt-16">
      <dt className="text-c2 text-ink-secondary">{label}</dt>
      <dd className="mt-16 text-c1 text-ink">{values.length ? values.join(" · ") : fallback}</dd>
    </div>
  );
}

/**
 * The seven-block product-detail template used by every catalogue record.
 *
 * Product claims render only from src/data/products.ts. Missing specifications,
 * gallery views and files stay visibly missing rather than being inferred. This is
 * intentional: architectural hardware is bought from the schedule, so a plausible
 * but unverified dimension is more damaging than an honest empty state.
 */
export function ProductDetail({ product, categoryName, locale = "en" }: ProductDetailProps) {
  const t = dict(COPY, locale);
  const variants = productVariants(product, publishedProducts);
  const es = locale === "es";
  const referenceModel = productModelFor(product.slug);
  /*
    The product's OWN words. `(es && …)` answered only for Spanish, so the Portuguese page
    carried an English name and an English lead paragraph beside a Portuguese spec table —
    on 24 pages for the summary alone. English is the fallback, never Spanish.
  */
  const name =
    tr(product, "name", locale);
  const summary =
    tr(product, "summary", locale);
  /*
    Was `es ? specsEs : specs`. With a third locale that silently served the ENGLISH table
    on every Portuguese page while the title beside it was Portuguese — the page looked
    translated and the specification was not, which is the one thing on a product page that
    has to be right. Picking by locale, with English as the fallback, fixes it for every
    locale added after this one too.
  */
  const localeSpecs = tr(product, "specs", locale);
  const specs = (localeSpecs?.length ? localeSpecs : product.specs) ?? [];
  const base = locale === "en" ? "" : `/${locale}`;
  const heroImage = {
    ...product.heroImage,
    label:
      tr(product.heroImage, "label", locale),
  };
  const gallery = product.gallery.map((image) => ({
    ...image,
    label:
      tr(image, "label", locale),
  }));
  const material = localiseProductValues([product.material].filter(Boolean), locale);
  const finishes = localiseProductValues(product.finishes, locale);
  const doorTypes = localiseProductValues(product.doorTypes, locale);

  /*
    Material, finishes and door types — but only the ones the specification table does
    not already state.

    Measured across the catalogue: 348 of 435 products carry Material as a spec row AND
    printed it again as a standalone fact, and 108 did the same with door types. Showing
    both is not thoroughness, it is the reader checking whether two numbers that look
    alike are the same number.

    Matching on the label rather than on a fixed list of which fact to suppress: spec
    labels are editorial and vary ("Application", "Suitable door types", "Door type"), and
    a product whose table gains a Material row should stop repeating it without anyone
    having to notice.
  */
  const specLabels = new Set(specs.map((s) => s.label.trim().toLowerCase()));
  const covers = (...patterns: RegExp[]) =>
    [...specLabels].some((label) => patterns.some((p) => p.test(label)));

  /*
    The bullets this locale can show. Each locale sees its OWN list or no list — never
    another language's, and never a half-translated one. All three are filled in as of
    2026-09-17 (216/216 records each).
  */
  /*
    `tr` reads `featuresEs` / `featuresPt` and the overlay sidecar. The ternary it replaced
    (2026-09-26) sent every overlay locale to `featuresEs`: French, German, Japanese… product
    pages printed the Spanish bullets although their own were in content/i18n/<code>/products.json.
  */
  /*
    Shown as the record states them, minus the typing of the source sheet: a heading line
    ("Push Bar Features:") and hand-typed list markers ("1.", "•") are dropped, because the
    list already is a list. The words themselves are untouched.
  */
  const featureList = tr(product, "features", locale)
    ?.filter((line) => !/:\s*$/.test(line))
    .map((line) => line.replace(/^\s*(?:\d+[.)]|[•·–-])\s*/, ""));

  const faqItems = productFaqItems(product, locale);

  const uncoveredFacts = [
    { label: t.material, values: material, covered: covers(/^material$/) },
    { label: t.finishes, values: finishes, covered: covers(/finish/) },
    {
      label: t.doorTypes,
      values: doorTypes,
      covered: covers(/door type/, /^application/, /suitable/),
    },
  ].filter((fact) => !fact.covered && fact.values.length);
  const related = relatedBlock({
    product,
    curated: getRelatedProducts(product),
    /*
      PUBLISHED only. relatedBlock falls back to "another model in this series / category"
      when a record carries no curated relatedModels, and that fallback used to draw from
      the whole catalogue — which is how /products/glass-door-accessories/410-.../ ended up
      linking to 100-30mm, a record with no photograph. getRelatedProducts() already
      filters the curated list; this is the same rule applied to the fallback.
    */
    catalogue: publishedProducts,
    categoryName,
  });
  /*
    The application packages that schedule this model — the reverse of the product list on
    each project page, resolved the same way (getProductByModel), so the two directions can
    never disagree. Client 2026-09-27: a buyer who reads a spec table also wants to see where
    the part goes, and a project page that links products needs products that link back.
    Every entry is a representative application, and the label says so on each one.
  */
  const usedIn = projects.filter((project) =>
    project.productModels.some((model) => {
      const match = getProductByModel(model);
      return match?.slug === product.slug && match.categoryPath[0] === product.categoryPath[0];
    }),
  );
  const quoteParams = new URLSearchParams({ product: product.name });

  if (!product.modelTbc) quoteParams.set("model", product.model);

  /* Fragment, not query: one crawlable URL for every product's quote link, so no nofollow (src/lib/inquiry-prefill.ts). */
  const quoteHref = `${base}/contact/#${quoteParams.toString()}`;
  const productHref = `${base}/products/${product.categoryPath[0]}/${product.slug}/`;
  const categoryHref = `${base}/products/${product.categoryPath[0]}/`;

  /*
    Comparison pages exist in both locales since 2026-09-03, and only where a range holds
    enough models to make a table — SpecMatrix renders nothing under three rows, so
    linking to a range below that would send the reader to an empty page. The same
    three-row floor is applied here rather than assumed.

    The count is over PUBLISHED products, matching what the comparison page itself lists;
    counting the withheld ones would offer a link to a table that turns out to be shorter
    than the floor.
  */
  const categoryCount = publishedProducts.filter(
    (p) => p.categoryPath[0] === product.categoryPath[0],
  ).length;
  const compareHref =
    categoryCount >= 3 ? `${base}/compare/${product.categoryPath[0]}/` : null;
  /*
    The pages that name this model in their relatedModels — the comparison guides first.
    Articles link down to the product; this is the link back up (src/lib/citing-articles.ts).
  */
  const citing = articlesCitingModel(product.model, getPublishedGuides(), getPublishedNews());
  const alibaba = alibabaLinkFor(product);
  const relatedHeading = related
    ? related.source === "curated"
      ? t.related
      : related.source === "series"
        ? t.moreInSeries.replace("{series}", product.series)
        : t.moreInCategory.replace("{category}", categoryName)
    : "";

  /*
    The rows the buy-box shows beside the photograph: the record's first four, in its own
    order. And the band of figures: only rows whose whole value is a number and a unit
    ("1000mm", "50 pieces"), so a sentence is never cut into a headline.
  */
  const sheetRows = specs.slice(0, 4);
  const bandFacts = specs
    .map((spec) => ({ spec, match: /^(\d[\d.,]*)\s*(mm|cm|m|kg|g|pieces|pcs|sets|pairs|°|years|cycles)?\.?$/i.exec(spec.value.trim()) }))
    .filter((f): f is { spec: (typeof specs)[number]; match: RegExpExecArray } => Boolean(f.match))
    .slice(0, 3);
  const moq = specs.find((spec) => /minimum order|pedido mínimo|quantidade mínima/i.test(spec.label))?.value;
  const views = [heroImage, ...gallery];
  const showDrawings = hasProductDrawings(product.slug) || hasSpecSheet(product.slug) || Boolean(referenceModel);
  const asks: [string, string][] = [
    [t.askModel, t.askModelHelp.replace("{model}", product.modelTbc ? name : product.model)],
    [t.askQuantity, moq ? t.askQuantityFrom.replace("{moq}", moq) : t.askQuantityHelp],
    [t.askDestination, t.askDestinationHelp],
    [t.askChanges, t.askChangesHelp],
  ];
  const enquiryAddress = siteSettings.contact.technicalEmail || siteSettings.contact.email;
  const enquiryBody = `${product.modelTbc ? name : `${product.model} ${name}`}\n\n${asks.map(([label]) => `${label}: `).join("\n")}\n`;
  const specText = `HYDE ${product.modelTbc ? name : `${product.model} ${name}`}\n${specs
    .map((spec) => `${specLabel(spec.label, locale)}: ${specValueFor(spec.value, locale)}${spec.unit ? ` ${spec.unit}` : ""}`)
    .join("\n")}`;
  const chapters = [
    { id: "specifications", label: t.navSpecs },
    ...(showDrawings ? [{ id: "drawings", label: t.navDrawings }] : []),
    ...(product.videos?.length ? [{ id: VIDEO_ANCHOR, label: t.navVideo }] : []),
    ...(faqItems.length ? [{ id: "questions", label: t.navQuestions }] : []),
    { id: "ordering", label: t.navOrdering },
    ...(product.certifications.length ? [{ id: "certifications", label: t.navCertifications }] : []),
    { id: "next-steps", label: t.nextSteps },
    ...(usedIn.length ? [{ id: "applications", label: t.applications }] : []),
    ...(related ? [{ id: "related", label: relatedHeading }] : []),
  ];

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-96">
      {/*
        2026-10-12 layout, from the preview the client approved (「就用这个指南和产品页效果」):
        a stage gallery and a buy-box on the first screen, a section bar that stays under the
        header, then one chapter per question with its heading held at the left. Every
        figure, row and sentence below is the record's own, exactly as before; only the
        order and the presentation changed.
      */}
      <section className="layout" aria-labelledby="product-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          {/*
            09-28: the category crumb carries the "back to your results" behaviour (it restores
            the filtered list and scroll position when there is one, and opens the category
            otherwise). One trail, one line, no repetition.
          */}
          <nav
            aria-label={t.breadcrumb}
            className="col-span-full flex min-w-0 items-center gap-x-8 overflow-hidden whitespace-nowrap text-c2 text-ink-secondary"
          >
            <Link href={`${base}/`} className="short-marker short-marker-compact flex-none hover:text-brand-hover">
              {t.home}
            </Link>
            <BreadcrumbSeparator />
            <Link href={`${base}/products/`} className="short-marker short-marker-compact flex-none hover:text-brand-hover">
              {t.products}
            </Link>
            <BreadcrumbSeparator />
            <CatalogueReturnLink
              productHref={productHref}
              fallbackHref={categoryHref}
              className="short-marker short-marker-compact min-w-0 truncate hover:text-brand-hover"
            >
              {categoryName}
            </CatalogueReturnLink>
          </nav>

          {/* Stage gallery: every view in one place, the hero first and never lazy (LCP). */}
          <div className="col-span-full mt-16 xl:col-span-13" aria-label={t.images} role="region">
            <ProductGallery
              labels={{ views: t.views, previous: t.previousView, next: t.nextView, show: t.showView }}
              thumbnails={views.map((image) => (
                <MediaPlaceholder key={`${image.src}-${image.label}`} src={image.src} ratio={image.ratio} label={image.label} sizes="76px" hiddenFromAssistiveTech />
              ))}
            >
              <ProductImageZoom {...heroImage} priority locale={locale} />
              {gallery.map((image) => (
                <div key={`${image.src}-${image.label}`}>
                  <ProductImageZoom {...image} locale={locale} />
                </div>
              ))}
            </ProductGallery>
          </div>

          <div className="col-span-full mt-16 xl:col-span-10 xl:col-start-15">
            <p className="text-c2 text-ink-secondary">
              {product.series} · {t.inRange.replace("{count}", String(categoryCount))}
            </p>
            {/*
              The H1 carries the model, because that is what a buyer types. 40 records are
              named "Lock Case" and 38 "Lever Handle" — an H1 of just the name gave dozens of
              pages the same heading. `modelTbc` records have no real SKU yet, so they keep the
              plain name rather than showing a working label as if it were orderable.
            */}
            <h1 id="product-title" className="mt-16 text-ink">
              {product.modelTbc ? (
                <span className={pageStyles.rise}><span className={pageStyles.name}>{name}</span></span>
              ) : (
                <>
                  <span className={pageStyles.rise}><span className={pageStyles.model} data-long={product.model.length > 6}>{product.model}</span></span>{" "}
                  <span className={pageStyles.rise}><span className={pageStyles.name}>{name}</span></span>
                </>
              )}
            </h1>
            {product.modelTbc ? <p className="mt-8 text-c2 text-ink-secondary">{t.model}: {t.referenceOnRequest}</p> : null}
            <p className="mt-24 text-lead text-ink">{summary}</p>

            {sheetRows.length ? (
              <dl className={pageStyles.sheet}>
                {sheetRows.map((spec) => (
                  <div key={`${spec.label}-${spec.value}`}>
                    <dt className="text-c2 text-ink-secondary">{specLabel(spec.label, locale)}</dt>
                    <dd className="mt-4 text-c1 font-semibold tabular-nums text-ink">
                      {specValueFor(spec.value, locale)}
                      {spec.unit ? ` ${spec.unit}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {variants ? <ProductVariants variants={variants} locale={locale} /> : null}

            {/*
              The cue that a demonstration exists, beside the photograph where the reader is
              looking on the first screen. An anchor rather than a scroll handler: it works
              before hydration and can be opened in a new tab. The runtime is stated so the
              reader knows what they are committing to.
            */}
            {product.videos?.[0] ? (
              <a
                href={`#${VIDEO_ANCHOR}`}
                aria-label={
                  product.videos[0].durationSeconds
                    ? `${t.watch} — ${Math.floor(product.videos[0].durationSeconds / 60)} min ${product.videos[0].durationSeconds % 60} s`
                    : t.watch
                }
                className="short-marker short-marker-compact mt-24 inline-flex items-baseline gap-8 text-c1 text-brand hover:text-brand-hover"
              >
                {t.watch}
                {product.videos[0].durationSeconds ? (
                  <span className="text-c2 tabular-nums text-ink-secondary">
                    {Math.floor(product.videos[0].durationSeconds / 60)}:
                    {String(product.videos[0].durationSeconds % 60).padStart(2, "0")}
                  </span>
                ) : null}
              </a>
            ) : null}

            {/*
              Three entry points, not one: a price, a person, or the catalogue to read offline.
              One primary, two secondary — a single "Contact us" sends the last two through the
              wrong door, and an enquiry that starts with the wrong question costs a round trip.
            */}
            <div className="mt-32 flex flex-wrap items-center gap-16">
              <Button href={quoteHref}>{t.quote}</Button>
              <Button href={`${base}/contact/`} variant="secondary">
                {t.ask}
              </Button>
              <Button href={CATALOGUE_PDF} variant="secondary">
                {t.downloadCatalogue}
              </Button>
            </div>

            {enquiryAddress ? (
              <p className="mt-16 text-c2 text-ink-secondary">
                {t.orEmail}{" "}
                <EmailLink
                  address={enquiryAddress}
                  subject={`${product.model} — ${name}`}
                  className="text-brand hover:text-brand-hover"
                />
              </p>
            ) : null}

            {/* The second route this site exists to feed: this model on the Alibaba storefront. */}
            {alibaba && (
              <div className="mt-24 border-t border-line pt-16">
                <a
                  href={alibaba.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                >
                  {alibaba.kind === "listing"
                    ? t.orderListing.replace("{model}", product.model)
                    : t.findStorefront.replace("{model}", product.model)}
                </a>
                <p className="mt-8 max-w-[52ch] text-c2 text-ink-secondary">
                  {alibaba.kind === "listing" ? t.listingHelp : t.storefrontHelp}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <SectionNav
        label={t.onThisPage}
        items={chapters}
        lead={product.modelTbc ? undefined : product.model}
        action={{ href: quoteHref, label: t.quote }}
      />

      {/* Specifications: the one place a specification lives (no repeated facts blocks). */}
      <Chapter id="specifications" title={t.specifications} aside={t.specsAside}>
        {!es && product.description ? <Prose markdown={product.description} className="mb-32" /> : null}
        {specs.length ? (
          <>
            <dl className="border-t border-ink">
              {specs.map((spec) => (
                <div
                  key={`${spec.label}-${spec.value}`}
                  className={`${pageStyles.reveal} grid grid-cols-2 gap-16 border-b border-line py-16 text-c1`}
                >
                  <dt className="text-ink-secondary">{specLabel(spec.label, locale)}</dt>
                  {/* English pages add an imperial bracket to metric values (src/lib/imperial.ts). */}
                  <dd className="tabular-nums text-ink">
                    {specValueFor(spec.value, locale)}
                    {spec.unit ? ` ${spec.unit}` : ""}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-24 flex flex-wrap items-center gap-16">
              <CopyText text={specText} label={t.copySpecs} done={t.copied} />
              <span className="text-c2 text-ink-secondary">{t.copyHelp}</span>
            </div>
          </>
        ) : (
          <EmptyState>{t.noSpecs}</EmptyState>
        )}

        {/* Only the facts the table does not already carry (finishes, mostly). */}
        {uncoveredFacts.length ? (
          <dl className="mt-32 grid grid-cols-1 gap-24 sm:grid-cols-2">
            {uncoveredFacts.map((fact) => (
              <ProductFact key={fact.label} label={fact.label} values={fact.values} fallback={t.onRequest} />
            ))}
          </dl>
        ) : null}

        {/* The client's own checked feature lines; each locale sees its own list or none. */}
        {featureList?.length ? (
          <div className="mt-48">
            <h3 className="text-c1 font-semibold text-ink">{t.features}</h3>
            <ul className="mt-16 border-t border-line">
              {featureList.map((feature) => (
                <li key={feature} className="grid grid-cols-[1.2rem_1fr] gap-x-8 border-b border-line py-12 text-c1 text-ink">
                  <span aria-hidden="true" className="text-ink-tertiary">·</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Chapter>

      {/* The figures a buyer checks first, from rows whose whole value is a number. */}
      {bandFacts.length >= 2 ? (
        <section className="layout bg-ink py-96 text-surface lg:py-136" aria-label={t.specifications}>
          <div className={`col-content ${pageStyles.band}`}>
            {bandFacts.map(({ spec, match }) => (
              <div key={spec.label} className={pageStyles.bandItem}>
                <span className={pageStyles.bandMask}>
                  <span className={pageStyles.bandNumber}>
                    {match[1]}
                    {match[2] ? <small>{match[2]}</small> : null}
                  </span>
                </span>
                <span className="mt-12 block text-c2 text-surface/70">{specLabel(spec.label, locale)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showDrawings ? (
        <Chapter id="drawings" title={t.navDrawings} aside={t.drawingsAside}>
          <ProductSpecSheetLink slug={product.slug} locale={locale} />
          <ProductDrawing slug={product.slug} locale={locale} />
          {/*
            A sibling, not a child: the two drawing populations do not overlap. A pull handle
            publishes fixing centres and gets a preparation drawing; a lock case publishes
            case geometry and gets an outline. See the note in ProductDrawing.tsx.
          */}
          <DoorPreparation slug={product.slug} locale={locale} />
          {referenceModel ? <div className="mt-48"><ProductModel model={referenceModel} locale={locale} /></div> : null}
        </Chapter>
      ) : null}

      {/*
        The demonstration, in its own chapter. A specifier's questions arrive as: what is it,
        does it do what I need, will it fit, how do I order — and the only thing on the page
        that answers the second is the film of the part working.
      */}
      {product.videos?.length ? (
        <Chapter
          id={VIDEO_ANCHOR}
          title={t.navVideo}
          aside={product.videos[0].durationSeconds ? t.videoAside.replace("{seconds}", String(product.videos[0].durationSeconds)) : undefined}
        >
          <div className="space-y-16">
            {product.videos.map((video) => (
              <figure key={video.src} className={`${pageStyles.reveal} m-0`}>
                <ProductVideo video={video} />
                <figcaption className="mt-8 text-c2 text-ink-secondary">
                  {/* English only: the watch pages are English-only (src/lib/video-pages.ts). */}
                  {locale === "en" && watchVideo(product)?.src === video.src ? (
                    <Link href={watchPagePath(product)} className="text-brand hover:text-brand-hover">
                      {video.label}
                    </Link>
                  ) : (
                    video.label
                  )}
                  {video.durationSeconds ? (
                    <span className="text-ink-secondary">
                      {" · "}
                      {Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, "0")}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </Chapter>
      ) : null}

      {/*
        Common questions, composed from this product's own rows by productFaqItems and mirrored
        exactly by ProductFaqJsonLd — a FAQPage whose answers are not visible on the page is a
        spam signal, so they are a description list, not an accordion.
      */}
      {faqItems.length ? (
        <Chapter id="questions" title={productFaqHeading(locale)}>
          <dl className="border-t border-ink">
            {faqItems.map((item) => (
              <div key={item.question} className={`${pageStyles.reveal} border-b border-line py-16`}>
                <dt className="text-c1 text-ink">{item.question}</dt>
                <dd className="mt-4 text-c2 text-ink-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Chapter>
      ) : null}

      {/* What a quotation needs, as a list a buyer can send back filled in. */}
      <Chapter id="ordering" title={t.navOrdering} aside={t.quoteNeeds}>
        <ol className="border-t border-ink">
          {asks.map(([label, help], k) => (
            <li key={label} className={`${pageStyles.reveal} grid grid-cols-[3.2rem_1fr] gap-x-12 border-b border-line py-16 sm:grid-cols-[3.2rem_1fr_1.3fr]`}>
              <span className="text-c2 tabular-nums text-ink-secondary">{k + 1}</span>
              <span className="text-c1 font-semibold text-ink">{label}</span>
              <span className="col-start-2 text-c2 text-ink-secondary sm:col-start-3">{help}</span>
            </li>
          ))}
        </ol>
        <div className="mt-24 flex flex-wrap items-center gap-16">
          {enquiryAddress ? (
            <Button
              href={`mailto:${enquiryAddress}?subject=${encodeURIComponent(`${product.model} — ${name}`)}&body=${encodeURIComponent(enquiryBody)}`}
            >
              {t.emailAnswers}
            </Button>
          ) : (
            <Button href={quoteHref}>{t.quote}</Button>
          )}
          <CopyText text={enquiryBody} label={t.copyList} done={t.copied} />
        </div>
      </Chapter>

      {/*
        Certifications, ONLY where a certificate actually exists. A section that only ever
        says "nothing here" is worse than no section, and 415 identical paragraphs are
        duplicate content besides (client).
      */}
      {product.certifications.length ? (
        <Chapter id="certifications" title={t.certifications} aside={t.scope}>
          <ul className="grid grid-cols-1 gap-16 sm:grid-cols-2">
            {product.certifications.map((certification) => (
              <li key={`${certification.name}-${certification.standard ?? ""}`} className="border border-line bg-surface-alt p-24">
                <p className="text-c1 font-semibold text-ink">{certification.name}</p>
                {certification.standard ? <p className="mt-8 text-c1 text-ink-secondary">{certification.standard}</p> : null}
                {certification.downloadId ? (
                  <ArrowLink href={`/downloads/#${certification.downloadId}`} className="mt-24">
                    {t.viewCertificate}
                  </ArrowLink>
                ) : null}
              </li>
            ))}
          </ul>
        </Chapter>
      ) : null}

      {/*
        Next steps: the guides and articles that cite this model (the link back up from the
        articles that link down to it), the comparison table for the range, and the ordering
        FAQ. Real pages, and the next thing somebody reading a spec table wants.
      */}
      <Chapter id="next-steps" title={t.nextSteps}>
        <ul className="border-t border-ink">
          {product.attachmentIds.map((attachmentId) => (
            <li key={attachmentId} className="border-b border-line py-16">
              <ArrowLink href={`/downloads/#${attachmentId}`}>{attachmentId}</ArrowLink>
            </li>
          ))}
          {citing.map(({ section, article }) => (
            <li key={`${section}/${article.slug}`} className={`${pageStyles.reveal} border-b border-line py-16`}>
              <ArrowLink href={localisedHref(`/${section}/${article.slug}/`, locale)}>{tr(article, "title", locale)}</ArrowLink>
              <p className="mt-8 max-w-[56ch] text-c2 text-ink-secondary">{section === "guides" ? t.citedGuide : t.citedNews}</p>
            </li>
          ))}
          {compareHref ? (
            <li className="border-b border-line py-16">
              <ArrowLink href={compareHref}>{t.compareRange}</ArrowLink>
              <p className="mt-8 max-w-[56ch] text-c2 text-ink-secondary">{t.compareHelp}</p>
            </li>
          ) : null}
          <li className="border-b border-line py-16">
            <ArrowLink href={`${base}/faq/`}>{t.faqLink}</ArrowLink>
            <p className="mt-8 max-w-[56ch] text-c2 text-ink-secondary">{t.faqHelp}</p>
          </li>
        </ul>
      </Chapter>

      {/* Application packages that use this model. Omitted when there are none. */}
      {usedIn.length ? (
        <Chapter id="applications" title={t.applications}>
          <ul className="border-t border-ink">
            {usedIn.map((project) => (
              <li key={project.slug} className="border-b border-line py-16">
                <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">{t.representative}</p>
                <div className="mt-8">
                  <ArrowLink href={`${base}/projects/${project.slug}/`}>{tr(project, "name", locale)}</ArrowLink>
                </div>
                <p className="mt-8 max-w-[56ch] text-c2 text-ink-secondary">{tr(project, "summary", locale)}</p>
              </li>
            ))}
          </ul>
        </Chapter>
      ) : null}

      {/* Related products. Omitted entirely when the product has no siblings. */}
      {related ? (
        <section id="related" className={`layout ${pageStyles.chapter}`} aria-labelledby="related-heading">
          <div className="col-content grid w-full grid-cols gap-x gap-y-48">
            <div className="col-span-full">
              <h2 id="related-heading" className="text-h3 text-ink">
                {relatedHeading}
              </h2>
            </div>
            {related.items.map((item) => (
              <ProductCard
                key={item.slug}
                product={item}
                locale={locale}
                className="col-span-full sm:col-span-4 md:col-span-6 xl:col-span-6"
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

/** One chapter: a rule, a heading held at the left while its content scrolls past (Yuangao design 4). */
function Chapter({ id, title, aside, children }: { id: string; title: string; aside?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`layout ${pageStyles.chapter}`} aria-labelledby={`${id}-heading`}>
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full xl:col-span-7">
          <div className={pageStyles.chapterHead}>
            <h2 id={`${id}-heading`} className="text-h3 text-ink">
              {title}
            </h2>
            {aside ? <p className="mt-12 max-w-[36ch] text-c2 text-ink-secondary">{aside}</p> : null}
          </div>
        </div>
        <div className="col-span-full xl:col-span-16 xl:col-start-9">{children}</div>
      </div>
    </section>
  );
}
