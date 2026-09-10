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
 * name, the address, the product lines, and seven photographs of the plant.
 *
 * 2026-09-09：出口品牌一段删掉（甲方要求切断与 HYDE / Stahlock 的关联），
 * 正文改写成行业口径 —— 原来那版读起来像有人在解释自己，专业采购要的是工序和事实。
 * 年份也换了：不写注册年份 2026，写甲方给的「锁具制造经验始于 1999」。
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
                （{rayen.brand.latin} {rayen.brand.zh}）位于广东省中山市小榄镇。
                锁具制造经验始于 {rayen.brand.lockExperienceSince} 年，
                从模具开发、冲压成型到装配检测在同一厂区内完成。小榄是国内机械门锁最集中的产区，
                压铸、电镀与热处理配套均在半小时车程内。
              </p>
              <p>
                产品覆盖逃生推杠、球锁、执手锁、插芯锁体、锁芯、合页、玻璃门夹、
                闭门器与浴室配件。支持来图加工、来样加工与 OEM / ODM。
              </p>
              <p>
                本站每一个型号都有独立规格表。未经确认的参数以短横线标注，不以估值填充 ——
                五金件的孔位与尺寸在开模时即已固定，装配偏差的代价是整批返工，
                而不是一次退换。
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

          <div className="mt-12">
            <ArrowLink href={zhPath("/contact/")}>联系我们</ArrowLink>
          </div>
        </Shell>
      </main>

      <SiteFooter />
    </>
  );
}
