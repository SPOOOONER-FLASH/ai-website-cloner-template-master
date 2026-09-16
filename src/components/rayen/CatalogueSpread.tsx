import { finishesOf } from "@/data/rayen-finishes";
import type { RayenLocale } from "@/data/rayen-i18n";
import { Photo, intrinsicSize } from "./primitives";

/**
 * One category, laid out like a catalogue spread rather than a tile in a grid.
 *
 * WHY THE GRID WENT
 * /products/ was seventeen cards in three columns, each a 128px thumbnail beside four lines
 * of text. It is efficient and it says one thing: we hold a lot of stock. UNION's catalogues
 * say the opposite thing on every page — one subject, large, with room around it — and the
 * client asked for that (2026-09-16: 「union 的 ux design 其实非常好 …… 学习他们的目录美术页面
 * 设计为模板」). A buyer choosing door hardware for a hotel is not shopping a warehouse list.
 *
 * WHAT THIS DOES NOT PRETEND TO HAVE
 * UNION's spreads are built on commissioned room photography. We have ten RAYEN images, seven
 * of which are the press hall, and no per-category lifestyle shot at all. So the large image
 * here is the category's own cover — a real photograph of a real product in that category —
 * shown big, rather than a stock interior that implies a showroom nobody has photographed.
 * The layout borrows the rhythm; it does not borrow a claim.
 *
 * The strip of finish swatches is the same information direction three put on the product
 * cards, raised one level: at a glance, this category comes in brass and black, that one only
 * in stainless. It is the question a buyer asks before opening anything.
 */

export interface SpreadCategory {
  slug: string;
  name: string;
  /* `src` is optional because a category can have no usable cover — src/data/rayen.ts hands
     back whatever it found, and 78 of 435 models have no photograph to be found. */
  image?: { src?: string; label?: string } | null;
  children: { slug: string; name: string }[];
}

export interface SpreadProduct {
  slug: string;
  model: string;
  finishes?: string[];
  heroImage?: { src: string; label: string };
}

export function CatalogueSpread({
  category,
  products,
  href,
  index,
  locale,
  labels,
}: {
  category: SpreadCategory;
  products: SpreadProduct[];
  href: string;
  index: number;
  locale: RayenLocale;
  labels: { modelCount: (n: number) => string; view: string };
}) {
  /* Alternating sides, so the eye zig-zags down the page the way it does across a spread. */
  const imageFirst = index % 2 === 0;

  /* Every finish anywhere in this category, in order of how many models offer it. */
  const finishes = (() => {
    const counts = new Map<string, { label: string; colors: string[]; count: number }>();
    for (const product of products) {
      for (const finish of finishesOf(product.finishes, locale)) {
        if (!finish.swatch) continue;
        const current = counts.get(finish.key);
        if (current) current.count += 1;
        else counts.set(finish.key, { label: finish.label, colors: finish.swatch.colors, count: 1 });
      }
    }
    return [...counts.values()].sort((a, b) => b.count - a.count);
  })();

  /* Four thumbnails, skipping the one already shown large. */
  const thumbs = products
    .filter((product) => product.heroImage && product.heroImage.src !== category.image?.src)
    .slice(0, 4);

  return (
    <section className="border-t border-[var(--color-line)] py-12 first:border-t-0 md:py-20">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div className={imageFirst ? "" : "md:order-2"}>
          {category.image?.src ? (
            <Photo
              src={category.image.src}
              alt={category.image.label ?? category.name}
              aspect="4 / 3"
              priority={index < 2}
            />
          ) : (
            <div className="aspect-[4/3] bg-[var(--color-surface-alt)]" />
          )}
        </div>

        <div className={imageFirst ? "" : "md:order-1"}>
          <p className="eyebrow">{category.slug.replace(/-/g, " ")}</p>
          <h2 className="mt-3 text-[26px] md:text-[34px]">
            <a href={href} className="hover:text-[var(--color-accent)]">
              {category.name}
            </a>
          </h2>
          <p className="latin mt-2 text-[13px] text-[var(--color-ink-3)]">
            {labels.modelCount(products.length)}
          </p>

          {category.children.length ? (
            <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              {category.children.map((child) => child.name).join(" · ")}
            </p>
          ) : null}

          {finishes.length ? (
            <ul className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              {finishes.map((finish) => (
                <li key={finish.label} className="flex items-center gap-2 text-[12px] text-[var(--color-ink-2)]">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full border border-black/15"
                    style={
                      finish.colors.length > 1
                        ? {
                            backgroundImage: `linear-gradient(135deg, ${finish.colors[0]} 0 50%, ${finish.colors[1]} 50% 100%)`,
                          }
                        : { backgroundColor: finish.colors[0] }
                    }
                  />
                  {finish.label}
                </li>
              ))}
            </ul>
          ) : null}

          {thumbs.length ? (
            <ul className="mt-7 flex gap-2">
              {thumbs.map((product) => (
                <li key={product.slug} className="w-1/4 max-w-[92px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
                  <img
                    src={product.heroImage!.src}
                    alt={product.heroImage!.label}
                    {...intrinsicSize(product.heroImage!.src)}
                    loading="lazy"
                    decoding="async"
                    /*
                      A hairline, because most of these are cut-out plates on white. Without
                      it a satin handle on a white ground sits on a white page and reads as an
                      empty box — three of the four thumbs looked broken until the border went
                      on, and they had all loaded fine.
                    */
                    className="aspect-square w-full border border-[var(--color-line)] bg-[var(--color-surface-alt)] object-cover"
                  />
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-7">
            <a href={href} className="navlink inline-flex items-center gap-2 text-[15px]">
              {labels.view}
              <span aria-hidden className="latin">
                →
              </span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
