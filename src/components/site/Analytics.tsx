import Script from "next/script";
import { analytics, indexable } from "@/data/site";

/**
 * Google Analytics 4 and Microsoft Clarity.
 *
 * Both are loaded with `strategy="afterInteractive"` — after hydration, never blocking
 * first paint. Buyers reach this site over a long link from South America; analytics
 * must not compete with the product photograph for that first second.
 *
 * Gated on `indexable` so a staging host never pollutes the production property with
 * its own traffic. That has bitten this project before in the other direction: the
 * previous site ran GA on a domain nobody looked at.
 *
 * IDs live in src/data/site.ts, not here, so the CMS-facing config stays in one file.
 *
 * Cookies: GA4 sets its own; Clarity does not set a cookie for the session recording
 * itself. If a consent banner is added later it must gate THIS component, not the
 * individual calls, or the tags will already have fired by the time consent is asked.
 */
export function Analytics() {
  if (!indexable) return null;

  const { ga4Id, clarityId } = analytics;

  return (
    <>
      {ga4Id ? (
        <>
          {/*
            `lazyOnload` rather than `afterInteractive`, 2026-09-14, for one specific
            reason visible in the built HTML.

            `afterInteractive` makes Next emit `<link rel="preload" as="script">` for the
            tag in the document head. That is a third-party fetch — DNS, TLS and ~90KB
            from googletagmanager.com — given raised priority in exactly the window where
            the phone is fetching the hero photograph. The homepage also preloads three
            images at `fetchPriority="high"`, so on a mobile connection the analytics tag
            competes with the thing the Largest Contentful Paint is measured on.

            `lazyOnload` drops the preload and starts the fetch after window load. The
            same events are collected; they are collected slightly later.

            ⚠ THE TRADE, STATED. A visitor who leaves before `load` fires is now missed by
            GA4 where they were previously counted. That is a real cost — the client reads
            these sessions — and it is accepted because a session that short carries no
            information about the catalogue anyway, while the LCP it was competing with is
            what every other visitor waits on. If the client wants those sessions back,
            change this one word and the preload returns with them.
          */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}

      {clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}
    </>
  );
}
