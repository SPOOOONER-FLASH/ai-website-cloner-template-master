# 生产 5 秒全量重写循环：根因确认

- **Agent**：Claude
- **Commit**：与本 update 同一提交
- **目标**：查明 `HANDOFF.md` 与性能 runbook 中长期挂起的「未确认的发布/写入机制」，
  并定位生产站 ETag/Last-Modified 持续失效、TTFB 大幅抖动的根因。

## 修改范围

仅文档，未触碰任何源码、`out/` 或服务器：

- `docs/deployment/STATIC_SITE_PERFORMANCE_RUNBOOK.md`
  - §1 更正三条已过时表述：WebP 现已有 `Cache-Control`（§4 图片规则已上线）；
    验证器变化周期精确为 5 秒且 inode 同时改变；生产不由 Actions 发布。
  - §2 由「待办盘点清单」改写为「已确认根因」，含发布链路、循环机制、实测证据、修复脚本。
  - §3 补前提说明：发布目录已查明为 live 且无软链接/staging，两条链路不能同时开启。
  - §5 标注 RSC payload 文件名形态已变（路由组 `(en)` 编码为 `!KGVuKQ`），验收前需重新取真实文件名。
  - §7 移除已取得的证据项，保留修复后仍需回传的项。
- 本 update 文件。

## 已确认事实

生产由**服务器侧宝塔「秒级任务」`268542d1c5c1d14ec63a3ed5e75d63ff`** 发布，
每 5 秒执行 `git fetch` + `git reset --hard origin/main` + `chown -R www:www .`。
服务器持有完整仓库副本，nginx root 指向其 `out/`。origin 走 HTTPS，与 SSH 密钥无关。

循环机制：`chown -R` 改变全部文件 uid/gid → git 索引记录 uid/gid，判定 3,833 个文件全部
stat-dirty → 下一轮 `git reset --hard` 重新 checkout 全部文件 → 新 inode/新 mtime →
ETag 与 Last-Modified 全变 → `chown` 再执行，循环自持。

## 验证

- SSH 只读采样 `out/index.html`：size 恒为 85,789 B，mtime 每 5 秒前进，inode 每次改变
  （160044218 → 159967284 → 159967294 → 159499288），证明是删除重建而非 `touch`。
- 直接读取 `/www/server/cron/268542d1c5c1d14ec63a3ed5e75d63ff` 取得脚本原文。
- `git remote -v` 确认 origin 为 HTTPS；服务器 HEAD、`origin/main`、本地 `main` 三者一致（`aa4640f30`）。
- `curl -sSI` 实测：WebP 返回 `public, max-age=86400, stale-while-revalidate=3600`（但有重复头）；
  HTML 仍无 `Cache-Control`。

## 明确未修改

- 未改动服务器任何配置、脚本或计划任务；循环在本 update 写成时仍在运行。
- 未改动源码、`out/`、nginx 配置。
- 未提交/推送他人工作；核查时工作区干净、`main` 与 `origin/main` 同步。

## 已知风险 / 外部阻塞

- 该秒级任务是当前**唯一**上线通道，修改需站点负责人确认，建议在宝塔面板界面操作以留存回滚历史。
- 回滚能力仍缺失：当前等同于回退 `main`，没有独立的版本化 release 目录。
- 仓库根目录有 20 项未跟踪的陈旧站点副本（早期部署残留）。未对外提供，但需单独确认后清理。
- 若将来启用 Actions 的 SSH deploy step，会与秒级任务互相覆盖，两者不可并存。

## 甲方决策（2026-08-25）

- 采纳方案 A：为现有计划任务加护栏 + 短轮询（30 秒或 1 分钟）。**由甲方在宝塔面板执行，
  Agent 不代改服务器。**
- 方案 B（GitHub webhook）记入 runbook §2.3.1，标记为未实施的后续可选项。
  两位 Agent 不要擅自实施：它需要把面板端口 8889 开放公网，且宝塔 WebHook 不校验 GitHub 签名。
  相对方案 A 只多赚约 28 秒，建议与正式域名切换、面板 SSL 一并考虑。
- 已确认与本次密钥事故无关的事实：CMS 走 GitHub OAuth（Cloudflare Worker 中转），
  服务器 `git remote` 走 HTTPS，两者都不使用 SSH 密钥；被覆盖的是服务器出站身份，
  `authorized_keys` 未受影响。

## 修复状态（2026-08-26 更正）

> ⚠️ 本节初版写“循环已停止、缓存前置条件具备”，**该结论错误，已更正**。
> 错误原因是采样窗口（45 秒）短于实际调度周期，恰好落在两次执行之间。
> 教训：验证周期性行为时，采样窗口必须长于调度周期。

实际状态：宝塔任务周期由 5 秒改为 **10 分钟**，但**护栏脚本尚未填入**，
`git reset --hard` 与 `chown -R` 仍无条件执行。2026-08-26 17:44 实测：
`out/index.html`、`contact/index.html`、`company/index.html`、`AGENTS.md`
的 mtime 全部为 17:40:02，与任务日志中 `★[17:40:03]` 同秒 ——
每 10 分钟仍在重写全部 3,833 个文件。

重写频率降低约 120 倍是真实改善，但根因未消除，且上线延迟从 5 秒变成 10 分钟。
待办：把 runbook §2.3 的护栏脚本填入宝塔任务的「脚本内容」框，随后周期调回 30 秒或 1 分钟。
完整基线与验收方法见 runbook §7。

### ⚠️ 给 Codex 的重要更正：图片方向已无剩余收益

Chrome DevTools MCP 真实浏览器 trace（393px 移动，无节流）显示：

- LCP 4,629 ms，其中 **TTFB 占 4,551 ms（98.3%）**；
- 图片相关合计仅约 11 ms（加载延迟 10 ms + 下载 1 ms）；
- LCP 元素已正确选中 800w 响应式候选，下载 0.2 ms；CLS 0.00。

此前握手文件 §9.5 中「移动首批六张位图可省约 85%」「完整首页可省约 84%」属修复前的估算，
现已被实测取代。**继续压缩图片或扩大响应式候选不会产生任何可测收益**，请不要再据此排期。
服务器自请求 TTFB 仅 0.6 ms，剩余瓶颈全部在网络路径。

### 下一步的正确方向不是继续优化

所有测量均来自国内视角，而目标客户是海外经销商。购买 CDN 或继续优化前端之前，
必须先取得目标市场实测（WebPageTest 指定海外节点，或请海外联系人访问）。
若海外访问本就正常，则无需处理。

## 建议另一方下一步协助或复核

1. 独立复核 §2.2 的循环机制推断（`chown` → git 索引 uid/gid → 全量 checkout），
   这是本次结论的核心因果链。
2. 修复上线后，用同一工具同网络条件复测修复前后的 TTFB / LCP / 总传输量，
   建立可比基线 —— 此前的性能估算都受这个循环污染，不能直接作为收益依据。
3. 收敛 WebP 的重复 `Cache-Control` 头，并决定 HTML 的缓存策略。
4. 复核 §5 的 RSC 验收 URL 是否需要随路由组编码同步更新。
