# claude — 手机 rail 重排；PC 汉堡按 FSB 瘦身并加两张图

| | |
|---|---|
| 范围 | `SiteHeader.tsx` · `SiteMenuDrawer.tsx` · `globals.css` · `mobile-navigation.test.ts` |
| 测试 | `npm test` 149 全过；375px 与 1512px 双端实测 |

## 一、手机顶栏：删 Projects 不够，还得把 Buy it now 挪到最前

甲方要求删掉 Projects，让 Buy on Alibaba「左移、清晰可见」。

**只删 Projects 没解决问题。** 删完还剩五项，实测：

```
Buy it now 右边缘 464px  /  视口 375px   ← 仍在屏幕外
```

rail 是横向滚动的，**在屏幕外和不存在是一回事** —— 对唯一一个通向下单的控件尤其如此。
所以按甲方说的「左移」，把它排到**第一位**：

```
改后  [Buy it now] Products  Product Finder  News  Company
      左 16px → 右 124px      视口 375px      完全可见 ✓
```

阅读顺序在这里不神圣 —— rail 是一排目的地，不是一个句子，
最可能被点的东西就该放在视线落点上。

Projects 只从**手机 rail** 移除；桌面顶栏和抽屉里都还在。

## 二、PC 汉堡：把 15 个类目拿掉，按 FSB 的思路

1376px 以上，顶栏的 products shelf **已经把 15 个产品族和子类全列出来了**
（甲方截图里那一屏）。抽屉里再列一遍，等于让抽屉变成一段说不出新东西的长滚动。

FSB 的桌面菜单短，就是这个道理：**导航负责目录，菜单负责其余**。

改成 `xl:hidden`：

| | 手机 375px | 桌面 1512px |
|---|---|---|
| 15 个类目 + 4 个折叠盘 | **在**（4 个折叠盘可见） | **不在** |
| 两张图片卡 | 不在 | **在** |

手机端必须保留 —— 1376px 以下顶栏只剩字标和汉堡，抽屉是**唯一**能到类目的路。

## 三、两张图片卡：把腾出来的空间用好

把类目拿掉后，桌面抽屉几乎是空的，**空面板读起来是没做完，不是克制**。
按 FSB 的做法放两张图，每张都通向一个地方，不是装饰：

- **Product Finder** — 435 个型号按类目/材质/表面/门型筛选（`material-bronze-patina`）
- **Projects** — 硬件在真实建筑上怎么被指定（`project-glass-entrance`）

选这两个，是因为**打开菜单而不是用导航的访客**，最可能想要的就是这两件事：
一个回答「我该用哪个型号」，一个是证据。

`hidden ... xl:block` —— 手机上这块空间属于类目，两张 4:3 图会把 Company 和邮箱挤出屏幕。

图片用普通 `<img>`，与 `MediaPlaceholder` 同理（静态导出 + `images.unoptimized`，
next/image 只加标记不做优化），并按仓库惯例加 eslint 抑制注释。

## 四、改了一条测试（同一提交）

`mobile-navigation.test.ts` 原本断言字面量 `headerNav.map` 出现两次。
rail 现在是 `headerNav.filter(...).sort(...).map(...)` —— **仍然是同一个数组，
仍然没有把标签重抄一遍**，测试意图不变。改为统计 `headerNav` 的出现次数，
并新增一条断言钉住「rail 不含 /projects」。在 rail 里硬写标签清单只会有一处引用，照样会红。

## 五、排版复核：产品内页与样机一致

```
h1        32px/40px  w700  ls -0.2px   ← 全页唯一的 700
导语      20px/26px  w400              ← 不加粗
规格标签  13px  #6e6e73（灰）
规格取值  17px  #11110f（黑）+ tabular-nums
```
