import type { Metadata } from "next";
import { buildHealthReport, categoryBreakdown } from "@/lib/content-health";
import { products } from "@/data/products";
import { news } from "@/data/news";
import { projects } from "@/data/projects";

/**
 * Internal content dashboard.
 *
 * Not part of the public site. It is linked from the CMS, carries `noindex`, and is not
 * in the sitemap or any navigation — but it is built by the same pipeline so it can read
 * content/ directly and therefore cannot show a stale number.
 *
 * Styling deliberately follows the admin's visual language (cards, green accents, light
 * blue-grey ground) rather than the public site's flat white-and-hairlines. This is a
 * tool, not a page a buyer sees, and matching the CMS it is launched from makes it feel
 * like one screen rather than two products.
 */
export const metadata: Metadata = {
  title: "内容健康度 | Canton Hyland",
  robots: { index: false, follow: false },
};

const TONE_STYLE = {
  good: { dot: "#07c160", chip: "#e8f9f0", text: "#0a7a3f" },
  warn: { dot: "#f0a020", chip: "#fff8e1", text: "#8a6100" },
  bad: { dot: "#e32322", chip: "#fdeceb", text: "#a11716" },
} as const;

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6eaf0",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(31,35,41,.06)",
        padding: "18px 20px",
      }}
    >
      <p style={{ margin: 0, color: "#646a73", fontSize: 13 }}>{label}</p>
      <p style={{ margin: "8px 0 0", color: "#1f2329", fontSize: 30, fontWeight: 600 }}>
        {value}
        {suffix ? (
          <span style={{ color: "#8f959e", fontSize: 15, fontWeight: 400 }}> {suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

export default function StatusPage() {
  const sections = buildHealthReport();
  const breakdown = categoryBreakdown();
  const maxCount = Math.max(1, ...breakdown.map((b) => b.count));

  return (
    <main
      style={{
        background: "#eef1f6",
        minHeight: "100vh",
        padding: "32px 24px 80px",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif',
        color: "#1f2329",
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 1400 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 4px" }}>内容健康度</h1>
        <p style={{ color: "#646a73", fontSize: 14, margin: "0 0 24px" }}>
          每次构建时从 content/ 重新计算，不会过期。这里统计的是「还差什么」，
          不是访问量 —— 流量和询盘数需要数据库，本站是静态导出，没有。
        </p>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            marginBottom: 28,
          }}
        >
          <StatCard label="产品" value={products.length} suffix="个" />
          <StatCard label="应用案例" value={projects.length} suffix="条" />
          <StatCard label="新闻" value={news.length} suffix="篇" />
          <StatCard
            label="规格完整的产品"
            value={products.filter((p) => p.specs.length > 0).length}
            suffix={`/ ${products.length}`}
          />
        </div>

        {sections.map((section) => (
          <section
            key={section.title}
            style={{
              background: "#fff",
              border: "1px solid #e6eaf0",
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(31,35,41,.06)",
              marginBottom: 20,
              padding: "20px 24px 8px",
            }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 2px" }}>
              {section.title}
            </h2>
            <p style={{ color: "#646a73", fontSize: 13, margin: "0 0 16px" }}>
              {section.description}
            </p>

            {section.metrics.map((metric) => {
              const style = TONE_STYLE[metric.tone];
              return (
                <div
                  key={metric.label}
                  style={{
                    borderTop: "1px solid #f0f2f5",
                    display: "grid",
                    gap: 12,
                    gridTemplateColumns: "minmax(180px, 260px) 90px 1fr",
                    alignItems: "start",
                    padding: "12px 0",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        background: style.dot,
                        borderRadius: "50%",
                        flex: "none",
                        height: 7,
                        width: 7,
                      }}
                    />
                    {metric.label}
                  </span>

                  <span
                    style={{
                      background: style.chip,
                      borderRadius: 4,
                      color: style.text,
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "3px 8px",
                      textAlign: "center",
                    }}
                  >
                    {metric.value}
                    {metric.total !== undefined ? ` / ${metric.total}` : ""}
                  </span>

                  <span style={{ color: "#646a73", fontSize: 13, lineHeight: 1.6 }}>
                    {metric.action ?? "—"}
                  </span>
                </div>
              );
            })}
          </section>
        ))}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e6eaf0",
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(31,35,41,.06)",
            padding: "20px 24px 24px",
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 16px" }}>各分类产品数</h2>
          {breakdown.map((row) => (
            <div
              key={row.slug}
              style={{
                alignItems: "center",
                display: "grid",
                gap: 12,
                gridTemplateColumns: "220px 1fr 48px",
                padding: "5px 0",
              }}
            >
              <span style={{ fontSize: 13 }}>{row.name}</span>
              <span
                aria-hidden="true"
                style={{ background: "#f0f2f5", borderRadius: 3, height: 8, overflow: "hidden" }}
              >
                <span
                  style={{
                    background: row.count ? "#07c160" : "transparent",
                    borderRadius: 3,
                    display: "block",
                    height: "100%",
                    width: `${(row.count / maxCount) * 100}%`,
                  }}
                />
              </span>
              <span
                style={{
                  color: row.count ? "#1f2329" : "#e32322",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "right",
                }}
              >
                {row.count}
              </span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
