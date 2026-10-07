# Codex storage migration tools — 2026-10-07

Agent: Codex. Client requested moving all work resources off C, then corrected the destination to E. This is a local Windows storage task; it does not change or deploy either website.

## Finished objective

Added bounded Windows migration helpers under `scripts/windows/storage-migration/`. The prepared executable copy and scripts live in `E:\WorkResources\tools\powershell` and `E:\WorkResources\migration`. No runtime was installed. E's resource directory has a protected ACL granting the current user, SYSTEM, and Administrators access; private Codex state must not inherit E's broad default Users ACL.

Copy uses Robocopy's real exit code, excludes traversal through existing links, recreates links explicitly, and checks every file by SHA-256. Only a successful full verification plus unchanged source/destination inventories permits cutover and removal of the renamed C source. Physical-ancestor, destination-root, explicit-path, and suffix guards protect cleanup; nested links are unlinked without traversing their targets. Windows extended paths are supported.

Recovery restores a source path if a process stops between rename and junction creation. A successful verification record authorizes resuming cleanup of a remaining subset; `CopyOnly` does not clean it. The finisher refuses while Codex/Claude processes run, finishes children before parent migrations, and validates required final mappings before setting `CODEX_HOME` or developer cache variables. It runs from E so its own PowerShell binary does not keep C's runtime open.

## Evidence

- Executed `Test-Migration.ps1`: copy/junction preservation, SHA mismatch rejection, rename recovery, partial-cleanup recovery, CopyOnly and ancestor guards passed.
- PowerShell sources parsed; Python source compiled.
- Standalone E PowerShell returned version 7.6.5; its 658 files / 256,592,846 bytes matched C by SHA-256.
- Finisher's active-app guard rejected execution without stopping apps or changing configuration.
- At checkpoint, two dated C worktree backups had been completely migrated and cleaned (101,843 + 60,206 files); their private E archives preserve all original content. Remaining batch work is still running.

## Untouched work, risks, next assist

Existing E clones, live E worktrees, source photographs, and website source/exports were not overwritten. `out/` and `out-rayen/` were not built, staged, or deployed. Current branch remains `visual/hyde-round1`.

The current C checkout and live `.codex` SQLite/runtime state cannot be switched while this app holds them open. The final handoff must clearly distinguish released C space from prepared E copies and pending offline work. Finish local batch, record fresh measurements, regenerate the client runbook's Word export, and give the client the external one-click finisher. Moving Microsoft Store app installation files remains a Windows Settings operation if its Move button is available; do not manually move `WindowsApps`.
