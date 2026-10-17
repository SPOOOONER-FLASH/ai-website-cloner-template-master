# Claude（云端会话）· 2026-10-16 · 接管 8 个本地会话：计算器带尺寸询盘、check 修红、十语目录数

甲方：「所有你都接管了图片里的会话，接续未完成的工作」（HYDE工程交接配置、hyde前端管理、Hyde 文案、硬件产品数据库与报价系统、BAU 2027 Ausstellerservice、Hyde 多语言页面 SEO 优化、恐慌出口装置报价表、Hyde 视觉工作图片生成）。云端容器，分支 `claude/loving-albattani-nmoa45` → PR。

## 改了什么

- **#149 收尾：锁芯计算器带尺寸进询盘。** `CylinderCalculator.tsx` 结果下加主按钮（十语文案在 `QUOTE`），链到 `/<语种>/contact/#product=…&note=…&from=tools/euro-cylinder-calculator`。`note` 是结论句加上门厚、两侧饰板深度和偏心中心，标签沿用计算器已有的文案。`inquiry-prefill.ts` 新增 `note`（上限 800 字符）；`InquiryForm` 的需求框改为受控组件，预填 `note`，发送成功后清空。`from` 走现有的 `source_article`，外贸邮件里能看到询盘来自计算器。
- **main 上 `npm run check` 第一步就红。** 10-14 菜单底栏的 `.footerCta` 写了 `var(--motion-fast, 150ms)`，动效守卫把回退值 150ms 判成裸值。已改为 `var(--motion-fast) var(--motion-ease-crisp)`。
- **目录总数过期（事实修正）。**
  - 英文：功能指南 FAQ 仍写 613（正文已是 616）。西语和葡语：功能指南正文与 FAQ、背距文章正文都写 613。已改为 616。
  - 七语译本（fr/de/ja/ko/tr/ru/ar）：功能指南、翻新指南、粉末喷涂指南、图纸指南、背距文章、「能拿到哪些文件」文章都写 613，已改为 616。粉末喷涂指南的饰面行 326 改为 330，「能拿到哪些文件」的可见产品数 546 改为 549。
  - 只改数字，与英文逐一核对过：功能计数 78/27/18/21/8 未变，背距 182/116/23/36/22 未变。草稿文章 `why-the-catalogue-is-this-wide` 不动。
- **防线：** `article-catalogue-claims.test.ts`
  - 三语计数检查扩展到七语译本；
  - 新测试：上面两篇文章的十语正文和 FAQ 里，不得出现比当前总数小 1–20 的数字。
- **核对后关掉的状态：**
  - #158、#160：首页轮播三页和葡语巴西页已在 `out/`；
  - BAU 专栏第 4 项：`/bau-2027/`、`/de/bau-2027/` 已建，`relatedHref` 已指向专栏。

## 第二阶段：七语镜像补齐（「Hyde 多语言页面 SEO 优化」会话的待办）

10-10 之后看板没有更新过。重算之后，七语每种语言都有以下缺口：

- 75 句界面文案没有译文；
- 新品 037 PS 没有译文；
- 16 条记录过期（英文改过，译文没跟上）。

**整篇重译不必要。** 新脚本 `scripts/i18n-stale-diff.mjs` 按 overlay 记录的 `sourceHash`，在 git 历史里找到译文当时依据的那一版英文，逐段对比。结果每个语种只有 35 处真正改动，而不是 15 篇整篇重译。

- 云端是浅克隆，按 partial clone 方式加深历史（`--filter=blob:none --shallow-since=2026-09-20`）后才能找到旧版英文。
- 新脚本 `scripts/i18n-apply-patch.mjs` 负责回写这些改动。只有一个字段的所有改动都落地，才把它的 `sourceHash` 前移到新英文。

7 个子代理按语种并行填写译文，dry-run 全部通过后由我统一合并。各语种结果相同：

- 界面文案 74 句；
- 037 PS 一条；
- 补丁 35/35，25 个字段转为最新。

真正改了文字的只有 6–7 处：

- 037 从 lever 改为 knob（summary / features / specs）；
- 铰链 29→30、four→five；
- 执手 62→63；
- 锁 255→257、15%→14%、forend 7→8。

其余补丁项的译文已经是新内容（10-13 保密清理当时已同步删段，没有泄露）。

**附带修正：**

- `BRAND` 白名单加入法定全称 "Canton Hyland Hardware & Building Material Co., Ltd."，以后不会再被当成待译句。
- 037 在 de、ja、ko 的 seoDescription 和 tr 的 name、seoTitle 里仍写 lever / Kol，已改为 knob / Topuz。
- 计算器按钮按母语审校意见调整：fr「pour ces cotes」、ru「по этим размерам / Цилиндровый механизм европрофиля」、ar「لهذه المقاسات / أسطوانة ببروفيل أوروبي」。

**术语不一致（留给多语言会话统一，本次没改）：**

| 语种 | 不一致之处 |
|---|---|
| tr | 3 条旧界面句写 floor spring = 「yer yayı」，术语表是「yer menteşesi」 |
| ko | 有的写 플로어 스프링，有 50 条写 플로어 힌지 |
| fr | 阿根廷旧界面句写「serrure à larder」，本次用「à mortaiser」 |
| ar | 巴西页标题写 panic bar =「قضبان الطوارئ」，其余地方用「بار الهلع」 |

## 验证

`npm run check` 全绿：motion、lint、typecheck、`npm test`、build、`assets:prune`、`test:export`。结果见 PR。`out/` 是本地构建产物，没有提交。

## 没动的部分

`out/`、RAYEN。#159 首页轮播三张大图仍是真实产品照居中的占位图，需要视觉会话用实拍图做场景合成，云端没有出图工具。

## 风险和阻塞

- **hyde-brain 私有仓（产品数据库、报价表两个会话的仓库）本会话没能接入**：add_repo 被权限拦下。那两个会话的未完成项要等甲方授权或回到本地会话继续。
- 计算器按钮在七语页面上用的是新写的译文，未经母语审校，建议多语言会话抽查。

## 下一步

- johns 机器的工程会话：合并 PR 后 `npm run release:hyde`。上线后点一次计算器按钮，确认 /contact/ 需求框已预填。
- 视觉会话：#159。
- 多语言会话：看板现在是七语界面 100%、过期 0，但页面上仍有约 226–239 句英文残留（`scripts/audit-locale-pages.mjs --locale <code>`），出自界面键以外的地方，是下一批的工作。上面那 4 条术语不一致也一起处理。
- 以后的过期译文，先跑 `node scripts/i18n-stale-diff.mjs`，不要用 `i18n-batch --stale` 整篇重译。云端浅克隆要先加深历史，参照上面的 partial fetch。
