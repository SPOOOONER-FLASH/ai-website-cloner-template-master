import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { splitMentions } from "@/lib/article-products";

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
 * DELIBERATELY SMALL. No link markup, no nesting beyond one level, no HTML. A parser that
 * accepted more would let content change markup, and nothing in content/ needs more.
 * The only links are model numbers matched against the published-model index and passed in
 * by the caller as `links` (src/lib/article-products.ts, 2026-10-12) — never from the text.
 * Anything unmatched is left as text, which is the honest failure: a stray `*` in
 * "5*10mm" must stay a multiplication sign, so emphasis requires non-space on both inner
 * edges and no word character on either outer edge.
 */
const TOKEN = /(\*\*(?!\s)[^*\n]+?(?<!\s)\*\*|(?<![*\w])\*(?![\s*])[^*\n]+?(?<![\s*])\*(?![*\w])|`[^`\n]+`)/g;

function plain(text: string, key: number, links?: ReadonlyMap<string, string>): ReactNode {
  if (!links?.size) return <Fragment key={key}>{text}</Fragment>;
  return <Fragment key={key}>{splitMentions(text, links).map((piece, i) => (typeof piece === "string" ? piece : <Link key={i} href={piece.href} className="text-brand underline decoration-1 underline-offset-2 hover:text-brand-hover">{piece.model}</Link>))}</Fragment>;
}

export function InlineText({ text, links }: { text: string; links?: ReadonlyMap<string, string> }): ReactNode {
  const parts = text.split(TOKEN);
  if (parts.length === 1) return links?.size ? plain(text, 0, links) : text;
  return parts.map((part, index) => {
    if (index % 2 === 0) return part ? plain(part, index, links) : null;
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return <em key={index}>{part.slice(1, -1)}</em>;
  });
}
