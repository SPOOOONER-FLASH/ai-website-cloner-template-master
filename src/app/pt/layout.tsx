import type { Metadata } from "next";
import { archivo } from "../fonts";
import "../globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getMenuCategories } from "@/data/categories";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PromoDialog } from "@/components/site/PromoDialog";
import { JsonLd, organisationSchema, websiteSchema } from "@/components/site/JsonLd";
import { Analytics, AnalyticsHead } from "@/components/site/Analytics";
import {
  absoluteUrl,
  defaultDescription,
  defaultTitle,
  indexable,
  siteName,
  siteUrl,
} from "@/data/site";

/**
 * The Portuguese tree.
 *
 * ---------------------------------------------------------------------------
 * `lang="pt-BR"`, NOT `lang="pt"`
 *
 * The market is Brazil. Screen readers pick a voice from this attribute, and a European
 * Portuguese voice reading Brazilian text is the audible version of the vocabulary problem
 * the glossary exists to avoid. It also tells Google which of the two it is looking at,
 * which matters because `pt-PT` and `pt-BR` compete for different result pages.
 *
 * ---------------------------------------------------------------------------
 * THE hreflang SET IS SMALLER THAN THE SPANISH ONE, DELIBERATELY
 *
 * The root of each tree declares its own alternates for `/`. All three homepages exist, so
 * all three are named here. Deeper pages do NOT inherit this — `pageMetadata` asks
 * `mirrorsOf()` per path, because most of the site is English + Spanish and only part of it
 * is Portuguese. A blanket three-way alternate at the layout would advertise Portuguese
 * pages that are not built yet, which is the one hreflang mistake Search Console punishes.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle.pt,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription.pt,
  applicationName: siteName,
  alternates: {
    canonical: "/pt/",
    languages: {
      en: absoluteUrl("/"),
      es: absoluteUrl("/es/"),
      pt: absoluteUrl("/pt/"),
      "x-default": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "pt_BR",
    alternateLocale: ["en", "es"],
    url: absoluteUrl("/pt/"),
    title: defaultTitle.pt,
    description: defaultDescription.pt,
    images: [
      {
        url: absoluteUrl("/images/editorial/home-panic-exit-bars.webp"),
        width: 2400,
        height: 943,
        alt: "Estudo representativo de portas corta-fogo comerciais com barras antipânico à vista",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle.pt,
    description: defaultDescription.pt,
    images: [absoluteUrl("/images/editorial/home-panic-exit-bars.webp")],
  },
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
};

export default function PortugueseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`h-full antialiased ${archivo.variable}`}>
      <head>
        <AnalyticsHead />
        <JsonLd data={organisationSchema()} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <div className="flex min-h-screen flex-col justify-between">
          <SiteHeader categories={getMenuCategories()} />
          {children}
          <SiteFooter />
        </div>
        <PromoDialog />
        <Analytics />
      </body>
    </html>
  );
}
