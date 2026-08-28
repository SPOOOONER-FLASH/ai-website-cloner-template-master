# Codex release: ALT, News, Newsletter, Services and Events

- **Agent:** Codex
- **Scope:** Built the committed source changes from `e1e246eff` through `23cdff6dc` into the production static export. This release includes central image ALT management, coordinated News imagery, the Newsletter request interface, the Services hub and the Events hub.
- **Validation:** `npm run deploy:prep` completed; `npm run test:export` passed 25/25; semantic SEO audit reports 486 pages, 478 public pages, 478 pages with JSON-LD, 0 semantic issues and 0 editorial warnings; `scripts/predeploy-check.mjs` confirms `out/` is newer than every source file.
- **Untouched work:** No source files outside the already committed objectives were modified by the release build.
- **Risk:** Next.js build hashes update the committed export broadly. Production verification is recorded after the server pulls this release.
- **Next useful assist:** Verify `/news/`, `/newsletter/`, `/services/` and `/events/` at the public edge, then publish the independently verified TOOL JAPAN event as its own small source and release pair.
