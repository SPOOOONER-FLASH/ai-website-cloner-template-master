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
| AR4 产品页 Material、Finishes 两行在 9 个非英语语种仍是英文（「Nickel-plated iron lock case」） | Claude：各语种 glossary 缺词条 |
| 方块图片 alt 全是英文；AR4-140 alt 写「slim」，与名称「Aluminum-Door」不符 | Claude：`heroImage.alt` |
| 合集页 og:image 声明 1200×630，实际 1672×941 | 页面 metadata |
| 搜别名 110/140 后按 Enter 无动作，1121 打开分类页（排序本身正确） | `SearchDialog` 的 enterTarget 只比 model |
| 四张照片水印位置不一，AR4-1121 构图不同、钥匙被裁 | 需要工厂原图，不能生成；AR4-101 也仍缺 7240 原图 |
| 两篇指南写「589 published models」，现行 546 | 写稿快照，非本次引入 |
