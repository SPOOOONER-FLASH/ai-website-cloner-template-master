# HYDE 静态站生产性能运行手册

> 适用范围：`spoonercantonlock.stahlock.com` 当前 nginx 静态站。
> 最后核验：2026-08-25。执行者需要服务器 shell 或托管面板权限。

## 1. 已确认事实

仓库端的首屏图片与静态导出问题已经修复并上线：

- 初始 Hero DOM 只有 1 张图片；393px DPR1 使用 800w / 14,502 B 候选。
- 非活动轮播图不会在首次 HTML 中同时触发下载。
- editorial 建筑/材质图有响应式候选；产品、证书和客户设施素材不被错误派生。
- Windows Next 16.3 的嵌套 RSC segment 已平铺；抽查联系、产品分类和产品详情 payload 均为 200。

剩余生产瓶颈是：

1. HTML TTFB 波动很大，同轮样本约 1.7–5.6 秒；
2. HTML 与 RSC 仍没有明确的 `Cache-Control`。**WebP 已经有了** —— 实测返回
   `public, max-age=86400, stale-while-revalidate=3600`，说明第 4 节的图片规则已经上线；
   但同一响应目前会返回两个 `Cache-Control` 头（`expires` 指令与 `add_header` 各出一个），
   应收敛为一个。
3. 文件内容与 SHA-256 不变时，ETag / Last-Modified **精确每 5 秒**改变一次，且 inode 同时改变
   —— 文件是被删除重建，不是 `touch`。
4. GitHub Actions 的 SSH deploy step 因该 run 未获得 `SSH_HOST` 而跳过。**生产实际不由 Actions
   发布**：服务器自己持有仓库副本并主动拉取。根因已于 2026-08-25 确认，见第 2 节。

不要通过全站 SSR、数据库查询或再次牺牲图片清晰度来掩盖以上基础设施问题。第 3 条是当前最大的
单点损失：它让所有浏览器缓存和任何 CDN 在 5 秒内必然失效，其影响大于剩余的图片体积优化。

## 2. 发布链路与 5 秒重写循环（2026-08-25 已确认根因）

本节此前是一份待办盘点清单。2026-08-25 已通过服务器 shell 只读核查取得答案，改为记录事实。

### 2.1 真实发布链路

生产**不是** GitHub Actions rsync 上来的。服务器 `43.131.27.225`（腾讯云 OpenCloudOS，宝塔面板）
自己持有一份完整仓库副本，nginx 只把其中的 `out/` 子目录当站点根：

```text
/www/wwwroot/spoonercantonlock.stahlock.com/     ← 完整 git 仓库（origin 走 HTTPS）
  ├─ AGENTS.md  BUILD_PLAN.md  CLAUDE.md  .claude/ ...
  └─ out/                                        ← nginx root
```

发布者是**宝塔「秒级任务」`268542d1c5c1d14ec63a3ed5e75d63ff`**，脚本在
`/www/server/cron/` 同名文件，由 `btpython /www/server/panel/script/second_task.py 5 <taskid>`
驱动，**每 5 秒**执行一次核心动作：

```bash
cd /www/wwwroot/spoonercantonlock.stahlock.com || exit 1
git fetch origin main --depth 1
git reset --hard origin/main
chown -R www:www .          # ← 循环的触发点
```

这条链路本身是通的：服务器 HEAD 与 `origin/main`、本地 `main` 三者一致。问题只出在它无条件执行。

### 2.2 循环机制

`chown -R` 是自噬循环的起点，而不是无害的收尾动作：

1. `chown -R www:www .` 把全部文件的 uid/gid 由 root 改为 www；
2. git 索引（`.git/index`）**记录每个条目的 uid/gid**，属主一变即判定全部文件 stat-dirty；
3. 下一轮 `git reset --hard` 因此重新 checkout 全部 3,833 个文件（删除并重建）；
4. 新文件带来新 inode 与新 mtime，nginx 的 ETag 与 Last-Modified 随之全变；
5. `chown` 再次执行，回到第 1 步。

实测证据（`out/index.html`，内容与大小恒定 85,789 B）：

```text
mtime=21:47:59  inode=160044218
mtime=21:48:04  inode=159967284
mtime=21:48:09  inode=159967294
mtime=21:48:14  inode=159499288
```

代价：每 5 秒重写 3,833 个文件（约每天 6,600 万次写入），每天向 GitHub 发起约 17,280 次
`git fetch`，浏览器缓存与 CDN 的有效期实际为 0，并持续占用磁盘 I/O —— 这与第 1 节记录的
TTFB 大幅抖动一致。

