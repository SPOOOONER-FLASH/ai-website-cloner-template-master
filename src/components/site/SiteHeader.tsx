import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { LocalePicker } from "./LocalePicker";
import type { MenuCategory } from "@/data/categories";
import type { Locale } from "@/data/locales";
import { headerNav, localisedHref, navLabel, siteSettings } from "@/data/navigation";
import { MenuIcon, SearchIcon, Wordmark } from "./icons";
import {
  HeaderLink,
  HeaderMenuButton,
  HeaderProvider,
  HeaderRailCta,
  HeaderSearchButton,
  ShelfPanel,
  ShelfTrigger,
} from "./HeaderIslands";
import navigationStyles from "./HeaderNavigation.module.css";
import { BauInfoBand } from "./BauEntry";
import { dict, tx } from "@/lib/i18n";

/**
 * 导航现在来自 content/navigation.json，由后台「导航菜单」栏目维护。
 *
 * 这里原本是写死的两份数组（英文一份、西班牙文一份）。搬进内容层之后，
 * 同事在后台改一次即可，不必找人改代码 —— 后台那个栏目才算是真的能用，
 * 而不是摆着好看。
 *
 * 西班牙语路径由 localisedHref 统一处理，指向真实存在的西语页；没有西语版的
 * 指回英文页，而不是指向一个会 404 的 /es 地址。
 *
 * ⚠ 这里原本写着「只有 /company /contact /projects 有西语版」。那句话在西语镜像
 * 扩到产品、对比、集合、配置器、检索与新闻之后就不成立了，但没人回来改它，
 * 于是它变成了一条会误导下一个人的注释 —— 唯一的真相来源是
 * src/lib/spanish-mirror.ts 的 SPANISH_MIRROR_PREFIXES。
 */

/*
  The language switch moved to src/lib/locale-picker.ts on 2026-09-08, as `languageChoices`,
  when the bare EN | ES link became the location-and-language panel.

  Its rule is unchanged and its explanation travelled with it: the switch goes to the SAME
  page in the other language when one exists, and to the Spanish home only when it does
  not, decided by `hasSpanishMirror` so the switch and the hreflang tags can never
  disagree. The new module adds one thing this file could not — it tells the reader which
  of those two is about to happen, before they lose their place.
*/

const companyShelfLinks = {
  en: [
    { label: "Company overview", detail: "Manufacturing since 1998", href: "/company" },
    { label: "Services", detail: "OEM tooling, private label, export", href: "/services" },
    { label: "Events", detail: "Meet HYDE in global markets", href: "/events" },
    { label: "Certificates", detail: "Verified model-scoped reports", href: "/certifications" },
  ],
  es: [
    { label: "La empresa", detail: "Fabricación desde 1998", href: "/company" },
    { label: "Servicios", detail: "Moldes OEM, marca propia, exportación", href: "/services" },
    { label: "Ferias", detail: "Encuentre HYDE en mercados globales", href: "/events" },
    { label: "Certificados", detail: "Informes verificados por modelo", href: "/certifications" },
  ],
  pt: [
    { label: "A empresa", detail: "Fabricação desde 1998", href: "/company" },
    { label: "Serviços", detail: "Moldes OEM, marca própria, exportação", href: "/services" },
    { label: "Feiras", detail: "Encontre a HYDE nos mercados globais", href: "/events" },
    { label: "Certificados", detail: "Relatórios verificados por modelo", href: "/certifications" },
  ],
} as const;

/*
  Resources: Applications, Guides and News under one desktop item (client, 2026-09-27:
  「把这三个合并到一个栏目下面，鼠标挪到那自动向下弹出」). Seven top-level items became
  five, which also shortens every locale's row (fr needed 859px of a 680px column).
  Only the desktop row merges. The phone and compact rails keep the three as separate
  links: there is no hover there, and a scroll rail costs nothing per item.
  The first href present in headerNav is where the merged item sits.
*/
const RESOURCE_HREFS = ["/projects", "/guides", "/news"];
const resourceDetails = {
  en: {
    "/projects": "What each building type takes",
    "/guides": "Size charts, standards and selection references",
    "/news": "Short answers to what buyers ask",
  },
  es: {
    "/projects": "Aplicaciones representativas",
    "/guides": "Tablas de medidas, normas y guías de selección",
    "/news": "Respuestas breves a lo que preguntan los compradores",
  },
  pt: {
    "/projects": "O que cada tipo de obra exige",
    "/guides": "Tabelas de medidas, normas e guias de seleção",
    "/news": "Respostas curtas ao que os compradores perguntam",
  },
} as const;

