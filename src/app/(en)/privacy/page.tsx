import type { Metadata } from "next";
import { PrivacyPolicy } from "@/components/site/PrivacyPolicy";
import { privacyCopy } from "@/data/privacy-policy";
import { pageMetadata } from "@/lib/seo";

/** Hand-written, English and German only (PARTIAL_ROUTES in src/lib/spanish-mirror.ts). */
const copy = privacyCopy("en");

export const metadata: Metadata = pageMetadata({
  enPath: "/privacy",
  locale: "en",
  title: copy.seoTitle,
  description: copy.seoDescription,
});

export default function Page() {
  return <PrivacyPolicy locale="en" />;
}
