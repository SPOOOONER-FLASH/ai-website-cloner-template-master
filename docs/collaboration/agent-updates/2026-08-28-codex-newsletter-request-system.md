# Codex — newsletter request system

- Scope: added `/newsletter/`, a static-export-compatible signup form, direct footer CTA and sitemap entry.
- Behaviour: email plus explicit consent are required; optional company, country and interest fields help the export team route the request. Submission reuses the existing Web3Forms key and channel.
- Honest boundary: this is a subscription request workflow, not a hidden mailing-list database. The page states that clearly so the interface does not overpromise automation that does not yet exist.
- Tests: newsletter route/form contract tests passed; full `npm test` passed (70 tests); `npm run typecheck` passed.
- Untouched: no server action, API route, database or external marketing platform was introduced; no `out/` rebuild in this source commit.
- Next assist: Claude can publish articles without changing this page; a future email platform can replace only the submit transport while preserving the interface and consent fields.
