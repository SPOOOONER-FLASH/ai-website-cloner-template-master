import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { Button, Photo, SectionHead, Shell } from "@/components/rayen/primitives";
import { rayen, zhPath } from "@/data/rayen";

export const metadata: Metadata = {
  title: "合作与定制",
  description: "来图加工、来样加工与 OEM / ODM。告诉我们图纸或样品，我们回具体的结构、尺寸与包装数据。",
  alternates: { canonical: "/oem/" },
};

/**
 * 合作与定制 — this site's conversion page.
 *
 * It sits where 顶固 puts 加盟合作. Theirs recruits dealers for a consumer brand; ours
 * answers the question a 1688 buyer actually opens a factory page to ask: can you make my
 * part, and what do you need from me.
 *
 * The five steps below are the ordinary sequence for tooled metal hardware, stated
 * plainly. What is deliberately absent is a lead time, an MOQ and a tooling cost — those
 * vary per part and the client has not given figures. A published "7 天出样" that turns
 * into three weeks on the first order costs more than the enquiry it won.
 */
const STEPS = [
  {
    n: "01",
    title: "发来图纸或样品",
    body: "有图纸就发图纸（DWG、PDF、照片都可以）；没有图纸，寄一件样品同样可以做。关键是把安装面、孔位和方轴规格说清楚。",
  },
  {
    n: "02",
    title: "确认结构与尺寸",
    body: "我们回一份确认清单：材质、背距、门厚范围、面板尺寸、表面处理。有拿不准的地方我们会问，而不是按常见规格默认。",
  },
  {
    n: "03",
    title: "开模或改模",
    body: "结构与现有模具接近的，改模即可；结构不同的需要开新模。这一步的费用与周期按件报，不做通用报价。",
  },
  { n: "04", title: "打样确认", body: "样品寄到您手上，装到实际门上试过再决定。样品不对的地方在这一步改，比量产后改便宜得多。" },
  { n: "05", title: "量产与包装", body: "包装可按您的要求做，含贴牌、彩盒、说明书与条码。装箱数据在量产前给到。" },
];

export default function RayenOemPage() {
  return (
    <>
      <SiteHeader current="/oem/" />

      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead
            eyebrow="OEM / ODM"
            title="合作与定制"
            intro="来图加工、来样加工与贴牌生产。下面是一般流程；具体周期和费用按件报，不给通用数字。"
            align="left"
          />

          <div className="mt-10 grid gap-px bg-[var(--color-line)] md:grid-cols-3">
            {rayen.capabilities.map((capability) => (
              <div key={capability.label} className="bg-white p-6 md:p-8">
                <p className="text-[18px]">{capability.label}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                  {capability.detail}
                </p>
              </div>
            ))}
          </div>

          <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
            <div>
              <h2 className="text-[18px]">一般流程</h2>
              <ol className="mt-8 space-y-8">
                {STEPS.map((step) => (
                  <li key={step.n} className="flex gap-5 md:gap-8">
                    <span className="latin shrink-0 text-[20px] leading-none text-[var(--color-ink-3)] md:text-[24px]">
                      {step.n}
                    </span>
                    <div className="border-b border-[var(--color-line)] pb-8">
                      <p className="text-[16px]">{step.title}</p>
                      <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:pt-14">
              <Photo
                src="/images/rayen/factory-assembly-bench.webp"
                alt="装配工位，员工在分装零件"
                aspect="3 / 4"
              />
            </div>
          </section>

          <section className="mt-16 border-t border-[var(--color-line)] pt-12">
            <h2 className="text-[18px]">发询价时带上这几项，回复会快很多</h2>
            <ul className="mt-6 grid gap-3 text-[15px] md:grid-cols-2">
              {[
                "产品类型与参考型号（本站型号即可）",
                "门厚、背距、方轴规格",
                "表面处理与颜色",
                "预计数量与交期要求",
                "是否需要贴牌、彩盒或说明书",
                "有无图纸或样品",
              ].map((item) => (
                <li key={item} className="flex gap-3 border-b border-[var(--color-line)] pb-3">
                  <span aria-hidden className="text-[var(--color-accent)]">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href={zhPath("/contact/")}>发送询价</Button>
            </div>
          </section>
        </Shell>
      </main>

      <SiteFooter />
    </>
  );
}
