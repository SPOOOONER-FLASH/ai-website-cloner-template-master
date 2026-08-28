# Codex — central image ALT management

- Scope: added `content/image-alt-overrides.json` and a CMS singleton so one image path can receive centrally managed English and reviewed Spanish ALT text across products, categories, projects and news.
- Behaviour: exact `/images/` path matches override existing image labels without changing image source, aspect ratio or provenance. Product video posters are covered too.
- Safety: invalid paths, blank English ALT and duplicate image paths fail the build instead of silently depending on list order.
- Tests: `npm test` passed (68 tests); `npm run typecheck` passed.
- Untouched: no existing content ALT was rewritten; the override list starts empty. No `out/` rebuild or deployment is included in this source commit.
- Next assist: editors can add high-value images in the new CMS panel first; future upload workflows can populate the same file without changing page components.
