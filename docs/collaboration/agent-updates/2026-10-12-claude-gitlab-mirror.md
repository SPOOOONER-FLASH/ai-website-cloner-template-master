# 2026-10-12 Claude — server pulls from GitLab; Argentina preview withheld

- GitHub hid the account; server fetch got "Repository not found". Server remote is now
  `ssh://git@altssh.gitlab.com:443/cantonlock-hyde-group/CANTONLOCK-HYDE-project.git`
  (read-only deploy key `cantonlock-server`). Verified: deploy log `13:29:10 updated to fa9c535d095`.
- `scripts/mirror-to-gitlab.mjs`: after every push to origin/main, run it. It pushes one snapshot
  commit (origin/main's tree) — history is not mirrored (9.25 GiB pack > GitLab free 10 GiB).
- `/products/argentina` (en/es) marked noindex + canton-withheld and excluded from pt mirror;
  it blocked r34 with hreflang-target-missing.
- Risk: server disk 6 GB free. RAYEN lane untouched.
