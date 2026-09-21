import { getPublishedGuides } from "@/data/guides";
import { NewsCard } from "./NewsCard";
import type { Locale } from "@/data/site";
import visual from "./GuideVisual.module.css";

/**
 * 指南栏目的列表页。
 *
 * 和 NewsListing 分开写而不是加一个开关，因为这两页说的不是同一件事：
 * 新闻页的空状态解释「这里将来会有公告」，指南页从第一天起就有内容，
 * 而它的引导语要告诉读者这些页面是拿来**查**的，不是拿来读新闻的。
 *
 * 卡片复用 NewsCard，只传 section="guides" 改路径 —— 形状相同的东西复制一份，
 * 只会让下一次改版式的人改两处而忘掉一处。
 */
const COPY = {
  en: {
    title: "Guides",
    intro:
      "Reference pages for the decisions that come before a purchase order: size charts, code cross-references, what a standard actually covers, and where our own catalogue is silent.",
    note:
      "Every figure on these pages can be traced to a published source, and where a value is not published we say so rather than estimate it. Dimensions are given in millimetres with the imperial equivalent alongside.",
    emptyTitle: "No guides published yet.",
    empty: "Reference pages are being written. In the meantime, ask us directly.",
    contact: "Contact us",
    contactHref: "/contact/",
  },
  es: {
    title: "Guías",
    intro:
      "Páginas de referencia para las decisiones que vienen antes del pedido: tablas de medidas, referencias cruzadas de códigos, qué cubre realmente una norma y dónde nuestro propio catálogo calla.",
    note:
      "Cada cifra de estas páginas puede rastrearse hasta una fuente publicada, y donde un valor no está publicado lo decimos en lugar de estimarlo.",
    emptyTitle: "Todavía no hay guías publicadas.",
    empty: "Estamos escribiendo las páginas de referencia. Mientras tanto, pregúntenos directamente.",
    contact: "Contacto",
    contactHref: "/es/contact/",
  },
  pt: {
    title: "Guias",
    intro:
      "Páginas de referência para as decisões que vêm antes do pedido: tabelas de medidas, referências cruzadas de códigos, o que uma norma realmente cobre e onde o nosso próprio catálogo se cala.",
    note:
      "Cada número destas páginas pode ser rastreado até uma fonte publicada, e onde um valor não está publicado nós dizemos isso em vez de estimá-lo.",
    emptyTitle: "Ainda não há guias publicados.",
    empty: "As páginas de referência estão sendo escritas. Entretanto, pergunte-nos diretamente.",
    contact: "Contato",
    contactHref: "/pt/contact/",
  },
} as const;

export function GuideListing({ locale = "en" }: { locale?: Locale } = {}) {
  const t = COPY[locale];
  const articles = getPublishedGuides();

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-64">
      <div className="layout space-y-48 lg:space-y-64">
        <section className={`col-content w-full gap-y-24 ${visual.banner}`}>
          <h1 className="col-span-full text-h1 text-ink lg:col-span-5 xl:col-span-11">
            {t.title}
          </h1>
          <div className="col-span-full lg:col-span-6 lg:col-start-7 xl:col-span-11 xl:col-start-14">
            <p className="text-c1 text-ink">{t.intro}</p>
            {/*
              这一段不是装饰。它说的是这个栏目和别人的同类页面的差别：
              数字说得出处，查不到的写明查不到。那是我们相对同类工厂唯一的
              结构性优势，所以它印在列表页上而不是藏在每篇文章里。
            */}
            <p className="mt-24 text-c2 text-ink-secondary">{t.note}</p>
          </div>
        </section>

        <section className="col-content">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <NewsCard
                  key={article.slug}
                  article={article}
                  locale={locale}
                  section="guides"
                />
              ))}
            </div>
          ) : (
            <div className="border border-line p-32 lg:p-48">
              <p className="text-h3 text-ink">{t.emptyTitle}</p>
              <p className="mt-16 max-w-[60ch] text-c1 text-ink-secondary">{t.empty}</p>
              <a
                href={t.contactHref}
                className="short-marker short-marker-compact mt-24 text-c1 text-brand hover:text-brand-hover"
              >
                {t.contact}
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
