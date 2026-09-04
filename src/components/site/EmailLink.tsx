import { cn } from "@/lib/utils";

/**
 * A mailto link Cloudflare will not obfuscate.
 *
 * ---------------------------------------------------------------------------
 * THE PROBLEM THIS SOLVES
 *
 * Bing's Site Scan reported `https://cantonlock.com/cdn-cgi/l/email-protection` as a
 * 4xx error on 2026-09-04. That URL is not in our export — 0 occurrences — because it is
 * not ours: Cloudflare's **Email Address Obfuscation** rewrites every `mailto:` in the
 * HTML as it passes through the edge, turning
 *
 *     <a href="mailto:lock@cantonlock.com">lock@cantonlock.com</a>
 *
 * into
 *
 *     <a href="/cdn-cgi/l/email-protection#b8ccdd…" class="__cf_email__">[email&nbsp;protected]</a>
 *
 * and decoding it back with a script in the browser.
 *
 * THE 404 IS THE SMALLER HALF. A crawler that follows the link without the fragment gets
 * a 404, which is what Bing reported. The larger problem is that **the address itself
 * disappears from the page** for anything that does not run JavaScript — which includes
 * the answer engines this site spent weeks becoming legible to. The `ContactPoint` in our
 * Organization schema publishes `lock@cantonlock.com` as structured, quotable data, and
 * the visible page beside it was saying `[email protected]`. Markup and text disagreeing
 * is the exact failure the SEO audit checks for elsewhere.
 *
 * ---------------------------------------------------------------------------
 * WHY A COMMENT PAIR AND NOT A DASHBOARD SETTING
 *
 * Cloudflare honours `<!--email_off-->` … `<!--/email_off-->` to disable obfuscation for
 * one region of a page. That keeps the fix in this repository, applies exactly where we
 * intend it, and needs nobody to log in — the standing rule here is that the Cloudflare
 * dashboard is the client's alone.
 *
 * It also leaves obfuscation ON everywhere else, which is the right trade: the addresses
 * this component wraps are already published on the contact page, in the footer, and in
 * structured data. They are meant to be readable. Hiding them from a scraper that ignores
 * the hiding, while hiding them from Google and ChatGPT that respect it, is a cost with
 * no matching benefit.
 *
 * `dangerouslySetInnerHTML` is the only way React will emit a raw HTML comment; the two
 * spans render nothing themselves.
 */

function EmailOff({ on }: { on: boolean }) {
  return <span dangerouslySetInnerHTML={{ __html: on ? "<!--email_off-->" : "<!--/email_off-->" }} />;
}

export function EmailLink({
  address,
  subject,
  className,
  children,
}: {
  address: string;
  /** Pre-fills the subject line. Encoded here so callers pass plain text. */
  subject?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const href = subject
    ? `mailto:${address}?subject=${encodeURIComponent(subject)}`
    : `mailto:${address}`;

  return (
    <>
      <EmailOff on />
      <a href={href} className={cn(className)}>
        {children ?? address}
      </a>
      <EmailOff on={false} />
    </>
  );
}
