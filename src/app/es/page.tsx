import type { Metadata } from "next";
import { pageMetadata, fitTitle } from "@/lib/seo";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { Spacer } from "@/components/site/Spacer";
import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { SiteFacts } from "@/components/site/SiteFacts";
import { siteFacts, siteFactsHeading } from "@/lib/site-facts";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import { BrazilHomeShowcase } from "@/components/site/brazil/BrazilHomeShowcase";
import { ExportMap } from "@/components/site/ExportMap";
import { FamilyIndex } from "@/components/site/FamilyIndex";
import { FactoryStory } from "@/components/site/FactoryStory";
import { HomeIntro } from "@/components/site/HomeIntro";
import { HomeSmoothScroll } from "@/components/site/HomeSmoothScroll";
import { DemandShowcase } from "@/components/site/DemandShowcase";
import { StudioShowcase } from "@/components/site/StudioShowcase";
import * as content from "@/data/home-es";
import { siteName } from "@/data/site";

const title = "Cerraduras y herrajes arquitectónicos";

export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/",
    locale: "es",
    title,
    description:
      "Fabricante de cerraduras, dispositivos antipánico y herrajes para proyectos internacionales desde 1998. Planta de estampado ISO 9001:2015; producción OEM en Guangdong.",
  }),
  // This page shares the /es segment with its root layout, so the layout title template
  // does not run here. Keep the brand suffix explicit in the shipped home-page title.
  title: { absolute: fitTitle(`${title} | ${siteName}`) },
};

export default function SpanishHomePage() {
  return (
    <>
      {/* The opening curtain sits outside <main>: main is `isolate`, a stacking context its
         z-index cannot leave, and the curtain has to cover the site header too. */}
      <HomeIntro />
    <main className="isolate mt-48 flex-grow justify-self-start">
      {/* Smoothed wheel scrolling, as in the 2026-10-12 motion demo (client). */}
      <HomeSmoothScroll />
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
        {/* Client 2026-10-12: the export map follows the facts strip directly (「地图挪到数据后面」),
           which moves the recommended shelf of 2026-09-14 to second place. */}
        <ExportMap locale="es" />
        {/* Same position as the English page. See there for why it leads. */}
        <DemandShowcase locale="es" />
        <StudioShowcase locale="es" />
        <FamilyIndex locale="es" />
        <Spacer heights={content.spacers.s96} />

        <ArgentinaAr4Showcase locale="es" />
        <BrazilHomeShowcase locale="es" />

        {/* Buyer resources follow the market collection. */}
        <FactoryStory locale="es" />
      </div>
    </main>
    </>
  );
}
