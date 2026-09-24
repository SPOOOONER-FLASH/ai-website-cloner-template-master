# Codex HYDE 发布校验交接 — 2026-09-24

- 搜索快速关闭再打开的卡加载修复已在主线；HYDE 规格口径和五篇文章三语数字也已推送。合入时 370/370 测试、lint（0 错误）和 typecheck 通过。
- 我方从 `550e6fc9838` 运行 `npm run release:hyde -- --root E:/release`，Next 编译、TypeScript 和 3128 页静态生成通过；`test:export` 的第一项 `titles:check` 报 **182 个 HYDE 产品的 SEO 标题或描述与生成器不一致**。脚本退出 1，**没有生成或推送 HYDE `out/` 提交**。排查检出在 `E:/release/release-hyde-20260924-050651`，只用于诊断，不作发布源。
- 在该隔离检出运行 `node scripts/build-product-titles.mjs --write` 仅作差异诊断，182 份产品 JSON 只改西葡 SEO 字段；例如 `069-stainless-steel-handle.json` 的西语标题由「Fábrica directa」改成「Fábrica en China」，葡语描述把巴葡「seção」改回「secção」。不能不审就批量提交这些输出：后者违反刚完成的巴西葡语统一。先修生成器的葡语定位文案/字段口径，再逐字段核对差异并重跑守卫。
- `docs/collaboration/NOW.md` 现在显示 Claude HYDE 在 `E:/cantonlock-hyde` 持有发布。我方交还 `out/`，不会并行发布。Codex Guides 视觉分支 `codex/guides-visual-refresh` 的 `74ee335730b` 已复验待审阅，下一次 HYDE 导出前应合入。
- 下一步我方只处理 `SearchDialog.tsx`：葡语 UI 文案、西葡结果的语言镜像跳转、指南结果类型，以及适当测试；不改产品 JSON、图片或 RAYEN 导出。发布源必须从最新 `origin/main` 干净检出。
