import type { Metadata } from "next";
import { archivo } from "../fonts";
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
        url: absoluteUrl("/images/editorial/home-panic-exit-bars.webp"),
        width: 2400,
        height: 943,
        alt: "Estudio representativo de puertas cortafuego comerciales con barras antipánico visibles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle.es,
    description: defaultDescription.es,
    images: [absoluteUrl("/images/editorial/home-panic-exit-bars.webp")],
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
    <html lang="es" suppressHydrationWarning className={`h-full antialiased ${archivo.variable}`}>
      <head>
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
