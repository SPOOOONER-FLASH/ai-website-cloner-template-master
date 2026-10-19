/**
 * Door handing from two observations (tool page /door-handing-finder/, 2026-10-19).
 *
 * The rule is the one content/news/handing-left-right-and-universal.json publishes:
 * ANSI/BHMA stands OUTSIDE (the key side), names the hinge side, and adds "reverse" when the
 * leaf swings toward you. DIN stands on the side the door opens TOWARD (the pull side) and
 * names the hinge side. So DIN equals the outside hinge side on an out-swinging door, and the
 * mirror of it on an in-swinging one, where the pull side is the inside.
 */
export type HingeSide = "left" | "right";
export type Swing = "away" | "toward";
export type AnsiHand = "LH" | "RH" | "LHR" | "RHR";
export type DinHand = "left" | "right";

export function ansiHand(hinges: HingeSide, swing: Swing): AnsiHand {
  const base = hinges === "left" ? "LH" : "RH";
  return swing === "toward" ? `${base}R` : base;
}

export function dinHand(hinges: HingeSide, swing: Swing): DinHand {
  if (swing === "toward") return hinges;
  return hinges === "left" ? "right" : "left";
}
