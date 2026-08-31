import type { Metadata } from "next";
/* eslint-disable @next/next/no-page-custom-font -- global 404 bypasses both root layouts */
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getMenuCategories } from "@/data/categories";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ArrowLink } from "@/components/site/ArrowLink";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Canton Hyland" },
  description: "The requested Canton Hyland page does not exist.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <div className="flex min-h-screen flex-col justify-between">
          <SiteHeader categories={getMenuCategories()} />
          <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
            <div className="layout">
              <div className="col-content grid w-full grid-cols gap-x gap-y-24">
                <div className="col-span-full xl:col-span-12">
                  <h1 className="text-h1 text-ink">
                    404
                    <br />
                    <span className="text-h1-light">This page does not exist</span>
                  </h1>
                </div>
                <div className="col-span-full xl:col-span-12">
                  <p className="text-c1 text-ink">
                    The address may be mistyped, or the page may have moved. The product
                    catalogue is the best place to start.
                  </p>
                  <div className="mt-48 flex flex-col gap-24 sm:flex-row sm:gap-64">
                    <ArrowLink href="/">Back to the homepage</ArrowLink>
                    <ArrowLink href="/products">Product catalogue</ArrowLink>
                    <ArrowLink href="/contact">Contact us</ArrowLink>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
