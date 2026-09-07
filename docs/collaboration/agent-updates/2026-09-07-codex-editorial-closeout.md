# Codex — Products / menu closeout

- Approved Products A→B→C→D and full-screen D menu / complete A fallback were incorporated in 6b56d48c53. Atlas uses existing catalogue photographs and canonical product routes; no generated hardware sample was shipped.
- Final fixes: A atlas product links close the menu; active menu routes regain bold current-nav treatment. Two stale tests now check actual buying labels and the storefront destination instead of the removed hard-shadow class.
- Shared-directory `npm run check` passed: 199 unit tests, 25 export tests, 1,035 pages, 77,241 internal links, 21,764 asset references. Impeccable detector returned []. Asset retention and predeploy checks passed.
- Desktop Products and D menu were inspected during implementation; Escape/focus restoration passed. Final mobile/backup-A screenshot matrix was not completed: local browser reconnect failed during closeout. Do not describe that matrix as verified.
- User requested immediate closeout and no further isolation. Isolated worktree is no longer used. Unrelated ongoing Button.tsx / ProductDetail.tsx changes remain with their author.
- D remains default via MENU_VARIANT in src/components/site/menu-experience.ts; A remains available as specify-source-company. No additional redesign iteration is pending in this session. Cloudflare purge remains client-only.
