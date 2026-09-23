# 雷茵 / HYDE 分界墙

- **Agent**: Claude · **日期**: 2026-09-23
- **甲方**：「雷茵和 hyde 请设立一个墙或者分界线，让两边不要互相干扰，各自独立工作推送部署，必须设置一个好办法。雷茵的东西你不管，不要动。」

## 为什么需要

两站在同一个 Next 应用里构建，一次构建同时重写 `out/` 和 `out-rayen/`；大家又共用一个工作区。
今天两次撞车：我未提交的地址与表面代码改动被一次全量发布带走；我要发布时雷茵正在重建 `out-rayen/`。

## 三道墙（不动雷茵任何文件）

| | 做什么 | 在哪 |
|---|---|---|
| 1 | **各自发布**：干净检出里构建，只提交本站输出目录，推送（被拒则 rebase，两边目录不相交不会冲突），删检出 | `npm run release:hyde` / `release:rayen` → `scripts/release-site.mjs` |
| 2 | **提交守卫**：一个提交同时含两站独占文件 → 拒绝 | `.githooks/pre-commit` → `scripts/site-wall.mjs`；已 `npm run wall:install` |
| 3 | **两根接力棒** | NOW.md 顶部、AGENTS.md「The RAYEN / HYDE wall」 |

路径划分只在 `scripts/lib/site-lanes.mjs` 定义一次。**共用的归中立**：587 个产品记录两站都用、
共享组件、配置 —— 谁都能改，墙不拦；改了会影响雷茵渲染的，在 agent-update 里告知。

## 验证

- 路径分类抽测 15 条全对。
- 守卫用临时索引测（不碰共用暂存区）：跨线拦下；单线 + 中立放行；写理由可放行。
- `release-site.mjs` 未实跑：HYDE 发布棒的状态见 NOW.md，下一次 HYDE 发布用它。

## AGENTS.md 同步改动

- 删掉「`git add out/ out-rayen/` 一起提交」的旧说法。
- 归属表：`out/` → `release:hyde`，`out-rayen/` → `release:rayen`；
  **文章三语润色与本地化 → Claude**（甲方 09-23：Kimi 只打辅助）。
- 已跑 `scripts/sync-agent-rules.sh`。
