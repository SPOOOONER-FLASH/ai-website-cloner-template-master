import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "./Chrome";
import { Gallery } from "./Gallery";
import { ArrowLink, Button, FactStrip, NoPhoto, Photo, ProductCard, SectionHead, Shell, SpecTable } from "./primitives";
import {
  absoluteUrl,
  categoriesFor,
  getCategoryFor,
  getProduct,
  getRelatedProducts,
  getStyleFamily,
  isLeverHandle,
  legalName,
  localePath,
  products,
  rayen,
  siteFacts,
  viewProduct,
} from "@/data/rayen";
import { STRINGS, type RayenLocale } from "@/data/rayen-i18n";

/**
 * Every RAYEN page body, in either language.
 *
 * The route files under src/app/zh/** and src/app/zh-en/** are thin: they set the metadata
 * and render one of these with a locale. The layout lives here once.
 *
 * WHY NOT TWO SETS OF PAGES
 * Because the second set is the one that goes stale. The English site is the same site in
 * another language, not another site — the only things that legitimately differ are the
 * strings (src/data/rayen-i18n.ts) and which side of the product record is read
 * (viewProduct). Everything structural is shared, so a change to the product page happens
 * once and lands in both.
 */

const t = (locale: RayenLocale) => STRINGS[locale];

/** The number strip, with its labels in the right language. */
function factsFor(locale: RayenLocale) {
  const s = t(locale).facts;
  const [categories, models, since] = siteFacts;
  return [
    { value: categories.value, unit: s.unitItem, label: s.categories },
    { value: models.value, unit: s.unitItem, label: s.models },
    { value: since.value, unit: s.unitSince, label: s.experience },
  ];
}

function capabilitiesFor(locale: RayenLocale) {
  return rayen.capabilities.map((c) => ({
    label: locale === "zh" ? c.label : (c.labelEn ?? c.label),
    detail: locale === "zh" ? c.detail : (c.detailEn ?? c.detail),
  }));
}

/* ------------------------------------------------------------------- home */

