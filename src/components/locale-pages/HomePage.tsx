import type { Metadata } from "next";
import { DemandShowcase } from "@/components/site/DemandShowcase";
import { StudioShowcase } from "@/components/site/StudioShowcase";
import { ExportMap } from "@/components/site/ExportMap";
import { FamilyIndex } from "@/components/site/FamilyIndex";
import { FactoryStory } from "@/components/site/FactoryStory";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { SiteFacts } from "@/components/site/SiteFacts";
import { Spacer } from "@/components/site/Spacer";
import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import { homeContent } from "@/data/home-locale";
import type { Locale } from "@/data/locales";
import { siteName } from "@/data/site";
import { tx } from "@/lib/i18n";
import { pageMetadata, fitTitle } from "@/lib/seo";
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
    title: { absolute: fitTitle(`${title} | ${siteName}`) },
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
    <main className="isolate mt-48 flex-grow justify-self-start">
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
        {/* Client 2026-10-12: the export map follows the facts strip directly (「地图挪到数据后面」),
           which moves the recommended shelf of 2026-09-14 to second place. */}
        <ExportMap locale={locale} />
        <DemandShowcase locale={locale} />
        <StudioShowcase locale={locale} />
        <FamilyIndex locale={locale} />
        <Spacer heights={content.spacers.s96} />
        <ArgentinaAr4Showcase locale={locale} />
        <FactoryStory locale={locale} />
      </div>
    </main>
  );
}
