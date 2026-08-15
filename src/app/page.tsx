import { SiteHeader } from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/SiteHeader";
import { SiteFooter } from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/SiteFooter";
import { WelcomeIntro } from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/WelcomeIntro";
import { HeroModule } from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/HeroModule";
import { PageTeaserModule } from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/PageTeaserModule";
import { TextModule } from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/TextModule";
import { Spacer } from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/Spacer";
import * as content from "@/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/content";

/**
 * Desktop visual prototype of https://www.fsb.de/en/
 *
 * Layout, grid, spacing and typographic scale are reproduced 1:1 from the target.
 * Fonts, copy, imagery and the accent colour are deliberately substituted — see
 * docs/research/www-fsb-de-bf263c85/en-7a4ba3ba/DESIGN_TOKENS.md.
 *
 * Page shell mirrors the source exactly:
 *   header (sticky) / main (mt-192, space-y-136 at lg) / footer
 *   main has three children: .modules.mb-96, the Welcome intro, .modules
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <SiteHeader />

      {/*
        The target writes this rhythm as `space-y-48 lg:space-y-136` plus `mb-96` on the first
        block, and relies on Tailwind v3's space-y (margin-TOP on later siblings) collapsing
        against that `mb-96`. Tailwind v4's space-y emits margin-BOTTOM on earlier siblings
        instead, where a literal `mb-96` would override it rather than collapse with it.
        These explicit margins are the values the target actually resolves to:
        96 / 48 below 1032px, 136 above.
      */}
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <div className="modules mb-96 lg:mb-136">
          <HeroModule content={content.hero1} />
          <PageTeaserModule content={content.teaser1} />
        </div>

        <div className="mb-48 lg:mb-136">
          <WelcomeIntro />
        </div>

        <div className="modules">
          <Spacer heights={content.spacers.s96} />
          <HeroModule content={content.hero2} />
          <Spacer heights={content.spacers.s384} />
          <TextModule content={content.text1} />
          <Spacer heights={content.spacers.s48} />
          <PageTeaserModule content={content.teaser2} />
          <Spacer heights={content.spacers.s288lg} />
          <HeroModule content={content.hero3} />
          <Spacer heights={content.spacers.s288lg} />
          <HeroModule content={content.hero4} />
          <Spacer heights={content.spacers.s288xl} />
          <TextModule content={content.text2} />
          <Spacer heights={content.spacers.s48} />
          <PageTeaserModule content={content.teaser3} />
          <Spacer heights={content.spacers.s288xl} />
          <TextModule content={content.text3} />
          <Spacer heights={content.spacers.s48} />
          <HeroModule content={content.hero5} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
