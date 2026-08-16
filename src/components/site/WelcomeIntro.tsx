"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ChevronDownIcon } from "./icons";

const MORE_LINKS = [
  { label: "Project Planner", href: "/products" },
  { label: "The Canton Hyland Product Overview", href: "/products" },
  { label: "Careers", href: "/company" },
];

/**
 * Page intro block — `main`'s second child, between the two `.modules` containers.
 * Not a `data-content-module`.
 *
 * The "More links" accordion is mobile-only: the toggle is `sm:hidden` and the panel is
 * forced open by `sm:!block` at >=744px, so the desktop reference state has no
 * interactive affordance here at all.
 *
 * COLOUR: h1, copy and the accordion heading are --color-ink (rule 2). The chevron is a
 * decorative icon, so --color-ink-tertiary — never red. The three ArrowLinks in the panel
 * carry the only brand red here.
 */
export function WelcomeIntro() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="layout">
      <div className="col-content grid w-full grid-cols gap-x gap-y-24 xl:gap-y-96">
        {/* slot-1 — headline */}
        <div className="col-span-full row-start-1 grid grid-cols-subgrid sm:col-span-4 md:col-span-6 xl:col-span-12 xl:col-start-1">
          <div className="col-span-6 row-start-1 xl:col-span-10">
            <h1 className="text-h1 text-ink">
              Welcome
              <br />
              <span className="text-h1-light">
                Door Security and Building Hardware, Manufactured in Guangdong
              </span>
            </h1>
          </div>
        </div>

        {/* slot-2 — copy */}
        <div className="col-span-full grid grid-cols-subgrid gap sm:col-span-4 md:col-span-6 xl:col-span-6 xl:row-span-2">
          <section className="copy col-span-full text-ink xl:col-span-5">
            {/* Client's own copy (公司英文简介.docx), trimmed to the 13-line column height. */}
            <div>
              Canton Hyland has manufactured commercial and residential door hardware since 1998.
              We specialize in door security and building
              hardware — panic devices, tubular and cylindrical locks, deadbolts, lock cases,
              profile cylinders, door handles and patch fittings. Recognized experts in master key
              and construction key systems. ISO 9001 certified since 2002.
            </div>
          </section>
        </div>

        {/* slot-4 — "More links" accordion */}
        <div className="col-span-full grid grid-cols-subgrid gap [grid-column-end:-1] sm:col-span-4 md:col-span-6 xl:col-span-6 xl:row-span-2">
          <section className="col-span-full">
            <div className="w-full">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mb-24 flex w-full justify-between gap-x-24 text-left sm:hidden sm:cursor-default"
              >
                <h3 className="text-h3 text-ink">More links</h3>
                <span
                  className={cn(
                    "flex h-[var(--leading-h3)] place-items-center transition-transform duration-300",
                    expanded && "rotate-180",
                  )}
                >
                  <ChevronDownIcon className="h-auto w-16 text-ink-tertiary" />
                </span>
              </button>

              <div className={cn(expanded ? "block" : "hidden", "sm:!block")}>
                <ul className="flex flex-col gap-36 pointer-fine:gap-16">
                  {MORE_LINKS.map((link) => (
                    <li key={link.label}>
                      <ArrowLink href={link.href}>{link.label}</ArrowLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* slot-5 — signature row */}
      <div className="col-content mt-48">
        <div className="mt-48 grid gap-x gap-y-48 sm:grid-cols-2">
          <div className="grid grid-cols-12 gap-x sm:[grid-column-end:-1]">
            <div className="col-span-6">
              {/* Stand-in for a CAD line drawing — see BUILD_PLAN.md P11. */}
              <MediaPlaceholder
                ratio="306 / 156"
                src="/images/company/decorative-hinge-detail.webp"
                label="Close-up of a stainless steel ball bearing door hinge"
                className="w-[92.17%]"
              />
            </div>
            <div className="col-span-6 flex flex-col justify-between text-c1 text-ink">
              <p>
                Canton Hyland Hardware
                <br />
                (Group) Co., Ltd
              </p>
              {/* Monochrome vector certification marks — inherits --color-ink. */}
              <MediaPlaceholder
                ratio="87 / 46"
                src="/images/company/certification-marks.svg"
                label="ISO 9001 and ANSI/BHMA Grade 3 certification marks"
                className="w-[min(8.57rem,11.552083vw)] sm:w-[min(8.57rem,5.95208333vw)]"
              />
            </div>
            <div className="col-span-6 mt-48 text-c1 text-ink-secondary [grid-column-end:-1]">Total solutions to the building industry</div>
          </div>
        </div>
      </div>
    </div>
  );
}
