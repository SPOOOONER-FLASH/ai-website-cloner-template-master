import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { CategoryCard } from "@/components/site/CategoryCard";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { ProductCategoryRail } from "@/components/site/ProductCategoryRail";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory, products } from "@/data/products";

export const metadata: Metadata = pageMetadata({
  enPath: "/products",
  locale: "en",
  title: "Products — Door Hardware Catalogue",
  description:
    "Mortise locks, lever handles, glass door fittings, panic exit devices, cylinders and accessories — the full Canton Hyland catalogue.",
});

/**
 * Four pre-filtered ways into the Finder.
 *
 * Counts come from the catalogue rather than being written down, so adding products
 * cannot leave a wrong number on the page. The facets chosen are the ones a hardware
 * schedule is actually written in.
 */
function finderEntries() {
  const byMaterial = (value: string) =>
    products.filter((p) => p.material?.toLowerCase().includes(value)).length;

  return [
    {
      label: "Stainless steel",
      href: "/product-finder/?material=" + encodeURIComponent("Stainless Steel"),
      count: byMaterial("stainless"),
    },
    {
      label: "Fire doors",
      href: "/product-finder/?doorType=" + encodeURIComponent("Fire Door"),
      count: products.filter((p) => p.doorTypes?.some((d) => /fire/i.test(d))).length,
    },
    {
      label: "Panic exit devices",
      href: "/product-finder/?category=panic-exit-devices",
      count: getProductsByCategory("panic-exit-devices").length,
    },
    {
      label: "Lock cases",
      href: "/product-finder/?category=lock-cases",
      count: getProductsByCategory("lock-cases").length,
    },
  ].filter((entry) => entry.count > 0);
}

const FINDER_ENTRIES = finderEntries();

export default function ProductsPage() {
  const categories = getTopLevelCategories();

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full mb-24">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
          </div>
          <div className="col-span-full xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Canton Product Collection</p>
            <h1 className="mt-8 text-h1 text-ink">Door locks and architectural hardware</h1>
          </div>
          <div className="col-span-full xl:col-span-7 xl:col-start-12">
            <h2 className="text-h3 text-ink">One manufacturer, a complete door-hardware schedule.</h2>
            <p className="mt-24 text-c1 text-ink-secondary">
              Canton Hyland manufactures door locks and building hardware for commercial and
              residential projects, with OEM development available for new forms and mechanisms.
            </p>
            <div className="mt-32 flex flex-col items-start gap-12">
              <ArrowLink href="/contact/">Request the current catalogue</ArrowLink>
              <ArrowLink href="/downloads/">Service + Downloads</ArrowLink>
            </div>
          </div>
          <div className="col-span-full mt-24 xl:col-span-5 xl:col-start-20 xl:mt-0">
            <ProductCategoryRail categories={categories} />
          </div>
        </div>
      </div>

      <section className="layout mt-96 lg:mt-144" aria-label="Featured hardware applications">
        <div className="col-outset grid gap-16 px-outset md:grid-cols-2 md:px-0">
          <Link href="/products/panic-exit-devices/" className="group block">
            <MediaPlaceholder
              src="/images/company/hero-panic-exit-banner.webp"
              ratio="1024 / 397"
              label="Panic exit hardware installed in a commercial interior"
            />
            <span className="mt-16 block text-h3 text-ink group-hover:text-brand-hover group-hover:underline">
              Panic exit devices — fast release for emergency doors
            </span>
          </Link>
          <Link href="/products/lever-handles/" className="group block">
            <MediaPlaceholder
              src="/images/company/hero-grip-handle-banner.webp"
              ratio="1024 / 397"
              label="Lever and grip handle sets installed on timber doors"
            />
            <span className="mt-16 block text-h3 text-ink group-hover:text-brand-hover group-hover:underline">
              Lever and grip handle systems
            </span>
          </Link>
        </div>
      </section>

      <section className="layout mt-144 lg:mt-192" aria-labelledby="category-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-42">
          <div className="col-span-full flex items-end justify-between gap-24 border-b border-line pb-16">
            <h2 id="category-heading" className="text-h3 text-ink">Product categories</h2>
            <p className="text-c2 text-ink-secondary">
              {categories.length} categories · {products.length} verified product records
            </p>
          </div>
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              category={category}
              index={index}
              productCount={getProductsByCategory(category.slug).length}
            />
          ))}
        </div>
      </section>

      {/*
        The gateway to the Product Finder.

        This section used to be the full index — every one of the 431 products, grouped
        by category, on one page. That is the FSB pattern, and it suits FSB: they sell a
        few dozen handles to architects who browse. This catalogue is 431 records across
        16 categories, and rendering it here meant one page requesting hundreds of
        photographs before a buyer had narrowed anything.

        The categories above already answer "what do you make". What a buyer needs next
        is a way to narrow by the attributes on their schedule — material, finish, door
        type — and that is the Finder. So this block sells the Finder rather than
        duplicating the catalogue in front of it.
      */}
      <section className="layout mt-144 lg:mt-192" aria-labelledby="finder-gateway-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full border-t border-line pt-48 xl:col-span-13">
            <p className="text-c1 text-ink-secondary">Find the right model</p>
            <h2 id="finder-gateway-heading" className="mt-8 text-h1 text-ink">
              {products.length} models. Narrow them by what is on your schedule.
            </h2>
            <p className="mt-24 max-w-[54ch] text-c1 text-ink-secondary">
              The Product Finder filters the full catalogue by category, type, series,
              material, finish, door type and certification. Filters combine, counts
              update as you go, and the address bar keeps your selection — so a narrowed
              view can be pasted straight into an email to a colleague.
            </p>

            <div className="mt-32 flex flex-wrap items-center gap-16">
              <Button href="/product-finder/">Open the Product Finder</Button>
              <Button href="/contact/" variant="secondary">
                Ask an export engineer
              </Button>
            </div>
          </div>

          {/*
            Direct entries into a pre-filtered Finder. These are the four dimensions
            buyers actually open with, and each link arrives with that facet already
            applied rather than dropping them into an empty filter rail.
          */}
          <div className="col-span-full xl:col-span-10 xl:col-start-15">
            <p className="border-b border-line pb-16 text-c2 uppercase tracking-[0.08em] text-ink-secondary">
              Start from a filter
            </p>
            <ul className="mt-24 grid grid-cols-1 gap-16 sm:grid-cols-2 xl:grid-cols-1">
              {FINDER_ENTRIES.map((entry) => (
                <li key={entry.href} className="border-b border-line pb-16">
                  <Link
                    href={entry.href}
                    className="group flex items-baseline justify-between gap-16"
                  >
                    <span className="text-c1 text-ink group-hover:text-brand">
                      {entry.label}
                    </span>
                    <span className="flex-none text-c2 text-ink-tertiary">
                      {entry.count} models
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-24 text-c2 text-ink-secondary">
              Or browse a category above — each one lists its models 20 to a page.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
