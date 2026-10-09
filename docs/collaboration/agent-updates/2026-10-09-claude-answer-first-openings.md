# 2026-10-09 · Claude（文案）· 文章开头答案在前：24 篇全部完成（#37）

**口径**：摘要在文章页上渲染为 H1 下的第一段（`NewsDetail.tsx`），所以摘要先给答案，页面就先给答案。真正的缺口是“摘要和正文前两段都没有数字、型号或标准”的文章：24 篇。`scripts/audit-article-openings.mjs` 已按这个口径出数，现在是 **0 篇**；另有 45 篇正文开头是故事式写法，但摘要已经给了答案。

## 怎么改的

- 按 AI 引用量（W39 的 Bing AIPageStats 加 Clarity cited pages）从高到低，分 4 批：5、5、5、9 篇。
- 每篇只改摘要：英西葡三语，加七个语种覆盖层的 `summary`，并更新 `sourceHash.summary`。改动前，每篇的七语摘要都核对过是最新的。
- 写法统一：**第一句是答案**，后面一句是“本页还讲什么”。
- **摘要里的每个数字都出自该文正文**：ANSI 锁扣板 4-7/8 × 1-1/4in、“24 LH, 16 RH”、证书 7 个部分、LC08 85×55、DC02 100kg 对应最大闭门器 85kg、新模具 3–5 个月，等等。
- **正文里受 `article-catalogue-claims.test.ts` 约束的目录计数，一律不写进摘要**。涉及的文章：商用锁功能、供应商资格、文件、翻新调查。原因是摘要里的计数不受测试监控，目录变了它会悄悄过时。
- 西葡用词沿用各文正文，例如 entrada / distancia entre centros、guarnición exterior、maçaneta externa、llave de portal。
- `regional-terms` 测试改过几处：aseos→baños、tem de→tem que、cuadro→planilla。每处替换后都人工核了冠词阴阳性。

## 提交

| 批 | 文章 | 提交 |
|---|---|---|
| 1 | 锁扣板、通用与分左右、主钥分级、钥匙坯、样品与来料检验 | 758e772ed26 |
| 2 | 认证与测试、商用锁功能、质保、送审包（five/four 改为数字）、对照你在买的锁 | e1144c241e3 |
| 3 | 带锁体背距、闭门器安装、推杆外侧把手、万能钥匙分级表新闻、双扇防火门 | ec012d52e31 |
| 4 | 铜/黄铜合页、翻新调查、供应商资格、闭门顺序器、门五金表、窄框铝门下垂、有人/无人指示锁、可拿到的文件、OEM 改什么 | 本次 |

## 没动的，留意

- 工程会话的 #146 正在改同一批文件的 `seoDescription*`。我没碰这三个字段，两边按行合并，不冲突。
- `what-oem-actually-changes` 正文写着“Our own EN 1125 test report … KD070/30-290”。这份 Intertek 报告（130722068GZU-001）本来就公开列在认证页上；它和 CELAB 证书在谁名下，任务文件里早有一条待甲方确认。这次没有改那句，新摘要也没有引用它。

## 测试

- `npm run content` 每批都跑过。
- `npm test` 全过，含 us-spelling 和 regional-terms。
- `i18n-lint` 通过。
- `stamp-article-revisions --check` 通过。
