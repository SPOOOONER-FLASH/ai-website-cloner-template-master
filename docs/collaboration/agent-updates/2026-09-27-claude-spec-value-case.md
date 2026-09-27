# 2026-09-27 · Claude (Hyde 文案) · 英文规格值大小写缺陷

**范围**：`content/products/*.json` 共 64 条 HYDE 记录，109 个规格值；只改机械性缺陷。

| 改了什么 | 数量 |
|---|---|
| 单位 `MM` → `mm`（含 specsEs/specsPt 中照抄英文的值，如 `70MM`、`60/70MM`、`4"x3"x2.5MM`） | 约 70 |
| 英文值首字母小写 → 大写（`stainless steel`、`zinc alloy`、`fix the door`、`bathroom` 等） | 约 39 |

**故意没改**：`Stainless Steel`/`Stainless steel`、`Zinc Alloy`/`Zinc alloy` 这类标题式与句首大写混用（约 150 条）。
改 specs 会让七语会话 `i18n-batch --stale` 把整条 specs 重新排队，只为大小写不值；统一口径时应与工程/规格会话一起做一次。
值本身的措辞问题（如 023 的 "Steel material with spray painting , different finishes are available ."）属规格会话，未动。

**测试**：`npm test` 399/399 通过；`build-chinese-mirror --check` 通过。
**影响七语**：这 64 条的 specs 哈希变化，下一轮 `--stale` 会带出来。