export function HomeBody({ locale }: { locale: RayenLocale }) {
  const s = t(locale).home;
  const categories = categoriesFor(locale);
  const positioning = locale === "zh" ? rayen.brand.positioning : rayen.brand.positioningEn;

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="flex-grow">
        {/* 1 — hero */}
        <section className="relative">
          <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-[var(--color-surface-dark)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
            <img
              src="/images/rayen/hero-brass-handles.webp"
              alt={locale === "zh" ? "青铜色门扇上的一对黄铜大拉手" : "A pair of brass pull handles on a patinated bronze door"}
              className="h-full w-full object-cover opacity-90"
              fetchPriority="high"
            />
            {/*
              遮罩比原来轻。原图是冲床车间，本身灰绿、细节杂，要压暗才压得住白字；
              这张是暖棕青铜门加黄铜拉手，压狠了整块发脏，铜的光泽正是它好看的地方。
              只在下半部加渐变，正好盖住文字区，上半部让铜色露出来。
            */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end pb-12 md:pb-20">
              <Shell>
                <p className="latin text-[12px] tracking-[0.3em] text-white/70">{s.eyebrowLocation}</p>
                <h1 className="mt-4 max-w-[20ch] text-[30px] leading-tight text-white md:text-[46px]">{s.title}</h1>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-white/85 md:text-[17px]">{positioning}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={localePath(locale, "/products/")}>{s.ctaProducts}</Button>
                  <a href={localePath(locale, "/oem/")} className="btn border-white/70 text-white hover:bg-white hover:text-black">
                    {s.ctaOem}
                  </a>
                </div>
              </Shell>
            </div>
          </div>
        </section>

        {/* 2 — the three checkable numbers */}
        <section>
          <Shell>
            <FactStrip facts={factsFor(locale)} />
          </Shell>
        </section>

        {/* 3 — what we make */}
        <section className="py-16 md:py-24">
          <Shell>
            <SectionHead eyebrow={s.productsEyebrow} title={s.productsTitle} intro={s.productsIntro} />
            <div className="mt-10 grid grid-cols-2 gap-px bg-[var(--color-line)] md:mt-14 md:grid-cols-3 lg:grid-cols-5">
              {categories.map((category) => (
                <a
                  key={category.slug}
                  href={localePath(locale, `/products/${category.slug}/`)}
                  className="group bg-white p-4 transition-colors hover:bg-[var(--color-surface-alt)]"
                >
                  {category.image?.src ? (
                    <Photo src={category.image.src} alt={category.name} aspect="1 / 1" />
                  ) : (
                    <div className="aspect-square bg-[var(--color-surface-alt)]" />
                  )}
                  <p className="mt-3 text-[15px]">{category.name}</p>
                  <p className="latin mt-1 text-[12px] text-[var(--color-ink-3)]">
                    {products.filter((p) => p.categoryPath[0] === category.slug).length} {t(locale).products.modelsSuffix}
                  </p>
                </a>
              ))}
            </div>
          </Shell>
        </section>

        {/* 4 — how you can order */}
        <section className="border-y border-[var(--color-line)] bg-[var(--color-surface-alt)] py-16 md:py-20">
          <Shell>
            <SectionHead eyebrow={s.capabilityEyebrow} title={s.capabilityTitle} align="left" />
            <div className="mt-8 grid gap-px bg-[var(--color-line)] md:grid-cols-3">
              {capabilitiesFor(locale).map((capability) => (
                <div key={capability.label} className="bg-white p-6 md:p-8">
                  <p className="text-[18px]">{capability.label}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{capability.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ArrowLink href={localePath(locale, "/oem/")}>{s.capabilityMore}</ArrowLink>
            </div>
          </Shell>
        </section>

        {/* 5 — the floor */}
        <section className="py-16 md:py-24">
          <Shell>
            <SectionHead eyebrow={s.factoryEyebrow} title={s.factoryTitle} intro={s.factoryIntro} />
            <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
              <Photo src="/images/rayen/factory-press-console.webp" alt={locale === "zh" ? "冲压车间，操作员在数控面板前作业" : "Press shop, operator at the control panel"} aspect="4 / 3" />
              <Photo src="/images/rayen/factory-stamping.webp" alt={locale === "zh" ? "冲压机与操作员" : "Press and operator"} aspect="4 / 3" />
              <Photo src="/images/rayen/factory-assembly-bench.webp" alt={locale === "zh" ? "装配工位，员工在分装零件" : "Assembly bench, sorting components"} aspect="4 / 3" />
            </div>
            <div className="mt-8">
              <ArrowLink href={localePath(locale, "/company/")}>{s.factoryMore}</ArrowLink>
            </div>
          </Shell>
        </section>

        {/* 6 — ask */}
        <section className="bg-[var(--color-surface-dark)] py-16 text-white md:py-20">
          <Shell className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-[24px] md:text-[30px]">{s.askTitle}</h2>
              <p className="mt-3 max-w-[52ch] text-[15px] text-white/75">{s.askBody}</p>
            </div>
            <a
              href={localePath(locale, "/contact/")}
              className="btn border-white bg-white text-black hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
            >
              {s.askCta}
            </a>
          </Shell>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

/* --------------------------------------------------------- products index */

export function ProductsIndexBody({ locale }: { locale: RayenLocale }) {
  const s = t(locale).products;
  const categories = categoriesFor(locale);

  return (
    <>
      <SiteHeader current="/products/" locale={locale} />
      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead
            eyebrow={s.eyebrow}
            title={s.title}
            intro={s.intro(categories.length, products.length)}
            align="left"
          />
          <div className="mt-10 grid gap-px bg-[var(--color-line)] md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = products.filter((p) => p.categoryPath[0] === category.slug).length;
              return (
                <a
                  key={category.slug}
                  href={localePath(locale, `/products/${category.slug}/`)}
                  className="group flex gap-5 bg-white p-5 transition-colors hover:bg-[var(--color-surface-alt)] md:p-6"
                >
                  <div className="w-28 shrink-0 md:w-32">
                    {category.image?.src ? (
                      <Photo src={category.image.src} alt={category.name} aspect="1 / 1" />
                    ) : (
                      <div className="aspect-square bg-[var(--color-surface-alt)]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[17px]">{category.name}</p>
                    <p className="latin mt-1 text-[12px] text-[var(--color-ink-3)]">
                      {count} {s.modelsSuffix}
                    </p>
                    {category.children.length ? (
                      <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-2)]">
                        {category.children.map((child) => child.name).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        </Shell>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

/* --------------------------------------------------------------- category */

export function CategoryBody({ locale, categorySlug }: { locale: RayenLocale; categorySlug: string }) {
  const s = t(locale).products;
  const category = getCategoryFor(categorySlug, locale);
  if (!category) notFound();

  const items = products
    .filter((product) => product.categoryPath[0] === categorySlug)
    .sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }))
    .map((product) => viewProduct(product, locale));

  return (
    <>
      <SiteHeader current="/products/" locale={locale} />
      <main className="flex-grow">
        <Shell className="py-12 md:py-16">
          <nav aria-label="breadcrumb" className="text-[13px] text-[var(--color-ink-3)]">
            <a href={localePath(locale, "/products/")} className="hover:text-[var(--color-ink)]">
              {s.breadcrumbRoot}
            </a>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-ink)]">{category.name}</span>
          </nav>

          <div className="mt-6">
            <SectionHead
              eyebrow={category.slug.replace(/-/g, " ")}
              title={category.name}
              intro={s.categoryIntro(items.length)}
              align="left"
            />
          </div>

          {category.children.length ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {category.children.map((child) => (
                <li key={child.slug} className="border border-[var(--color-line)] px-3 py-1 text-[13px] text-[var(--color-ink-2)]">
                  {child.name}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} noPhotoLabel={s.noPhoto} />
            ))}
          </div>
        </Shell>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

/* ---------------------------------------------------------------- product */

export function ProductBody({
  locale,
  categorySlug,
  slug,
}: {
  locale: RayenLocale;
  categorySlug: string;
  slug: string;
}) {
  const s = t(locale).products;
  const record = getProduct(slug);
  if (!record) notFound();
  const product = viewProduct(record, locale);

  /*
    1688 店铺入口，学的是 HYDE 站上的阿里巴巴做法：站本身不成交，成交在店铺和邮件里，
    所以每个型号页都要有一条通向店铺的路，而不是只在联系页放一个链接。
    带上型号做搜索词，买家落地看到的是这一款，而不是店铺首页再自己翻。
  */
  const shop = rayen.contact.alibaba1688;
  const shopUrl = shop
    ? `${shop.replace(/\/+$/, "")}/page/offerlist.htm?searchKeywords=${encodeURIComponent(product.model)}`
    : "";

  const category = getCategoryFor(categorySlug, locale);
  const related = getRelatedProducts(record).map((p) => viewProduct(p, locale));
  const family = getStyleFamily(record);
  const familyLevers = family.filter(isLeverHandle).map((p) => viewProduct(p, locale));
  const familyHandles = family.filter((item) => !isLeverHandle(item)).map((p) => viewProduct(p, locale));

  /*
    主图 + 全部画廊图。顺序上做一件事：把尺寸图提到主图之后的第一位。
    甲方 2026-09-10：「像这样的，顺序排下，第一张放尺寸参数图」。主图没有换成线图——
    类目页的卡片取的是主图，一格一格全是线图的目录看着像图册，不像在售产品。
  */
  const isDrawing = (src: string) => /SZ[a-zA-Z]*W|ZUMEN/i.test(src);
  const rest = product.gallery.filter((image) => Boolean(image?.src));
  const ordered = [...rest].sort((a, b) => Number(isDrawing(b.src)) - Number(isDrawing(a.src)));
  const images = [product.heroImage, ...ordered].filter(
    (image): image is NonNullable<typeof image> => Boolean(image?.src),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.model} ${product.name}`,
    sku: product.model,
    description: product.summary,
    image: images.map((image) => absoluteUrl(image.src)),
    brand: { "@type": "Brand", name: "RAYEN 雷茵" },
    manufacturer: { "@type": "Organization", name: legalName },
    ...(product.material ? { material: product.material } : {}),
    additionalProperty: product.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  };

  return (
    <>
      <SiteHeader current="/products/" locale={locale} />
      <main className="flex-grow">
        <Shell className="py-12 md:py-16">
          <nav aria-label="breadcrumb" className="text-[13px] text-[var(--color-ink-3)]">
            <a href={localePath(locale, "/products/")} className="hover:text-[var(--color-ink)]">
              {s.breadcrumbRoot}
            </a>
            <span className="mx-2">/</span>
            {category ? (
              <>
                <a href={localePath(locale, `/products/${category.slug}/`)} className="hover:text-[var(--color-ink)]">
                  {category.name}
                </a>
                <span className="mx-2">/</span>
              </>
            ) : null}
            <span className="latin text-[var(--color-ink)]">{product.model}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              {images.length ? (
                <Gallery images={images} model={product.model} locale={locale} />
              ) : (
                <NoPhoto model={product.model} label={s.noPhoto} />
              )}
            </div>

            <div>
              <p className="latin text-[13px] tracking-[0.2em] text-[var(--color-ink-3)]">{product.model}</p>
              <h1 className="mt-2 text-[28px] md:text-[34px]">{product.name}</h1>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-2)]">{product.summary}</p>

              {product.finishes.length ? (
                <div className="mt-6">
                  <p className="text-[13px] text-[var(--color-ink-3)]">{s.finishes}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {product.finishes.map((finish) => (
                      <li key={finish} className="border border-[var(--color-line)] px-3 py-1 text-[13px]">
                        {finish}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <h2 className="mt-10 text-[18px]">{s.specs}</h2>
              <div className="mt-4">
                <SpecTable specs={product.specs} emptyLabel={s.noSpecs} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={localePath(locale, "/contact/")}>{s.ctaQuote}</Button>
                <Button href={localePath(locale, "/oem/")} variant="ghost">
                  {s.ctaOem}
                </Button>
                {shopUrl ? (
                  <a href={shopUrl} target="_blank" rel="noopener" className="btn btn-ghost">
                    {s.ctaShop}
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {family.length ? (
            <section className="mt-16 border-t border-[var(--color-line)] pt-10 md:mt-24">
              {/*
                同款式搭配 — the client's own framing, from the note that came with the image
                packs: 「有门把手的表示此款式搭配有同风格的门把手」. It sits ABOVE 同类型号
                because it answers a different and better question. 同类型号 is "what else
                could I buy instead"; this is "what do the other doors behind this one need
                so the job matches" — the one that makes the order bigger, and the one a
                buyer cannot work out by paging through a catalogue.
              */}
              <h2 className="text-[18px]">{s.familyTitle}</h2>
              <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                {familyLevers.length && !isLeverHandle(record)
                  ? s.familyLeverLine(familyLevers.map((l) => l.model).join(locale === "zh" ? "、" : ", "))
                  : s.familyHandleLine}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[...familyLevers, ...familyHandles].map((item) => (
                  <ProductCard key={item.slug} product={item} locale={locale} noPhotoLabel={s.noPhoto} />
                ))}
              </div>
            </section>
          ) : null}

          {related.length ? (
            <section className="mt-16 border-t border-[var(--color-line)] pt-10">
              <h2 className="text-[18px]">{s.relatedTitle}</h2>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((item) => (
                  <ProductCard key={item.slug} product={item} locale={locale} noPhotoLabel={s.noPhoto} />
                ))}
              </div>
            </section>
          ) : null}
        </Shell>
      </main>
      <SiteFooter locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

/* ---------------------------------------------------------------- company */

export function CompanyBody({ locale }: { locale: RayenLocale }) {
  const s = t(locale).company;
  return (
    <>
      <SiteHeader current="/company/" locale={locale} />
      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead eyebrow={s.eyebrow} title={s.title} align="left" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="space-y-5 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
              {s.body.map((paragraph, index) => (
                <p key={paragraph.slice(0, 12)}>
                  {index === 0 ? <span className="text-[var(--color-ink)]">{legalName}</span> : null}
                  {index === 0 ? paragraph : paragraph}
                </p>
              ))}
            </div>
            <div>
              <Photo
                src="/images/rayen/factory-press-line.webp"
                alt={locale === "zh" ? "冲压产线与在制品料架" : "Press line and work-in-progress racking"}
                aspect="4 / 3"
              />
            </div>
          </div>

          <div className="mt-14">
            <FactStrip facts={factsFor(locale)} />
          </div>

          <section className="mt-16 md:mt-24">
            <SectionHead eyebrow={s.factoryEyebrow} title={s.factoryTitle} intro={s.factoryIntro} align="left" />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Photo src="/images/rayen/factory-press-hall-wide.webp" alt={locale === "zh" ? "冲床车间纵深全景" : "Press hall, looking down the line"} aspect="4 / 3" className="md:col-span-2" />
              <Photo src="/images/rayen/factory-press-console.webp" alt={locale === "zh" ? "冲压车间，操作员在数控面板前作业" : "Press shop, operator at the control panel"} aspect="4 / 3" />
              <Photo src="/images/rayen/factory-stamping.webp" alt={locale === "zh" ? "冲压机与操作员" : "Press and operator"} aspect="4 / 3" />
              <Photo src="/images/rayen/factory-assembly-bench.webp" alt={locale === "zh" ? "装配工位，员工在分装零件" : "Assembly bench, sorting components"} aspect="4 / 3" />
              <Photo src="/images/rayen/factory-laser-cutter.webp" alt={locale === "zh" ? "激光切割设备" : "Laser cutter"} aspect="4 / 3" />
              <Photo src="/images/rayen/factory-press-hall.webp" alt={locale === "zh" ? "冲床车间全景" : "Press hall"} aspect="4 / 3" />
            </div>
          </section>

          <div className="mt-12">
            <ArrowLink href={localePath(locale, "/contact/")}>{s.contactLink}</ArrowLink>
          </div>
        </Shell>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

/* ---------------------------------------------------------------- quality */

export function QualityBody({ locale }: { locale: RayenLocale }) {
  const s = t(locale).quality;
  return (
    <>
      <SiteHeader current="/quality/" locale={locale} />
      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead eyebrow={s.eyebrow} title={s.title} align="left" />

          <section className="mt-10">
            <h2 className="text-[18px]">{s.credentialsTitle}</h2>
            <div className="mt-5 grid gap-px bg-[var(--color-line)] md:grid-cols-2">
              {rayen.certifications.map((certification) => (
                <div key={certification.code} className="bg-white p-6 md:p-8">
                  <p className="latin text-[18px] tracking-[0.08em]">{certification.code}</p>
                  <p className="mt-2 text-[15px]">
                    {locale === "zh" ? certification.label : (certification.labelEn ?? certification.label)}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-3)]">
                    {locale === "zh" ? certification.note : (certification.noteEn ?? certification.note)}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[64ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{s.credentialsNote}</p>
          </section>

          <section className="mt-14 border-t border-[var(--color-line)] pt-12">
            <h2 className="text-[18px]">{s.rulesTitle}</h2>
            <ol className="mt-6 space-y-6">
              {s.rules.map((rule) => (
                <li key={rule.n} className="flex gap-5 md:gap-8">
                  <span className="latin shrink-0 text-[22px] leading-none text-[var(--color-accent)] md:text-[28px]">
                    {rule.n}
                  </span>
                  <div>
                    <p className="text-[16px]">{rule.title}</p>
                    <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{rule.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-12">
            <ArrowLink href={localePath(locale, "/contact/")}>{s.cta}</ArrowLink>
          </div>
        </Shell>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

/* -------------------------------------------------------------------- oem */

export function OemBody({ locale }: { locale: RayenLocale }) {
  const s = t(locale).oem;
  return (
    <>
      <SiteHeader current="/oem/" locale={locale} />
      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead eyebrow={s.eyebrow} title={s.title} intro={s.intro} align="left" />

          <div className="mt-10 grid gap-px bg-[var(--color-line)] md:grid-cols-3">
            {capabilitiesFor(locale).map((capability) => (
              <div key={capability.label} className="bg-white p-6 md:p-8">
                <p className="text-[18px]">{capability.label}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{capability.detail}</p>
              </div>
            ))}
          </div>

          <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
            <div>
              <h2 className="text-[18px]">{s.processTitle}</h2>
              <ol className="mt-8 space-y-8">
                {s.steps.map((step) => (
                  <li key={step.n} className="flex gap-5 md:gap-8">
                    <span className="latin shrink-0 text-[20px] leading-none text-[var(--color-ink-3)] md:text-[24px]">
                      {step.n}
                    </span>
                    <div className="border-b border-[var(--color-line)] pb-8">
                      <p className="text-[16px]">{step.title}</p>
                      <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:pt-14">
              <Photo
                src="/images/rayen/factory-assembly-bench.webp"
                alt={locale === "zh" ? "装配工位，员工在分装零件" : "Assembly bench, sorting components"}
                aspect="3 / 4"
              />
            </div>
          </section>

          <section className="mt-16 border-t border-[var(--color-line)] pt-12">
            <h2 className="text-[18px]">{s.enquiryTitle}</h2>
            <ul className="mt-6 grid gap-3 text-[15px] md:grid-cols-2">
              {s.enquiryItems.map((item) => (
                <li key={item} className="flex gap-3 border-b border-[var(--color-line)] pb-3">
                  <span aria-hidden className="text-[var(--color-accent)]">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href={localePath(locale, "/contact/")}>{s.cta}</Button>
            </div>
          </section>
        </Shell>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

/* ---------------------------------------------------------------- contact */

export function ContactBody({ locale }: { locale: RayenLocale }) {
  const s = t(locale).contact;
  const contact = rayen.contact;
  const value = (key: string): string => {
    if (key === "legalName") return legalName;
    if (key === "address") return locale === "zh" ? contact.addressZh : contact.addressEn;
    return (contact as unknown as Record<string, string>)[key] ?? "";
  };

  return (
    <>
      <SiteHeader current="/contact/" locale={locale} />
      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead eyebrow={s.eyebrow} title={s.title} intro={s.intro} align="left" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <dl className="border-t border-[var(--color-line)]">
              {s.rows.map((row) => {
                const v = value(row.key);
                const latin = ["phone", "email", "alibaba1688"].includes(row.key);
                return (
                  <div
                    key={row.key}
                    className="flex flex-col gap-1 border-b border-[var(--color-line)] py-4 sm:flex-row sm:gap-8"
                  >
                    <dt className="w-32 shrink-0 text-[14px] text-[var(--color-ink-3)]">{row.label}</dt>
                    <dd className={`text-[15px] ${latin && v ? "latin" : ""}`}>
                      {v ? v : <span className="text-[var(--color-ink-3)]">—</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <Photo
              src="/images/rayen/factory-press-hall.webp"
              alt={locale === "zh" ? "冲床车间全景" : "Press hall"}
              aspect="4 / 3"
            />
          </div>

          <p className="mt-10 max-w-[64ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{s.note}</p>
        </Shell>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
