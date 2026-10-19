import type { Metadata } from "next";
import { HsCodeFinderPage, hsCodeFinderMetadata } from "@/components/locale-pages/ToolPages";

/** Tool page, 2026-10-19. One component serves all ten locales; see ToolPages.tsx. */
export const metadata: Metadata = hsCodeFinderMetadata("pt");

export default function Page() {
  return <HsCodeFinderPage locale="pt" />;
}
