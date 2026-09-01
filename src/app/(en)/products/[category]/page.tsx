import type { Metadata } from "next";
import { SpecMatrix } from "@/components/site/SpecMatrix";
import { categorySourcingLine } from "@/data/category-sourcing";
import { notFound, permanentRedirect } from "next/navigation";
import { CategoryFilter } from "@/components/site/CategoryFilter";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import {
  canonicalCategorySlug,
  getLegacyCategoryParams,
} from "@/data/category-aliases";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...getTopLevelCategories().map((category) => ({ category: category.slug })),
    ...getLegacyCategoryParams(),
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const canonicalSlug = canonicalCategorySlug(categorySlug);
  /*
    Retired slug: this route exists only to redirect (see category-aliases.ts).

    Keep the canonical pointing at the live page while marking the stub noindex. An
    earlier version returned robots alone, which replaced the whole metadata object and
    left the canonical falling back to the site root — scripts/seo-audit.test.mjs caught
    it as redirect-canonical-mismatch. noindex and canonical do different jobs here and
    both are needed: one keeps the stub out of the index, the other tells anything that
    does reach it where the real page is.
  */
  if (canonicalSlug !== categorySlug) {
    return {
      robots: { index: false, follow: true },
      alternates: { canonical: `/products/${canonicalSlug}/` },
    };
  }

  const category = getTopLevelCategories().find((item) => item.slug === canonicalSlug);

  if (!category) return {};

  // Bare category names came out at ~25 characters once the brand suffix was added,
  // leaving more than half the title budget unused. The qualifier is the one buyers
  // actually type — "panic exit device manufacturer" — and it is a plain statement of
  // what this company is, not a claim. Long names that overflow with the full qualifier
  // fall back to the short "— Manufacturer" form rather than shipping bare.
  const withRole = `${category.name} — Manufacturer & Supplier`;
  const withManufacturer = `${category.name} — Manufacturer`;
  const titleBudget = 62 - " | Canton Hyland".length;
  const title =
    withRole.length <= titleBudget
      ? withRole
      : withManufacturer.length <= titleBudget
        ? withManufacturer
        : category.name;

  // Several category summaries stop around 65 characters. The count is read from the
  // catalogue, and the closing clause repeats copy already published site-wide.
  // Summaries above ~83 chars overflow the 165-char budget with the full tail and used
  // to ship bare; the compact tail keeps the manufactured-in-Guangdong fact on those pages.
  const count = getProductsByCategory(category.slug).length;
  // "Lead time from 30 days" (client-confirmed 2026-09-01) is the answer to the question
  // buyers ask before any other, and a snippet is where they read it. It replaces the
  // export-markets clause rather than joining it: both do not fit inside 165 characters,
  // and a delivery date outranks a market count for someone deciding whether to enquire.
  const tail = `${count} models manufactured in Guangdong, China. Lead time from 30 days.`;
  const compactTail = `${count} models made in Guangdong. Lead time from 30 days.`;
  // A long summary cannot keep both facts. Lead time is the one that survives: it is
  // what the buyer is deciding on, and the factory location is already on every page.
  const leadOnlyTail = `${count} models. Lead time from 30 days.`;
  const bareTail = `${count} models made in Guangdong, China.`;
  const full = `${category.summary} ${tail}`;
  const compact = `${category.summary} ${compactTail}`;
  const leadOnly = `${category.summary} ${leadOnlyTail}`;
  const bare = `${category.summary} ${bareTail}`;
  const description =
    full.length <= 165
      ? full
      : compact.length <= 165
        ? compact
        : leadOnly.length <= 165
          ? leadOnly
          : bare.length <= 165
            ? bare
            : category.summary;

  return pageMetadata({
    enPath: `/products/${canonicalSlug}`,
    locale: "en",
    title,
    description,
    image: category.image.src,
    imageAlt: category.image.label,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const canonicalSlug = canonicalCategorySlug(categorySlug);

  if (canonicalSlug !== categorySlug) {
    permanentRedirect(`/products/${canonicalSlug}/`);
  }

  const category = getTopLevelCategories().find((item) => item.slug === canonicalSlug);

  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const categoryUrl = absoluteUrl(`/products/${category.slug}/`);
  const options = category.children?.map(({ slug, name }) => ({ slug, name })) ?? [];
  const sourcing = categorySourcingLine(category.slug, "en");

  return (
    <>
      <JsonLd
        data={itemListSchema(
          category.name,
          products.map((p) => absoluteUrl(`/products/${p.categoryPath[0]}/${p.slug}/`)),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: category.name, url: categoryUrl },
        ])}
      />
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="category-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products/" },
                { label: category.name },
              ]}
            />
          </div>
          <div className="col-span-full mt-24 xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Canton Product Collection</p>
            <h1 id="category-title" className="mt-8 text-h1 text-ink">{category.name}</h1>
          </div>
          <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
            <p className="text-lead text-ink">{category.summary}</p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Product data shown here is limited to verified client records. Additional references
              from the legacy catalogue are being prepared for structured publication.
            </p>
            {/* Sourcing facts, every clause published elsewhere — see category-sourcing.ts. */}
            {sourcing ? <p className="mt-24 text-c1 text-ink-secondary">{sourcing}</p> : null}
          </div>
        </div>
      </section>

      <section className="layout mt-64 md:mt-144 lg:mt-288" aria-label={`${category.name} catalogue`}>
        <div className="col-content grid w-full grid-cols gap-x">
          <CategoryFilter products={products} options={options} />
          <ProductIndexList products={products} label={`${products.length} ${category.name.toLowerCase()}`} />
        </div>
      </section>
      <SpecMatrix products={products} categorySlug={category.slug} showCompareLink />
    </main>
    </>
  );
}
