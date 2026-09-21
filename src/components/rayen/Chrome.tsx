import { categoriesFor, legalName, localePath, rayen } from "@/data/rayen";
import { LOCALE_PUBLIC_PREFIX, STRINGS, type RayenLocale } from "@/data/rayen-i18n";
import { SearchBox } from "./SearchBox";
import { Shell, intrinsicSize } from "./primitives";

/**
 * Header and footer for the RAYEN 雷茵 site, in either language.
 *
 * The header is a single white bar with the mark on the left and five items on the right.
 * No mega-menu: 顶固's drops the whole product tree on hover, which is useful when you
 * sell eight product lines to consumers and noise when you sell one line to buyers who
 * arrived knowing what a backset is. The categories live one click away on /products/,
 * where they get room to be read.
 *
 * The footer is the one place this site is deliberately dense — it is the sitemap, and a
 * buyer checking whether a supplier is real scrolls to the bottom first.
 *
 * ONE COMPONENT, TWO LANGUAGES. Copy-pasting an English header would mean every future
 * change is made twice, and the second copy is the one that gets forgotten — which is how
 * a site ends up with an English footer still linking to a category that was renamed on the
 * Chinese one two months ago.
 */

function navItems(locale: RayenLocale) {
  const t = STRINGS[locale].nav;
  return [
    { href: "/products/", label: t.products },
    { href: "/company/", label: t.company },
    { href: "/quality/", label: t.quality },
    { href: "/oem/", label: t.oem },
    { href: "/contact/", label: t.contact },
  ];
}

function Mark({ locale }: { locale: RayenLocale }) {
  return (
    <a
      href={localePath(locale, "/")}
      className="flex items-center gap-3"
      aria-label={`${rayen.brand.latin} ${rayen.brand.zh}`}
    >
      {/*
        Two marks, one per language. Client, 2026-09-13: 「英文用绿的这个。中文换回原来的带汉字的」.

        The teal wordmark he sent carries no 雷茵. On the Chinese site that matters: a Chinese
        buyer should see the company's Chinese name, because 「雷茵」 is what he searches for
        and what will be on the invoice. To an English reader the two characters are
        decoration he cannot pronounce, and the latin-only lockup is the cleaner mark.

        The product photography keeps the Chinese mark either way — one set of image files
        serves both languages, so that is a single choice rather than a per-page one. See the
        note in scripts/brand-rayen-images.mjs.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
      <img
        src={locale === "zh" ? "/images/rayen/logo.webp" : "/images/rayen/logo-latin.webp"}
        alt={locale === "zh" ? "RAYEN 雷茵" : "RAYEN"}
        {...intrinsicSize(
          locale === "zh" ? "/images/rayen/logo.webp" : "/images/rayen/logo-latin.webp",
        )}
        className="h-7 w-auto md:h-8"
      />
    </a>
  );
}

/**
 * The language switch.
 *
 * Points at the OTHER language's home page, not at the translated twin of the current page.
 * A per-page mapping would be better, but only if it is right every time — and a switch
 * that lands a reader on a 404 because one locale is missing a model teaches them not to
 * use it again. Home always exists in both.
 */
function LocaleSwitch({ locale }: { locale: RayenLocale }) {
  const other: RayenLocale = locale === "zh" ? "en" : "zh";
  return (
    <a
      href={localePath(other, "/")}
      hrefLang={other === "zh" ? "zh-Hans" : "en"}
      className="navlink latin text-[13px] text-[var(--color-ink-2)]"
    >
      {STRINGS[locale].otherLocaleName}
    </a>
  );
}

export function SiteHeader({ current = "", locale = "zh" }: { current?: string; locale?: RayenLocale }) {
  const items = navItems(locale);
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-white/95 backdrop-blur">
      <Shell className="md:flex md:h-20 md:items-center md:justify-between md:gap-6">
        {/*
          MOBILE: two rows, not one wrapped one. 2026-09-16: 「移动端布局设计排版 现在的好丑」,
          with a screenshot of it — the five links, the search button and EN all flowed into
          the space left of the right edge, wrapped to a second line ragged-right, and the
          search circle sat half off the screen.

          A row that wraps is not a layout; it is what is left when there isn't one. So: the
          mark and the two controls share the top row, and the links get a row of their own
          across the full width. `overflow-x-auto` rather than a second wrap, because six
          items at 13px fit 360px and a seventh should scroll rather than reflow the header.
          The bleed to the shell's own 20px padding lets the scrolled row run edge to edge
          instead of appearing to stop short.
        */}
        <div className="flex h-16 items-center justify-between gap-4 md:h-auto md:gap-6">
          <Mark locale={locale} />
          <div className="flex items-center gap-4 md:hidden">
            <SearchBox locale={locale} />
            <LocaleSwitch locale={locale} />
          </div>
        </div>

        <nav aria-label={STRINGS[locale].nav.products} className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={localePath(locale, item.href)}
              data-current={current === item.href}
              className="navlink text-[15px]"
            >
              {item.label}
            </a>
          ))}
          <SearchBox locale={locale} />
          <LocaleSwitch locale={locale} />
        </nav>

        <nav
          aria-label={STRINGS[locale].nav.products}
          className="-mx-5 flex items-center gap-6 overflow-x-auto px-5 pb-2.5 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={localePath(locale, item.href)}
              data-current={current === item.href}
              className="navlink whitespace-nowrap text-[14px]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Shell>
    </header>
  );
}

