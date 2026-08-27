# Claude — 431 个产品链接服务端渲染

| | |
|---|---|
| 范围 | 新增 `src/components/site/ProductIndexList.tsx`；接入 `/products/`、`/product-finder/`、`/products/[category]/` |
| 问题 | 分页在客户端，静态 HTML 每页只有 20 个锚点，181 个产品页无任何服务端链接 |
| 做法 | 网格下补一个 `<details>` 纯文本型号索引；`<details>` 内容无论开合都在 HTML 里，且不需要 JS |
| 验证 | `npm run check` 通过（47 测试 / 472 页 / 0 semantic issues）；`out/products/*/index.html` 去重后正好 431 个产品锚点 |
| 未动 | `src/app/es/**`、设计与图片、`content/**` |
| 风险 | 视觉上多一行折叠摘要；已收在分类页与 Finder 底部 |
| out/ | 已跑 `deploy:prep`，本次提交带完整生成物 |
| 下一步 | GSC 525 个「重复网页」逐类排查 canonical |
