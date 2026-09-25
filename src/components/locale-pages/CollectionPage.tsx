import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { SpecRangeList } from "@/components/site/SpecRangeList";
import { getTopLevelCategories } from "@/data/categories";
import type { Locale } from "@/data/locales";
import { publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { t, tx } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { lower, prefixer } from "./shared";

interface Collection {
  slug: string;
  category: { slug: string; name: string; image: { src: string; label: string } };
  child: { slug: string; name: string };
}

function collections(locale: Locale): Collection[] {
  const out: Collection[] = [];
  for (const category of getTopLevelCategories()) {
    for (const child of category.children ?? []) {
      const count = publishedProducts.filter(
        (p) => p.categoryPath[0] === category.slug && p.categoryPath[1] === child.slug,
      ).length;
      if (!count) continue;
      out.push({
        slug: `${category.slug}-${child.slug}`,
        category: {
          slug: category.slug,
          name: t(category, "name", locale),
          image: { src: category.image.src ?? "", label: category.image.label },
        },
        child: { slug: child.slug, name: t(child, "name", locale) },
      });
    }
  }
  return out;
}

export function collectionParams(): { collection: string }[] {
  return collections("en").map((c) => ({ collection: c.slug }));
}

function productsIn(collection: Collection) {
  return publishedProducts.filter(
    (p) => p.categoryPath[0] === collection.category.slug && p.categoryPath[1] === collection.child.slug,
  );
}

export function collectionMetadata(locale: Locale, slug: string): Metadata {
  const collection = collections(locale).find((c) => c.slug === slug);
  if (!collection) return {};
  const count = productsIn(collection).length;
  const name = collection.child.name;
  const withRole = `${name} — ${tx(locale, "Manufacturer & Supplier")}`;
  return pageMetadata({
    enPath: `/collections/${collection.slug}`,
    locale,
    title: withRole.length <= 46 ? withRole : name,
    description: tx(locale, "{count} {name} from the Canton Hyland {category} range, manufactured in Guangdong, China. Lead time from 30 days.")
      .replace("{count}", String(count))
      .replace("{name}", lower(name, locale))
      .replace("{category}", lower(collection.category.name, locale)),
    image: collection.category.image.src,
    imageAlt: collection.category.image.label,
  });
}

export function CollectionPage({ locale, slug }: { locale: Locale; slug: string }) {
  const p = prefixer(locale);
  const collection = collections(locale).find((c) => c.slug === slug);
  if (!collection) notFound();
  const items = productsIn(collection);
  const url = absoluteUrl(p(`/collections/${collection.slug}`));

  return (
    <>
      <JsonLd
        data={itemListSchema(
          collection.child.name,
          items.map((item) => absoluteUrl(p(`/products/${item.categoryPath[0]}/${item.slug}`))),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name: collection.category.name, url: absoluteUrl(p(`/products/${collection.category.slug}`)) },
          { name: collection.child.name, url },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="collection-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: tx(locale, "Home"), href: p("/") },
                  { label: tx(locale, "Products"), href: p("/products") },
                  { label: collection.category.name, href: p(`/products/${collection.category.slug}`) },
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
                {tx(locale, "{count} {name} from the Canton Hyland {category} range.")
                  .replace("{count}", String(items.length))
                  .replace("{name}", lower(collection.child.name, locale))
                  .replace("{category}", lower(collection.category.name, locale))}
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                {tx(
                  locale,
                  "Manufactured in Zhongshan, Guangdong. Production lead time starts at 30 days from order confirmation, and we produce under our customers' own brands.",
                )}
              </p>
              <Link
                href={p(`/products/${collection.category.slug}`)}
                className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                {tx(locale, "See the whole {category} range").replace("{category}", lower(collection.category.name, locale))}
              </Link>
            </div>
          </div>
        </section>
        <SpecRangeList products={items} locale={locale} headingId="collection-range-heading" />
        <section className="layout mt-64 md:mt-144 lg:mt-288" aria-label={collection.child.name}>
          <div className="col-content grid w-full grid-cols gap-x">
            <ProductIndexList
              products={items}
              label={`${items.length} ${lower(collection.child.name, locale)}`}
              locale={locale}
            />
          </div>
        </section>
      </main>
    </>
  );
}
