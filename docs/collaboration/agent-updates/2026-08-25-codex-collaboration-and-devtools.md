# 轻量协作、网站定位与 Chrome DevTools MCP

- Agent：Codex
- Commit：与本 update 相同的提交
- 目标：取消强制 Agent 锁，降低沟通成本；记录静态门面、SEO/GEO 与登录暂缓决策；为 Codex 和
  Claude 配置 Chrome DevTools MCP。
- 修改范围：`AGENTS.md`、同步生成的跨 Agent 规则、`HANDOFF.md`、技术握手、协作 update 模板；
  删除锁脚本与锁定 pre-commit hook。
- 验证：官方 `chrome-devtools-mcp` 1.7.0 可执行；Claude Code 用户级 MCP 健康检查为 Connected；
  Codex 全局 MCP 已启用 `cmd /c npx -y chrome-devtools-mcp@latest --no-usage-statistics`，并设置
  Windows 环境和 120 秒启动超时。
- 明确未修改：Claude 提交 `0d0c771f` 后继续进行的 CMS 配置源码；所有产品/CMS 内容和 `out/`。
- 已知风险 / 外部阻塞：当前 Codex 任务不会热加载新 MCP；重启任务后才可用
  `performance_start_trace` 做正式冷加载 trace。
- 建议另一方下一步协助或复核：Claude 完成并提交当前 CMS 修复，附自己的独立 update；后续在
  新任务里用 Chrome DevTools MCP 复测生产 TTFB、LCP、缓存和请求链。
