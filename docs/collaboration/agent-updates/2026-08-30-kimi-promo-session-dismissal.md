# kimi — 修复弹窗「关过就永久消失」

| | |
|---|---|
| 范围 | `src/components/site/PromoDialog.tsx`、`src/lib/promo.ts`、`src/lib/promo-dismissal.test.ts`（新增）、`package.json`（注册测试）、`out/` |
| 结果 | 弹窗恢复「本次浏览关掉不烦你，下次打开照常弹」；`?promo=1` 强制预览不再受 dismiss 影响 |
| 测试 | 104/104 单测 + 25/25 导出审计 + lint/typecheck/audit-seo 全绿；predeploy-check 通过 |
| 未碰 | cc/cx 的 untracked 文件（`scripts/stahlock-cited*`）、`docs/collaboration/reviews/` 审核包 |
| 风险 | 低。旧 localStorage 里的永久 dismiss 记录被废弃——所有访客（含甲方）本次部署后都会重新看到卡片，符合甲方 2026-08-25「无冷却」的锁定决定 |

## 根因

dismiss 记录存在 localStorage 且按 `version` 永久携带；`cooldownMinutes: 0` 只关掉了时间压制，
dismiss 却是永久的——关过两张卡的浏览器永远看不到弹窗，`?promo=1` 也会带上 dismiss 记录而显示空白。
与 `promo-settings.test.ts` 锁定的甲方意图（"a visitor who dismisses the card meets it again"）相矛盾。

## 修法

- dismiss 名单从 localStorage 移到 **sessionStorage**（`canton-promo-dismissed`）：
  本次浏览内关掉的卡不再出现，会话结束即失效，下次打开照常弹。
- `?promo=1` 现在同时无视冷却和 dismiss，甲方随时可预览。
- localStorage 只剩 `{ lastSeen, version }` 冷却簿记；version bump 仍然能中途唤回所有人。
- 新增 `src/lib/promo-dismissal.test.ts` 5 个用例锁定该语义。

## 上线后

- 服务器 crontab 5 分钟内拉取；**Cloudflare 需手动 Purge**，否则最长 2 小时看不到变化。
- 验证：无痕窗口开首页等 10 秒应见卡片；`?promo=1` 任何状态下必出。
