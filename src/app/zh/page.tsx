import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { ArrowLink, Button, FactStrip, Photo, SectionHead, Shell } from "@/components/rayen/primitives";
import { countInCategory, legalName, rayen, siteFacts, stockedCategories, zhPath } from "@/data/rayen";

export const metadata: Metadata = {
  title: { absolute: `${legalName} | 机械门锁与门控五金制造` },
  description: rayen.brand.positioning,
  alternates: { canonical: "/" },
};

/**
 * Home page.
 *
 * The order of the blocks is the argument, and the argument is「这家工厂是真的」:
 *   1. a real photograph of a real door — 2026-09-10 换掉了原来的冲床车间全景。
 *      甲方原话「换一张漂亮的做首页，换掉那个工厂机械」。车间照讲的是「我们能造」，
 *      但首屏第一眼要回答的是「你们造的东西什么样」——买家要先想要这个东西，
 *      才会关心它在哪造的。车间照没有删，移到走进雷茵页，那里正是讲产能的地方。
 *   2. three numbers that can be checked against this same site
 *   3. what we actually make, as a grid you can click into
 *   4. what we can do to order (来图/来样/OEM) — the 1688 buyer's first question
 *   5. more of the floor
 *   6. how to ask
 *
 * 出口品牌那一段 2026-09-09 删了。它原本是这个站最强的可信度资产 —— 同一条产线上的
 * 两个海外品牌，英文站长期在线可以直接核对。但甲方要求切断与 HYDE / Stahlock 的关联：
 * 雷茵要以自己的名义面对国内客户，而不是以「某出口厂的中文站」的身份。这是品牌决策，
 * 不是技术决策，所以照办。
 *
 * There is no carousel, no counter animation and no video. 悍高 opens with a full-screen
 * video and earns it with a listed company's production base; the same slot filled with
 * what we have would be a smaller claim dressed in a bigger frame. Restraint reads as
 * confidence — see AGENTS.md「Professional, not decorated」.
 */
export default function RayenHomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-grow">
        {/* 1 — hero */}
        <section className="relative">
          <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-[var(--color-surface-dark)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
            <img
              src="/images/rayen/hero-brass-handles.webp"
              alt="青铜色门扇上的一对黄铜大拉手"
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
                <p className="latin text-[12px] tracking-[0.3em] text-white/70">
                  RAYEN · ZHONGSHAN XIAOLAN
                </p>
                <h1 className="mt-4 max-w-[20ch] text-[30px] leading-tight text-white md:text-[46px]">
                  机械门锁与门控五金制造
                </h1>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-white/85 md:text-[17px]">
                  {rayen.brand.positioning}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={zhPath("/products/")}>查看产品中心</Button>
                  <a href={zhPath("/oem/")} className="btn border-white/70 text-white hover:bg-white hover:text-black">
                    来图来样加工
                  </a>
                </div>
              </Shell>
            </div>
          </div>
        </section>

        {/* 2 — the three checkable numbers */}
        <section className="mt-0">
          <Shell>
            <FactStrip facts={siteFacts} />
          </Shell>
        </section>

        {/* 3 — what we make */}
        <section className="py-16 md:py-24">
          <Shell>
            <SectionHead
              eyebrow="Products"
              title="产品分类"
              intro="按品类进入，每个型号都有独立的规格表：材质、背距、门厚、面板尺寸、表面处理。"
            />
            <div className="mt-10 grid grid-cols-2 gap-px bg-[var(--color-line)] md:mt-14 md:grid-cols-3 lg:grid-cols-5">
              {stockedCategories.map((category) => (
                <a
                  key={category.slug}
                  href={zhPath(`/products/${category.slug}/`)}
                  className="group bg-white p-4 transition-colors hover:bg-[var(--color-surface-alt)]"
                >
                  {category.image?.src ? (
                    <Photo src={category.image.src} alt={category.name} aspect="1 / 1" />
                  ) : (
                    <div className="aspect-square bg-[var(--color-surface-alt)]" />
                  )}
                  <p className="mt-3 text-[15px]">{category.name}</p>
                  <p className="latin mt-1 text-[12px] text-[var(--color-ink-3)]">
                    {countInCategory(category.slug)} models
                  </p>
                </a>
              ))}
            </div>
          </Shell>
        </section>

        {/* 4 — how you can order */}
        <section className="border-y border-[var(--color-line)] bg-[var(--color-surface-alt)] py-16 md:py-20">
          <Shell>
            <SectionHead eyebrow="Capability" title="加工方式" align="left" />
            <div className="mt-8 grid gap-px bg-[var(--color-line)] md:grid-cols-3">
              {rayen.capabilities.map((capability) => (
                <div key={capability.label} className="bg-white p-6 md:p-8">
                  <p className="text-[18px]">{capability.label}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                    {capability.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ArrowLink href={zhPath("/oem/")}>了解定制流程</ArrowLink>
            </div>
          </Shell>
        </section>

        {/* 5 — the floor */}
        <section className="py-16 md:py-24">
          <Shell>
            <SectionHead
              eyebrow="Factory"
              title="车间实拍"
              intro="以下照片全部来自小榄厂区，未做合成，也没有借用他人的展位或展厅。"
            />
            <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
              <Photo
                src="/images/rayen/factory-press-console.webp"
                alt="冲压车间，操作员在数控面板前作业"
                aspect="4 / 3"
              />
              <Photo src="/images/rayen/factory-stamping.webp" alt="冲压机与操作员" aspect="4 / 3" />
              <Photo
                src="/images/rayen/factory-assembly-bench.webp"
                alt="装配工位，员工在分装零件"
                aspect="4 / 3"
              />
            </div>
            <div className="mt-8">
              <ArrowLink href={zhPath("/company/")}>走进雷茵</ArrowLink>
            </div>
          </Shell>
        </section>

        {/* 7 — ask */}
        <section className="bg-[var(--color-surface-dark)] py-16 text-white md:py-20">
          <Shell className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-[24px] md:text-[30px]">需要图纸、尺寸或报价？</h2>
              <p className="mt-3 max-w-[52ch] text-[15px] text-white/75">
                告诉我们型号或用途，我们回复具体规格与包装数据。没有把握的参数我们会说不知道，不会先给一个数字。
              </p>
            </div>
            <a href={zhPath("/contact/")} className="btn border-white bg-white text-black hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white">
              联系我们
            </a>
          </Shell>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
