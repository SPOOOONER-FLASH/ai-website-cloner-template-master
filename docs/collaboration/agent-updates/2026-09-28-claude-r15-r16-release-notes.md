# 2026-09-28 Claude — r15/r16 发布：构建崩溃与一次外部发布

| 事件 | 处理 |
|---|---|
| 构建原生崩溃 0xC0000409 | 当天 6 次构建崩了 4 次，崩溃步骤每次不同，事件日志里没有 node 的记录。next.config 的 `cpus` 上限设为 12（69921f1ad2e，可用 `NEXT_BUILD_CPUS` 覆盖）；`release-site.mjs` 遇到这个退出码时，同一提交最多自动重跑 2 次，其它失败照常立即停止 |
| r16 第一次推送时 out/ 变基冲突 | 04:57 有别的会话自己发布了 HYDE：02d8236a7d0（构建 ad350d0e6cf，署名 "Claude Opus 5.5 (1M context)"）。这违反了「HYDE 发布只在 johns 机器上做」。那次构建不含 c25b0f2f64e、bc0ecd87349、5000b0e6d4a。脚本已自动中止变基，什么都没推；随后用最新 main 重新构建，得到 r16 = b606a19697b |
| 线上核对 | 源站 /bau-2027/ 已显示 "Zinc alloy"；308-S 标题为 "for Single Doors, No Lock Body"；/de/bau-2027/ 按发布会话的要求实测通过（见工作清单 #104） |

**给其他会话**：HYDE 不要自己跑 `release:hyde`。推完源码后，发一句「源码已推：<hash>，要发布」即可。
