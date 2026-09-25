import Link from "next/link";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { getTopLevelCategories, categories as allCategories } from "@/data/categories";
import { stats } from "@/data/company";
import { getProductsByCategory, publishedProducts } from "@/data/products";
import type { MarketLocale } from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";
import { MarketButton, MarketLink, MarketMain } from "./MarketPrimitives";

/**
 * The market home page: the whole pitch on one page, in the reader's language.
 *
 * It is longer than the English home on purpose. An English reader has 2,000 pages behind
 * this one; a German reader has seven, so the page an answer engine cites for "Panikstange
 * Hersteller China" has to carry the facts itself — founding year, ISO 9001 since 2002,
 * model count, the flagship families, the four commercial answers — rather than link to
 * them. Every figure is computed from the catalogue at build time, as on the English home.
 */
export function MarketHome({ locale }: { locale: MarketLocale }) {
  const copy = marketCopy[locale];
  const home = copy.home;
  const categories = getTopLevelCategories();
  const stat = (label: string) => stats.find((s) => s.label === label)?.value ?? null;

  const facts = [
    { value: String(publishedProducts.length), label: home.facts.models },
    { value: String(allCategories.length), label: home.facts.families },
    { value: stat("Founded"), label: home.facts.founded },
    { value: stat("Quality system"), label: home.facts.quality },
    { value: stat("Workforce"), label: home.facts.workforce },
  ].filter((fact): fact is { value: string; label: string } => Boolean(fact.value));

  const flagshipImage: Record<string, { src: string; ratio: string }> = {
    "panic-exit-devices": { src: "/images/editorial/home-panic-exit-bars.webp", ratio: "2400 / 943" },
    "lock-cases": { src: "/images/editorial/hyde-client-lc04-selection.webp", ratio: "1 / 1" },
    "lock-cylinders": { src: "/images/editorial/hyde-real-cylinder-dark.webp", ratio: "1 / 1" },
  };

  const firstQuestions = copy.faq.groups[0]?.items.slice(0, 4) ?? [];

  return (
    <MarketMain locale={locale} page="/">
      {/* Hero: the H1 carries the category and the place, like the English page. */}
      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-32">
          <div className="col-span-full lg:col-span-7 xl:col-span-14">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{home.kicker}</p>
            <h1 className="mt-16 text-h1 text-ink">
              <span className="block">{home.h1Line1}</span>
              <span className="block">{home.h1Line2}</span>
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-9 xl:col-start-16">
            {home.intro.map((paragraph, index) => (
              <p key={index} className={index ? "mt-16 text-c1 text-ink" : "text-c1 text-ink"}>
                {paragraph}
              </p>
            ))}
            <div className="mt-32 flex flex-wrap gap-16">
              <MarketButton href={marketHref(locale, "/contact")}>{home.ctaButton}</MarketButton>
              <MarketButton href="/products/" hrefLang="en" variant="secondary">
                {home.ctaSecondary}
              </MarketButton>
            </div>
          </div>
          <div className="col-span-full">
            <MediaPlaceholder
              ratio="2400 / 943"
              src="/images/editorial/home-panic-exit-bars.webp"
              label={home.flagship[0]?.title ?? home.h1Line1}
              priority
            />
          </div>
        </div>
      </section>

      {/* Facts, counted at build time. */}
      <section className="layout" aria-label={home.factsHeading}>
        <div className="col-content border-t border-line pt-32">
          <h2 className="text-h2 text-ink">{home.factsHeading}</h2>
          <dl className="mt-24 grid grid-cols-2 gap-x gap-y-24 md:grid-cols-3 xl:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label} className="border-t border-line pt-12">
                <dd className="text-h2 text-ink">{fact.value}</dd>
                <dt className="mt-4 text-c2 text-ink-secondary">{fact.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The three families a first-time buyer should see. */}
      <section className="layout">
        <div className="col-content">
          <h2 className="text-h2 text-ink">{home.flagshipHeading}</h2>
          <ul className="mt-32 grid grid-cols-1 gap-x gap-y-40 md:grid-cols-3">
            {home.flagship.map((family) => {
              const image = flagshipImage[family.slug];
              const count = getProductsByCategory(family.slug).length;
              return (
                <li key={family.slug}>
                  {image ? (
                    <Link href={`/products/${family.slug}/`} hrefLang="en" className="block no-underline">
                      <MediaPlaceholder ratio="1 / 1" src={image.src} label={family.title} sizes="(min-width: 744px) 33vw, 100vw" />
                    </Link>
                  ) : null}
                  <h3 className="mt-16 text-h3 text-ink">{family.title}</h3>
                  <p className="mt-8 text-c1 text-ink-secondary">{family.body}</p>
                  <p className="mt-12">
                    <MarketLink href={`/products/${family.slug}/`} hrefLang="en">
                      {copy.common.modelsCount.replace("{n}", String(count))}
                    </MarketLink>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Every family with something published in it. */}
      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-24">
          <div className="col-span-full lg:col-span-6 xl:col-span-12">
            <h2 className="text-h2 text-ink">{home.categoriesHeading}</h2>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{home.categoriesIntro}</p>
            <p className="mt-8 text-c2 text-ink-secondary">{copy.common.catalogInEnglish}</p>
          </div>
          <ul className="col-span-full mt-16 grid grid-cols-1 gap-x gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const local = copy.categories[category.slug];
              const count = getProductsByCategory(category.slug).length;
              return (
                <li key={category.slug} className="border-t border-line py-16">
                  <Link
                    href={`/products/${category.slug}/`}
                    hrefLang="en"
                    className="short-marker short-marker-compact text-c1 font-semibold text-ink no-underline hover:text-brand-hover"
                  >
                    {local?.name ?? category.name}
                  </Link>
                  <p className="mt-4 text-c2 text-ink-secondary">{local?.summary ?? category.summary}</p>
                  <p className="mt-4 text-c2 text-ink-secondary">
                    {copy.common.modelsCount.replace("{n}", String(count))}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="col-span-full">
            <MarketLink href={marketHref(locale, "/products")}>{copy.nav.products}</MarketLink>
          </p>
        </div>
      </section>

      {/* Why buyers come back: four facts, one each. */}
      <section className="layout">
        <div className="col-content border-t border-line pt-32">
          <h2 className="text-h2 text-ink">{home.whyHeading}</h2>
          <ul className="mt-24 grid grid-cols-1 gap-x gap-y-32 md:grid-cols-2 xl:grid-cols-4">
            {home.why.map((item) => (
              <li key={item.title}>
                <h3 className="text-h3 text-ink">{item.title}</h3>
                <p className="mt-8 text-c1 text-ink-secondary">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The first four commercial questions. */}
      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-24">
          <div className="col-span-full lg:col-span-6 xl:col-span-12">
            <h2 className="text-h2 text-ink">{home.faqHeading}</h2>
            <p className="mt-8 text-c1 text-ink-secondary">{home.faqIntro}</p>
          </div>
          <dl className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            {firstQuestions.map((item) => (
              <div key={item.question} className="border-t border-line py-16">
                <dt className="text-c1 font-semibold text-ink">{item.question}</dt>
                <dd className="mt-8 text-c1 text-ink-secondary">{item.answer}</dd>
              </div>
            ))}
            <p className="mt-16">
              <MarketLink href={marketHref(locale, "/faq")}>{home.faqMore}</MarketLink>
            </p>
          </dl>
        </div>
      </section>

      {/* The ask. */}
      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-6 xl:col-span-12">{home.ctaHeading}</h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{home.ctaBody}</p>
            <div className="mt-24 flex flex-wrap gap-16">
              <MarketButton href={marketHref(locale, "/contact")}>{home.ctaButton}</MarketButton>
              <MarketButton href={marketHref(locale, "/services")} variant="secondary">
                {copy.nav.services}
              </MarketButton>
            </div>
          </div>
        </div>
      </section>
    </MarketMain>
  );
}
