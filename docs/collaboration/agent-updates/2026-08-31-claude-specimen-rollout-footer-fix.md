# claude — 排版样机上架到产品内页；回退 Footer 的三个黑按钮

| | |
|---|---|
| 范围 | `ProductDetail.tsx` `ProjectDetail.tsx` `CompanyOverview.tsx` `SiteFooter.tsx` + 其测试 |
| 测试 | `npm test` 145 全过；1512px 与产品页实测 |

## 一、样机落到产品内页

样机：https://claude.ai/code/artifact/5f338b62-48ba-4c3a-be9b-5ed932c080fb

四条原则里，字重阶梯和零字距在 `globals.css` 里已经是全站生效的。这一轮补的是
**组件里把"数据"当成"标题"排**的地方：

| 位置 | 改前 | 改后 |
|---|---|---|
| 产品摘要句 | `text-h3`（标题字重） | `text-lead`（大一号，正文字重） |
| 型号值 | `text-h3` | `text-lead tabular-nums` |
| 认证名 | `text-h3` | `text-c1 font-semibold` —— 卡片里的数据不是章节标题 |
| 规格取值 | `text-ink` | 加 `tabular-nums` |
| 项目摘要 / 建筑类型 | `text-h3` | `text-lead` |
| 公司数字 | `text-h3` | `text-lead tabular-nums` |

产品页实测（564 MB）：

```
h1          32px/40px  w700  ls -0.2px     ← 全页唯一的 700
导语        20px/26px  w400                ← 不再加粗
规格标签    13px       #6e6e73（灰）
规格取值    17px       #11110f（黑）+ tabular-nums
整页字重 ≥700 的元素：1 个
```

「整页只有一个粗体元素」就是样机要证明的事，现在产品内页做到了。

## 二、Footer 三个黑按钮：回退

`Imprint / Contact / Privacy Notice` 被套上了 `alibaba-hard-cta` ——
那是黑底硬阴影的阿里店铺 CTA。结果是**全页优先级最低的法务链接**排成三块黑砖，
挨着一个纯文字的 "Data preferences"，看起来像页面的主行动。甲方当场否掉。

改成与旁边一致的 `short-marker short-marker-compact text-c1 text-brand`。
实测 `background: transparent · box-shadow: none · padding: 0`。
顺手删掉只为这次误用而建的 `SiteFooter.module.css`。

⚠ **同时改了 `header-shelf.test.ts`。** 它原本断言这三个链接必须带
`alibaba-hard-cta ... styles.alibabaCta` —— 等于把这个 bug 锁死了。
按 `AGENTS.md`「被测试锁定的决定要在同一个提交里改测试」，
现在断言反过来：footer 里**不得出现** `alibaba-hard-cta`，且必须是 short-marker。
`alibaba-hard-cta` 本身保留 —— 它属于顶栏那一个阿里按钮，那才是它的用途。

## 三、弹窗没坏

甲方问「弹窗是不是又没了」。**没有。** `content/promo.json` 的 `delaySeconds: 10`,
我第一次只等了 5 秒所以没看到。等满 11 秒后 "Talk to us" 正常出现，
`enabled: true`、`cooldownMinutes: 0`、surfaces 覆盖 8 类页面。这是设计行为不是缺陷。

## 四、按甲方指示暂停

- **买家题库**：搁置，等明天。
- **CAD 读图**：停止，后续由人工美工逐张审查修订。
