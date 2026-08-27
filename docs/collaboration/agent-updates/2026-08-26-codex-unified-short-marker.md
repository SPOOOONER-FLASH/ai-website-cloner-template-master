# Codex update — unified monochrome short-marker release

- **Agent:** Codex
- **Scope:** Replaced the remaining red/legacy underline interactions with the shared black `currentColor` short-marker system across breadcrumbs, filters, downloads, search, footer, menu, news, product and project detail surfaces. Kept the A+D thin-frame and hard-offset-shadow direction intact.
- **Interaction safeguards:** Bound card/row markers to an explicit `.short-marker-surface` instead of a generic Tailwind `.group`, so nested product-category rails reveal only the active item. Keyboard focus uses `:focus-visible`; hover remains limited to fine hover pointers; reduced-motion rules remain in force.
- **Overlay safeguard:** Lowered the passive promo rail below the sticky header stacking context so user-requested search and site-menu overlays cannot be covered on mobile.
- **Tests:** `npm run check` passed (lint, typecheck, 475-route build, 23 export/SEO tests, semantic SEO issues 0); `npm test` passed 44/44; `git diff --check` passed; legacy underline token scan is clean.
- **Browser QA:** Verified desktop hover and keyboard focus, group-card hover, promo inverse-colour marker, search results, download rows, category filters and pagination, product finder, `/es/contact/`, 390px mobile layout, hard-shadow keyboard state, menu/promo stacking, horizontal overflow and console warnings/errors.
- **Untouched:** No content timing, catalogue records, generated product data, SEO policy, deployment configuration or Piccolo content was changed. The existing `out/` diff remains the current Codex release-builder baton and will be committed only after this source commit.
- **Risks / follow-up:** The site intentionally remains in the existing `staging` indexing state. Piccolo model mapping, image rights and homepage module work are deferred to the separately reviewed concept phase after this release is live.
