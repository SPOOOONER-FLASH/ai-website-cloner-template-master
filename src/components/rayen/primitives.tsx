import type { ReactNode } from "react";
import { zhPath } from "@/data/rayen";

/**
 * The small shared pieces of the RAYEN 雷茵 site.
 *
 * Kept in one file on purpose: they are twenty-line components with no state, and eight
 * separate files would cost more to navigate than to read. When one of these grows a
 * behaviour it moves out.
 *
 * Nothing here imports from src/components/site/** — that set belongs to HYDE and to
 * Codex. This tree is independent so that a change to either brand cannot break the other.
 */

/* ------------------------------------------------------------------ layout */

export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`shell ${className}`}>{children}</div>;
}

/**
 * A section heading in the Chinese industrial-site convention: a spaced latin line above,
 * the Chinese title below. Both 悍高 and 顶固 use this exact structure, and a Chinese
 * buyer reads its absence as amateurism the way an English reader reads Comic Sans.
 */
export function SectionHead({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <header className={`flex flex-col gap-3 ${alignment}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-[26px] md:text-[34px]">{title}</h2>
      {intro ? (
        <p className={`max-w-[62ch] text-[15px] text-[var(--color-ink-2)] ${align === "center" ? "mx-auto" : ""}`}>
          {intro}
        </p>
      ) : null}
    </header>
  );
}

/* ------------------------------------------------------------------- media */

/**
 * A photograph with its box reserved before it loads.
 *
 * `aspect` is required rather than optional: without it the page reflows as each factory
 * shot arrives, and a page that jumps while you read it feels unfinished no matter how
 * good the photograph is.
 */
export function Photo({
  src,
  alt,
  aspect,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  aspect: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`overflow-hidden bg-[var(--color-surface-alt)] ${className}`} style={{ aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimiser; see next.config.ts */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/**
 * The state for a model with no usable photograph — 78 of the 435.
 *
 * It says so, in words, rather than showing a grey square. Those 78 are models whose only
 * shots carry a Hyland mark over a background that could not be cleaned without damaging
 * the picture (see scripts/build-rayen-product-images.mjs). Naming the gap is the same
 * discipline as the em dash in the spec table: a buyer who reads 「暂无实拍图」 knows what
 * they are looking at and can ask for one, where a blank tile just looks broken.
 */
export function NoPhoto({ model }: { model: string }) {
  return (
    <div className="flex aspect-square flex-col items-center justify-center gap-2 bg-[var(--color-surface-alt)] px-3 text-center">
      <span className="latin text-[15px] text-[var(--color-ink-3)]">{model}</span>
      <span className="text-[12px] text-[var(--color-ink-3)]">暂无实拍图</span>
    </div>
  );
}

/* ------------------------------------------------------------------ links */

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="navlink inline-flex items-center gap-2 text-[15px]">
      {children}
      <span aria-hidden className="latin">
        →
      </span>
    </a>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
}) {
  return (
    <a href={href} className={`btn ${variant === "solid" ? "btn-solid" : "btn-ghost"}`}>
      {children}
    </a>
  );
}

/* --------------------------------------------------------------- spec table */

/**
 * The specification table.
 *
 * This is the most important component on the site. A buyer ordering door hardware from a
 * factory they have not visited is buying the belief that the dimensions are right, and
 * this table is where that belief is either earned or lost. Hence: no truncation, no
 * "查看更多", horizontal scroll rather than wrapped numbers, and an em dash wherever a
 * value is unknown. See AGENTS.md — a dash costs less trust than a plausible number.
 */
export function SpecTable({ specs }: { specs: { label: string; value: string }[] }) {
  if (!specs.length) {
    return (
      <p className="border border-[var(--color-line)] p-6 text-[15px] text-[var(--color-ink-2)]">
        该型号的规格参数尚未整理完成。请直接联系我们索取图纸与尺寸。
      </p>
    );
  }
  return (
    <div className="spec-scroll">
      <table className="spec-table">
        <tbody>
          {specs.map((spec, index) => (
            <tr key={`${spec.label}-${index}`}>
              <th scope="row">{spec.label}</th>
              <td className={/^[\x20-\x7e]+$/.test(spec.value) ? "latin" : undefined}>
                {spec.value.trim() || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------- product card */

export function ProductCard({
  product,
}: {
  product: {
    slug: string;
    model: string;
    name: string;
    categoryPath: string[];
    heroImage?: { src: string; label: string };
  };
}) {
  // Two-level URLs, /products/{category}/{slug}/, matching the shape categories.ts calls
  // the source of truth. A flat /products/{slug}/ would collide with the category routes.
  const href = zhPath(`/products/${product.categoryPath[0] ?? "products"}/${product.slug}/`);
  return (
    <a href={href} className="card group block">
      {product.heroImage ? (
        <Photo src={product.heroImage.src} alt={product.heroImage.label} aspect="1 / 1" />
      ) : (
        <NoPhoto model={product.model} />
      )}
      <div className="border-t border-[var(--color-line)] p-4">
        <p className="latin text-[13px] text-[var(--color-ink-3)]">{product.model}</p>
        <p className="mt-1 text-[15px]">{product.name}</p>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------- facts */

/**
 * The number strip.
 *
 * 悍高 runs 100万㎡ / 1300项专利 / 110个国家 here and it is the most persuasive band on
 * their home page — but it works because those numbers are real and checkable. Ours are
 * derived from the catalogue on this same site, and there are only three of them. Padding
 * this row out to six with a floor area nobody measured would undo exactly the thing the
 * row is for.
 */
export function FactStrip({ facts }: { facts: { value: string; unit: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {facts.map((fact) => (
        <div key={fact.label} className="px-4 py-8 text-center md:py-12">
          <p className="latin text-[34px] leading-none md:text-[48px]">
            {fact.value}
            <span className="ml-1 text-[16px] text-[var(--color-ink-3)] md:text-[18px]">{fact.unit}</span>
          </p>
          <p className="mt-3 text-[13px] tracking-[0.1em] text-[var(--color-ink-2)] md:text-[14px]">
            {fact.label}
          </p>
        </div>
      ))}
    </div>
  );
}
