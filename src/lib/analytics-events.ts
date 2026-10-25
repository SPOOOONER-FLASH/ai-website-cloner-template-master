/**
 * The one analytics event this site actually needs.
 *
 * 2026-09-22, from the two-month review: GA4 reported `form_start` 26 times from 11
 * users and **not one key event anywhere in the property**. Every "which channel is
 * worth more" question was being answered with engagement time as a proxy, because the
 * thing we actually sell — an enquiry — was never measured.
 *
 * The reason `form_submit` never fired is that Enhanced Measurement only sees a form
 * that navigates. Ours posts with fetch and swaps in a success panel, so the browser
 * never leaves the page and GA4 never sees a submission. Nothing was broken; the event
 * simply did not exist.
 *
 * `generate_lead` is GA4's own recommended event name for this. A custom name would
 * work equally well technically and would be worse in practice: the recommended name
 * appears in GA4's event list ready to be marked as a key event, and it survives a
 * property being rebuilt by somebody who does not know our naming.
 *
 * Marking it as a key event is a switch in the GA4 interface, not code. This file makes
 * the event exist so that switch has something to point at — see CLIENT-RUNBOOK.md.
 */

type GtagArgs =
  | ["event", string, Record<string, unknown>]
  | ["js", Date]
  | ["config", string, Record<string, unknown>?];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

export interface LeadEvent {
  /** Which locale the buyer was reading when they sent it. */
  locale: string;
  /** The model the enquiry names, when it names one. */
  model?: string;
  /** The page the form was on, so a lead can be traced to the page that earned it. */
  page?: string;
  /** First-touch source of the session — "chatgpt", "google", "direct" (first-touch.ts). */
  firstTouch?: string;
  /** The guide or news article whose quote link the buyer followed (`guides/<slug>`), 2026-10-12. */
  sourceArticle?: string;
}

/**
 * Fire the lead event. Deliberately total: no throw, no return value, no await.
 *
 * A failed analytics call must never take the success panel down with it. The buyer
 * has already sent the enquiry by the time this runs; whether we counted it is our
 * problem, not theirs.
 */
export function trackLead(event: LeadEvent, gtag = globalThis.window?.gtag): void {
  if (typeof gtag !== "function") return;
  try {
    gtag("event", "generate_lead", {
      locale: event.locale,
      // GA4 drops empty strings inconsistently across its interfaces; omit instead.
      ...(event.model ? { model: event.model } : {}),
      ...(event.page ? { page_path: event.page } : {}),
      ...(event.firstTouch ? { first_touch: event.firstTouch } : {}),
      ...(event.sourceArticle ? { source_article: event.sourceArticle } : {}),
    });
  } catch {
    // An ad blocker, a consent tool, or a stubbed gtag in a test. Never surface it.
  }
}

/**
 * Why an enquiry did not go out. 2026-10-25: 28 days showed 35 `form_start` and 9 `generate_lead`,
 * and nothing in between, so nobody could tell a buyer who walked away from one the form turned away.
 * Since 2026-10-14 every post needs an hCaptcha token, which adds two ways to fail (not solved, or the
 * widget never loaded) to the two Web3Forms already had (rejected, no confirmation in time).
 *
 * One event name per reason (`inquiry_fail_captcha_unsolved` …), so GA4's own event list shows them
 * with no custom dimension to register.
 */
export type InquiryFailure = "captcha_unsolved" | "captcha_unavailable" | "send" | "timeout";

export function trackInquiryFailure(reason: InquiryFailure, event: { locale: string; page?: string }, gtag = globalThis.window?.gtag): void {
  if (typeof gtag !== "function") return;
  try {
    gtag("event", `inquiry_fail_${reason}`, { locale: event.locale, ...(event.page ? { page_path: event.page } : {}) });
  } catch {
    // Same rule as trackLead: counting is our problem, not the buyer's.
  }
}
