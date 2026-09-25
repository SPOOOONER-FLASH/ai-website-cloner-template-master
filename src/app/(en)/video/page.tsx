import type { Metadata } from "next";
import Link from "next/link";
import { getTopLevelCategories } from "@/data/categories";
import { pageMetadata } from "@/lib/seo";
import { clock, productTitle, productsWithWatchPage, watchPagePath, watchVideo } from "@/lib/video-pages";

/**
 * Every product clip, by category — the index that links each watch page (see
 * src/lib/video-pages.ts). A plain list on purpose: it exists so a buyer and a crawler can
 * reach every clip, and a model number read in a column is how this trade scans a list.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/video",
  locale: "en",
  title: "Product Videos: Door Hardware Filmed Model by Model",
  description:
    "Short clips of our door hardware, one per model: panic exit devices, locks, levers, handles, hinges and fittings. Each links to its specifications.",
});

export default function VideoIndexPage() {
  const withVideo = productsWithWatchPage();
  const groups = getTopLevelCategories()
    .map((category) => ({
      category,
      items: withVideo.filter((p) => p.categoryPath[0] === category.slug),
    }))
    .filter((g) => g.items.length);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-72 lg:space-y-112">
        <section className="col-content">
          <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">Product video</p>
          <h1 className="mt-16 text-h1 text-ink">Door hardware, filmed model by model.</h1>
          <p className="mt-24 max-w-[64ch] text-c1 text-ink-secondary">
            {withVideo.length} clips. Each one opens on its own page, with a link to the
            specifications of the model in it.
          </p>
        </section>

        {groups.map(({ category, items }) => (
          <section key={category.slug} className="col-content border-t border-line pt-24">
            <h2 className="text-h3 text-ink">{category.name}</h2>
            <ul className="mt-16 grid gap-x-32 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <li key={product.slug} className="text-c1">
                  <Link href={watchPagePath(product)} className="text-ink hover:text-brand">
                    {productTitle(product)}
                  </Link>
                  <span className="text-ink-secondary"> · {clock(watchVideo(product)!.durationSeconds!)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
