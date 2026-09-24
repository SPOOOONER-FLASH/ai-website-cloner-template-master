# 2026-09-24 · Claude · ship：生成日志冲突自动解决

两个会话各自跑 ship，都提交了新的 SHIPLOG.md，于是并发推送必然在它上面冲突，旁路合并把这报告成
「真冲突，需要人看」（09-24 一小时内两次，积压被迫手动推）。

- `scripts/ship.mjs` `resolveLogConflicts()`：冲突文件只有 SHIPLOG.md / PUSH-PENDING.md 时自动解决——
  SHIPLOG 合并后重新生成，PUSH-PENDING 按 union 保留两边的行。其他任何文件冲突照旧停下报告。
  共用工作区和旁路检出两条合并路径都用它。
- 退出时的积压计数改用 `origin/main..HEAD`（旁路检出是 detached HEAD，`@{u}` 会报错）。
- 测试：临时仓库构造两边同时改两份日志的冲突，解决后合并提交成立、两边积压行都在、无临时文件残留。
