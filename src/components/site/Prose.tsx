import { marked } from "marked";
import { cn } from "@/lib/utils";

/**
 * Renders CMS-authored Markdown.
 *
 * On the trust boundary: this uses `dangerouslySetInnerHTML`, and that is safe here for
 * a specific reason rather than by assumption. The only path into this field is the CMS,
 * which writes through the GitHub API using the editor's own credentials — anyone able
 * to set this string can already commit arbitrary code to the repository. Sanitising
 * would defend against an attacker who, by definition, does not need this route.
 *
 * That argument stops holding the moment content can arrive from anywhere else. If this
 * site ever accepts copy from an untrusted source, add sanitisation here first.
 *
 * Markdown is rendered at build time — the export is static, so no parser ships to the
 * browser.
 */
export function Prose({ markdown, className }: { markdown: string; className?: string }) {
  const html = marked.parse(markdown, { async: false, gfm: true, breaks: false });

  return (
    <div
      className={cn(
        // Typography is set here rather than in a plugin: the site has its own scale and
        // a prose plugin's defaults would quietly introduce a second one.
        "text-c1 text-ink-secondary",
        "[&_p]:mb-16 [&_p:last-child]:mb-0",
        "[&_h2]:mb-8 [&_h2]:mt-32 [&_h2]:text-h4 [&_h2]:text-ink [&_h2:first-child]:mt-0",
        "[&_h3]:mb-8 [&_h3]:mt-24 [&_h3]:text-c1 [&_h3]:font-bold [&_h3]:text-ink",
        "[&_strong]:font-bold [&_strong]:text-ink",
        "[&_ul]:mb-16 [&_ul]:list-disc [&_ul]:pl-20",
        "[&_ol]:mb-16 [&_ol]:list-decimal [&_ol]:pl-20",
        "[&_li]:mb-4",
        // Links stay monochrome and use the underline as their interaction cue.
        "[&_a]:text-brand [&_a]:underline-offset-4 hover:[&_a]:underline",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
