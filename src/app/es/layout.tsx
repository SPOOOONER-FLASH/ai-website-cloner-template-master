import type { Metadata } from "next";
/* eslint-disable @next/next/no-page-custom-font -- each root document owns the same CDN font link */
import "../globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PromoDialog } from "@/components/site/PromoDialog";
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
    default: defaultTitle.es,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription.es,
  applicationName: siteName,
  alternates: {
    canonical: "/es/",
    languages: {
      en: absoluteUrl("/"),
      es: absoluteUrl("/es/"),
      "x-default": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "es",
    alternateLocale: ["en"],
    url: absoluteUrl("/es/"),
    title: defaultTitle.es,
    description: defaultDescription.es,
    images: [
      {
        url: absoluteUrl("/images/editorial/hero-cultural-entrance.webp"),
        width: 2400,
        height: 943,
        alt: "Entrada arquitectónica de piedra, vidrio y detalles metálicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle.es,
    description: defaultDescription.es,
    images: [absoluteUrl("/images/editorial/hero-cultural-entrance.webp")],
  },
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
};

export default function SpanishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&display=swap"
        />
        <JsonLd data={organisationSchema()} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <div className="flex min-h-screen flex-col justify-between">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <PromoDialog />
      </body>
    </html>
  );
}
