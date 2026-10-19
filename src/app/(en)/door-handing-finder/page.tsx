import type { Metadata } from "next";
import { HandingFinderPage, handingFinderMetadata } from "@/components/locale-pages/ToolPages";

/** Tool page, 2026-10-19. One component serves all ten locales; see ToolPages.tsx. */
export const metadata: Metadata = handingFinderMetadata("en");

export default function Page() {
  return <HandingFinderPage locale="en" />;
}
