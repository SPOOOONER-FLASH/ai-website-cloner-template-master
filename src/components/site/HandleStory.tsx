import Link from "next/link";
import { getAuthorBySlug, authorPortrait } from "@/data/authors";
import { getProductBySlug } from "@/data/products";
import { siteSettings, whatsappHref } from "@/data/navigation";
import { EmailLink } from "./EmailLink";
import { StoryFilm } from "./StoryFilm";
import { authorRole } from "./AuthorProfile";

/*
  THE 9014 STORY PAGE — FSB 1138's page grammar, applied to a HYDE lever.

  Section order follows fsbna.com/innovation/relaunch-fsb-1138-dieter-rams (breakdown in
  docs/design-references/2026-09-30-fsb-page-study/README.md): one silent film, one
  paragraph of facts, three details with one-line captions, the engineering nobody sees,
  the variants shot alike, the drawing, a named person. One product per page, and only
  the film moves.

  Every figure is from content/products/9014-*.json or the factory drawing that is the
  9014 record's own hero image. The detail images are frames of the ONE TAKE film,
  rendered from that drawing (scripts/blender/one-take.py) — the caption says so, because
  a render presented as a photograph is the kind of claim a buyer discounts everything
  else for once caught.
*/

const CATEGORY = "stainless-steel-handles";

const DETAILS = [
  {
    src: "/images/stories/9014/detail-corner.webp",
    alt: "9014 lever, the right-angle corner where the 19 mm bar turns towards the door",
    caption: "One corner. The 19 mm bar turns through a single mitered right angle.",
  },
  {
    src: "/images/stories/9014/detail-rose.webp",
    alt: "9014 lever, the neck meeting the 53 mm round rose",
    caption: "The neck meets a round rose 53 mm across and 9 mm deep.",
  },
] as const;

const VARIANTS = [
  { slug: "9014-sset-stainless-steel-handle", name: "Entrance set, keyed outside", finish: "Satin stainless steel, US32D" },
  { slug: "9014-ssbk-stainless-steel-handle", name: "Privacy set, turn button inside", finish: "Satin stainless steel, US32D" },
] as const;

const FIGURES = [
  ["Lever length", "135 mm"],
  ["Projection from the door", "60 mm"],
  ["Bar diameter", "19 mm"],
  ["Rose", "Ø53 × 9 mm"],
  ["Spindle", "8 mm"],
  ["Door thickness", "35–50 mm"],
] as const;

