import assert from "node:assert/strict";
import test from "node:test";

import { trackLead } from "./analytics-events.ts";

type Call = unknown[];

function recorder() {
  const calls: Call[] = [];
  const gtag = (...args: unknown[]) => {
    calls.push(args);
  };
  return { calls, gtag: gtag as never };
}

test("the lead event uses GA4's recommended name", () => {
  const { calls, gtag } = recorder();
  trackLead({ locale: "en" }, gtag);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "event");
  assert.equal(
    calls[0][1],
    "generate_lead",
    "a custom name would not appear in GA4's own event list ready to be marked a key event",
  );
});

test("the model and page ride along when we have them", () => {
  const { calls, gtag } = recorder();
  trackLead({ locale: "es", model: "5835", page: "/es/contact/" }, gtag);
  assert.deepEqual(calls[0][2], { locale: "es", model: "5835", page_path: "/es/contact/" });
});

test("an absent model is omitted rather than sent empty", () => {
  const { calls, gtag } = recorder();
  trackLead({ locale: "pt", model: "" }, gtag);
  assert.deepEqual(
    calls[0][2],
    { locale: "pt" },
    "GA4 handles empty strings inconsistently across its interfaces; an absent field is unambiguous",
  );
});

test("no analytics is not an error", () => {
  assert.doesNotThrow(() => trackLead({ locale: "en" }, undefined));
});

test("a throwing gtag never reaches the buyer", () => {
  const exploding = (() => {
    throw new Error("blocked by an extension");
  }) as never;
  assert.doesNotThrow(
    () => trackLead({ locale: "en" }, exploding),
    "the inquiry is already sent by the time this runs; failing to count it is our problem, not theirs",
  );
});
