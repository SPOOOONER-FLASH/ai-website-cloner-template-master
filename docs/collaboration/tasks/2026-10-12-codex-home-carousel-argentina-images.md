# 2026-10-12 Codex：首页轮播三张大图（阿根廷 ×2、巴西 ×1）

客户 10-12：「把 ar4 和 ar5 都设计一个首页滚动版面，大图我让 codex 再去做」。

轮播（`src/data/home.ts` 的 `heroCarousel`，es/pt 同步）现在的顺序是：逃生锁 → AR-4 → 阿根廷集合 → 执手 → 锁体。前三张的图（葡语首页第二页多一张巴西逃生锁）：

| 页 | 现在用的图 | 要换成 |
|---|---|---|
| 逃生锁 | `/images/editorial/home-panic-exit-double-door.webp`（客户 10-12 给的图，1774×887） | 不动 |
| HYDE Argentina AR-4 → `/products/argentina-ar4` | `/images/editorial/argentina-ar4-entry.webp`（首页下方 AR-4 展示块也在用这张，算临时重复） | 新的宽图 |
| HYDE Argentina Collection（AR5 型号）→ `/products/argentina` | `/images/editorial/home-argentina-collection.webp`（占位：AR5-115 实拍放在白底中间） | 新的宽图 |
| 仅葡语首页：Ferragens para porta corta-fogo → `/pt/ferragens-porta-corta-fogo` | `/images/editorial/home-brazil-fire-door.webp`（占位：305 实拍放在白底中间） | 新的宽图 |

规格：

- 2:1，至少 1800×900，webp。
- 手机端是**居中裁 4:3**（`scripts/build-mobile-hero-crops.mjs`），所以产品要放在中间那块里。
- 只用真实产品照片合成（AGENTS.md「Never generate an imagined metal product」）。阿根廷集合用的是 `public/images/argentina-collection/` 里已经去掉冲压字的图。

交付方式：直接覆盖上面三个路径（文件名不变），然后跑这三条，再提交、推送：

```bash
node scripts/generate-editorial-srcsets.mjs
node scripts/build-mobile-hero-crops.mjs
npm test
```

`editorial-images.config.json` 里登记的 `sourceWidth` 要和新图的宽度一致。

推完告诉 HYDE 工程会话发布。

逃生锁那张客户确认是**实拍合成**（306-D 实拍），说明文字已写回 306-D。