export function HandleStory() {
  const base = getProductBySlug(CATEGORY, "9014-stainless-steel-handle");
  const author = getAuthorBySlug("johnson-liu");
  const portrait = authorPortrait(author?.name);
  const { email, whatsapp } = siteSettings.contact;
  const wa = whatsappHref(whatsapp);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-6 xl:col-span-12">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">HYDE 9014</p>
            <h1 className="mt-16 text-h1 text-ink">A stainless steel lever, made to its drawing.</h1>
          </div>
        </section>

        <section className="col-popout">
          <StoryFilm
            src="/videos/stories/9014-one-take.mp4"
            poster="/images/stories/9014/one-take-poster.webp"
            width={1280}
            height={720}
            label="The 9014 lever in one continuous shot: along the brushed bar, over the corner, down the neck to the rose, then the whole handle at rest."
          />
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24">
          <div className="col-span-full lg:col-span-7 lg:col-start-4 xl:col-span-14 xl:col-start-6">
            <p className="text-c1 text-ink">
              The 9014 is a lever with one idea in it: a 19 mm round bar of stainless steel, turned through a
              single right angle. It is 135 mm long and stands 60 mm off the door, on a round rose 53 mm across and
              9 mm deep. The finish is satin brushed stainless steel, US32D. It fits doors 35 to 50 mm thick and
              comes prepared for a brass cylinder, as an entrance set or a privacy set. Every figure on this page is
              taken from the factory drawing.
            </p>
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-48" aria-labelledby="story-details">
          <h2 id="story-details" className="sr-only">Details</h2>
          {DETAILS.map((detail) => (
            <figure key={detail.src} className="col-span-full lg:col-span-5 xl:col-span-12">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
              <img
                src={detail.src}
                alt={detail.alt}
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full bg-surface-alt"
              />
              <figcaption className="mt-12 text-c2 text-ink-secondary">{detail.caption}</figcaption>
            </figure>
          ))}
          <p className="col-span-full text-c2 text-ink-tertiary">
            Film and details are rendered from the factory drawing. Parts without a published dimension, such as
            the grub screw, are left out rather than guessed.
          </p>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-8">
            <h2 className="text-h2 text-ink">What the drawing fixes</h2>
            <figure className="mt-32 max-w-[32rem]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
              <img
                src="/images/products-hyde/9014-ssbk-stainless-steel-handle-3.webp"
                alt="A 9014 privacy set photographed at the factory, with the inside of the rose showing"
                width={1000}
                height={1000}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full bg-surface-alt"
              />
              <figcaption className="mt-12 text-c2 text-ink-secondary">
                A 9014 set photographed at the factory, with the inside of the rose showing.
              </figcaption>
            </figure>
          </div>
          <div className="col-span-full lg:col-span-6 lg:col-start-6 xl:col-span-13 xl:col-start-11">
            <p className="text-c1 text-ink">
              A lever that arrives in a container cannot be adjusted on site. Whether it fits is decided by a few
              figures, so those are the ones we publish, and where a dimension is not on the drawing this page
              does not supply one.
            </p>
            <dl className="mt-32 border-t border-line">
              {FIGURES.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-24 border-b border-line py-12 text-c1">
                  <dt className="text-ink-secondary">{label}</dt>
                  <dd className="tabular-nums text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-48" aria-labelledby="story-variants">
          <h2 id="story-variants" className="col-span-full text-h2 text-ink">
            Available sets
          </h2>
          {VARIANTS.map((variant) => {
            const product = getProductBySlug(CATEGORY, variant.slug);
            if (!product?.heroImage?.src) return null;
            return (
              <Link
                key={variant.slug}
                href={`/products/${CATEGORY}/${variant.slug}/`}
                className="col-span-full sm:col-span-2 md:col-span-4 lg:col-span-5 xl:col-span-12"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
                <img
                  src={product.heroImage.src}
                  alt={`${product.model} — ${variant.name.toLowerCase()}`}
                  width={1000}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-square h-auto w-full bg-surface-alt object-contain"
                />
                <p className="mt-16 text-c1 font-semibold text-ink"><span className="short-marker">{variant.name}</span></p>
                <p className="mt-4 text-c2 text-ink-secondary">
                  {product.model} · {variant.finish}
                </p>
              </Link>
            );
          })}
        </section>

        {base?.heroImage?.src ? (
          <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-48">
            <div className="col-span-full lg:col-span-4 xl:col-span-8">
              <h2 className="text-h2 text-ink">The drawing</h2>
              <p className="mt-16 text-c1 text-ink-secondary">All dimensions in millimeters.</p>
              <p className="mt-24 text-c1">
                <a href="/downloads/spec-sheets/9014-stainless-steel-handle.pdf" className="short-marker">
                  Specification sheet (PDF)
                </a>
              </p>
              <p className="mt-8 text-c1">
                <Link href={`/products/${CATEGORY}/9014-stainless-steel-handle/`} className="short-marker">
                  9014 product page
                </Link>
              </p>
            </div>
            <div className="col-span-full lg:col-span-6 lg:col-start-6 xl:col-span-13 xl:col-start-11">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
              <img
                src={base.heroImage.src}
                alt="9014 factory drawing: 135 mm lever, 60 mm projection, 19 mm bar, 53 × 9 mm rose, 8 mm spindle"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full border border-line bg-surface-alt"
              />
            </div>
          </section>
        ) : null}

        {author ? (
          <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-48">
            <div className="col-span-full lg:col-span-4 xl:col-span-8">
              <h2 className="text-h2 text-ink">Questions?</h2>
            </div>
            <div className="col-span-full flex gap-24 lg:col-span-6 lg:col-start-6 xl:col-span-13 xl:col-start-11">
              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp
                <img
                  src={portrait.src}
                  alt={author.name}
                  width={portrait.width}
                  height={portrait.height}
                  loading="lazy"
                  className="block h-96 w-96 shrink-0 rounded-[2px] object-cover"
                />
              ) : null}
              <div className="text-c1">
                <p className="font-semibold text-ink">
                  <Link href="/company/johnson-liu/" className="short-marker">
                    {author.name}
                  </Link>
                </p>
                <p className="text-ink-secondary">{authorRole(author, "en")}</p>
                <p className="mt-16">
                  <EmailLink address={email} subject="9014 lever handle" className="short-marker" />
                </p>
                {wa ? (
                  <p className="mt-8">
                    <a href={wa} rel="noopener noreferrer" target="_blank" className="short-marker">
                      WhatsApp {whatsapp}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