/*
  The buying shelf.

  FAQ sits here, not only in the footer. The five questions a buyer asks before anything
  else — minimum order, lead time, samples, payment terms, OEM — are all answered on
  /faq/, and burying that page in the footer meant the work was done and nobody read it.
  A visitor who opens "Buy it now" is asking exactly those questions; the answers belong
  one row away from the storefront button, not at the bottom of the page.
*/
const buyShelfLinks = {
  en: [
    { label: "Contact", detail: "Quotes, pricing and export specialists", href: "/contact" },
    { label: "FAQ", detail: "Minimum order, lead time, samples, payment, OEM", href: "/faq" },
    { label: "Downloads", detail: "Catalog and verified documents", href: "/downloads" },
  ],
  es: [
    { label: "Contacto", detail: "Cotizaciones, precios y especialistas de exportación", href: "/contact" },
    { label: "Preguntas frecuentes", detail: "Pedido mínimo, plazos, muestras, pago, OEM", href: "/faq" },
    { label: "Descargas", detail: "Catálogo y documentos verificados", href: "/downloads" },
  ],
  pt: [
    { label: "Contato", detail: "Cotações, preços e especialistas em exportação", href: "/contact" },
    { label: "Perguntas frequentes", detail: "Pedido mínimo, prazo, amostras, pagamento, OEM", href: "/faq" },
    { label: "Downloads", detail: "Catálogo e documentos verificados", href: "/downloads" },
  ],
} as const;

/**
 * Sticky header — 136px (48px promo bar + 88px nav row).
 *
 * The only scroll behaviour on the page: `position: sticky; top: -48px` lets the promo bar
 * scroll away while the nav row pins. Pure CSS — no scroll listener, and deliberately
 * NO shadow / background / height change between states (rule 3).
 *
 * COLOUR:
 *   Nav items use architectural ink. The CURRENT item is semibold; the short
 *   A-style black underline is revealed only on hover or keyboard focus.
 *   Utility icons remain tertiary grey and darken to ink on interaction.
 */
/*
  Locales whose desktop link row can never fit its column, so they use the compact rail at
  every width. Measured 2026-09-27 at 1700px, where the column is 680px and does not grow:
  fr 859px, ru 789px, de 729px (en 618, es 632, tr 630, pt 624, ja 574, ar 511, ko 505).
  The row is `whitespace-nowrap`, so an over-long row does not wrap — it runs under the
  centered wordmark ("Acheter maintenant" across HYDE, client screenshot 09-27). Listed here
  rather than only measured at runtime so the static HTML is already right and the header
  does not jump after hydration; the runtime check below catches anything this list misses.

  Emptied the same day: merging Applications, Guides and News into "Resources" took the
  row from seven items to five, and the longest (fr) now measures 603px. Kept as the place
  to list a locale again if a translation grows past the column.
*/
const LONG_NAV_LOCALES = new Set<string>([]);


