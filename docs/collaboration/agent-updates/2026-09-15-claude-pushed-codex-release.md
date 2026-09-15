# 2026-09-15 — Claude — 推了 Codex 停下时没推的那次发布

## 发生了什么

甲方告知 Codex 已停止工作，让我推送。查下来他们的工作**已经提交完了，只是没推**：

```
87d08e2556  Deploy partial 3D model previews and complete download exports   ← 未推送
93c861c5b6  Publish three partial hardware models with EN/ES previews...     ← 已在远端
```

所以这不是接力棒移交，是一次 `git push`。工作树里剩下的 51 个「已修改」文件
`git diff --numstat` 全是 0/0（只有行尾符差异），8 个未跟踪全是 `.blend1` 自动备份 ——
**没有任何未提交的在途工作**。

## 推之前验了什么

因为这是别人做的构建，推之前当自己的发布验一遍：

| 检查 | 结果 |
|---|---|
| `npm run test:export` | 通过。semantic issues 0 |
| 死链审计 | 1368 页、102,837 条内部链接、31,766 处资源引用，全部解析 |
| `predeploy-check` | `out/` 比每个源文件都新 |
| `npm test` | 299 通过 0 失败 |
| `tsc --noEmit` | 干净 |
| 首页引用但磁盘上不存在的 `_next` 资源 | **0** |
| `out/` 与 `out-rayen/` 未跟踪残留 | **0 / 0** |

**并且确认这次构建带上了我 9-14 那两条**（他们的提交在我的之上）：
`ai8530-lock-case-16x9` 在建好的新闻页里、两张新的应用配套包头图各出现在 8 个页面、
产品页的 `preload="metadata"` 与 `<source type="video/mp4">` 都在。

## 顺带审了他们发布的模型，因为是我按的推送键

三份局部模型（9004S 外形、LC04 锁体包络、70SN 上壳包络）**的披露是干净的**，
和「绝不臆造金属件」一致：

- `index.json` 每条带 `partial: true` 与 `manufacturingReady: false`
- `scope` / `omissions` 双语，逐项列出**没有建**的部分
  （9004S：固定孔、边缘圆角、方轴长度、内部零件、装饰圈）
- 页面上印着 **Partial 3D model** 和
  **"Form reference only. Do not use for machining, door preparation or installation."**
  西语页同样印着 "No se incluyen orificios de fijación…"
- `lc04-case-envelope-scope.txt` 明确写出 15mm 厚度是**假设的闭合值，不是公布的产品尺寸**

换句话说，能下载 GLB 的人不可能不知道它是局部的。

## 给下一个人的一条

**「另一个 agent 停了」的第一步是 `git log origin/main..HEAD`，不是重出构建。**
这次如果直接接棒重跑 `deploy:prep`，就会丢掉一次已经做好、已经验过的构建，
再花二十分钟生成一份字节不同但内容一样的东西 —— 和 9-14 那次
（`2026-09-14-claude-build-superseded.md`）是同一个教训的另一面。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
