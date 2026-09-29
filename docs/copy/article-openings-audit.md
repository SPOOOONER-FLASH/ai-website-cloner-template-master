# 文章开头是否先给具体答案

生成：`node scripts/audit-article-openings.mjs --write`（不要手改）。
口径：82 篇 HYDE guides + news（英文）；看摘要和正文前两段（跳过小标题）里有没有数字、尺寸、标准号或型号。

前两段没有任何具体锚点：**46 篇**；其中摘要也没有：25 篇。

| 页面 | 摘要有锚点 | 第一段开头 |
|---|---|---|
| /guides/brass-alloys-and-dezincification-2026/ | 有 | "Solid brass" is one of the most reassuring phrases in a hardware catalog and one of the least specific. Brass… |
| /guides/certification-and-test-validation-2026/ | 无 | Almost nobody checks a certificate. It arrives as a PDF with a logo, it satisfies the line on the submittal, a… |
| /guides/chrome-finish-differences-2026/ | 有 | Put a satin chrome lever next to a satin nickel one under a showroom light and most people cannot name which i… |
| /guides/commercial-lock-function-decision-2026/ | 无 | Most lock function errors are not made by people choosing badly between options. They are made by people who n… |
| /guides/copper-or-brass-hinges-2026/ | 无 | Buyers in many countries ask for copper hinges. What they want, almost without exception, is a brass hinge, an… |
| /guides/corrosion-resistance-en-1670-2026/ | 有 | Corrosion is the only hardware failure that happens on a schedule. A lock either works or it does not; a finis… |
| /guides/custom-door-hardware-tooling-2026/ | 有 | Plenty of buyers have a part in mind that nobody sells: a lever that has to match an existing building, a lock… |
| /guides/dimensional-interchangeability-2026/ | 有 | A buyer asks whether a lock is interchangeable with one they already buy. The answer is never yes or no; it is… |
| /guides/door-closer-mounting-positions-2026/ | 无 | A door closer is specified by power size, and then it is mounted, and the mounting can undo a correct specific… |
| /guides/door-closer-power-size-2026/ | 有 | A door closer is chosen by power size, and the single most common specification error is choosing it by room. … |
| /guides/door-hardware-hs-codes-2026/ | 有 | An importer who gets a classification wrong does not usually find out at the border. They find out at an audit… |
| /guides/door-thickness-to-cylinder-length-2026/ | 有 | A euro cylinder is sized by arithmetic, and the arithmetic is genuinely simple. What makes people get it wrong… |
| /guides/en-1125-vs-en-179-2026/ | 有 | Two standards, two products that look like they do the same job, and a choice that is made by asking about peo… |
| /guides/en-ansi-bhma-cross-reference-2026/ | 有 | The request arrives in almost the same words every time: send us a conversion table between the European stand… |
| /guides/exit-device-outside-trim-functions-2026/ | 无 | An exit device is two products that ship as one. Inside is a bar that always releases the latch, and that half… |
| /guides/finish-code-reference-2026/ | 有 | A finish code is two or three letters on a purchase order, and it is the line most likely to make the right pr… |
| /guides/fire-door-hardware-what-must-be-rated-2026/ | 有 | The most expensive misunderstanding in this industry is the belief that a fire door is a door. It is not. It i… |
| /guides/glass-door-thickness-and-cutouts-2026/ | 有 | There is one sentence in this trade that costs more money than any other, and it is said by somebody standing … |
| /guides/hardware-refurbishment-survey-2026/ | 无 | A refurbishment order is only as good as the survey behind it, and the most expensive assumption in this trade… |
| /guides/hardware-warranty-what-it-covers-2026/ | 无 | "Ten year warranty" is the most quoted and least examined line in hardware marketing. The number is chosen for… |
| /guides/key-blanks-and-restricted-profiles-2026/ | 无 | Two locks can take the same key bitting and still not share a key, because the key has to get into the plug be… |
| /guides/lever-return-and-en-1906-2026/ | 有 | Look at the free end of a commercial lever handle. It curves back toward the door face rather than finishing i… |
| /guides/master-key-hierarchy-planning-2026/ | 无 | A master key system is a piece of architecture. It is designed once, before any cylinder is cut, and then the … |
| /guides/material-traceability-mill-certs-2026/ | 有 | "Can you send the material certificate?" is asked on almost every serious hardware inquiry, and it is answered… |
| /guides/powder-coating-and-ral-2026/ | 有 | Two parts arrive, both coated to the same RAL number, and they do not match. Neither supplier is wrong, and th… |
| /guides/qualifying-a-hardware-supplier-2026/ | 无 | Three kinds of company reply to a door hardware inquiry, and all three reply the same way. The difference only… |
| /guides/samples-and-incoming-inspection-2026/ | 无 | Almost every serious problem in an imported hardware order is a translation failure rather than a manufacturin… |
| /guides/stainless-grade-selection-201-304-316-2026/ | 有 | Three grades cover almost all stainless door hardware. They are indistinguishable to a buyer holding two sampl… |
| /guides/strike-plates-and-keeps-2026/ | 无 | Every opening has a component that gets specified last, ordered as an afterthought and blamed for nothing. It … |
| /guides/submittal-package-contents-2026/ | 无 | A submittal is not a sales document. It is the moment a specifier checks whether what was ordered is what was … |
| /guides/technical-drawings-what-to-expect-2026/ | 有 | "Can you send the CAD?" is the most common technical request a hardware factory receives and the least specifi… |
| /guides/universal-vs-handed-hardware-2026/ | 无 | A catalog says "universal" and a buyer stops worrying about handing. That is the intended effect and it is rig… |
| /guides/zinc-alloy-die-cast-hardware-2026/ | 有 | Say "zinc alloy" to an experienced buyer and watch the reaction. It is the material most likely to be read as … |
| /news/brass-piano-hinge-is-a-finish-not-a-metal/ | 有 | Search for a brass piano hinge and almost everything you find will be an iron hinge with a brass finish on it.… |
| /news/cross-referencing-a-lock-you-already-buy/ | 无 | Look at the search terms that bring people to a hardware factory's site and a pattern appears immediately: a g… |
| /news/door-coordinator-double-fire-door/ | 无 | A single door closes one way. A pair does not. Put a closer on both leaves of a double door and each one obeys… |
| /news/door-hardware-schedule-guide/ | 无 | A manufacturer's catalog is organized by product: lock cases here, lever handles there, closers somewhere else… |
| /news/double-fire-exit-door-hardware-set/ | 无 | Most orders for a double fire exit door arrive as a list: push bars, a trim, two closers, a coordinator. Every… |
| /news/master-key-systems-how-many-levels-you-need/ | 无 | Almost every inquiry we get about master keying opens the same way: "can you do master key?" The answer is yes… |
| /news/mortise-lock-backset-and-centre-distance-guide/ | 无 | A distributor sends a purchase order for four hundred mortise lock cases. The model number is right, the finis… |
| /news/narrow-stile-aluminium-door-lock-sag/ | 无 | The complaint arrives in the same words every time: the lock has failed, the door will not latch, the key turn… |
| /news/occupied-vacant-washroom-indicator-bolt/ | 无 | An indicator bolt is the part on a toilet cubicle door that both locks it and tells you it is locked. That is … |
| /news/what-a-frameless-glass-door-needs/ | 无 | Nobody sells a frameless glass door. What gets sold is a sheet of toughened glass with holes and notches cut i… |
| /news/what-documents-you-can-actually-get/ | 无 | A recurring shape appears in the queries that reach this site: people are not looking for a product, they are … |
| /news/what-oem-actually-changes/ | 无 | "Do you do OEM?" is the most common question our export desk receives and the least useful one, because yes is… |
| /news/why-the-catalogue-is-this-wide/ | 有 | People ask why one factory carries this many different products, and the honest answer is that we did not plan… |
