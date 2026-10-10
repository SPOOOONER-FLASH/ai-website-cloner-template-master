# 2026-10-09 · Claude（多语种）· E1 三篇指南七语种标题/描述 + DV06 规格

**来由**：工程会话 09-30 把 E1 三篇（door-hardware-hs-codes-2026、door-preparation-161-and-86-2026、
glass-door-thickness-and-cutouts-2026）的英文 seoTitle/seoDescription 改成买家搜索词在前、数字在前（r21）。
七语种按新英文重译；**西葡不动**（实验对照组，10-14 读数）。

## 做了什么

- 按 sourceHash 实际过期的字段做：hs-codes、door-prep 各两项（标题 + 描述），glass 只有标题（它的七语描述已与新英文一致）。共 35 条。
- 方法：工作流，每语种一名译者 → 两名独立审校（数字/忠实度一路，母语/搜索词/长度一路，都按「推翻」去审）→ 修订。28 个代理，七语种都有修订（fr 3、de 2、ja 2、ko 2、tr 1、ru 4、ar 6 处问题）。例：fr 描述原稿把「Door locks 8301.40」写成「Serrures 8301.40」，丢了「de porte」——正文正是在警告家具锁 8301.30、挂锁 8301.10 被误归，审校改回。
- 搜索词取舍（译者逐条写了理由）：ru「Код ТН ВЭД」、de「Zolltarifnummer」、tr「HS Kodu (GTİP)」、fr「Code SH」与正文 H1 一致。
- 长度：标题 ≤ 70（fitTitle 的上限）；描述拉丁/西里尔/阿拉伯 ≤ 155，日韩 ≤ 100（ko 一条 101 → 98，删「필수」）。品牌后缀只在该语种惯例有且总长 ≤ 70 时保留（只有 de 的 door-prep 保留）。
- 另：DV06 门镜（dv06-door-viewer）英文规格加了 30–50mm (160°) 门厚与 160° 视角，七语种按各自的区间写法补上（单独提交）。

## 测试

- i18n-lint 通过；titles:check 通过；E1 三篇在七语种的 --stale 均为 0。
- npm test：在稀疏 worktree 里借主克隆的 public/ 跑，461 条中 443 通过；4 条失败都与本次无关（借来的 public/ 是 10-05 的状态，早于 10-09 AR-4 合并：spec-sheets 清单、"140" 搜索排序、taxonomy 重定向目标；另一条缺 docs/design-references 的 GLB）。

## 工作方式说明（给下一个会话）

- 本次在 `E:/cantonlock-hyde/tmp/claude-guide-titles`（基于 origin/main 的稀疏 worktree，分支 claude/guide-titles-1009）里做，没动主克隆。主克隆停在 f00b08aacbe6，上面有视觉会话未提交的 85 个 drawings SVG。
- **更正**：我曾告诉工程会话「origin 在 10-05 换了根历史」——错了。E:/cantonlock-hyde 是浅克隆加 blob:none 部分克隆，`.git/shallow` 的边界正好是 de35375459e8，所以看不到更早的提交，merge-base 为空。origin 没有被改写。
- 浅克隆的 merge-base 为空时，`git rev-list --count` 会得出 1726/115 这类假数字；先看 `git rev-parse --is-shallow-repository`。

## 未做（下一步）

- 第二阶段（工作流已在跑）：其余 36 篇指南、25 条新闻的七语 seoDescription（工程会话 #146 改写）、7 篇指南与 3 条新闻改过的段落/FAQ（多为目录计数 588 → 613 等事实更新）。
