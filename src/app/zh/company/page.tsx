import type { Metadata } from "next";
import { CompanyBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { alternatesFor } from "@/data/rayen";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the English tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.zh.company.title,
  description: STRINGS.zh.company.body[0],
  alternates: alternatesFor("zh", "/company/"),
};

export default function Page() {
  return <CompanyBody locale="zh" />;
}
