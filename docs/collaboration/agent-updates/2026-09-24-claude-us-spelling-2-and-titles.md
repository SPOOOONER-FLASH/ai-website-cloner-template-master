# 2026-09-24 · Claude（HYDE工程）· 美式拼写第二批（产品记录 + 界面）；标题生成器三处修正

甲方 09-24：「产品记录和界面也改美式拼写」。

## 拼写
- `scripts/normalize-us-spelling.mjs` 扩到全站：content/products（HYDE 记录）、projects、品类/下载/FAQ/导航/弹窗/站点设置，
  src/data/category-positioning.json（生成器读它）；代码用 TypeScript 解析器只改**字符串字面量和 JSX 文字**，
  正则字面量改成两种拼写都匹配（`/(?:center|centre)/`），外部来源匹配（买家搜 catalogue）照样命中。
- **规格标签和术语表的键在同一次提交里改**（西语规格表会话 09-24 提醒：分开落地会让西葡 45/46 行规格静默退回英文）。
- `content/i18n/zh-terms.json`：美式键**新增**、英式键保留（雷茵会话要求）；`npm run rayen:mirror` 验证：值仍含英文 416 条（基线 417）。
  **`src/data/generated/products-zh.json` 未提交**，属雷茵车道，请雷茵会话自行重生成提交。
- 不改：雷茵专属记录（`sites` 不含 hyde）、雷茵车道文件、型号本身（「5831-90mm grey」是客户 SKU）、单个小写词的枚举值
  （`?mode=catalogue` 在访客的网址里）、竞品/供应商抓取脚本（stahlock-*、scrape-*）。
- 守卫：`--check` 覆盖以上全部，`scripts/us-spelling.test.mjs` 在 npm test 里。

## 标题生成器（09-24 从 E 盘会话移交本会话）
- **安全**：306 PS 是通道推杠，没有自己的锁舌。西葡描述原写「用于逃生与出口门」。给记录加 `positioning` 覆盖：
  「for doors latched by a mortise lock / para puertas con cerradura de embutir / para portas com fechadura de embutir」。
- **同句两个 para**：名字里已有 for/para 时连接词改 on/en/em，门厚短语改「espesor de puerta」；HYDE 记录里同句双 para 59 → 0。
- 7.4 检查：「命名过长」的判断从固定 40 字符改为「型号 + 名字 + 真实场景确实放不进 60 字符」，306 PS 西葡列为警告而非拦发布。
- 生成器改用 Center distance 标签后，此前因标签已是美式而漏掉中心距的锁体，西葡描述现在带上了中心距。

## 数字
- `content/guides/dimensional-interchangeability-2026.json`：中心距 28 → 29（计数守卫；新匹配两种拼写）。
- `docs/research/SPEC_COVERAGE.json` 重生成。

检查：tsc 0；npm test 374/374；titles:check、specs:coverage:check、normalize --check 全过。生效需 HYDE 发布（发布棒现在在 Hyde 视觉会话）。
待办：生成器加 `--only <models>`（西语规格表会话建议）；Hyde 视觉会话报的四个数据问题（14 条误归「指示器」子类、DC01 名称、HY006 乱码、Trincos 复数）。
