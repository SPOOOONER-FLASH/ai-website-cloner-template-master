# 2026-10-12 Claude（hyde前端管理）：7240 改名 AR4-101 → AR4-111

**依据**：甲方 10-12「7240 改叫 AR4-111」。7240 的面板 220 × 25、中心距 72、锁体高 140 与 Elabora **111** 一致；Elabora 的 101 是 183 × 18 窄面板，是另一款锁（阿根廷集合里的 AR4-101 指的就是它，**不动**）。Elabora 把 111 归在安全锁，所以名称一并改成 AR4-110 已在用的那套：Security Mortise Lock Body / Cerradura de seguridad / Fechadura de segurança，七个语种照抄 AR4-110 的现成译名。

| 改了什么 | 说明 |
|---|---|
| 产品记录 | `hyde-ar4-101-mortise-lock` → `hyde-ar4-111-mortise-lock`；型号、名称、摘要、SEO、图片说明 |
| 旧地址 | `content/taxonomy-moves.json` 加一条 301，`deploy/nginx/taxonomy-redirects.conf` 已重生成。**服务器需 nginx reload 才生效** |
| 图片 | 原图、HYDE 版、4 个响应式尺寸改名；水印清单同步 |
| 七语种 | 产品条目改键名、换名称；`sourceHash` 只更新原本是最新的字段（原本过期的保持过期） |
| 文章 | 两篇指南里的型号（十个语种） |
| AR-4 方块 / 页面 / 测试 / 脚本 | 型号列表换成 AR4-111 |
| 规格书 PDF | 旧的 10 份（印着 AR4-101）删除，清单里拿掉。**需要 `npm run spec-sheets` 重新生成** |

**检查**：i18n-lint（七语种干净）、titles:check、stamp --check、assets:watermark:check（5409 张）、typecheck、lint、`npm test`、spec-sheets 测试。

**没动**：`src/data/generated/products-zh.json`（雷茵线，构建时会自己重生成）；历史文档里的 AR4-101（记录当时的事实，不改写）。

**交给工程会话**：下一次 release 前跑 `npm run spec-sheets`；上线后 reload nginx（旧地址 301）。

**补：旧地址 301 当时没生成（工程会话 r36 实测发现）**

- 原因：我在 `out/` 还没有 AR4-111 页面的工作副本里跑了 `build-taxonomy-redirects.mjs`。生成器发现目标不在导出里，就跳过这一条，只打印了一行警告，配置里只留了注释。
- 修正：在 r36 的 `out/` 上重新生成，10 个语种各补上 2 条 301（共 80 行）。
- 防再犯：生成器新增检查。如果目标是已发布的 HYDE 产品、却不在英文导出里，就判定为导出过时，报错退出（exit 1），不写出配置。镜像语种缺页照旧只跳过。两种情况都实测过：正常生成；把 111 页临时挪走后报错，配置未被改动。
