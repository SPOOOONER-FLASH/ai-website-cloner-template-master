import Link from "next/link";
import type { Product } from "@/data/types";
import { getRelatedProducts, products } from "@/data/products";
import { relatedBlock } from "@/lib/related-products";
import { ArrowLink } from "./ArrowLink";
import { alibabaLinkFor } from "@/lib/alibaba";
import { Button } from "./Button";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ProductCard } from "./ProductCard";
import { ProductVideo } from "./ProductVideo";
import { Prose } from "./Prose";

interface ProductDetailProps {
  product: Product;
  categoryName: string;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-t border-line pt-16 text-c1 text-ink-secondary">
      {children}
    </p>
  );
}

function ProductFact({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="border-t border-line pt-16">
      <dt className="text-c2 text-ink-secondary">{label}</dt>
      <dd className="mt-16 text-c1 text-ink">
        {values.length ? values.join(" · ") : "Information available on request"}
      </dd>
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
export function ProductDetail({ product, categoryName }: ProductDetailProps) {
  const related = relatedBlock({
    product,
    curated: getRelatedProducts(product),
    catalogue: products,
    categoryName,
  });
  const quoteParams = new URLSearchParams({ product: product.name });

  if (!product.modelTbc) quoteParams.set("model", product.model);

  const quoteHref = `/contact/?${quoteParams.toString()}`;
  const alibaba = alibabaLinkFor(product);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      {/* 1 — Breadcrumb, title and model */}
      <section className="layout" aria-labelledby="product-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <nav
            aria-label="Breadcrumb"
            className="col-span-full flex flex-wrap items-center gap-x-8 text-c2 text-ink-secondary"
          >
            <Link href="/" className="short-marker short-marker-compact hover:text-brand-hover">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/products/" className="short-marker short-marker-compact hover:text-brand-hover">
              Products
            </Link>
            <span aria-hidden="true">/</span>
            <span>{categoryName}</span>
          </nav>

          <div className="col-span-full mt-24 xl:col-span-12">
            <p className="text-c1 text-ink-secondary">{product.series}</p>
            {/*
              The H1 carries the model, because that is what a buyer types. 40 records are
              named "Lock Case" and 38 "Lever Handle" — an H1 of just the name gave dozens
              of pages the same heading, which is half of why Google groups them as
              duplicates. `modelTbc` records have no real SKU yet, so they keep the plain
              name rather than showing a working label as if it were orderable.
            */}
            <h1 id="product-title" className="mt-8 text-h1 text-ink">
              {product.modelTbc ? product.name : `${product.model} ${product.name}`}
            </h1>
          </div>

          <div className="col-span-full mt-24 xl:col-span-8 xl:col-start-17">
            <p className="text-c2 text-ink-secondary">Model</p>
            <p className="mt-8 text-h3 text-ink">
              {product.modelTbc ? "Reference available on request" : product.model}
            </p>
          </div>
        </div>
      </section>

      {/* 2 — Hero image and gallery */}
      <section className="layout mt-96 lg:mt-136" aria-label="Product images">
        <div className="col-outset">
          <div className="layout">
            <div className="col-content grid w-full grid-cols gap-x gap-y-48">
              <div className="col-span-full xl:col-span-12">
                {/* The LCP element on every product page — never lazy. */}
                <MediaPlaceholder {...product.heroImage} priority />
              </div>

              <div className="col-span-full flex flex-col justify-between xl:col-span-10 xl:col-start-15">
                <div>
                  <p className="text-h3 text-ink">{product.summary}</p>
                  {/* CMS-authored long copy. Absent on every imported record — the legacy
                      catalogue carries specifications, not prose, and none is invented. */}
                  {product.description ? (
                    <Prose markdown={product.description} className="mt-24" />
                  ) : null}
                  <dl className="mt-48 grid grid-cols-2 gap-x gap-y-32">
                    <ProductFact label="Material" values={[product.material].filter(Boolean)} />
                    <ProductFact label="Door type" values={product.doorTypes} />
                  </dl>
                </div>

                <div className="mt-64 flex flex-wrap items-center gap-16">
                  <Button href={quoteHref}>Request a quote</Button>
                  <Button href="/contact/" variant="secondary">
                    Ask a technical question
                  </Button>
                </div>

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
                        ? `Order ${product.model} on Alibaba`
                        : `Find ${product.model} on our Alibaba storefront`}
                    </a>
                    <p className="mt-8 max-w-[52ch] text-c2 text-ink-secondary">
                      {alibaba.kind === "listing"
                        ? "Opens this model's listing, with current pricing, MOQ and lead time."
                        : "Opens our storefront already searched for this model — trade assurance, tiered pricing and order tracking are handled there."}
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
                    {product.gallery.map((image) => (
                      <MediaPlaceholder key={`${image.src}-${image.label}`} {...image} />
                    ))}
                  </div>
                ) : (
                  <EmptyState>
                    Additional product views are not yet available. Request drawings or samples
                    from our export team.
                  </EmptyState>
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
              Technical specifications
            </h2>
          </div>
          <div className="col-span-full xl:col-span-12 xl:col-start-13">
            {product.specs.length ? (
              <dl className="border-t border-line">
                {product.specs.map((spec) => (
                  <div
                    key={`${spec.label}-${spec.value}`}
                    className="grid grid-cols-2 gap-16 border-b border-line py-16 text-c1"
                  >
                    <dt className="text-ink-secondary">{spec.label}</dt>
                    <dd className="text-ink">
                      {spec.value}
                      {spec.unit ? ` ${spec.unit}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <EmptyState>
                Verified dimensions are pending the current technical catalogue. No values have
                been inferred from similar products.
              </EmptyState>
            )}
          </div>
        </div>
      </section>

      {/* 4 — Material, finishes and door types */}
      <section className="layout mt-144 lg:mt-288" aria-labelledby="configuration-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full xl:col-span-8">
            <h2 id="configuration-heading" className="text-h3 text-ink">
              Configuration
            </h2>
          </div>
          <dl className="col-span-full grid grid-cols-1 gap-32 sm:grid-cols-2 xl:col-span-16 xl:col-start-9 xl:grid-cols-3">
            <ProductFact label="Material" values={[product.material].filter(Boolean)} />
            <ProductFact label="Available finishes" values={product.finishes} />
            <ProductFact label="Suitable door types" values={product.doorTypes} />
          </dl>
        </div>
      </section>

      {/* 5 — Certifications */}
      <section className="layout mt-144 lg:mt-288" aria-labelledby="certifications-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full xl:col-span-8">
            <h2 id="certifications-heading" className="text-h3 text-ink">
              Standards and certifications
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
                    <p className="text-h3 text-ink">{certification.name}</p>
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
                        View certificate
                      </ArrowLink>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>
                No product-specific certificate is published for this model. Company credentials
                remain available through the export team.
              </EmptyState>
            )}
            <p className="mt-24 text-c2 text-ink-secondary">
              Certification scope must be checked against the named model before specification.
            </p>
          </div>
        </div>
      </section>

      {/* 6 — Attachments */}
      <section className="layout mt-144 lg:mt-288" aria-labelledby="attachments-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full xl:col-span-8">
            <h2 id="attachments-heading" className="text-h3 text-ink">
              Downloads
            </h2>
          </div>
          <div className="col-span-full xl:col-span-16 xl:col-start-9">
            {product.attachmentIds.length ? (
              <ul className="border-t border-line">
                {product.attachmentIds.map((attachmentId) => (
                  <li key={attachmentId} className="border-b border-line py-16">
                    <ArrowLink href={`/downloads/#${attachmentId}`}>{attachmentId}</ArrowLink>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>
                Datasheets, CAD files and installation instructions are available on request while
                the verified download library is being prepared.
              </EmptyState>
            )}
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
                {related.heading}
              </h2>
            </div>

            {related.items.map((item) => (
              <ProductCard
                key={item.slug}
                product={item}
                className="col-span-full sm:col-span-4 md:col-span-6 xl:col-span-8"
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
