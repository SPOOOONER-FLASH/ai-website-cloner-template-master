"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { locales, localeFromPath, type Locale } from "@/data/locales";
import { languageChoices } from "@/lib/language-choices";
import { LOCALE_DIR, LOCALE_TAG } from "@/lib/i18n-client";

/**
 * A one-line notice offering the page in the reader's own language.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A LINE AND NOT THE PANEL THE CLIENT ASKED ABOUT
 *
 * The reference shown on 2026-09-28 was BWT's opening dialog: a country dropdown over the
 * hero that a first-time visitor must answer before seeing anything. It is the right
 * control for BWT and the wrong one here, for one structural reason. BWT runs separate
 * COUNTRY sites with different ranges, distributors and prices, so the country a visitor
 * picks decides what they are even allowed to buy. HYDE publishes one catalogue in ten
 * languages: a German buyer and an Austrian buyer get identical products, and only the
 * words differ. A dialog would charge a click and return nothing.
 *
 * It would also work against the rest of the site. Google has treated content covered by a
 * dialog on entry as an intrusive interstitial since 2017, and this site spends real effort
 * on hreflang, llms.txt and structured data to be found in ten languages. Most B2B arrivals
 * land on a deep product page from search or Alibaba, not the home page, so a home-page gate
 * misses the majority and delays the rest.
 *
 * What is left worth solving is the narrow case the dialog was aimed at: somebody whose
 * browser says German is reading the English page. That is one sentence, once, dismissible.
 *
 * ---------------------------------------------------------------------------
 * IT ONLY SPEAKS WHEN IT CAN TELL THE TRUTH
 *
 * `languageChoices` already knows whether THIS page exists in the other language, and the
 * bar shows only when `samePage` is true. When the answer would be "that language has a
 * home page, good luck", it says nothing instead. Same rule as the hreflang policy next
 * door: a link that does not land where it claims is worse than no link.
 *
 * ---------------------------------------------------------------------------
 * THE LAYOUT SHIFT, STATED HONESTLY
 *
 * This sits in normal flow above the sticky header, so when it appears after hydration the
 * page below moves down by its height. That is a real CLS contribution, about 0.05 on a
 * 900px viewport, and it is paid ONLY by the visitors who see the bar: a reader whose
 * browser language already matches the page never renders it.
 *
 * The alternatives were worse. Fixed to the bottom collides with the promotional rail,
 * which already owns `bottom-16` there. Pre-rendering all ten candidate lines and letting a
 * blocking script reveal one puts nine misleading "this page is also available in…"
 * sentences into the markup of every page for crawlers to read. Reserving the space for
 * everybody spends it on the majority who never need it. A shift of one line, for the
 * minority it helps, is the cheapest of the four.
 */

/*
  The reader is not reading the page's language yet — that is the whole premise — so every
  string here is in the language being OFFERED. The dismiss control is named by its action
  rather than a bare ×, which has no accessible name.

  One link carrying the whole offer, not a sentence plus a separate link. The first version
  said "Diese Seite ist auch auf Deutsch verfügbar." and then linked "Auf Deutsch ansehen",
  which is the same fact twice and wrapped to three lines and 108px on a 375px phone — an
  eighth of the viewport spent above the hero, on a notice. As one link it is 50px in German,
  Russian and Japanese alike, and says no less.
*/
const OFFER: Record<Locale, { view: string; dismiss: string }> = {
  en: { view: "View this page in English", dismiss: "Dismiss" },
  es: { view: "Ver esta página en español", dismiss: "Cerrar" },
  pt: { view: "Ver esta página em português", dismiss: "Fechar" },
  fr: { view: "Voir cette page en français", dismiss: "Fermer" },
  de: { view: "Diese Seite auf Deutsch ansehen", dismiss: "Schließen" },
  ja: { view: "このページを日本語で見る", dismiss: "閉じる" },
  ko: { view: "이 페이지를 한국어로 보기", dismiss: "닫기" },
  tr: { view: "Bu sayfayı Türkçe görüntüle", dismiss: "Kapat" },
  ru: { view: "Открыть эту страницу на русском", dismiss: "Закрыть" },
  ar: { view: "عرض هذه الصفحة بالعربية", dismiss: "إغلاق" },
};

const DISMISSED_KEY = "hyde.language-suggestion.dismissed";

/**
 * The first language the reader asked for that this site actually publishes.
 *
 * `navigator.languages` is in the reader's own order of preference, so the first match wins
 * rather than the best match: somebody whose list is [zh-CN, en] does not read Chinese here,
 * and English is genuinely their next choice. Region subtags are dropped — pt-BR and pt-PT
 * both reach the Portuguese site, which is the only Portuguese there is.
 */
function preferredLocale(requested: readonly string[]): Locale | null {
  for (const tag of requested) {
    const base = tag.toLowerCase().split("-")[0];
    const match = (locales as readonly string[]).find((code) => code === base);
    if (match) return match as Locale;
  }
  return null;
}

export function LanguageSuggestion() {
  const pathname = usePathname();
  /*
    Null until the effect has run. Nothing is rendered on the server or on the first client
    paint, so there is no hydration mismatch to suppress and no flash of a bar that the
    reader's own language would have removed a frame later.
  */
  const [offer, setOffer] = useState<{ locale: Locale; href: string } | null>(null);

  useEffect(() => {
    /*
      The decision runs in a timeout rather than in the effect body, for the reason
      PromoDialog states next door: setting state synchronously inside an effect cascades a
      render, and the lint rule refuses it.

      A timeout and not requestAnimationFrame, which was the first version. rAF does not run
      in a hidden tab, so a page opened in a background tab — the normal way a buyer opens
      three product pages at once — reached the reader with no bar until they focused it.
    */
    const timer = window.setTimeout(() => {
      let dismissed = false;
      try {
        dismissed = window.localStorage.getItem(DISMISSED_KEY) === "1";
      } catch {
        /* Private windows and blocked site data throw on read. Treat it as "not dismissed". */
      }
      if (dismissed) return;

      const current = localeFromPath(pathname);
      const wanted = preferredLocale(navigator.languages ?? [navigator.language]);
      if (!wanted || wanted === current) return;

      /* One function decides this, the footer's anchors and the locale panel. */
      const choice = languageChoices(pathname, current).find((c) => c.code === wanted);
      if (!choice || !choice.samePage) return;

      setOffer({ locale: wanted, href: choice.href });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!offer) return null;

  const copy = OFFER[offer.locale];

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* Nothing to persist to. The bar still closes for this page view. */
    }
    setOffer(null);
  }

  return (
    <aside
      lang={LOCALE_TAG[offer.locale]}
      dir={LOCALE_DIR[offer.locale]}
      className="border-b border-line bg-surface-alt"
    >
      {/*
        `.layout` is the named-line grid, not a container: its direct children sit on the
        content band. The flex row has to be that child, not the grid itself — putting both
        on one element overrides `display: grid` and drops the row out of the column system,
        which squeezed this bar to 63px wide and 258px tall.
      */}
      <div className="layout">
        <div className="col-content flex flex-wrap items-center justify-between gap-x-24 gap-y-8 py-12">
          <Link
            href={offer.href}
            hrefLang={LOCALE_TAG[offer.locale]}
            className="short-marker short-marker-compact text-c1 text-brand no-underline hover:text-brand-hover"
          >
            {copy.view}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="short-marker short-marker-compact cursor-pointer text-c1 text-ink-secondary transition-colors hover:text-ink"
          >
            {copy.dismiss}
          </button>
        </div>
      </div>
    </aside>
  );
}
