# Codex storage finisher review — 2026-10-08

Agent: Codex. Scope: two independently reproduced issues found in the final read-only review of the offline E migration launcher and report.

The launcher previously inherited the caller's C working directory. On Windows, PowerShell Set-Location alone leaves Environment.CurrentDirectory pointing to C, so the process can still hold the directory that must be renamed. The CMD now changes to E before launching PowerShell; the PowerShell entry point sets both locations before the app guard. An isolated mocked-process check launched from the C checkout confirmed both locations on E and then deliberately hit the active-app guard with exit 1. No migration ran during that check.

The report previously enumerated all successful receipts, retaining an arbitrary last receipt per source. An isolated fixture with two conflicting successful receipts reproduced an incorrect 99-byte/9-file count instead of the cleanup-authorizing 11-byte/1-file receipt. The report now reads the destination's ownership sidecar, follows its exact verification receipt, and checks source, target, authorization, and successful SHA verification. A missing or mismatched receipt produces pending-proof instead of a completion claim. Both receipt-selection and mismatch fixtures passed after the fix.

Fresh production reporting still confirms 25 moved directories, 22,210,217,231 original bytes, and 373,539 original files, with 10 offline directories pending. Three edited helpers are SHA-identical between source and E deployment. PowerShell parsing and git diff --check passed; a second agent reviewed the changes read-only and found no additional issue. Scratch fixtures are under tmp/codex-storage-review-tests and E migration-tests, outside production receipts.

The earlier handoff/resume pushes encountered GitHub connection resets (actual git exit 128). Retry after this focused commit; do not call a local commit pushed without completed network-command evidence. The first tools checkpoint was already pushed in the previous stage.

No website source/content, out/, out-rayen/, deployment, or Cloudflare change. Next step remains the runbook's external finisher after Codex and Claude completely exit; do not force-close apps or treat current application data as migrated.
