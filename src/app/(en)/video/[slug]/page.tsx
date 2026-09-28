import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductVideo } from "@/components/site/ProductVideo";
import { JsonLd, breadcrumbSchema, videoObjectSchema } from "@/components/site/JsonLd";
import { findCategoryByPath } from "@/data/categories";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { specValueFor } from "@/lib/imperial";
import {
  clock,
  getWatchPageProduct,
  productTitle,
  productsWithWatchPage,
  watchPagePath,
  watchVideo,
} from "@/lib/video-pages";

/**
 * A product clip's watch page — the one page on the site whose main purpose is the video.
 * Why it exists: src/lib/video-pages.ts. The player comes first, full width, before any
 * text but the heading; that ordering is the point of the page, not a style choice.
 */

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return productsWithWatchPage().map((p) => ({ slug: p.slug }));
}

/** Whole sentences only, within the description budget (same rule as the product titles). */
function describe(title: string, seconds: number, summary: string): string {
  let out = `Product video of the ${title}, ${clock(seconds)}.`;
  for (const sentence of summary.match(/[^.!?]+[.!?]+/g) ?? []) {
    const next = `${out} ${sentence.trim()}`;
    if (next.length > 150) break;
    out = next;
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getWatchPageProduct(slug);
  if (!product) return {};
  const video = watchVideo(product)!;
  const title = productTitle(product);
  return pageMetadata({
    enPath: watchPagePath(product),
    locale: "en",
    title: `${title}: Product Video`,
    description: describe(title, video.durationSeconds!, product.summary ?? ""),
    image: video.poster?.src,
    imageAlt: video.label,
  });
}

export default async function VideoWatchPage({ params }: Props) {
  const { slug } = await params;
  const product = getWatchPageProduct(slug);
  if (!product) notFound();
  const video = watchVideo(product)!;
  const title = productTitle(product);
  const category = findCategoryByPath(product.categoryPath.slice(0, 1));
  const productHref = `/products/${product.categoryPath[0]}/${product.slug}/`;
  const quote = new URLSearchParams({ product: product.name });
  if (!product.modelTbc) quote.set("model", product.model);
  const pageUrl = absoluteUrl(watchPagePath(product));
  const schema = videoObjectSchema(product, video, pageUrl);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      {schema ? <JsonLd data={schema} /> : null}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Products", url: absoluteUrl("/products/") },
          ...(category
            ? [{ name: category.name, url: absoluteUrl(`/products/${category.slug}/`) }]
            : []),
          { name: title, url: absoluteUrl(productHref) },
          { name: "Video", url: pageUrl },
        ])}
      />
      <div className="layout space-y-48 lg:space-y-72">
        <section className="col-content">
          <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
            <Link href="/video/" className="hover:text-ink">
              Product video
            </Link>
          </p>
          <h1 className="mt-16 text-h1 text-ink">{title}</h1>
        </section>

        <section className="col-content">
          <figure className="m-0">
            <ProductVideo video={video} />
            <figcaption className="mt-12 text-c2 text-ink-secondary">
              {video.label} · {clock(video.durationSeconds!)}
            </figcaption>
          </figure>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <div className="col-span-full lg:col-span-7 xl:col-span-14">
            {product.summary ? (
              <p className="max-w-[64ch] text-c1 text-ink">{product.summary}</p>
            ) : null}
            {product.specs?.length ? (
              <>
                <h2 className="mt-32 text-c1 font-semibold text-ink">
                  {product.modelTbc ? "Specifications" : `${product.model} specifications`}
                </h2>
                <dl className="mt-12 max-w-[64ch] border-t border-line">
                  {product.specs.slice(0, 8).map((spec) => (
                    <div key={`${spec.label}-${spec.value}`} className="grid grid-cols-2 gap-16 border-b border-line py-8 text-c2">
                      <dt className="text-ink-secondary">{spec.label}</dt>
                      <dd className="tabular-nums text-ink">
                        {specValueFor(spec.value, "en")}
                        {spec.unit ? ` ${spec.unit}` : ""}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}
          </div>
          <div className="col-span-full flex flex-col gap-16 lg:col-span-3 lg:col-start-9 xl:col-span-6 xl:col-start-17">
            <Link
              href={productHref}
              className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
            >
              Specifications and finishes
            </Link>
            <Link
              href={`/contact/?${quote.toString()}`}
              className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
            >
              Request a quote
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
