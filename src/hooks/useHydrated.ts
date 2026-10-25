"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False in the static HTML and during hydration, true once React owns the page.
 *
 * A form's submit button waits for it. Before hydration a click is the browser's own submit:
 * a GET to the same page with every field in the address bar (name, email, message), which
 * sends nothing and hands the buyer's details to the URL and to analytics' page_location.
 * Seen on /fr/contact/ in a slow dev build, 2026-10-25; on a slow phone it is the same race.
 *
 * useSyncExternalStore rather than an effect that sets state: the server snapshot (false)
 * is used for hydration and the client one (true) straight after, with no extra render pass
 * to schedule by hand.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
