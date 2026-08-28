# Codex — events and market visits

- Scope: added CMS-managed `content/events.json`, `/events/`, footer and sitemap entries.
- Published schedule: Canton Fair Phase I (15–19 Oct 2026), BAU Munich (11–15 Jan 2027) and FEICON São Paulo (6–9 Apr 2027), each linked to its organiser source.
- Correction: BAU is 11–15 January, not 9–15 January, according to Messe München.
- Status boundary: all three are labelled planned visits/meetings. None claims an exhibition stand, booth number or confirmed exhibitor status.
- Japan: retained as an unpublished CMS planning record because the event name, city and dates are still unknown.
- Tests: official-date fixtures and claim-boundary tests passed; full `npm test` passed (74 tests); `npm run typecheck` passed.
- Untouched: no `out/` rebuild in this source commit.
