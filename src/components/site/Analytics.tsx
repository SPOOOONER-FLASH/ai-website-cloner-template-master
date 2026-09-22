import Script from "next/script";
import { analytics, indexable } from "@/data/site";

/** Render in each root layout's real head. Moving this node after export breaks React hydration. */
export function AnalyticsHead() {
  if (!indexable || !analytics.gtmId) return null;
  return <script dangerouslySetInnerHTML={{
    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analytics.gtmId}');`,
  }} />;
}

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

  const { ga4Id, clarityId, gtmId } = analytics;

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

      {/*
        GOOGLE TAG MANAGER — a real inline <script> in the served HTML, not next/script.

        It was next/script with strategy="afterInteractive" for exactly one day. That
        renders the loader CLIENT-SIDE, after hydration, so the snippet never appears in
        the HTML the server sends: on 2026-09-21 the only occurrence of the container ID
        in the live homepage was the <noscript> iframe below. Real browsers still loaded
        GTM, but Google's own installation test fetches the document and greps it, so it
        reported "Your Google tag wasn't detected" — for the apex domain as well as www.

        THE PERFORMANCE REASON GIVEN FOR afterInteractive WAS WRONG, and is written down
        here so it is not repeated. GTM's stub sets `j.async = true` itself. What goes
        into the document is ~500 bytes costing about a millisecond to parse; the gtm.js
        download was always asynchronous. That is not the same thing as a synchronous
        third-party `<script src>`, which is what the earlier note argued against. The
        GA4 note above is about a real preload in the head and still stands — these two
        cases look alike and are not.

        GA4 and Clarity are still loaded directly, so this container holds neither. If a
        GA4 tag is ever added inside it, delete ga4Id in src/data/site.ts in the same
        change: two loaders double every session, and doubled numbers look like growth.
      */}
      {gtmId ? (
        <>
          {/* The loader is AnalyticsHead; only the no-JavaScript fallback belongs in the body. */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
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
