import { ArrowLink } from "./ArrowLink";
import { StoryFilm } from "./StoryFilm";

/**
 * The English home page's door into the 9014 story (/stories/9014/).
 *
 * Client, 2026-09-30: 「那就刚刚那个拉手页面把这个换掉吧」 — this block took the place of the
 * Configurator Studio row, which moved to /products (「products内页 推荐引导去 studio」).
 * English only, because the story page is. Same layout as the StudioShowcase row it
 * replaced, so the home page's rhythm does not change; the film is the one moving thing on
 * the page and only plays while on screen (StoryFilm).
 */
export function HandleStoryShowcase() {
  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="handle-story-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full lg:col-span-4 xl:col-span-7">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">HYDE 9014</p>
          <h2 id="handle-story-heading" className="mt-8 text-h2 text-ink">
            A stainless steel lever, made to its drawing.
          </h2>
        </div>
        <div className="col-span-full mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0 xl:col-span-14 xl:col-start-10">
          <p className="text-c1 text-ink-secondary">
            A 19 mm stainless steel bar turned through one right angle: 135 mm long, 60 mm off the door, on a
            53 mm rose. The film is rendered from the factory drawing, and parts the drawing does not
            dimension are left out rather than guessed.
          </p>
        </div>

        <div className="col-span-full mt-32">
          <StoryFilm
            src="/videos/stories/9014-one-take.mp4"
            poster="/images/stories/9014/one-take-poster.webp"
            width={1280}
            height={720}
            label="The 9014 lever in one continuous shot: along the brushed bar, over the corner, down the neck to the rose, then the whole handle at rest."
          />
        </div>

        <div className="col-span-full mt-16 flex justify-end">
          <ArrowLink href="/stories/9014/">See the 9014</ArrowLink>
        </div>
      </div>
    </section>
  );
}