### 2.3 修复：加护栏，而不是降低频率

destructive 的是 `git reset --hard` 与 `chown -R`，不是 `git fetch`。只要让二者在**确有新提交时**
才执行，空转轮询几乎零成本，可以保留“提交后很快上线”的体验：

```bash
cd /www/wwwroot/spoonercantonlock.stahlock.com || exit 1
git fetch origin main --depth 1
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  git reset --hard origin/main
  chown -R www:www .
fi
```

配套建议：

- 轮询间隔由 5 秒放宽到 **30 秒**。上线延迟仍在体感“立刻”范围内，而对 GitHub 的请求量从每天
  约 17,280 次降到约 2,880 次，避免触发滥用限流。
- 更优解是改用 GitHub webhook 触发（宝塔有 WebHook 插件），完全取消轮询。属于后续优化，不阻塞本修复。
- 修改应在宝塔面板的计划任务界面进行，便于留存历史与回滚；该任务是当前**唯一**上线通道，
  变更需站点负责人确认后执行。

验收：连续 60 秒无新提交时，对同一 HTML 与 WebP 发 10 次 HEAD，ETag 与 Last-Modified 必须保持不变。

### 2.4 附带发现：仓库根目录存在陈旧站点副本

`git status --porcelain` 长期显示 20 项未跟踪内容，全部是早期某次部署方式把导出文件直接倒在
仓库根目录留下的残留：

```text
?? index.html  ?? _next/  ?? images/  ?? products/  ?? company/  ?? es/  ?? .user.ini ...
```

nginx root 指向 `.../out`，因此这些文件**未对外提供**，不构成安全或功能问题，但占用磁盘并让
`git status` 永远不干净。清理属于独立事项，需单独确认后执行，不要与本节修复混在一起。

### 2.5 变更前仍需遵守

不要对未知目录直接执行删除或 `rsync --delete`。`sudo nginx -T` 可能包含域名、证书路径和上游
地址，回传前必须脱敏，不得公开私钥或凭据。

## 3. 先建立可回滚的原子发布，再收敛链路

> 前提更新（2026-08-25）：服务器拓扑已在第 2 节查明，当前上线通道是服务器侧的宝塔秒级任务，
> 不是 Actions。本节讨论的是**是否要把发布收敛到 Actions**；在此之前请先按 2.3 修复循环，
> 两件事互不阻塞。

当前仓库 workflow 会把 `out/` 以 `rsync --delete` 写入 secret 指定的 `SSH_TARGET_DIR`。发布目录
现已确认为 `/www/wwwroot/spoonercantonlock.stahlock.com`（其 `out/` 即 live，无软链接、无 staging），
因此若启用该 step，rsync 会直接写 live 目录，且会与秒级任务的 `git reset --hard` 互相覆盖 ——
两条链路不能同时开启。workflow
本身未显式实现版本化 release、原子切换或上一版归档；如果目标就是 live 目录，上传窗口内会有
HTML、chunk 与 RSC 混合版本的风险。因此**不要只填 secrets 就启用当前 SSH step**。

服务器负责人应先选择并演练以下一种方案：

1. 推荐：上传到版本化 release 目录，完整性检查通过后原子切换 `current` 软链接，并保留至少上一版；
2. 若宿主不支持软链接：先上传到不对外服务的 staging 目录，完成校验后用同文件系统原子 rename，
   或在维护窗口内以完整快照发布，并写出经过演练的恢复步骤。

只有发布目录、权限、磁盘空间、`--delete` 边界和回滚演练均通过后，才配置 GitHub Actions 的四个
部署 secrets：

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_TARGET_DIR`

同时应把 workflow guard 改为只有四个值都可用时才尝试发布，而不是当前只检查 `SSH_HOST`。
确认新链路成功上传和回滚后，停用经日志确认的冗余发布机制。若服务器侧机制必须保留，它也只能
在 commit 变化时运行，并应使用能跳过未变文件、保留合理 mtime 的同步方式；禁止每 5–10 秒
执行 `touch`、全量 `cp`、解压覆盖或无条件上传。

验收标准：连续 60 秒内，在没有新部署时，对同一 HTML 和 WebP 发 10 次 HEAD，请求的 ETag 与
Last-Modified 保持不变。

## 4. nginx 缓存边界

先在 staging 或独立 include 文件中验证，再执行 `nginx -t` 和 reload。不要直接粘贴覆盖完整
server block。当前文件名策略下建议：

```nginx
# Next 内容哈希静态资源：可以长期缓存。
location ^~ /_next/static/ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# 版本尚未内容哈希化的图片：先用可回收的短缓存。
location ~* \.(?:avif|webp|png|jpe?g|gif|svg|ico)$ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=86400, stale-while-revalidate=3600";
}

