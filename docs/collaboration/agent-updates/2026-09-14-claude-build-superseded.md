# 2026-09-14 — Claude — 我丢掉了自己的那次构建，理由在这里

## 发生了什么

我跑完 `deploy:prep`、提交了 `be465e5d82`（10,485 个文件），`git push` 被拒：另一台机器
在这期间推了 5 个提交，其中 `057f0a6cf1`「合并上游 8 个提交后整体重出」**已经把我的源码
合进去并整体重出了一次**。

两边各有一份完整的 `out/`。**这种情况不要 rebase，也不要手工合并** —— `NOW.md` 里
2026-09-13 那条已经写过一次：9,587 个生成产物上的冲突，任何一边的版本都不「对」，
手工合出来的更不对。

## 我是怎么确认可以直接丢掉自己那一份的

推之前逐条核对了对方的构建产物里有没有我这一轮的三处改动：

| 查什么 | `origin/main` 的 `out/index.html` |
|---|---|
| 打标编辑图上站了吗 | `editorial-hyde` 出现 2 次 ✓ |
| 首页只剩一张高优先级图吗 | `fetchPriority="high"` 1 处 ✓ |
| gtag 的 head preload 去掉了吗 | 0 处 ✓ |
| 术语表三个改正后的数字 | `16 to 90mm` ✓ `36 to 75mm` ✓ |
| LC 改名 | `LC14 85` ✓ |
| 三张参考页（英西共六页） | 全部存在 ✓ |
| 打标清单条目数 | 20，和我这边一致 ✓ |

再核对我那个提交里**有没有对方没有的源文件** —— 没有，`be465e5d82` 里除了 `out/` 和
`out-rayen/` 只有 57 张响应式候选图，而那 57 张对方也重出了（字节不同，因为是同一张源图
在另一台机器上的重新编码；两份都不比对方「更对」）。

六个源文件逐个哈希比对，`origin/main` 与我本地完全一致：
DemandShowcase.tsx / Analytics.tsx / editorial-images.ts /
what-an-old-padlock-tells-a-lock-factory.json / build-branded-editorial-list.mjs /
audit-dead-css.mjs。

结论：对方那份构建是我这份的超集。`git reset --hard origin/main`。

## 丢掉之后又验了一遍，因为这正是 9-10 出事的地方

重置后在工作树上直接查（不是查 git，是查磁盘）：

```
homepage 引用但磁盘上不存在的 _next 资源：0
/finishes/ /model-lookup/ /glossary/ 及三个 /es/ 版：全部存在
out/images/editorial-hyde/：20 张   out/images/company-hyde/：2 张
```

2026-09-10 那次发布少了 1,871 个文件、首页 JS 全 404，就是因为没做这一步。

## 给下一个人的一条

**两边同时重出 `out/` 的时候，先比对方的构建产物里有没有你的改动，再决定要不要合。**
多数时候答案是「有」，因为对方合的正是你推上去的源码 —— 那就直接 `reset --hard`，
一秒钟的事。真要合的只有源文件，生成产物永远重新生成，不手工调和。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
