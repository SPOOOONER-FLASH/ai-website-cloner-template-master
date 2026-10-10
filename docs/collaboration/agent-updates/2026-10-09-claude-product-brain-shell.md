# 2026-10-09 · Claude · 产品大脑登录页 /admin/brain/

- **范围**：甲方 10-09 要一个 GitHub 登录的内部产品资料库。数据全部在**私有**仓库 `SPOOOONER-FLASH/hyde-brain`；本仓库（公开）只加一个不含数据的登录页 `public/admin/brain/index.html`。目标表 #152。
- **做法**：登录页复用 `/admin/` 的 OAuth 中转 `auth.cantonlock.com`（Worker 只把 token 交给 ALLOWED_DOMAINS 里的域名，cantonlock.com 已在内），拿到访客自己的 token 后从私有仓库读 `app/index.html` 写进页面。谁能看由 GitHub 仓库权限决定；匿名请求私有文件返回 404（已测）。
- **为什么放 /admin/ 下**：robots 已 Disallow /admin/，seo-audit、geo、bing 各审计脚本都跳过 admin 目录，不用改任何审计或测试。页面英文、noindex。
- **规矩**：hyde-brain 里的任何内容（名称、价格、图片）都**不得**复制进本仓库或官网。本仓库只放这个空壳。
- **测试**：本地用同样的 document.write 启动方式加载 app，无控制台错误；GitHub API 预检允许 Authorization（204）。线上登录要等发布后实测。
- **发布**：本提交只是源码，`out/` 由工程会话的下一次 HYDE 发布带上。上线后请实测 https://cantonlock.com/admin/brain/ 能出登录按钮。
- **手册**：CLIENT-RUNBOOK 顶部加一条指针（开权限），步骤在桌面 docx（来源在私有仓库）。
- **未动**：AGENTS.md、NOW.md（主工作树有别人的未提交改动）。
