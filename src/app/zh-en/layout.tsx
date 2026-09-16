import type { Metadata } from "next";
import { archivo } from "../fonts";
import "../zh/rayen.css";
import { absoluteUrl, legalName, rayen, siteName, siteUrl } from "@/data/rayen";
import { htmlLang } from "@/data/rayen-i18n";

/**
 * Root layout for the RAYEN English site (/en/ on the deployed host).
 *
 * A FOURTH root layout, beside (en), es and zh. It exists rather than nesting under
 * src/app/zh because <html lang> can only be set by a root layout, and an English page
 * inheriting lang="zh-Hans" is wrong for every screen reader and every search engine.
 * scripts/build-rayen-site.mjs lifts out/zh-en into out-rayen/en.
 *
 * This is a THIRD root layout alongside src/app/(en) and src/app/es — the pattern
 * next.config.ts already documents under `experimental.globalNotFound`. It renders its
 * own <html lang="en">, imports its own stylesheet, and shares nothing with the HYDE
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
    default: `${legalName} | Door hardware, made in Zhongshan`,
    template: `%s | ${siteName}`,
  },
  description: rayen.brand.positioningEn,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    locale: "en",
    url: siteUrl,
    title: `${legalName} | Door hardware, made in Zhongshan`,
    description: rayen.brand.positioningEn,
    images: [{ url: absoluteUrl("/images/rayen/factory-press-hall-wide.webp") }],
  },
  /*
    Indexable since 2026-09-16 — the English half of the same switch described in
    src/app/zh/layout.tsx. Both locales flip together: indexing one language and not the
    other leaves half a bilingual site invisible while its hreflang points at it.
  */
  robots: { index: true, follow: true },
};

export default function RayenEnRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // htmlLang.en, not a literal: the whole reason this fourth root layout exists is the
  // lang attribute, and it shipped as zh-Hans once already (2026-09-10, caught in the
  // export, not in review). src/lib/rayen-paths.test.ts now fails if it drifts back.
  return (
    <html lang={htmlLang.en} className={`h-full antialiased ${archivo.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
