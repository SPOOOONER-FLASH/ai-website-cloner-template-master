# Codex C to E migration handoff — 2026-10-07

Agent: Codex. Scope: local Windows work resources, verified C cleanup, and offline application-state migration. Client corrected destination from D to E; all work uses E. Canonical measurements are generated in `docs/collaboration/tasks/2026-10-07-c-to-e-migration.md`; fresh local status is `E:\WorkResources\migration\STATUS.md`. Re-run `scripts/windows/storage-migration/Report-Migration.ps1` rather than hand-editing totals.

## Completed local stage

The four physical dated worktree backups, sixteen Rayen source backups, old desktop documents, empty visualization backup, npm cache, Claude data directory, and developer-runtime cache now reside on E. Original C addresses are junctions, and renamed physical C originals have been removed after successful verification. Existing live E clones/worktrees and current desktop documents were not overwritten; dated content is retained as private E archives.

The runtime cache encountered a locked `clrjit.dll` during cleanup. The full E copy had already passed SHA-256. After the old helper process exited, the E-based helper verified every remaining original file against E and completed cleanup. No pending renamed C backup remains from this stage.

`CLIENT-RUNBOOK.md` now puts the current migration action first and explains success/error handling. Ran `npm run runbook:docx`; the desktop `hyde` location is already an E junction. Its DOCX zip/XML checks confirmed the new date, finisher filename, and CODEX_HOME instructions. Existing website-backend tasks were not re-audited or declared complete.

## Pending client step

Current checkout, live `.codex` state, OpenAI runtime, Codex/Claude app logs and MSIX LocalCache directories remain physical on C. The prepared `E:\WorkResources\migration\Finish-Migration.cmd` must run outside Codex/Claude after both exit. It launches a SHA-verified standalone PowerShell already copied to E, checks app/resource workers, completes children before parents, preserves C aliases, and writes explicit success/failure evidence. No app was forcibly stopped. Pending work is not a request for another authorization; it is an active-file-handle boundary.

The finisher sets CODEX_HOME only after the complete existing state is migrated and required mappings pass. **CLAUDE_CONFIG_DIR remains unchanged.** Installed Claude computes its separate global config from that variable or userHome; C's current `.claude.json` is 68,059 bytes, whereas the data directory holds a distinct old 615-byte file. Setting the variable to the moved data directory would read that wrong file. The large `.claude` directory is already on E; the small current global configuration stays in C at its existing entry point.

Windows Store installation binaries remain Windows-managed. The running sandbox service binary is under the WindowsApps package, not a directory this finisher moves. Use Windows Settings' Move button if available; do not move WindowsApps manually. No service or global runtime was installed.

## Verification and source handoff

- All migrated original files checked by SHA-256, with exact unchanged inventory at cutover; final aliases and absence of physical cleanup siblings were freshly inspected.
- Recovery, subset cleanup, CopyOnly, mismatch, and junction-ancestor guard fixtures passed. PowerShell parsing/Python compilation and `git diff --check` passed.
- Active-app guard rejected execution without stopping apps or changing settings. Final offline migration itself is pending; do not describe it as already executed.
- Preserve installed per-repo instructions and other agents' existing E working trees. No website UI/content, `out/`, `out-rayen/`, deployment or Cloudflare purge occurred.
- Tools checkpoint `2b13e012b09` was pushed successfully to existing `visual/hyde-round1`. This handoff and generated evidence follow in a separate source commit on that same branch.

Next assist: after the client runs the finisher, inspect `finish-success.json`, `summary.json`, and any failure/transcript file. Verify main checkout and app startup from E, regenerate the tracked report, and archive the completed runbook section with a fresh Word export. Do not repeat copying based solely on C-looking compatibility paths.
