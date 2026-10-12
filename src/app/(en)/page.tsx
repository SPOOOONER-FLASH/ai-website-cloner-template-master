import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { SiteFacts } from "@/components/site/SiteFacts";
import { siteFacts, siteFactsHeading } from "@/lib/site-facts";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import { ExportMap } from "@/components/site/ExportMap";
import { FamilyIndex } from "@/components/site/FamilyIndex";
import { FactoryStory } from "@/components/site/FactoryStory";
import { DemandShowcase } from "@/components/site/DemandShowcase";
import { HandleStoryShowcase } from "@/components/site/HandleStoryShowcase";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { Spacer } from "@/components/site/Spacer";
import { BauShowcase } from "@/components/site/BauEntry";
import * as content from "@/data/home";

/**
 * Homepage.
 *
 * Header and footer come from src/app/layout.tsx. This file owns only <main>.
 *
 * The 21 modules keep their established internal rhythm. The page entrance is
 * tighter so the hero caption and its buyer path appear in a desktop first view.
 */
export default function Home() {
  return (
    /*
      The rhythm is written as explicit margins rather than `space-y-*`: Tailwind v4's
      space-y emits margin-BOTTOM on earlier siblings, where a literal `mb-96` would
      override it instead of collapsing with it. These are the resolved values:
      96 / 48 below 1032px, 136 above. The first 48px also stays at desktop:
      192px stacked with the header pushed the first useful caption below 900px.
    */
    <main className="isolate mt-48 flex-grow justify-self-start">
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
        {/* The studio row moved to /products (client, 2026-09-30); see HandleStoryShowcase. */}
        <HandleStoryShowcase />
        <FamilyIndex />
        <Spacer heights={content.spacers.s96} />

        <BauShowcase />
        <Spacer heights={content.spacers.s96} />
        {/* Restore the original AR4 photography below the BAU invitation. */}
        <ArgentinaAr4Showcase />
        <ExportMap />

        {/*
          Buyer resources follow the market collection: a specifier arrives holding a
          problem ("a pair of fire doors", "forty doors and three grades of key holder")
          rather than a model number.

          This is also where the demand data points. Explanatory articles are what get
          cited — the model-number explainer seven times against three for every category
          page combined — and the master key system was the highest-exposure line on the
          client's own Alibaba storefront while this site said nothing about it.
        */}
        <FactoryStory />
      </div>
    </main>
  );
}
