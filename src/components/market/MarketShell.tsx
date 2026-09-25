import Link from "next/link";
import { EmailLink } from "@/components/site/EmailLink";
import { GlobeIcon, HydeLockup } from "@/components/site/icons";
import { siteSettings } from "@/data/navigation";
import { legalName, locales, type Locale } from "@/data/site";
import { hasPortugueseMirror, hasSpanishMirror } from "@/lib/spanish-mirror";
import {
  marketLocaleMeta,
  marketLocales,
  type MarketLocale,
  type MarketPage,
} from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";

/**
 * The chrome of a market landing site: a seven-link header with a language menu, and a
 * footer that says plainly where the rest of the site is.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT SiteHeader / SiteFooter
 *
 * Those two render the whole catalogue: the mega-menu with seventeen categories and
 * their sub-collections, the search dialog, the shelf links, the promo dialog. Every label
 * in them is a `Record<Locale, …>` keyed on the three FULL locales, and every link in them
 * goes through `localisedHref`, which for a market locale would eject the reader into the
 * English tree from the first click. A market site has seven pages; its chrome should
 * offer seven links and say, in the reader's language, that the catalogue behind them is
 * in English.
 *
 * ---------------------------------------------------------------------------
 * RTL
 *
 * Arabic renders under `dir="rtl"` on <html>. Everything here uses logical properties
 * (ms-/me-/ps-/pe-/start/end) so the same markup lays out mirrored, and the one glyph with
 * a direction — the chevron on links — flips with `rtl:rotate-180`.
 */
const NAV_ORDER: readonly { page: MarketPage; key: keyof MarketCopyNav }[] = [
  { page: "/products", key: "products" },
  { page: "/company", key: "company" },
  { page: "/services", key: "services" },
  { page: "/certifications", key: "certifications" },
  { page: "/faq", key: "faq" },
  { page: "/contact", key: "contact" },
];

type MarketCopyNav = (typeof marketCopy)[MarketLocale]["nav"];

const FULL_LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

/** Every language this page exists in, for the header menu. Never a 404 out of a menu. */
export function marketLanguageLinks(locale: MarketLocale, page: MarketPage) {
  const clean = page === "/" ? "" : page;
  const full = locales.map((code) => {
    const exists =
      code === "en" ||
      (code === "es" && hasSpanishMirror(page)) ||
      (code === "pt" && hasPortugueseMirror(page));
    const href = code === "en" ? `${clean}/` || "/" : exists ? `/${code}${clean}/` : `/${code}/`;
    return { code, label: FULL_LOCALE_LABELS[code], href, current: false };
  });
  const market = marketLocales.map((code) => ({
    code,
    label: marketLocaleMeta[code].label,
    href: marketHref(code, page),
    current: code === locale,
  }));
  return [...full, ...market];
}

