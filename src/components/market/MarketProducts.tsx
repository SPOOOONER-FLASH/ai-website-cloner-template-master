import Link from "next/link";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { JsonLd, itemListSchema } from "@/components/site/JsonLd";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import type { MarketLocale } from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";
import { MarketBreadcrumbs, MarketButton, MarketLink, MarketMain, MarketPageIntro } from "./MarketPrimitives";

/**
 * The catalogue overview in a market language: every published family, its translated
 * name and one-line summary, the live model count, and a link into the English category.
 *
 * The honest line — the product pages are English — is printed above the grid, not
 * discovered on the first click. See src/data/market-locales.ts for why the catalogue
 * itself is not mirrored.
 */
export function MarketProducts({ locale }: { locale: MarketLocale }) {
  const copy = marketCopy[locale];
  const text = copy.products;
  const categories = getTopLevelCategories();

  return (
    <MarketMain locale={locale} page="/products">
      <div className="layout">
        <div className="col-content">
          <MarketBreadcrumbs locale={locale} page="/products" />
        </div>
      </div>
      <JsonLd
        data={itemListSchema(
          text.h1,
          categories.map((category) => absoluteUrl(`/products/${category.slug}/`)),
        )}
      />
      <MarketPageIntro kicker={text.kicker} title={text.h1} lead={text.intro}>
        <p className="mt-16 text-c2 text-ink-secondary">{text.englishNote}</p>
        <div className="mt-24 flex flex-wrap gap-16">
          <MarketButton href="/products/" hrefLang="en">
            {text.englishCta}
          </MarketButton>
          <MarketButton href="/product-finder/" hrefLang="en" variant="secondary">
            {text.finderCta}
          </MarketButton>
        </div>
      </MarketPageIntro>

      <section className="layout" aria-labelledby="market-families">
        <div className="col-content border-t border-line pt-32">
          <h2 id="market-families" className="text-h2 text-ink">
            {text.categoriesHeading}
          </h2>
          <ul className="mt-32 grid grid-cols-1 gap-x gap-y-40 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => {
              const local = copy.categories[category.slug];
              const count = getProductsByCategory(category.slug).length;
              const href = `/products/${category.slug}/`;
              return (
                <li key={category.slug}>
                  <Link href={href} hrefLang="en" className="block no-underline">
                    <MediaPlaceholder
                      {...category.image}
                      label={local?.name ?? category.image.label}
                      sizes="(min-width: 1280px) 33vw, (min-width: 744px) 50vw, 100vw"
                      priority={index < 3}
                    />
                  </Link>
                  <h3 className="mt-16 text-h3 text-ink">{local?.name ?? category.name}</h3>
                  <p className="mt-8 text-c1 text-ink-secondary">{local?.summary ?? category.summary}</p>
                  <p className="mt-12">
                    <MarketLink href={href} hrefLang="en">
                      {copy.common.openCategory} · {copy.common.modelsCount.replace("{n}", String(count))}
                    </MarketLink>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-6 xl:col-span-12">{text.helpHeading}</h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{text.helpBody}</p>
            <div className="mt-24">
              <MarketButton href={marketHref(locale, "/contact")}>{copy.common.contactCta}</MarketButton>
            </div>
          </div>
        </div>
      </section>
    </MarketMain>
  );
}
