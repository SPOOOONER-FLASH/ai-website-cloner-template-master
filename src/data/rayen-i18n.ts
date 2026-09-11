/**
 * RAYEN 雷茵 — the two locales the site ships in.
 *
 * WHY A STRINGS TABLE AND NOT A SECOND SET OF PAGES
 * The English site is the same site in another language, not another site. Duplicating the
 * page components would mean every future change is made twice, and the second copy is the
 * one that gets forgotten — which is how a site ends up with an English page still quoting
 * a number the Chinese page corrected two months ago.
 *
 * WHY THE ENGLISH IS NOT TRANSLATED FROM THE CHINESE
 * Product names, spec labels and materials come straight from content/products, which is
 * English at source; the Chinese is what gets generated from it. Translating back would be
 * a lossy round trip. Only the prose below — page titles, section headings, the sentences a
 * person wrote — exists separately in both languages, and it is written twice rather than
 * translated: 「没有核实过的那一栏留短横线，不拿估计值去填」 becomes "Unconfirmed dimensions
 * are shown as a dash rather than an estimate", which is the same commitment in the register
 * an English buyer reads, not a word-for-word rendering of a Chinese sentence.
 *
 * THE CHINESE IS WRITTEN IN CHINESE, NOT RENDERED INTO IT
 * 2026-09-10 the client said 走进雷茵 「像机翻」, and they were right. The tell was never
 * vocabulary — it was English sentence shapes wearing Chinese words:
 *
 *   「锁具制造经验始于 1999 年」   a calque of "experience begins in 1999". Chinese says
 *                                  制锁经验可追溯到 1999 年.
 *   「…到装配检测在同一厂区内完成」 从…到… needs its comma and a 全部 before the verb,
 *                                  or the sentence has no joint.
 *   「压铸、电镀与热处理配套」      与 joins TWO things. A list of three takes 、…等.
 *
 * A buyer who reads machine-translated Chinese on a Chinese factory's own site draws the
 * obvious conclusion about where the rest of it came from. Reference register: 悍高 for the
 * corporate opening, 坚士 for how a factory states plant, capacity and certification.
 */

export type RayenLocale = "zh" | "en";

export const RAYEN_LOCALES: RayenLocale[] = ["zh", "en"];

/** Where each locale lives inside the built Next app, before build-rayen-site.mjs lifts it. */
export const LOCALE_SEGMENT: Record<RayenLocale, string> = { zh: "/zh", en: "/zh-en" };

/** Where each locale lives on the deployed RAYEN host. */
export const LOCALE_PUBLIC_PREFIX: Record<RayenLocale, string> = { zh: "", en: "/en" };

export const htmlLang: Record<RayenLocale, string> = { zh: "zh-Hans", en: "en" };

type Strings = {
  localeName: string;
  otherLocaleName: string;
  nav: { products: string; company: string; quality: string; oem: string; contact: string };
  home: {
    eyebrowLocation: string;
    title: string;
    ctaProducts: string;
    ctaOem: string;
    productsEyebrow: string;
    productsTitle: string;
    productsIntro: string;
    capabilityEyebrow: string;
    capabilityTitle: string;
    capabilityMore: string;
    factoryEyebrow: string;
    factoryTitle: string;
    factoryIntro: string;
    factoryMore: string;
    askTitle: string;
    askBody: string;
    askCta: string;
  };
  facts: { categories: string; models: string; experience: string; unitItem: string; unitSince: string };
  products: {
    title: string;
    eyebrow: string;
    intro: (categories: number, models: number) => string;
    modelCount: (n: number) => string;
    categoryIntro: (count: number) => string;
    breadcrumbRoot: string;
    specs: string;
    finishes: string;
    noSpecs: string;
    noPhoto: string;
    ctaQuote: string;
    ctaOem: string;
    ctaShop: string;
    familyTitle: string;
    familyLeverLine: (models: string) => string;
    familyHandleLine: string;
    relatedTitle: string;
    galleryCounter: (index: number, total: number) => string;
    viewNth: (index: number, label: string) => string;
  };
  company: { eyebrow: string; title: string; body: string[]; factoryEyebrow: string; factoryTitle: string; factoryIntro: string; contactLink: string };
  quality: {
    eyebrow: string;
    title: string;
    credentialsTitle: string;
    credentialsNote: string;
    rulesTitle: string;
    rules: { n: string; title: string; body: string }[];
    cta: string;
  };
  oem: {
    eyebrow: string;
    title: string;
    intro: string;
    processTitle: string;
    steps: { n: string; title: string; body: string }[];
    enquiryTitle: string;
    enquiryItems: string[];
    cta: string;
  };
  contact: { eyebrow: string; title: string; intro: string; rows: { label: string; key: string }[]; note: string };
  footer: { products: string; about: string; shop: string; shopLink: string; contact: string; allCategories: string; icp: string };
};

