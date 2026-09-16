import type { Metadata } from "next";
import { OemBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { alternatesFor } from "@/data/rayen";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the English tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.zh.oem.title,
  description: STRINGS.zh.oem.intro ?? STRINGS.zh.oem.title,
  alternates: alternatesFor("zh", "/oem/"),
};

export default function Page() {
  return <OemBody locale="zh" />;
}
