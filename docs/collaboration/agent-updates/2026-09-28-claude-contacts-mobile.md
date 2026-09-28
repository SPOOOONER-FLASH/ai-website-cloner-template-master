# 2026-09-28 · Claude（工程）· 联系人、WhatsApp、手机端导航

**#92 联系人与 WhatsApp**（甲方 09-28）：tec@ 由 Spooner 负责，hyde@ 由 Monica Lee 负责；WhatsApp 为 +1 703 967 7493。
数据写在 `content/site-settings.json` 的 `contact.mailboxOwners` 和 `contact.whatsapp`；辅助函数 `mailboxOwner()`、`whatsappHref()` 在 `src/data/navigation.ts`。
改动位置：联系页 4 份实现（en、es、pt 各一份，另外 7 个语种共用 `locale-pages/ContactPage.tsx`），每个邮箱下显示负责人，最后一行是 WhatsApp（wa.me 链接）；页脚「How to buy」栏里 tec@ 下面加 WhatsApp；手机菜单的联系区加 WhatsApp。
GA4 的 `linkIntent` 早已能识别 wa.me 链接，点击会自动记为 contact_click / whatsapp。
