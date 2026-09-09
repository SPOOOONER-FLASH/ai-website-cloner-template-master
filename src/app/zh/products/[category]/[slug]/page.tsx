import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { Button, NoPhoto, Photo, ProductCard, SpecTable, Shell } from "@/components/rayen/primitives";
import {
  absoluteUrl,
  getCategory,
  getProduct,
  getRelatedProducts,
  getStyleFamily,
  isLeverHandle,
  legalName,
  products,
  zhPath,
} from "@/data/rayen";

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({
    category: product.categoryPath[0] ?? "products",
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    // Canonical carries the DEPLOYED path, which has no /zh segment: the pages are built
    // at /zh/... and served from the root of RAYEN's own host. See build-rayen-site.mjs.
    alternates: { canonical: `/products/${categorySlug}/${slug}/` },
    openGraph: { url: absoluteUrl(`/products/${categorySlug}/${slug}/`) },
  };
}

/**
 * A product detail page.
 *
 * Photograph left, specification table right, related models below. The specification
 * table is not collapsed, not tabbed and not behind 「查看更多」: a buyer who has to click
 * to see a backset concludes the number is being managed rather than stated.
 *
 * JSON-LD carries only what the record actually holds — name, model, images, and the
 * spec rows as additionalProperty. No price, no availability, no aggregateRating. This
 * factory does not sell at a list price on this site, and marking up a rating nobody
 * collected is the machine-readable version of lying. Same rule as
 * src/components/site/JsonLd.tsx applies here.
 */
export default async function RayenProductPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(categorySlug);
  const related = getRelatedProducts(product);
  const family = getStyleFamily(product);
  const familyLevers = family.filter(isLeverHandle);
  const familyHandles = family.filter((item) => !isLeverHandle(item));
  const images = [product.heroImage, ...product.gallery].filter(
    (image): image is NonNullable<typeof image> => Boolean(image?.src),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.model} ${product.name}`,
    sku: product.model,
    description: product.summary,
    image: images.map((image) => absoluteUrl(image.src)),
    brand: { "@type": "Brand", name: "RAYEN 雷茵" },
    manufacturer: { "@type": "Organization", name: legalName },
    ...(product.material ? { material: product.material } : {}),
    additionalProperty: product.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  };

  return (
    <>
      <SiteHeader current="/products/" />

      <main className="flex-grow">
        <Shell className="py-12 md:py-16">
          <nav aria-label="面包屑" className="text-[13px] text-[var(--color-ink-3)]">
            <a href={zhPath("/products/")} className="hover:text-[var(--color-ink)]">
              产品中心
            </a>
            <span className="mx-2">/</span>
            {category ? (
              <>
                <a
                  href={zhPath(`/products/${category.slug}/`)}
                  className="hover:text-[var(--color-ink)]"
                >
                  {category.name}
                </a>
                <span className="mx-2">/</span>
              </>
            ) : null}
            <span className="latin text-[var(--color-ink)]">{product.model}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              {images[0] ? (
                <Photo src={images[0].src} alt={images[0].label} aspect="1 / 1" priority />
              ) : (
                <NoPhoto model={product.model} />
              )}
              {images.length > 1 ? (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {images.slice(1, 5).map((image) => (
                    <Photo key={image.src} src={image.src} alt={image.label} aspect="1 / 1" />
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <p className="latin text-[13px] tracking-[0.2em] text-[var(--color-ink-3)]">
                {product.model}
              </p>
              <h1 className="mt-2 text-[28px] md:text-[34px]">{product.name}</h1>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
                {product.summary}
              </p>

              {product.finishes.length ? (
                <div className="mt-6">
                  <p className="text-[13px] text-[var(--color-ink-3)]">可选表面处理</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {product.finishes.map((finish) => (
                      <li
                        key={finish}
                        className="border border-[var(--color-line)] px-3 py-1 text-[13px]"
                      >
                        {finish}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <h2 className="mt-10 text-[18px]">规格参数</h2>
              <div className="mt-4">
                <SpecTable specs={product.specs} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={zhPath("/contact/")}>索取图纸与报价</Button>
                <Button href={zhPath("/oem/")} variant="ghost">
                  来图来样加工
                </Button>
              </div>
            </div>
          </div>


          {family.length ? (
            <section className="mt-16 border-t border-[var(--color-line)] pt-10 md:mt-24">
              {/*
                同款式搭配 — the client's own framing, from the note that came with the
                image packs: 「有门把手的表示此款式搭配有同风格的门把手」. It sits ABOVE
                同类型号 because it answers a different and better question. 同类型号 is
                "what else could I buy instead"; this is "what else do I need to order
                so the doors behind this one match". The second is the one that grows an
                order, and it is the one a buyer cannot work out from a catalogue on
                their own.
              */}
              <h2 className="text-[18px]">同款式搭配</h2>
              <p className="mt-2 max-w-[60ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                {isLeverHandle(product)
                  ? "本款执手属于同一设计款式，可与下列拉手成套使用。"
                  : familyLevers.length
                    ? `本款配套同风格门把手 ${familyLevers.map((item) => item.model).join("、")}，可成套下单。`
                    : "同一设计款式下的其他型号，安装面与线条一致。"}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[...familyLevers, ...familyHandles].map((item) => (
                  <ProductCard key={item.slug} product={item} />
                ))}
              </div>
            </section>
          ) : null}

          {related.length ? (
            <section className="mt-16 border-t border-[var(--color-line)] pt-10 md:mt-24">
              <h2 className="text-[18px]">同类型号</h2>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((item) => (
                  <ProductCard key={item.slug} product={item} />
                ))}
              </div>
            </section>
          ) : null}
        </Shell>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
