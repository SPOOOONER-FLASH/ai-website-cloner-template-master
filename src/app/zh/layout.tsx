import type { Metadata } from "next";
import { archivo } from "../fonts";
import "./rayen.css";
import { absoluteUrl, legalName, rayen, siteName, siteUrl, siteVerification } from "@/data/rayen";

/**
 * Root layout for the RAYEN 雷茵 Chinese site.
 *
 * This is a THIRD root layout alongside src/app/(en) and src/app/es — the pattern
 * next.config.ts already documents under `experimental.globalNotFound`. It renders its
 * own <html lang="zh-Hans">, imports its own stylesheet, and shares nothing with the HYDE
 * chrome, so a change here cannot reach cantonlock.com and vice versa.
 *
 * It carries no hreflang. /zh is not a translation of the English site: it is a different
 * company's site that happens to be built from the same catalogue, and telling Google
 * these are language alternates of each other would be a claim about corporate identity
 * that is not true.
 */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${legalName} | 机械门锁与门控五金制造`,
    template: `%s | ${siteName}`,
  },
  description: rayen.brand.positioning,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    locale: "zh_CN",
    url: siteUrl,
    title: `${legalName} | 机械门锁与门控五金制造`,
    description: rayen.brand.positioning,
    images: [{ url: absoluteUrl("/images/rayen/factory-press-hall-wide.webp") }],
  },
  /*
    Indexable since 2026-09-16, because the site is on its own domain.

    It was noindex for as long as RAYEN lived on a preview subdomain of stahlock.com — an
    unrelated export brand — because indexing the factory's own name under somebody else's
    hostname produces results that outlive the preview.

    THE NOTE HERE USED TO SAY "it is the single switch". IT WAS NOT.
    There were two: this meta tag, and the robots.txt written by scripts/build-rayen-site.mjs.
    On 2026-09-15 only robots.txt was flipped, which changed nothing a crawler acts on —
    a noindex meta overrides a permissive robots.txt, and all 418 pages kept carrying
    "noindex, nofollow" while the deploy notes recorded the indexing block as fixed. Anyone
    adding a third gate should add it to this list rather than to their memory.
  */
  robots: { index: true, follow: true },
  verification: { other: siteVerification },
};

export default function RayenRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" className={`h-full antialiased ${archivo.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
