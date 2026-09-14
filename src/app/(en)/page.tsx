import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { SiteFacts } from "@/components/site/SiteFacts";
import { siteFacts, siteFactsHeading } from "@/lib/site-facts";
import { FlagshipTooling } from "@/components/site/FlagshipTooling";
import { FeatureColumns } from "@/components/site/FeatureColumns";
import { DemandShowcase } from "@/components/site/DemandShowcase";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { HeroModule } from "@/components/site/HeroModule";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { TextModule } from "@/components/site/TextModule";
import { Spacer } from "@/components/site/Spacer";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import * as content from "@/data/home";

/**
 * Homepage.
 *
 * Header and footer come from src/app/layout.tsx. This file owns only <main>.
 *
 * The module rhythm below is measured, not invented — 21 modules at fixed offsets,
 * document height 10837px at 1512x900. Check that before committing any change here.
 */
export default function Home() {
  return (
    /*
      The rhythm is written as explicit margins rather than `space-y-*`: Tailwind v4's
      space-y emits margin-BOTTOM on earlier siblings, where a literal `mb-96` would
      override it instead of collapsing with it. These are the resolved values:
      96 / 48 below 1032px, 136 above.
    */
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="modules mb-96 lg:mb-136">
        <HeroCarousel content={content.heroCarousel} />
        <PageTeaserModule content={content.teaser1} homeAccent />
      </div>

      <div className="mb-48 lg:mb-136">
        <WelcomeIntro />
      </div>

      <div className="mb-48 lg:mb-136">
        <SiteFacts facts={siteFacts("en")} heading={siteFactsHeading("en")} />
      </div>

      <div className="modules">
        {/*
          FIRST MODULE AFTER THE FACTS STRIP, by the client's instruction of 2026-09-14:
          a visitor should meet the recommended shelf before anything else.

          It reads well there for a reason beyond placement. The strip above states what
          the factory is — record count, categories, year, certification. This answers the
          question that follows immediately from it: of all that, what are other people
          actually buying? The order is ninety days of real enquiries from the client's own
          Alibaba back office rather than a shortlist we drew up, and the two disagree —
          307 had the fewest impressions on that sheet and the most enquiries. See
          src/data/demand-showcase.ts for why the counts themselves stay off the page.
        */}
        <DemandShowcase />
        <Spacer heights={content.spacers.s96} />

        <ArgentinaAr4Showcase />
        <Spacer heights={content.spacers.s96} />
        {/*
          307 and 311 sit directly above the panic-exit hero: the flagship pair first, then
          the range they belong to. Reversing that order would introduce the family before
          giving a reason to care about it.
        */}
        <FlagshipTooling />

        {/*
          Directly under the flagship pair, because the two answer different questions and
          the second only lands once the first has been asked. 307 and 311 say what we
          tooled; the columns say what we can explain — and a specifier arrives holding a
          problem ("a pair of fire doors", "forty doors and three grades of key holder")
          rather than a model number.

          This is also where the demand data points. Explanatory articles are what get
          cited — the model-number explainer seven times against three for every category
          page combined — and the master key system was the highest-exposure line on the
          client's own Alibaba storefront while this site said nothing about it.
        */}
        <FeatureColumns />

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
