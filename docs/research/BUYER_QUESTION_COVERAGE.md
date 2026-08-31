# 买家问题覆盖审计

<!-- 由 scripts/audit-question-coverage.mjs --markdown 生成，请勿手改。 -->

题库在 `docs/research/buyer-questions.json`。**这不是要再补 Schema** —— Product / FAQPage / BreadcrumbList / ItemList / Organization / WebSite 已经在 471 页上输出，`llms.txt` 也是从目录生成的。任何标记都无法提供一个**没有写在任何地方的答案**。

**170 个问题：完整回答 29 · 部分 58 · 无答案 83**

「部分」是最值得先处理的一档：数据在一部分记录上有、另一部分没有。对答案引擎来说这比干净的空白更糟 —— 它看起来是可引用的来源，直到引到缺的那条为止。

## 汇总

| 范围 | 完整 | 部分 | 无 | 合计 |
|---|---|---|---|---|
| 通用（每个类目都问） | 5 | 5 | 10 | 20 |
| Panic Exit Devices | 1 | 5 | 4 | 10 |
| Lock Cases | 0 | 5 | 5 | 10 |
| Knob Locks | 1 | 6 | 3 | 10 |
| Lever Handles | 4 | 1 | 5 | 10 |
| Night Latches & Rim Locks | 5 | 4 | 1 | 10 |
| Lock Cylinders | 2 | 4 | 4 | 10 |
| Door Closers | 0 | 2 | 8 | 10 |
| Deadbolts | 2 | 4 | 4 | 10 |
| Brass & Steel Door Hinges | 1 | 4 | 5 | 10 |
| Stainless Steel Handles | 1 | 2 | 7 | 10 |
| Glass Door Accessories | 0 | 4 | 6 | 10 |
| Bathroom Accessories | 3 | 4 | 3 | 10 |
| Grip Handle Sets | 4 | 1 | 5 | 10 |
| Hardware Accessories | 0 | 7 | 3 | 10 |
| Sliding Hook Locks | 0 | 0 | 10 | 10 |

## 通用

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✗ | What is your minimum order quantity? | FAQ question exists but its answer is empty |
| ✗ | How long before you can ship after I place the order? | FAQ question exists but its answer is empty |
| ✗ | Can I get a sample first? Do I pay for it? | FAQ question exists but its answer is empty |
| ✗ | What payment terms do you take — TT, LC, 30% deposit? | FAQ question exists but its answer is empty |
| ✗ | Can you put my brand on it instead of HYDE? | FAQ question exists but its answer is empty |
| ✓ | Do you actually make these or are you a trading company? | answered in the FAQ |
| ✓ | Do you ship to my country? | answered in the FAQ |
| ✓ | Can I just buy through Alibaba instead of emailing? | answered in the FAQ |
| ✓ | Can you send the drawings with dimensions? | answered in the FAQ |
| ✓ | I need test reports for a tender — can you supply them? | answered in the FAQ |
| ~ | Which finishes can I get this in? | Finish on 285/435 records |
| ~ | What is it actually made of — solid brass or plated zinc? | Material on 390/435 records |
| ~ | Where is this meant to be used — commercial, residential, fire door? | Application on 213/435 records |
| ~ | How many open/close cycles is it rated for? | Cycle life on 102/435 records |
| ✗ | How do you pack it, and how many per carton? | Packing appears on 6 of 435 records; a buyer needs carton quantity and gross weight to cost freight. |
| ✗ | What is the HS code for customs? | No HS codes anywhere on the site. Every importer needs one to clear goods and to estimate duty. |
| ✗ | What warranty do you give? | No warranty statement on any page. Commonly the second question after price. |
| ✗ | Can I get spare parts and replacement cylinders later? | No spare-parts or after-sales page. |
| ✗ | How do you compare with Assa Abloy or Dorma on this? | No comparison content. Answer engines have nothing to quote when a buyer asks a versus question. |
| ~ | How do I install it? Is there a template? | Installation on 23/435 records |

## Panic Exit Devices

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✓ | Is this certified to EN 1125? | answered in the FAQ |
| ~ | Can I use it on a fire door? | Application on 31/42 records |
| ~ | Does it work on a double door with both leaves? | Function on 7/42 records |
| ✗ | Push bar or touch bar — what is the difference and which do I need? | No explainer page. This is the single most asked comparison in the category. |
| ✗ | Can it be opened from outside with a key? | Trim on 0/42 records — the label is never used here |
| ~ | Does it come with an alarm? | Feature on 2/42 records |
| ✗ | What width of door does the bar fit? | Door Width on 0/42 records — the label is never used here |
| ~ | Is there a version that locks at top and bottom as well? | Function on 7/42 records |
| ~ | Will it hold up in a cold room or outdoors? | Application on 31/42 records |
| ✗ | What is the outside trim made of and can I get it in stainless? | Trim on 0/42 records — the label is never used here |

