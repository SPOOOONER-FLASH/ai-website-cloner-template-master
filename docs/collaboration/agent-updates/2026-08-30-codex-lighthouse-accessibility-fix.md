# Codex update — homepage Lighthouse semantics

- Agent: Codex
- Scope: homepage accessibility and link semantics only
- Changed:
  - Mobile `More links` disclosure heading now follows the page `h1` with an `h2`.
  - The modern tubular lock card CTA now names its destination instead of using generic `Learn more` text.
- Validation:
  - `node --test src/components/site/home-accent.test.ts` — 7 passed
  - `npm run lint` — passed
  - `npm run typecheck` — passed
  - `git diff --check` — passed
- Untouched: Kimi SEO/GEO metadata, generators, project content, product JSON, and committed `out/`.
- Next useful review: rebuild the static release and confirm the two Lighthouse audits at the public edge.
