import type { Metadata } from "next";
import { MasterKeyPlanPage, masterKeyPlanMetadata } from "@/components/locale-pages/ToolPages";

/** Tool page, 2026-10-19. One component serves all ten locales; see ToolPages.tsx. */
export const metadata: Metadata = masterKeyPlanMetadata("pt");

export default function Page() {
  return <MasterKeyPlanPage locale="pt" />;
}
