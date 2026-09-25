import type { Metadata } from "next";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import { DemandShowcase } from "@/components/site/DemandShowcase";
import { FeatureColumns } from "@/components/site/FeatureColumns";
import { FlagshipTooling } from "@/components/site/FlagshipTooling";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { HeroModule } from "@/components/site/HeroModule";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { SiteFacts } from "@/components/site/SiteFacts";
import { Spacer } from "@/components/site/Spacer";
import { TextModule } from "@/components/site/TextModule";
import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { homeContent } from "@/data/home-locale";
import type { Locale } from "@/data/locales";
import { siteName } from "@/data/site";
import { tx } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { siteFacts, siteFactsHeading } from "@/lib/site-facts";

export function homeMetadata(locale: Locale): Metadata {
  const title = tx(locale, "Locks and architectural door hardware");
  return {
    ...pageMetadata({
      enPath: "/",
      locale,
      title,
      description: tx(
        locale,
        "Manufacturer of locks, panic exit devices and architectural hardware for international projects since 1998. ISO 9001 since 2002; OEM production in Guangdong.",
      ),
    }),
    /* The segment root shares its layout's title template, which does not run here. */
    title: { absolute: `${title} | ${siteName}` },
  };
}

/**
 * The home page of a locale tree, module for module the English one.
 *
 * The content comes from `homeContent(locale)`: the English home copy with every
 * sentence read through the locale's ui.json and every href moved into the locale's
 * tree (src/data/home-locale.ts). Spanish and Portuguese keep their hand-written
 * home-es.ts / home-pt.ts and their own routes; this component serves the seven
 * overlay locales.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const content = homeContent(locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="modules mb-96 lg:mb-136">
        <HeroCarousel content={content.heroCarousel} />
        <PageTeaserModule content={content.teaser1} homeAccent />
      </div>
      <div className="mb-48 lg:mb-136">
        <WelcomeIntro locale={locale} />
      </div>
      <div className="mb-48 lg:mb-136">
        <SiteFacts facts={siteFacts(locale)} heading={siteFactsHeading(locale)} />
      </div>
      <div className="modules">
        <DemandShowcase locale={locale} />
        <Spacer heights={content.spacers.s96} />
        <ArgentinaAr4Showcase locale={locale} />
        <Spacer heights={content.spacers.s96} />
        <FlagshipTooling locale={locale} />
        <FeatureColumns locale={locale} />
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
