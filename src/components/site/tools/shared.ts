/** Classes shared by the four tool pages of 2026-10-19, matching the cylinder calculator's form. */
export const FIELD_CLASS =
  "field min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink";

/** A pressable option. `aria-pressed` carries the state; the class only shows it. */
export const CHIP_CLASS =
  "rounded-card border px-16 py-10 text-c1 transition-colors aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-surface border-line text-ink hover:border-ink";

export const RESULT_KICKER = "text-c2 uppercase tracking-[0.08em] text-ink-secondary";

/** Locale prefix for links built in the browser ("" for English). */
export const prefixOf = (locale: string) => (locale === "en" ? "" : `/${locale}`);

/** {name} placeholders. Local, so a client tool does not pull i18n-core into the bundle. */
export const fill = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);
