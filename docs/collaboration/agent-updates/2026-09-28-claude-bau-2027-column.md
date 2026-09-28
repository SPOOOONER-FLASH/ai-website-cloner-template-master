# 2026-09-28 Claude — BAU 2027 专栏（版式 B）

**范围**：新建 `/bau-2027/`（EN）与 `/de/bau-2027/`（DE）。文字全部读 `content/bau-2027.json`，没加任何说法。

| 部分 | 文件 |
|---|---|
| 只在 en + de 存在的路由 | `src/lib/spanish-mirror.ts` 的 `PARTIAL_ROUTES`，在 `hasMirror` 里最先判断，所以 hreflang、sitemap、语言切换都只认 en/de |
| 页面 | `src/app/(en)/bau-2027/page.tsx`、`src/app/de/bau-2027/page.tsx`（手写；scaffold 的 `HAND_WRITTEN` 不会删它） |
| 版式 | `src/components/site/BauColumn.tsx`：桌面左 8/12 放产品、事实、简介，右 4/12 放表单并 sticky top 24px；手机单列，顺序为标题、产品、表单、事实、简介、深色条 |
| 表单 | `src/components/site/BauMeetingForm.tsx`：走现有的 Web3Forms（`submitInquiry`），主题用 `form.subject`，发到 tec@；失败时整份内容转成邮件 |
| 产品卡 | `src/data/bau-2027.ts`：每个型号用自己记录的实拍主图；型号不在 HYDE 目录里就直接报错 |
| SEO | Event JSON-LD（主办方写 Messe München）；sitemap 的 `entry("/bau-2027")`；`content/events.json` 的 BAU 已改为链到 /bau-2027/ |

**测试**：
- `npm test` 415/415 通过。
- 路由一致性测试已放行 de 的 partial 路由。
- 本地 1440 与 390 用 Playwright 实测：版式对得上参考 B，无横向滚动，hreflang 为 en/de/x-default。

**风险，已记录**：
- 德语页带表单，但**还没有德语隐私页**。DSGVO 风险甲方已知情，决定照上（「现在建，德语也放表单」）。
- `featured[]` 的五个型号**仍待老板确认**。
- 预约由 tec@（Spooner）回复。

**没动**：RAYEN、文案本身。
