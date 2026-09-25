import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, ProductFaqJsonLd, breadcrumbSchema, productSchema } from "@/components/site/JsonLd";
import { ProductDetail } from "@/components/site/ProductDetail";
import { findCategoryByPath } from "@/data/categories";
import type { Locale } from "@/data/locales";
import { getAllProductParams, getProductBySlug, isPublished } from "@/data/products";
import { absoluteUrl, siteName } from "@/data/site";
import { OG_LOCALE, t, tx } from "@/lib/i18n";
import { alternateLanguages, defaultOgImage } from "@/lib/seo";
import { prefixer } from "./shared";

export function productParams(): { category: string; slug: string }[] {
  return getAllProductParams();
}

export function productMetadata(locale: Locale, category: string, slug: string): Metadata {
  const p = prefixer(locale);
  const product = getProductBySlug(category, slug);
  if (!product) return {};
  const name = t(product, "name", locale);
  const summary = t(product, "summary", locale);
  const path = p(`/products/${category}/${slug}`);
  const url = absoluteUrl(path);

  /*
    Built from the record in the reader's language. seoTitle / seoDescription exist in the
    overlay once the title generator has run for that locale; until then the model number
    leads a title assembled from the translated name, exactly as the Portuguese route does
    for a record the generator has not reached.
  */
  const seoTitle = t(product, "seoTitle", locale);
  const metaTitle =
    seoTitle !== product.seoTitle
      ? seoTitle
      : (() => {
          const title = `${product.modelTbc ? name : `${product.model} ${name}`} | ${siteName}`;
          return title.length <= 62 ? title : `${product.model} | ${siteName}`;
        })();
  const seoDescription = t(product, "seoDescription", locale);
  const metaDescription =
    seoDescription !== product.seoDescription
      ? seoDescription
      : summary.length <= 165
        ? summary
        : `${summary.slice(0, 160).trimEnd()}…`;

  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    ...(isPublished(product)
      ? {}
      : {
          robots: { index: false, follow: true },
          other: { "canton-withheld": "awaiting-photography" },
        }),
    alternates: {
      canonical: path,
      languages: alternateLanguages(`/products/${category}/${slug}`),
    },
    openGraph: {
      type: "website",
      url,
      title: metaTitle,
      description: metaDescription,
      locale: OG_LOCALE[locale],
      images: product.heroImage.src
        ? [{ url: absoluteUrl(product.heroImage.src), alt: t(product.heroImage, "label", locale) }]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE" }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [absoluteUrl(product.heroImage.src ?? defaultOgImage)],
    },
  };
}

export function ProductPage({ locale, category, slug }: { locale: Locale; category: string; slug: string }) {
  const p = prefixer(locale);
  const product = getProductBySlug(category, slug);
  if (!product) notFound();
  const categoryRecord = findCategoryByPath([category]);
  const categoryName = categoryRecord ? t(categoryRecord, "name", locale) : tx(locale, "Products");
  const url = absoluteUrl(p(`/products/${category}/${slug}`));

  return (
    <>
      <JsonLd data={productSchema(product, url, locale, categoryName)} />
      <ProductFaqJsonLd product={product} locale={locale} />
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name: categoryName, url: absoluteUrl(p(`/products/${category}`)) },
          { name: t(product, "name", locale), url },
        ])}
      />
      <ProductDetail product={product} categoryName={categoryName} locale={locale} />
    </>
  );
}
