# 旧 35 篇 /news/ 全部扩写到 ≥1,600 词（三语）

客户指令 2026-09-22：「旧 35 篇现在改为全部扩写」。此前的方案是择优扩写 7 篇，
**已作废**，现在是全部 35 篇。

## 规模（跑 `tmp/claude-seo/expand-order.json` 的生成逻辑可重算）

| | |
|---|---|
| 篇数 | 35 |
| 当前 EN 均长 | 731 词 |
| EN 总缺口 | **30,398 词** |
| 三语合计 | **约 91,000 词** |

分批做，每批 3 篇，**每批独立提交并推送**（客户 2026-09-07 指令：做完一条推送一条）。

## 排序依据：已被 AI 引用的先扩

扩写一篇已经在被引用的文章，回报高于扩写一篇没人引的 —— 引用是已被验证的需求信号。
引用数来自 `docs/research/SEO-GEO-DIGEST-2026-09-22.md`（Bing AI 引用 + Clarity
被引页面取最大值，加 GSC AI Overview 展示）。

| 序 | slug | 引用 | 当前 EN | 缺口 | 状态 |
|---|---|---|---|---|---|
| 1 | push-bar-or-touch-bar-panic-exit-devices | 44 | 1199 | 401 | **已做** 批1 |
| 2 | master-key-systems-how-many-levels-you-need | 27 | 774 | 826 | **已做** 批1 |
| 3 | handing-left-right-and-universal | 23 | 502 | 1098 | **已做** 批1 |
| 4 | finish-codes-us26d-626-630 | 20 | 788 | 812 | **已做** 批2 |
| 5 | mortise-lock-backset-and-centre-distance-guide | 15 | 702 | 898 | **已做** 批2 |
| 6 | reading-door-hardware-model-numbers | 14 | 679 | 921 | **已做** 批2 |
| 7 | euro-cylinder-length-and-split | 10 | 626 | 974 | **已做** 批3 |
| 8 | door-coordinator-double-fire-door | 9 | 753 | 847 | **已做** 批3 |
| 9 | fitting-a-euro-cylinder | 6 | 866 | 734 | **已做** 批3 |
| 10 | what-an-old-padlock-tells-a-lock-factory | 0 | 1093 | 507 | **已做** 批4 1966/1967/1946 |
| 11 | stainless-steel-grades-304-201-316 | 0 | 889 | 711 | **已做** 批4 2029/2176/2116 |
| 12 | narrow-stile-aluminium-door-lock-sag | 0 | 883 | 717 | **已做** 批4 1919/2014/1975 |
| 13 | ansi-grade-1-vs-en-1125-exit-devices | 0 | 840 | 760 | **已做** 批5 1868/1953/1931 |
| 14 | what-a-frameless-glass-door-needs | 0 | 828 | 772 | **已做** 批5 1938/2083/2011 |
| 15 | what-it-takes-to-tool-a-new-exit-device | 0 | 807 | 793 | **已做** 批5 1877/1954/1908 |
| 16 | choosing-a-cylindrical-lock-entrance-privacy-passage | 0 | 767 | 833 | **已做** 批6 EN 1790（ES/PT 待多语言批） |
| 17 | why-the-catalogue-is-this-wide | 0 | 760 | 840 | **已做** 批6 EN 1642（ES/PT 待多语言批） |
| 18 | en-1125-or-ansi-which-standard-your-project-needs | 0 | 720 | 880 | **已做** 批6 EN 1792（ES/PT 待多语言批） |
| 19 | euro-cylinder-range-45-to-90 | 0 | 713 | 887 | **已做** 批7 EN 1626（ES/PT 待多语言批） |
| 20 | rim-night-latch-564-and-1073 | 0 | 711 | 889 | **已做** 批7 EN 1631（ES/PT 待多语言批） |
| 21 | door-stop-holder-or-flush-bolt | 0 | 704 | 896 | **已做** 批7 EN 1702（ES/PT 待多语言批） |
| 22 | what-oem-actually-changes | 0 | 700 | 900 | **已做** 批8 EN 1607（ES/PT 待多语言批） |
| 23 | brass-piano-hinge-is-a-finish-not-a-metal | 0 | 694 | 906 | **已做** 批8 EN 1664（ES/PT 待多语言批） |
| 24 | deadbolt-d101-d102-and-the-rim-alternative | 0 | 693 | 907 | **已做** 批8 EN 1622（ES/PT 待多语言批） |
| 25 | exit-device-push-bar-length | 0 | 692 | 908 | 待做 |
| 26 | ul-305-is-a-listing-not-a-grade | 0 | 675 | 925 | 待做 |
| 27 | lever-handle-range-lh852-lh853-lh855 | 0 | 665 | 935 | 待做 |
| 28 | door-hardware-schedule-guide | 0 | 659 | 941 | 待做 |
| 29 | occupied-vacant-washroom-indicator-bolt | 0 | 645 | 955 | 待做 |
| 30 | stainless-lever-range-9007-9008-9014 | 0 | 638 | 962 | 待做 |
| 31 | what-documents-you-can-actually-get | 0 | 632 | 968 | 待做 |
| 32 | what-a-test-report-actually-covers | 0 | 629 | 971 | 待做 |
| 33 | cross-referencing-a-lock-you-already-buy | 0 | 599 | 1001 | 待做 |
| 34 | trim-handle-or-panic-bar | 0 | 551 | 1049 | 待做 |
| 35 | six-values-an-order-needs | 0 | 526 | 1074 | 待做 |

