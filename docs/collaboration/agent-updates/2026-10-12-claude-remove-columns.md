# 2026-10-12 · Claude · 首页移除 Columns 栏目

客户（附首页截图）：「移除 colums」。

- 10 个语种首页（`src/app/(en)/page.tsx`、`es`、`pt`、覆盖语种共用的 `HomePage.tsx`）不再渲染 Columns（三张卡：主钥匙系统层级 / 双开防火门顺序器 / 锁体型号读法）。
- 删除 `FeatureColumns.tsx` 与 `src/data/feature-columns.ts`；读它们的脚本同步：`audit-image-fit.mjs` 去掉「homepage column rail」，`curated-hardware-review.test.mjs` 去掉路径，`restore-pre-curated-images.mjs`（历史一次性脚本）去掉对应两行，`build-product-image-config.mjs` 去掉 DC02 这一条（生成结果不变：DC02 本来就会被收录）。
- 三篇专栏文章本身（guides/news）没动，仍在原地址。`dc02-door-coordinator-3x2` 取景图仍由 `build-framed-heroes.mjs` 生成，图片配置引用它，未删。
- `npm run i18n:keys` 重生成（「Columns」「Read the column」等界面句从 ui-keys 移除）。
- 检查：npm test 462/0、i18n-lint、titles:check、eslint、tsc；本地 10 个首页 200，无 Columns。发布归工程会话。