export function MarketHeader({ locale, page }: { locale: MarketLocale; page: MarketPage }) {
  const copy = marketCopy[locale];
  const languages = marketLanguageLinks(locale, page);

  return (
    <header className="border-b border-line bg-surface">
      <a
        href="#market-main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-16 focus:top-16 focus:z-50 focus:bg-surface focus:px-12 focus:py-8 focus:text-c2 focus:text-ink"
      >
        {copy.nav.skipToContent}
      </a>
      <div className="layout py-16 lg:py-20">
        <div className="col-content flex flex-wrap items-center gap-x-32 gap-y-12">
          <Link href={marketHref(locale, "/")} aria-label={copy.nav.home} className="me-auto no-underline">
            <HydeLockup className="h-28" />
          </Link>

          <nav aria-label={copy.nav.ariaMain} className="order-3 w-full lg:order-2 lg:w-auto">
            <ul className="flex flex-wrap gap-x-24 gap-y-8 text-c2">
              {NAV_ORDER.map(({ page: target, key }) => (
                <li key={target}>
                  <Link
                    href={marketHref(locale, target)}
                    aria-current={target === page ? "page" : undefined}
                    className={[
                      "short-marker short-marker-compact no-underline transition-colors",
                      target === page ? "font-semibold text-ink" : "text-ink-secondary hover:text-brand-hover",
                    ].join(" ")}
                  >
                    {copy.nav[key]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products/"
                  hrefLang="en"
                  lang="en"
                  className="short-marker short-marker-compact text-ink-secondary no-underline hover:text-brand-hover"
                >
                  {copy.nav.englishCatalog}
                </Link>
              </li>
            </ul>
          </nav>

          {/*
            A <details> element, not a client component: it opens and closes without a
            script, keyboard and screen-reader behaviour come from the browser, and the
            ten languages are in the server-rendered HTML — which is what lets a crawler
            find the other nine trees from any one of them.
          */}
          <details className="group relative order-2 lg:order-3">
            <summary className="flex cursor-pointer list-none items-center gap-8 text-c2 text-ink [&::-webkit-details-marker]:hidden">
              <GlobeIcon className="h-20 w-20 text-ink-tertiary" />
              <span>{marketLocaleMeta[locale].label}</span>
            </summary>
            <ul
              aria-label={copy.nav.languages}
              className="absolute end-0 top-full z-40 mt-8 min-w-[16rem] border border-line bg-surface p-8 shadow-sm"
            >
              {languages.map((language) => (
                <li key={language.code}>
                  {language.current ? (
                    <span aria-current="true" className="block px-12 py-8 text-c2 font-semibold text-ink">
                      {language.label}
                    </span>
                  ) : (
                    <Link
                      href={language.href}
                      hrefLang={language.code}
                      lang={language.code}
                      className="block px-12 py-8 text-c2 text-ink-secondary no-underline hover:bg-line hover:text-ink"
                    >
                      {language.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

export function MarketFooter({ locale, page }: { locale: MarketLocale; page: MarketPage }) {
  const copy = marketCopy[locale];
  const languages = marketLanguageLinks(locale, page);
  const contact = siteSettings.contact;
  const mailboxes = [
    { address: contact.technicalEmail, label: copy.footer.technicalMail },
    { address: contact.email, label: copy.footer.ordersMail },
    { address: contact.brandEmail, label: copy.footer.brandMail },
  ].filter((row): row is { address: string; label: string } => Boolean(row.address));

  return (
    <footer className="mt-96 border-t border-line py-48 lg:mt-136">
      <div className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-40">
          <div className="col-span-full md:col-span-6 xl:col-span-10">
            <HydeLockup className="h-24" />
            <p className="mt-16 text-c2 text-ink">{legalName}</p>
            <p className="mt-4 text-c2 text-ink-secondary">{copy.footer.factoryLine}</p>
            <p className="mt-16 max-w-[52ch] text-c2 text-ink-secondary">{copy.footer.englishSiteNote}</p>
            <Link
              href="/"
              hrefLang="en"
              lang="en"
              className="short-marker short-marker-compact mt-8 inline-block text-c2 text-brand no-underline hover:text-brand-hover"
            >
              {copy.footer.englishSiteLink}
            </Link>
          </div>

          <div className="col-span-full md:col-span-6 xl:col-span-7">
            <h2 className="drawer-eyebrow">{copy.footer.writeToUs}</h2>
            <dl className="mt-12 space-y-12">
              {mailboxes.map((row) => (
                <div key={row.address}>
                  <dt className="text-c2 text-ink-secondary">{row.label}</dt>
                  <dd>
                    <EmailLink address={row.address} className="text-c1 text-brand hover:text-brand-hover" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-full md:col-span-12 xl:col-span-7">
            <h2 className="drawer-eyebrow">{copy.nav.languages}</h2>
            <ul className="mt-12 flex flex-wrap gap-x-20 gap-y-8 text-c2">
              {languages.map((language) =>
                language.current ? (
                  <li key={language.code} aria-current="true" className="font-semibold text-ink">
                    {language.label}
                  </li>
                ) : (
                  <li key={language.code}>
                    <Link
                      href={language.href}
                      hrefLang={language.code}
                      lang={language.code}
                      className="short-marker short-marker-compact text-ink-secondary no-underline hover:text-brand-hover"
                    >
                      {language.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <p className="col-span-full border-t border-line pt-24 text-c2 text-ink-secondary">
            {siteSettings.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
