import Link from "next/link";
import { getProductBySlug, publishedProducts } from "@/data/products";
import { bauFeatured } from "@/data/bau-2027";
import { studioShowcase } from "@/lib/studio-showcase";
import { ArrowLink } from "./ArrowLink";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "./Button";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { getProductsArchitecture } from "./products-architecture";

/*
  /products IN FSB'S PRODUCTS-PAGE GRAMMAR — English draft, 2026-09-30.

  Section map and reasoning: docs/design-references/2026-09-30-fsb-page-study/products-page.md.
  FSB's page is built from three things only: one large picture, one line of text, one
  link. So is this one. The order is: small title and quick links, one product on a grey
  field, materials, feature slots, a wall of one range shot alike, the nine families as
  picture cards. The Finder, the compare tables and the model index follow in page.tsx.

  THE GREY FIELD IS CSS, NOT IMAGE EDITING. Every product plate here is a real white-field
  catalog photograph laid on bg-surface-alt with mix-blend-multiply, so white reads as
  the field and the product keeps every original pixel. When Codex's graded grey-field
  plates arrive, only the file paths change.

  Every model named below is read from content/products through the HYDE filter; a slug
  that stops resolving drops its card instead of rendering a broken one.
*/

const HANDLES = "stainless-steel-handles";

const HERO = { category: HANDLES, slug: "9014-sset-stainless-steel-handle" } as const;

const QUICK_LINKS = [
  { label: "Lever handles", href: "/products/lever-handles/" },
  { label: "Stainless steel handles", href: `/products/${HANDLES}/` },
  { label: "Lock cases", href: "/products/lock-cases/" },
  { label: "Panic exit devices", href: "/products/panic-exit-devices/" },
  { label: "Door hinges", href: "/products/brass-steel-hinges/" },
  { label: "Materials and finishes", href: "#materials" },
] as const;

/*
  Three materials, shown on the same part so the material is the only thing that changes.
  Each photograph is one finish only. These are catalog plates until the factory sends
  three photographs of the parts fitted to a real door (the FSB treatment).
*/
const MATERIALS = [
  {
    name: "Stainless steel",
    line: "304 stainless steel with a satin brushed surface.",
    category: "brass-steel-hinges",
    slug: "ssh012-brass-and-steel-hinges",
  },
  {
    name: "Solid brass",
    line: "Brass, in polished, satin or antique brass, antique copper or chrome.",
    category: "brass-steel-hinges",
    slug: "b024-brass-and-steel-hinges",
  },
  {
    name: "Matte black",
    line: "304 stainless steel in matte black, with other colors to order.",
    category: "brass-steel-hinges",
    slug: "bl030-brass-and-steel-hinges",
  },
] as const;

/*
  The consistency wall: one range, one finish, one camera. Only the lever-and-escutcheon
  plates are here; exploded views, drawings and backplate sets are left out because they
  break the row, not because the models are lesser.
*/
const WALL = [
  "9001", "9002e", "9003e", "9004", "9004s", "9005e",
  "9005s", "9006s", "9007e", "9007s", "9008e", "9008s",
  "9010e", "9011e", "9014-sset", "9015", "9020s", "lh1016",
].map((model) => `${model}-stainless-steel-handle`);

/* Picture for each family card. Editorial plates are real photographs recomposed on white. */
const FAMILY_IMAGES: Record<string, { src: string; ratio: string }> = {
  "lever-handles": { src: "/images/editorial/hyde-real-lever-plate.webp", ratio: "3 / 2" },
  "panic-exit-devices": { src: "/images/editorial/hyde-real-panic-plate.webp", ratio: "3 / 2" },
  "lock-cases": { src: "/images/editorial/hyde-real-lock-plate.webp", ratio: "3 / 2" },
  "door-closers": { src: "/images/products-hyde/ju-051-door-closer.webp", ratio: "1 / 1" },
  "brass-steel-hinges": { src: "/images/editorial/hyde-real-hinge-plate.webp", ratio: "3 / 2" },
  "glass-door-accessories": { src: "/images/editorial/hyde-real-pull-plate.webp", ratio: "3 / 2" },
  "grip-handle-sets": { src: "/images/products-hyde/70750-pb-grip-handle-set.webp", ratio: "1 / 1" },
  "lock-cylinders": { src: "/images/editorial/hyde-real-cylinder-plate.webp", ratio: "3 / 2" },
  "hardware-accessories": { src: "/images/products-hyde/stainless-steel-flush-bolt.webp", ratio: "1 / 1" },
};

