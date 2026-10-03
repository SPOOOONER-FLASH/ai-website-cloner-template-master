import type { Product } from "../data/types";
import { parseOrderCode } from "./order-code.ts";

/**
 * The finish and function switch on a product page — the honest half of an FSB-style
 * configurator.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS AND NOT A RENDERED CONFIGURATOR
 *
 * FSB's product finder swaps finish, rose and keyhole on one handle and re-renders it.
 * That works because FSB renders from its own CAD: every combination is a real part.
 * We have no CAD, and AGENTS.md forbids imagining a metal product, so a render that
 * recolours a lever into a finish nobody photographed is exactly the image that rule
 * exists to stop.
 *
 * What we DO have is the factory's order-code grammar (src/lib/order-code.ts): `587 PBET`,
 * `587 SSBK` and `587 MBET` are one lock in three finish/function combinations, each its
 * own record with its own photograph. Grouping those records gives the same interaction —
 * pick a finish, pick a function, see the part and its order code change — where every
 * option is a SKU the factory sells and every thumbnail is a photograph of that SKU.
 *
 * ---------------------------------------------------------------------------
 * THE RULES
 *
 * 1. Siblings share the category path and the parsed base model. Same base in another
 *    category is a different product that happens to share digits.
 * 2. A record whose code does not parse cleanly (`70 SNKT-1`, `5831-90mm black`) is left
 *    out. Guessing what its trailing token means is how a wrong part gets ordered.
 * 3. An axis is offered only when it has two or more values. One option teaches nothing.
 * 4. Choosing a value keeps the other axis where it is when that combination exists. When
 *    it does not, the option still links to a real SKU, and says which other value it
 *    moves to — so no option ever pretends to a combination the factory does not make.
 */

export type VariantAxis = "finish" | "fn";

export interface VariantOption {
  /** Code(s) for this value: `PB`, `BN+AC` for two-tone, `ET`. */
  value: string;
  /** Record this option leads to. */
  slug: string;
  model: string;
  categoryRoot: string;
  heroImage: Product["heroImage"];
  current: boolean;
  /**
   * Set when choosing this value also changes the other axis, because the exact
   * combination is not made. Holds the other axis's value on the target record.
   */
  alsoChanges?: string;
}

export interface ProductVariants {
  base: string;
  finish: VariantOption[];
  fn: VariantOption[];
}

interface Member {
  product: Pick<Product, "slug" | "model" | "categoryPath" | "heroImage">;
  finish: string;
  fn: string;
}

function memberOf(product: Pick<Product, "slug" | "model" | "categoryPath" | "heroImage" | "modelTbc">) {
  if (product.modelTbc) return null;
  const parsed = parseOrderCode(product.model);
  if (!parsed.base || parsed.unresolved.length || parsed.door) return null;
  if (!parsed.finishes.length && !parsed.fn) return null;
  return {
    base: parsed.base.toUpperCase(),
    member: { product, finish: parsed.finishes.join("+"), fn: parsed.fn ?? "" } satisfies Member,
  };
}

function axisOptions(members: Member[], self: Member, axis: VariantAxis): VariantOption[] {
  const other: VariantAxis = axis === "finish" ? "fn" : "finish";
  const values = [...new Set(members.map((m) => m[axis]))];
  if (values.length < 2) return [];
  return values.map((value) => {
    const candidates = members.filter((m) => m[axis] === value);
    const exact = candidates.find((m) => m[other] === self[other]);
    const target = exact ?? candidates[0];
    return {
      value,
      slug: target.product.slug,
      model: target.product.model,
      categoryRoot: target.product.categoryPath[0],
      heroImage: target.product.heroImage,
      current: target === self,
      ...(exact ? {} : { alsoChanges: target[other] }),
    };
  });
}

/**
 * The finish and function choices for one product, or null when it has no siblings that
 * differ on either axis.
 */
export function productVariants(
  product: Pick<Product, "slug" | "model" | "categoryPath" | "heroImage" | "modelTbc">,
  pool: readonly Pick<Product, "slug" | "model" | "categoryPath" | "heroImage" | "modelTbc">[],
): ProductVariants | null {
  const own = memberOf(product);
  if (!own) return null;
  const path = product.categoryPath.join("/");

  const members: Member[] = [];
  for (const candidate of pool) {
    if (candidate.categoryPath.join("/") !== path) continue;
    const parsed = candidate.slug === product.slug ? own : memberOf(candidate);
    if (!parsed || parsed.base !== own.base) continue;
    /* Two records with the same finish and function are duplicates, not choices. */
    if (members.some((m) => m.finish === parsed.member.finish && m.fn === parsed.member.fn)) {
      if (candidate.slug !== product.slug) continue;
      const i = members.findIndex((m) => m.finish === parsed.member.finish && m.fn === parsed.member.fn);
      members[i] = parsed.member;
      continue;
    }
    members.push(parsed.member);
  }
  if (members.length < 2) return null;

  const self = members.find((m) => m.product.slug === product.slug);
  if (!self) return null;

  const finish = self.finish ? axisOptions(members.filter((m) => m.finish), self, "finish") : [];
  const fn = self.fn ? axisOptions(members.filter((m) => m.fn), self, "fn") : [];
  if (!finish.length && !fn.length) return null;
  return { base: own.base, finish, fn };
}

export interface FamilyMember {
  slug: string;
  model: string;
  /** Finish code(s), `+`-joined for two-tone; empty when the code carries no finish. */
  finish: string;
  /** Function code; empty when the code carries none. */
  fn: string;
  heroImage: Product["heroImage"];
}

export interface VariantFamily {
  /** `<category path>::<base>` — unique across the catalogue. */
  key: string;
  base: string;
  categoryPath: string[];
  name: string;
  members: FamilyMember[];
}

/**
 * Every family of two or more cleanly coded SKUs, for the configurator studio. The same
 * grouping as `productVariants`, so the studio and the product page can never disagree
 * about which records are one product in different finishes.
 */
export function variantFamilies(
  pool: readonly Pick<Product, "slug" | "model" | "name" | "categoryPath" | "heroImage" | "modelTbc">[],
): VariantFamily[] {
  const families = new Map<string, VariantFamily>();
  for (const product of pool) {
    if (!product.heroImage?.src) continue;
    const parsed = memberOf(product);
    if (!parsed) continue;
    const key = `${product.categoryPath.join("/")}::${parsed.base}`;
    let family = families.get(key);
    if (!family) {
      family = { key, base: parsed.base, categoryPath: product.categoryPath, name: product.name, members: [] };
      families.set(key, family);
    }
    const { finish, fn } = parsed.member;
    if (family.members.some((m) => m.finish === finish && m.fn === fn)) continue;
    family.members.push({ slug: product.slug, model: product.model, finish, fn, heroImage: product.heroImage });
  }
  return [...families.values()].filter((family) => {
    if (family.members.length < 2) return false;
    /* An empty code is "not stated", not a choice — `54 DK` beside `54 SNDK` is one finish. */
    const finishes = new Set(family.members.map((m) => m.finish).filter(Boolean));
    const fns = new Set(family.members.map((m) => m.fn).filter(Boolean));
    return finishes.size >= 2 || fns.size >= 2;
  });
}
