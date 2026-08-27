import Link from "next/link";
import type { Category } from "@/data/types";

export function ProductCategoryRail({ categories }: { categories: Category[] }) {
  return (
    <aside aria-label="Product category navigation" className="border-t border-line xl:border-t-0">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between border-b border-line py-16 text-h3 text-ink marker:content-none">
          <span>Product categories</span>
          <span aria-hidden="true" className="text-ink-tertiary group-open:rotate-45">+</span>
        </summary>
        <ul className="divide-y divide-line">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/products/${category.slug}/`}
                className="group short-marker-surface flex items-start justify-between gap-16 py-14 text-c1 text-ink hover:text-brand-hover"
              >
                <span className="short-marker short-marker-group">{category.name}</span>
                <span aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
