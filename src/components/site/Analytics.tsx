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
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
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
