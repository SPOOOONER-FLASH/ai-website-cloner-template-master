# 修复 CMS 后台无法加载（线上 /admin 全挂）

- **Agent**：Claude
- **Commit**：与本 update 同一提交
- **目标**：线上 `/admin` 报 `YAMLSemanticError: Map keys must be unique; "hint" is repeated`，
  后台完全打不开。修好并加测试防止复发。

## 根因

是我在 `5869a40f`（弹窗改多卡那次）搞坏的，**不是 Codex**。那次提交把重写后的
`site` 块**追加**进文件而没有替换旧块，结果：

- `projects` / `news` / `taxonomy` / `site` 各存在两份（718 行里有约 240 行是重复）
- 新的 `site` 块里还混进了 6 行本属于产品 collection 的字段
  （video poster 的 hint、video label、attachmentIds、relatedModels、seoTitle、seoDescription）
- 其中那行 video hint 让 `cards` 有了两个 `hint` 键 → Decap 拒绝加载整个后台

两份 `site` 不能互换，所以是外科手术不是直接删：

| | 第一份 (338–406) | 第二份 (587–717) |
|---|---|---|
| promo | 新版 `cards` 多卡片 ✅ | 旧版单卡片 ❌ |
| navigation / settings / faq | 没有 ❌ | 有 ✅ |

做法：把新版 promo 从第一份取出（去掉那 6 行），删掉第一份和重复的三个 collection，
再把新版 promo 嫁接进第二份替换旧版。718 → 479 行。

## 修改范围

- `public/admin/config.yml` — 修复（脚本 `scripts/fix-cms-config.mjs`，含全部锚点断言）
- `src/lib/cms-config.test.ts` — 新增守卫
- `package.json` — `npm test` 纳入该测试

## 验证

- 每个 `file:` 路径现在只出现一次；5 个 collection 无重复
- `npm test` 33 通过
- `npx serve out` 打开 `/admin/`：无 config error，正常进入「使用 GitHub 登录」
- 顺带把 CMS 里 `delaySeconds` 的默认值从 20 改回 10，与 `content/promo.json` 一致

## 为什么之前没被发现

**没有任何构建步骤会读这个文件**。Decap 只在浏览器里解析它，所以配置坏掉时
CI 全绿、部署成功、后台白屏。新增的 `cms-config.test.ts` 就是补这个盲区——
它做结构检查（重复兄弟键、collection 重名、同一 `file:` 被两处编辑），
不依赖 YAML 库。

## 明确未修改

- Codex 的 editorial / carousel / MediaPlaceholder 相关工作，一律未碰
- `content/promo.json` 本身（只改了 CMS 里的默认值）

## 已知风险 / 外部阻塞

- 线上要等这次推送 + 服务器拉取后才恢复
- SSH 部署仍缺 `SSH_HOST` / `SSH_USER` / `SSH_TARGET_DIR` 三个值（甲方宝塔连不上）

## 建议 Codex 下一步协助或复核

1. 复核 `config.yml` 里 `navigation` / `settings` / `faq` 三块字段是否与
   `content/*.json` 现状一致——我只保证了结构合法，没有逐字段核对语义。
2. 我删掉了自己上一轮加的 agent-lock（`scripts/agent-lock.mjs`、`.githooks/`），
   改用你定的轻量协议。如果你那边还引用着 hook，记得同步清掉
   `git config core.hooksPath`。
