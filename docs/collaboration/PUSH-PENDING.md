# 未推送积压

`npm run ship` 三次推不上时写这里（甲方 2026-09-23：推不上就报告，先做别的，不要干等）。
成功推送后，这里的记录随之上传，作为历史保留。

## 2026/9/24 03:44:51 · 三次推送失败

原因：合并停下（远端改了有人正在编辑的文件）：warning: in the working copy of 'out/es/products/lock-cases/lc8520b-lock-case/__next.es.txt', LF will be replaced by CRLF the next time Git touches it / warning: in the working copy of 'out/es/products/lock-cases/lc8520b-lock-case/index.txt', LF will be replaced by CRLF the next time Git touches it

未推送的提交：

- `f3aff3c2f2b` shiplog: 更新上线存档
- `30c65ee87d3` ship：被拒后用 merge 而不是 rebase —— 共用工作区里总有别人的未提交改动
- `c2758224a58` shiplog: 更新上线存档
- `59b1ba8c1c3` 推送纪律：npm run ship 三次不成就记下来去做别的；每次推送自动更新上线存档
- `2012aacb05f` Release two missing HYDE mobile carousel crops

下一次 `npm run ship` 成功时这些会一起推上去。

**已解决（2026-09-24）**：共用工作区有人在重建 out/，合并被挡；旁路检出里又遇到 scripts/release-site.mjs 真冲突（另一会话同时修了它）。手工合并两边改动后推送 `1eb49b135b9`，上面列的提交全部已在远端。

## 2026/9/24 03:59:56 · 三次推送失败

原因：旁路合并也失败：fatal: unable to access 'https://github.com/SPOOOONER-FLASH/ai-website-cloner-template-master.git/': Recv failure: Connection was reset

未推送的提交：

- `d0ca5d29d2e` ship：失败原因过滤 CRLF 警告；积压记录标注已解决

下一次 `npm run ship` 成功时这些会一起推上去。
