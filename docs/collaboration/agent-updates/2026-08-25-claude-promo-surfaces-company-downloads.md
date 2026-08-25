# 弹窗加入 Company / Downloads 页

- **Agent**：Claude
- **Commit**：与本 update 相同的提交
- **目标**：甲方 2026-08-25 明确要求这两个页面也显示弹窗。

## 修改范围

- `content/promo.json` — surfaces 加 `company`、`downloads`；version 8 → 9
- `src/lib/promo-settings.test.ts` — 断言扩展

`promoSurfaceFor` 对这两个路由的识别分支上一轮已经加好，本次只需开启。

## 新增的守卫测试

`every listed surface is a route promoSurfaceFor can actually recognise`

这个配对关系是这个功能真正的失败模式：**surfaces 里列了一个 promoSurfaceFor 产生不出来的值，
就是静默失效**——配置看着对、CMS 里勾也勾上了、弹窗就是不出现，而且没有任何报错。
`product-finder` 之前正是这样坏了一轮。现在两边对不上会直接让 CI 失败并指出该去
`src/data/promo.ts` 加分支。

## 验证

- `npm test` 40 通过；lint 0 error
- `npx serve out` 实测 `/company/` 与 `/downloads/`：不带 `?promo=1` 强制标记、
  且把 lastSeen 设成"刚看过"，卡片仍照常出现
- **下载页做了遮挡检测**：弹窗位于 (881, 509) 360×187，与页面上所有
  `a[href$=".pdf"]` / `a[download]` / `main a` / `main button` 的碰撞结果为空。
  之前不敢默认开启这一页就是担心挡住下载动作，实测确认无碍。

## 明确未修改

Codex 的 semantic audit / structured data 相关工作（`839cb185b`、`aa4640f30`），未触碰。

## 已知风险 / 外部阻塞

- 服务器图片缓存头仍未加。**根因已定位**：主 nginx 配置里
  `location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$` **不含 `webp`**，而站上 1342 张产品图
  全是 webp，所以一张都没被现有缓存规则覆盖。
  已给甲方一段写入
  `/www/server/panel/vhost/nginx/extension/spoonercantonlock.stahlock.com/cache.conf`
  的命令（自带 `nginx -t` 校验与失败自动回滚），等他执行。
- 该扩展目录的 include 位于主配置第 15 行，早于第 78 行的图片规则，因此新规则会优先命中。
- 配置里重复声明了 HSTS：子 location 一旦出现 `add_header`，父级安全头会全部丢失。

## 建议 Codex 下一步协助或复核

甲方执行缓存配置后，可用你配好的 Chrome DevTools MCP 做一次冷加载 trace，
对比 LCP 与重复访问的请求数——那是这次缓存改动唯一能证伪的地方。
