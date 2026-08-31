import type { Metadata } from "next";
/* eslint-disable @next/next/no-page-custom-font -- each root document owns the same CDN font link */
import "../globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getMenuCategories } from "@/data/categories";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PromoDialog } from "@/components/site/PromoDialog";
import { JsonLd, organisationSchema, websiteSchema } from "@/components/site/JsonLd";
import { Analytics } from "@/components/site/Analytics";
import {
  absoluteUrl,
  defaultDescription,
  defaultTitle,
  indexable,
  siteName,
  siteUrl,
} from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle.en,
    // Page titles supply only their own name; the brand suffix is appended here so it
    // can never drift between pages.
    template: `%s | ${siteName}`,
  },
  description: defaultDescription.en,
  applicationName: siteName,
  alternates: {
    canonical: "/",
    languages: {
      en: absoluteUrl("/"),
      es: absoluteUrl("/es/"),
      "x-default": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en",
    alternateLocale: ["es"],
    url: absoluteUrl("/"),
    title: defaultTitle.en,
    description: defaultDescription.en,
    images: [
      {
        url: absoluteUrl("/images/editorial/home-panic-exit-bars.webp"),
        width: 2400,
        height: 943,
        alt: "Representative commercial fire-exit doors with visible panic push bars",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle.en,
    description: defaultDescription.en,
    images: [absoluteUrl("/images/editorial/home-panic-exit-bars.webp")],
  },
  // Driven by the single `indexable` flag in src/data/site.ts, not hard-coded here.
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
};

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/* [SUB] Archivo via the Google Fonts CDN, replacing the target's licensed
            Trade Gothic Next LT Pro (body) and Traffic (H1). Weights 400/600/700. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&display=swap"
        />
        {/* Organisation + WebSite schema, emitted once site-wide. Page-level schema
            (Product, BreadcrumbList, ItemList) is added by the individual pages. */}
        <JsonLd data={organisationSchema()} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        {/* Site chrome lives here so every route gets it. Each page supplies its own
            <main>, because the homepage's top margin and rhythm are page-specific. */}
        <div className="flex min-h-screen flex-col justify-between">
          <SiteHeader categories={getMenuCategories()} />
          {children}
          <SiteFooter />
        </div>
        {/* Last in the body so it cannot appear above the page's own content in the
            reading order before a visitor has even seen the page. */}
        <PromoDialog />
        <Analytics />
      </body>
    </html>
  );
}
