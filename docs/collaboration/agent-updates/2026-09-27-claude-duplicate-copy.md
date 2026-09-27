# 2026-09-27 · Claude (Hyde 文案) · 产品摘要去模板化（任务表第 13 项）

来源：QuickCreator《8 月 Spam Update》《程序化 SEO》——“只换型号、内容不换”的页面是规模化内容滥用的典型。

**量化**：`node scripts/audit-duplicate-copy.mjs --write` → `docs/copy/duplicate-copy-audit.md`（遮掉型号、名称和数字后比对，≥3 条同文算一组）。

| 组 | 处理 | 条数 |
|---|---|---|
| “{型号} {名称} manufactured by Canton Hyland.” | 英文按西/葡摘要里已有的图纸事实重写（只取两种语言都有的事实；140 西语与葡语不一致处取共同部分） | 33 |
| 同上 | 型号里的表面/功能代码按 `src/data/finish-codes.ts` 解码，只用 evidence 为 catalogue/client 的代码，三语重写；写成“X finish”而不是材质。锁芯原西葡“latón macizo”删掉：有规格的锁芯里有一条是淬火钢，不能推定全部是黄铜 | 48 |
| 同上 | 没有规格、也解码不出：改为“规格下单前与工厂确认”（与描述一致） | 19 |
| “A stainless steel lever handle, brass cylinder preparation.” | 按各自规格行加门厚 35–50mm、执手长、底座直径；西语重复“de acero inoxidable”改掉 | 24 |

**没动**：102 条描述仍是同一段“由某公司在广东制造，规格正在确认”的说明——内容属实，是页面上的样板说明而不是主体；主体差异现在在摘要、规格和照片上。

**交甲方 / 工程会话决定**：112 条 HYDE 记录没有任何规格行（清单在审计报告末节）。按文章的“发布门槛”建议，这类页面可考虑在补齐规格前 noindex；这是收录决策，归工程会话和甲方，本会话不改。

**测试**：`npm test` 406/406；`build-chinese-mirror --check` 通过。
**影响七语**：约 124 条的 summary 哈希变化，下一轮 `--stale` 会带出来。
**共享数据公告**：`content/products` 两站共用，本次只改 HYDE 可见记录（`sites` 含 hyde 或未设）。
