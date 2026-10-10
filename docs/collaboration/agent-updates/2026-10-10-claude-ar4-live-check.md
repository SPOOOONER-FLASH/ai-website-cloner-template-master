# 2026-10-10 Claude：AR-4 方块上线核对 + 两处修正

**上线**：发布 `bd1e79eb46c`（构建自 `cd9affff11c`）含 AR-4 方块。7 个代理带 `?nc=` 逐页核对，无阻断问题：

- 十语首页、两个合集页：各 4 块，名称本地化，40 个链接和全部图片 200。
- 110/140/1121 旧地址在 30 个语种路径上 301 到同语种 AR4 页，规格尺寸与图纸一致。
- 搜 110/140/1121 时 AR4 排第一。目录 PDF 9844470、联系页「92 pages」未变。

**本提交修正（方块组件自己的问题）**

| 问题 | 修正 |
|---|---|
| 悬停/聚焦时蒙版退到 20%（实际 12% 白），AR4-101 文字对比度 p5 3.57:1 | 停在 40%：四块 p5 ≥ 4.76:1。本地 webpack 预览实测悬停后 opacity 0.4 |
| `xl:text-h3` 从未生成（`.text-h3` 是普通类，不是 `@utility`） | 删掉。线上字号本来就是 text-c1，视觉无变化 |

检查：motion:check、eslint、typecheck、相关测试通过。**需要下一次 `release:hyde` 才上线。**

**核对发现、本次没改的（均为 minor，早已存在）**

| 问题 | 归属 / 备注 |
|---|---|
| 合集页 og:image 声明 1200×630，实际 1672×941 | 页面 metadata |
| 搜别名 110/140 后按 Enter 无动作，1121 打开分类页（排序本身正确） | `SearchDialog` 的 enterTarget 只比 model |
| 四张照片水印位置不一，AR4-1121 构图不同、钥匙被裁 | 需要工厂原图，不能生成；AR4-101 也仍缺 7240 原图 |
| 两篇指南写「589 published models」，现行 546 | 写稿快照，非本次引入 |

**第二次修正（客户 10-10：「修材质 / 表面处理的翻译和图片替代文字」）**

| 问题 | 修正 |
|---|---|
| Material / Finishes 在 9 个非英语语种是英文 | 补词条 `Nickel-plated iron lock case`、`Nickel-plated`：es/pt 在 `*-glossary.ts`，七语在 `content/i18n/<code>/glossary.json`（译法取各语 ui.json 已有译文和 `Nickel Plated`），重生成 `i18n-client/*.json`。**没改产品记录**：四条记录两站共用，雷茵靠 zh-terms 的同一英文键译中文 |
| 方块 alt 全英文 | 方块 alt 改用已本地化的名称 `HYDE <型号> <名称>` |
| AR4-140 图片 label 写 slim | 记录里 8 处 label 改 aluminum-door，labelEs 改 para aberturas de aluminio（中立记录，雷茵渲染中文，不受影响） |

本地 webpack 预览实测：fr 产品页材质为 Coffre de serrure en fer nickelé，es 合集页 alt 为西语。检查：i18n-lint、titles:check、build-i18n-client-ui --check、typecheck、eslint、`npm test` 461/0。

**产品查找器多语言跳英文（客户 10-10 Clarity 录屏：/ko/product-finder/ → 英文 001 页）**

- 原因：`ProductFinder.tsx` 渲染结果卡片时没传 `locale`，`ProductCard` 默认 `en`。服务器输出的链接带语言前缀，浏览器端筛选/翻页后重新渲染的 20 张卡片全部变成英文链接。九个非英语语种都受影响。
- 修正：补 `locale={locale}`；新测试 `product-card-locale.test.ts` 扫描全部 `<ProductCard>`，漏传语言就报错（已验证：修复前失败，修复后通过）。
- 实测：线上 /ko/ 结果 20/20 链英文；本地修复后 20/20 链 /ko/。`npm test` 462/0。
