import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryFilter } from "@/components/site/CategoryFilter";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { SpecMatrix } from "@/components/site/SpecMatrix";
import { getTopLevelCategories } from "@/data/categories";
import { categorySourcingLine } from "@/data/category-sourcing";
import type { Locale } from "@/data/locales";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { t, tx } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { lower, prefixer } from "./shared";

export function categoryParams(): { category: string }[] {
  return getTopLevelCategories().map((category) => ({ category: category.slug }));
}

export function categoryMetadata(locale: Locale, slug: string): Metadata {
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) return {};
  const name = t(category, "name", locale);
  const summary = t(category, "summary", locale);
  const count = getProductsByCategory(category.slug).length;
  const n = (s: string) => s.replace("{count}", String(count));
  const tails = [
    n(tx(locale, "{count} models manufactured in Guangdong, China. Lead time from 30 days.")),
    n(tx(locale, "{count} models made in Guangdong. Lead time from 30 days.")),
    n(tx(locale, "{count} models. Lead time from 30 days.")),
    n(tx(locale, "{count} models made in Guangdong, China.")),
  ];
  const description = tails.map((tail) => `${summary} ${tail}`).find((d) => d.length <= 165) ?? summary;
  const titleBudget = 62 - " | Canton Hyland".length;
  const withRole = tx(locale, "{name}, Manufacturer & Supplier").replace("{name}", name);
  const withManufacturer = tx(locale, "{name}, Manufacturer").replace("{name}", name);
  const title = withRole.length <= titleBudget ? withRole : withManufacturer.length <= titleBudget ? withManufacturer : name;
  return pageMetadata({
    enPath: `/products/${category.slug}`,
    locale,
    title,
    description,
    image: category.image.src,
    imageAlt: t(category.image, "label", locale),
  });
}

export function CategoryPage({ locale, slug }: { locale: Locale; slug: string }) {
  const p = prefixer(locale);
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) notFound();
  const products = getProductsByCategory(category.slug);
  const name = t(category, "name", locale);
  const summary = t(category, "summary", locale);
  const categoryUrl = absoluteUrl(p(`/products/${category.slug}`));
  const options = category.children?.map((child) => ({ slug: child.slug, name: t(child, "name", locale) })) ?? [];
  /* The sourcing line exists in English and Spanish only; the English one goes through the overlay. */
  const sourcing = categorySourcingLine(category.slug, locale === "es" ? "es" : "en");

  return (
    <>
      <JsonLd data={itemListSchema(name, products.map((item) => absoluteUrl(p(`/products/${item.categoryPath[0]}/${item.slug}`))))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name, url: categoryUrl },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="category-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: tx(locale, "Home"), href: p("/") },
                  { label: tx(locale, "Products"), href: p("/products") },
                  { label: name },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">{tx(locale, "Canton Product Collection")}</p>
              <h1 id="category-title" className="mt-8 text-h1 text-ink">
                {name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">{summary}</p>
              <p className="mt-24 text-c1 text-ink-secondary">
                {tx(locale, "Product data shown here is limited to verified client records. Additional references from the legacy catalog are being prepared for structured publication.")}
              </p>
              {sourcing ? <p className="mt-24 text-c1 text-ink-secondary">{tx(locale, sourcing)}</p> : null}
            </div>
          </div>
        </section>
        <section className="layout mt-64 md:mt-144 lg:mt-288" aria-label={tx(locale, "{name} catalog").replace("{name}", name)}>
          <div className="col-content grid w-full grid-cols gap-x">
            <CategoryFilter products={products} options={options} locale={locale} />
            <ProductIndexList products={products} label={`${products.length} ${lower(name, locale)}`} locale={locale} />
          </div>
        </section>
        <SpecMatrix products={products} categorySlug={category.slug} locale={locale} showCompareLink />
      </main>
    </>
  );
}
