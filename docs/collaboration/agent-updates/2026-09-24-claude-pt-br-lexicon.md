# 2026-09-24 · Claude（HYDE 文案）· 葡语文章里的葡萄牙用词改成巴西用词

复核 `fire-door-hardware-what-must-be-rated-2026` 时发现，2026 系列指南的葡语大量用的是葡萄牙葡语，区域用词守卫查不出来。用 `tmp/claude-copy-work/pt-br-lexicon.mjs` 统一改了一遍：只动葡语字段，每条规则写明预期命中数，对不上就报错。共 25 个文件，59 处：

- 词汇：vedante 改 vedação（性别跟着改），fumo 改 fumaça，aspeto 改 aspecto，estanquidade 改 estanqueidade，grelha 改 grade，toda a gente 改 todo mundo，incumprimento 改 descumprimento，planeada 改 planejada，registado/a 改 registrado/a，morada 改 endereço，pavilhão 改 galpão，apanhar 按上下文改成 pegar de surpresa、detectar 或 identificar，saltar（跳过）改 pular，nós próprios 改 nós mesmos，ao pé do marco 改 à base do marco。
- 句法：“tira-a”三连改成“também tira”，“dizemo-lo”改成“dizemos isso”。
- 保留：句首和句中的标准后置代词（mede-se、chama-se、comporta-se），巴西的正式书面语也这么写。
- 没动：trinco/lingueta，待 0c 定。
- 测试：`npm test` 通过。
