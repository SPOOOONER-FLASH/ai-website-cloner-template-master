import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { NewsListing } from "@/components/site/NewsListing";

export const metadata: Metadata = pageMetadata({
  enPath: "/news",
  locale: "en",
  title: "News + Press",
  description:
    "Company announcements, certification news and technical notes from Canton Hyland, manufacturer of panic exit devices and architectural door hardware.",
});

export default function NewsPage() {
  return <NewsListing />;
}