## Lock Cases

| | 买家会怎么问 | 现状 |
|---|---|---|
| ~ | What backset do you have? I need 45 and 60. | Backset on 32/45 records |
| ~ | What is the centre distance between the handle and the cylinder? | Centre distance on 29/45 records |
| ~ | Does it take a euro profile cylinder? | Cylinder on 11/45 records |
| ✗ | How far does the deadbolt throw? | Deadbolt throw on 0/45 records — the label is never used here |
| ✗ | What door thickness does it suit? | Door thickness on 0/45 records — the label is never used here |
| ~ | Is it handed, or can it be used left and right? | Handing on 2/45 records |
| ✗ | What size spindle does it take — 8mm square? | Spindle on 0/45 records — the label is never used here |
| ~ | Is the forend stainless or plated steel? | Material on 28/45 records |
| ✗ | Does the strike plate come with it? | Strike on 0/45 records — the label is never used here |
| ✗ | Will your case fit a lock body from another brand's faceplate cutout? | No interchange or cross-reference table. Replacement buyers ask this first. |

## Knob Locks

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✗ | What is the difference between your heavy duty and light duty range? | Sub-categories exist as filters but nothing explains the difference in words. |
| ~ | Entry, privacy, passage — which one is which? | Function on 52/67 records |
| ~ | What is the backset? | Backset on 30/67 records |
| ✗ | What is the cross bore diameter for the door prep? | Cross bore on 0/67 records — the label is never used here |
| ~ | Can it be master keyed with the rest of the building? | Keying on 36/67 records |
| ~ | What door thickness does it take? | Door thickness on 34/67 records |
| ✓ | Is the chassis steel or zinc? | Chassis on 62/67 records |
| ✗ | Is it ANSI Grade 1, 2 or 3? | We hold no ANSI/BHMA certification (client confirmed). A buyer will still ask; the honest answer needs to exist somewhere rather than being silence. |
| ~ | How many keys come with each lock? | Key options on 5/67 records |
| ~ | Is the latch adjustable between 60 and 70mm? | Latch on 42/67 records |

## Lever Handles

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✓ | Is it a tubular or a mortise lever set? | Function on 40/40 records |
| ~ | Is it solid stainless or zinc alloy with a coating? | Material on 35/40 records |
| ✗ | How long is the lever? | Lever length on 0/40 records — the label is never used here |
| ✗ | What is the rose diameter? | Rose diameter on 0/40 records — the label is never used here |
| ✗ | Will the matt black finish wear off? | No finish-durability or salt-spray statement. Matt black is the finish buyers most distrust. |
| ✗ | Does it come with the spindle and screws? | Spindle on 0/40 records — the label is never used here |
| ✓ | Is it suitable for a bathroom with a thumbturn? | Function on 40/40 records |
| ✗ | Can I get the handle and the lock case as one order? | No cross-category bundle or 'commonly ordered with' content. |
| ✓ | Does it work on a 40mm door? | Door thickness on 40/40 records |
| ✓ | Is it left or right handed? | Handing on 40/40 records |

## Night Latches & Rim Locks

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✓ | Does it lock automatically when the door shuts? | Function on 22/22 records |
| ✓ | Can I open it from inside without a key in an emergency? | Function on 22/22 records |
| ~ | What is the case size? | Size on 2/22 records |
| ~ | How many keys are supplied? | Key options on 4/22 records |
| ✓ | Will it fit a door that opens outwards? | Handing on 22/22 records |
| ~ | Is the cylinder replaceable with a euro one? | Cylinder on 9/22 records |
| ~ | What is the backset from the door edge? | Backset on 16/22 records |
| ✓ | Is the body brass or painted steel? | Material on 21/22 records |
| ✓ | Does it come with the strike box for the frame? | Strike on 22/22 records |
| ✗ | Can it be keyed alike across a block of flats? | Keying on 0/22 records — the label is never used here |

## Lock Cylinders

| | 买家会怎么问 | 现状 |
|---|---|---|
| ~ | What lengths do you have — 70mm, 80mm? | Size on 10/13 records |
| ✗ | Is it a euro profile or an oval? | Type on 0/13 records — the label is never used here |
| ✗ | Can you supply them keyed alike? | Keying on 0/13 records — the label is never used here |
| ✗ | How many pins? Is it anti-drill or anti-bump? | No security-feature spec on cylinders. This is the deciding question in the category. |
| ~ | Is it double cylinder or thumbturn on one side? | Function on 1/13 records |
| ✓ | Is the body brass? | Material on 13/13 records |
| ✓ | Can I order a master key system for a whole project? | answered in the FAQ |
| ~ | How many keys per cylinder? | Key options on 1/13 records |
| ~ | Do the offsets come in 30/40, 35/45? | Size on 10/13 records |
| ✗ | Do you have a European standard certification for these? | No EN 1303 statement. Tenders in Europe and Latin America ask for it by number. |