/*
  SERVER COMPONENT since 2026-09-28. The wordmark, every nav label and every shelf link are
  HTML from the server; HeaderIslands.tsx holds the parts that need state or the current
  path (shelf triggers and panels, current-page marking, search, menu, the rail CTA).
  Each locale's layout passes `locale`; the header no longer reads it off the URL.
*/
export function SiteHeader({
  categories,
  locale = "en",
}: {
  categories: MenuCategory[];
  locale?: Locale;
}) {
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const resourceLinks = headerNav.filter((link) => RESOURCE_HREFS.includes(link.href));
  const firstResourceHref = resourceLinks[0]?.href;
  /*
    The compact rail is also what 1376–1599px desktops see (HeaderNavigation.module.css), and
    a 1440px laptop has a mouse: the release session found "Guides / News" there instead of
    Resources on 09-28. So from xl up the rail shows the Resources button in place of its
    resource links; below xl (tablet, phone — no hover) the links stay.
  */
  const railFirstResourceHref = headerNav
    .filter((link) => link.href !== "/projects")
    .find((link) => RESOURCE_HREFS.includes(link.href))?.href;
  /* The pages that make each shelf's trigger "current". */
  const resourceHrefs = resourceLinks.map((link) => localisedHref(link.href, locale));
  const companyHrefs = dict(companyShelfLinks, locale).map((link) => localisedHref(link.href, locale));
  const buyHrefs = dict(buyShelfLinks, locale).map((link) => localisedHref(link.href, locale));
  const resourcesLabel = tx(locale, "Resources", { es: "Recursos", pt: "Recursos" });
  const buyLabel = tx(locale, "Buy it now", { es: "Comprar ahora", pt: "Comprar agora" });

  const header = (
    // Only the navigation sticks; the BAU information band below scrolls in page flow.
    <HeaderProvider
      locale={locale}
      categories={categories}
      longNavLocale={LONG_NAV_LOCALES.has(locale)}
      className={cn("relative sticky top-0 z-10 flex-grow-0 bg-surface", navigationStyles.header)}
    >
      <div>
        {/* Nav row */}
        <div className="layout z-30 bg-surface">
          <div className="relative col-content grid w-full grid-cols items-center gap-x gap-y-24 pb-8 pt-32 xl:flex xl:gap-x-32">
            <div data-header-wide-nav="" className={cn("col-span-full max-xl:hidden sm:col-span-4 md:col-span-6 xl:col-span-12 xl:flex-none", navigationStyles.wideNavigation)}>
              {/*
                `whitespace-nowrap` is load-bearing. Unwrapped, the five labels need
                523px and the gaps at xl were 4 × 48px, for 715px inside a 680px column,
                so flex shrank the two longest ("Product Finder", "Service + Downloads")
                onto a second line. Since flex stretches every item to the tallest, the
                single-line labels then sat top-aligned in a 48px box while the wrapped
                ones filled it, and the row read as misaligned.

                Six labels now measure 486px unwrapped. At the xl edge the column is
                649px, so 5 × 24px gaps leave ~44px of slack; the 32px gaps this used to
                have left only 4px there, which is inside the noise of font rendering.
                nowrap also makes a future label edit fail visibly — as it did when News
                was added — rather than silently re-wrapping one item back into the same
                misalignment.
              */}
              <nav className="flex gap-16 whitespace-nowrap">
                {headerNav.map((link) => {
                  const href = localisedHref(link.href, locale);

                  if (link.href === "/products") {
                    /*
                      A link, not a button. Chanel opens its panel on hover but the top
                      item still navigates, and the same applies here: /products/ is a
                      real page with its own copy and 435 indexed links, so turning the
                      nav item into a button to get a panel would cost the page its
                      entry point. Hover and focus open the shelf; the click goes through.
                    */
                    return (
                      <ShelfTrigger
                        key={link.href}
                        shelf="products"
                        href={href}
                        currentHrefs={[href]}
                        className="nav-marker text-c1 text-ink no-underline"
                      >
                        {navLabel(link, locale)}
                      </ShelfTrigger>
                    );
                  }

                  if (link.href === "/company") {
                    return (
                      <ShelfTrigger
                        key={link.href}
                        shelf="company"
                        currentHrefs={companyHrefs}
                        className="nav-marker bg-transparent text-c1 text-ink"
                      >
                        {navLabel(link, locale)}
                      </ShelfTrigger>
                    );
                  }

                  if (RESOURCE_HREFS.includes(link.href)) {
                    if (link.href !== firstResourceHref) return null;
                    return (
                      <ShelfTrigger
                        key="resources"
                        shelf="resources"
                        currentHrefs={resourceHrefs}
                        className="nav-marker bg-transparent text-c1 text-ink"
                      >
                        {resourcesLabel}
                      </ShelfTrigger>
                    );
                  }

                  if (link.href === "/downloads") {
                    return (
                      <ShelfTrigger
                        key={link.href}
                        shelf="buy"
                        currentHrefs={buyHrefs}
                        className="nav-marker bg-transparent text-c1 text-ink"
                      >
                        {buyLabel}
                      </ShelfTrigger>
                    );
                  }

                  return (
                    <HeaderLink
                      key={link.href}
                      href={href}
                      markCurrent
                      closesShelf
                      className="nav-marker text-c1 text-ink no-underline"
                    >
                      {navLabel(link, locale)}
                    </HeaderLink>
                  );
                })}
              </nav>
            </div>

            <div className={cn("col-span-full grid grid-cols-2 content-start justify-between gap-x gap-y-24 xl:contents", navigationStyles.controls)}>
              {/*
                09-30 (client: 「hyde 标注偏右」): at xl the wordmark sat in the first cell of
                the right-hand 12 columns, so its LEFT edge was on the centre line and the space
                either side of it was unequal. At xl the row is now one flex line (nav, wordmark,
                controls) and the wordmark takes the space between them, centred, so its gaps to
                the nav and to the language list are equal. Centring on the page instead collided
                with the ten-language list below ~1700px. Below xl it stays in the grid as before.
              */}
              <Link href={homeHref} className={cn("flex min-w-0 flex-shrink-0 items-center text-ink xl:min-w-max xl:flex-1 xl:justify-center", navigationStyles.home)}>
                <Wordmark className="pe-8 xl:pe-0" />
              </Link>

              {/*
                Icons keep their 20px visual footprint and baseline. A transparent
                pseudo-element extends each hit target to 44px without crowding the
                wordmark and language links on a 375px screen.
              */}
              <nav className="flex flex-grow items-center justify-end gap-24 sm:gap-32 xl:flex-none">
                {/*
                  The bare EN | ES link became a panel on 2026-09-08, at the client's
                  request and modelled on FSB's "Choose your location and language".

                  It still switches language on exactly the rule `languageTarget` encodes —
                  see the comment there and `hasSpanishMirror` — but it now also answers
                  the question a reader actually opens a location menu to ask, which is who
                  they talk to. `src/lib/locale-picker.ts` records why that is a better use
                  of the space than the globe animation the client asked about.
                */}
                <LocalePicker locale={locale} />
                <HeaderSearchButton label={tx(locale, "Search", { es: "Buscar", pt: "Pesquisar" })}>
                  <SearchIcon className="h-20 w-20" />
                </HeaderSearchButton>
                <HeaderMenuButton label={tx(locale, "Open menu", { es: "Abrir menú", pt: "Abrir menu" })}>
                  <MenuIcon className="h-20 w-20" />
                </HeaderMenuButton>
              </nav>
            </div>

            {/* Breadcrumb rail — empty on the home route, hidden below 393px */}
            <div className="col-span-full max-[24.5625em]:hidden xl:hidden">
              <nav className="flex items-center gap-4 text-c2 text-ink-secondary" />
            </div>
          </div>
        </div>

        {/*
          Mobile and tablet nav rail.

          The row above is `max-xl:hidden`, so below 1376px the header used to offer a
          wordmark, a language link, a magnifier and a hamburger — nothing that names a
          destination. Most of this site's traffic arrives on a product page from search
          and leaves from there; a menu you have to discover is a menu most of them never
          open. See .nav-rail in globals.css for why this scrolls rather than wraps.
        */}
        <div className={cn("layout border-t border-line bg-surface xl:hidden", navigationStyles.compactNavigation)}>
          {/*
            09-28 (client: 「手机端导航栏……很乱没有逻辑」): the destinations scroll in their
            reading order and "Buy it now" is pinned on the right, always in view, instead of
            leading the scroll strip. Before, the CTA came first and the fifth label was cut
            mid-word at the screen edge, so the strip read as neither ordered nor finished.
          */}
          <div className="col-content flex min-w-0 items-center gap-16">
          <nav
            aria-label={tx(locale, "Main navigation", { es: "Navegación principal", pt: "Navegação principal" })}
            className="nav-rail min-w-0 flex-1"
          >
            {headerNav
              /*
                Projects comes out of the phone rail. The rail scrolls horizontally and
                anything past the fold is a link most visitors never see; Projects is the
                least load-bearing of the six — three reference pages the client does not
                treat as a selling surface — so it goes, and stays in the desktop row and
                the drawer.
              */
              .filter((link) => link.href !== "/projects")
              .map((link) => {
              const href = localisedHref(link.href, locale);

              /* No permanent bold on Product Finder any more (09-28): in the rail, bold means "you are here", and a second always-bold label read as a second current page. */

              /*
                "Buy it now" opens the sourcing drawer rather than linking out. This reaches
                Alibaba, the price list, Contact and the mailbox in one more tap — sending
                it straight to the storefront would drop the buyer who wants a quote by
                email, and email is what this site is built to produce.
              */
              if (link.href === "/downloads") return null; // pinned outside the scroll strip

              const railLink = (
                <HeaderLink
                  key={link.href}
                  href={href}
                  markCurrent
                  className={cn("nav-rail-item", RESOURCE_HREFS.includes(link.href) && "xl:hidden")}
                >
                  {navLabel(link, locale)}
                </HeaderLink>
              );
              if (link.href !== railFirstResourceHref) return railLink;
              return (
                <Fragment key={link.href}>
                  <ShelfTrigger
                    shelf="resources"
                    currentHrefs={resourceHrefs}
                    className="nav-rail-item hidden bg-transparent xl:inline-block"
                  >
                    {resourcesLabel}
                  </ShelfTrigger>
                  {railLink}
                </Fragment>
              );
            })}
          </nav>
          <HeaderRailCta className="nav-rail-cta flex-none">
            {buyLabel}
            <span aria-hidden="true">›</span>
          </HeaderRailCta>
          </div>
        </div>
      </div>

      <ShelfPanel shelf="products" label={tx(locale, "Products", { es: "Productos", pt: "Produtos" })}>
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-32 xl:grid-cols-[minmax(16rem,.55fr)_minmax(0,2.45fr)]">
              <div>
                <p className="text-c2 uppercase tracking-[.12em] text-ink-secondary">
                  {tx(locale, "Products", { es: "Productos", pt: "Produtos" })}
                </p>
                <p className="mt-12 max-w-[28rem] text-c1 text-ink-secondary">
                  {tx(locale, "Fifteen product families. The number is how many verified records each one holds.", { es: "Quince familias de producto. El número es cuántas referencias verificadas contiene cada una.", pt: "Quinze famílias de produto. O número é quantas referências verificadas cada uma contém." })}
                </p>
                <Link
                  href={localisedHref("/product-finder", locale)}
                  className="short-marker mt-16 inline-block text-c1 text-ink no-underline"
                >
                  {tx(locale, "Product Finder", { es: "Buscador de productos", pt: "Localizador de produtos" })}
                </Link>
                {/* The studio (09-29): finish and function switched on real photographs. Beside
                    the Finder rather than a sixth rail item — fr/de rows already overflow. */}
                <Link
                  href={localisedHref("/configurator/studio", locale)}
                  className="short-marker mt-12 inline-block text-c1 text-ink no-underline"
                >
                  {tx(locale, "Configurator Studio", { es: "Estudio de configuración", pt: "Estúdio de configuração" })}
                </Link>
              </div>
              {/* Four columns of fifteen: the whole catalogue reachable in one hover
                  from any page, which is what the drawer already gives on a phone. */}
              <nav className="grid gap-x-24 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
                {categories.map((category) => {
                  const href = localisedHref(`/products/${category.slug}`, locale);
                  return (
                    <div key={category.slug}>
                      <HeaderLink
                        href={href}
                        className="header-shelf-link block border-t border-line pt-12 text-ink no-underline"
                      >
                        <span className="short-marker text-c1">
                          {category.labels[locale]}
                        </span>
                        <span className="ms-8 text-c2 tabular-nums text-ink-secondary">
                          {category.count}
                        </span>
                      </HeaderLink>
                      {category.children.length > 0 ? (
                        <ul className="mt-6">
                          {category.children.map((child) => (
                            <li key={child.slug}>
                              <Link
                                /*
                                  The static collection page, not the filter query.

                                  This shelf is server-rendered on every page, so it is
                                  the one place a crawler reliably sees sub-category
                                  links. Pointing it at ?type= gave those pages no
                                  inbound link at all — they existed only in the sitemap,
                                  which is precisely how a page ends up "discovered, not
                                  indexed".

                                  Spanish joined on 2026-09-03, when /es/collections/
                                  shipped. Until then it kept the filter, because a link
                                  to a page that does not exist is worse than a weak one.
                                */
                                href={
                                  locale === "en"
                                    ? `/collections/${category.slug}-${child.slug}/`
                                    : `/${locale}/collections/${category.slug}-${child.slug}/`
                                }
                                className="block py-2 text-c2 text-ink-secondary no-underline hover:text-ink"
                              >
                                {child.labels[locale]}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </ShelfPanel>

      <ShelfPanel shelf="company" label={tx(locale, "Company", { es: "Empresa", pt: "Empresa" })}>
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-32 xl:grid-cols-[minmax(16rem,.55fr)_minmax(0,2.45fr)]">
              <div>
                <p className="text-c2 uppercase tracking-[.12em] text-ink-secondary">
                  {tx(locale, "Company", { es: "Empresa", pt: "Empresa" })}
                </p>
                <p className="mt-12 max-w-[28rem] text-c1 text-ink-secondary">
                  {tx(locale, "The factory, markets and technical support behind HYDE.", { es: "La fábrica, sus mercados y el apoyo técnico detrás de HYDE.", pt: "A fábrica, os mercados e o apoio técnico por trás da HYDE." })}
                </p>
              </div>
              <nav className="grid gap-x-24 gap-y-24 sm:grid-cols-2 xl:grid-cols-4">
                {dict(companyShelfLinks, locale).map((link) => (
                  <HeaderLink
                    key={link.href}
                    href={localisedHref(link.href, locale)}
                    className="header-shelf-link border-t border-line pt-16 text-ink no-underline"
                  >
                    <span className="short-marker text-c1">{link.label}</span>
                    <span className="mt-8 block text-c2 text-ink-secondary">{link.detail}</span>
                  </HeaderLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </ShelfPanel>

      <ShelfPanel shelf="resources" label={resourcesLabel}>
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-32 xl:grid-cols-[minmax(16rem,.55fr)_minmax(0,2.45fr)]">
              <div>
                <p className="text-c2 uppercase tracking-[.12em] text-ink-secondary">
                  {resourcesLabel}
                </p>
                <p className="mt-12 max-w-[28rem] text-c1 text-ink-secondary">
                  {tx(locale, "Where the products are used, how to specify them, and what buyers ask.", {
                    es: "Dónde se usan los productos, cómo especificarlos y qué preguntan los compradores.",
                    pt: "Onde os produtos são usados, como especificá-los e o que os compradores perguntam.",
                  })}
                </p>
              </div>
              <nav className="grid gap-x-24 gap-y-24 sm:grid-cols-3">
                {resourceLinks.map((link) => {
                  const detail = dict(resourceDetails, locale)[link.href as keyof typeof resourceDetails.en];
                  return (
                    <HeaderLink
                      key={link.href}
                      href={localisedHref(link.href, locale)}
                      className="header-shelf-link border-t border-line pt-16 text-ink no-underline"
                    >
                      <span className="short-marker text-c1">{navLabel(link, locale)}</span>
                      <span className="mt-8 block text-c2 text-ink-secondary">{detail}</span>
                    </HeaderLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </ShelfPanel>

      <ShelfPanel shelf="buy" label={buyLabel}>
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-24 xl:grid-cols-4">
              {dict(buyShelfLinks, locale).map((link) => (
                <HeaderLink
                  key={link.href}
                  href={localisedHref(link.href, locale)}
                  className="header-shelf-link flex min-h-96 flex-col justify-between border-t border-line py-16 text-ink no-underline"
                >
                  <span className="flex items-center justify-between gap-16 text-h3">
                    <span className="short-marker">{link.label}</span>
                    <span aria-hidden="true">›</span>
                  </span>
                  <span className="mt-16 text-c2 text-ink-secondary">{link.detail}</span>
                </HeaderLink>
              ))}
              <a
                href={siteSettings.alibaba.storefront}
                target="_blank"
                rel="noopener noreferrer"
                className="alibaba-hard-cta"
              >
                <span>{tx(locale, "Buy on Alibaba", { es: "Comprar en Alibaba", pt: "Comprar no Alibaba" })}</span>
                <span aria-hidden="true">›</span>
              </a>
            </div>
          </div>
        </div>
      </ShelfPanel>
    </HeaderProvider>
  );

  return (
    <>
      {header}
      <BauInfoBand locale={locale} />
    </>
  );
}
