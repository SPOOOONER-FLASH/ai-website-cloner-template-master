import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { ArrowLink, FactStrip, Photo, SectionHead, Shell } from "@/components/rayen/primitives";
import { legalName, rayen, siteFacts, zhPath } from "@/data/rayen";

export const metadata: Metadata = {
  title: "走进雷茵",
  description: `${legalName}，${rayen.brand.foundedYear} 年成立于广东中山小榄，从事机械门锁、锁具配件与门夹的生产。`,
  alternates: { canonical: "/company/" },
};

/**
 * 走进雷茵 — the company page.
 *
 * 顶固's equivalent runs 企业简介 / 资讯中心 / 爱心公益 / 企业荣誉 / 企业视界. We have the
 * first of those and photographs of the floor. Building the other four out of nothing
 * would produce four pages that say nothing, and a buyer who opens 企业荣誉 to find a
 * stock photo of a trophy learns something real about the supplier.
 *
 * So this page is short on purpose, and every claim on it is checkable: the registered
 * name, the year, the address, the product lines, and seven photographs of the plant.
 */
export default function RayenCompanyPage() {
  return (
    <>
      <SiteHeader current="/company/" />

      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead eyebrow="Company" title="走进雷茵" align="left" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="space-y-5 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
              <p>
                <span className="text-[var(--color-ink)]">{legalName}</span>
                （{rayen.brand.latin} {rayen.brand.zh}）成立于 {rayen.brand.foundedYear} 年，
                厂址在广东省中山市小榄镇。小榄是国内机械门锁最集中的产区之一，
                配套的压铸、冲压、电镀与热处理都在半小时车程内。
              </p>
              <p>
                主营机械门锁、锁具配件与门夹：逃生推杠、球锁、执手锁、插芯锁体、锁芯、合页、
                玻璃门夹、闭门器、门碰与浴室配件。支持来图加工与来样加工。
              </p>
              <p>
                这个网站上的每一个型号都有独立规格表。我们不知道的参数会写一条短横线，
                不会先填一个看起来合理的数字 —— 五金件的孔位和尺寸一旦错了，
                买家损失的是一整批货，而不是一次退换。
              </p>
            </div>

            <div>
              <Photo
                src="/images/rayen/factory-press-line.webp"
                alt="冲压产线与在制品料架"
                aspect="4 / 3"
              />
            </div>
          </div>

          <div className="mt-14">
            <FactStrip facts={siteFacts} />
          </div>

          <section className="mt-16 md:mt-24">
            <SectionHead
              eyebrow="Factory"
              title="车间实拍"
              intro="全部拍自小榄厂区，未经合成。"
              align="left"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Photo
                src="/images/rayen/factory-press-hall-wide.webp"
                alt="冲床车间纵深全景"
                aspect="4 / 3"
                className="md:col-span-2"
              />
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
              <Photo src="/images/rayen/factory-laser-cutter.webp" alt="激光切割设备" aspect="4 / 3" />
              <Photo src="/images/rayen/factory-press-hall.webp" alt="冲床车间全景" aspect="4 / 3" />
            </div>
          </section>

          <section className="mt-16 border-t border-[var(--color-line)] pt-12 md:mt-24">
            <SectionHead
              eyebrow="Export Brands"
              title="出口品牌"
              intro="同一条产线上的两个自有出口品牌，英文站长期在线，可以直接打开核对。"
              align="left"
            />
            <div className="mt-8 grid gap-px bg-[var(--color-line)] md:grid-cols-2">
              {rayen.exportBrands.map((brand) => (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener"
                  className="bg-white p-6 transition-colors hover:bg-[var(--color-surface-alt)] md:p-8"
                >
                  <p className="latin text-[20px] tracking-[0.14em]">{brand.name}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                    {brand.note}
                  </p>
                  <p className="latin mt-4 text-[13px] text-[var(--color-ink-3)]">
                    {new URL(brand.url).host} ↗
                  </p>
                </a>
              ))}
            </div>
          </section>

          <div className="mt-12">
            <ArrowLink href={zhPath("/contact/")}>联系我们</ArrowLink>
          </div>
        </Shell>
      </main>

      <SiteFooter />
    </>
  );
}
