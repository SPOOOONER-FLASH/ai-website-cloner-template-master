# Historical storage migration instructions — superseded 2026-10-09

这是历史记录，不要照着执行。客户于 2026-10-09 要求 Claude 全部回迁 C；当前操作手册和新迁移计划优先。

# Spooner 操作手册

**最后更新：2026-10-08 · 更新人：Codex**

## 本次要做：把剩余工作资源搬到 E 盘（2026-10-08）

2026-10-08 已核实：25 个目录、373,539 个文件（约 20.7 GiB）已搬到 E 并清除 C 盘原件；C 盘当前可用约 48.4 GiB，空间会随应用运行变化。主项目 `C:\Users\86132\Downloads\cantonlock` 仍是实际目录，Codex/Claude 的部分会话数据、运行时和应用缓存仍在 C 盘，合计 10 个目录待搬，当前应用正在使用。最新完成量和待处理路径由 `scripts/windows/storage-migration/Report-Migration.ps1` 生成，见 `E:\WorkResources\migration\STATUS.md`，不要把“E 上有副本”当成“C 已释放空间”。

**现在只需要完成这一次收尾：**

1. 保存其他正在编辑的文件，完全退出 **Codex 和 Claude**，包括任务栏通知区域里仍运行的图标。右键图标，选择退出。不要只关窗口后让程序继续后台运行。
2. 打开文件资源管理器，在地址栏粘贴 `E:\WorkResources\migration`，按回车，双击 **`Finish-Migration.cmd`**。通常不需要管理员权限；脚本不会强制结束任何应用。
3. 让窗口运行到最后，不要中途关闭。它会搬主项目、Codex/Claude 状态、运行时和应用缓存；完整校验后才清除已迁走的 C 盘原目录。C 的旧地址会保留为目录链接，文件实际存放在 E，因此旧聊天与脚本还能使用原地址。
4. **成功的样子：**窗口最后出现绿色 **`SUCCESS: Work resources are on E`**，随后显示按任意键继续。此时按任意键关闭窗口，再重启 Windows 一次，让新的临时目录和缓存设置生效。
5. 重新打开 Codex，以后选择项目时使用 **`E:\WorkResources\projects\cantonlock`**。旧项目的 C 地址也能访问同一份 E 文件。不要重新复制一个新的 C 项目。

**没有出现 SUCCESS 时怎么处理：**

- 如果显示 `Still running`，说明窗口列出的应用尚未完全退出。退出它们，然后重新双击同一个文件。
- 如果显示 `PENDING`、`Verification failed` 或红色错误，**停在这里，把窗口截图和 `E:\WorkResources\migration\finish-transcript.log` 发给 Codex**。不要自己删除 C 原目录、改动 WindowsApps，或把 E 副本覆盖回去。脚本保留原文件；重试会识别已经搬好的目录。
- 校验和删除都有进度文字，但部分大目录会几分钟没有新文字。只要窗口还在运行，就继续等；完成后有明确的 SUCCESS 或错误，不以窗口消失判断成功。

**设置会怎么变：**只有全部必需目录迁移成功，脚本才会设置以下用户环境变量；原值保存在 `E:\WorkResources\migration\environment-before.json`：

| 设置 | 新位置 |
|---|---|
| `CODEX_HOME` | `E:\WorkResources\home\codex` |
| `TEMP`、`TMP` | `E:\WorkResources\Temp` |
| `npm_config_cache` | `E:\WorkResources\caches\npm` |
| `PIP_CACHE_DIR` | `E:\WorkResources\caches\pip` |
| `CLAUDE_CODE_TMPDIR` | `E:\WorkResources\Temp\claude` |

Codex 的无项目工作区设置目前已经指向 E。仅改 `CODEX_HOME` 不能覆盖桌面运行时、应用包缓存和原项目，因此这次同时迁移这些实际目录。`CODEX_HOME` 是 OpenAI 公开支持的配置入口：[官方环境变量说明](https://learn.chatgpt.com/docs/config-file/environment-variables)。不要先把它指向空目录，那会暂时看不到原来的聊天、技能和配置。

Claude 的大目录 `.claude` 已通过旧地址的目录链接放在 E；独立全局配置 `C:\Users\86132\.claude.json`（约 68 KB）继续使用原位置。`CLAUDE_CONFIG_DIR` 保持现状，因为本机 E 数据目录里的同名文件是另一份 615 字节的旧配置，直接改这个变量会读错全局设置。

**程序安装本体要搬时：**打开 Windows **设置 → 应用 → 已安装的应用**，找到 Codex（名称也可能显示 ChatGPT）和 Claude，分别展开菜单；如果有 **移动** 按钮，选择 **E:** 后确认。没有移动按钮就先保留，工作数据仍可放 E。不要手动拖动 `C:\Program Files\WindowsApps`。这一步搬的是程序安装文件，前面的收尾脚本搬的是工作数据，两者状态分别核实。

此手册的 Word 导出仍在桌面 `hyde\CLIENT-RUNBOOK.docx`；`hyde` 实际已链接到 E，导出不会新增一份 C 盘工作文件。下方是既有网站后台待办，本次磁盘迁移没有复核那些后台状态。

