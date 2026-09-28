import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { HeroModule } from "@/components/site/HeroModule";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { Spacer } from "@/components/site/Spacer";
import { TextModule } from "@/components/site/TextModule";
import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { SiteFacts } from "@/components/site/SiteFacts";
import { siteFacts, siteFactsHeading } from "@/lib/site-facts";
import { FlagshipTooling } from "@/components/site/FlagshipTooling";
import { FeatureColumns } from "@/components/site/FeatureColumns";
import { DemandShowcase } from "@/components/site/DemandShowcase";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import * as content from "@/data/home-pt";
import { siteName } from "@/data/site";

const title = "Fechaduras e ferragens arquitetónicas";

export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/",
    locale: "pt",
    title,
    description:
      "Fabricante de fechaduras, barras antipânico e ferragens para obras internacionais desde 1998. ISO 9001 desde 2002; produção OEM em Guangdong.",
  }),
  // This page shares the /pt segment with its root layout, so the layout title template
  // does not run here. Keep the brand suffix explicit in the shipped home-page title.
  title: { absolute: `${title} | ${siteName}` },
};

export default function PortugueseHomePage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start">
      <div className="modules mb-96 lg:mb-136">
        <HeroCarousel content={content.heroCarousel} />
        <PageTeaserModule content={content.teaser1} homeAccent />
      </div>
      <div className="mb-48 lg:mb-136">
        <WelcomeIntro locale="pt" />
      </div>

      <div className="mb-48 lg:mb-136">
        <SiteFacts facts={siteFacts("pt")} heading={siteFactsHeading("pt")} />
      </div>
      <div className="modules">
        {/* Same position as the English page. See there for why it leads. */}
        <DemandShowcase locale="pt" />
        {/*
          THE FEATURE RUN, REORDERED 2026-09-28 after the client's critique that four
          sections in a row each asked to be the lead. Each now has one job, in the order a
          buyer asks them, and all four share one heading shape (HomeSectionHeading):

            most requested  what other buyers order       product grid, the lead
            307 and 311     what the factory tooled       two photographs and a spec sheet
            AR-4            a regional collection         a compact index into its own page
            columns         what the catalog can explain  editorial rail

          AR-4 moved below 307/311 and lost its homepage photograph: directly under the
          most-requested grid it was a second product grid saying the same thing again.
        */}
        <Spacer heights={content.spacers.s96} />
        <FlagshipTooling locale="pt" />
        <Spacer heights={content.spacers.s96} />
        <ArgentinaAr4Showcase locale="pt" />
        <Spacer heights={content.spacers.s96} />
        <FeatureColumns locale="pt" />

        <HeroModule content={content.hero2} homeEditorial />
        <Spacer heights={content.spacers.s384} />
        <TextModule content={content.text1} />
        <Spacer heights={content.spacers.s48} />
        <PageTeaserModule content={content.teaser2} homeAccent />
        <Spacer heights={content.spacers.s288lg} />
        <HeroModule content={content.hero3} homeEditorial />
        <Spacer heights={content.spacers.s288lg} />
        <HeroModule content={content.hero4} homeEditorial />
        <Spacer heights={content.spacers.s288xl} />
        <TextModule content={content.text2} />
        <Spacer heights={content.spacers.s48} />
        <PageTeaserModule content={content.teaser3} homeAccent />
        <Spacer heights={content.spacers.s288xl} />
        <TextModule content={content.text3} />
        <Spacer heights={content.spacers.s48} />
        <HeroModule content={content.hero5} homeEditorial />
      </div>
    </main>
  );
}
