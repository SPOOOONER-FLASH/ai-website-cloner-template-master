# Contact/catalog publication attempt — 2026-10-03

Agent: Codex. The client explicitly asked to try publishing the completed contact and catalog changes (`7f3394e06df8`). This is a task-specific exception to the normal johns release routing; this computer has 16 GB RAM and no connected johns session.

## Recovery and source sync

- Recovered the missing AGENTS blob and 218 current-main source blobs through the GitHub connector. Every imported byte sequence matched its Git SHA-1; two large UTF-8 files needed exact trailing-newline handling.
- GitHub raw binary downloads recovered 36 missing runtime/public blobs and 97 required build references/previous static chunks. Every blob SHA was checked before writing the object store. No Git remote authentication settings changed.
- Converted only the clean `E:/cantonlock-vis` worktree to non-cone sparse checkout. Other worktrees remain untouched.
- Merged verified current main `4e83433aa510` as `e4527a63463e`. Conflicts existed only in generated SHIPLOG and append-only PUSH-PENDING: remote shiplog retained, both pending histories preserved. Contact settings merged without conflict.
- Original source verification: 447 tests passed, changed-file lint and typecheck passed, browser checked desktop/mobile and ten locale catalog links. Post-sync typecheck is recorded in the finishing update.

## Release attempt

Use a new isolated `E:/release/codex-catalogue-20261003/` checkout, excluding root archives and unrelated old exports. Include all runtime assets, required manifests and previous `out/_next/static` assets. Run the complete `deploy:prep` validation chain with `NEXT_BUILD_CPUS=2`; do not publish a partial HTML/JS patch because the shared promo/contact changes affect the entire site.

The existing dirty `E:/release/release-hyde`, Claude checkout, paused search work and C: migration copy are untouched. Only HYDE `out/` will be staged if the full release passes. Cloudflare purge remains client-only. A source push is not a deployment; verify remote source, generated release and origin deployment separately.
