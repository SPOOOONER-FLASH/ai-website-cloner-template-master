import Link from "next/link";
import type { Locale } from "@/data/site";
import { finishCode, functionCode } from "@/lib/order-code";
import type { ProductVariants as Variants, VariantOption } from "@/lib/product-variants";
import { tx } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "./MediaPlaceholder";

interface ProductVariantsProps {
  variants: Variants;
  locale: Locale;
}

/** `PB`, or `BN+AC` for two-tone, spelled out; the code itself when the table has no name. */
function nameFor(value: string, axis: "finish" | "fn", locale: Locale): string {
  return value
    .split("+")
    .map((code) => {
      const entry = axis === "finish" ? finishCode(code) : functionCode(code);
      if (!entry?.name) return code;
      return tx(locale, entry.name, { es: entry.nameEs ?? undefined, pt: entry.namePt ?? undefined });
    })
    .join(" / ");
}

/**
 * Finish and function, switched the way FSB's configurator switches them — but between
 * real SKUs. Each option is a link to the sibling record, carries that record's own
 * photograph and prints the order code it leads to, so a buyer sees the exact part and
 * the exact code before the click. See src/lib/product-variants.ts for the rules.
 *
 * Plain links rendered on the server: it works without JavaScript, and the links are
 * the internal structure between siblings that search engines otherwise never see.
 */
export function ProductVariants({ variants, locale }: ProductVariantsProps) {
  const rows = [
    { axis: "finish" as const, label: tx(locale, "Finish", { es: "Acabado", pt: "Acabamento" }), options: variants.finish },
    { axis: "fn" as const, label: tx(locale, "Function", { es: "Función", pt: "Função" }), options: variants.fn },
  ].filter((row) => row.options.length);

  const base = locale === "en" ? "" : `/${locale}`;
  const href = (option: VariantOption) => `${base}/products/${option.categoryRoot}/${option.slug}/`;

  return (
    <div className="mt-32 flex flex-col gap-24">
      {rows.map((row) => (
        <div key={row.axis}>
          <p className="text-c2 text-ink-secondary">{row.label}</p>
          <ul className="mt-8 flex flex-wrap gap-8">
            {row.options.map((option) => (
              <li key={option.value}>
                <Link
                  href={href(option)}
                  aria-current={option.current ? "page" : undefined}
                  className={cn(
                    "flex w-160 items-center gap-8 border bg-surface p-4 pr-8 transition-colors",
                    option.current
                      ? "border-ink"
                      : "border-line hover:border-ink-secondary focus-visible:border-ink",
                  )}
                >
                  <span className="block w-40 shrink-0">
                    <MediaPlaceholder ratio="1 / 1" src={option.heroImage.src} label="" sizes="40px" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-c2 text-ink">{nameFor(option.value, row.axis, locale)}</span>
                    <span className="block truncate text-c2 tabular-nums text-ink-secondary">{option.model}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
