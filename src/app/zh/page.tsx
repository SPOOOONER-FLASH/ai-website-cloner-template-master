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
 *   1. a real photograph of the press hall, not a render
 *   2. three numbers that can be checked against this same site
 *   3. what we actually make, as a grid you can click into
 *   4. what we can do to order (来图/来样/OEM) — the 1688 buyer's first question
 *   5. more of the floor
 *   6. the export brands, which is the strongest single credibility item we own
 *   7. how to ask
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
              src="/images/rayen/factory-press-hall-wide.webp"
              alt="雷茵五金冲床车间纵深全景"
              className="h-full w-full object-cover opacity-75"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
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

        {/* 6 — the export brands */}
        <section className="border-t border-[var(--color-line)] py-16 md:py-24">
          <Shell>
            <SectionHead
              eyebrow="Export Brands"
              title="出口品牌"
              intro="同一条产线，两个面向海外市场的自有品牌。它们的英文站长期在线，可以直接打开核对产品与型号。"
            />
            <div className="mx-auto mt-10 grid max-w-3xl gap-px bg-[var(--color-line)] md:grid-cols-2">
              {rayen.exportBrands.map((brand) => (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener"
                  className="bg-white p-8 transition-colors hover:bg-[var(--color-surface-alt)]"
                >
                  <p className="latin text-[22px] tracking-[0.14em]">{brand.name}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{brand.note}</p>
                  <p className="latin mt-4 text-[13px] text-[var(--color-ink-3)]">
                    {new URL(brand.url).host} ↗
                  </p>
                </a>
              ))}
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
