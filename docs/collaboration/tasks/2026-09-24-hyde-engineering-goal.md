# HYDE 工程会话目标清单（2026-09-24 起）

> 甲方 09-24：「设定目标 hook 持续工作直到所有项目和修改优化项目完成」。
> 本会话（HYDE工程交接配置）的 Stop hook 读这张表：最后一列是「待做」的行没清完就继续干。
> 需要甲方或别的会话先动的行写「待甲方」「等待」，不算待做。做完一行改成「09-24 完成」并提交。

| # | 事项 | 状态 |
|---|---|---|
| 1 | HYDE 发布本轮积压（picaporte、计数、9 条新尺寸标题、zh-terms），上线后实测 | 09-24 完成（996a209b6df 上线，L001 Pestillo、LC05 85/60 标题实测） |
| 2 | 比较页（/compare/*）标题带长尾词：夜锁比较页 70 次展示、排名 9.7、0 点击 | 09-24 完成（「25 Night Latches & Rim Locks Compared Side by Side」，西葡「Comparativa/Comparativo de N …」） |
| 3 | GSC 机会清单里的其余页面：/contact/（98 展示）、背距与中心距文章（31 展示）的搜索标题和描述 | 09-24 完成（联系页三语标题带「工厂在中国」；背距文章标题带 85mm vs 72mm） |
| 4 | 219 张无 alt 的图片（指南、新闻列表页的封面图） | 09-24 完成（指南缩略图用产品图 label 作 alt；新闻卡片的装饰 logo 本来就对，审计不再误报 aria-hidden 图） |
| 5 | 术语表页 12 处「Read more / Leer más」空锚文本改成有内容的链接文字 | 09-24 完成（「More on backset」「Más sobre …」「Mais sobre …」） |
| 6 | 标题生成器加 `--only <models>`，只重写指定型号 | 09-24 完成（--write --only LC04,140） |
| 7 | 标题生成器去掉「Door Hinge for Doors」这类场景和名字重复 | 09-24 完成（短场景不再截成光秃的 Doors；7 条标题更正） |
| 8 | 复查 306-D / 306-S 西葡重复标题是否已消除（seo:graph） | 09-24 完成（最新构建 seo:graph：无重复标题、无孤立页、全部从首页可达） |
| 9 | 多语种准备：RTL 扫描脚本，数出全站物理方向类名（阿拉伯语工程量） | 09-24 完成（89 处、21 个文件，docs/research/RTL-READINESS.md，可重跑） |
| 10 | 查询语料脚本加国家筛选，单列德国、法国、沙特、阿联酋、土耳其的查询 | 09-24 完成（GSC 查询表不带国家列，改为导出时按国家筛选；步骤写进 DATA-DASHBOARDS.md，脚本 --out 分文件） |
| 11 | 发给 Hyde 文案：finishes / glossary / model-lookup / documents 的 H1 不含搜索词，给出建议写法 | 09-24 完成（建议已发 Hyde 文案，由其改页面文字） |
| 12 | 同句出现 pestillo/cerrojo（葡语 trinco/lingueta）就报错的规则 + picaporte → pestillo | 09-24 完成（规则启用，13 处自动转换，0 冲突；葡语见 #24） |
| 13 | 10 个产品名字太长放不下长尾词 | 等待（改名归文案/规格会话） |
| 14 | 服务器装跳转规则（ANSI 网址 301） | 待甲方（手册 ③） |
| 15 | GA4 登记自定义维度 | 待甲方（手册 ②） |
| 16 | 隐私政策页内容 | 待甲方 |
| 17 | 路由收敛为 `[locale]`、构建产物不进 git | 待甲方 |
| 19 | /services 元数据改为 OEM / 私人品牌领头（Hyde 文案 09-24 请求） | 09-24 完成（标题「OEM & Private-Label Door Hardware Manufacturer in China」） |
| 20 | 西葡 services 路由（/es/services、/pt/services：hreflang、前缀、locale-route-parity），建好通知 Hyde 文案写西葡文案 | 09-24 完成（/es/services、/pt/services 上线待发布；镜像、菜单、测试已改；西葡标题 OEM / marca propia 领头） |
| 21 | 8827、8828 是空壳重复页（无规格，主图与 8827 SSET / 8828 SSET 相同）：301 到 SSET 款 | 09-24 完成（并入 SSET，两张装门图随迁，productMerges 301；计数句交文案会话） |
| 22 | HY006 应用字段写着「KFC 锁体」，他人商标，删掉 | 09-24 完成（三语去商标名，保留用途） |
| 23 | 559 画集 5 张带 STAHLOCK 水印的图（已撤下）是否可用 | 待甲方 |
| 24 | 葡语 trinco / lingueta 用法相反：术语表 Deadbolt=Trinco、Latch=Lingueta，文章里 trinco 指斜舌。要一个像 D1 的决定 | 待甲方 |
| 25 | HYDE 发布本轮（services 三语、8827/8828 合并、picaporte、alt、锚文本、比较页标题），上线后实测 | 待做 |
| 18 | 10-08 前后复查改过标题的页面点击率 | 等待（日期未到） |
