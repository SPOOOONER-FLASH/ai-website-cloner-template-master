# Catalogue return memory — 2026-08-31

- Agent：Codex。
- 范围：产品类目、Product Finder、英西语产品详情。
- 行为：`sessionStorage` 只保留本次会话最后一次产品来源；记录完整列表 URL、筛选、页码、产品和
  `scrollY`。浏览器后退或详情页返回链接恢复原卡片附近；会话结束自动清除。
- 降级：存储不可用或记录损坏时不报错，详情返回到产品的规范类目页；不同产品、不同语言不串状态。
- 分类页：类型和页码写入 URL；保留 `promo`、UTM 等非本组件参数。
- 自动验证：新增 5 项回归测试；`npm test`、`npm run typecheck`、改动文件 ESLint 通过。
- 浏览器验证：英文类目页与详情返回恢复 `?page=2` 和 7,224px；Product Finder 恢复
  `?category=knob-locks&page=2` 和 9,080px；西语恢复 `/es/products/knob-locks/?page=2`
  和 8,231px；390px 移动端后退恢复到 10,799px、横向溢出 0；控制台 0 error。
- 未触碰：现有 5,164 个 `out/` 路径；未运行 build、`deploy:prep`、部署或公网验证。
- 下一步：release builder 合入源代码后构建完整 `out/`，再按主交接做桌面、移动端和正式公网验收。
