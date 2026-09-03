# Skills — 装了什么、为什么、怎么用

> 2026-09-03 调研。甲方下载了 10 个仓库，要求「先检测有没有可用的，就用上」。
> 这份文件记录每个仓库到底是什么、值不值得装、怎么更新。

---

## 一条必须先说的事实：skill 不是免费的

**每个已安装 skill 的名字和说明都会在每次会话开始时载入上下文。** 十个仓库
一共 **1,586 个 skill**，全装约 11 万 token —— 会挤占处理实际工作的空间，而且
选项过多会让选择本身变差。

所以规则是 **按项目需要挑，不按仓库整装**。

---

## 十个仓库，逐个结论

| # | 仓库 | 是什么 | 规模 | 结论 |
|---|---|---|---|---|
| 1 | **pbakaus/impeccable** | AI 前端设计审查系统。1 个 skill + 23 个命令 + **61 条确定性检测规则**（不调 API 就能查出「一看就是 AI 做的」模式：默认字体、紫色渐变、卡片套卡片） | 18 | ✅ **应该装** |
| 2 | **Leonxlnx/taste-skill** | 反 slop 前端 skill。三个可调参数：设计变化度 / 动效强度 / 视觉密度。含 image-to-code、redesign | 13 | ✅ **已装 5 个** |
| 3 | **nexu-io/open-design** | 开源版 Claude Design。100+ skill、151 个设计系统包、277 个插件。**是 MCP 服务器 + 桌面应用**，不是纯 skill 包 | 536 | ⚠ 太大，按需 |
| 4 | **affaan-m/ECC** | agent 工作流框架：plan→test→implement→review→verify。68 个 agent、286 个 skill、语言规则、运行时 hook | 898 | ⚠ 太大，且与本仓库 AGENTS.md 的纪律重叠 |
| 5 | **zubair-trabzada/geo-seo-claude** | GEO 工具包，13 个子 skill，`/geo audit <url>` 起 5 个并行子代理 | 32 | ✅ **已装 7 个** |
| 6 | **every-app/open-seo** | 开源 SEO 平台（Semrush 替代），**MCP 服务器**，需要 DataForSEO API key + 自建 | — | 💰 需要密钥和部署 |
| 7 | **nextlevelbuilder/ui-ux-pro-max-skill** | 79 种 UI 风格、192 条行业推理规则、192 组配色、74 组字体搭配、22 个技术栈 | 26 | ✅ **已装 4 个** |
| 8 | **yaojingang/GEOFlow** | **完整的 Laravel 应用**（PHP 8.3 + PostgreSQL + Redis），不是 skill 包 | 13 | ❌ 与本项目无关 |
| 9 | **coreyhaines31/marketingskills** | 60+ 营销 skill：CRO、文案、SEO、投放、分析、增长 | 50 | ✅ **已装 6 个** |
| 10 | **DavidHDev/react-bits** | **组件库，不是 skill**。165+ 个动画 React 组件，`npx shadcn add @react-bits/<name>` | 0 | 📦 做配置器动画时按需取用 |

---

## 已安装（35 个 = 原有 13 + 新增 22）

位置 `~/.claude/skills/`

| 组 | skill |
|---|---|
| 设计品味 | `taste-skill` `minimalist-skill` `redesign-skill` `brandkit` `image-to-code-skill` `design` `design-system` `ui-styling` `brand` |
| GEO/SEO | `geo-audit` `geo-citability` `geo-content` `geo-crawlers` `geo-llmstxt` `geo-schema` `geo-technical` |
| 营销 | `ai-seo` `cro` `copywriting` `content-strategy` `competitors` `analytics` |
| 原有 | Cloudflare 全家桶 13 个 |

---

## 怎么装、怎么更新

**标准方式是 `npx skills add`**（Agent Skills 规范的官方 CLI），不是手动解压：

```bash
npx skills add coreyhaines31/marketingskills
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

**支持插件市场的**（能在 `/plugin` 菜单里更新）：

```
/plugin marketplace add pbakaus/impeccable
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin marketplace add https://github.com/affaan-m/ECC
```

**geo-seo-claude 有自己的安装脚本**（会建独立 venv，不污染系统 Python）：

```bash
curl -fsSL https://raw.githubusercontent.com/zubair-trabzada/geo-seo-claude/main/install.sh | bash
```

⚠ **zip 解压是没有更新机制的**。当前这 22 个是从 `Downloads/skills/` 拷过来的，
要更新就得重新下载再拷。想要能更新，改用上面的 CLI 或插件市场重装一次。

---

## 对这个项目具体有什么用

| skill | 用在哪 |
|---|---|
| `redesign-skill` | 审现有页面，找出「一看就是 AI 做的」模式。产品页、类目页都该过一遍 |
| `impeccable` 的 61 条检测规则 | **确定性**检查，不靠模型判断 —— 比我肉眼看可靠 |
| `geo-audit` | 完整 GEO 审计，5 个并行子代理，覆盖面比我手写的 `audit-seo-geo.mjs` 广 |
| `geo-citability` | 逐页打「AI 会不会引用这段」的分，直接对应我们的 GEO 目标 |
| `cro` | 联系页、报价表单的转化率 —— dead click 那类问题的系统化版本 |
| `copywriting` | 126 个产品缺一句话介绍，这是批量写的方法论 |
| `competitors` | 对比页/替代页的写法，我们已经有 15 个 `/compare/` 页 |
| `react-bits` | 配置器的动画组件，直接抄现成的 |
