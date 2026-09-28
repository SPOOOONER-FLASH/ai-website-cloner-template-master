# 2026-09-28 · Claude（工程）· 联系人、WhatsApp、手机端导航

**#92 联系人与 WhatsApp**（甲方 09-28）：tec@ 由 Spooner 负责，hyde@ 由 Monica Lee 负责；WhatsApp 为 +1 703 967 7493。
数据写在 `content/site-settings.json` 的 `contact.mailboxOwners` 和 `contact.whatsapp`；辅助函数 `mailboxOwner()`、`whatsappHref()` 在 `src/data/navigation.ts`。
改动位置：联系页 4 份实现（en、es、pt 各一份，另外 7 个语种共用 `locale-pages/ContactPage.tsx`），每个邮箱下显示负责人，最后一行是 WhatsApp（wa.me 链接）；页脚「How to buy」栏里 tec@ 下面加 WhatsApp；手机菜单的联系区加 WhatsApp。
GA4 的 `linkIntent` 早已能识别 wa.me 链接，点击会自动记为 contact_click / whatsapp。

## #93 手机端导航栏与面包屑（甲方：「很乱没有逻辑」）

390px 实测，从页头到内容之间叠了三层导航：
1. 横向导航条：黑色「Buy it now」排在第一，最右边的项被截成「Gu…」；「Product Finder」一直加粗，看起来像当前页。
2. 面包屑：产品页用「/」，其余 55 个页面用「>」；长文章标题会折成第二行，分隔符挂在左边，像一条侧边小导航。
3. 面包屑下面又有「← Back to previous results」「← Back to all guides」。

改法：
- 导航条：各项按阅读顺序滚动（Products · Product Finder · Guides · News · Company），「Buy it now」固定在右侧始终可见；只有当前页加粗。
- 面包屑（`Breadcrumbs.tsx`，55 个页面共用）：永远一行，只有当前页标题用省略号截断，分隔符统一为「›」；产品页、项目页那两套自写面包屑也改成同一个分隔符。
- 产品页的品类那一级直接就是「返回筛选结果」链接（有记录就回到原来的筛选位置，没有就去品类页），删掉原来单独那一行；新闻和指南的「← Back to all…」在手机上隐藏，桌面照旧。
本地 Playwright 390px 截图核对：产品页、指南页、联系页（Spooner、Monica Lee、WhatsApp）都正常。
