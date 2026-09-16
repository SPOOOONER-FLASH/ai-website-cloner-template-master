import type { Metadata } from "next";
import { HomeBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { alternatesFor, legalName, rayen } from "@/data/rayen";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the English tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: { absolute: `${legalName} | ${STRINGS.zh.home.title}` },
  description: rayen.brand.positioning,
  alternates: alternatesFor("zh", "/"),
};

export default function Page() {
  return <HomeBody locale="zh" />;
}
