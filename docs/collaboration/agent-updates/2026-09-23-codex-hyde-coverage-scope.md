# HYDE 规格覆盖改为本站口径

- Agent：Codex
- Commit：与本 update 相同的源码提交
- 目标：阻止 HYDE 指南把 RAYEN 独占型号计入 cantonlock.com 的产品与规格覆盖。
- 修改范围：`scripts/spec-coverage.mjs` 按 `sites` 过滤，`SPEC_COVERAGE.json` 明示 `site: hyde` 并重生；`article-catalogue-claims.test.ts` 锁定报告产品总数与 HYDE 数据一致。
- 核实数字：973 条共享目录记录中，HYDE 590 条、其中 523 条有照片可在目录浏览。按现有字段白名单，Backset 175、执手到锁芯中心距 36、门厚 201、开向 184、锁体前板 6、表面处理 326。84 张尺寸图对应 HYDE 型号（72 张在可浏览产品上）；95 张门开孔 SVG 全对应 RAYEN 独占型号，HYDE 为 0。
- 验证：重新运行生成器及 `--check`，报告 590；`node --test src/data/article-catalogue-claims.test.ts` 通过。字段数由脚本从源记录重新计算，不靠手填。
- 明确未修改：产品记录、图纸本身、产品图、`out/` 和 `out-rayen/`。
- 已知风险 / 外部阻塞：四篇指南及一篇新闻的旧数字、开孔图描述要在同一轮发布前同步；当前报告正确不代表文章已正确。
- 建议另一方下一步协助或复核：内容同事复核三语数字与图纸描述；只在相应文章修正并通过站点数字守卫后执行 `release:hyde`。
