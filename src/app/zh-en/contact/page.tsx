import type { Metadata } from "next";
import { ContactBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the Chinese tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.en.contact.title,
  description: STRINGS.en.contact.intro ?? STRINGS.en.contact.title,
  alternates: { canonical: "/en/contact/" },
};

export default function Page() {
  return <ContactBody locale="en" />;
}
