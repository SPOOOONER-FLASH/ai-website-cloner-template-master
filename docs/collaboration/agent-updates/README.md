# Claude × Codex 轻量交接

每个完成任务在**同一提交**加入一份独立 update。不要让两位 Agent 同时反复编辑一个总进度文件。

文件名：`YYYY-MM-DD-<agent>-<short-task>.md`

```markdown
# 任务名

- Agent：Claude / Codex
- Commit：与本 update 相同的提交（或明确 SHA）
- 目标：
- 修改范围：
- 验证：
- 明确未修改：
- 已知风险 / 外部阻塞：
- 建议另一方下一步协助或复核：
```

开工前：

```bash
git status --short
git log --oneline -5
git diff --name-only
git log -5 -- docs/collaboration/agent-updates/
```

陌生未提交路径默认属于另一方；不要还原、格式化、暂存或提交。非重叠工作可以直接继续。

`out/` 例外：看到它已经变脏，说明另一方拿着 release-build 接力棒；不要再次 build，只做只读复核。
