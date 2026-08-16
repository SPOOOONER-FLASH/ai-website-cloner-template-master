import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-8 text-c2 text-ink-secondary">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-8">
          {index ? <span aria-hidden="true">&gt;</span> : null}
          {item.href ? (
            <Link href={item.href} className="underline-offset-4 hover:text-brand-hover hover:underline">
              {item.label}
            </Link>
          ) : (
            <strong className="font-semibold text-ink">{item.label}</strong>
          )}
        </span>
      ))}
    </nav>
  );
}

