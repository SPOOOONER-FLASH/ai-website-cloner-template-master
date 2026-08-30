import assert from "node:assert/strict";
import test from "node:test";
import {
  addSessionDismissal,
  PROMO_DISMISSAL_KEY,
  readSessionDismissals,
  writeSessionDismissals,
} from "./promo.ts";

/**
 * Locks the dismissal semantics the client asked for on 2026-08-30: closing a card
 * silences it for the rest of the current browser session; the next session shows it
 * again. Dismissals must NOT live in localStorage — that made every dismissal permanent
 * and hid the rail until a version bump ("the popup is gone", three rounds).
 */

function fakeStore(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

test("dismissals round-trip through the session store", () => {
  const store = fakeStore();
  assert.deepEqual(readSessionDismissals(store), []);
  addSessionDismissal(store, "/contact/");
  addSessionDismissal(store, "/downloads/canton-hyland-product-catalogue-2026.pdf");
  assert.deepEqual(readSessionDismissals(store), [
    "/contact/",
    "/downloads/canton-hyland-product-catalogue-2026.pdf",
  ]);
});

test("adding the same dismissal twice does not duplicate it", () => {
  const store = fakeStore();
  addSessionDismissal(store, "/contact/");
  addSessionDismissal(store, "/contact/");
  assert.deepEqual(readSessionDismissals(store), ["/contact/"]);
});

test("a fresh session store starts empty — dismissal never persists across sessions", () => {
  const sessionOne = fakeStore();
  writeSessionDismissals(sessionOne, ["/contact/"]);
  // sessionStorage is cleared by the browser when the session ends; a new store = a new session.
  const sessionTwo = fakeStore();
  assert.deepEqual(readSessionDismissals(sessionTwo), []);
});

test("corrupt or foreign content reads as no dismissals", () => {
  assert.deepEqual(
    readSessionDismissals(fakeStore({ [PROMO_DISMISSAL_KEY]: "not json" })),
    [],
  );
  assert.deepEqual(
    readSessionDismissals(fakeStore({ [PROMO_DISMISSAL_KEY]: '{"a":1}' })),
    [],
  );
  assert.deepEqual(
    readSessionDismissals(fakeStore({ [PROMO_DISMISSAL_KEY]: '["/a", 42, "/b"]' })),
    ["/a", "/b"],
  );
});

test("a throwing store (private mode) degrades to empty reads and ignored writes", () => {
  const store = {
    getItem: (): string | null => {
      throw new Error("denied");
    },
    setItem: (): void => {
      throw new Error("denied");
    },
  };
  assert.deepEqual(readSessionDismissals(store), []);
  assert.deepEqual(addSessionDismissal(store, "/contact/"), ["/contact/"]);
});
