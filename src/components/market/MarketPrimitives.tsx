import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/site/icons";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { absoluteUrl } from "@/data/site";
import type { MarketLocale, MarketPage } from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";
import { MarketFooter, MarketHeader } from "./MarketShell";

/**
 * The link affordance of the market sites: the same chevron as ArrowLink, positioned with
 * logical properties so it sits on the reading side in Arabic and flips to point along the
 * reading direction.
 */
export function MarketLink({
  href,
  children,
  className,
  hrefLang,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Set when the target is in another language, so assistive technology says so. */
  hrefLang?: string;
}) {
  return (
    <Link
      href={href}
      hrefLang={hrefLang}
      lang={hrefLang}
      className={cn(
        "short-marker short-marker-arrow relative inline-block ps-12 text-c1 text-brand no-underline",
        "py-10 sm:py-0",
        "hover:text-brand-hover active:text-brand-active",
        className,
      )}
    >
      <ArrowRightIcon className="absolute start-0 top-[.3rem] h-auto w-8 rtl:rotate-180" />
      <span>{children}</span>
    </Link>
  );
}

export function MarketButton({
  href,
  children,
  variant = "primary",
  hrefLang,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  hrefLang?: string;
}) {
  return (
    <Link
      href={href}
      hrefLang={hrefLang}
      lang={hrefLang}
      className={cn(
        "inline-flex min-h-44 items-center justify-center px-24 py-10 text-c1 no-underline transition-colors",
        variant === "primary"
          ? "bg-brand text-surface hover:bg-brand-hover active:bg-brand-active"
          : "border border-ink text-ink hover:bg-ink hover:text-surface",
      )}
    >
      {children}
    </Link>
  );
}

/** Kicker + H1 + optional lead, on the site's content band. */
export function MarketPageIntro({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="layout">
      <div className="col-content grid grid-cols gap-x gap-y-32">
        <div className="col-span-full lg:col-span-6 xl:col-span-12">
          <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{kicker}</p>
          <h1 className="mt-16 text-h1 text-ink">{title}</h1>
        </div>
        {lead || children ? (
          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            {lead ? <p className="text-c1 text-ink">{lead}</p> : null}
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Breadcrumb trail + BreadcrumbList schema for a market page below the home page. */
export function MarketBreadcrumbs({ locale, page }: { locale: MarketLocale; page: MarketPage }) {
  const copy = marketCopy[locale];
  const label = {
    "/": copy.nav.home,
    "/products": copy.nav.products,
    "/company": copy.nav.company,
    "/services": copy.nav.services,
    "/certifications": copy.nav.certifications,
    "/faq": copy.nav.faq,
    "/contact": copy.nav.contact,
  }[page];
  const items = [
    { name: copy.common.home, url: absoluteUrl(marketHref(locale, "/")) },
    { name: label, url: absoluteUrl(marketHref(locale, page)) },
  ];
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-8 text-c2 text-ink-secondary">
        <Link href={marketHref(locale, "/")} className="short-marker short-marker-compact hover:text-brand-hover">
          {copy.common.home}
        </Link>
        <span aria-hidden="true" className="rtl:rotate-180">
          &gt;
        </span>
        <strong className="font-semibold text-ink">{label}</strong>
      </nav>
    </>
  );
}

/**
 * Header, <main> and footer for one market page. The chrome is rendered here rather than
 * in the layout because the language menu links to THIS page in the other languages, and
 * a server layout does not know which page it is wrapping.
 */
export function MarketMain({
  locale,
  page,
  children,
}: {
  locale: MarketLocale;
  page: MarketPage;
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketHeader locale={locale} page={page} />
      <main id="market-main" className="isolate mt-48 flex-grow justify-self-start lg:mt-96">
        <div className="space-y-96 lg:space-y-136">{children}</div>
      </main>
      <MarketFooter locale={locale} page={page} />
    </>
  );
}
