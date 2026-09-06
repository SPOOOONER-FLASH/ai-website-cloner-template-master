import { legalName, primaryNav, rayen, stockedCategories, zhPath } from "@/data/rayen";
import { Shell } from "./primitives";

/**
 * Header and footer for the RAYEN 雷茵 site.
 *
 * The header is a single white bar with the mark on the left and five items on the right.
 * No mega-menu: 顶固's drops the whole product tree on hover, which is useful when you
 * sell eight product lines to consumers and noise when you sell one line to buyers who
 * arrived knowing what a backset is. The categories live one click away on /products/,
 * where they get room to be read.
 *
 * The footer is the one place this site is deliberately dense — it is the sitemap, and a
 * Chinese buyer checking whether a supplier is real scrolls to the bottom first.
 */

function Mark() {
  return (
    <a href={zhPath("/")} className="flex items-center gap-3" aria-label={`${rayen.brand.latin} ${rayen.brand.zh} 首页`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
      <img src="/images/rayen/logo.webp" alt="RAYEN 雷茵" className="h-7 w-auto md:h-8" />
    </a>
  );
}

export function SiteHeader({ current = "" }: { current?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-white/95 backdrop-blur">
      <Shell className="flex h-16 items-center justify-between gap-6 md:h-20">
        <Mark />
        <nav aria-label="主导航" className="hidden items-center gap-7 md:flex">
          {primaryNav.map((item) => (
            <a
              key={item.href}
              href={zhPath(item.href)}
              data-current={current === item.href}
              className="navlink text-[15px]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        {/*
          Mobile gets the same five links wrapped onto a second row rather than a drawer.
          A drawer is one more tap and one more thing to build; five short Chinese labels
          fit across two rows at 360px.
        */}
        <nav aria-label="主导航" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 md:hidden">
          {primaryNav.map((item) => (
            <a
              key={item.href}
              href={zhPath(item.href)}
              data-current={current === item.href}
              className="navlink text-[13px]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Shell>
    </header>
  );
}

export function SiteFooter() {
  const contact = rayen.contact;
  return (
    <footer className="mt-24 bg-[var(--color-surface-dark)] text-white/80">
      <Shell className="py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="latin text-[20px] tracking-[0.2em] text-white">RAYEN</p>
            <p className="mt-2 text-[15px] text-white">{legalName}</p>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed">{rayen.brand.positioning}</p>
          </div>

          <nav aria-label="产品中心">
            <p className="text-[14px] text-white">产品中心</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              {stockedCategories.slice(0, 8).map((category) => (
                <li key={category.slug}>
                  <a href={zhPath(`/products/${category.slug}/`)} className="hover:text-white">
                    {category.name}
                  </a>
                </li>
              ))}
              <li>
                <a href={zhPath("/products/")} className="hover:text-white">
                  全部品类 →
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="关于">
            <p className="text-[14px] text-white">关于</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              {primaryNav.slice(1).map((item) => (
                <li key={item.href}>
                  <a href={zhPath(item.href)} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] text-white">出口品牌</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {rayen.exportBrands.map((brand) => (
                <li key={brand.name}>
                  <a href={brand.url} rel="noopener" target="_blank" className="latin hover:text-white">
                    {brand.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[14px] text-white">联系</p>
            <address className="mt-4 space-y-2 text-[14px] not-italic leading-relaxed">
              <p>{contact.addressZh}</p>
              {/*
                Empty is rendered as an em dash on purpose. The phone and email on
                content/site-settings.json belong to HYDE (a US number, an @cantonlock
                address); publishing them here would send a Chinese buyer to a different
                company's export desk. Until the client supplies RAYEN's own, a dash is
                the honest answer. CLIENT-RUNBOOK 待补清单 tracks it.
              */}
              <p>
                电话：<span className="latin">{contact.phone || "—"}</span>
              </p>
              <p>
                邮箱：<span className="latin">{contact.email || "—"}</span>
              </p>
              <p>微信：{contact.wechat || "—"}</p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] md:flex-row md:items-center md:justify-between">
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
          <p className="text-white/50">本站服务器位于境外，未办理 ICP 备案。</p>
        </div>
      </Shell>
    </footer>
  );
}
