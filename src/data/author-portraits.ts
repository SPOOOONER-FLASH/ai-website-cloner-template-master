/**
 * The photograph that belongs to a byline, kept in one place.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT A FIELD ON `ArticleAuthor`
 *
 * The author block is repeated on all 82 article records — name, role, credential and
 * profile URL, the same person each time. Adding the portrait there would make it 82 copies
 * of one path, and the day the photograph is replaced, 81 of them would still be right and
 * one would not. Keyed by name here, it is one edit.
 *
 * ---------------------------------------------------------------------------
 * ONLY A REAL PHOTOGRAPH OF THE REAL PERSON
 *
 * Same rule as the byline it sits beside, and as the product photography: supplied by the
 * client, of the person actually named. There is no stock portrait and no generated face
 * here, ever. A reader who catches an invented author photo discounts the credential and
 * the article with it, which is the whole signal the byline exists to carry.
 *
 * Johnson Liu's portrait was supplied by the client on 2026-09-28.
 */
export interface AuthorPortrait {
  /** Square crop, for the byline and for schema.org `Person.image`. */
  src: string;
  width: number;
  height: number;
  /** The full frame at its native aspect, where a page wants the whole portrait. */
  portraitSrc: string;
  portraitWidth: number;
  portraitHeight: number;
}

const PORTRAITS: Record<string, AuthorPortrait> = {
  "Johnson Liu": {
    src: "/images/people/johnson-liu.webp",
    width: 384,
    height: 384,
    portraitSrc: "/images/people/johnson-liu-portrait.webp",
    portraitWidth: 388,
    portraitHeight: 466,
  },
};

/** The portrait for a byline, or undefined where none has been supplied. */
export function authorPortrait(name: string | undefined): AuthorPortrait | undefined {
  return name ? PORTRAITS[name] : undefined;
}
