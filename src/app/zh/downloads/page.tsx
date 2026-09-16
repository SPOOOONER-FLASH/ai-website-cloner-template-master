import type { Metadata } from "next";
import { DownloadsBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { absoluteUrl, alternatesFor } from "@/data/rayen";

/*
  Route file only — the page body lives in src/components/rayen/pages.tsx.
*/

export const metadata: Metadata = {
  title: STRINGS.zh.downloads.title,
  description: STRINGS.zh.downloads.intro,
  alternates: alternatesFor("zh", "/downloads/"),
  openGraph: {
    url: absoluteUrl("/downloads/"),
    images: [{ url: absoluteUrl("/images/rayen/catalogue-2026-cover.webp") }],
  },
};

export default function Page() {
  return <DownloadsBody locale="zh" />;
}
