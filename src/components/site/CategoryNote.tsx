import { ArrowLink } from "./ArrowLink";
import type { CategoryNote as CategoryNoteData } from "@/data/category-notes";

/** Buyer's note under a category summary — see src/data/category-notes.ts. */
export function CategoryNote({ note }: { note: CategoryNoteData | null }) {
  if (!note) return null;
  return (
    <aside className="mt-32 border-t border-line pt-24" aria-labelledby="category-note-title">
      <h2 id="category-note-title" className="text-c1 font-medium text-ink">
        {note.heading}
      </h2>
      <p className="mt-8 text-c1 text-ink-secondary">{note.body}</p>
      <p className="mt-8">
        <ArrowLink href={note.link.href}>{note.link.label}</ArrowLink>
      </p>
    </aside>
  );
}
