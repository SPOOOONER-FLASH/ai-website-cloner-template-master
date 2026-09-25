import type { MarketCopy } from "./types.ts";

/**
 * THE ENGLISH SOURCE. Never rendered — English readers get the full site at /.
 *
 * Every market locale (src/data/market/<code>.ts) is written from this, not from Spanish
 * or Portuguese (see src/lib/localised.ts for why a translation of a translation inherits
 * every judgement call of the middle language, including the wrong ones). The facts in it
 * are the site's facts: 1998, ISO 9001 since 2002, Xiaolan, the three certificate records
 * in src/data/company.ts, the FAQ answers in content/faq.json. A translation may reorder,
 * shorten or rephrase for its own reader; it may not add a claim that is not here.
 *
 * Voice: a factory engineer who says the numbers plainly. Short sentences. No "solutions",
 * no "high quality", no "in today's market". Metric first. Missing data is said to be
 * missing and how to get it, not "contact us for details".
 */
export const sourceEn: Omit<MarketCopy, "locale"> = {
  nav: {
    home: "Home",
    products: "Products",
    company: "Company",
    services: "OEM services",
    certifications: "Certifications",
    faq: "FAQ",
    contact: "Contact",
    englishCatalog: "English catalog",
    ariaMain: "Main navigation",
    languages: "Languages",
    skipToContent: "Skip to content",
  },

  footer: {
    factoryLine: "Factory: Xiaolan, Zhongshan, Guangdong, China",
    englishSiteNote:
      "The full catalog of more than 500 models, the technical articles and the download center are published in English.",
    englishSiteLink: "Open the English site",
    writeToUs: "Write to us",
    technicalMail: "Drawings, specifications and test reports",
    ordersMail: "Orders, pricing and samples",
    brandMail: "OEM, private label and everything else",
  },

  common: {
    home: "Home",
    modelsCount: "{n} models",
    openCategory: "Open the category",
    catalogInEnglish: "Catalog pages are in English.",
    contactCta: "Contact the export team",
    tagline: "Made in Xiaolan. Since 1998.",
  },

  meta: {
    "/": {
      title: "Panic Exit Devices, Locks and Door Hardware Factory",
      description:
        "Canton Hyland makes panic exit devices, mortise lock cases, lever handles, cylinders and hinges in Xiaolan, China, since 1998. ISO 9001 since 2002. OEM and private label for export.",
    },
    "/products": {
      title: "Door Hardware Catalog: 17 Product Families",
      description:
        "Panic exit devices, lock cases, cylinders, lever handles, hinges, door closers and glass door fittings. Over 500 verified models, made in our own factory in Zhongshan.",
    },
    "/company": {
      title: "Door Hardware Manufacturer in Xiaolan, China, Since 1998",
      description:
        "Canton Hyland Hardware (Group) Co., Ltd.: founded 1998 in Xiaolan, Zhongshan. Own stamping, polishing and assembly. ISO 9001 since 2002. Exporting to Europe, the Americas, Turkey, Russia and Southeast Asia.",
    },
    "/services": {
      title: "OEM and Private-Label Door Hardware Manufacturing",
      description:
        "New tooling to your drawing or sample, patent-conscious redesign, your brand on the part and the packaging. Samples before production, and the sample cost credited against your first order.",
    },
    "/certifications": {
      title: "Certificates and Test Reports, by Model",
      description:
        "EN 1125 test report and CE conformity for panic exit devices, and a tubular lock durability report. Each record names the exact model it covers; full reports are sent on request.",
    },
    "/faq": {
      title: "Ordering, Samples, Lead Times and Certification",
      description:
        "Minimum order quantities, lead times from 30 days, sample terms, payment by T/T or L/C, Incoterms, OEM production, master key systems and test reports. Answers from the export team.",
    },
    "/contact": {
      title: "Contact the Door Hardware Factory in Zhongshan",
      description:
        "Write to an export engineer about a model, a sample, an OEM part or a project quotation. Three mailboxes, the factory address in Zhongshan and our representatives in Germany and the United States.",
    },
  },

  home: {
    kicker: "Canton Hyland · HYDE",
    h1Line1: "Panic exit devices, locks and door hardware",
    h1Line2: "Made in Xiaolan. Since 1998.",
    intro: [
      "Nobody praises door hardware on a good day, and that is the job. A lever should feel the same on its last turn as on its first. A lock case should hold its line for years. And on the one day a corridor fills with smoke, a push bar should open the door at the first touch, for whoever reaches it first.",
      "We have made that hardware since 1998 in Xiaolan, the Zhongshan town that ships close to a third of China's lock exports. We stamp, polish, assemble and inspect our own parts, and our quality system has been certified to ISO 9001 since 2002. Our hardware is on doors across Europe, Russia, North and South America, Turkey and Southeast Asia.",
      "Much of what we make leaves under our customers' brands, and that is the work we are best at. Bring us a drawing or a sample and we will tool it. If a design runs into someone else's patent, our engineers rework the parts or the look until it no longer does.",
    ],
    factsHeading: "The factory in numbers",
    facts: {
      models: "verified product records",
      families: "product families",
      founded: "manufacturing since",
      quality: "quality system",
      workforce: "people on site",
    },
    categoriesHeading: "What we make",
    categoriesIntro:
      "Seventeen product families, all from one factory, so finishes match across a whole door schedule. Each family opens the English catalog with every model, its dimensions and its finishes.",
    whyHeading: "Why buyers come back",
    why: [
      {
        title: "Our own tooling",
        body: "Stamping, polishing, assembly and inspection are done in our plant. A change of lever profile, rose, plate or finish is a normal request here, not a special project.",
      },
      {
        title: "Numbers, not adjectives",
        body: "Backset, center distance, door thickness and bolt throw are written on every product page in millimeters. Where a figure has not been verified against current tooling, the page says so instead of guessing.",
      },
      {
        title: "Your name on the part",
        body: "Your logo on the hardware, your labels, instructions in your market's language and cartons to your specification. Samples are approved before the first production piece is made.",
      },
      {
        title: "Test reports by model",
        body: "We hold EN 1125 and durability test reports for named models and send the complete report on request. A report for one model is never presented as approval for another.",
      },
    ],
    flagshipHeading: "Start with the ranges we know best",
    flagship: [
      {
        slug: "panic-exit-devices",
        title: "Panic exit devices",
        body: "Push bars, outside trims and lock cases for escape and fire doors, specified as a set: single-point rim devices to multi-point sets for double doors.",
      },
      {
        slug: "lock-cases",
        title: "Mortise lock cases",
        body: "Lock cases by backset, center distance and bolt, written down to the millimeter so the lever, cylinder and strike you order around them fit the first time.",
      },
      {
        slug: "lock-cylinders",
        title: "Cylinders and master key systems",
        body: "Profile and keyed cylinders, with master key and construction key systems planned per building from the door schedule, before the first cylinder is cut.",
      },
    ],
    faqHeading: "Before you write",
    faqIntro: "The four questions every first inquiry asks, answered by the export team.",
    faqMore: "All questions and answers",
    ctaHeading: "Send us a model number, a drawing or a door schedule.",
    ctaBody:
      "An engineer reads it, not a queue. Tell us the door type, the finish, the standard, the quantity and the destination market, and the first reply can already be a useful one.",
    ctaButton: "Contact the export team",
    ctaSecondary: "Browse the English catalog",
  },

  categories: {
    "panic-exit-devices": {
      name: "Panic exit devices",
      summary: "Push bars and touch bars for escape routes, including fire-door, alarmed, double-door and vertical-rod sets, with matching outside trims.",
    },
    "night-latches-rim-locks": {
      name: "Night latches and rim locks",
      summary: "Surface-mounted night latches and rim locks, most with a 60 mm backset, fitted through a single cylinder hole.",
    },
    "stainless-steel-handles": {
      name: "Stainless steel handles",
      summary: "Stainless steel lever handles on roses and plates, including the 9000 series for doors of 35 to 50 mm.",
    },
    "lever-handles": {
      name: "Lever handles",
      summary: "Tubular lever handle sets, mostly zinc alloy, for entrance, privacy and passage doors, with matching latches and strikes.",
    },
    "knob-locks": {
      name: "Knob locks",
      summary: "Cylindrical and tubular knob locks for entry, privacy, passage and communication functions.",
    },
    "bathroom-accessories": {
      name: "Bathroom accessories",
      summary: "Bathroom accessories, most of them in stainless steel, finished to match the door hardware.",
    },
    "care-grab-bars": {
      name: "Care grab bars",
      summary: "Grab bars for accessible WCs and bathrooms: flip-up, fixed and L-shaped.",
    },
    "brass-steel-hinges": {
      name: "Brass and steel door hinges",
      summary: "Brass, stainless steel and steel hinge ranges for architectural door applications, with ball-bearing and plain-bearing knuckles.",
    },
    deadbolts: {
      name: "Deadbolts",
      summary: "Single- and double-cylinder deadbolts with a 25 mm throw, an anti-saw roller insert and a 60 or 70 mm backset.",
    },
    "door-closers": {
      name: "Door closers",
      summary: "Door closers with aluminum bodies for commercial doors, plus a floor hinge for timber doors.",
    },
    "grip-handle-sets": {
      name: "Grip handle sets",
      summary: "Grip, pull and concealed handle sets for entrance and sliding doors.",
    },
    "glass-door-accessories": {
      name: "Glass door fittings",
      summary: "Patch fittings and pull handles for frameless glass-door assemblies.",
    },
    "hardware-accessories": {
      name: "Hardware accessories",
      summary: "Door viewers, stoppers, transfer devices, bolts, indicators, latches and guards.",
    },
    "lock-cases": {
      name: "Lock cases",
      summary: "Mortise lock cases in multiple backset, center-distance and bolt configurations, for timber and metal doors.",
    },
    "lock-cylinders": {
      name: "Lock cylinders",
      summary: "Profile and keyed cylinders, including master key and construction key systems.",
    },
    "sliding-hook-locks": {
      name: "Sliding hook locks",
      summary: "Hook-lock hardware for sliding doors and narrow-stile applications.",
    },
    "floor-springs-and-pivots": {
      name: "Floor springs and door pivots",
      summary: "Floor springs, top pivots, overhead closers and hydraulic hinges for pivot-hung timber, metal and glass doors.",
    },
  },

  products: {
    kicker: "Catalog",
    h1: "Seventeen product families. One factory.",
    intro:
      "Every model below is made in our own plant in Xiaolan, so a lever, a lock case and a cylinder ordered together arrive in one finish and fit one door preparation. The counts are taken from the catalog at each build, not typed in.",
    englishNote:
      "The product pages themselves, with dimensions, finishes, drawings and photographs, are published in English. Model numbers and dimensions read the same in any language.",
    englishCta: "Open the full English catalog",
    finderCta: "Search by material, door type or standard",
    categoriesHeading: "Product families",
    helpHeading: "Not sure which family you need?",
    helpBody:
      "Send us the door type, the standard it must meet and a photograph or drawing of the opening. An export engineer will name the models that fit and say which figures still need to be confirmed on site.",
  },

  company: {
    kicker: "Company",
    h1: "A lock factory in the town that makes China's locks.",
    paragraphs: [
      "Canton Hyland Hardware (Group) Co., Ltd. was founded in 1998 in Xiaolan, Zhongshan, the town that ships close to a third of China's lock exports. We stamp, polish, assemble and inspect our own parts, and our quality system has been certified to ISO 9001 since 2002.",
      "The range covers most of what a door needs: panic exit devices, cylindrical and tubular locks, deadbolts, mortise lock cases, profile cylinders, levers, glass door fittings, hinges, closers and the small parts that finish the job. Master key and construction key systems are a specialty. They are what a hospital, a school or an office tower asks of a lock supplier, and they are where a supplier's records either hold up or do not.",
      "Much of what we make leaves Xiaolan under our customers' brands. Bring us a drawing or a sample and we tool it. If a design runs into another maker's patent, our engineers change the parts or the appearance until it no longer does. We ship to brands and distributors in Europe, Russia, the Americas, Turkey and Southeast Asia. We exhibited at the Cologne hardware fair for years, and our Spanish-speaking team has exhibited in Lima and Buenos Aires.",
      "The best way to judge a factory is to stand in it. Buyers who want to see the floor before the first container are welcome in Zhongshan, and those who cannot travel can start with a sample.",
    ],
    statsHeading: "Facts and figures",
    stats: [
      { label: "Founded", value: "1998" },
      { label: "Workforce", value: "101–200 people" },
      { label: "Facility area", value: "3,000–5,000 m²" },
      { label: "Annual output value", value: "US$50–100 million" },
      { label: "Quality system", value: "ISO 9001 since 2002" },
      { label: "Business type", value: "Manufacturer" },
      { label: "Location", value: "Zhongshan, Guangdong, China" },
    ],
    marketsHeading: "Where our hardware goes",
    marketsBody:
      "Brands and distributors in Europe, Russia, North and South America, Turkey and Southeast Asia buy our panic exit devices, lock cases, lever sets and cylinders, and much of it is sold under their own names. We have an office in Germany for buyers who want to meet in Europe, and a contact point in the United States.",
    visitHeading: "Come and see the floor",
    visitBody:
      "Factory visits and third-party inspection are welcome. Tell us when you plan to be in Guangdong and we will arrange the day around the lines you want to see.",
    visitCta: "Arrange a visit",
  },

  services: {
    kicker: "OEM and private label",
    h1: "Bring us a drawing. Leave with a product.",
    intro:
      "Much of what we make leaves Xiaolan under our customers' brands, and it is the work we are best at. We tool new parts to your drawing or sample, rework a design that runs into someone else's patent, and put your name, your instructions and your packaging on the result. Since 1998, for brands and distributors across Europe, the Americas, Turkey and Southeast Asia.",
    briefKicker: "To quote a new part",
    briefHeading: "We need four things from you",
    briefItems: [
      "A drawing, sample or reference photograph",
      "Where you will sell it, and the standard it must meet",
      "Your expected annual quantity",
      "Your branding: logo, labels, instruction language, packaging",
    ],
    listHeading: "What we do for a private-label brand",
    services: [
      {
        number: "01",
        title: "New tooling to your design",
        body: "Send a drawing, a sample or a reference model. Our engineers work out the part, we cut the tooling, and you approve samples before a single production piece is made. Tooling cost and the minimum run are quoted per part; on our standard models, most minimums fall between 300 and 5,000 pieces.",
        outcome: "Send the drawing or sample, the target market and your expected annual quantity.",
      },
      {
        number: "02",
        title: "A design you are free to put your name on",
        body: "If the product you want is covered by another maker's patent, our engineers rework the internal parts or the appearance until it no longer conflicts with that patent, and we tell you exactly which features changed so your own patent check has something specific to review.",
        outcome: "Tell us which product it resembles and where you will sell it.",
      },
      {
        number: "03",
        title: "Your brand, on every layer",
        body: "Your logo on the part, your labels, installation instructions in your market's language, and cartons and barcodes to your specification. The hardware arrives ready to sell as yours.",
        outcome: "Send your logo files, label text and the languages you need.",
      },
      {
        number: "04",
        title: "Samples that decide the order",
        body: "Samples of the exact model, function and finish you will order, so the sample you approve is the product that ships, container after container. Samples are charged and the cost is credited against your first production order; a stocked model usually ships within days.",
        outcome: "Include the destination, the quantity and what the sample has to prove.",
      },
      {
        number: "05",
        title: "Drawings, datasheets and test reports",
        body: "Drawings, datasheets and installation instructions by model. A test report is only useful if it names the model you are buying and says whose name it was issued in, so that is how we answer every request for one.",
        outcome: "Ask by model number and tell us what the document is for.",
      },
      {
        number: "06",
        title: "Export, from Xiaolan to your port",
        body: "Quotation, packing and shipping arranged around your Incoterm and destination. Our team works in English and Spanish, and we have an office in Germany for buyers who want to meet in Europe.",
        outcome: "Share the Incoterm and destination port when you know them.",
      },
    ],
    docsHeading: "Documents already available",
    docsBody:
      "Catalogs, drawings and technical files for our standard range are ready to download from the English site. For a part we develop with you, the drawings are yours as well.",
    docsCta: "Open the download center",
    cta: "Send your drawing or sample",
  },

  certifications: {
    kicker: "Quality evidence",
    h1: "Certificates and test reports. What is tested, and in whose name.",
    intro:
      "The records below are listed with the exact model scope printed on each document, and a report for one model is never presented as approval for another. Much of what we make for private-label customers is certified in our customers' own names, at their request and their cost, so those certificates are theirs to share. CE and ANSI testing in Canton Hyland's own name is being prepared for our core ranges; each new report will appear here, with its scope, as it is issued.",
    note: "The issuers restrict how their reports may be copied, so we send a complete copy on request, for a named model, rather than publishing extracts.",
    recordLabel: "Verified record",
    detailsLine: "The details are public. The full report is sent on request, complete, as the issuer requires.",
    fields: {
      coversModel: "Exact model scope",
      issuer: "Issuer",
      reference: "Document reference",
      issued: "Issue date",
    },
    records: [
      {
        title: "EN 1125: panic exit devices operated by a horizontal bar",
        issuer: "Intertek Testing Services Shenzhen Ltd., Guangzhou Branch",
        reference: "130722068GZU-001",
        issued: "7 November 2013",
        coversModel: "KD070/30-290",
      },
      {
        title: "Tubular door lock durability test",
        issuer: "Intertek Testing Services Shenzhen Ltd., Guangzhou Branch",
        reference: "140306043GZU-001",
        issued: "28 April 2014",
        coversModel: "607 SS ET",
      },
      {
        title: "CE certificate of conformity, EN 1125:2008",
        issuer: "CELAB, Italy",
        reference: "See certificate",
        issued: "2010",
        coversModel: "Panic exit device series",
      },
    ],
    closingHeading: "Check the report before you specify the part.",
    closingBody:
      "Send the standard you need, the model number and the destination market. We will tell you whether a report names that exact model before we send it, and say so if none does.",
    cta: "Request technical documents",
  },

  faq: {
    kicker: "Service",
    h1: "Frequently asked questions",
    intro: "If the answer you need is not here, ask us directly. We would rather reply than have you guess.",
    askCta: "Ask a question",
    groups: [
      {
        title: "Ordering and samples",
        items: [
          {
            question: "What is your minimum order quantity?",
            answer: "It depends on the model, the finish and whether the order is stock or made to your specification. Most models fall between 300 and 5,000 pieces. Some items already listed on our Alibaba storefront carry a lower published minimum. Send the models you need and the quantities you have in mind, and the export team will confirm the minimum for that exact line before you commit to anything.",
          },
          {
            question: "What are your lead times?",
            answer: "Production lead time starts at 30 days from order confirmation. The exact date depends on the models, the quantity and the finishes on the order. Tell our export team what you need and they will confirm a date before you pay a deposit.",
          },
          {
            question: "Can I order samples before placing a production order?",
            answer: "Yes, and samples are normally charged. We quote the sample price with the freight for your address, and the sample cost is credited against your first production order, so if the sample leads to business it costs you nothing in the end. For a model already in stock a sample usually ships within days; a sample in a finish we do not hold takes as long as a short production run.",
          },
          {
            question: "What payment terms do you accept?",
            answer: "The instruments the trade uses: T/T with a deposit and the balance against shipping documents or before dispatch, and irrevocable L/C at sight for larger orders. The split moves with the order value, the production time, the materials and finishes, and how the goods ship to your country. We quote on the trade term you prefer, EXW at our factory, FOB at the port or DDP delivered, and the term you choose changes both the price and where your responsibility begins. The terms go in writing on the proforma before you commit to anything.",
          },
          {
            question: "How is shipping quoted, and can you ship duty paid?",
            answer: "Freight is quoted per shipment, because it depends on the destination, the weight and volume of the order and whether it goes by air or by sea. Air for samples and urgent replenishment, sea freight for full production orders. Duty-paid (DDP) shipping is available on many lanes, including the United States and much of Europe; elsewhere the default is DAP, with duties and clearance in your name. Tell the export team the destination city and the quantity and they will quote the modes side by side.",
          },
          {
            question: "What happens if something arrives wrong or damaged?",
            answer: "For an order placed through our Alibaba storefront, Alibaba's own buyer protection applies and the return, the evidence and the refund are handled there. For an order placed directly with us, the remedy is agreed in writing on the proforma before you pay, because a container of door hardware is not a parcel: what is reasonable for a wrong finish on 200 pieces is not what is reasonable for a wrong backset on 5,000. Photograph the goods and the carton markings before anything is moved and send them with the order number. A claim with the packing photographs is settled in days.",
          },
        ],
      },
      {
        title: "Products and specification",
        items: [
          {
            question: "Do you provide dimensional drawings?",
            answer: "Dimensional drawings are available for most products on request. Send the model number and we will reply with what we hold for it. Where a drawing is not yet published on the site, it is because we have not verified it against the current production tooling, not because it does not exist.",
          },
          {
            question: "Can you supply master key and construction key systems?",
            answer: "Yes. Master key and construction key systems are a long-standing specialty. They are planned per project rather than ordered from a catalog, so start with the door schedule and we will work back from it.",
          },
          {
            question: "Which finishes are available?",
            answer: "Available finishes are listed on each product page in the English catalog. Where a product page shows no finishes, that information has not yet been verified for that model and we would rather leave it blank than guess.",
          },
          {
            question: "Can you produce to our own design or branding (OEM / ODM)?",
            answer: "Yes. This is a large part of what the factory does. We manufacture under our customers' own brands and to their drawings: your logo on the product and on the packaging, your finish, your packing and your carton markings. If a mould exists for the form you want, we can produce it; if it does not, we tool one. If the design is protected by another maker's patent, our engineers change the internal parts or the appearance until it no longer conflicts, and tell you exactly what changed. Tooling cost, sampling time and the minimum that makes a custom run worthwhile depend on the part, so they are quoted per project.",
          },
        ],
      },
      {
        title: "Standards and certification",
        items: [
          {
            question: "Is Canton Hyland ISO 9001 certified?",
            answer: "Yes. The company has held ISO 9001 certification since 2002.",
          },
          {
            question: "Are your panic exit devices EN 1125 certified?",
            answer: "Test reports exist for specific models rather than for the range as a whole, and we do not extend a report from one model to a sibling product. The reports may only be passed on in full, so we send them on request against a named model rather than publishing extracts. Tell us the model you intend to specify and we will send the report that covers it, or say plainly that there is not one. Much of what we make is tested in our customers' names, at their cost; testing in our own name is being prepared.",
          },
          {
            question: "Can you supply test reports and certificates for a tender?",
            answer: "Yes. Tell us the models on the schedule and we will send the reports that name them, with their issue dates and scope.",
          },
        ],
      },
      {
        title: "The company",
        items: [
          {
            question: "Where are your products manufactured?",
            answer: "In Zhongshan, Guangdong, China. Canton Hyland Hardware (Group) Co., Ltd. was founded in 1998 in Xiaolan, the Zhongshan town that ships close to a third of China's lock exports, and has made commercial and residential door hardware there ever since.",
          },
          {
            question: "Do you export worldwide?",
            answer: "Yes. Brands and distributors in Europe, Russia, North and South America, Turkey and Southeast Asia buy our panic exit devices, lock cases, lever sets and cylinders, and much of it is sold under their own names. Tell us the destination country and the export team will confirm the documentation and shipping for it.",
          },
          {
            question: "Can I write to you in my own language?",
            answer: "Yes. Our export team works in English and Spanish, and reads inquiries in other languages with translation tools. Model numbers, dimensions and standards read the same in every language, so an inquiry that names them is answered accurately whatever language it is written in.",
          },
        ],
      },
    ],
  },

  contact: {
    h1: "Contact the factory. Talk to the people who make it.",
    intro:
      "Write to the export team about a model, a sample, an OEM part or a project quotation. An engineer reads it.",
    hint: "Tell us the door type, the finish, the standard, the quantity and the destination market, and our first reply can already be a useful one.",
    mailboxesHeading: "Email us directly",
    mailboxesIntro:
      "Email is the fastest route to a quotation. Pick the mailbox that matches your question and it reaches the right desk first time.",
    mailboxes: {
      technical: "Drawings, specifications and test reports",
      orders: "Orders, pricing and samples",
      brand: "OEM, private label and everything else",
    },
    languageNote:
      "You can write in your own language. The team works in English and Spanish and reads other languages with translation tools; model numbers, dimensions and standards need no translation.",
    formHeading: "Prefer a form?",
    formBody: "The inquiry form on the English site sends the same message to the same desk, with fields for the model, the quantity and the destination.",
    formCta: "Open the inquiry form",
    factoryHeading: "The factory",
    factoryBody:
      "No. 76 Haiwei Road, Xiaolan Town, Zhongshan, Guangdong, China. Where everything is made. Factory visits and third-party inspection are welcome.",
    representativesHeading: "Representatives",
    representatives: [
      {
        region: "United States",
        cities: "Los Angeles, California · Arlington, Virginia",
        note: "Account manager for North America. Call or email for pricing, samples and shipping to US destinations.",
      },
      {
        region: "Germany",
        cities: "Cologne · Remagen",
        note: "Where we exhibit in Germany. Meetings can be arranged around the Cologne fair calendar.",
      },
    ],
    alibabaHeading: "Or order through Alibaba",
    alibabaBody:
      "Our verified storefront carries the same catalog and is often the faster route if you already buy through Alibaba: trade assurance, messaging and payment are handled there. For project schedules, custom finishes or master key systems, email is better, because those need a technical conversation first.",
    alibabaCta: "Open the Alibaba storefront",
  },
};