export const STRINGS: Record<RayenLocale, Strings> = {
  zh: {
    localeName: "中文",
    otherLocaleName: "EN",
    nav: { products: "产品中心", company: "走进雷茵", quality: "品质与认证", oem: "合作与定制", contact: "联系我们" },
    home: {
      eyebrowLocation: "RAYEN · ZHONGSHAN XIAOLAN",
      title: "机械门锁与门控五金制造",
      ctaProducts: "查看产品中心",
      ctaOem: "来图来样加工",
      productsEyebrow: "Products",
      productsTitle: "产品分类",
      /*
        这句话要和规格表里真正有的东西对得上。原文写「材质、背距、门厚、面板尺寸」，
        但目录里现在大部分是拉手 —— 拉手没有背距。买家点进去发现说好的一栏不存在，
        损失的不是这一句，是整张表的可信度。2026-09-10 补进 重量 与 安装孔径 之后改成这样。
      */
      productsIntro:
        "按品类进入，每个型号都有独立的规格表：材质、尺寸、中心距、安装孔径、重量和表面处理。没有核实过的那一栏写短横线，不拿估计值去填。",
      capabilityEyebrow: "Capability",
      capabilityTitle: "加工方式",
      capabilityMore: "了解定制流程",
      factoryEyebrow: "Factory",
      factoryTitle: "车间实拍",
      factoryIntro: "以下照片全部来自小榄厂区，未做合成，也没有借用他人的展位或展厅。",
      factoryMore: "走进雷茵",
      askTitle: "需要图纸、尺寸或报价？",
      askBody: "告诉我们型号或用途，我们回具体规格和装箱数据。没把握的参数我们会直说不知道，不会先给一个数字。",
      askCta: "联系我们",
    },
    facts: { categories: "在售品类", models: "在售型号", experience: "锁具制造经验", unitItem: "个", unitSince: "年起" },
    products: {
      title: "产品中心",
      eyebrow: "Products",
      intro: (c, m) => `${c} 个品类，${m} 个在售型号。每个型号页都有独立规格表，尺寸以实物为准。`,
      modelCount: (n) => `${n} 个型号`,
      categoryIntro: (n) => `共 ${n} 个型号。点开任意型号可以看到完整规格表。`,
      breadcrumbRoot: "产品中心",
      specs: "规格参数",
      finishes: "可选表面处理",
      noSpecs: "该型号的规格参数尚未整理完成。请直接联系我们索取图纸与尺寸。",
      noPhoto: "暂无实拍图",
      ctaQuote: "索取图纸与报价",
      ctaOem: "来图来样加工",
      ctaShop: "1688 店铺查看",
      familyTitle: "同款式搭配",
      familyLeverLine: (models) => `本款配套同风格门把手 ${models}，可成套下单。`,
      familyHandleLine: "本款执手属于同一设计款式，可与下列拉手成套使用。",
      relatedTitle: "同类型号",
      galleryCounter: (i, t) => `第 ${i} / ${t} 张`,
      viewNth: (i, label) => `查看第 ${i} 张：${label}`,
    },
    company: {
      eyebrow: "Company",
      title: "走进雷茵",
      body: [
          "（RAYEN 雷茵）位于广东省中山市小榄镇，公司注册于 2026 年，制锁经验可追溯到 1999 年。从模具开发、冲压成型到装配检测，全部在同一个厂区里完成。小榄是国内机械门锁最集中的产区，压铸、电镀、热处理等配套厂点都在半小时车程之内。",
          "产品覆盖逃生推杠、球锁、执手锁、插芯锁体、锁芯、合页、玻璃门夹、闭门器和浴室五金，承接来图加工、来样加工及 OEM / ODM 贴牌生产。",
          "本站每一个型号都有独立的规格表。没有核实过的那一栏留短横线，不拿估计值去填 —— 五金件的孔位和尺寸在开模那一刻就定死了，装不上去没法在现场修，买家赔进去的是一整批货，而不是一次退换。"
    ],
      factoryEyebrow: "Factory",
      factoryTitle: "车间实拍",
      factoryIntro: "全部拍自小榄厂区，未经合成。",
      contactLink: "联系我们",
    },
    quality: {
      eyebrow: "Quality",
      title: "品质与认证",
      credentialsTitle: "资质",
      credentialsNote:
        "以上两项来自 1688 店铺的工商资质栏。证书扫描件我们还没有放上来 —— 放一张看不清编号的图片，和不放，对采购方来说没有区别；需要核验的客户可以直接向我们索取带编号的原件。",
      rulesTitle: "我们不会做的三件事",
      rules: [
          {
                "n": "01",
                "title": "不写没有把握的尺寸",
                "body": "规格表里查不到的一栏是短横线，不是一个看起来合理的数字。金属件的孔位、螺距、方轴和背距在开模那一刻就定死了，装不上去不能靠现场修，买家为此损失的是一整批货。"
          },
          {
                "n": "02",
                "title": "不放生成的产品图",
                "body": "本站所有产品图都是实物拍摄。AI 可以把照片修干净、去背景，但不能想象一件金属产品 —— 生成出来的执手看着像那么回事，孔位是错的，而这行的买家一眼就看得出来。"
          },
          {
                "n": "03",
                "title": "不借用别人的资质和场地",
                "body": "网站上的车间照片全部拍自本厂。别家的展位、别家的展厅、别家名字的检测报告，一张都没有用。"
          }
    ],
      cta: "索取证书原件或检测报告",
    },
    oem: {
      eyebrow: "OEM / ODM",
      title: "合作与定制",
      intro: "来图加工、来样加工及贴牌生产。下面是一般流程；具体周期和费用按件报，不给通用数字。",
      processTitle: "一般流程",
      steps: [
          {
                "n": "01",
                "title": "发来图纸或样品",
                "body": "有图纸就发图纸（DWG、PDF、照片都可以）；没有图纸，寄一件样品同样可以做。关键是把安装面、孔位和方轴规格说清楚。"
          },
          {
                "n": "02",
                "title": "确认结构与尺寸",
                "body": "我们回一份确认清单：材质、背距、门厚范围、面板尺寸、表面处理。有拿不准的地方我们会问，而不是按常见规格默认。"
          },
          {
                "n": "03",
                "title": "开模或改模",
                "body": "结构与现有模具接近的，改模即可；结构不同的需要开新模。这一步的费用与周期按件报，不做通用报价。"
          },
          {
                "n": "04",
                "title": "打样确认",
                "body": "样品寄到您手上，装到实际门上试过再决定。样品不对的地方在这一步改，比量产后改便宜得多。"
          },
          {
                "n": "05",
                "title": "量产与包装",
                "body": "包装可按您的要求做，含贴牌、彩盒、说明书和条码。装箱数据在量产前给到。"
          }
    ],
      enquiryTitle: "发询价时带上这几项，回复会快很多",
      enquiryItems: [
          "产品类型与参考型号（本站型号即可）",
          "门厚、背距、方轴规格",
          "表面处理与颜色",
          "预计数量与交期要求",
          "是否需要贴牌、彩盒或说明书",
          "有无图纸或样品"
    ],
      cta: "发送询价",
    },
    contact: {
      eyebrow: "Contact",
      title: "联系我们",
      intro: "说明型号或用途，我们回具体规格。没有把握的参数我们会说不知道。",
      rows: [
        { label: "公司名称", key: "legalName" },
        { label: "厂址", key: "address" },
        { label: "电话", key: "phone" },
        { label: "邮箱", key: "email" },
        { label: "微信", key: "wechat" },
        { label: "1688 店铺", key: "alibaba1688" },
      ],
      note: "标着短横线的几项还没有对外公布的号码。与其放一个打不通的电话，我们先把它空着 —— 有需要请通过 1688 店铺留言，或让介绍人转达。",
    },
    footer: {
      products: "产品中心",
      about: "关于",
      shop: "线上店铺",
      shopLink: "1688 店铺 ↗",
      contact: "联系",
      allCategories: "全部品类 →",
      icp: "本站服务器位于境外，未办理 ICP 备案。",
    },
  },

  en: {
    localeName: "EN",
    otherLocaleName: "中文",
    nav: { products: "Products", company: "Company", quality: "Quality", oem: "OEM / ODM", contact: "Contact" },
    home: {
      eyebrowLocation: "RAYEN · ZHONGSHAN XIAOLAN",
      title: "Door hardware, made in Zhongshan",
      ctaProducts: "Browse the catalogue",
      ctaOem: "Make to drawing or sample",
      productsEyebrow: "Products",
      productsTitle: "Product families",
      productsIntro:
        "Every model has its own specification table — material, dimensions, centre distance, fixing hole sizes, weight and finish. A dash means we have not confirmed that figure, and we would rather say so.",
      capabilityEyebrow: "Capability",
      capabilityTitle: "How we can make it",
      capabilityMore: "How a custom order runs",
      factoryEyebrow: "Factory",
      factoryTitle: "Inside the plant",
      factoryIntro:
        "Every photograph below was taken in our own workshop in Xiaolan. Nothing is composited, and no one else's stand or showroom appears.",
      factoryMore: "About RAYEN",
      askTitle: "Need drawings, dimensions or a quotation?",
      askBody:
        "Tell us the model or the opening, and we come back with measured figures and packing data. Where we are not certain of a dimension we say so rather than sending a number.",
      askCta: "Contact us",
    },
    facts: { categories: "product families", models: "models in production", experience: "making locks since", unitItem: "", unitSince: "" },
    products: {
      title: "Products",
      eyebrow: "Products",
      intro: (c, m) =>
        `${c} product families, ${m} models in production. Each model page carries its own specification table; dimensions are as manufactured.`,
      /* 1 model, 2 models —— 站上有一个只有一个型号的类目（指示器），
         写成「1 models」会让一个正在核对规格的买家开始怀疑别的数字。 */
      modelCount: (n) => `${n} model${n === 1 ? "" : "s"}`,
      categoryIntro: (n) => `${n} models. Open any one for the full specification table.`,
      breadcrumbRoot: "Products",
      specs: "Specification",
      finishes: "Available finishes",
      noSpecs: "The specification for this model is still being compiled. Ask us for the drawing and dimensions.",
      noPhoto: "No photograph yet",
      ctaQuote: "Request drawing & quotation",
      ctaOem: "Make to drawing or sample",
      ctaShop: "View on 1688",
      familyTitle: "Matching range",
      familyLeverLine: (models) => `Matching lever handles in the same design: ${models}. Available as a set.`,
      familyHandleLine: "This lever belongs to the same design family as the pull handles below.",
      relatedTitle: "Similar models",
      galleryCounter: (i, t) => `${i} of ${t}`,
      viewNth: (i, label) => `View image ${i}: ${label}`,
    },
    company: {
      eyebrow: "Company",
      title: "About RAYEN",
      body: [
          "(RAYEN) is based in Xiaolan, Zhongshan, Guangdong. We have been making locks since 1999, and tooling, pressing, assembly and inspection all happen on one site. Xiaolan is the densest mechanical-lock district in China — die casting, plating and heat treatment are all within half an hour of the works.",
          "The range covers panic exit devices, knob locks, lever handles, mortise cases, cylinders, hinges, glass door fittings, door closers and bathroom hardware. We manufacture to your drawing, to your sample, and under your brand.",
          "Every model on this site has its own specification table. A dimension we have not confirmed is shown as a dash rather than an estimate — hole positions and sizes on metal hardware are fixed the moment the tool is cut, and getting one wrong costs a shipment, not a return."
    ],
      factoryEyebrow: "Factory",
      factoryTitle: "Inside the plant",
      factoryIntro: "All photographed in our own workshop in Xiaolan. Nothing composited.",
      contactLink: "Contact us",
    },
    quality: {
      eyebrow: "Quality",
      title: "Quality & credentials",
      credentialsTitle: "Credentials",
      credentialsNote:
        "Both are listed on our 1688 storefront. The certificate scans are not published here yet — an image too small to read the number on is no better than none. Buyers who need to verify can ask us for the original, number and all.",
      rulesTitle: "Three things we will not do",
      rules: [
          {
                "n": "01",
                "title": "We do not publish a dimension we are not sure of",
                "body": "A row we cannot confirm shows a dash, not a plausible-looking number. Hole centres, thread pitch, spindle size and backset are all fixed when the tool is cut. A part that will not fit cannot be corrected on site, and the buyer loses the shipment."
          },
          {
                "n": "02",
                "title": "We do not publish generated product images",
                "body": "Every product photograph here is of the real part. AI can clean a photograph up and cut it out, but it cannot imagine a piece of metal — a generated lever looks about right and has the holes in the wrong place, which anyone in this trade sees at a glance."
          },
          {
                "n": "03",
                "title": "We do not borrow anyone else’s credentials or premises",
                "body": "Every factory photograph on this site was taken in our own plant. No one else’s trade stand, no one else’s showroom, and no test report with another company’s name on it."
          }
    ],
      cta: "Request a certificate or test report",
    },
    oem: {
      eyebrow: "OEM / ODM",
      title: "Custom manufacturing",
      intro:
        "Made to your drawing, made to your sample, and badged to your brand. The sequence below is the usual one; lead time and tooling cost are quoted per part, not from a table.",
      processTitle: "How it runs",
      steps: [
          {
                "n": "01",
                "title": "Send a drawing or a sample",
                "body": "A drawing is ideal — DWG, PDF or a photograph. Without one, a sample does the job just as well. What matters is that the mounting face, the hole positions and the spindle size are clear."
          },
          {
                "n": "02",
                "title": "We confirm the structure and dimensions",
                "body": "You get back a checklist: material, backset, door thickness range, plate size, finish. Where we are unsure we ask, rather than assume the common size."
          },
          {
                "n": "03",
                "title": "New tooling, or a change to existing tooling",
                "body": "Close to a tool we already have and a modification does it; a different structure needs a new tool. Cost and lead time are quoted per part, never from a table."
          },
          {
                "n": "04",
                "title": "Sample approval",
                "body": "The sample goes to you and onto a real door before anything is decided. Changing it at this stage is far cheaper than changing it after production."
          },
          {
                "n": "05",
                "title": "Production and packing",
                "body": "Packed to your requirement, including your brand, colour box, instructions and barcode. Carton data before production starts."
          }
    ],
      enquiryTitle: "Send these with your enquiry and the answer comes back faster",
      enquiryItems: [
          "Product type and a reference model — ours is fine",
          "Door thickness, backset, spindle size",
          "Finish and colour",
          "Expected quantity and delivery",
          "Whether you need branding, colour box or instructions",
          "Any drawing or sample you can send"
    ],
      cta: "Send an enquiry",
    },
    contact: {
      eyebrow: "Contact",
      title: "Contact us",
      intro:
        "Tell us the model or the application and we come back with the specification. Where we are not certain of a figure we say so.",
      rows: [
        { label: "Registered name", key: "legalName" },
        { label: "Works", key: "address" },
        { label: "Telephone", key: "phone" },
        { label: "Email", key: "email" },
        { label: "WeChat", key: "wechat" },
        { label: "1688 storefront", key: "alibaba1688" },
      ],
      note:
        "The rows showing a dash have no published number yet. Rather than print a line that does not answer, we leave it blank — reach us through the 1688 storefront in the meantime.",
    },
    footer: {
      products: "Products",
      about: "About",
      shop: "Online store",
      shopLink: "1688 storefront ↗",
      contact: "Contact",
      allCategories: "All families →",
      icp: "This site is hosted outside mainland China and carries no ICP filing.",
    },
  },
};
