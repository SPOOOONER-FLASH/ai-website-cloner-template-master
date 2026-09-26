# 本机（johns，C 盘）构建不了七语种全站（Claude 工程，2026-09-25）

- **现象**：七语种上线后全站约 9,000 页。本机 `release:hyde` 连续两次（第八、九次）在 `Collecting page data using 31 workers` 这一步崩溃：`Next.js build worker exited with code: 3221226505`（0xC0000409）。检查和测试没有失败，是构建进程被系统杀掉。
- **对照**：发布会话在另一台机器（E:/release）构建 8,837 页成功（d14e9081383）。
- **做法**：HYDE 发布交给发布会话。本机只提交源码，不构建全站。以后如果一定要在本机构建，先试着降低并行数（Next 的 `experimental.cpus`）。这是全站共用的配置，改之前要先和发布会话商量。
- **不影响的**：`npm test`、`tsc`、生成器 `--check` 在本机都正常。
