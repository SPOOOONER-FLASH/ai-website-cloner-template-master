import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd, organisationSchema, websiteSchema } from "@/components/site/JsonLd";
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
        url: absoluteUrl("/images/company/hero-modern-tubular-lock.webp"),
        width: 1920,
        height: 754,
        alt: "Canton Hyland door hardware",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  // Driven by the single `indexable` flag in src/data/site.ts, not hard-coded here.
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
};

export default function RootLayout({
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
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
