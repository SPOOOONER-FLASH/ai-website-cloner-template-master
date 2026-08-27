import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { HeroModule } from "@/components/site/HeroModule";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { TextModule } from "@/components/site/TextModule";
import { Spacer } from "@/components/site/Spacer";
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
        <PageTeaserModule content={content.teaser1} />
      </div>

      <div className="mb-48 lg:mb-136">
        <WelcomeIntro homeAccent />
      </div>

      <div className="modules">
        <Spacer heights={content.spacers.s96} />
        <HeroModule content={content.hero2} homeAccent />
        <Spacer heights={content.spacers.s384} />
        <TextModule content={content.text1} homeAccent />
        <Spacer heights={content.spacers.s48} />
        <PageTeaserModule content={content.teaser2} homeAccent />
        <Spacer heights={content.spacers.s288lg} />
        <HeroModule content={content.hero3} homeAccent />
        <Spacer heights={content.spacers.s288lg} />
        <HeroModule content={content.hero4} homeAccent />
        <Spacer heights={content.spacers.s288xl} />
        <TextModule content={content.text2} homeAccent />
        <Spacer heights={content.spacers.s48} />
        <PageTeaserModule content={content.teaser3} homeAccent />
        <Spacer heights={content.spacers.s288xl} />
        <TextModule content={content.text3} homeAccent />
        <Spacer heights={content.spacers.s48} />
        <HeroModule content={content.hero5} homeAccent />
      </div>
    </main>
  );
}
