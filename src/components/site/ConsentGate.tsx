"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { localeFromPath } from "@/data/locales";
import { LOCALE_DIR, LOCALE_TAG } from "@/lib/i18n-core";
import { CONSENT_COPY, privacyHref } from "@/lib/consent-copy";
import {
  analyticsCookieNames,
  CONSENT_EVENT,
  CONSENT_KEY,
  CONSENT_OPEN_EVENT,
  initialConsent,
  parseChoice,
  serialiseChoice,
  type ConsentChoice,
  type ConsentScope,
  type ConsentState,
} from "@/lib/consent";
import { Button } from "./Button";

interface Props {
  ga4Id: string;
  clarityId: string;
  scope: ConsentScope;
}

/** Delete GA4 and Clarity cookies on this host and on the registrable domain they use. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const name of analyticsCookieNames(document.cookie)) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * GA4 and Clarity, loaded only once the visitor's answer allows it (src/lib/consent.ts).
 *
 * Nothing here is in the exported HTML: the decision needs the browser's storage and time
 * zone, so the first server-rendered frame has no banner and no tag. The banner is fixed to
 * the bottom edge, so arriving after hydration moves nothing (no layout shift), and it is
 * one line on desktop and three on a phone, small enough never to be the LCP element.
 * The tags keep `lazyOnload`: once consent exists they start after window load exactly as
 * before (see the notes in Analytics.tsx).
 */
export function ConsentGate({ ga4Id, clarityId, scope }: Props) {
  const pathname = usePathname();
  const [state, setState] = useState<ConsentState | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // In a timeout, not the effect body: a synchronous setState here cascades a render
    // (the same reason as LanguageSuggestion and PromoDialog).
    const timer = window.setTimeout(() => {
      let stored: ConsentChoice | null = null;
      try {
        stored = parseChoice(window.localStorage.getItem(CONSENT_KEY));
      } catch {
        /* Blocked storage: no remembered answer, so Europe is asked again on each page. */
      }
      let timeZone: string | undefined;
      try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch {
        /* Unknown zone: consentRequired treats it as Europe. */
      }
      const next = initialConsent(stored, timeZone, scope);
      setState(next);
      setOpen(next === "ask");
    }, 0);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, [scope]);

  function choose(choice: ConsentChoice) {
    try {
      window.localStorage.setItem(CONSENT_KEY, serialiseChoice(choice));
    } catch {
      /* Nothing to persist to. The answer still holds for this page view. */
    }
    setOpen(false);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
    if (choice === "denied" && state === "granted") {
      // The tags are already running in this page. Clear what they wrote and start clean,
      // rather than trusting two vendors' runtime off-switches to agree with each other.
      clearAnalyticsCookies();
      window.location.reload();
      return;
    }
    setState(choice);
  }

  const locale = localeFromPath(pathname ?? "/");
  const copy = CONSENT_COPY[locale];

  return (
    <>
      {state === "granted" && ga4Id ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="lazyOnload" />
          <Script id="ga4-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}
      {state === "granted" && clarityId ? (
        <Script id="clarity-init" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}
      {open ? (
        <section
          role="region"
          aria-label={copy.settings}
          lang={LOCALE_TAG[locale]}
          dir={LOCALE_DIR[locale]}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface"
        >
          <div className="layout">
            <div className="col-content flex flex-col gap-12 py-16 md:flex-row md:items-center md:justify-between md:gap-32">
              <p className="text-c2 text-ink">
                {copy.message}{" "}
                <a href={privacyHref(locale)} className="text-brand underline hover:text-brand-hover">
                  {copy.privacy}
                </a>
              </p>
              <div className="flex shrink-0 gap-12">
                <Button variant="secondary" onClick={() => choose("denied")}>
                  {copy.decline}
                </Button>
                <Button variant="secondary" onClick={() => choose("granted")}>
                  {copy.accept}
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** The footer's way back to the banner, so an answer can be changed on any page. */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="short-marker short-marker-compact cursor-pointer text-c1 text-brand hover:text-brand-hover"
    >
      {label}
    </button>
  );
}
