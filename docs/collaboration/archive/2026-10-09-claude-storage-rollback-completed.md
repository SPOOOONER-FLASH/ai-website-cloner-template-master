# Claude storage rollback completed — 2026-10-09

这是已完成的历史记录，不要重复执行。Claude 用户数据已恢复为 C 盘实际目录。

完成时间：2026-10-09T18:28:44.3641598-07:00。完整 SHA-256 校验：1,570 文件，336,772,582 字节。

原件安全备份：`E:\WorkResources\archives\claude-before-restore-20261009-d7a4dd306c054f068667ce7280d49ace`。另作最终全量复核的凭据：`E:\WorkResources\migration\claude-restore-final-audit.json`。

# Spooner 操作手册

**最后更新：2026-10-09 · 更新人：Codex**

## 本次要做：把 Claude 数据恢复到 C 盘（2026-10-09）

客户要求 Claude 的记忆、会话和配置回到原地址。这次实际迁到 E 的 Claude 用户数据只有 `.claude`；独立 `.claude.json`、Claude/Claude-Data/Claude-3p、应用包 LocalCache 和主项目仍在 C。

**当前状态：回迁工具已准备并通过独立目录测试，Claude 仍在运行时不会切换真实数据。** 2026-10-09 检查时，`C:\Users\86132\.claude` 仍是指向 `E:\WorkResources\home\claude` 的目录链接。成功之后它会变回 C 盘上的实际目录。

1. 保存 Claude 正在做的工作，完全退出 **Claude**，包括右下角通知区域里的图标：右键图标，选择退出。只关窗口、留下后台进程不算退出。Codex 可以继续开着处理这次 Claude 回迁。
2. **本次已启动自动等待程序**：Claude 全部退出并稳定十秒后，会自动运行同一个回迁工具，不会强制结束 Claude。保持电脑开着，退出后先不要重开 Claude。可回复“已退出”让 Codex核对完成状态；不需要再点 E 盘迁移程序。
3. 自动程序在后台运行，不会弹出窗口。打开文件资源管理器，在地址栏粘贴 `E:\WorkResources\migration\claude-restore-wait-status.json`，按回车；如果让你选择程序，用记事本打开。看到 **`"state": "complete"`** 表示完成。`waiting-for-Claude-to-exit` 是仍等待退出；`restoring-Claude-to-C` 是正在回迁。完成日志 `E:\WorkResources\migration\claude-restore-wait.log` 中也会出现 **`SUCCESS: Claude data is back in C:\Users\86132\.claude`**。它会先复制当前全部文件、逐个做 SHA-256 校验，再切换目录，并再次校验；不会用旧快照覆盖最近的记忆或会话。
4. 成功后重新打开 Claude，继续使用原来的项目 **`C:\Users\86132\Downloads\cantonlock`**。这次回迁不需要改 `CLAUDE_CONFIG_DIR`，它当前未设置；全局配置仍是 `C:\Users\86132\.claude.json`。

**出错或自动程序不在时：**自动等待最长四小时；电脑重启、等待超时（`expired`）、出错（`failed`）时不会切换未校验的数据。先完全退出 Claude，再在资源管理器打开 `E:\WorkResources\migration`，双击 **`Restore-ClaudeData.cmd`**；等窗口出现绿色 SUCCESS 后再重开 Claude。显示 `RESTORE_ALREADY_RUNNING` 时等另一份程序完成，不要反复启动。如果显示 `Claude is still running`，退出 Claude 后重试。其他红色错误请停止操作，把窗口截图和 `E:\WorkResources\migration\claude-restore-*.log` 给 Codex；不要自行删除 C/E 数据目录。E 原数据会保留为 `E:\WorkResources\archives\claude-before-restore-20261009-…` 安全备份。回迁完成凭据是 `E:\WorkResources\migration\claude-restore-success.json`。

**之后不会再次搬走 Claude：**E 盘迁移计划已移除 `.claude`、Claude AppData、Claude 应用缓存和共用主项目；旧计划即使误调用，也会被路径保护拒绝。此前的完整 E 迁移步骤已移到 `archive/2026-10-09-storage-migration-before-claude-rollback.md`，不要照旧版本执行或打开尚不存在的 `E:\WorkResources\projects\cantonlock`。

其他已迁到 E 的 Codex 缓存、旧工作树和素材归档继续保留。剩余 Codex 数据迁移另行处理，本次不要运行 `Finish-Migration.cmd`。最新实测状态见 `E:\WorkResources\migration\STATUS.md`。

Word 导出仍在桌面 `hyde\CLIENT-RUNBOOK.docx`；Markdown 是权威版本。下方既有网站后台待办本次未重新审核。

