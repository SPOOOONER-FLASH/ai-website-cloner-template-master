import assert from "node:assert/strict";
import test from "node:test";
import {
  analyticsCookieNames,
  consentRequired,
  initialConsent,
  parseChoice,
  serialiseChoice,
} from "./consent.ts";
import { CONSENT_COPY } from "./consent-copy.ts";
import { locales } from "../data/locales.ts";

/**
 * Locks the consent rule of 2026-10-23: GA4 and Clarity never load for a European browser
 * before it says yes, a stored answer is respected everywhere, and declining is offered in
 * every language with the same weight as accepting.
 */

test("European and unknown time zones are asked; others are not, unless the scope says everywhere", () => {
  for (const zone of ["Europe/Berlin", "Europe/London", "Europe/Zurich", "Atlantic/Canary", "Asia/Nicosia", undefined]) {
    assert.equal(consentRequired(zone), true, String(zone));
  }
  for (const zone of ["America/Sao_Paulo", "America/Argentina/Buenos_Aires", "Asia/Dubai", "Asia/Shanghai", "America/New_York"]) {
    assert.equal(consentRequired(zone), false, zone);
    assert.equal(consentRequired(zone, "everywhere"), true, zone);
  }
});

test("nothing loads in Europe without an answer, and a stored answer always wins", () => {
  assert.equal(initialConsent(null, "Europe/Paris"), "ask");
  assert.equal(initialConsent(null, "America/Sao_Paulo"), "granted");
  assert.equal(initialConsent("denied", "America/Sao_Paulo"), "denied");
  assert.equal(initialConsent("granted", "Europe/Paris"), "granted");
});

test("the stored answer round-trips, and an old or garbled one counts as none", () => {
  assert.equal(parseChoice(serialiseChoice("granted")), "granted");
  assert.equal(parseChoice(serialiseChoice("denied")), "denied");
  for (const raw of [null, "", "granted", "0:granted", "1:maybe"]) assert.equal(parseChoice(raw), null);
});

test("withdrawal deletes the GA4 and Clarity cookies and nothing else", () => {
  const cookies = "_ga=GA1.1.1; _ga_RBTE7KF82P=GS1; _clck=abc; _clsk=def; cf_clearance=x; other=1";
  assert.deepEqual(analyticsCookieNames(cookies), ["_ga", "_ga_RBTE7KF82P", "_clck", "_clsk"]);
});

test("every locale has the banner copy, with decline and accept both present", () => {
  for (const locale of locales) {
    const copy = CONSENT_COPY[locale];
    for (const key of ["message", "accept", "decline", "privacy", "settings"] as const) {
      assert.ok(copy[key].trim(), `${locale}.${key}`);
    }
    assert.notEqual(copy.accept, copy.decline, locale);
  }
});
