# Codex — 站内搜索索引同步

- 范围：同步已提交的西语目录、SEO 元数据与 Stahlock 引用规格到 `public/search-index.json`。
- 验证：前序 `npm run check` 通过；941 页构建、107 项测试、结构化数据语义问题 0。
- 未触碰：Kimi 正在维护的 SEO/GEO 源文件；`out/` 留给后续独立发布提交。
- 下一步：运行 `npm run deploy:prep`，提交完整 `out/`，部署并做公网回归。
