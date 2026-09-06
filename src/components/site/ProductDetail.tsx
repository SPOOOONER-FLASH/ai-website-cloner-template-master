import Link from "next/link";
import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import { getRelatedProducts, products, publishedProducts } from "@/data/products";
import { siteSettings } from "@/data/navigation";
import { relatedBlock } from "@/lib/related-products";
import { productFaqHeading, productFaqItems } from "@/lib/product-faq";
import { ArrowLink } from "./ArrowLink";
import { alibabaLinkFor } from "@/lib/alibaba";
import { Button } from "./Button";
import { ProductCard } from "./ProductCard";
import { CatalogueReturnLink } from "./CatalogueNavigation";
import { ProductDrawing } from "./ProductDrawing";
import { ProductImageZoom } from "./ProductImageZoom";
import { ProductVideo } from "./ProductVideo";
import { Prose } from "./Prose";
import { localiseProductValues } from "@/lib/spanish-product";
import { EmailLink } from "./EmailLink";

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
    faqLink: "Ordering, lead times and samples",
    faqHelp:
      "Minimum order quantity, production lead time, sample policy, payment terms and OEM work — answered in full.",
    material: "Material",
    finishes: "Available finishes",
    doorTypes: "Suitable door types",
    onRequest: "Information available on request",
    referenceOnRequest: "Reference available on request",
    quote: "Request a quote",
    downloadCatalogue: "Download the export catalogue (PDF)",
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
      "Verified dimensions are pending the current technical catalogue. No values have been inferred from similar products.",
    noCertificates:
      "No product-specific certificate is published for this model. Company credentials remain available through the export team.",
    noDownloads:
      "Datasheets, CAD files and installation instructions are available on request while the verified download library is being prepared.",
    scope:
      "Certification scope must be checked against the named model before specification.",
    related: "Related products",
    moreInSeries: "More in the {series} series",
    moreInCategory: "More in {category}",
    orderListing: "Order {model} on Alibaba",
    findStorefront: "Find {model} on our Alibaba storefront",
    listingHelp: "Opens this model's listing, with current pricing, MOQ and lead time.",
    storefrontHelp:
      "Opens our storefront already searched for this model — trade assurance, tiered pricing and order tracking are handled there.",
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
    faqLink: "Pedidos, plazos y muestras",
    faqHelp:
      "Pedido mínimo, plazo de producción, política de muestras, condiciones de pago y trabajo OEM — respondido en detalle.",
    material: "Material",
    finishes: "Acabados disponibles",
    doorTypes: "Tipos de puerta compatibles",
    onRequest: "Información disponible a pedido",
    referenceOnRequest: "Referencia disponible a pedido",
    quote: "Solicitar cotización",
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
    moreInSeries: "Más modelos de la serie {series}",
    moreInCategory: "Más modelos en {category}",
    orderListing: "Comprar {model} en Alibaba",
    findStorefront: "Buscar {model} en nuestra tienda de Alibaba",
    listingHelp:
      "Abre la ficha de este modelo con el precio, el pedido mínimo y el plazo vigentes.",
    storefrontHelp:
      "Abre nuestra tienda con este modelo ya buscado; Alibaba gestiona el pago, el seguimiento y Trade Assurance.",
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
  const t = COPY[locale];
  const es = locale === "es";
  const name = (es && product.nameEs) || product.name;
  const summary = (es && product.summaryEs) || product.summary;
  const specs = (es && product.specsEs?.length ? product.specsEs : product.specs) ?? [];
  const base = es ? "/es" : "";
  const heroImage = {
    ...product.heroImage,
    label: es ? product.heroImage.labelEs ?? product.heroImage.label : product.heroImage.label,
  };
  const gallery = product.gallery.map((image) => ({
    ...image,
    label: es ? image.labelEs ?? image.label : image.label,
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
    catalogue: products,
    categoryName,
  });
  const quoteParams = new URLSearchParams({ product: product.name });

  if (!product.modelTbc) quoteParams.set("model", product.model);

  const quoteHref = `${base}/contact/?${quoteParams.toString()}`;
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
  const alibaba = alibabaLinkFor(product);
  const relatedHeading = related
    ? related.source === "curated"
      ? t.related
      : related.source === "series"
        ? t.moreInSeries.replace("{series}", product.series)
        : t.moreInCategory.replace("{category}", categoryName)
    : "";

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      {/* 1 — Breadcrumb, title and model */}
      <section className="layout" aria-labelledby="product-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <nav
            aria-label={t.breadcrumb}
            className="col-span-full flex flex-wrap items-center gap-x-8 text-c2 text-ink-secondary"
          >
            <Link href={`${base}/`} className="short-marker short-marker-compact hover:text-brand-hover">
              {t.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`${base}/products/`} className="short-marker short-marker-compact hover:text-brand-hover">
              {t.products}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={categoryHref} className="short-marker short-marker-compact hover:text-brand-hover">
              {categoryName}
            </Link>
          </nav>

          <div className="col-span-full mt-16">
            <CatalogueReturnLink
              productHref={productHref}
              fallbackHref={categoryHref}
              className="short-marker short-marker-compact text-c2 text-brand hover:text-brand-hover"
            >
              {t.backToResults}
            </CatalogueReturnLink>
          </div>

          <div className="col-span-full mt-8 xl:col-span-12">
            <p className="text-c1 text-ink-secondary">{product.series}</p>
            {/*
              The H1 carries the model, because that is what a buyer types. 40 records are
              named "Lock Case" and 38 "Lever Handle" — an H1 of just the name gave dozens
              of pages the same heading, which is half of why Google groups them as
              duplicates. `modelTbc` records have no real SKU yet, so they keep the plain
              name rather than showing a working label as if it were orderable.
            */}
            <h1 id="product-title" className="mt-8 text-h1 text-ink">
              {product.modelTbc ? name : `${product.model} ${name}`}
            </h1>
          </div>

          <div className="col-span-full mt-24 xl:col-span-8 xl:col-start-17">
            <p className="text-c2 text-ink-secondary">{t.model}</p>
            <p className="mt-8 text-lead tabular-nums text-ink">
              {product.modelTbc ? t.referenceOnRequest : product.model}
            </p>
          </div>
        </div>
      </section>

      {/* 2 — Hero image and gallery */}
      <section className="layout mt-96 lg:mt-136" aria-label={t.images}>
        <div className="col-outset">
          <div className="layout">
            <div className="col-content grid w-full grid-cols gap-x gap-y-48">
              <div className="col-span-full xl:col-span-12">
                {/* The LCP element on every product page — never lazy. */}
                <ProductImageZoom {...heroImage} priority locale={locale} />

                {/*
                  ── THE DEMONSTRATION, DIRECTLY UNDER THE PHOTOGRAPH ──────────

                  Measured on /products/panic-exit-devices/015-panic-exit-device/ at
                  1440×950: the clip used to begin at y=1349, which is 737px below the
                  hero and BELOW THE TWO BUY BUTTONS. A buyer had to scroll past the
                  request-a-quote block to discover that a film of the part working
                  existed at all.

                  That is the wrong order for this reader. A specifier's questions arrive
                  as: what is it, DOES IT DO WHAT I NEED, will it fit, how do I order.
                  The photograph answers the first, the spec table answers the third, the
                  buttons answer the fourth — and the only thing on the page that answers
                  the second is thirty seconds of a gloved hand pressing the bar. Putting
                  the purchase request in front of the evidence asks for the decision
                  before supplying what it rests on.

                  It also renders full column width now. The old block was
                  `md:grid-cols-2`, and 34 of the 35 products with a clip have exactly
                  one — so every one of them drew a half-width video beside an empty half.
                */}
                {product.videos?.length ? (
                  <div id={VIDEO_ANCHOR} className="mt-16 scroll-mt-96 space-y-16">
                    {product.videos.map((video) => (
                      <figure key={video.src} className="m-0">
                        <ProductVideo video={video} />
                        <figcaption className="mt-8 text-c2 text-ink-secondary">
                          {video.label}
                          {video.durationSeconds ? (
                            <span className="text-ink-tertiary">
                              {" · "}
                              {Math.floor(video.durationSeconds / 60)}:
                              {String(video.durationSeconds % 60).padStart(2, "0")}
                            </span>
                          ) : null}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="col-span-full flex flex-col justify-between xl:col-span-10 xl:col-start-15">
                <div>
                  <p className="text-lead text-ink">{summary}</p>

                  {/*
                    ── THE CUE THAT A DEMONSTRATION EXISTS ─────────────────────

                    Moving the clip under the hero put it in the right place structurally
                    and barely moved it up the page: measured at 1440×950 it went from
                    y=1349 to y=1301, because the hero photograph is 673px square and the
                    furniture above it is 612px — so THE HERO ITSELF ALREADY RUNS PAST THE
                    FOLD. Nothing below a full-column square is reachable without
                    scrolling, and no amount of reordering underneath it changes that.

                    So the signal goes where the reader is actually looking on the first
                    screen — beside the photograph, under the summary — and the clip stays
                    where it belongs. The runtime is stated so the reader knows what they
                    are committing to before they press anything.

                    An anchor rather than a scroll handler: it works before hydration, it
                    can be opened in a new tab, and scroll-margin-top on the target keeps
                    the sticky header off it.
                  */}
                  {product.videos?.[0] ? (
                    <a
                      href={`#${VIDEO_ANCHOR}`}
                      /*
                        Spelled out, because the two spans concatenate for a screen reader
                        into "Watch it work0:35". The gap is visual only; the accessible
                        name has to carry the pause the layout provides.
                      */
                      aria-label={
                        product.videos[0].durationSeconds
                          ? `${t.watch} — ${Math.floor(product.videos[0].durationSeconds / 60)} min ${product.videos[0].durationSeconds % 60} s`
                          : t.watch
                      }
                      className="short-marker short-marker-compact mt-16 inline-flex items-baseline gap-8 text-c1 text-brand hover:text-brand-hover"
                    >
                      {t.watch}
                      {product.videos[0].durationSeconds ? (
                        <span className="text-c2 tabular-nums text-ink-tertiary">
                          {Math.floor(product.videos[0].durationSeconds / 60)}:
                          {String(product.videos[0].durationSeconds % 60).padStart(2, "0")}
                        </span>
                      ) : null}
                    </a>
                  ) : null}
                  {/* CMS-authored long copy. Absent on every imported record — the legacy
                      catalogue carries specifications, not prose, and none is invented. */}
                  {!es && product.description ? (
                    <Prose markdown={product.description} className="mt-24" />
                  ) : null}
                </div>

                <div className="mt-64 flex flex-wrap items-center gap-16">
                  {/*
                    ── THREE ENTRY POINTS, NOT ONE ─────────────────────────────

                    B2B buyers arrive at different readiness. One wants a price, one wants
                    the catalogue to read offline before involving anyone, one wants a
                    person. A single "Contact us" makes the last two either leave or use
                    the wrong door, and an enquiry that starts with the wrong question
                    costs the export desk a round trip.

                    One primary, two secondary — not four equal buttons. The download is
                    the useful addition here because it is the only one that costs the
                    buyer nothing and still moves them forward.
                  */}
                  <Button href={quoteHref}>{t.quote}</Button>
                  <Button href={`${base}/contact/`} variant="secondary">
                    {t.ask}
                  </Button>
                  <Button href={CATALOGUE_PDF} variant="secondary">
                    {t.downloadCatalogue}
                  </Button>
                </div>

                {/*
                  A direct address at the point of highest intent. The two buttons above
                  both lead to a form, and the Alibaba link below leads off-site; a buyer
                  who would rather write from their own mailbox had nowhere to go, and the
                  model number is right here to quote. Renders only once an address is set.
                */}
                {siteSettings.contact.technicalEmail || siteSettings.contact.email ? (
                  <p className="mt-16 text-c2 text-ink-secondary">
                    {t.orEmail}{" "}
                    <EmailLink
                      address={siteSettings.contact.technicalEmail || siteSettings.contact.email}
                      subject={`${product.model} — ${name}`}
                      className="text-brand hover:text-brand-hover"
                    />
                  </p>
                ) : null}

                {/*
                  The second of the two routes this site exists to feed. Until now the
                  only Alibaba link anywhere was in the footer, pointing at the
                  storefront's front page — so a buyer who had just read this spec table
                  had to go and find the model again by searching. This lands them on
                  THIS model.
                */}
                {alibaba && (
                  <div className="mt-32 border-t border-line pt-24">
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
                      {alibaba.kind === "listing"
                        ? t.listingHelp
                        : t.storefrontHelp}
                    </p>
                  </div>
                )}

                {/*
                  ── THE SPECIFICATION TABLE, BESIDE THE PHOTOGRAPH ────────────

                  It was a full-width section 1,400px further down, and the column it now
                  sits in ended in a column of white space — the page read as loose
                  because it was: the reader had finished the right-hand column while the
                  photograph beside it was still going.

                  It also removes a duplication rather than just moving one. 348 of 435
                  products printed their Material TWICE — once in a facts block here, once
                  as a row in the table down there — and a third time in a "Configuration"
                  section below that. Three blocks, two of them saying what the table
                  already said, separated by enough scrolling that nobody could see they
                  agreed. The facts block and the Configuration section are gone; the
                  table is the one place a specification lives.

                  This is the arrangement in the 2026-08-31 type mock-up, which the client
                  asked for by name: lead, buttons, then the table, all beside the image.
                */}
                <div className="mt-48 border-t border-line pt-24">
                  <h2 id="specifications-heading" className="text-h3 text-ink">
                    {t.specifications}
                  </h2>
                  {specs.length ? (
                    <dl className="mt-16 border-t border-line">
                      {specs.map((spec) => (
                        <div
                          key={`${spec.label}-${spec.value}`}
                          className="grid grid-cols-2 gap-16 border-b border-line py-12 text-c1"
                        >
                          <dt className="text-ink-secondary">{spec.label}</dt>
                          <dd className="tabular-nums text-ink">
                            {spec.value}
                            {spec.unit ? ` ${spec.unit}` : ""}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <div className="mt-16">
                      <EmptyState>{t.noSpecs}</EmptyState>
                    </div>
                  )}

                  {/*
                    Only the facts the table does not already carry.

                    Finishes are almost never a spec row and belong here; Material almost
                    always is. Filtering rather than hard-coding which to show means a
                    product whose data improves stops repeating itself automatically,
                    instead of waiting for somebody to notice and delete a line.
                  */}
                  {uncoveredFacts.length ? (
                    <dl className="mt-32 grid grid-cols-1 gap-24 sm:grid-cols-2">
                      {uncoveredFacts.map((fact) => (
                        <ProductFact
                          key={fact.label}
                          label={fact.label}
                          values={fact.values}
                          fallback={t.onRequest}
                        />
                      ))}
                    </dl>
                  ) : null}

                  {/*
                    ── COMMON QUESTIONS ────────────────────────────────────────

                    Composed from this product's own spec rows by productFaqItems, and
                    mirrored exactly by ProductFaqJsonLd. The two read from one function
                    on purpose: Google treats a FAQPage whose answers are not visible on
                    the page as a spam signal, and a few hundred product pages is exactly
                    the scale at which that judgement gets made about a whole site.

                    Rendered as a description list rather than an accordion. An accordion
                    hides the answers behind a click, and the point of this block is that
                    the answers are on the page — for a reader, for a crawler, and for the
                    audit that checks the two agree.
                  */}
                  <ProductDrawing slug={product.slug} locale={locale} />

                  {faqItems.length ? (
                    <div className="mt-48 border-t border-line pt-24">
                      <h2 id="product-faq-heading" className="text-h3 text-ink">
                        {productFaqHeading(locale)}
                      </h2>
                      <dl className="mt-16">
                        {faqItems.map((item) => (
                          <div key={item.question} className="border-b border-line py-16">
                            <dt className="text-c1 text-ink">{item.question}</dt>
                            <dd className="mt-4 text-c2 text-ink-secondary">{item.answer}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-span-full mt-16">
                {product.gallery.length ? (
                  /*
                    ── THE GALLERY HAS A FIRST VIEW ────────────────────────────

                    It was `grid-cols-2 md:grid-cols-3 xl:grid-cols-4` — every view at
                    identical size, which gives seven photographs of the same lock no
                    reading order at all. The eye has to inspect each one to find out
                    which is worth looking at.

                    The client's own filenames carry their order (`2-015.jpg`,
                    `3-015.jpg`, …) and the import preserves it, so the first gallery
                    image is the view they chose to put first. Giving it two columns makes
                    that choice visible and produces a rhythm — one large, then a run of
                    small — instead of a uniform field.

                    Below `md` the grid is two columns and the feature spans both, which
                    is the same relationship at phone width rather than a different one.
                  */
                  <div className="product-gallery">
                    {gallery.map((image, index) => (
                      <div
                        key={`${image.src}-${image.label}`}
                        className={index === 0 ? "product-gallery-lead" : undefined}
                      >
                        <ProductImageZoom {...image} locale={locale} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState>{t.noViews}</EmptyState>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        5 — Certifications, ONLY where a certificate actually exists.

        Twenty of 435 models carry one. The other 415 rendered a heading, a sentence
        saying there is nothing, and a second sentence about checking scope — three
        lines that told the reader the site has no answer, repeated identically on 415
        pages. The client's instruction was blunt and correct: take it down until there
        is something to show. A section that only ever says "nothing here" is worse than
        no section, and 415 identical paragraphs are duplicate content besides.
      */}
      {product.certifications.length ? (
      <section className="layout mt-144 lg:mt-288" aria-labelledby="certifications-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full xl:col-span-8">
            <h2 id="certifications-heading" className="text-h3 text-ink">
              {t.certifications}
            </h2>
          </div>
          <div className="col-span-full xl:col-span-16 xl:col-start-9">
            {product.certifications.length ? (
              <ul className="grid grid-cols-1 gap-16 sm:grid-cols-2">
                {product.certifications.map((certification) => (
                  <li
                    key={`${certification.name}-${certification.standard ?? ""}`}
                    className="border border-line bg-surface-alt p-24"
                  >
                    <p className="text-c1 font-semibold text-ink">{certification.name}</p>
                    {certification.standard ? (
                      <p className="mt-8 text-c1 text-ink-secondary">
                        {certification.standard}
                      </p>
                    ) : null}
                    {certification.downloadId ? (
                      <ArrowLink
                        href={`/downloads/#${certification.downloadId}`}
                        className="mt-24"
                      >
                        {t.viewCertificate}
                      </ArrowLink>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>{t.noCertificates}</EmptyState>
            )}
            <p className="mt-24 text-c2 text-ink-secondary">
              {t.scope}
            </p>
          </div>
        </div>
      </section>
      ) : null}

      {/*
        6 — What used to be "Downloads", now something that exists.

        Not one product of 435 has an attachment, so this slot rendered the same
        "available on request while the library is being prepared" sentence on every
        page on the site — a promise with nothing behind it, in the position a buyer
        looks for a datasheet.

        The client's call was to put the work already done here instead: the answered
        buyer questions on /faq/, and the comparison table for this range. Both are real
        pages with real content, and both are the next thing somebody reading a spec
        table actually wants — "how do I order this" and "how does it differ from the
        one next to it". It also earns the comparison pages an inbound link from all 435
        product pages rather than from the catalogue index alone.
      */}
      <section className="layout mt-144 lg:mt-288" aria-labelledby="next-steps-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full xl:col-span-8">
            <h2 id="next-steps-heading" className="text-h3 text-ink">
              {t.nextSteps}
            </h2>
          </div>
          <div className="col-span-full xl:col-span-16 xl:col-start-9">
            <ul className="border-t border-line">
              {product.attachmentIds.map((attachmentId) => (
                <li key={attachmentId} className="border-b border-line py-16">
                  <ArrowLink href={`/downloads/#${attachmentId}`}>{attachmentId}</ArrowLink>
                </li>
              ))}
              {compareHref ? (
                <li className="border-b border-line py-16">
                  <ArrowLink href={compareHref}>{t.compareRange}</ArrowLink>
                  <p className="mt-8 max-w-[56ch] text-c2 text-ink-secondary">
                    {t.compareHelp}
                  </p>
                </li>
              ) : null}
              <li className="border-b border-line py-16">
                <ArrowLink href={es ? "/es/faq/" : "/faq/"}>{t.faqLink}</ArrowLink>
                <p className="mt-8 max-w-[56ch] text-c2 text-ink-secondary">{t.faqHelp}</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7 — Related products.
          Omitted entirely when the product has no siblings — an empty-state sentence here
          would be identical on every such page, which is a slice of the duplicate-content
          problem this section is meant to help with. */}
      {related ? (
        <section className="layout mt-144 lg:mt-288" aria-labelledby="related-heading">
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
                className="col-span-full sm:col-span-4 md:col-span-6 xl:col-span-8"
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
