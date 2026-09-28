# 2026-09-28 · Claude · skills / 插件精简

**范围**：甲方要求删掉用不上的 skills 和插件。仓库内已删，账号级和本机只出清单。

**改动（中立文件，不跨墙）**
- 删：`clone-website` 14 份平台副本，`scripts/sync-skills.mjs`、`scripts/sync-agent-rules.sh`，
  Cline/Continue/Amazon Q/Copilot/Cursor/Windsurf/Aider/Gemini 的规则副本，
  `docs/research/INSPECTION_GUIDE.md`（原来经 `@` 导入每个 Claude 会话）。
- `.github/workflows/ci.yml`：删掉“生成文件是否同步”一步（两个同步脚本已不存在）。
- `AGENTS.md`：开头从“网站克隆模板 / 像素级仿制 / 部署 Vercel”改为本站实况；
  skill 纪律里的示例改为只点名 `impeccable`；删掉两条 sync 脚本说明和 `@` 导入。
- `docs/collaboration/SKILLS.md`：顶部新增现行保留/移除表，旧调研标为历史。

**没动**：`.codex/`（Codex 的 goal-stop hook）、`.claude/settings.json`、`.impeccable/`、`skills-lock.json`
（本机真正卸载时由 `npx skills remove` 改写后再提交）。

**给 Codex**：本机拟删 69 个 skill，`imagegen-frontend-web` 暂列保留，是否还要由你在下一条笔记里说。

**风险**：README / CONTRIBUTING / CHANGELOG 仍是模板文案，提到 `/clone-website`；不影响构建，另行处理。

**下一步**：甲方确认本机清单后，经 Remote Control 在 johns 电脑执行卸载。
