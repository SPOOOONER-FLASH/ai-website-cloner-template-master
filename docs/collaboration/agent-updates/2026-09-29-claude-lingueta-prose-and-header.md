# Claude · 2026-09-29 · 散文里的 lingueta 逐句理完；侧边栏首次点击卡顿

## 一、散文 lingueta：176 处，逐句判过

上一轮只自动改了规格表和术语表，散文留了下来，因为抽样发现**它们是混着的**。
这一轮把剩下的全部处理完，规则始终是**看它翻译的那句英文**，不是看词本身。

| 桶 | 数量 | 处理 |
|---|---|---|
| 英文只说 latch | 79 个字段 | `lingueta` → `trinco`（带冠词与性数一致） |
| 英文同时说 latch 与 deadbolt | 5 条 | **原本就是对的**（lingueta 当方舌用）。仍改成 `trava`，只为一物一词 |
| 英文两者都没说 | 20 条 | 逐条看规格行判定，见下 |
| 文章、目录、`src/data` 散文 | 34 处 | 逐句判，写在 scratchpad 的替换表里 |

第三桶是最值得记的，因为它们各不相同：

- `Latch = Copper` → `lingueta de cobre` 其实是**斜舌** → `trinco de cobre`（11 条）
- `Latch = Square latch` → `lingueta quadrada` → `trinco quadrado`（3 条）
- `hook bolt` → `lingueta tipo gancho` → **`ferrolho tipo gancho`**（钩舌不是斜舌）
- LC07 `Latch throw 26mm` / `Bolt projection 18.5mm` → 原文把两者写反，改为
  `trinco com curso de 26 mm e ferrolho com saída de 18,5 mm`
- **LC20**：葡语写着「com lingueta」，**而英文根本没提任何舌**。这是葡语自己加的一个
  英文不支持的说法，已删掉那半句而不是翻译它。
- `rim-night-latch-564-and-1073`：`avanço de lingueta de 25 mm` 指的是**方舌**
  （记录自己的规格行写着 Deadbolt throw = 25mm）→ `avanço de trava`
- `strike-plates`：「o lábio é a lingueta curvada」——英文是 "the curved tongue"，
  指一片金属舌片，不是锁舌 → `a aba curvada`

## 二、测试漏掉了五行，原因和九月那次一模一样

改完之后 `pt-glossary.ts` 里仍然有 `Latch: "Lingueta"` 和 `Deadbolt: "Trinco"`——
**单词键在 TypeScript 里不加引号**，而我的表替换和我自己刚写的测试都只匹配
`"English": "Portuguese"`，五行全部被跳过，测试还报了绿。

**这是同一个陷阱第二次出现**：本次工作早些时候，术语表审计因为同样的原因报了
86 个缺失键而不是 12 个。

`pairs()` 已改成逐行解析，两种写法都收。并且**我故意把一行改坏验证过它会失败**，
再改回来——一个没被证明会失败的守卫不算守卫。

## 三、侧边栏首次点击卡顿（甲方 2026-09-29）

`SiteMenuDrawer` 和 `SearchDialog` 是 `dynamic(..., { ssr: false })`，注释里原本
写着「the chunk arrives on first open」。拆包本身是对的——header 在 root layout 里，
静态引入会让每一篇文章页都水合整个搜索匹配库。但代价落在了**最糟的时刻**：汉堡按钮
按下去，要等网络回来才有反应。手机 4G 上这就是全部的延迟，而且每次访问只发生一次，
正好是买家在判断这个站做得好不好的那一刻。

改成**提前预热**：`requestIdleCallback` 在页面安定后取 chunk（Safari 退回 timeout），
按钮再加 `onPointerEnter` / `onTouchStart` / `onFocus`。`onTouchStart` 是手机上真正
起作用的那个——手指按下先于 click 触发，那点提前量通常就够了。

包体不变（仍在初始包之外），首屏与水合不变，只是点下去时模块已经解析好。
`import()` 自带缓存，所以三个入口解析到同一次请求；预取失败被吞掉，真正的点击会重试。

## 四、发布那次失败了，而且它报了假绿

`npm run release:hyde` 后台跑完，外层 shell 回了 **exit 0**，任务通知也写着
exit code 0。**真实情况是 `deploy:prep` 退出 1，发布中止。** 这正是 AGENTS.md 里
记的那三次假绿的同一种：包装器报的退出码不是它包的那条命令的。读日志才看到。

失败原因：19 条西语标题过不了 `titles:check` 的「标题缺品类名」。品类名白名单里
西语没有 **muelle** 这个词——HYDE 以前没有地弹簧，所以从来不需要。已加入白名单，
`build-product-titles.mjs --write` 重新生成了 28 个产品的标题描述。

## 测试

`npm test` 446/447（唯一失败项是 `every category that does have products is built`，
它比对 `out/`，只能由发布产生）；lint 0 errors；typecheck clean；`titles:check` 通过。

---

## 追加：exit 75 不等于没推上去

第三次 `release:hyde` 三次推送都打印「超时 推送失败（网络）」，退出 75。**而发布提交
那时已经在 `origin/main` 上了。** 其中一次推送在服务端成功了，只是客户端没收到回执。

我的重试推送的报错反而是证据：

```
! [remote rejected] HEAD -> main (cannot lock ref 'refs/heads/main':
  is at 8de4215bb6b but expected a4207a6949c)
```

git 在说：你要推的那个提交已经是分支顶端了。`git ls-remote` 直接问远端，也确认
`refs/heads/main` = `8de4215bb6b`。

推送是一次网络写入，超时说的是**回执没回来**，不是写入没发生。只有远端能判定，而
`git rev-list origin/main..HEAD` 读的是本地 ref，只和上一次 fetch 一样新——就是
AGENTS.md 里记的那个「168 个提交落后却报 0」的假绿。

已写进 AGENTS.md 的 ship 一节。**这条的代价不是洁癖**：以为没推上去就会想 `--force`
或者重跑构建，而 `out/` 落在服务器每五分钟部署的那个分支上。

今天这条线上一共五次信号失真，四次报成功实则失败，一次报失败实则成功。
