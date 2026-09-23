import { Fragment, type ReactNode } from "react";

/**
 * The three inline marks article bodies actually use — `**strong**`, `*emphasis*` and
 * `` `code` `` — turned into elements instead of being printed as punctuation.
 *
 * WHY THIS EXISTS. News bodies were printed paragraph by paragraph as plain strings, and
 * guides printed each paragraph verbatim, so any mark an author wrote reached the page as
 * literal asterisks. On 2026-09-23 the live master-key article carried ten raw `**` and
 * the client read "**Vertical.**" on a guide and asked whether a hasty AI had submitted
 * it. The copy was fine; the renderer never parsed it.
 *
 * DELIBERATELY SMALL. No links, no nesting beyond one level, no HTML. A parser that
 * accepted more would let content change markup, and nothing in content/ needs more.
 * Anything unmatched is left as text, which is the honest failure: a stray `*` in
 * "5*10mm" must stay a multiplication sign, so emphasis requires non-space on both inner
 * edges and no word character on either outer edge.
 */
const TOKEN = /(\*\*(?!\s)[^*\n]+?(?<!\s)\*\*|(?<![*\w])\*(?![\s*])[^*\n]+?(?<![\s*])\*(?![*\w])|`[^`\n]+`)/g;

export function InlineText({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN);
  if (parts.length === 1) return text;
  return parts.map((part, index) => {
    if (index % 2 === 0) return part ? <Fragment key={index}>{part}</Fragment> : null;
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return <em key={index}>{part.slice(1, -1)}</em>;
  });
}
