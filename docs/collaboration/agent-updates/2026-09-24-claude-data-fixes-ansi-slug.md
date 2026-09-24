# 2026-09-24 · Claude（HYDE工程）· 产品数据修正：14 条误归子类；去掉网址里的「ANSI Grade 3」

来源：Hyde 视觉会话（E:/cantonlock-hyde）写葡语摘要时发现。

- **14 条误归「指示器」**：DV04（猫眼）、FB001 / FB005 AC / FB017（插销）、L002–L026 十条（门闩）按记录自己的名字
  移到 door-viewers / door-flush-bolts / latches 子类。子类只是筛选维度，网址不变，不需要 301。
  这些记录的 doorTypes「厕所隔间门」是从错的子类推出来的，清空（未知就不写）。
  标题重生成后 FB005 AC 不再写「occupied or vacant」（那是指示器的卖点）。
- **ansi-grade-3-keyed-deadbolt-lock-set → keyed-deadbolt-lock-set**：我们没有 ANSI 认证，网址不能写。只改网址；
  图片文件名不动（雷茵车道 `products-rayen` 也引用它）。旧网址在 grip-handle-sets 和 deadbolts 两处都加了 301
  （taxonomy-moves.json 的 productMerges），nginx 规则已重生成。
  ⚠ `taxonomy-redirect-locales.test.ts`「重定向不落到 404」在下一次 HYDE 发布把新页面建进 out/ 之前会失败 —— 发布紧接着就跑。
- `normalize-us-spelling.mjs --check` 不再检查 zh-terms.json（雷茵日常会加图册拼写的键，HYDE 的检查不应拦他们）。
- 生成文件（products.ts 等 barrel、search-index.json）随之重生成。

待甲方：nginx 跳转规则要装一次（CLIENT-RUNBOOK 常规动作「有新的跳转规则」）；雷茵站的旧网址是否也要 301，交雷茵会话决定。
未做：DC01 名称（spec 行说是双门顺序器，名字是 Panic Exit Device —— 要工厂确认）；HY006 规格乱码与 Trincos 单复数已转给西语规格表会话。
