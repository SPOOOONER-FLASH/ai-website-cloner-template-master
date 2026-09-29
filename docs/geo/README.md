# GEO 基线：怎么量「AI 有没有推荐我们」

建立：Claude，2026-09-28。依据 QuickCreator《被 AI 引用的次数翻了 4 倍》一文的方法：**先造尺子，口径锁死，三个月后原样重跑**。

## 已有的两把尺子（别重复造）

| 尺子 | 量什么 | 怎么重跑 |
|---|---|---|
| Bing AI Page Stats | Copilot 引用了我们哪些页面 | `npm run audit:citations -- <导出的.csv>`，见 `docs/collaboration/2026-09-18-ai-citations.md` |
| Clarity AI Visibility | 7 天引用数、引用份额（SoA）、AI 引流会话 | 控制台导出，见 `docs/collaboration/2026-09-20-clarity-ai-visibility.md` |

这两把只看微软系（Copilot / Bing）。**ChatGPT、Perplexity、Gemini 此前没有任何测量**，这份基线补的就是这一块。

## 这一把：45 个固定问题 × 4 个平台 × 3 次采样

- 问题集：`docs/geo/baseline-queries.json`（英 37 / 西 5 / 葡 3；制造商名单、OEM 采购、规格、对比、品牌、型号级六类意图。09-28 文案会话在第一次记录前补了 oem-05–07 和 mdl-01–05：型号级问题只写产品特征、不写型号，看 AI 最后一步点谁）。
- 打印空白记录表：`npm run geo:baseline -- --out tmp/geo-baseline-YYYY-MM-DD.csv`（540 行）。
- 规则：
  1. **问题一旦记录过基线就不改字**。要加新问题，给新 id。
  2. ChatGPT 用临时聊天、开搜索；其他平台用未登录或无历史的会话。个性化答案不算数。
  3. 每题每平台问 3 次，逐次记：是否提到我们、第几位、AI 怎么描述我们、有没有引用 cantonlock.com 的 URL、引用了哪些别的域名。
  4. 每季度同一周重跑一次。只和上一次同口径的结果比。
- 读法：先看「被引用」（我们的 URL 出现在来源里），再看「被推荐」（品牌名出现在答案里）。QuickCreator 的案例里前者先涨、后者跟着涨；只看后者会误判。

## 为什么不写成自动脚本

各平台没有稳定的免密钥接口，登录态的答案又是个性化的，自动跑出来的数字反而不可比。记录表由人填，问题集和表头由脚本保证每次一致。结果表放 `docs/geo/results/`（第一次跑的人建目录）。
