import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The project's type-scale utilities, declared so tailwind-merge stops eating them.
 *
 * ---------------------------------------------------------------------------
 * THE BUG THIS FIXES, AND HOW IT WAS FOUND
 *
 * A mobile audit measured the homepage `h1` at 16px — body size, on the most important
 * heading on the site. The source says `cn("text-h1 text-ink", …)`, which looks correct
 * and is not: tailwind-merge does not know `text-h1`, classifies it by prefix as a TEXT
 * COLOUR, decides it conflicts with `text-ink`, and drops the earlier one. Silently.
 *
 *     cn("text-h1 text-ink")   ->  "text-ink"
 *     cn("text-d1 text-ink")   ->  "text-ink"
 *     cn("text-c1 text-brand") ->  "text-brand"
 *
 * Every custom step in the scale was affected, and it only bites where a size and a
 * colour go through `cn()` together — which is why most of the site was fine and four
 * headings were quietly rendering at body size. The h1 in ProductsEditorialOverview
 * escaped because it writes `className="text-d1 text-ink"` as a literal string.
 *
 * Declaring them as font-size classes makes tailwind-merge treat them as conflicting with
 * each other (correct: `text-h1 text-h2` should keep the last) and NOT with a colour.
 *
 * This list must stay in step with the `.text-*` utilities in src/app/globals.css. It is
 * short and it changes rarely; the alternative — remembering never to combine a size and
 * a colour inside cn() — is a rule nobody can keep.
 */
const TYPE_SCALE = ["d1", "h1", "h1-light", "h2", "h3", "c1", "c2", "lead"];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TYPE_SCALE }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
