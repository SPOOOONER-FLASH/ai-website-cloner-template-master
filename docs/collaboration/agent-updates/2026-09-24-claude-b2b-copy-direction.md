# 文案方向改成 B 端；三语文字归 Claude，Codex 只做视觉

- **Agent**: Claude（HYDE 文案，johns 机器，tmp/claude-copy） · **日期**: 2026-09-24

## 甲方指示

- “让买家睡得安稳”说的是**采购方**相信我们专业、资深、OEM 质量稳、价格合适，不是消费端的家里防盗。上午那版调研方向偏了。
- 我们是 B2B，做 OEM 贴牌。
- D2 交给 Claude：三语页面文字也归 Claude；Codex 以后只负责生图和视觉。开始逐篇改写西语和葡语。

## 做了什么

| 改动 | 文件 |
|---|---|
| 分工：Codex 只负责视觉；三语全部文字归 Claude；SEO 字段归工程会话 | `AGENTS.md`（已跑 `sync-agent-rules.sh`）、`tasks/2026-09-24-division-of-labour.md`、`docs/content/SPANISH_PLAN.md` |
| 调研改成 B 端：四个真实买家（Serraller、SAGA、ChatGPT 送来的瑞士和澳大利亚用户）、从 Hettich 和 Serraller 学什么、“安心”对采购意味着什么 | `docs/copy/style-guides/README.md` |
| D1 的答案：锁舌 pestillo，死舌 cerrojo，执手 manija 并括注 manilla；**西班牙读者也要读得懂** | `docs/copy/style-guides/es-latam.md` |
| 巴西：NBR 11742、AVCB、laudo técnico 怎么写 | `docs/copy/style-guides/pt-br.md` |
| 对今早 ChatGPT 分析的意见（再加五条）、批次、待甲方提供的事项 | `tasks/2026-09-24-copy-style-rewrite.md` |
| 语料抓取加上 B 端来源 | `scripts/collect-copy-corpus.mjs` |
| 认领 | `NOW.md`：新增“Claude HYDE 文案”一行 |

## 测试

只改了文档和语料脚本（`collect-copy-corpus.mjs b2b` 已实跑，5 页全部返回 200）。

## 需要知会的人

- **Codex**：`src/app/es/**` 和三语页面的文字不再归你们；改版式时不要改文字。
- **工程会话**：D1 一旦甲方同意，要改 `normalize-regional-terms.mjs` 里 `resbalón → picaporte` 这条规则和术语表的 Latch 词条，会先发消息商量。
- **E 盘那个 HYDE 会话**：`category-positioning.json` 和 198 条葡语摘要仍按 NOW.md 由那边做，这里不碰。

## 下一步

第 1 批：door-coordinator、push-bar、spindle 三篇的西语和葡语改写。
