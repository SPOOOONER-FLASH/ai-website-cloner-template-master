import type { NewsArticle } from "@/data/types";
import visuals from "@/data/news-visuals.json";
import { MediaPlaceholder } from "./MediaPlaceholder";
import styles from "./NewsVisual.module.css";

type Visual = { src: string; width: number; height: number; crop: number[]; angle: number; tone: string; brand?: boolean };

/** Real photographs in an SVG viewport: crop only empty field, never redraw hardware. */
export function NewsVisual({ article, locale = "en" }: { article: NewsArticle; locale?: "en" | "es" }) {
  const label = locale === "es" ? article.heroImage.labelEs ?? article.heroImage.label : article.heroImage.label;
  const visual = (visuals as Record<string, Visual>)[article.slug];
  if (!visual) {
    const isPlate = article.heroImage.src?.includes("/framed/") &&
      !article.heroImage.src.includes("dark") && !article.heroImage.src.includes("brushed-steel");
    return isPlate ? <div className={`${styles.frame} ${styles.fallback}`}>
      <MediaPlaceholder {...article.heroImage} label={label} className="aspect-[16/9]" />
    </div> : <MediaPlaceholder {...article.heroImage} label={label} className="aspect-[16/9]" />;
  }
  const [, , w, h] = visual.crop;
  const radians = Math.abs(visual.angle) * Math.PI / 180;
  const scale = Math.min(1400 / (w * Math.cos(radians) + h * Math.sin(radians)),
    720 / (h * Math.cos(radians) + w * Math.sin(radians)));
  return (
    <div className={`${styles.frame} ${styles[visual.tone]}`}>
      <svg viewBox="0 0 1600 900" role="img" aria-label={label} className={styles.product}>
        <g transform={`translate(800 470) rotate(${visual.angle})`}>
          <svg x={-w * scale / 2} y={-h * scale / 2} width={w * scale} height={h * scale}
            viewBox={visual.crop.join(" ")} overflow="hidden">
            <image href={visual.src} width={visual.width} height={visual.height} />
          </svg>
        </g>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {visual.brand !== false && <img className={styles.brand} src="/images/brand/hyde/hyde-logo-horizontal-graphite.svg" alt="" aria-hidden="true" width="110" height="24" />}
    </div>
  );
}
