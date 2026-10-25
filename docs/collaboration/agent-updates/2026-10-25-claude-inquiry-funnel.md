# 2026-10-25 · Claude · Inquiry funnel: measured, a captcha dead end fixed, a pre-hydration PII leak closed

## Data

`scripts/pull-analytics-api.mjs` gained two GA4 reports:
- `ga4-funnel-landing`: event × landing page × source;
- `ga4-funnel-date`: day × event.

The four `inquiry_fail_*` events below were added to both.

| | 28 days, self-tests excluded |
|---|---|
| `form_start` | 35 |
| `generate_lead` | 9 (26% of form starts) |
| `contact_click` | 79 |

- **hCaptcha, mandatory since 10-14, did not break the funnel.** Over 60 days, form starts turned into leads at 31 → 6 before 10-14 and 22 → 5 after.
- **Self-tests are in production.** `tagassistant.google.com` and `127.0.0.1:4747` sessions account for 16 of the 60 GA4 key events in 28 days, and for 1 of the 10 `generate_lead`.
- **Direct traffic is mostly automated.** "Direct" is 5,369 of 6,246 sessions, at 9% engagement. Singapore alone is 1,293 sessions at 3%. Compare channels on engaged sessions and external sources.

## Fixed

### `HCaptchaField.tsx`

1. **The dead end.** When the widget never loads (firewall, privacy extension, a network that cannot reach hcaptcha.com):
   - Before: submit said "please complete the verification above" over an empty box, and offered no email route.
   - Now: the box says the verification could not load, and `unavailable()` tells the form.
   - InquiryForm and BauMeetingForm hand over their email fallback, with every field already in the mail.
   - AssetRequestForm and NewsletterForm show the message.
2. **Loading.** It now uses hCaptcha's `onload=` callback; before, it rendered on the script element's load event.
   - hCaptcha warns in the console: "should not render before js api is fully loaded … use in combination with `onload`".
   - A script that has not answered after 20 s counts as unavailable.
3. **Language.** Messages go through `dict()`. The "complete the verification" line already had translations in all seven `ui.json` files, but the old lookup read only en/es/pt/de, so French, Japanese, Korean, Turkish, Russian and Arabic buyers got English. The new "could not load" line was extracted and translated in all seven.

### `src/hooks/useHydrated.ts` (new)

- **The bug.** Before hydration, a click on "send" is the browser's own GET submit. It puts name, email and message in the URL, and so in GA4's page_location, and sends nothing.
- **How it showed.** On /fr/contact/ in a slow dev build, the URL became `?name=…&email=…&message=…`.
- **The fix.** All four forms keep the submit button disabled until hydrated, using `useSyncExternalStore` with a server snapshot of false.

### `analytics-events.ts`

- `trackInquiryFailure(reason)` sends one event name per reason, so GA4 lists them without a custom dimension:
  - `inquiry_fail_captcha_unsolved`
  - `inquiry_fail_captcha_unavailable`
  - `inquiry_fail_send`
  - `inquiry_fail_timeout`
- It has tests.

## Verified

- **In a local dev preview**, with the hCaptcha script blocked:
  - **/contact/:** the box shows the message. Submit shows the status line and the email fallback; the mailto carries the subject and every field, and the read-only copy is there too. `inquiry_fail_captcha_unavailable` fired with locale and page_path.
  - **/fr/contact/:** the box shows the French line.
  - A screenshot is in the session.
- **Not verified in the browser:**
  - **What:** the button enabling after hydration, and the `onload=` load path.
  - **Why:** after the HMR mid-edit error and a server restart, the dev build stopped hydrating on every page, /company/ included. That is environmental: a sparse worktree with borrowed folders and an uncached webpack dev build.
  - **What does cover them:** tsc 0 errors, eslint clean, tests.
  - **Still to do after the next release:** on the live /contact/, check that the button enables and the widget renders. This is read-only and takes a minute.

## Tests

- tsc: 0 errors (with the borrowed folders in place).
- eslint: clean on the changed files.
- `analytics-events`, `inquiry-submit`, `i18n`, `us-spelling` and overlay tests: pass.
- `npm test`: 479 of 498 pass. The 5 failures are environmental:
  - spec-sheet manifest
  - export-only redirects
  - security.txt and cms-config: paths outside the sparse cone

## For the engineering session (GTM / analytics is your lane)

- **Local previews report into production GA4 and Clarity.** This covers `next dev`, and the 127.0.0.1:4747 static-export preview. My own preview sent a handful of test events today; they carry hostName `localhost`.
- **A hostname guard would stop it.** Adding one to the `<Script>` tags in `Analytics.tsx` would not touch the verbatim GTM snippet. The GTM container could also add a hostname condition.
- **Pull filter.** From the next weekly pull, `pull-analytics-api.mjs` could also exclude hostName localhost and 127.0.0.1. Not done today, so that today's raw files stay comparable with this morning's.
- **Tag Assistant debug sessions.** GA4's "Developer traffic" data filter (Admin → Data settings → Data filters) would drop them. That is a client-side switch; it is not in the runbook yet.

## Release

The engineering session releases. A message goes to it after the push.
