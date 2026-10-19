import type { Metadata } from "next";
import { FinishConverterPage, finishConverterMetadata } from "@/components/locale-pages/ToolPages";

/** Tool page, 2026-10-19. One component serves all ten locales; see ToolPages.tsx. */
export const metadata: Metadata = finishConverterMetadata("es");

export default function Page() {
  return <FinishConverterPage locale="es" />;
}