/** A real white-field photograph on the grey field. The box is fixed; the product is never cropped. */
function Plate({ src, label, ratio, sizes, priority }: { src: string; label: string; ratio: string; sizes: string; priority?: boolean }) {
  return (
    <div className="bg-surface-alt">
      <MediaPlaceholder
        src={src}
        label={label}
        ratio={ratio}
        sizes={sizes}
        priority={priority}
        className="object-contain mix-blend-multiply"
      />
    </div>
  );
}

export function ProductsShowroom({ categoryCounts }: { categoryCounts: Readonly<Record<string, number>> }) {
  const architecture = getProductsArchitecture("en");
  const hero = getProductBySlug(HERO.category, HERO.slug);
  const studio = studioShowcase(publishedProducts);
  const bau = bauFeatured("en").find((card) => card.image);

  const features = [
    {
      eyebrow: "Story",
      title: "The 9014 lever, in one take",
      line: "One stainless steel lever, filmed and drawn to its factory dimensions.",
      href: "/stories/9014/",
      image: "/images/stories/9014/one-take-poster.webp",
      alt: "The 9014 lever at rest on a gray field, rendered from its factory drawing",
      ratio: "16 / 9",
      grey: false,
    },
    studio?.members[0]?.heroImage.src
      ? {
          eyebrow: "Configurator Studio",
          title: "One model, every finish",
          line: "Switch finish and function; the photograph changes to the real part and its order code.",
          href: "/configurator/studio/",
          image: studio.members[0].heroImage.src,
          alt: studio.members[0].heroImage.label,
          ratio: "1 / 1",
          grey: true,
        }
      : null,
    bau?.image
      ? {
          eyebrow: "BAU 2027",
          title: "Munich, 11–15 January 2027",
          line: "Hall C4, Stand 523. Book a time and bring your drawings.",
          href: "/bau-2027/",
          image: bau.image.src,
          alt: bau.image.label,
          ratio: "1 / 1",
          grey: true,
        }
      : null,
  ].filter((feature) => feature !== null);

  return (
    <div className="layout">
      <section className="col-content grid w-full grid-cols gap-x gap-y-32" aria-labelledby="products-title">
        <div className="col-span-full">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
        </div>
        <div className="col-span-full lg:col-span-4 xl:col-span-8">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">Products</p>
          <h1 id="products-title" className="mt-8 text-h2 text-ink">
            Door hardware from one factory.
          </h1>
        </div>
        <div className="col-span-full lg:col-span-6 lg:col-start-6 xl:col-span-13 xl:col-start-11">
          <p className="text-c1 text-ink-secondary">
            {publishedProducts.length} models in nine families: lever handles, locks, cylinders, hinges, exit
            devices and door closers. Each model has its own page with the dimensions a hardware schedule is
            written in, and the photographs are of the real part.
          </p>
          <ul className="mt-24 grid grid-cols-1 gap-y-8 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="short-marker short-marker-compact text-c1 text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {hero?.heroImage?.src ? (
        <figure className="col-content mt-64 w-full lg:mt-96">
          <Link href={`/products/${HERO.category}/${HERO.slug}/`}>
            <Plate
              src={hero.heroImage.src}
              label={`HYDE ${hero.model} stainless steel lever handle with escutcheon`}
              ratio="16 / 9"
              sizes="(min-width: 1024px) 90vw, 100vw"
              priority
            />
          </Link>
          <figcaption className="mt-16 flex flex-wrap items-baseline justify-between gap-16">
            <span className="text-c1 text-ink">
              <strong className="font-semibold">9014</strong> lever handle, satin stainless steel, US32D
            </span>
            <ArrowLink href={`/products/${HERO.category}/${HERO.slug}/`}>Learn more</ArrowLink>
          </figcaption>
        </figure>
      ) : null}

      <section id="materials" className="col-content mt-128 grid w-full scroll-mt-96 grid-cols gap-x gap-y-48 lg:mt-176" aria-labelledby="materials-title">
        <div className="col-span-full flex flex-wrap items-end justify-between gap-24">
          <h2 id="materials-title" className="text-h2 text-ink">Materials and finishes</h2>
          <ArrowLink href="/finishes/">Order codes and finishes</ArrowLink>
        </div>
        {MATERIALS.map((material) => {
          const product = getProductBySlug(material.category, material.slug);
          if (!product?.heroImage?.src) return null;
          return (
            <Link
              key={material.slug}
              href={`/products/${material.category}/${material.slug}/`}
              className="col-span-full sm:col-span-2 md:col-span-4 lg:col-span-10 xl:col-span-8"
            >
              <Plate src={product.heroImage.src} label={`${product.model} hinge, ${material.name.toLowerCase()}`} ratio="4 / 5" sizes="(min-width: 1024px) 30vw, 100vw" />
              <p className="mt-16 text-c1 font-semibold text-ink"><span className="short-marker">{material.name}</span></p>
              <p className="mt-4 text-c2 text-ink-secondary">{material.line} Shown: {product.model} hinge.</p>
            </Link>
          );
        })}
      </section>

      <section className="col-content mt-128 grid w-full grid-cols gap-x gap-y-64 lg:mt-176" aria-labelledby="features-title">
        <h2 id="features-title" className="sr-only">In focus</h2>
        {features.map((feature, index) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={
              index === 0
                ? "col-span-full"
                : "col-span-full sm:col-span-2 md:col-span-4 lg:col-span-5 xl:col-span-12"
            }
          >
            {feature.grey ? (
              <Plate src={feature.image} label={feature.alt} ratio={feature.ratio} sizes="(min-width: 1024px) 45vw, 100vw" />
            ) : (
              <MediaPlaceholder src={feature.image} label={feature.alt} ratio={feature.ratio} sizes="(min-width: 1024px) 90vw, 100vw" className="bg-surface-alt" />
            )}
            <p className="mt-16 text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">{feature.eyebrow}</p>
            <p className="mt-8 text-h3 text-ink"><span className="short-marker">{feature.title}</span></p>
            <p className="mt-8 max-w-[56ch] text-c1 text-ink-secondary">{feature.line}</p>
          </Link>
        ))}
      </section>

      <section className="col-content mt-128 grid w-full grid-cols gap-x gap-y-32 lg:mt-176" aria-labelledby="wall-title">
        <div className="col-span-full lg:col-span-4 xl:col-span-8">
          <h2 id="wall-title" className="text-h2 text-ink">One range, shot alike</h2>
        </div>
        <p className="col-span-full text-c1 text-ink-secondary lg:col-span-6 lg:col-start-6 xl:col-span-13 xl:col-start-11">
          Eighteen stainless steel levers from one catalog line, each photographed with its escutcheon in the same
          satin finish, at the same scale and in the same light. Choose by shape, then open the model for its
          dimensions.
        </p>
        <ul className="col-span-full grid grid-cols-3 gap-x-8 gap-y-24 sm:grid-cols-4 lg:grid-cols-6 lg:gap-x-16">
          {WALL.map((slug) => {
            const product = getProductBySlug(HANDLES, slug);
            if (!product?.heroImage?.src) return null;
            return (
              <li key={slug}>
                <Link href={`/products/${HANDLES}/${slug}/`} className="group block">
                  <Plate src={product.heroImage.src} label={`${product.model} stainless steel lever handle`} ratio="1 / 1" sizes="(min-width: 1024px) 15vw, (min-width: 640px) 24vw, 32vw" />
                  <p className="mt-8 text-c2 tabular-nums text-ink group-hover:text-brand">{product.model}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="col-span-full flex justify-end">
          <ArrowLink href={`/products/${HANDLES}/`}>All stainless steel handles</ArrowLink>
        </div>
      </section>

      <section className="col-content mt-128 grid w-full grid-cols gap-x gap-y-48 lg:mt-176" aria-labelledby="families-title">
        <div className="col-span-full lg:col-span-4 xl:col-span-8">
          <h2 id="families-title" className="text-h2 text-ink">{architecture.familiesHeading}</h2>
        </div>
        <p className="col-span-full text-c1 text-ink-secondary lg:col-span-6 lg:col-start-6 xl:col-span-13 xl:col-start-11">
          {architecture.familiesBody}
        </p>
        <ul className="col-span-full grid grid-cols-1 gap-x-24 gap-y-48 sm:grid-cols-2 lg:grid-cols-3">
          {architecture.families.map((family) => {
            const image = FAMILY_IMAGES[family.slug];
            return (
              <li key={family.slug}>
                <Link href={family.href} className="block">
                  {image ? (
                    <Plate src={image.src} label={family.label} ratio="4 / 3" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                  ) : null}
                  <p className="mt-16 flex items-baseline justify-between gap-16">
                    <span className="short-marker text-c1 font-semibold text-ink">{family.label}</span>
                    <span className="flex-none text-c2 tabular-nums text-ink-tertiary">
                      {categoryCounts[family.slug] ?? 0} models
                    </span>
                  </p>
                  <p className="mt-8 text-c2 text-ink-secondary">{family.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="col-span-full flex flex-wrap items-center justify-between gap-24 border-y border-line py-32">
          <p className="max-w-[32ch] text-h3 text-ink">{architecture.conversionTitle}</p>
          <div className="flex flex-wrap gap-16">
            <Button href="/downloads/" variant="secondary">{architecture.downloads}</Button>
            <Button href="/contact/">{architecture.contact}</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
