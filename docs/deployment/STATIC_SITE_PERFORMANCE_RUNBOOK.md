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
2. HTML、WebP 与 RSC 没有明确的 `Cache-Control`；
3. 文件内容与 SHA-256 不变时，ETag / Last-Modified 仍约每 5–10 秒改变；
4. GitHub Actions 的 SSH deploy step 因该 run 未获得 `SSH_HOST` 而跳过；生产随后由非该 step
   的机制更新，具体发布任务或写入者尚待确认。

不要通过全站 SSR、数据库查询或再次牺牲图片清晰度来掩盖以上基础设施问题。

## 2. 变更前保全与归属确认

先记录当前发布目录、nginx 配置、同步进程和回滚点；不要对未知目录直接执行删除或 `rsync --delete`。

建议由服务器管理员完成以下只读盘点：

```bash
sudo nginx -T
systemctl list-timers --all
systemctl list-units --type=service --state=running
crontab -l
sudo find /etc/cron.d /etc/cron.hourly /etc/systemd/system -maxdepth 2 -type f -print
```

同时从托管面板检查“Git 自动部署、文件同步、计划任务、守护脚本”。目标是找出哪个进程在没有新
commit 时仍反复复制或更新时间戳。证据应至少包含：进程/任务名、触发频率、源目录、目标目录、
最后运行日志和负责人。

`crontab -l` 只覆盖当前用户；管理员还应按授权范围检查负责发布的系统用户和面板任务。
`sudo nginx -T` 可能包含域名、证书路径和上游地址，回传前必须脱敏，不能公开私钥或凭据。

## 3. 先建立可回滚的原子发布，再收敛链路

当前仓库 workflow 会把 `out/` 以 `rsync --delete` 写入 secret 指定的 `SSH_TARGET_DIR`，但该值
及服务器发布拓扑不可见，不能确认它是 live、staging、软链接目标还是会被面板二次处理。workflow
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
3. 验证以下 URL 为 200：
   - `/contact/__next.contact.__PAGE__.txt`
   - `/products/lock-cases/__next.products.$d$category.__PAGE__.txt`
   - 一个实际产品详情的点号式 `__PAGE__.txt`
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

完成后向开发侧提供：

- 负责发布的唯一任务/工作流名称与配置位置；
- Actions SSH deploy step 的成功 run 链接；
- `nginx -T` 中与本站有关的脱敏 server/location 片段；
- 无部署 60 秒内的 10 次 ETag/Last-Modified 采样；
- 五次 HTML TTFB、一次移动冷会话 LCP 与完整请求瀑布；
- 回滚版本位置和一次恢复演练记录。

拿到这些证据后，才能把“仓库端性能已修复”升级为“生产基础设施已完成验收”。
