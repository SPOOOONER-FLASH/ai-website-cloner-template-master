# 文章与指南的搜索词重叠

生成：`node scripts/audit-guide-keywords.mjs --write`（不要手改本文件）。
口径：82 篇（guides + news），比较 seoTitle（没有则 title）的实词，去掉年份、品牌和 door/hardware；重叠 = 共同词 ÷ 较短标题的词数，≥ 0.5 列出。

| 重叠 | 共同词 | 页面 A | 页面 B |
|---|---|---|---|
| 0.71 | stainles 201 304 316 grade | /guides/stainless-grade-selection-201-304-316-2026/<br>Stainless 201 vs 304 vs 316 (2026): Grade Selection and Cost | Canton Hyland | /news/stainless-steel-grades-304-201-316/<br>Which Stainless Grade Were You Quoted? 304, 201 or 316 |
| 0.67 | backset chart | /guides/backset-door-thickness-chart-2026/<br>Backset and Door Thickness Chart 2026 | Canton Hyland | /guides/mortise-lock-case-comparison-2026/<br>Mortise Lock Cases Compared: Backset & Center Distance Chart | Canton Hyland |
| 0.67 | en 1125 ansi standard | /news/en-1125-or-ansi-which-standard-your-project-needs/<br>EN 1125 or ANSI: Which Standard Your Project Needs | /news/ul-305-is-a-listing-not-a-grade/<br>UL 305 vs EN 1125 vs ANSI A156.3: Panic Hardware Standards |
| 0.60 | en ansi bhma | /guides/cycle-testing-durability-grades-2026/<br>Cycle Testing and Durability Grades 2026: EN 1906 vs ANSI/BHMA | Canton Hyland | /guides/en-ansi-bhma-cross-reference-2026/<br>EN to ANSI/BHMA Cross-Reference 2026 | Canton Hyland |
| 0.60 | cylindrical lock function | /guides/cylindrical-and-tubular-lock-comparison-2026/<br>Cylindrical vs Tubular Locks: Backset, Door and Function | Canton Hyland | /news/choosing-a-cylindrical-lock-entrance-privacy-passage/<br>Entrance, Privacy or Passage: Cylindrical Lock Functions |
| 0.57 | euro cylinder length split | /guides/euro-cylinder-size-chart-2026/<br>Euro Cylinder Size Chart 2026: Lengths, Splits & Measuring | Canton Hyland | /news/euro-cylinder-length-and-split/<br>Euro Cylinder Length vs Split: What 30/40 Means |
| 0.57 | exit device bar length | /guides/exit-device-comparison-2026/<br>Exit Device and Panic Bar Comparison: Lengths and Latching | Canton Hyland | /news/exit-device-push-bar-length/<br>Exit Device Bar Length: 650mm to 1110mm Explained |
| 0.57 | exit device panic bar | /guides/exit-device-comparison-2026/<br>Exit Device and Panic Bar Comparison: Lengths and Latching | Canton Hyland | /news/push-bar-or-touch-bar-panic-exit-devices/<br>Push Bar vs Touch Bar Panic Exit Device, Which to Specify |
| 0.57 | fire exit panic bar | /news/double-fire-exit-door-hardware-set/<br>Double Fire Exit Door with Panic Bars: Complete Hardware Set | /news/trim-handle-or-panic-bar/<br>Trim Handle or Panic Bar: What a Fire Exit Door Needs | Canton Hyland |
| 0.50 | en 1125 exit | /guides/en-1125-vs-en-179-2026/<br>EN 1125 vs EN 179 (2026): Panic or Emergency Exit Hardware | Canton Hyland | /news/ansi-grade-1-vs-en-1125-exit-devices/<br>ANSI Grade 1 vs EN 1125 Exit Devices: Grades Compared |
| 0.50 | en 1125 panic | /guides/en-1125-vs-en-179-2026/<br>EN 1125 vs EN 179 (2026): Panic or Emergency Exit Hardware | Canton Hyland | /news/ul-305-is-a-listing-not-a-grade/<br>UL 305 vs EN 1125 vs ANSI A156.3: Panic Hardware Standards |
| 0.50 | cros reference | /guides/en-ansi-bhma-cross-reference-2026/<br>EN to ANSI/BHMA Cross-Reference 2026 | Canton Hyland | /news/cross-referencing-a-lock-you-already-buy/<br>How to Cross-Reference a Door Lock to an Equivalent | Canton Hyland |
| 0.50 | euro cylinder | /guides/euro-cylinder-size-chart-2026/<br>Euro Cylinder Size Chart 2026: Lengths, Splits & Measuring | Canton Hyland | /news/fitting-a-euro-cylinder/<br>How to Fit a Euro Cylinder, Step by Step |
| 0.50 | master key level | /guides/master-key-hierarchy-planning-2026/<br>Master Key Hierarchy Planning 2026: Levels and Capacity | Canton Hyland | /news/master-key-systems-how-many-levels-you-need/<br>Master Key System Chart: How Many Levels You Need | Canton Hyland |
| 0.50 | ansi en 1125 | /news/ansi-grade-1-vs-en-1125-exit-devices/<br>ANSI Grade 1 vs EN 1125 Exit Devices: Grades Compared | /news/en-1125-or-ansi-which-standard-your-project-needs/<br>EN 1125 or ANSI: Which Standard Your Project Needs |
| 0.50 | double fire | /news/door-coordinator-double-fire-door/<br>Door Coordinator for Double Fire Doors, Sizing Guide | /news/double-fire-exit-door-hardware-set/<br>Double Fire Exit Door with Panic Bars: Complete Hardware Set |
| 0.50 | euro cylinder | /news/euro-cylinder-length-and-split/<br>Euro Cylinder Length vs Split: What 30/40 Means | /news/fitting-a-euro-cylinder/<br>How to Fit a Euro Cylinder, Step by Step |
| 0.50 | euro cylinder | /news/euro-cylinder-range-45-to-90/<br>Euro Cylinder Range 45–90mm: Lengths, Brass and Code Letters | /news/fitting-a-euro-cylinder/<br>How to Fit a Euro Cylinder, Step by Step |
