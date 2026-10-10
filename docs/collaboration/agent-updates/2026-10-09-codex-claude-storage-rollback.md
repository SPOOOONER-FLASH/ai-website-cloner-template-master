# Codex Claude storage rollback — 2026-10-09

Agent: Codex. Client explicitly requested all Claude resources returned to C because agents could not find memory. This supersedes the Claude part of the earlier E migration. Only this task's `.claude` directory had actually moved; Claude global `.claude.json`, app directories/LocalCache and the shared main checkout remain physical on C. No user or process CLAUDE_CONFIG_DIR/CLAUDE_CODE_TMPDIR was set.

## Completed production rollback

Claude was still running during preparation. After it completely exited, the one-shot helper completed production restoration at 2026-10-09T18:28:44-07:00 without stopping any Claude process. The actual C .claude root is now physical, the active E location no longer exists, and the old alias backup is absent. Current waiter state is complete.

Completion evidence is E:\WorkResources\migration\claude-restore-success.json and a physical C:\Users\86132\.claude directory (no junction). All 1,570 current files / 336,772,582 bytes passed full SHA verification, including a separate post-completion archive-to-C audit recorded in claude-restore-final-audit.json. The E source is retained as E:\WorkResources\archives\claude-before-restore-20261009-d7a4dd306c054f068667ce7280d49ace. C projects now contain 166 JSONL files and four memory/MEMORY.md files; those counts do not prove any specific missing desktop session was recovered. Global config and all Claude AppData roots remain physical C; both Claude user variables remain unset.

## Implemented restore and prevention

Restore-ClaudeData.ps1 copies the entire current E directory into a unique C staging directory, preserves nested links, hashes all source and destination files, verifies unchanged inventories, checks Claude remains exited, installs a physical original C path, and hashes again. Original data survive any failed step. A complete proof and progress record allow recovery if the original link rename or physical C installation was interrupted. Failed staging directories are preserved and never reused; E files are archived, not deleted.

An exclusive file lock prevents simultaneous manual/automatic cutover. Lock contention returns 75; the waiter treats it as another running restore and waits for a successful receipt instead of reporting a false failure. It also detects successful manual completion even if Claude has reopened. An unknown physical C directory or an unrelated link is never overwritten.

Prepare removes all Claude and shared-cantonlock entries. Move rejects stale direct plans for those locations. Finish no longer requires Claude/the shared checkout mapped to E, sets no Claude environment variables, and leaves global TEMP/TMP unchanged. Remaining E work is Codex state/runtime only; this preserves Claude's original work-directory and temporary-directory conventions. Existing live E clones and all previously migrated unrelated archives remain unchanged.

## Validation and handoff

- Isolated fixtures verified wrong-link refusal; physical C restoration; exact memory/session-file and nested-link preservation; repeated invocation; exclusive-lock contention; missing-original, physical-install and archive-install interruption recovery; waiter lock-busy/manual-success handling; and cancellation.
- Real active-app guard initially refused to copy or stop Claude. Once it exited, automatic rollback completed and the final complete-tree SHA audit passed. Stale `.claude`, main-project and Claude AppData/Packages move requests were rejected before mutation.
- PowerShell parsing, deployed/source SHA comparison and git diff --check passed. A second agent reviewed the restore and found no data deletion/overwrite issue; its recovery and lock-status findings were fixed and exercised.
- Old client E instructions were archived as superseded; the completed rollback steps are separately archived. The current runbook says the rollback is complete and gives original C locations; Word was regenerated and its XML checked.
- No website UI/content, out/, out-rayen/, deployment or Cloudflare action. Scratch is under tmp/codex-claude-restore-tests and E migration-tests.

Next assist: Claude can be reopened using the original C project. If one specific desktop session remains missing, investigate its actual project path/session ID with current evidence; do not repeat migration or invent memory contents. Source push is reported separately after the actual network command completes.
