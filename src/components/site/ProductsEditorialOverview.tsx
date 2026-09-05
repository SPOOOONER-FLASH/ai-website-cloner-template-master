import Link from "next/link";
import { ArrowLink } from "./ArrowLink";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "./Button";
import { MediaPlaceholder } from "./MediaPlaceholder";
import {
  getProductsArchitecture,
  type ProductsLocale,
} from "./products-architecture";

interface ProductsEditorialOverviewProps {
  locale: ProductsLocale;
  totalProducts: number;
  categoryCounts: Readonly<Record<string, number>>;
}

export function ProductsEditorialOverview({
  locale,
  totalProducts,
  categoryCounts,
}: ProductsEditorialOverviewProps) {
  const architecture = getProductsArchitecture(locale);
  const rangeChapter = architecture.story[0];
  const applicationChapter = architecture.story[1];
  const technicalChapter = architecture.story[2];
  const isSpanish = locale === "es";
  const homeHref = isSpanish ? "/es/" : "/";
  const finderHref = isSpanish ? "/es/product-finder/" : "/product-finder/";
  const configuratorHref = isSpanish ? "/es/configurator/" : "/configurator/";
  const downloadsHref = isSpanish ? "/es/downloads/" : "/downloads/";
  const contactHref = isSpanish ? "/es/contact/" : "/contact/";

  return (
    <>
      <section className="layout" aria-labelledby="products-overview-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full mb-16">
            <Breadcrumbs
              items={[
                { label: isSpanish ? "Inicio" : "Home", href: homeHref },
                { label: isSpanish ? "Productos" : "Products" },
              ]}
            />
          </div>

          <div className="col-span-full xl:col-span-13">
            <h1 id="products-overview-title" className="text-h1 text-ink">
              {architecture.title}
            </h1>
          </div>
          <div className="col-span-full xl:col-span-9 xl:col-start-16">
            <p className="text-h3 text-ink">{architecture.intro}</p>
            <div className="mt-24 flex flex-wrap gap-x-24 gap-y-12">
              <ArrowLink href={finderHref}>{architecture.finder}</ArrowLink>
              <ArrowLink href={configuratorHref}>{architecture.configurator}</ArrowLink>
            </div>
          </div>

          <figure className="col-span-full mt-24 lg:mt-48">
            <MediaPlaceholder
              src={rangeChapter.image}
              ratio="18 / 13"
              label={rangeChapter.alt}
              sizes="(min-width: 1376px) 1216px, calc(100vw - 48px)"
              priority
              className="max-h-[64vh] bg-white object-contain"
            />
            <figcaption className="grid gap-8 border-t border-line pt-16 text-c2 sm:grid-cols-2">
              <span className="font-semibold uppercase tracking-[0.08em] text-ink">
                01 · {rangeChapter.title}
              </span>
              <span className="text-ink-secondary sm:text-right">
                {architecture.rangeMeta} · {totalProducts} {isSpanish ? "modelos" : "models"}
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="layout mt-80 lg:mt-112" aria-labelledby="product-family-map-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full grid gap-24 border-t border-line pt-24 lg:grid-cols-2">
            <h2 id="product-family-map-title" className="text-h2 text-ink">
              {architecture.familiesHeading}
            </h2>
            <p className="max-w-[62ch] text-c1 text-ink-secondary">
              {architecture.familiesBody}
            </p>
          </div>

          <ol className="col-span-full grid grid-cols-1 gap-x-32 md:grid-cols-2 xl:grid-cols-3">
            {architecture.families.map((family) => (
              <li key={family.slug} className="border-t border-line py-24">
                <Link href={family.href} className="group block">
                  <span className="flex items-baseline justify-between gap-16">
                    <span className="text-h3 text-ink transition-colors duration-200 group-hover:text-brand">
                      {family.label}
                    </span>
                  </span>
                  <span className="mt-12 block text-c1 text-ink-secondary">
                    {family.description}
                  </span>
                  <span className="mt-20 flex items-center justify-between text-c2 text-ink-secondary">
                    <span>
                      {categoryCounts[family.slug] ?? 0} {isSpanish ? "modelos" : "models"}
                    </span>
                    <span aria-hidden="true" className="text-ink transition-transform duration-200 group-hover:translate-x-4">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="layout mt-128 lg:mt-176" aria-labelledby="engineering-system-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-40 border-t border-line pt-32">
          <div className="col-span-full xl:col-span-9">
            <h2 id="engineering-system-title" className="mt-12 text-h1 text-ink">
              {architecture.brandLine}
            </h2>
          </div>
          <p className="col-span-full max-w-[58ch] text-c1 text-ink-secondary xl:col-span-11 xl:col-start-14">
            {architecture.brandBody}
          </p>

          <ul className="col-span-full grid grid-cols-2 gap-x-12 gap-y-32 lg:grid-cols-4 lg:gap-x-20">
            {architecture.photographySeries.map((series) => (
              <li key={series.image}>
                <Link href={series.href} className="group block">
                  <MediaPlaceholder
                    src={series.image}
                    ratio="3 / 2"
                    label={`${series.label} — ${series.detail}`}
                    sizes="(min-width: 1376px) 292px, (min-width: 768px) 24vw, 48vw"
                    className="bg-surface-alt object-contain"
                  />
                  <span className="mt-14 block text-c1 font-semibold text-ink group-hover:text-brand">
                    {series.label}
                  </span>
                  <span className="mt-4 block text-c2 text-ink-secondary">{series.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="layout mt-128 lg:mt-192" aria-labelledby="product-story-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-64">
          <div className="col-span-full grid gap-24 border-t border-line pt-24 lg:grid-cols-2">
            <div>
              <h2 id="product-story-title" className="text-h1 text-ink">
                {architecture.storyTitle}
              </h2>
            </div>
            <p className="max-w-[62ch] text-c1 text-ink-secondary">{architecture.storyBody}</p>
          </div>

          <article className="col-span-full grid items-start gap-x gap-y-24 xl:grid-cols-24">
            <figure className="xl:col-span-15">
              <MediaPlaceholder
                src={applicationChapter.image}
                ratio="3 / 2"
                label={applicationChapter.alt}
                sizes="(min-width: 1376px) 750px, calc(100vw - 48px)"
                className="object-cover"
              />
              <figcaption className="mt-12 text-c2 text-ink-secondary">
                02 · {applicationChapter.title} — {architecture.representative}
              </figcaption>
            </figure>
            <div className="xl:col-span-7 xl:col-start-18 xl:pt-48">
              <h3 className="text-h2 text-ink">{applicationChapter.description}</h3>
              <div className="mt-32">
                <ArrowLink href={applicationChapter.href}>
                  {architecture.applicationLink}
                </ArrowLink>
              </div>
            </div>
          </article>

          <article className="col-span-full grid items-start gap-x gap-y-24 xl:grid-cols-24">
            <div className="order-2 xl:order-1 xl:col-span-7 xl:col-start-2 xl:pt-48">
              <h3 className="text-h2 text-ink">{technicalChapter.description}</h3>
              <div className="mt-32">
                <ArrowLink href={technicalChapter.href}>{architecture.technicalLink}</ArrowLink>
              </div>
            </div>
            <figure className="order-1 xl:order-2 xl:col-span-15 xl:col-start-10">
              <MediaPlaceholder
                src={technicalChapter.image}
                ratio="3 / 2"
                label={technicalChapter.alt}
                sizes="(min-width: 1376px) 750px, calc(100vw - 48px)"
                className="bg-surface-alt object-contain"
              />
              <figcaption className="mt-12 text-c2 text-ink-secondary">
                03 · {technicalChapter.title} — {architecture.representative}
              </figcaption>
            </figure>
          </article>

          <div className="col-span-full grid gap-32 border-y border-line py-40 lg:grid-cols-2 lg:items-end lg:py-56">
            <div>
              <h3 className="max-w-[22ch] text-h2 text-ink">
                {architecture.conversionTitle}
              </h3>
            </div>
            <div className="flex flex-wrap gap-16 lg:justify-end">
              <Button href={downloadsHref} variant="secondary">
                {architecture.downloads}
              </Button>
              <Button href={contactHref}>{architecture.contact}</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
