import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { ArrowLink, SectionHead, Shell } from "@/components/rayen/primitives";
import { rayen, zhPath } from "@/data/rayen";

export const metadata: Metadata = {
  title: "品质与认证",
  description: "雷茵五金的资质情况与我们对参数的处理原则：没有把握的数字写短横线，不写一个看起来合理的数。",
  alternates: { canonical: "/quality/" },
};

/**
 * 品质与认证.
 *
 * The honest version of the page 顶固 fills with a wall of certificate thumbnails.
 *
 * We have two credentials the client's 1688 storefront lists — ISO 14001 and CCC — and we
 * do not yet have scans of either. The certificate folder on the client's drive turned out
 * to hold an Intertek EN 1154 report whose applicant is KALE KILIT and whose manufacturer
 * is CANTON HYLAND HARDWARE CO., LTD: that is HYDE's document for a specific model, not
 * RAYEN's company credential. Reproducing it here would be a fake anyone could check —
 * the certificate number is printed on it.
 *
 * So the page states what is claimed, states that the scans are not published yet, and
 * spends the rest of its space on the thing that is actually true and actually rare: a
 * written rule about what we do when we do not know a number. For a buyer choosing a
 * hardware supplier sight-unseen, that rule is worth more than a wall of thumbnails,
 * because it is the one thing that predicts whether the backset on page 40 is right.
 */
export default function RayenQualityPage() {
  return (
    <>
      <SiteHeader current="/quality/" />

      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead eyebrow="Quality" title="品质与认证" align="left" />

          <section className="mt-10">
            <h2 className="text-[18px]">资质</h2>
            <div className="mt-5 grid gap-px bg-[var(--color-line)] md:grid-cols-2">
              {rayen.certifications.map((certification) => (
                <div key={certification.code} className="bg-white p-6 md:p-8">
                  <p className="latin text-[18px] tracking-[0.08em]">{certification.code}</p>
                  <p className="mt-2 text-[15px]">{certification.label}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-3)]">
                    {certification.note}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[64ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              以上两项来自 1688 店铺的工商资质栏。证书扫描件我们还没有放上来 ——
              放一张看不清编号的图片，和不放，对采购方来说没有区别；
              需要核验的客户可以直接向我们索取带编号的原件。
            </p>
          </section>

          <section className="mt-14 border-t border-[var(--color-line)] pt-12">
            <h2 className="text-[18px]">我们不会做的三件事</h2>
            <ol className="mt-6 space-y-6">
              {[
                {
                  n: "01",
                  title: "不写没有把握的尺寸",
                  body: "规格表里查不到的一栏是短横线，不是一个看起来合理的数字。金属件的孔位、螺距、方轴和背距在开模那一刻就定死了，装不上去不能靠现场修，买家为此损失的是一整批货。",
                },
                {
                  n: "02",
                  title: "不放生成的产品图",
                  body: "本站所有产品图都是实物拍摄。AI 可以把照片修干净、去背景，但不能想象一件金属产品 —— 生成出来的执手看着像那么回事，孔位是错的，而这行的买家一眼就看得出来。",
                },
                {
                  n: "03",
                  title: "不借用别人的资质和场地",
                  body: "网站上的车间照片全部拍自本厂。别家的展位、别家的展厅、别家名字的检测报告，一张都没有用。",
                },
              ].map((rule) => (
                <li key={rule.n} className="flex gap-5 md:gap-8">
                  <span className="latin shrink-0 text-[22px] leading-none text-[var(--color-accent)] md:text-[28px]">
                    {rule.n}
                  </span>
                  <div>
                    <p className="text-[16px]">{rule.title}</p>
                    <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                      {rule.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-12">
            <ArrowLink href={zhPath("/contact/")}>索取证书原件或检测报告</ArrowLink>
          </div>
        </Shell>
      </main>

      <SiteFooter />
    </>
  );
}
