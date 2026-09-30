import type { Metadata } from "next";
import { ConfiguratorStudioPage, configuratorStudioMetadata } from "@/components/locale-pages/ConfiguratorStudioPage";

/** The English studio. One component for all ten locales — see ConfiguratorStudioPage. */
export const metadata: Metadata = configuratorStudioMetadata("en");

export default function Page() {
  return <ConfiguratorStudioPage locale="en" />;
}