## Door Closers

| | 买家会怎么问 | 现状 |
|---|---|---|
| ~ | What door weight and width will it handle? | Capacity on 6/9 records |
| ✗ | Is the closing speed adjustable? | Feature on 0/9 records — the label is never used here |
| ✗ | Does it have hold-open? | Function on 0/9 records — the label is never used here |
| ✗ | Is this a floor spring or an overhead closer? | Type on 0/9 records — the label is never used here |
| ~ | What is the maximum opening angle? | Max opening angle on 6/9 records |
| ✗ | Can it be used on a fire door? | Application on 0/9 records — the label is never used here |
| ✗ | Will it leak oil in a hot climate? | No temperature-range statement. Buyers in Gulf and Latin American markets ask this specifically. |
| ✗ | Is it EN 1154 certified, and what power size? | The EN 1154 report on file belongs to another company and was removed. We have no closer certification to state — say so rather than staying silent. |
| ✗ | Does it suit a glass door? | Application on 0/9 records — the label is never used here |
| ✗ | What is included — arm, cover, fixing plate? | No box-contents statement for closers. |

## Deadbolts

| | 买家会怎么问 | 现状 |
|---|---|---|
| ~ | Single or double cylinder? | Function on 1/7 records |
| ✓ | How far does the bolt throw? | Deadbolt throw on 7/7 records |
| ~ | What backset? | Backset on 6/7 records |
| ~ | What door thickness? | Door thickness on 6/7 records |
| ✗ | Is the bolt hardened against sawing? | No security-feature detail. The whole point of a deadbolt. |
| ✓ | Can it be keyed alike with the knob lock on the same door? | Keying on 7/7 records |
| ✗ | Is the strike reinforced for the frame? | Strike on 0/7 records — the label is never used here |
| ~ | What finishes? | Finish on 5/7 records |
| ✗ | Does it fit a standard 54mm cross bore? | Cross bore on 0/7 records — the label is never used here |
| ✗ | Only seven models — is that the whole range? | Deadbolts is our thinnest category at 7 records. Either the range is thin or the catalogue is incomplete; a buyer cannot tell. |

## Brass & Steel Door Hinges

| | 买家会怎么问 | 现状 |
|---|---|---|
| ~ | What sizes do you have — 4 inch, 5 inch? | Size on 16/26 records |
| ~ | How thick is the leaf? | Thickness on 8/26 records |
| ~ | Ball bearing or plain? | Type on 6/26 records |
| ✓ | Is it solid brass or brass plated steel? | Material on 25/26 records |
| ✗ | How many hinges per door do I need? | No selection guidance. An easy explainer that answer engines would quote. |
| ✗ | What door weight will three of these carry? | No load rating on hinges. |
| ~ | Are they fire rated? | Application on 8/26 records |
| ✗ | Do the screws come with them? | No box-contents statement. |
| ✗ | Are they sold in pairs or singly? | Unit of sale is not stated anywhere and it changes the quoted price by 2x. |
| ✗ | Will stainless ones rust near the coast? | No corrosion-grade statement (304 vs 201 vs 316), which is exactly what coastal buyers ask. |

## Stainless Steel Handles

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✓ | What grade of stainless — 304 or 201? | Material on 35/35 records |
| ✗ | What is the overall length and the fixing centres? | Fixing centre on 0/35 records — the label is never used here |
| ✗ | What tube diameter? | Tube diameter on 0/35 records — the label is never used here |
| ✗ | Will it fit a glass door, and what glass thickness? | Application on 0/35 records — the label is never used here |
| ~ | Is it back to back or single sided? | Function on 1/35 records |
| ~ | Satin or mirror polish? | Finish on 4/35 records |
| ✗ | How far does it stand off the door? | Standoff on 0/35 records — the label is never used here |
| ✗ | Will it corrode in a swimming pool or coastal building? | No corrosion-grade statement, and 35 records in this category are exactly where it matters. |
| ✗ | Do the fixings come with it? | No box-contents statement. |
| ✗ | Can you make a custom length for our project? | Customization on 0/35 records — the label is never used here |

## Glass Door Accessories

