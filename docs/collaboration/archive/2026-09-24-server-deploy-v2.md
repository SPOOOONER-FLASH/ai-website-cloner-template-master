# 存档：服务器停止更新 → 第二版部署脚本（2026-09-23）

> **这是记录，不要照着做。** 2026-09-24 实测已完成：线上 /news/master-key-systems-how-many-levels-you-need/ 与 /products/door-closers/
> 的标题是 09-24 当天发布的新版本，说明服务器已恢复每五分钟自动拉取。

### ② 服务器停止更新了 —— 手动拉一次，再装第二版部署脚本（2026-09-23 下午）

**现状（我绕开 Cloudflare 直连源站实测）**：线上还是 06:04 那一版，之后推送的所有改动
（去 AI 痕迹、新闻正文排版、官网去中文）都没上线。

**原因，你贴的日志说得很清楚**：

| 日志里的那行 | 意思 |
|---|---|
| `fatal: shallow file has changed since we read it`（每一轮） | 拉取代码用的是「浅拉取」，每次都要改写 `.git/shallow`，这一步在这台服务器上必然失败。没有进程在抢，是它自己坏的 |
| `chown: .user.ini: Operation not permitted` | 宝塔把 `.user.ini` 锁住了，改属主必然失败；旧脚本一遇错就退出，所以日志里从来看不到「更新成功」 |

第二版脚本两个都修了：拉取不再用浅拉取，改属主跳过 `.user.ini`，每行日志带时间。
我在本机用浅克隆模拟过三轮（无更新 / 有更新 / 有残留锁），三轮都成功。

**但新脚本现在到不了服务器** —— 因为服务器正是卡在「拉不下代码」这一步。所以要你
手动拉一次，再装。**在宝塔终端贴这一整行**：

```bash
cd /www/wwwroot/cantonlock.com && flock /tmp/cantonlock-deploy.lock git fetch origin main && flock /tmp/cantonlock-deploy.lock git reset --hard origin/main && sudo bash deploy/install-deploy-script.sh
```

**它做四件事**：等定时任务那一轮结束 → 拉最新代码（不带浅拉取）→ 切到最新版本 →
装第二版部署脚本。前两步没有输出是正常的，可能要一两分钟。

**成功的样子**：最后一串 `→` 开头的行，末尾是
`✓ 完成。新部署脚本已装好，下一轮 cron（5 分钟内）起生效。`

**看到这两种情况就停下，截图发我，不要重跑**：
- 出现 `fatal: shallow file has changed since we read it` —— 说明不带浅拉取也不行，我换另一种办法
- 出现 `✗ FAIL`

**十分钟后贴这一条确认**（只读）：

```bash
tail -5 /var/log/cantonlock-deploy.log
```

**这次应该看到带时间的行**，例如 `2026-09-23 22:40:03 updated to 0791cfe`。
没有新提交的轮次什么都不写，这是正常的。看到 `fetch failed` 就截图发我。

装好之后，线上会一次性追上今天所有的改动。**然后记得 purge。**

