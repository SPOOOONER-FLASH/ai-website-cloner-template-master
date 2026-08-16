import Link from "next/link";
import type { Category } from "@/data/types";
import { MediaPlaceholder } from "./MediaPlaceholder";

interface CategoryCardProps {
  category: Category;
  productCount: number;
  index: number;
}

export function CategoryCard({ category, productCount, index }: CategoryCardProps) {
  return (
    <Link
      href={`/products/${category.slug}/`}
      className="group col-span-full flex flex-col border border-line bg-surface hover:border-brand sm:col-span-12 xl:col-span-6"
    >
      <MediaPlaceholder {...category.image} />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <div className="flex items-start justify-between gap-24">
          <h2 className="text-h3 text-ink group-hover:text-brand-hover group-hover:underline">
            {category.name}
          </h2>
          <span className="text-c2 text-ink-tertiary">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="mt-16 text-c1 text-ink-secondary">{category.summary}</p>
        <p className="mt-24 border-t border-line pt-16 text-c2 text-ink-secondary">
          {productCount ? `${productCount} verified product${productCount === 1 ? "" : "s"}` : "Catalogue records pending"}
        </p>
      </div>
    </Link>
  );
}

