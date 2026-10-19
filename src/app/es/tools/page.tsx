import type { Metadata } from "next";
import { ToolsIndexPage, toolsIndexMetadata } from "@/components/locale-pages/ToolPages";

/** Tool page, 2026-10-19. One component serves all ten locales; see ToolPages.tsx. */
export const metadata: Metadata = toolsIndexMetadata("es");

export default function Page() {
  return <ToolsIndexPage locale="es" />;
}
