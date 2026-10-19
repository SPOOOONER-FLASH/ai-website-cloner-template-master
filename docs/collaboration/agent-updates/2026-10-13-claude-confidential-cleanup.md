# 2026-10-13 · Claude · boss ruling: internal process off the site, ISO 9001 reworded

**Scope.** Boss, 10-13: tooling costs, order workflow, QC/inspection process, internal
factory know-how and anything heard internally stay off the website ("只展示产品"). HYDE is
presented as the factory. Client, same day: the ISO 9001 certificate is held by our stamping
plant (never name it), ISO 9001:2015, certificate number published masked as
`69125Q0026****`, valid to 29 October 2028; "since 2002" is unsupported. Ten languages
throughout.

| Phase | Commit | What |
|---|---|---|
| 1 | `6251198d` | `draft: true` on what-it-takes-to-tool-a-new-exit-device, why-the-catalogue-is-this-wide, custom-door-hardware-tooling-2026, moq-tooling-and-lead-time-2026. Services-page CTA to the tooling guide removed (ui key renamed in 7 overlays). |
| 2 | `6954ce56` | Passage cuts in 33 articles (list in the commit message): mould timelines, lead-time promises, "what we catch", tested-in-customers'-names / testing-being-prepared, 307/311 "in testing" → "do not hold certificates today", search-analytics anecdotes, factory-records / reconciliation notes, samples "When to take" + "What we do", qualifying "Applying this to us". Same customers'-names sentence also cut from the certifications pages, company certificates block and the site FAQ. Text mentions of the four drafted articles removed. |
| 3 | this commit | ISO wording: company profile (en/es/pt + overlays), quick facts and fact strip ("ISO 9001:2015" / "stamping plant"), capability step 06, site descriptions (10 locales in `site.ts`), home and company metadata, WelcomeIntro, llms.txt, pt-landing, BAU 2027 column (en/de), site FAQ + overlays, what-a-test-report-actually-covers (body + FAQ), add-faq-es/pt generators. JSON-LD `hasCredential: ISO 9001` removed from the Organization. Five stale ui.json keys that still said "since 2002" deleted. |

**Tests.** Every phase: `npm run content`, `i18n-lint` clean, `titles:check`, `typecheck`
green; `npm test` 469 pass, 1 fail — `taxonomy-redirect-locales` needs `out/`, absent in this
sparse worktree. Test changes: `article-catalogue-claims.test.ts` dropped the four claims on
the drafted why-the-catalogue article (phase 1) and the inventory-count target for
qualifying-a-hardware-supplier (phase 2, the counts lived in the cut section);
`fact-roll.test.ts` fixture now `ISO 9001:2015`; `product-claims.test.ts` message reworded.
The full certificate number appears nowhere in the tree.

**Left as is, on purpose.** OEM wording that is public (company intro "leaves our factory
under our customers' names", Services "tooling cost ... quoted per project", MOQ 300–5,000);
AR-4, master-key chart, "name the inspector and we will book the date"; the ISO mark image in
WelcomeIntro and `certification-marks.svg` (a mark, not a dated claim); the certifications
H1 "What is tested, and in whose name"; the mortise guide's data note on the `Centre
distance` label (no factory reference in it).

**Not done here.** Nothing is live until a HYDE release (`npm run release:hyde`) and
`node scripts/mirror-to-gitlab.mjs`; then the client purges Cloudflare.
