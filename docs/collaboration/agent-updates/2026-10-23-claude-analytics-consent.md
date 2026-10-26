# 2026-10-23 · Claude（云端线程） · 分析同意横幅：GA4 / Clarity 同意后才加载

已知缺口（记忆里一直挂着）：GA4 和 Clarity 对所有访客无条件加载，`_ga` / `_clck` 在征得同意前就写入，隐私声明却按「正当利益」写。对欧洲访客这不成立（ePrivacy 5(3)、德国 §25 TDDDG）。

| 改了什么 | 文件 |
|---|---|
| 规则（谁要问、答案存哪、撤回删哪些 cookie），纯函数 + 测试 | `src/lib/consent.ts`、`src/lib/consent.test.ts`（已加进 `npm test`） |
| 十种语言横幅文案，「接受 / 拒绝」同权重 | `src/lib/consent-copy.ts` |
| 横幅 + GA4/Clarity 加载移入同意门；页脚「Cookie settings」重开横幅 | `src/components/site/ConsentGate.tsx`、`Analytics.tsx`、`SiteFooter.tsx` |
| `analytics.consentScope`：`"europe"`（默认）/ `"everywhere"`，一个词切换 | `src/data/site.ts` |
| 隐私声明英德两版：第 4 节写同意机制与法律依据、存储清单加一条、日期改 10-23 | `src/data/privacy-policy.ts` |

- 判断依据：静态导出拿不到访客国家，用浏览器时区。所有 `Europe/*` + 塞浦路斯、加那利、亚速尔、冰岛等 + 读不到时区 → 先问；其余地区照旧加载，页脚可拒绝。**只问欧洲**是我的默认，是否改成「所有访客都问」交甲方决定（全问会让南美 / 中东的 GA4 数据掉一截）。
- 性能：导出的 HTML 里没有横幅也没有标签（客户端判断），横幅 fixed 在底部 → 零 CLS；标签仍是 `lazyOnload`，同意后与之前同时机加载。拒绝后已加载的标签：删 cookie + 刷新页面。
- **GTM 未动**（甲方 09-25 / 09-30 决定：GTM 保持空容器、代码不增不减）。空容器不写 cookie；以后往 GTM 里加任何标签（例如 LinkedIn Insight）必须监听 `hyde:consent` 事件或读 `localStorage["hyde-analytics-consent"]`，否则又回到先加载后同意。
- `EngagementTracker` 照常运行：只往 dataLayer 推事件、给 gtag 缓冲；未同意时 gtag 不存在，事件不出浏览器。
- 风险：欧洲访客的 GA4 / Clarity 数据会下降（接受率通常 40–70%），周报环比要注明 10-23 之后的口径变化。
- 未动：PR #20、导航方案、FSB 视频、RAYEN、`out/`（发布归发布会话，合并后跑 `npm run release:hyde`）。
- 下一位：合并后发布；Spooner 用欧洲时区（或无痕窗口 + 系统时区改成柏林）验一次横幅，在 Clarity / GA4 实时报告里确认点「接受」后才出现会话。
