import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { HeroModule } from "@/components/site/HeroModule";
import { PageTeaserModule } from "@/components/site/PageTeaserModule";
import { Spacer } from "@/components/site/Spacer";
import { TextModule } from "@/components/site/TextModule";
import { WelcomeIntro } from "@/components/site/WelcomeIntro";
import * as content from "@/data/home-es";

export const metadata: Metadata = pageMetadata({
  enPath: "/",
  locale: "es",
  title: "Cerraduras y herrajes arquitectónicos",
  description:
    "Fabricante de cerraduras, dispositivos antipánico y herrajes para proyectos internacionales desde 1998.",
});

export default function SpanishHomePage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="modules mb-96 lg:mb-136">
        <HeroCarousel content={content.heroCarousel} />
        <PageTeaserModule content={content.teaser1} />
      </div>
      <div className="mb-48 lg:mb-136">
        <WelcomeIntro locale="es" />
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
  );
}
