# 2026-10-13 Claude — versioned HYDE release log

Goal row #183 (client: 「出一个 hot fix 或者 update 日志 放到 hyde 你命名版本号，记录每次上线什么 有跟踪」).

- `scripts/lib/release-version.mjs`: `vYYYY.MM.DD.N` on the release clock (America/Los_Angeles, the clock all
  docs/collaboration dates use); Hotfix = every site change in the release reads as a fix, else Update.
  Tests: `scripts/lib/release-version.test.mjs`.
- `scripts/build-release-log.mjs` → `docs/collaboration/上线日志-RELEASES.md`: per release, the source commits
  between the previous build and this build that touch anything outside docs/ (docs-only commits counted).
  `--docx` → `Desktop\hyde\06-上线日志\上线日志-RELEASES.docx` (new folder in `scripts/lib/desktop-hyde.mjs`).
- `scripts/release-site.mjs` (hyde): stamps the version into the release commit subject and writes
  `out/release.json` {version, source, builtAt} — only when out/ actually changed.
- `scripts/ship.mjs`: regenerates the log with SHIPLOG in the same `shiplog:` commit; a failure there never blocks a push.
- AGENTS.md rule added under the ship section.

Tests: npm test 490/0, eslint. Older releases (before this) are numbered by derivation; from the next one the
number is stamped.
