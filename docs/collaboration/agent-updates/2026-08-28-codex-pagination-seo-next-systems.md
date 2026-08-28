# Codex — 分页总页数、SEO 预算与下一批系统

- **分页**：三页窗口补首页、尾页和不可点击省略号；首屏 `1 2 3 … 22`，中间 `1 … 10 11 12 … 22`，尾部 `1 … 20 21 22`。
- **SEO**：审计预算统一为 title ≤62、description ≤165；收紧首页、Keyed Deadbolt 与 Night Latch 文案。
- **测试**：分页与 SEO 预算均完成红灯→绿灯；完整构建和浏览器验证在 release commit 前执行。
- **已确认下一批**：ALT 批量 CMS、应用场景、非 Kale 证书、Newsletter 界面、展会、Service、Related Products、429 个西语产品路由。
- **未推断**：展会馆号/展位号、Newsletter 服务商、Related Products 规则、证书公开文件均待字段或来源确认。
- **构建 baton**：当前 `out/` 差异来自本轮审计构建；源文件提交后由 Codex 统一运行 `deploy:prep`。
