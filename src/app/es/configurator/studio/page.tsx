import type { Metadata } from "next";
import { ConfiguratorStudioPage, configuratorStudioMetadata } from "@/components/locale-pages/ConfiguratorStudioPage";

/** The Spanish mirror of /configurator/studio/. One component for all ten locales. */
export const metadata: Metadata = configuratorStudioMetadata("es");

export default function Page() {
  return <ConfiguratorStudioPage locale="es" />;
}
