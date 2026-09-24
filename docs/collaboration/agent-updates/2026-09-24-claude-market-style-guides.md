# 三个市场的文风调研和指南补充

- **Agent**: Claude（C: 检出，旁路合并） · **日期**: 2026-09-24
- **甲方要求**：搜集美国、拉美（阿根廷、秘鲁、墨西哥）、巴西本地五金大公司的真实文案，写成三份文风指南，按指南逐篇改写；先把公司、分析和计划交给甲方。

| 产出 | 位置 |
|---|---|
| 24 家公司名单和五条跨市场规律 | `docs/copy/style-guides/README.md` |
| 三份市场指南补充 | `docs/copy/style-guides/en-us.md`、`es-latam.md`、`pt-br.md` |
| 待办和待决（D1 picaporte、D2 西语页面文字归谁） | `docs/collaboration/tasks/2026-09-24-copy-style-rewrite.md` |
| 重新抓取语料 | `scripts/collect-copy-corpus.mjs`，输出到 `tmp/claude-copy-corpus/`，已 gitignore |

## 和同一天另一个会话的关系

推送时发现另一个会话已经推了 `voice-en-es-pt.md`，还有 `normalize-us-spelling.mjs` 和 `normalize-regional-terms.mjs` 两个脚本及对应的测试。处理如下：

- **按规则的优先级排**：总方案 > voice 文件和术语表 > 本目录。三份指南已经改成**补充**，删掉了和术语表冲突的词条：perilla、entrada、cerradero、西语小数用逗号、英寸按 `imperial.ts` 取 1/16"。
- **删掉了我自己写的 `audit-copy-locale.mjs`**：它和那两个脚本的只报告模式重复，同一件事不留两个量法。它发现的剩余问题已经列成待办 1–3，加进那两个脚本。
- 唯一的实质分歧是 picaporte（阿根廷口语里指执手），列为 D1 请甲方定，**没有改动对方的决定**。

## 测试

只改了文档和一个新脚本（`collect-copy-corpus.mjs`，已实跑 br、pe 两个市场）。`package.json` 和合并前一致。没有动 content、src、out。

## 没抓到的

Hager、Allegion 旗下品牌、Grainger、Pado、Stam、IMAB 等站点有机器人验证，没有抓取，也没有绕过。

## 下一步

待办 1–2（机械规则，一次提交），然后按总方案的 GSC 循环逐篇改写。
