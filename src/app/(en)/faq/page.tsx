import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FaqPage as LocaleFaqPage } from "@/components/locale-pages/FaqPage";

export const metadata: Metadata = pageMetadata({
  enPath: "/faq",
  locale: "en",
  title: "Frequently asked questions",
  description:
    "Ordering, samples, lead times, finishes, master key systems, certification and export questions for Canton Hyland door hardware.",
});

/**
 * The FAQ. Two jobs, both of which matter more here than on a consumer site: it answers the
 * questions that otherwise arrive as an email a salesperson has to write out again, and it is
 * the site's real long-tail search surface. Since 2026-10-13 English renders the same component
 * as the other nine locales (src/components/locale-pages/FaqPage.tsx).
 */
export default function FaqPage() {
  return <LocaleFaqPage locale="en" />;
}
