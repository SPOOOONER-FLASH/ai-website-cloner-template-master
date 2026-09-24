# 三个市场的文风调研、三份指南、重写计划

- **Agent**: Claude · **日期**: 2026-09-24
- **甲方要求**：搜集美国、拉美（阿根廷、秘鲁、墨西哥）、巴西本地五金大公司的真实文案，写成三份文风指南，按指南逐篇改写；先把公司、分析和计划交给甲方。

| 产出 | 位置 |
|---|---|
| 24 家公司名单和五条跨市场规律 | `docs/copy/style-guides/README.md` |
| 三份指南 | `docs/copy/style-guides/en-us.md`、`es-latam.md`、`pt-br.md` |
| 计划和五个待拍板的决定 | `docs/collaboration/tasks/2026-09-24-copy-style-rewrite.md` |
| 用词审计 `npm run copy:locale` | `scripts/audit-copy-locale.mjs` |
| 重新抓取语料 | `scripts/collect-copy-corpus.mjs`，输出到 `tmp/claude-copy-corpus/`，已 gitignore，不提交 |

## 关键发现

- **英语是英式拼写**：620 处，比如 centre 203、catalogue 188。
- **西语是西班牙西语**：manilla 215、picaporte 85（阿根廷读者会理解成执手）、cortafuegos 21。
- **葡语小数用了点**：229 处，巴西应当用逗号。另外 207 个产品的葡语摘要只有 4 个词以内。
- 阿根廷 Kallay、秘鲁 Cantol、巴西 Papaiz 三国的品牌承诺都落在同一个词上：“安心”（tranquilidad / tranquilo）。
- 美国 Hager、Allegion 旗下品牌、Pado、Stam、IMAB 等站点有机器人验证，没有抓取，也没有绕过，已用定位相同的公司替代。

## 测试

`npm run copy:locale` 能跑，数字和上表一致。只改了文档和两个新脚本，外加 package.json 里一行 npm 命令，没有动任何内容文件和页面。

## 没动的

`content/**`、`src/**`、`out/`、`NOW.md`（它有别人未提交的改动；我这次全是新文件，没有和任何人重叠）。

## 下一步

等甲方定 D1–D5，然后做阶段 1：写 `apply-locale-terms.mjs`，默认只预览，按字段读 diff 后再写入。
