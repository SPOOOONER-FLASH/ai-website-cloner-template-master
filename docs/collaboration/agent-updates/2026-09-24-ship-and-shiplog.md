# 推送纪律 + 上线存档 + 发布提速

- **Agent**: Claude · **日期**: 2026-09-24

| 甲方要求（09-23） | 做了什么 |
|---|---|
| 服务器老掉线，agent 一直等；推三次推不上就报告、先做别的 | `npm run ship`：最多 3 次、每次限 5 分钟；被拒则 rebase 再推；三次失败写 `PUSH-PENDING.md`、退出码 75、去做别的。`release:*` 同样处理 |
| 每次 push 都写进一个文档，上线存档，方便换电脑 | `docs/collaboration/SHIPLOG.md`，由 `scripts/build-shiplog.mjs` 从 git 历史生成（不会漏记、不会编），每次 `ship` 自动更新并提交；在 GitHub 上任何电脑可看 |
| 提高效率，不要设锁、不要降速 | `release:*` 改为复用 `tmp/release-<站>/`，依赖只在 lock 文件变时重装。分界墙是规则不是锁：提交钩子毫秒级，只拦跨线提交 |

写进 AGENTS.md「Push with npm run ship」，已同步各 agent 规则文件。

## 其他

- 源站实测：20 个待提交的指南网址全部 200、index/follow、canonical 自指、robots.txt 放行；
  但每次 HTML 响应 2.3–4 秒。GSC「实际测试检测到索引编制问题」最可能是那一刻抓取失败，
  已请甲方看「查看实际测试结果」里的具体原因并重试。
- 部署服务器已恢复拉取：线上 master-key 页裸 `**` 从 10 变 0。
