import type { Metadata } from "next";
import { OemBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the Chinese tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.en.oem.title,
  description: STRINGS.en.oem.intro ?? STRINGS.en.oem.title,
  alternates: { canonical: "/en/oem/" },
};

export default function Page() {
  return <OemBody locale="en" />;
}