# Next 静态导航 payload 的稳定文件名会随发布改变，保持短缓存。
location ~* \.txt$ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=300, stale-while-revalidate=60";
}
```

这里故意不使用 `always`：缓存头只应落到成功响应，不能把非原子发布窗口中的临时 404 标成一年
immutable。上线后还要实测不存在或暂时缺失的 chunk、图片和 RSC，确认 404 没有长缓存；若父级
规则仍给错误响应加缓存，应显式改成 `no-store`。

HTML 应使用 `no-cache` 或很短的共享缓存，并允许验证；不要给 HTML 一年 immutable。现有站可能
依赖 `try_files $uri $uri/ $uri/index.html`，因此 HTML 规则应结合完整 `nginx -T` 放在正确的
location 中，不能让通用图片或 `.txt` 规则被错误覆盖。

nginx 的 `add_header` 有继承边界：子 `location` 声明自己的 `add_header` 后，父级已有的 HSTS、
CSP、X-Content-Type-Options 等安全头在部分版本/配置中可能不再自动继承。合并缓存规则时必须
同时核对这些安全头仍存在。

如果启用 CDN，先保证源站 ETag/mtime 稳定，再为正式域名接入。合理 TTL 可以屏蔽部分源站 TTFB
和验证器抖动，但 CDN 不能替代对重复写入根因与非原子发布的修复。

## 5. 发布后验收

每次发布必须同时验收构建、生产内容和缓存，不能只看 Actions 的绿色状态：

1. GitHub Actions 的 Build and deploy、CI 均成功；SSH deploy step 必须显示 executed/success，
   不能是 skipped。
2. 比对生产首页与目标 release `out/index.html` 的字节数和 SHA-256。
3. 验证 RSC payload 为 200。**注意文件名形态会随构建变化**：2026-08-25 的线上产物中，联系页
   实际文件是 `out/contact/__next.!KGVuKQ.contact.__PAGE__.txt`（`!KGVuKQ` 是路由组 `(en)`
   的编码），与本手册早期记录的 `__next.contact.__PAGE__.txt` 不同。验收前应先从当前 `out/`
   列出真实文件名，再核对浏览器实际请求的 URL 是否与之一致；两者不一致即为预取 404 回归。
4. 393px DPR1 冷会话应只首发 1 张 Hero，并选择 800w 候选；控制台不得出现 RSC 404。
5. 记录至少 5 次 HTML TTFB，并在同网络条件下比较中位数；同时记录 FCP、LCP、CLS 和总传输量。
6. 首次响应检查 `Cache-Control`；重复响应确认 ETag / Last-Modified 在无部署期间保持稳定。

阶段目标建议为：源站 HTML TTFB 中位数低于 800ms、移动冷加载 LCP 低于 2.5s。它们是本项目的
上线验收目标，不是对单次家庭网络样本的保证；正式结论应以真实用户 75 分位监控为准。

## 6. 回滚

- 当前仓库 workflow 未显式创建本节所需回滚点，服务器侧是否另有机制尚未确认；在版本化 release
  或完整快照被核实并演练前，不得把“可以切回上一版”写入生产操作承诺。
- 新方案必须保留上一版完整静态 release 目录或归档，不要只备份 HTML。
- 配置改动前保存 `nginx -T` 输出；`nginx -t` 失败时不得 reload。
- 新发布异常时，将站点软链接或目标目录切回上一版，再验证首页、图片与 RSC URL。
- 不要保留或重新引入每 5–10 秒全量覆盖的机制；发布故障应修复单一部署链路，而不是用重复写入
  掩盖。

## 7. 需要运维回传的证据

已于 2026-08-25 取得（见第 2 节）：发布任务名称与配置位置、本站 nginx server/location 片段、
发布目录拓扑。

仍需在 2.3 修复**之后**回传：

- 修改后的秒级任务脚本内容与新的执行间隔；
- 无部署 60 秒内的 10 次 ETag/Last-Modified 采样，用以证明验证器已稳定；
- 五次 HTML TTFB、一次移动冷会话 LCP 与完整请求瀑布（修复前后各一组，同网络同工具）；
- 回滚版本位置和一次恢复演练记录 —— 当前链路依赖 `git reset --hard origin/main`，
  回滚等同于回退 `main`，尚无独立的版本化 release 目录，这一点仍未解决。

拿到这些证据后，才能把“仓库端性能已修复”升级为“生产基础设施已完成验收”。