export function SiteFooter({ locale = "zh" }: { locale?: RayenLocale }) {
  const contact = rayen.contact;
  const t = STRINGS[locale];
  const categories = categoriesFor(locale);
  const positioning =
    locale === "zh"
      ? rayen.brand.positioning
      : "Door hardware manufacturer in Xiaolan, Zhongshan. Panic exit devices, knob and lever locks, mortise cases, glass door fittings and bathroom hardware — made to drawing or to sample.";

  /*
    白底页脚，2026-09-16 甲方定的：「这个黑色的背景不是那么的高级」，并指了 UNION 的页脚
    作为参照。UNION 整站到底都是白的，页脚只用一条细线和字重分层 —— 深色块在小屏上会占掉
    一整屏，而页脚是这个站的站点地图，不是一块视觉收尾。

    分层改用墨色三级（标题 ink、链接 ink-2、备注 ink-3）加 --color-line 的细线，
    和页面其余部分同一套变量，不再自带一套 white/80、white/15、white/50。
  */
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-2)]">
      <Shell className="py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            {/*
              The real mark, not the letters typed out. 2026-09-16: 「这个标可以大点，换成我们的
              logo」. It was a <p> of capitals with letter-spacing — close enough to read as the
              brand and wrong in every detail that makes a mark a mark, and on the Chinese site
              it dropped 雷茵 entirely, which is the half a Chinese buyer searches for.

              Same file and same per-language choice as the header, at roughly double its height:
              the header mark shares a 64px bar with five links, the footer's has a column to
              itself and is the first thing the eye lands on down there.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
            <img
              src={locale === "zh" ? "/images/rayen/logo.webp" : "/images/rayen/logo-latin.webp"}
              alt={locale === "zh" ? "RAYEN 雷茵" : "RAYEN"}
              {...intrinsicSize(locale === "zh" ? "/images/rayen/logo.webp" : "/images/rayen/logo-latin.webp")}
              className="h-12 w-auto md:h-14"
            />
            <p className="mt-2 text-[15px] text-[var(--color-ink)]">{legalName}</p>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed">{positioning}</p>
          </div>

          <nav aria-label={t.footer.products}>
            <p className="text-[14px] text-[var(--color-ink)]">{t.footer.products}</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              {categories.slice(0, 8).map((category) => (
                <li key={category.slug}>
                  <a href={localePath(locale, `/products/${category.slug}/`)} className="hover:text-[var(--color-ink)]">
                    {category.name}
                  </a>
                </li>
              ))}
              <li>
                <a href={localePath(locale, "/products/")} className="hover:text-[var(--color-ink)]">
                  {t.footer.allCategories}
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label={t.footer.about}>
            <p className="text-[14px] text-[var(--color-ink)]">{t.footer.about}</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              {navItems(locale).slice(1).map((item) => (
                <li key={item.href}>
                  <a href={localePath(locale, item.href)} className="hover:text-[var(--color-ink)]">
                    {item.label}
                  </a>
                </li>
              ))}
              {/* 资料下载只在页脚露出，不进顶部导航：买家先看产品，图册是他决定要看细节之后
                  才找的东西，放进主导航会把五个已经够用的入口挤成六个。 */}
              <li>
                <a href={localePath(locale, "/downloads/")} className="hover:text-[var(--color-ink)]">
                  {t.footer.downloads}
                </a>
              </li>
            </ul>
            {/*
              出口品牌那一组链接 2026-09-09 撤掉，换成 1688 店铺。
              甲方要求雷茵不再对外关联 HYDE / Stahlock；页脚是买家核实供应商时第一个
              滚到的地方，留着两个别家品牌的外链，等于把人送走。
            */}
            {contact.alibaba1688 ? (
              <>
                <p className="mt-6 text-[14px] text-[var(--color-ink)]">{t.footer.shop}</p>
                <ul className="mt-3 space-y-2 text-[14px]">
                  <li>
                    <a href={contact.alibaba1688} rel="noopener" target="_blank" className="hover:text-[var(--color-ink)]">
                      {t.footer.shopLink}
                    </a>
                  </li>
                </ul>
              </>
            ) : null}
          </nav>

          <div>
            <p className="text-[14px] text-[var(--color-ink)]">{t.footer.contact}</p>
            <address className="mt-4 space-y-2 text-[14px] not-italic leading-relaxed">
              <p>{locale === "zh" ? contact.addressZh : "2/F-2, No. 28 Lehe Road, Lianfeng, Xiaolan, Zhongshan, Guangdong, China"}</p>
              {/*
                Empty is rendered as an em dash on purpose. The phone and email on
                content/site-settings.json belong to HYDE (a US number, an @cantonlock
                address); publishing them here would send a buyer to a different company's
                export desk. Until the client supplies RAYEN's own, a dash is the honest
                answer. CLIENT-RUNBOOK 待补清单 tracks it.
              */}
              {t.contact.rows
                .filter((row) => ["phone", "email", "wechat"].includes(row.key))
                .map((row) => (
                  <p key={row.key}>
                    {row.label}
                    {locale === "zh" ? "：" : ": "}
                    <span className="latin">
                      {(contact as Record<string, string>)[row.key] || "—"}
                    </span>
                  </p>
                ))}
              <p>
                1688
                {locale === "zh" ? "：" : ": "}
                {/*
                  悬停态跟着页脚其他链接走 hover:text-[var(--color-ink)]，没有用下划线工具类。
                  src/components/site/short-marker.test.ts 扫整个 src/ 禁止它们 —— 这个项目的
                  悬停标记是自己那套双线，混进一条浏览器默认下划线就破了规矩。
                  （那条测试匹配的是文件文本，所以这段注释也不能把被禁的类名原样写出来。）
                */}
                {contact.alibaba1688 ? (
                  <a href={contact.alibaba1688} rel="noopener" target="_blank" className="latin hover:text-[var(--color-ink)]">
                    {locale === "zh" ? "在线店铺 ↗" : "storefront ↗"}
                  </a>
                ) : (
                  "—"
                )}
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 text-[13px] md:flex-row md:items-center md:justify-between">
          <p>
            © {rayen.brand.foundedYear}
            {new Date().getFullYear() > rayen.brand.foundedYear ? `–${new Date().getFullYear()}` : ""}{" "}
            {legalName}
          </p>
          {/*
            No ICP number. The server is in Frankfurt, so there is no 粤ICP备 to display and
            inventing one is a criminal-liability-grade lie that any visitor can check in
            ten seconds at beian.miit.gov.cn. If the client later moves the site onto a
            mainland host and files, the number goes here.
          */}
          <p className="text-[var(--color-ink-3)]">{t.footer.icp}</p>
        </div>
      </Shell>
    </footer>
  );
}

export { LOCALE_PUBLIC_PREFIX };
