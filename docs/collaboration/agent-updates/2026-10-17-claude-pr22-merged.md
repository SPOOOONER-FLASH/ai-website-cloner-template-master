# Claude · 2026-10-17 · PR #22 已合并，交接发布步骤

- 甲方确认 Cloudflare 规则 `Block CN and CN crawlers` 已生效，一键屏蔽 AI 爬虫没有打开。按甲方指示把 PR #22 合并进 main（`dfb5b0b5f8`）。
- 云端访问 GitLab 返回 403，也没有密钥，所以本会话无法发布。三步发布（release:hyde → release:rayen → 服务器上运行 install-nginx-redirects.sh）已写进 runbook 顶部，在 johns 机器上执行。
- 屏蔽爬虫的交接文档已经做完，移到 `docs/collaboration/archive/`；`seo-policy.ts` 和 nginx 配置文件里的引用路径已同步改过来。
