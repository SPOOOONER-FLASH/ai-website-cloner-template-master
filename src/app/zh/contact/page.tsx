import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { Photo, SectionHead, Shell } from "@/components/rayen/primitives";
import { legalName, rayen, siteUrl } from "@/data/rayen";

export const metadata: Metadata = {
  title: "联系我们",
  description: `${legalName}，${rayen.contact.addressZh}。`,
  alternates: { canonical: "/contact/" },
};

/**
 * 联系我们.
 *
 * Several rows here render an em dash, and that is the current true state rather than an
 * unfinished page. content/site-settings.json holds a US phone number and an
 * @cantonlock.com address — HYDE's export desk. Publishing those under RAYEN's name would
 * route a Chinese buyer to a different company and, when they noticed, would tell them
 * this page was assembled rather than written. The client owes us RAYEN's own line,
 * WeChat and 1688 storefront; CLIENT-RUNBOOK 「雷茵中文站 · 待补」 tracks it, and filling
 * content/rayen/site.json makes the dashes disappear with no code change.
 */

const ROWS = [
  { label: "公司名称", value: legalName, latin: false },
  { label: "厂址", value: rayen.contact.addressZh, latin: false },
  { label: "电话", value: rayen.contact.phone, latin: true },
  { label: "邮箱", value: rayen.contact.email, latin: true },
  { label: "微信", value: rayen.contact.wechat, latin: false },
  { label: "1688 店铺", value: rayen.contact.alibaba1688, latin: true },
];

export default function RayenContactPage() {
  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: legalName,
    alternateName: ["RAYEN", "雷茵五金"],
    url: siteUrl,
    foundingDate: String(rayen.brand.foundedYear),
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
      addressRegion: rayen.contact.province,
      addressLocality: rayen.contact.city,
      streetAddress: rayen.contact.addressZh,
    },
    // Only emitted when there is something real to emit. An empty telephone property is
    // worse than an absent one: it validates, and it is wrong.
    ...(rayen.contact.phone ? { telephone: rayen.contact.phone } : {}),
    ...(rayen.contact.email ? { email: rayen.contact.email } : {}),
  };

  return (
    <>
      <SiteHeader current="/contact/" />

      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead
            eyebrow="Contact"
            title="联系我们"
            intro="说明型号或用途，我们回具体规格。没有把握的参数我们会说不知道。"
            align="left"
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <dl className="border-t border-[var(--color-line)]">
              {ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 border-b border-[var(--color-line)] py-4 sm:flex-row sm:gap-8"
                >
                  <dt className="w-28 shrink-0 text-[14px] text-[var(--color-ink-3)]">{row.label}</dt>
                  <dd className={`text-[15px] ${row.latin && row.value ? "latin" : ""}`}>
                    {row.value || <span className="text-[var(--color-ink-3)]">—</span>}
                  </dd>
                </div>
              ))}
            </dl>

            <Photo
              src="/images/rayen/factory-press-hall.webp"
              alt="冲床车间全景"
              aspect="4 / 3"
            />
          </div>

          <p className="mt-10 max-w-[64ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
            标着短横线的几项还没有对外公布的号码。与其放一个打不通的电话，
            我们先把它空着 —— 有需要请通过 1688 店铺留言，或让介绍人转达。
          </p>
        </Shell>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
      />
    </>
  );
}
