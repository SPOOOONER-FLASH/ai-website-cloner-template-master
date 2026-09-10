"use client";

import { useState } from "react";

type GalleryImage = { src: string; label: string };

/**
 * 型号页的产品图。
 *
 * 两个甲方 2026-09-10 报的问题，都是这一块：
 *
 *   「下面的图片点不开」 —— 原来的缩略图是静态 <Photo>，纯装饰。买家看到一排小图，
 *   自然会去点，点了没反应。一个不能点的缩略图比没有缩略图更糟，因为它承诺了一件
 *   做不到的事。
 *
 *   「有些图片没有全部显示出来」 —— 原来写死 images.slice(1, 5)，主图加四张就截断。
 *   T2750 有 17 张、G777 有 14 张，买家看到的只有 5 张。截断的那些恰恰是不同表面处理
 *   和安装场景，也就是决定要不要下单的那些。
 *
 * 所以：全部显示，点了换主图。没有做灯箱／放大镜 —— 这些图本身就是 1000px 见方的
 * 白底产品图，主图位已经放到最大有用尺寸，再套一层全屏遮罩只是多一次点击。
 *
 * 尺寸图排在缩略图第一位（见 sortForGallery）。甲方原话「第一张放尺寸参数图」。
 * 主图仍然是产品实拍：类目页的卡片取的是主图，一格一格全是线图的目录看着像图册
 * 不像在售产品。
 */
export function Gallery({ images, model }: { images: GalleryImage[]; model: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) return null;

  return (
    <div>
      <div
        className="overflow-hidden bg-[var(--color-surface-alt)]"
        style={{ aspectRatio: "1 / 1" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
        <img
          src={current.src}
          alt={current.label}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>

      {images.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`查看第 ${index + 1} 张：${image.label}`}
                aria-current={index === active}
                className={`block w-full overflow-hidden border bg-[var(--color-surface-alt)] transition-colors ${
                  index === active
                    ? "border-[var(--color-ink)]"
                    : "border-transparent hover:border-[var(--color-line-strong)]"
                }`}
                style={{ aspectRatio: "1 / 1" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-3 text-[13px] text-[var(--color-ink-3)]">
        {model} · 第 {active + 1} / {images.length} 张
      </p>
    </div>
  );
}
