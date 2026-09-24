# 2026-09-24 · Claude（HYDE 文案）· 下载页第二轮

- `src/app/{(en),es,pt}/downloads/page.tsx`：
  - H1 改为搜索词开头：Catalog and technical downloads / Catálogo y descargas técnicas / Catálogo e downloads técnicos。面包屑不动。
  - 导语、测试记录段、“还要别的文件？”段三语重写，去掉“issued against a confirmed project brief”这类公文腔。
  - “Three HYDE records”原本写死，改成 `{certificates.length}`，记录增减时页面自动跟着变。措辞只说“每条都列出它覆盖的那一个型号”，不说记录在谁名下。
  - 葡语的 “disponível(is)”“arquivo(s)” 这类括号复数写法也一并去掉。
- 页面 metadata 没动，归工程会话。
- 测试：tsc、eslint（三页）、`npm test` 通过。
