# 联系页三语：三个信箱提到最前，并拔掉两处给访客看的部署备忘

**agent**: Claude · **日期**: 2026-09-20 · **范围**: `src/app/(en|es|pt)/contact/page.tsx`、`src/components/site/AssetRequestForm.tsx`

## 甲方指示

> 联系页面英西葡，都可以有优先最先看到三个 cantonlock 邮件。比目录和地址都先。着重引导。

## 改了什么

**顺序**：三个信箱从第三/第四块提到了简介段落正下方，排在目录和地址之前。三个语种一致。
此前 `/es/` 与 `/pt/` 的顺序是「目录 → 地址 → 信箱」，英文是「地址 → 信箱 → 代表 → 目录」——
现在三语统一为「信箱 → 地址 → 代表 → 目录」。

**着重**：不是加装饰，是把权重倒过来。

| | 改前 | 改后 |
|---|---|---|
| 区块标题 | `text-h3` | `text-h2` |
| 邮箱地址 | `text-c1`，与标签同一行右对齐 | **`text-h3`，独占一行** |
| 用途标签 | `text-c2`，左侧 | `text-c2`，降为地址上方的说明 |
| 引导语 | `text-c2`「按市场从中山和德国回复」 | `text-c1`「写邮件是拿到报价最快的路——读它的是工程师，不是队列」 |

倒过来的理由写进了代码注释：**买家在这一块是在找一个可以复制的东西，可以复制的是地址。**

## 为什么值得改（Clarity 里有这一条的代价）

9 月 18 日西班牙那位：`/es/contact/` 停留 **17 分 56 秒**，从产品页 300-panic 进来，
填完表单、**14:23 提交**，然后在 **16:08 和 16:47 反复点联系元素** ——
提交静默失败了，而三个信箱在折叠线以下。

一个已经决定要联系的人，不该先滚过一个 PDF 和一条街道才知道怎么联系。

## 顺带修掉两处 2026-09-17 那轮漏掉的

那一轮把「请添加 NEXT_PUBLIC_W3F_KEY」从 `InquiryForm` 的失败分支里拿掉了。
但同一句话还留在另外两个地方，两处都是给访客看的：

1. **`/contact/` 页脚那段常驻文字**：「Submission is enabled when the deployment contains
   a valid NEXT_PUBLIC_W3F_KEY.」—— 不是失败时才出现，是**一直印在页面上**。
   改成买家读得懂的一句：表单到达的是上面那几个信箱；发不出去时页面会保留他填的全部内容
   并给一个填好的邮件链接。
2. **`AssetRequestForm`**：缺密钥时对着来要图纸的人回「Add NEXT_PUBLIC_W3F_KEY before
   publishing this page.」现在按 `InquiryForm` 的同一套处理 —— `console.warn` 给开发者，
   页面上给访客一句能行动的话，并带上他要的那份文件名。

## 验证

```
npm run typecheck   通过
npm run lint        0 error（6 条既有 warning，均为未使用变量）
npm test            335 / 335
```

⚠ **没有构建，`out/` 未动。** 源码推送不等于上线 —— 服务器发的是 `out/`，
这三页要重出构建才会生效。

## 没碰的

`docs/design-references/2026-09-09-*` 下另一个会话的未提交产物一律未动。
合并 `origin/main` 时挡路的 13 个未跟踪文件（`*-panic-exit-device-trim.*`）
经 `git hash-object` 逐个核对**与 origin 上的 blob 逐字节相同**，
已备份到 `tmp/claude-premerge/untracked/` 后移开，不是删除。
本地对 6 个已跟踪文件的未提交修改已存成 `tmp/claude-premerge/local-modified.patch`。

## 下一个人接着做

1. **重出构建并部署**，这三页才会上线
2. Clarity 那 **267 次 Unsuccessful** 爬虫请求，见 `2026-09-20-clarity-ai-visibility.md`
3. Web3Forms 的 key 仍然没有 —— `OPEN-ITEMS.md` 第 0 条，表单从上线起一封没发出去
