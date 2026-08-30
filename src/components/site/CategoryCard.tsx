import Link from "next/link";
import type { Category } from "@/data/types";
import type { Locale } from "@/data/site";
import { MediaPlaceholder } from "./MediaPlaceholder";

interface CategoryCardProps {
  category: Category;
  productCount: number;
  index: number;
  locale?: Locale;
}

export function CategoryCard({ category, productCount, index, locale = "en" }: CategoryCardProps) {
  const es = locale === "es";
  const base = es ? "/es" : "";
  const name = (es && category.nameEs) || category.name;
  const summary = (es && category.summaryEs) || category.summary;
  const count = es
    ? `${productCount} ficha${productCount === 1 ? "" : "s"} verificada${productCount === 1 ? "" : "s"}`
    : `${productCount} verified product${productCount === 1 ? "" : "s"}`;
  const pending = es ? "Fichas en preparación" : "Catalogue records pending";
  return (
    <Link
      href={`${base}/products/${category.slug}/`}
      className="hard-shadow-card group col-span-full flex flex-col bg-surface sm:col-span-12 xl:col-span-6"
    >
      {/* The first row of category cards is above the fold on /products. */}
      <MediaPlaceholder {...category.image} priority={index < 3} />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <div className="flex items-start justify-between gap-24">
          <h2 className="title-marker text-h3 text-ink">
            {name}
          </h2>
          <span className="text-c2 text-ink-tertiary">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="mt-16 text-c1 text-ink-secondary">{summary}</p>
        <p className="mt-24 border-t border-line pt-16 text-c2 text-ink-secondary">
          {productCount ? count : pending}
        </p>
      </div>
    </Link>
  );
}

