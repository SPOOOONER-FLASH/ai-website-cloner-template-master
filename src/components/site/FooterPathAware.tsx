"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { mirrorHref } from "@/lib/spanish-mirror";
import { englishPathOf, locales, type Locale } from "@/data/locales";
import { LANGUAGE_LABELS } from "@/lib/i18n-client";

/**
 * The two parts of SiteFooter that depend on the current URL. Everything else in the
 * footer is a server component (2026-09-28); these islands are the only footer code that
 * ships to the browser.
 */

const strip = (value: string) => value.replace(/\/*$/, "") || "/";

/**
 * A footer link to the page you are already on is a dead click (see SiteFooter.tsx), so
 * on that page the server-rendered `current` span replaces the server-rendered link.
 * Both are passed in pre-rendered; this island only chooses.
 */
export function FooterCurrentLink({
  href,
  current,
  children,
}: {
  href: string;
  current: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return <>{strip(href) === strip(pathname) ? current : children}</>;
}

/**
 * One anchor per OTHER locale, pointing at this page's counterpart — the only rendered
 * links between the language trees. The reasoning is at the call site in SiteFooter.tsx.
 */
export function FooterLanguageLinks({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const englishPath = englishPathOf(pathname);

  return (
    <>
      {locales
        .filter((code) => code !== locale)
        .map((code) => (
          <li key={code} className="col-span-2 md:col-span-3">
            <Link
              href={mirrorHref(englishPath, code).href}
              hrefLang={code}
              lang={code}
              className="short-marker short-marker-compact inline-flex min-h-24 items-center text-c1 text-brand no-underline hover:text-brand-hover"
            >
              {LANGUAGE_LABELS[code]}
            </Link>
          </li>
        ))}
    </>
  );
}
