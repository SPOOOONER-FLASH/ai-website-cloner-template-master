import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SpecMatrix } from "@/components/site/SpecMatrix";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * One comparison page per category.
 *
 * WHY THESE URLS EXIST. Search Console records `door stopper ds013 vs ds011` — six
 * impressions, position 5.5, zero clicks — and a comparison query wants a comparison
 * page. The matrix also renders inside the category page, but a category page is titled
 * and described as a catalogue listing; a searcher comparing two models does not
 * recognise it as the answer, and neither does an answer engine picking a source.
 *
 * ON THE CRAWL-BUDGET OBJECTION. 447 of our pages are still "discovered, not indexed",
 * and adding URLs while that is true genuinely risks lengthening the queue — that is why
 * the matrix shipped inside the category page first. The client has decided to publish
 * the standalone pages as well, so the scope is held to what earns its own URL: fifteen
 * pages, one per category, each rendering a table that exists nowhere else on the site
 * under a title that states what it is. No per-pair pages, no filter permutations.
 */

interface ComparePageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getTopLevelCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) return {};

  const count = getProductsByCategory(category.slug).length;

  return pageMetadata({
    enPath: `/compare/${category.slug}`,
    locale: "en",
    /*
      The brand suffix " | Canton Hyland" costs 16 characters, so the budget here is 46.
      "Compare X — Specifications Side by Side" blew past it on every category and on
      "Night Latches & Rim Locks" reached 83. Same ladder as the category pages: the
      informative half is the category name, so the qualifier is what gets shortened.
    */
    title:
      `Compare ${category.name} — Specifications`.length <= 46
        ? `Compare ${category.name} — Specifications`
        : `Compare ${category.name}`,
    description: `${count} ${category.name.toLowerCase()} compared on the specifications that differ between them. Lead time from 30 days, manufactured in Guangdong, China.`,
    image: category.image.src,
    imageAlt: category.image.label,
  });
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { category: slug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  /* A table of one or two rows is not a comparison; send those to the listing instead. */
  if (products.length < 3) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: category.name, url: absoluteUrl(`/products/${category.slug}/`) },
          { name: "Compare", url: absoluteUrl(`/compare/${category.slug}/`) },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="compare-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Products", href: "/products/" },
                  { label: category.name, href: `/products/${category.slug}/` },
                  { label: "Compare" },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">Canton Product Collection</p>
              <h1 id="compare-title" className="mt-8 text-h1 text-ink">
                Compare {category.name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">
                The specifications that differ between the {products.length} models in this
                range, in one table.
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                An empty cell means we have not published that figure for that model yet
                rather than that the model lacks it — ask the export team and we will
                confirm it against the production drawing.
              </p>
              <Link
                href={`/products/${category.slug}/`}
                className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                See all {products.length} {category.name.toLowerCase()}
              </Link>
            </div>
          </div>
        </section>

        <SpecMatrix products={products} categorySlug={category.slug} />
      </main>
    </>
  );
}
