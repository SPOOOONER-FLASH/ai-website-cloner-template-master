import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { getTopLevelCategories } from "@/data/categories";
import { products as allProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * Static pages for the sub-categories, one URL per real filter.
 *
 * WHAT THESE ARE. Sub-categories have always existed as a filter dimension — the rail on
 * a category page writes `?type=fire-door` — but a query parameter is not a landing page.
 * Search Console shows people searching `fire exit door with panic bar double`,
 * `cleanroom anti-panic doors`, `single door panic bar with latch`: sub-category-shaped
 * queries with no sub-category-shaped page to answer them.
 *
 * WHY /collections/ AND NOT /products/<category>/<sub>/. That second path is already
 * taken: `/products/[category]/[slug]/` is the product route, so a sub-category segment
 * there would collide with every product slug. A separate namespace keeps both readable
 * and neither ambiguous.
 *
 * SCOPE, DELIBERATELY SMALL. Only sub-categories the catalogue actually declares AND
 * that hold products — 21 of them, not a permutation of every facet against every other.
 * `wafer-locks` and `armoured-lock-covers` hold nothing and are skipped here exactly as
 * they are skipped in the menu: a page that says "no products match" is a defect.
 */

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

interface Collection {
  slug: string;
  category: { slug: string; name: string; image: { src: string; label: string } };
  child: { slug: string; name: string };
}

/** `<category>-<subcategory>`, flattened so one segment addresses it. */
function collections(): Collection[] {
  const out: Collection[] = [];
  for (const category of getTopLevelCategories()) {
    for (const child of category.children ?? []) {
      const count = allProducts.filter(
        (p) => p.categoryPath[0] === category.slug && p.categoryPath[1] === child.slug,
      ).length;
      if (!count) continue;
      out.push({
        slug: `${category.slug}-${child.slug}`,
        category: {
          slug: category.slug,
          name: category.name,
          /* Category art is optional in the type; the OG tag falls back to the site image. */
          image: { src: category.image.src ?? "", label: category.image.label },
        },
        child: { slug: child.slug, name: child.name },
      });
    }
  }
  return out;
}

function find(slug: string): Collection | undefined {
  return collections().find((c) => c.slug === slug);
}

function productsIn(collection: Collection) {
  return allProducts.filter(
    (p) =>
      p.categoryPath[0] === collection.category.slug &&
      p.categoryPath[1] === collection.child.slug,
  );
}

export function generateStaticParams() {
  return collections().map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = find(slug);
  if (!collection) return {};

  const count = productsIn(collection).length;
  const name = collection.child.name;

  /* Same 46-character budget as the other templates; the qualifier is what gets cut. */
  const withRole = `${name} — Manufacturer & Supplier`;
  const title = withRole.length <= 46 ? withRole : name;

  return pageMetadata({
    enPath: `/collections/${collection.slug}`,
    locale: "en",
    title,
    description: `${count} ${name.toLowerCase()} from the Canton Hyland ${collection.category.name.toLowerCase()} range, manufactured in Guangdong, China. Lead time from 30 days.`,
    image: collection.category.image.src,
    imageAlt: collection.category.image.label,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: slug } = await params;
  const collection = find(slug);
  if (!collection) notFound();

  const items = productsIn(collection);
  const url = absoluteUrl(`/collections/${collection.slug}/`);

  return (
    <>
      <JsonLd
        data={itemListSchema(
          collection.child.name,
          items.map((p) => absoluteUrl(`/products/${p.categoryPath[0]}/${p.slug}/`)),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          {
            name: collection.category.name,
            url: absoluteUrl(`/products/${collection.category.slug}/`),
          },
          { name: collection.child.name, url },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="collection-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Products", href: "/products/" },
                  {
                    label: collection.category.name,
                    href: `/products/${collection.category.slug}/`,
                  },
                  { label: collection.child.name },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">{collection.category.name}</p>
              <h1 id="collection-title" className="mt-8 text-h1 text-ink">
                {collection.child.name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">
                {items.length} {collection.child.name.toLowerCase()} from the Canton Hyland{" "}
                {collection.category.name.toLowerCase()} range.
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                Manufactured in Zhongshan, Guangdong. Production lead time starts at 30
                days from order confirmation, and we produce under our customers&rsquo; own
                brands.
              </p>
              <Link
                href={`/products/${collection.category.slug}/`}
                className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                See the whole {collection.category.name.toLowerCase()} range
              </Link>
            </div>
          </div>
        </section>

        <section className="layout mt-64 md:mt-144 lg:mt-288" aria-label={collection.child.name}>
          <div className="col-content grid w-full grid-cols gap-x">
            <ProductIndexList
              products={items}
              label={`${items.length} ${collection.child.name.toLowerCase()}`}
            />
          </div>
        </section>
      </main>
    </>
  );
}
