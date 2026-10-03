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

## Verified source push and complete release

- `npm run ship` succeeded on its first push attempt. `ls-remote` matched local `d2561423707acfaccca8fe1baf76c5fc97280184`; the original source commit is an ancestor. Post-sync typecheck passed after including its required JSON manifests in the source sparse checkout.
- The isolated release checkout used its own copied node_modules directory; source and release dependency lockfiles matched. No runtime, plugin, global configuration or login was installed.
- `NEXT_BUILD_CPUS=2`, `NODE_OPTIONS=--max-old-space-size=3072`: `deploy:prep` completed with exit 0. Next generated 9,235 pages, then the existing pipeline separated the frozen RAYEN output and pruned obsolete exports. HYDE link audit: 8,050 pages, 922,492 links and 197,643 asset references, all resolved; semantic blocking issues 0.
- Full post-export tests: 456 passed, 0 failed, 0 skipped. The earlier sparse-checkout test failures were missing model references/IMAGE_CREDITS and absent pre-build pages; references were restored and all tests passed after export.
- Read-only output review: 20 Downloads/Contact HTML files across ten locales passed order/email checks; 23 referenced scripts existed. The newly generated promo JS includes the download attribute, unchanged raw PDF path, ten labels, minimum 44px target and collapsed details behavior.
- Normal staging tried to retrieve old text blobs during line-ending detection. `git add --renormalize --sparse -- out/`, then explicit `git add --sparse -A -- out/`, completed without fetching old HTML. Only HYDE out was staged; index and disk each contain 71,453 files, with 0 missing and 0 unstaged export files.
- Local release commit: `3dbc0349fda551d79864568200fbdbdd1b8d1289`, parent `d2561423707a`. Git returned 128 while printing its summary because that summary needed an unavailable previous blob; the commit itself exists, its parent/subject are correct, and index equals HEAD. Future partial-clone release commits should use `git commit -q -F <message file>` to avoid summary fetches.
- Upload is using the existing atomic chunk uploader and a task-specific side branch `codex/catalogue-release-20261003`. Source push and local build do not yet establish successful final main upload or production deployment; record the resulting main SHA below when verified.

The standard build regenerated public drawing/search files and the frozen RAYEN mirror inside this isolated checkout. Those incidental source/RAYEN changes are not staged or committed; the published change is HYDE out only.

## Upload diagnosis and navigation proposal

- GitHub connector and a successful read-only `ls-remote` both verified source main `8fe52a86a2d8091e0a3a2da1fd09ebbf7ef6f67c`. The first upload batch remains on the task-specific side branch; no partial batch is published to main.
- Full stderr exposed two separate causes: intermittent local DNS/TCP connectivity, and Git's thin-pack attempt to read old German RSC blobs absent from the partial clone. Offline reachability of the new release was complete; that alone did not prove pack construction would avoid old delta bases.
- Current DNS was verified independently through system DNS and Google DNS, then HTTPS with normal TLS verification and Git read-only access. A process-local `http.curloptResolve` override is used for this attempt only; no shared/global Git or Windows network configuration changed.
- `push --no-thin` did not reach the HTTPS helper: Trace2 shows its child `send-pack --thin`. The exact old RSC blob `8b0bbea21c70a820f3a80d6c2a0c6070a496532a` was restored through the connector with SHA verification, then another old delta base was requested. Rather than retrieve the entire old export, a process-local `pack.window=0` / `pack.depth=0` disables delta-base reads. The exact candidate/parent offline pack completed with exit 0, empty stderr, 48,773,208 bytes.
- A task-owned scratch copy of the uploader resumes from the verified side-branch parent, skips unchanged batches, captures full errors, and preserves normal fast-forward pushes. It leaves the maintained uploader untouched. Batch 2 succeeded with the verified no-delta configuration; later batches and final main publication are still pending at this checkpoint.
- Client also asked for navigation options. Read-only research and the retained HTML proposal cover three directions: procurement tasks (recommended), light entry improvements, and two-tier document navigation. The study does not claim measured CTR and does not modify production navigation.
- Proposal verification: script parses, fragment is 21 KB, three named variants switch correctly; desktop 1024px and mobile 320px have no horizontal overflow. Language selection, menu opening, Escape and direct Downloads selection were checked in the browser. The proposal source and reasoning are retained with this update.

Untouched: other agents' checkouts and claims, production navigation source, RAYEN export, and Cloudflare. Next useful review: select a navigation direction; next release action: verify all uploaded batches, final main out tree and production content separately.

## Final publication verified — 2026-10-03

- Navigation study commit `fc9926b25e2c` and its shiplog `873e46a71591` were pushed; the connector independently verified that source main before final release.
- All thirteen upload batches completed. A GitHub-side unpack error on batch 7 was initially classified as a ref race by the uploader's broad `rejected` match. Only the task-owned scratch copy was narrowed to actual non-fast-forward/fetch-first rejections; retry succeeded. Intermittent TCP resets were handled within the bounded retry loop.
- Final release main: `2b93f729ab8674a2ea87202cb39e176e5dab2cd1`, parent `873e46a7159115f831bd1fe42d0aef3a01a6215e`. The uploader completed with actual exit 0. Its complete out replaces main atomically; the source from current main is preserved.
- The GitHub connector independently verified that main ref and its root tree `917eed12a48a1d9eb3e3305d97e690e94f8eab46`. Remote out tree is `9e670e9d91c678ebd4680b4db73aada16717074b`, exactly the verified local release tree. Diff outside out is empty. Original contact/catalog source commit `7f3394e06df8` is an ancestor of main.
- While the final Git push was waiting, a connector tree-write fallback returned HTTP 403, Resource not accessible by integration. It wrote nothing; the original Git push completed normally. No additional permissions, tokens or integrations were requested.
- Verification remains: complete deploy:prep exit 0, 456 tests passed/0 failed/0 skipped, complete 71,453-file staged export, and the link/semantic/browser checks above. The subsequent navigation study changes only retained proposal documents, not compiled navigation behavior.
- Source worktree fast-forwarded quietly to the verified release; the proposal file was explicitly included in its own sparse patterns so it remains available after sync.

This confirms remote publication of the full export. It does not independently establish that the server's next scheduled pull has finished or that every public response displays it. Do not infer deployment from edge-cache state. Cloudflare purge remains the client's action; the release itself needs no new manual server procedure.
