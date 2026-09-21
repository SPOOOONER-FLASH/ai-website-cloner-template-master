import type { Metadata } from "next";
import { ContactBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { alternatesFor } from "@/data/rayen";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the English tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.zh.contact.title,
  description: STRINGS.zh.contact.intro ?? STRINGS.zh.contact.title,
  alternates: alternatesFor("zh", "/contact/"),
};

export default function Page() {
  return <ContactBody locale="zh" />;
}
