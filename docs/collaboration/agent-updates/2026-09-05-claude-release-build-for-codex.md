# Claude — 代 Codex 提交发布构建（甲方指派）

**范围**：`out/`（6,201 个路径）。源码不是我写的 —— 是 Codex 的 `2cc2c226ec`
「Ship approved bilingual Products architecture and RFQ Concierge menu」。
`out/` 之外一个文件都没动。

## 为什么是我提交

甲方 2026-09-05 直接指派：「你帮忙提交下 codex 的构建」。
`AGENTS.md` 的归属表是默认路由规则，不是拒绝甲方明确要求的理由。

## 为什么不能直接提交 Codex 那次构建

`node scripts/predeploy-check.mjs` 挡下来了：

```
❌ Source is 7 minute(s) newer than out/.
   The committed build would not match the committed source.
```

Codex 的构建**本身是干净的** —— 1,028 个 `index.html`、segment 布局正常、
`out/images/editorial/hyde-real-*` 九个新图的源文件全部已入库（逐个 `git ls-files`
核过，没有出现「out/ 里有内容在 git 里找不到源码」那种情况）。

问题只是它比我 7 分钟前提交的 `public/downloads/hyde-export-catalogue-2026.pdf` 早。
手工把那个 PDF 拷进 `out/` 能让检查通过，但那是手改一个构建产物 ——
一旦这么做过一次，以后没人能相信 `out/` 是构建出来的。所以重跑了完整的
`npm run deploy:prep`，把两边的源一起构建进去。

## 验证结果

| | |
|---|---|
| 页面 | **1,029**（868 个公开内容页，150 个按设计不索引） |
| JSON-LD | 868 页 |
| 真实 alternate link | 864 页 |
| **语义错误（CI 阻断级）** | **0** |
| 死链审计 | 1,029 页 · 75,855 条内链 · 19,426 个资源引用，**全部可解析** |
| segment 布局 | 可移植 |
| `predeploy-check` | ✅ out/ 比每一个源文件都新 |

报告级警告 3 条（不阻断）：2 条 description 长度、1 条 title 长度。

## 与 Codex 那次构建的唯一差别

多了 `out/downloads/hyde-export-catalogue-2026.pdf` —— 新生成的 62 页无尺寸图版目录。
它目前**没有在 `content/downloads.json` 里注册**，所以站上没有任何页面链到它；
是替换现有那本 46 页扫描版还是并存，等甲方决定。

## 接力棒

发布构建这一轮我做完了，`out/` 交还。Codex 若要继续发布，按 `NOW.md` 重新登记。

## 未做

- `content/downloads.json` 未改（新目录未上架）。
- 首页动画本轮按 Codex 的判断未加入。
