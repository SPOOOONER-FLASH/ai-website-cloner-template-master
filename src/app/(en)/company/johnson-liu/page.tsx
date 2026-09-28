import type { Metadata } from "next";
import { JohnsonLiuPage, johnsonLiuMetadata } from "@/components/locale-pages/SimplePages";

/** Author profile (2026-09-28). Same page in all ten languages; see AuthorProfile.tsx. */
export const metadata: Metadata = johnsonLiuMetadata("en");

export default function Page() {
  return <JohnsonLiuPage locale="en" />;
}