**做完一篇就把状态改成「已做 + 提交号」。** 这张表是进度的唯一记录。

## 写什么（从复盘数据来，不是凭感觉）

`SEO-GEO-REVIEW-2026-09-22.md` 第 8、9 份报告的结论：**被引用最多的内容是
「A 和 B 哪个好、什么时候选哪个」这类比较**，因为竞争对手两个都卖所以不写。
扩写时优先补这类段落，而不是补「什么是 A」的定义。

数据里现成的、我们还没有页面回答的问题：

- `door stopper ds013 vs ds011`（Bing 上有人搜）
- `is 652 finish the same as us 26d`
- `can chrome metal finish be satin`
- `satin nickel echswc sn product code meaning`
- `steel finish code 626?`
- `euro cylinder lengths`（我们份额只有 18.92%，是强相关题里最弱的）
- `installation coordinator bars overlapping astragals double doors`
- `master keying system chart`（153 次展示 0 点击 —— **那个查询要的是一张图表**）

## 硬约束

- **三语都要 ≥1,600 词**（body / bodyEs / bodyPt），不是只有英文
- **不碰 `heroImage`** —— Codex 在动那个字段（见 NOW.md）
- 葡语用巴西葡语，`npm test` 里的守卫会抓欧葡写法
- 每个数字要能追到来源，追不到就写「未确认」，不编
- 每批跑：`npm test`、`npx tsc --noEmit`、`npm run content`

## 不归我的

`out/` 与 `out-rayen/` 的构建部署 **是 Codex 的 baton**（NOW.md 2026-09-22
「Codex guides DCB」行claim 了）。第二批 20 篇 guides 源码已提交推送，
**等 Codex 放手后一次构建，40 篇 guides + 扩写后的 news 一起上线。**

---

## 2026-09-22 02:12 — 批 2 已完成但未提交

`.git/index.lock` 自 02:01 起被占用（Codex 在密集写文件：`NOW.md`、三个
`layout.tsx`、`Analytics.tsx`、Guide 组件、`build-codex-style-library.mjs`）。
**锁是活的，不是死锁**，不要删。

下一个 session 接手时，工作区里这些改动已完成并通过 `npm test`（361 passed）：

```
content/news/finish-codes-us26d-626-630.json            扩写 1603/1613/1629
content/news/mortise-lock-backset-and-centre-distance-guide.json  1606/1689/1647
content/news/reading-door-hardware-model-numbers.json   扩写 1624/1677/1660
content/guides/hardware-refurbishment-survey-2026.json  中心距 145 → 41
src/data/finish-codes.ts                                DK/KT/IK 数量 + 过期注释
scripts/spec-coverage.mjs                               一标签多字段，按值分
docs/research/SPEC_COVERAGE.json                        重新生成
docs/collaboration/tasks/2026-09-22-*.md                本文件 + 另两份新任务
public/search-index.json                                重新生成
```

锁一释放，直接：

```bash
git add -- content/news content/guides/hardware-refurbishment-survey-2026.json \
  src/data/finish-codes.ts scripts/spec-coverage.mjs docs/research/SPEC_COVERAGE.json \
  docs/collaboration/tasks public/search-index.json
git commit -F <提交信息文件>
git push origin main
```

**不要用 `GIT_INDEX_FILE` 绕开这把锁。** 如果 Codex 在 02:01 暂存了完整索引、
稍后才提交，他们那次提交写出的是那一刻的整棵树，中间插进去的改动会被静默回滚。
