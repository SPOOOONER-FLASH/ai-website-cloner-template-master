# SEO Correctness and Semantic Audit Implementation Plan

> **For Codex and Claude:** execute this plan in focused commits and record each finished scope under `docs/collaboration/agent-updates/`. Preserve unrelated work already present in the shared checkout.

**Goal:** Make the exported bilingual metadata, document language, structured data, sitemap policy, and future production robots policy semantically correct while deliberately leaving the temporary-domain indexing switch off.

**Architecture:** Keep the public site fully static. Fix route metadata at its source, use two documented Next.js root layouts so English and Spanish own their correct document language, and replace the presence-only audit with an HTML-output semantic audit. Put domain-dependent activation behind the existing `siteUrl` and `indexable` launch gate.

**Tech stack:** Next.js 16.3 App Router static export, React 19, TypeScript, Node 24 test runner, generated `out/` HTML.

---

## Task 1: Lock the defects with failing tests

**Files:**

- Create: `scripts/lib/seo-audit.mjs`
- Create: `scripts/seo-audit.test.mjs`
- Modify: `scripts/audit-seo.mjs`
- Modify: `package.json`

1. Add fixture-driven tests proving that alternate-language tags must be real `<link rel="alternate" hreflang>` elements, not ordinary language-switch anchors.
2. Add semantic checks for canonical/OG/Twitter URL agreement, reciprocal locale alternates, `<html lang>`, parseable JSON-LD, safe script serialization, required schema fields, schema URL alignment with the page canonical, and Product/News/FAQ claims matching visible page copy.
3. Add export-level assertions that reproduce the current Spanish project metadata and Spanish document-language defects.
4. Run the new test alone and retain the expected failures before changing production code.

## Task 2: Correct bilingual metadata and document language

**Files:**

- Modify: `src/app/es/projects/[slug]/page.tsx`
- Move: English page routes from `src/app/**` to `src/app/(en)/**` without changing URLs
- Move/Modify: `src/app/layout.tsx` to `src/app/(en)/layout.tsx`
- Create: `src/app/es/layout.tsx`
- Move/Modify: `src/app/not-found.tsx` to `src/app/global-not-found.tsx`
- Modify: `next.config.ts`

1. Give every Spanish project detail its own Spanish canonical, reciprocal alternates, localized Open Graph fields, and localized Twitter fields.
2. Keep every public URL unchanged while moving English routes into an `(en)` route group and making `(en)` and `es` separate documented root layouts.
3. Give the Spanish root localized default metadata and preserve all existing shared chrome/structured data.
4. Use Next 16.3's documented global 404 convention for the multiple-root-layout topology and verify the exported 404 remains styled, English, and `noindex`.
5. Test the generated English and Spanish documents plus cross-root language navigation.

## Task 3: Harden JSON-LD, sitemap freshness, and robots policy

**Files:**

- Modify: `src/components/site/JsonLd.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Create: `src/lib/seo-policy.ts`
- Create: `src/lib/seo-policy.test.ts`

1. Serialize JSON-LD with `<` escaped as `\\u003c`, following the bundled Next.js 16 JSON-LD guide.
2. Remove fabricated build-time `lastModified` values from routes that have no tracked content update date; retain publication dates only for news records that actually have them.
3. Keep staging `Disallow: /` unchanged while `indexable` is false.
4. For the future indexable policy, allow render-critical `/_next/` assets and block only non-page admin/build payload paths.
5. Cover sitemap and robots policy with direct unit tests.

## Task 4: Integrate only justified tooling and hand off to Claude

**Files:**

- Modify: `package.json` and `package-lock.json` only if a tool is used by source or CI
- Create: `docs/collaboration/agent-updates/2026-08-25-codex-seo-correctness-and-tooling.md`

1. Treat downloaded repositories as source distributions, not Codex/Claude plugins.
2. Reuse the already configured Chrome DevTools MCP for live browser verification.
3. Add `schema-dts` only if it materially strengthens the implemented structured-data types; defer Motion, GSAP, Storybook, broad crawlers, and duplicate Lighthouse stacks until a scoped task needs them.
4. Record exact commits, tests, untouched Claude files, the temporary-domain/indexing launch gate, and the commands Claude can use.

## Task 5: Build, inspect, review, and commit

**Files:**

- Generated: `out/**`

1. Wait until the shared working tree contains no unrelated in-progress changes before taking the release-build baton.
2. Run `npm test`, `npm run lint`, `npm run typecheck`, and the focused red/green SEO tests.
3. Run `npm run deploy:prep`, then run the semantic audit over the freshly generated `out/`.
4. Inspect representative English/Spanish home, project, product, and admin HTML outputs; verify staging remains non-indexable.
5. Request an independent read-only code review, address real findings, run `git diff --check`, and stage only explicit task paths.
6. Commit source/audit work first if practical; commit generated `out/` separately as the release-build baton. Do not push unless explicitly authorized in the active request.

## Deferred launch gate (deliberate, not a defect in this task)

- Choose the final production domain.
- Update `siteUrl` to that exact origin.
- Confirm content/certification launch sign-off.
- Flip `indexable` to `true`.
- Rebuild and verify canonical URLs, robots, sitemap, Search Console/Bing Webmaster submission, and production redirects from any temporary host.
