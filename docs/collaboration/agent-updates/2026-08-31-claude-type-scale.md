# claude — 字阶：h3 与正文曾是同一个值，这是「字太密集」的真实原因

| | |
|---|---|
| 范围 | `src/app/globals.css` 的 `:root` 字号 token + 新增 `src/app/type-scale.test.ts` |
| 测试 | lint + typecheck + `npm test` 135 全过；375px 实测 12 个页面无横向溢出 |
| 未碰 | `out/`；`SiteFooter.tsx`（Codex）；任何组件的 `text-*` 用法（只改 token） |
| 风险 | 全站字号变化。桌面最大值动得比手机最小值小得多，1512px 处的模块几何基本保持 |

## 诊断

客户反馈「字体太密集，没耐心看」，朋友喜欢亚马逊的排版。**问题不是字体，也不是行宽。**

```
改前   --text-h3: clamp(1.6rem, …, 1.8rem)
       --text-c1: clamp(1.6rem, …, 1.8rem)    ← 完全相同
       --text-h1: clamp(2.4rem, …, 2.6rem)    ← 只比正文高 6px
```

卡片标题、页脚小标题、正文段落**渲染成同一个尺寸**，h1 只高 6px。整页没有落点，
每一块都是同样重量的灰，眼睛无处可跳 —— 这正是「密集到读不下去」在描述的东西。
亚马逊的正文比我们**更小**（14px）却显得更透气，因为它的层级差是看得见的。

## 改后

| token | 手机 | 桌面 | 变化 |
|---|---|---|---|
| `text-h1` | 24 → **28** | 26 → 32 | 页面标题在手机上要能独自撑住一屏 |
| `text-h2` | 22 → **24** | 24 → 28 | |
| `text-h3` | 16 → **19** | 18 → 20 | **补上缺失的那一级**，任何宽度下都明显高于正文 |
| `text-c1` | 16 | 18 → 17 | 正文不动 |
| `text-c2` | 12 → **13** | 12 → 13 | 12px 次要文字在手持距离下低于可读下限 |

行高同步跟随（绝对 rem，不跟会把 20px 的字塞进 24px 的行里，反而更挤）。
`tracking-h3` / `tracking-c1` 由 0.036rem 收到 0.02rem —— 字号上去之后正字距不再需要那么大。

## 锁定

`src/app/type-scale.test.ts` 三条断言：

1. 相邻层级至少差 2px（`h1>h2>h3>c1>c2`）—— h3 与 c1 再次相等会直接失败；
2. h1 手机端 ≥ 28px，c2 ≥ 13px；
3. 每一级行高 ≥ 字号 × 1.2。

测试读的是 clamp 的**最小值**，即手机端，也就是投诉发生的那一端。

## 验证

375px 实测 14 个路由（首页 / 目录 / 类目 / 产品详情 / Product Finder / contact /
company / downloads / certifications / events / faq / news / `/es/` / `/es/` 类目），
`document.scrollWidth === innerWidth === 375`，**无一横向溢出**。
唯二伸出视口的元素在 `.nav-rail` 和首页类目滑轨的 `overflow-x` 容器内部，是设计如此。

1440px 复核：桌面导航行正常显示，rail 按 `xl:hidden` 隐藏。

## 没做

- **没跑 `npm run build` / `deploy:prep`**。`out/` 有 5164 个改动，构建令牌在别人手上，
  `next build` 会写 `out/` 直接对撞。lint / typecheck / test 全过，源码已在 main，
  构建者带上即可。
- 类目页那段**加粗导语**现在是 19px 三行加粗块，仍偏重。那是组件层的选择
  （`text-h3` + bold），不是 token 问题，留给 Codex 的设计批次一起看。
