# Claude：接过 release baton，20 篇 /guides 的导出已构建并提交

**Agent**：Claude　**范围**：`out/`、`out-rayen/`
**前一提交**：`d5603ed`（源码：20 篇文章 + 路由 + Codex 的渲染组件）
**授权**：客户 2026-09-21 明确指示 —— Codex 额度用完（09:48 重置），「你去做完」

## 为什么是我构建

`out/` 脏着 12,726 个文件、`out-rayen/` 3,506 个，但 HEAD 仍停在 `d5603ed` ——
**Codex 没能提交**，额度在半途用完了。按 AGENTS.md，baton 默认在先动 `out/` 的人手上，
但「Ownership 是默认路由规则，不是忽略客户明确要求的理由」。客户明确授权，所以接过。

上了认领板，构建期间挂着，本提交完成后按纪律撤下。

## 没有提交 Codex 留下的那份导出

Codex 自己在渲染合同里写过：

> The current root `out/` belongs to the other release builder; do not replace it with the
> isolated preview export (**which uses a dummy form key**).

所以那份中断状态**没有被提交**。这次是从已提交源码干净重建 —— `npm run deploy:prep`
加载 `.env.local` 与 `.env.production`，真实 Web3Forms key 打进了 7 个文件。
构建前 `out/` 里只有 3 处含真实 key，那正是一份不完整导出的样子。

## 构建结果（真实退出码，不是壳的）

harness 报的是外层 shell 的码 —— 按 2026-09-20 那三次假绿的教训，退出码单独写进
`/tmp/deploy.exit` 再读：**`REAL_EXIT=0`**。

| 检查 | 结果 |
|---|---|
| 死链审计 | 2,158 页 / 173,863 内链 / 52,048 资源引用，**全部解析** |
| 陈旧导出页 | 剪掉 24 → 复检 **0** |
| legacy 301 | up to date（424 个 product id，无链式跳转） |
| segment 布局 | already portable |
| 语义问题（CI 拦截级） | none |
| 新鲜度 | `✅ out/ is newer than every source file` |

编辑质量警告 354 条（231 description-length + 123 title-length）是 report-only，非拦截。

## 发布内容抽查

- `out/guides`、`out/es/guides`、`out/pt/guides` 各 **20 篇** = 60 页
- 管道表渲染成真正的 `<table>`，**英西葡三语都验过** —— Codex 的 `DataTable` 吃下了
  `scripts/guide-lookup-tables.mjs` 产出的 27 张表
- hero 指向 `ju-088-door-closer.webp`（真实照片），文件在 `out/` 里
- 通用封面 `guides-reference-desk-1600.webp` 也在

## 暂存纪律

`git add out/ out-rayen/` **在 commit 之前**跑的。pathspec 形式不加未跟踪文件 ——
2026-09-10 因此漏掉 1,871 个文件、两个首页引用的 chunk 404、客户浏览器显示
「This page couldn't load」。推送前确认：

```
git status --short out/       | grep -c '^??'   →  0
git status --short out-rayen/ | grep -c '^??'   →  0
```

暂存 12,942 + 3,515 个文件。

## 仍然待办（没有塞进这次提交）

**15 个产品的 `Spindle Hole` 规格行写的是 `Copper Construction`** —— 材料写进了尺寸行。
买家扫规格表看到这一行会期待一个 mm 数。正确修法是改标签（如
`Spindle hole construction`），**不是编一个孔径** —— 真实孔径得问工厂。
已开成独立任务。这会改 15 个产品页的规格表，属于下一次发布。

## 给客户的一句

记得 purge。
