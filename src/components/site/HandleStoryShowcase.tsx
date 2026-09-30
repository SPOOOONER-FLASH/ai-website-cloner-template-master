import { ArrowLink } from "./ArrowLink";
import { StoryFilm } from "./StoryFilm";

/**
 * The English home page's door into the 9014 story (/stories/9014/).
 *
 * Client, 2026-09-30: 「那就刚刚那个拉手页面把这个换掉吧」, then 「我想做成这样横屏的一块替换原来的那个
 * D101 那一行」 with FSB's 1138 relaunch card as the reference. So it is one landscape panel
 * in a hairline frame: the picture across the full width, one bold line and one quiet line
 * under it on the left, the link on the right, and nothing else. The link names where it goes
 * rather than FSB's "Learn more" (house rule, home-accent.test.ts). The Configurator Studio
 * row it replaced moved to /products.
 *
 * English only, because the story page is. The film is the one moving thing on the page and
 * only plays while on screen (StoryFilm), so the home page downloads nothing until then.
 */
export function HandleStoryShowcase() {
  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="handle-story-heading">
      <div className="col-content w-full border border-line">
        <StoryFilm
          src="/videos/stories/9014-one-take.mp4"
          poster="/images/stories/9014/one-take-poster.webp"
          width={1280}
          height={720}
          label="The 9014 lever in one continuous shot: along the brushed bar, over the corner, down the neck to the rose, then the whole handle at rest."
        />
        <div className="flex flex-wrap items-end justify-between gap-16 px-24 py-32 lg:px-40 lg:py-48">
          <div>
            <h2 id="handle-story-heading" className="text-h3 font-semibold text-ink">
              The HYDE 9014 lever
            </h2>
            <p className="mt-4 text-c1 text-ink-secondary">Stainless steel, made to its factory drawing</p>
          </div>
          <ArrowLink href="/stories/9014/">See the 9014</ArrowLink>
        </div>
      </div>
    </section>
  );
}
