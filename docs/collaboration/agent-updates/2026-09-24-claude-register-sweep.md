# 2026-09-24 · Claude（HYDE 文案）· 西语、葡语用词排查（第 2、3 批文章复核的一部分）

区域用词守卫（`normalize-regional-terms`）只管登记过的词，这次另写了两个扫描脚本（`tmp/claude-copy-work/esscan.mjs`、`ptscan.mjs`），扫全部文章里守卫没覆盖的写法：

- 葡语：葡萄牙式的“a + 不定式”进行时和代词位置改成巴西写法，“o produto a fazer o que faz”改为“fazendo”，“vai ter de a fazer”改为“ter que fazê-la”，“alguém a montar”“alguém a girar”也改了。“voltar a fazer”“tem a ver”这类巴西也用的写法保留。
- 西语：“un móvil”改为“un celular”，“pilla”改为“detecta”，“la web / esta web”改为“el sitio / este sitio web”。
- `en-1125-vs-en-179-2026`：西语、葡语有一段以没翻译的 “Dogging” 开头，补上译名：retención en abierto / travamento aberto。
- 逐段通读过的只有 `en-1125-vs-en-179-2026` 的西语，没有发现事实错误。第 2、3 批其余四篇（fire-door-hardware-what-must-be-rated、trim-handle-or-panic-bar、master-key-systems、mortise-lock-backset）只做了上面的扫描，**还没有逐段通读**，已留在任务文件第 8 项。锁体对比指南原来没有西语和葡语，已补齐，见另一份更新。
- 测试：`npm test` 通过。
