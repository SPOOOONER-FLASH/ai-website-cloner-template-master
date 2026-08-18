# 内容后台：让同事远程使用（GitHub 登录）

面向非技术同事。全程大约 20 分钟，只需要做一次。
做完之后，同事在自己电脑上打开一个网址、用 GitHub 账号登录，就能改产品内容。

---

## 先弄清一件事：保存 ≠ 上线

这个站点是**静态导出**的：线上服务器只放构建好的 `out/` 目录，不跑 Node。

所以流程是三段，不是一段：

```
同事在 /admin/ 修改并发布  →  改动进入 GitHub 的 content/*.json
                           →  有人执行 npm run deploy:prep 并 git push
                           →  服务器每小时拉取，网站更新
```

**中间那一步没有自动化。** 同事自己无法让网站更新，只能让内容进入仓库。
这是当前部署方式（`out/` 提交进仓库、服务器不构建）带来的必然结果，不是配置漏了。

三种处理方式，选一个：

| 方案 | 说明 |
|---|---|
| **A. 人工构建（当前）** | 同事发布后通知你，你本地 `npm run deploy:prep` 再 push。零成本，但依赖你在线。 |
| **B. GitHub Actions 自动构建** | 内容一合并进 main 就自动跑构建并把 `out/` 提交回仓库，同事发布后约 2 分钟自动上线。需要在仓库里加一个 workflow 文件，不需要任何服务器密钥。**推荐**，但属于另一项工作，本次未做。 |
| **C. 换成 Vercel 部署** | 最干净，但要改变现有部署方式，甲方那边要重配域名。 |

需要做方案 B 的话告诉我，单独开一次。

---

## 第一步：把同事加进仓库

1. 打开 https://github.com/SPOOOONER-FLASH/ai-website-cloner-template-master
2. **Settings → Collaborators → Add people**
3. 输入同事的 GitHub 用户名，权限选 **Write**

没有 Write 权限的人登录后台后会看到内容，但保存会失败。

---

## 第二步：创建 GitHub OAuth App

GitHub 不允许纯前端页面直接换取访问令牌，中间必须有一个极小的中转服务。
先建应用，拿到一对 ID / 密钥。

1. 打开 https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. 填写：

   | 字段 | 填什么 |
   |---|---|
   | Application name | `Canton Hyland CMS` |
   | Homepage URL | `https://spoonercantonlock.stahlock.com` |
   | Authorization callback URL | `https://canton-cms-auth.你的账号.workers.dev/callback` ← 第三步会拿到真实域名，可以先随便填，之后回来改 |

3. 建好后点 **Generate a new client secret**
4. 把 **Client ID** 和 **Client Secret** 抄下来。
   **Secret 只显示一次**，关掉页面就再也看不到（可以重新生成）。

⚠ Client Secret 不要提交进仓库、不要发微信截图。它只填进下一步的 Cloudflare 后台。

---

## 第三步：部署中转服务（Cloudflare Worker，免费）

用开源的 `sveltia-cms-auth`，它兼容 Decap，只做一次「code 换 token」，不存任何数据。

1. 注册/登录 https://dash.cloudflare.com （免费套餐足够）
2. 打开 https://github.com/sveltia/sveltia-cms-auth ，按其 README 的
   **Deploy to Cloudflare Workers** 步骤部署（点按钮，或用 `npx wrangler deploy`）
3. Worker 名称填 `canton-cms-auth`
4. 部署完成后，在 Worker 的 **Settings → Variables** 里加三个环境变量：

   | 变量名 | 值 |
   |---|---|
   | `GITHUB_CLIENT_ID` | 第二步的 Client ID |
   | `GITHUB_CLIENT_SECRET` | 第二步的 Client Secret（选 **Encrypt** 加密保存） |
   | `ALLOWED_DOMAINS` | `spoonercantonlock.stahlock.com` |

   `ALLOWED_DOMAINS` 很重要：它限定只有我们自己的站点能用这个中转服务，
   别人拿到域名也用不了。
5. 复制 Worker 的完整域名，形如 `https://canton-cms-auth.你的账号.workers.dev`
6. 回到第二步的 OAuth App，把 **Authorization callback URL** 改成
   `<Worker 域名>/callback`，保存

---

## 第四步：把域名填进配置

打开 `public/admin/config.yml`，找到 `backend:` 段里被注释掉的这一行，
去掉 `#` 并换成第三步拿到的真实域名：

```yaml
backend:
  name: github
  repo: SPOOOONER-FLASH/ai-website-cloner-template-master
  branch: main
  base_url: https://canton-cms-auth.你的账号.workers.dev
```

然后构建并推送：

```bash
npm run deploy:prep
```

再 `git add -A && git commit && git push`。等服务器下一次拉取（每小时），
或者手动在服务器上 `git pull`。

---

## 第五步：验收

1. 打开 https://spoonercantonlock.stahlock.com/admin/
2. 点 **Login with GitHub**，弹窗授权
3. 界面应该是**中文**的，左侧有「产品」「应用案例」「分类与下载」
4. 随便改一个产品的简介 → **Save** → **Publish**
5. 去 GitHub 仓库的 **Pull requests**，应该能看到一条新的 PR（这就是编辑工作流）

出问题时：

| 现象 | 原因 |
|---|---|
| 点登录没反应 / 报 `Failed to authenticate` | `base_url` 没填、填错，或 OAuth App 的 callback URL 与 Worker 域名不一致 |
| 登录成功但保存报 403 | 同事没有仓库 Write 权限（第一步） |
| 界面还是英文 | 浏览器缓存了旧的 `config.yml`，强制刷新（Ctrl+Shift+R） |
| 内容改了但网站没变 | 正常 —— 见本文开头「保存 ≠ 上线」 |

---

## 关于「编辑工作流」

`publish_mode: editorial_workflow` 开着，所以同事的保存分两段：

- **Save** —— 存成草稿，在 GitHub 上是一个 Pull Request，网站和 main 分支都不受影响
- **Publish** —— 合并进 main，内容正式进入仓库

好处是错误的认证声明、编造的规格数据可以在合并前被拦下。
如果觉得对同事太绕，把 `publish_mode` 那一行删掉即可改成保存即提交 ——
但考虑到规格表和认证字段的性质，建议保留。

---

## 你本地仍然可以不登录

`local_backend: true` 保留着。你在自己电脑上：

```bash
npm run cms
```

打开 http://localhost:3001/admin/index.html —— 不需要登录、不走 GitHub，
直接改磁盘上的文件。改完自己提交。上面这一整套配置不影响这个用法。
