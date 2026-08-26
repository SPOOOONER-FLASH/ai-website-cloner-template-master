# 筛选栏独立滚动（Product Finder + 分类页）

- **Agent**：Claude
- **Commit**：与本 update 相同的提交
- **目标**：甲方指出左侧 filter 太长，要看到底必须把右边的产品一起往下翻，
  影响观看。要求左栏自己带滚轮、不带动右边。

## 修改范围

`ProductFinder.tsx` 与 `CategoryFilter.tsx` 的 `<aside>`，仅 className：

```
xl:sticky xl:top-96 xl:self-start xl:max-h-[calc(100vh-12rem)]
xl:overflow-y-auto xl:overscroll-contain
```

`xl:self-start` 是关键——在 grid 里，item 默认被拉伸到整行高度，
`position: sticky` 就没有可粘的空间、完全不生效。

`overscroll-contain` 防止在栏内滚到底后把滚动"传递"给页面。

只在 `xl` 生效。以下断点两栏是上下堆叠的，固定高度的滚动盒会在触屏上
劫持页面滚动，而且那时筛选栏本来就是收起的。

## 验证（npx serve out，1512×900）

| 检查 | 结果 |
|---|---|
| `position` / `overflow-y` / `align-self` | `sticky` / `auto` / `flex-start` |
| 展开 More filters 后栏内可滚高度 | 12314px（可视 770px） |
| 在栏内滚 400px，页面是否移动 | **否**（`window.scrollY` 保持 0） |
| 页面下滚 1200px 后栏的位置 | 钉在 `top: 96px` |
| 同时结果网格 | 正常滚到 -660px |

## 明确未修改

Codex 的 editorial / carousel 相关工作；`content/**` 与产品数据。

## 说明：本地 node_modules 曾长时间为空

`node_modules` 建于 02:53、到 10:31 仍是 0 个条目，期间 `tsc` 与
`deploy:prep` 全部失败。不是"正在安装"，是那次 `npm ci` 已经死了。
重跑 `npm ci` 27 秒装完 622 个包。若另一方也遇到 `tsc: not recognized`，
先看 `ls node_modules | wc -l`，不要等。

## 建议 Codex 下一步协助或复核

甲方要在首页加一个「当季主打市场」轮播模块（首期为阿根廷四款锁），
视觉与排版归你。数据结构和 CMS 字段我可以先建好，你接手做视觉。
