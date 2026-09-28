import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/*
  One line, always (09-28, client: 「面包屑……很乱没有逻辑」). It used to flex-wrap, so on a
  phone a long article title broke onto a second line with its separator hanging at the
  left edge, reading like a side menu. Now the trail never wraps: the parent crumbs keep
  their width and only the last item — the current page, already the H1 below — truncates.
  The separator is the same chevron everywhere (the product and project pages had "/").
*/
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-8 overflow-hidden whitespace-nowrap text-c2 text-ink-secondary">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className={cn("flex items-center gap-8", last ? "min-w-0" : "flex-none")}>
            {index ? <BreadcrumbSeparator /> : null}
            {item.href ? (
              <Link href={item.href} className={cn("short-marker short-marker-compact hover:text-brand-hover", last && "truncate")}>
                {item.label}
              </Link>
            ) : (
              <strong className="truncate font-semibold text-ink">{item.label}</strong>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function BreadcrumbSeparator() {
  return (
    <span aria-hidden="true" className="flex-none rtl:rotate-180">
      ›
    </span>
  );
}
