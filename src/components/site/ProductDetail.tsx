import Link from "next/link";
import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import { getRelatedProducts, products, publishedProducts } from "@/data/products";
import { siteSettings } from "@/data/navigation";
import { relatedBlock } from "@/lib/related-products";
import { ArrowLink } from "./ArrowLink";
import { alibabaLinkFor } from "@/lib/alibaba";
import { Button } from "./Button";
import { ProductCard } from "./ProductCard";
import { CatalogueReturnLink } from "./CatalogueNavigation";
import { ProductImageZoom } from "./ProductImageZoom";
import { ProductVideo } from "./ProductVideo";
import { Prose } from "./Prose";
import { localiseProductValues } from "@/lib/spanish-product";

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
    images: "Product images",
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
    images: "Imágenes del producto",
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
              </div>

              <div className="col-span-full flex flex-col justify-between xl:col-span-10 xl:col-start-15">
                <div>
                  <p className="text-lead text-ink">{summary}</p>
                  {/* CMS-authored long copy. Absent on every imported record — the legacy
                      catalogue carries specifications, not prose, and none is invented. */}
                  {!es && product.description ? (
                    <Prose markdown={product.description} className="mt-24" />
                  ) : null}
                  <dl className="mt-48 grid grid-cols-2 gap-x gap-y-32">
                    <ProductFact
                      label={t.material}
                      values={material}
                      fallback={t.onRequest}
                    />
                    <ProductFact label={t.doorTypes} values={doorTypes} fallback={t.onRequest} />
                  </dl>
                </div>

                <div className="mt-64 flex flex-wrap items-center gap-16">
                  <Button href={quoteHref}>{t.quote}</Button>
                  <Button href={`${base}/contact/`} variant="secondary">
                    {t.ask}
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
                    <a
                      href={`mailto:${siteSettings.contact.technicalEmail || siteSettings.contact.email}?subject=${encodeURIComponent(`${product.model} — ${name}`)}`}
                      className="text-brand hover:text-brand-hover"
                    >
                      {siteSettings.contact.technicalEmail || siteSettings.contact.email}
                    </a>
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
              </div>

              {/* Videos sit above the still gallery — motion outranks stills when both
                  exist, and a page with neither shows only the gallery's empty state. */}
              {product.videos?.length ? (
                <div className="col-span-full mt-16 grid grid-cols-1 gap-16 md:grid-cols-2">
                  {product.videos.map((video) => (
                    <figure key={video.src}>
                      <ProductVideo video={video} />
                      <figcaption className="mt-8 text-c2 text-ink-secondary">
                        {video.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}

              <div className="col-span-full mt-16">
                {product.gallery.length ? (
                  <div className="grid grid-cols-2 gap-16 md:grid-cols-3 xl:grid-cols-4">
                    {gallery.map((image) => (
                      <ProductImageZoom key={`${image.src}-${image.label}`} {...image} locale={locale} />
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

      {/* 3 — Variable-length specification table */}
      <section className="layout mt-144 lg:mt-288" aria-labelledby="specifications-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-8">
            <h2 id="specifications-heading" className="text-h3 text-ink">
              {t.specifications}
            </h2>
          </div>
          <div className="col-span-full xl:col-span-12 xl:col-start-13">
            {specs.length ? (
              <dl className="border-t border-line">
                {specs.map((spec) => (
                  <div
                    key={`${spec.label}-${spec.value}`}
                    className="grid grid-cols-2 gap-16 border-b border-line py-16 text-c1"
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
              <EmptyState>{t.noSpecs}</EmptyState>
            )}
          </div>
        </div>
      </section>

      {/* 4 — Material, finishes and door types */}
      <section className="layout mt-144 lg:mt-288" aria-labelledby="configuration-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full xl:col-span-8">
            <h2 id="configuration-heading" className="text-h3 text-ink">
              {t.configuration}
            </h2>
          </div>
          <dl className="col-span-full grid grid-cols-1 gap-32 sm:grid-cols-2 xl:col-span-16 xl:col-start-9 xl:grid-cols-3">
            <ProductFact
              label={t.material}
              values={material}
              fallback={t.onRequest}
            />
            <ProductFact label={t.finishes} values={finishes} fallback={t.onRequest} />
            <ProductFact label={t.doorTypes} values={doorTypes} fallback={t.onRequest} />
          </dl>
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
