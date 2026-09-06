import type { Metadata } from "next";
import { archivo } from "../fonts";
import "./rayen.css";
import { absoluteUrl, legalName, rayen, siteName, siteUrl } from "@/data/rayen";

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
    noindex while the site lives on the temporary preview host.
    spoonercantonlock.stahlock.com is a subdomain of an unrelated export brand; letting
    Google index RAYEN's pages there would put the wrong hostname in the results for the
    factory's own name, and those results outlive the preview. Flip this when the real
    domain is live — it is the single switch, and CLIENT-RUNBOOK says so.
  */
  robots: { index: false, follow: false },
};

export default function RayenRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" className={`h-full antialiased ${archivo.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
