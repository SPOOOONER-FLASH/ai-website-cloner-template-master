import type { Metadata } from "next";
import { QualityBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { alternatesFor } from "@/data/rayen";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the English tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.zh.quality.title,
  description: STRINGS.zh.quality.credentialsNote,
  alternates: alternatesFor("zh", "/quality/"),
};

export default function Page() {
  return <QualityBody locale="zh" />;
}
