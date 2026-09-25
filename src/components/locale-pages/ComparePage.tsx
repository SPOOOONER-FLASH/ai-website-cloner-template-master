import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SpecMatrix } from "@/components/site/SpecMatrix";
import { SpecRangeList } from "@/components/site/SpecRangeList";
import { getTopLevelCategories } from "@/data/categories";
import type { Locale } from "@/data/locales";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { t, tx } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { lower, prefixer } from "./shared";

export function compareParams(): { category: string }[] {
  return getTopLevelCategories()
    .filter((category) => getProductsByCategory(category.slug).length >= 3)
    .map((category) => ({ category: category.slug }));
}

export function compareMetadata(locale: Locale, slug: string): Metadata {
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) return {};
  const name = t(category, "name", locale);
  const count = getProductsByCategory(category.slug).length;
  const withQualifier = tx(locale, "{count} {name} Compared Side by Side")
    .replace("{count}", String(count))
    .replace("{name}", name);
  const short = tx(locale, "{count} {name} Compared").replace("{count}", String(count)).replace("{name}", name);
  return pageMetadata({
    enPath: `/compare/${category.slug}`,
    locale,
    title: withQualifier.length <= 60 ? withQualifier : short,
    description: tx(
      locale,
      "{count} {name} compared on the specifications that differ between them. Lead time from 30 days, manufactured in Guangdong, China.",
    )
      .replace("{count}", String(count))
      .replace("{name}", lower(name, locale)),
    image: category.image.src,
    imageAlt: category.image.label,
  });
}

export function ComparePage({ locale, slug }: { locale: Locale; slug: string }) {
  const p = prefixer(locale);
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) notFound();
  const products = getProductsByCategory(category.slug);
  if (products.length < 3) notFound();
  const name = t(category, "name", locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name, url: absoluteUrl(p(`/products/${category.slug}`)) },
          { name: tx(locale, "Compare"), url: absoluteUrl(p(`/compare/${category.slug}`)) },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="compare-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: tx(locale, "Home"), href: p("/") },
                  { label: tx(locale, "Products"), href: p("/products") },
                  { label: name, href: p(`/products/${category.slug}`) },
                  { label: tx(locale, "Compare") },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">{tx(locale, "Canton Product Collection")}</p>
              <h1 id="compare-title" className="mt-8 text-h1 text-ink">
                {tx(locale, "Compare {name}").replace("{name}", name)}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">
                {tx(locale, "The specifications that differ between the {count} models in this range, in one table.").replace(
                  "{count}",
                  String(products.length),
                )}
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                {tx(
                  locale,
                  "An empty cell means we have not published that figure for that model yet rather than that the model lacks it — ask the export team and we will confirm it against the production drawing.",
                )}
              </p>
              <Link
                href={p(`/products/${category.slug}`)}
                className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                {tx(locale, "See all {count} {name}").replace("{count}", String(products.length)).replace("{name}", lower(name, locale))}
              </Link>
            </div>
          </div>
        </section>
        <SpecRangeList products={products} locale={locale} headingId="compare-range-heading" className="layout mt-48 lg:mt-64" />
        <SpecMatrix products={products} categorySlug={category.slug} locale={locale} />
      </main>
    </>
  );
}
