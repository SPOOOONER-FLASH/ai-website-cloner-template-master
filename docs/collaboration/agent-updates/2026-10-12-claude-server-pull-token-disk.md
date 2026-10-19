# 2026-10-12 Claude — server pull fix (token) + disk step 2

- Client ran the 10-10 deploy-key steps and the 10-11 disk commands. Result: `git fetch` → `Repository not found` with the deploy key.
- Verified: deploy key `cantonlock-server` exists, read-only, created 2026-10-12 04:38Z (`gh api repos/.../keys`); account still 404 logged out. So GitHub refuses deploy-key reads while the account is hidden. A user-scoped token works (this machine fetches with one).
- Hand-off `2026-10-12-手动操作-服务器恢复拉取与磁盘第二步.md`: fine-grained PAT, Contents read-only, this repo only, stored in `/root/.git-credentials` via `read -rs` (never shown, never sent to us); remote back to https; `core.sshCommand` unset. Failure leaves the site on the current build.
- Disk (server): `.git` 9.7G, out 5.4G, public 1.6G, `/www/server/panel` 9.5G (abnormal), `/.Recycle_bin` 2.6G, rayen 3.5G (RAYEN lane, not touched). Server checkout is already shallow (`grafted`), so the earlier "save ~10 GB by shallow clone" estimate was wrong; corrected in the hand-off. Asked for 3 more read-only `du` commands.
- Runbook: three server sections (10-10 pull, 10-11 account, 10-11 disk) replaced by one 10-12 section; old text archived in `archive/2026-10-12-runbook-server-pull-and-disk-v1.md`. Also repaired NUL/`\202` bytes that an earlier edit had written into two Desktop paths (the file showed as binary).
- Next: client screenshots → name what can be deleted in 宝塔.
