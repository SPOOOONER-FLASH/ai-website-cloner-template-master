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
 * translated: 「未经确认的参数以短横线标注，不以估值填充」 becomes "Unconfirmed dimensions
 * are shown as a dash rather than an estimate", which is the same commitment in the register
 * an English buyer reads, not a word-for-word rendering of a Chinese sentence.
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
    modelsSuffix: string;
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
      productsIntro: "按品类进入，每个型号都有独立的规格表：材质、背距、门厚、面板尺寸、表面处理。",
      capabilityEyebrow: "Capability",
      capabilityTitle: "加工方式",
      capabilityMore: "了解定制流程",
      factoryEyebrow: "Factory",
      factoryTitle: "车间实拍",
      factoryIntro: "以下照片全部来自小榄厂区，未做合成，也没有借用他人的展位或展厅。",
      factoryMore: "走进雷茵",
      askTitle: "需要图纸、尺寸或报价？",
      askBody: "告诉我们型号或用途，我们回复具体规格与包装数据。没有把握的参数我们会说不知道，不会先给一个数字。",
      askCta: "联系我们",
    },
    facts: { categories: "在售品类", models: "在售型号", experience: "锁具制造经验", unitItem: "个", unitSince: "年起" },
    products: {
      title: "产品中心",
      eyebrow: "Products",
      intro: (c, m) => `${c} 个品类，${m} 个在售型号。每个型号页都有独立规格表，尺寸以实物为准。`,
      modelsSuffix: "models",
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
      body: [],
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
      rules: [],
      cta: "索取证书原件或检测报告",
    },
    oem: {
      eyebrow: "OEM / ODM",
      title: "合作与定制",
      intro: "来图加工、来样加工与贴牌生产。下面是一般流程；具体周期和费用按件报，不给通用数字。",
      processTitle: "一般流程",
      steps: [],
      enquiryTitle: "发询价时带上这几项，回复会快很多",
      enquiryItems: [],
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
        "Every model has its own specification table — material, backset, door thickness, plate size and finish.",
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
      modelsSuffix: "models",
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
      body: [],
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
      rules: [],
      cta: "Request a certificate or test report",
    },
    oem: {
      eyebrow: "OEM / ODM",
      title: "Custom manufacturing",
      intro:
        "Made to your drawing, made to your sample, and badged to your brand. The sequence below is the usual one; lead time and tooling cost are quoted per part, not from a table.",
      processTitle: "How it runs",
      steps: [],
      enquiryTitle: "Send these with your enquiry and the answer comes back faster",
      enquiryItems: [],
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