| | 买家会怎么问 | 现状 |
|---|---|---|
| ~ | What glass thickness do the patch fittings take — 10mm, 12mm? | Application on 9/20 records |
| ✗ | Do I need a floor spring with these patch fittings? | No cross-category compatibility content between patch fittings and floor springs, though we sell both. |
| ~ | Is the fitting stainless or aluminium with a cover? | Material on 17/20 records |
| ✗ | Top patch, bottom patch, corner — which do I need for one door? | No assembly or set-composition guide. A frameless door needs a specific combination. |
| ~ | What is the handle length for a glass door? | Length on 5/20 records |
| ✗ | Does it come with the glass gaskets? | No box-contents statement. |
| ✗ | Can it take a lock? | Function on 0/20 records — the label is never used here |
| ~ | What finish options are there? | Finish on 12/20 records |
| ✗ | Is it suitable for a shopfront that gets heavy use? | Cycle life on 0/20 records — the label is never used here |
| ✗ | Do you supply the whole set for one door as a package? | Same set-composition gap; the buyer wants one line on a quote, not eight. |

## Bathroom Accessories

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✓ | Is it stainless or chrome plated brass? | Material on 44/45 records |
| ~ | What are the dimensions? | Size on 15/45 records |
| ~ | Is it wall mounted, and do fixings come with it? | Installation on 6/45 records |
| ✗ | Will the finish survive a humid bathroom? | No corrosion or humidity statement on 45 records in a category defined by humidity. |
| ✗ | Can I buy a matching set — towel bar, hook, paper holder? | No series or matching-set grouping, though the catalogue clearly contains families. |
| ✓ | Is it suitable for a hotel? | Application on 44/45 records |
| ✓ | What finishes? | Finish on 44/45 records |
| ~ | Is it concealed fixing or visible screws? | Installation on 6/45 records |
| ~ | What projection from the wall? | Projection on 5/45 records |
| ✗ | Do you do grab rails rated for disabled access? | Accessibility products are a distinct tender requirement and we say nothing about them. |

## Grip Handle Sets

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✗ | What are the fixing centres on the plate? | Fixing centre on 0/11 records — the label is never used here |
| ✗ | Does it include the lock, or just the handle set? | No box-contents statement; this category is the one most often mis-ordered because of it. |
| ✓ | What door thickness? | Door thickness on 11/11 records |
| ~ | Is it for an entrance door? | Application on 1/11 records |
| ✓ | Is it handed? | Handing on 11/11 records |
| ✓ | What is the plate material and finish? | Material on 10/11 records |
| ✗ | Can it take a euro cylinder? | Cylinder on 0/11 records — the label is never used here |
| ✓ | What is the backset? | Backset on 11/11 records |
| ✗ | Can I get a matching interior lever on the other side? | No matching-set content across grip sets and lever handles. |
| ✗ | Only eleven models — do you have more? | Thin category (11 records); a buyer cannot tell if that is the range or the publishing gap. |

## Hardware Accessories

| | 买家会怎么问 | 现状 |
|---|---|---|
| ~ | What viewing angle does the door viewer give? | Viewing Angle on 7/50 records |
| ~ | What door thickness does the viewer suit? | Door thickness on 3/50 records |
| ~ | How long is the flush bolt? | Length on 13/50 records |
| ~ | Is the door stopper floor or wall mounted? | Installation on 2/50 records |
| ~ | Do you have a power transfer for an electric strike? | Function on 14/50 records |
| ~ | Is the indicator a vacant/engaged type for a toilet? | Function on 14/50 records |
| ~ | Are the house numbers stainless and how big? | Size on 9/50 records |
| ✗ | Is the security guard chain or bar type? | Type on 0/50 records — the label is never used here |
| ✗ | This category has fifty different things in it — how do I find what I need? | Fifty unlike products under one heading. Nine sub-categories exist as filters but the category page does not lead with them. |
| ✗ | Do you have magnetic catches and door seals too? | Range boundaries are not stated; a buyer cannot tell what we do NOT make. |

## Sliding Hook Locks

| | 买家会怎么问 | 现状 |
|---|---|---|
| ✗ | Is this for a sliding door or a pocket door? | Application on 0/3 records — the label is never used here |
| ✗ | What backset? | Backset on 0/3 records — the label is never used here |
| ✗ | Does the hook engage automatically? | Function on 0/3 records — the label is never used here |
| ✗ | Can it take a euro cylinder? | Cylinder on 0/3 records — the label is never used here |
| ✗ | What door thickness? | Door thickness on 0/3 records — the label is never used here |
| ✗ | Is the strike included for the jamb? | Strike on 0/3 records — the label is never used here |
| ✗ | What is the case size? | Size on 0/3 records — the label is never used here |
| ✗ | Is it suitable for an aluminium sliding door? | Application on 0/3 records — the label is never used here |
| ✗ | Only three models — is that everything? | Smallest category at 3 records. Either state that it is a niche line or expand it. |
| ✗ | Do you have the matching handle for a sliding door? | No matching-set content. |

