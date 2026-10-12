import type { Metadata } from "next";
import { pageMetadata, fitTitle } from "@/lib/seo";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { Spacer } from "@/components/site/Spacer";
import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { SiteFacts } from "@/components/site/SiteFacts";
import { siteFacts, siteFactsHeading } from "@/lib/site-facts";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import { FeatureColumns } from "@/components/site/FeatureColumns";
import { ExportMap } from "@/components/site/ExportMap";
import { FamilyIndex } from "@/components/site/FamilyIndex";
import { FactoryStory } from "@/components/site/FactoryStory";
import { DemandShowcase } from "@/components/site/DemandShowcase";
import { StudioShowcase } from "@/components/site/StudioShowcase";
import { BauShowcase } from "@/components/site/BauEntry";
import * as content from "@/data/home-es";
import { siteName } from "@/data/site";

const title = "Cerraduras y herrajes arquitectónicos";

export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/",
    locale: "es",
    title,
    description:
      "Fabricante de cerraduras, dispositivos antipánico y herrajes para proyectos internacionales desde 1998. ISO 9001 desde 2002; producción OEM en Guangdong.",
  }),
  // This page shares the /es segment with its root layout, so the layout title template
  // does not run here. Keep the brand suffix explicit in the shipped home-page title.
  title: { absolute: fitTitle(`${title} | ${siteName}`) },
};

export default function SpanishHomePage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start">
      <div className="modules mb-96 lg:mb-136">
        <HeroCarousel content={content.heroCarousel} />
        <PageTeaserModule content={content.teaser1} homeAccent />
      </div>
      <div className="mb-48 lg:mb-136">
        <WelcomeIntro locale="es" />
      </div>

      <div className="mb-48 lg:mb-136">
        <SiteFacts facts={siteFacts("es")} heading={siteFactsHeading("es")} />
      </div>
      <div className="modules">
        {/* Same position as the English page. See there for why it leads. */}
        <DemandShowcase locale="es" />
        <StudioShowcase locale="es" />
        <FamilyIndex locale="es" />
        <Spacer heights={content.spacers.s96} />

        <BauShowcase locale="es" />
        <Spacer heights={content.spacers.s96} />
        {/* Restore the original AR4 photography below the BAU invitation. */}
        <ArgentinaAr4Showcase locale="es" />
        <ExportMap locale="es" />

        {/* Buyer resources follow the market collection. */}
        <FeatureColumns locale="es" />
        <FactoryStory locale="es" />
      </div>
    </main>
  );
}
