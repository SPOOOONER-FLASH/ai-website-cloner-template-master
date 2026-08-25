import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * Locks the promo dialog's timing to what the client asked for.
 *
 * These two numbers have already been changed out from under the decision once: the
 * client asked for a 10-second delay, a parallel agent moved it to 20 while working on
 * the promo rail, and nobody noticed until the built bundle was inspected by hand. A
 * plain JSON field gives no signal when it drifts, so the agreement is asserted here
 * instead — change the numbers and the test names the decision you are overriding.
 *
 * If the client changes their mind, update BOTH this file and content/promo.json in the
 * same commit. That is the point: the edit becomes deliberate and reviewable rather than
 * incidental.
 */
const AGREED = {
  /** Seconds on the page before the dialog appears. Client's instruction, 2026-08-24. */
  delaySeconds: 10,
  /** Minutes before a dismissed dialog may return. Client's instruction, 2026-08-24. */
  cooldownMinutes: 30,
};

const promo = JSON.parse(readFileSync("content/promo.json", "utf8"));

test("promo dialog keeps the client's agreed timing", () => {
  assert.equal(
    promo.delaySeconds,
    AGREED.delaySeconds,
    `content/promo.json delaySeconds is ${promo.delaySeconds}; the client asked for ` +
      `${AGREED.delaySeconds}. If this is an intentional change, update src/lib/promo-settings.test.ts too.`,
  );
  assert.equal(
    promo.cooldownMinutes,
    AGREED.cooldownMinutes,
    `content/promo.json cooldownMinutes is ${promo.cooldownMinutes}; the client asked for ` +
      `${AGREED.cooldownMinutes}. If this is an intentional change, update src/lib/promo-settings.test.ts too.`,
  );
});

test("promo dialog has no stale hours-based cooldown field", () => {
  assert.equal(
    "cooldownHours" in promo,
    false,
    "cooldownHours was replaced by cooldownMinutes — an hours field cannot express 30 minutes.",
  );
});

test("bumping the campaign is what re-shows it to people who dismissed it", () => {
  assert.equal(typeof promo.version, "number");
  assert.ok(promo.version >= 7, "version should not go backwards; it defeats the cooldown on purpose.");
});
