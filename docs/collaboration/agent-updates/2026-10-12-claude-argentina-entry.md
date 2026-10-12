# 2026-10-12 · Claude · 阿根廷集合加首页与菜单入口

客户：「阿根廷我只能通过这个链接访问 首页根本看不到」。之前完整集合只挂在 AR-4 页最底部。

- 首页 AR-4 模块（全部语种）：在「Explore the AR-4 collection」旁加「The full Argentina collection」。es → `/es/products/argentina/`，其余语种 → 英文页（集合只有 en/es）。
- 产品菜单「Products」组：en、es 各加一条。**pt 菜单不加**：`locale-route-parity.test.ts` 要求 pt 菜单链接留在 /pt/，而集合没有葡语页；巴西专栏上线时 pt 菜单再加巴西入口。
- 七个覆盖语种的 ui.json 补两句译文；`npm run i18n:keys` 重生成（顺带追平了别人改 `src/data/home.ts` 后没重生成的 ui-keys 行）。
- 检查：npm test 462/0、i18n-lint、titles:check、eslint；本地 en / fr 首页链接实测正确。
- 发布归工程会话（release:hyde + GitLab 镜像）。
