import type { Metadata } from "next";
import { ConfiguratorStudioPage, configuratorStudioMetadata } from "@/components/locale-pages/ConfiguratorStudioPage";

/** The Portuguese mirror of /configurator/studio/. One component for all ten locales. */
export const metadata: Metadata = configuratorStudioMetadata("pt");

export default function Page() {
  return <ConfiguratorStudioPage locale="pt" />;
}
