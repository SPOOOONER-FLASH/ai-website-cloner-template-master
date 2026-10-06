# Claude（视觉）— 10-05 Bing 站点扫描 / GSC / Clarity 读数与 alt 修复

- Agent：Claude 视觉会话（Opus 5.5）
- Commit：本 update 所在提交；alt 修复为 9101603709a
- 目标：甲方 10-05 发来 Bing Webmaster 扫描与 SEO 建议、GSC 单页导出、Clarity AI Visibility 十话题截图，说「问题有点严重」；核实每一条、能改的改、其余分派并同步协作表格。
- 修改范围：
  - 源码：`MediaPlaceholder`（新 `hiddenFromAssistiveTech`）、`ProductVariants`、`Configurator`、`ConfiguratorStudio`：缩略图补描述性 alt + `aria-hidden`。
  - 文档：`docs/research/analytics/2026-10-05/REPORT.md` + `raw/`（五份原始导出）、`analytics/LATEST.md`、`DATA-DASHBOARDS.md`「期中补充」、工程目标 #131–#135、桌面 hyde `5-需要你提供-Bing-GSC-Clarity-10-05.docx`。
- 验证：线上实测 10 个 Bing 高优先级页标题长度、两个 index.php 旧地址 301 去向、三类页面未压缩 HTML（knob-locks 1.30 MB、product-finder 1.11 MB）；r8 构建逐页统计全站标题与 HTML 体积；`tsc` 通过；相关测试 19/20，唯一失败在改动前已存在。
- 明确未修改：标题生成器与 seoTitle（工程会话车道，且等甲方确认长标题可否省品牌名）；HS 编码指南标题（E1 实验中，10-14 读数）；HTML 体积（工程会话）。未发布（发布只在 johns 机器）。
- 已知风险 / 外部阻塞：GSC 导出只筛了一页；Clarity 是截图抄数。**Codex 的交接写明它也在 `E:/cantonlock-vis` 工作**，本会话也用这个目录做源码改动——两边同时用会互相覆盖，建议各用各的 worktree。
- 建议另一方下一步：工程会话发布 9101603709a 并做 #131；文案会话看 REPORT 第六节机会栏定下一批选题。
