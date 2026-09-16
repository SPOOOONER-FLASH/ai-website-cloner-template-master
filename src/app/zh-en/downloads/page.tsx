import type { Metadata } from "next";
import { DownloadsBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { absoluteUrl, alternatesFor } from "@/data/rayen";

/*
  Route file only — the page body lives in src/components/rayen/pages.tsx.
*/

export const metadata: Metadata = {
  title: STRINGS.en.downloads.title,
  description: STRINGS.en.downloads.intro,
  alternates: alternatesFor("en", "/downloads/"),
  openGraph: {
    url: absoluteUrl("/en/downloads/"),
    images: [{ url: absoluteUrl("/images/rayen/catalogue-2026-cover.webp") }],
  },
};

export default function Page() {
  return <DownloadsBody locale="en" />;
}
