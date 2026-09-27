# 2026-09-27 · Claude（工程）· 产品页 ↔ 应用案例互链

**范围**：`src/components/site/ProductDetail.tsx` 新增「Projects + Applications」区块（在「相关产品」之前）；
新测试 `src/data/project-product-links.test.ts`（已加入 `npm test`）。

**为什么**：甲方 09-27 转来「B2B 网站要把案例和产品关联起来」。5 个案例页原本就列出所用产品，产品页却没有链回去。
反向查找用的就是案例页的同一个函数 `getProductByModel`，所以两个方向不可能对不上。

**结果**：18 个产品页出现区块（3 个模块 × 案例），十个语种都有。标题和「Representative application」标签沿用案例页已有的七语种译文，没加新的待译字符串。
每条都标「代表性应用」：这 5 个案例是示意方案，不是具名客户项目（见 `src/data/projects.ts` 头注），不能写成 case study。

**核对**：本地 dev（worktree，webpack）实测 /products/panic-exit-devices/310…、/fr/…、/ar/…ju-093…、/es/…patch-fitting-set 都有区块；没有案例的 301 不出现；
和「Next steps」同列宽（1206px @1280），无横向滚动。tsc、eslint、新测试通过。

**共用组件**：ProductDetail 是 HYDE 页面；RAYEN 已在独立仓库，不受影响。

**要上线**：下一次 `npm run release:hyde`，然后 purge，再 `npm run seo:indexnow:release`。

**后续可做**：案例一旦有真实具名项目（甲方提供名称、地点、照片、授权），把 `referenceStatus` 改成 verified-project，同时给这个区块加「已完成项目」标签（现在一律显示「代表性应用」）。
