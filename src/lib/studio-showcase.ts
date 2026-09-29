import type { Product } from "../data/types";
import { variantFamilies, type FamilyMember, type VariantFamily } from "./product-variants.ts";

/**
 * The family the home page shows to introduce the studio: one model, in every finish the
 * factory lists for it, at the same function.
 *
 * Chosen from the data rather than named, so it cannot go stale when a record is withheld
 * or a family gains a finish: the family whose members share one function in the most
 * finishes wins, ties going to the larger family. Same function matters — a row of the
 * same part in five finishes says "this is a factory with a process"; a row that also
 * changes the lock function under the reader says "these came from somewhere".
 */
export function studioShowcase(
  pool: readonly Pick<Product, "slug" | "model" | "name" | "categoryPath" | "heroImage" | "modelTbc">[],
): { family: VariantFamily; members: FamilyMember[] } | null {
  let best: { family: VariantFamily; members: FamilyMember[] } | null = null;
  for (const family of variantFamilies(pool)) {
    const byFn = new Map<string, FamilyMember[]>();
    for (const member of family.members) {
      if (!member.finish) continue;
      const list = byFn.get(member.fn) ?? [];
      if (!list.some((m) => m.finish === member.finish)) list.push(member);
      byFn.set(member.fn, list);
    }
    for (const members of byFn.values()) {
      if (members.length < 3) continue;
      if (
        !best ||
        members.length > best.members.length ||
        (members.length === best.members.length && family.members.length > best.family.members.length)
      ) {
        best = { family, members: [...members].sort((a, b) => a.finish.localeCompare(b.finish)) };
      }
    }
  }
  return best;
}
