# 2026-10-19 · Claude · 四个工具页 + /tools/ 索引（十种语言，带产品推荐）

甲方 10-19：「工具页去做，然后一定要结合我们的产品推荐。HS 编码查询、表面处理代码对照、万能钥匙方案、开门方向判断，都做了」。目标 #196、#197。

| 页面 | 数据来源（只用站内已核实的） | 推荐哪些产品 |
|---|---|---|
| /door-hardware-hs-code-finder/ | HS 编码指南 + 印度 HSN 指南（src/lib/tools/hs-codes.ts） | 该品类的已发布产品 |
| /finish-code-converter/ | src/lib/bhma-finish.ts（新增 bhmaRows、canonicalFinish） | 表面处理 + 材质能精确对上该 BHMA 号的产品 |
| /master-key-plan-generator/ | 钥匙系统表文章里的符号规则（3–5 级；2 级文章没给符号，不做） | 记录里写明 master keyed 的 56 个 |
| /door-handing-finder/ | 开门方向文章（ANSI + DIN） | 写明可换向/无手向的锁、执手（内开）与逃生装置（外开） |
| /tools/ | 五个工具（含锁芯计算器）索引；菜单与页脚加「Tools」 | — |

- 一个组件服务十种语言（src/components/locale-pages/ToolPages.tsx），英西葡文案写在组件里；其余 7 种的 166 条界面句由 7 个翻译代理产出，校验（占位符、代码、汉字、东阿拉伯数字）0 问题后并入 content/i18n/<code>/ui.json。i18n-extract-ui 认 `L(locale, en, …)`。
- 相关 13 篇文章的产品区加「Try the tool」链接（ArticleBuyerBlock TOOLS）。
- 顺手修正：开门方向文章第 2 段十种语言都写反了两处——"reverse" 是朝自己开，不是朝外开；DIN 左对应 RH，不是 RHR。overlay 的 sourceHash 同步。
- 测试：tools.test.ts（4 项），npm test 498/498，tsc、eslint、i18n-lint、scaffold --check、i18n-client --check 全过。internal-link-placement：四个工具经 /tools/ 与文章到达，列入 EXEMPT。
- 本地 dev server 起不来（globals.css 的 postcss 超时，ship-merge 里 out/ 文件太多），页面在发布构建里核对。
- 未动：RAYEN；他人未提交文件。
