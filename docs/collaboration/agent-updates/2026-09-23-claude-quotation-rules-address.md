# 2026-09-23 · Claude · 报价单两条规矩 + 地址改为 Lianfeng Industry Park

| 文件 | 动作 |
|---|---|
| `content/site-settings.json`、`docs/quotations/_company.json` | 地址 Lianfeng Community → **Lianfeng Industry Park**（甲方定） |
| `docs/quotations/refcon-20260921.json` | 改为老板定稿版：330 + 039 两行、各 1000 pcs、30/70、50 天 |
| `docs/quotations/README.md` | 新增：不清楚就问；不知道的不填，等老板安排 |

- 30/70 付款、50 天交期是 REFCON **这一单的特殊条件**，没有改成模板默认值。
- 雷茵站（`content/rayen/site.json`、`src/components/rayen/Chrome.tsx`）也写着 Lianfeng / Lianfeng Community，门牌不同（2/F），属于另一个品牌，**未改，已问甲方**。
- 中文地址「联丰社区」未改：甲方只定了英文写法，中文怎么写待确认。
- 039 行规格仍写「Price on request」，和已报的 10.44 矛盾。这是老板原稿沿用下来的，照录未改，已向甲方指出。
- A4 校验 PASS。地址改动要重新构建 out/ 才会上线。
