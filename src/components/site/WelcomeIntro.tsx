"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ChevronDownIcon, HydeLockup } from "./icons";

const introCopy = {
  en: {
    // The H1 renders `welcome` then `title` as its two lines. "Welcome" held the first and
    // most heavily weighted line of the only H1 on the site's highest-authority page while
    // carrying no search value; the category and the role sit there now instead.
    welcome: "Panic Exit Devices, Locks and Door Hardware",
    title: "Manufactured in Guangdong since 1998",
    body: "Canton Hyland has manufactured commercial and residential door hardware since 1998. We specialize in panic devices, tubular and cylindrical locks, deadbolts, lock cases, profile cylinders, door handles and patch fittings. Recognized experts in master key and construction key systems. ISO 9001 certified since 2002.",
    more: "More links",
    company: "Canton Hyland Hardware\n(Group) Co., Ltd",
    tagline: "Total solutions to the building industry",
    links: [
      { label: "Project Planner", href: "/products" },
      { label: "The Canton Hyland Product Overview", href: "/products" },
      { label: "Careers", href: "/company" },
    ],
  },
  es: {
    welcome: "Barras antipánico, cerraduras y herrajes para puertas",
    title: "Fabricados en Guangdong desde 1998",
    body: "Canton Hyland fabrica herrajes para puertas comerciales y residenciales desde 1998. Producimos dispositivos antipánico, cerraduras tubulares y cilíndricas, cerrojos, cajas de cerradura, cilindros, manillas y herrajes para vidrio. ISO 9001 desde 2002.",
    more: "Más enlaces",
    company: "Canton Hyland Hardware\n(Group) Co., Ltd",
    tagline: "Soluciones integrales para la industria de la construcción",
    links: [
      { label: "Planificador de proyectos", href: "/products" },
      { label: "Catálogo de productos", href: "/products" },
      { label: "Conozca la empresa", href: "/es/company" },
    ],
  },
} as const;

/**
 * Page intro block — `main`'s second child, between the two `.modules` containers.
 * Not a `data-content-module`.
 *
 * The "More links" accordion is mobile-only: the toggle is `sm:hidden` and the panel is
 * forced open by `sm:!block` at >=744px, so the desktop reference state has no
 * interactive affordance here at all.
 *
 * COLOUR: h1, copy and the accordion heading are --color-ink (rule 2). The chevron is a
 * decorative icon, so --color-ink-tertiary. The three ArrowLinks in the panel
 * carry the only interactive accent here, now rendered in monochrome ink.
 */
export function WelcomeIntro({
  locale = "en",
  homeAccent = false,
}: {
  locale?: "en" | "es";
  homeAccent?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const text = introCopy[locale];

  return (
    <div className="layout">
      <div
        className={cn(
          "col-content grid w-full grid-cols gap-x gap-y-24 xl:gap-y-96",
          homeAccent && "home-accent-surface home-accent-module",
        )}
      >
        {/* slot-1 — headline */}
        <div className="col-span-full row-start-1 grid grid-cols-subgrid sm:col-span-4 md:col-span-6 xl:col-span-12 xl:col-start-1">
          <div className="col-span-6 row-start-1 xl:col-span-10">
            <h1 className={cn("text-h1 text-ink", homeAccent && "home-accent-marker")}>
              {text.welcome}
              <br />
              <span className="text-h1-light">
                {text.title}
              </span>
            </h1>
          </div>
        </div>

        {/* slot-2 — copy */}
        <div className="col-span-full grid grid-cols-subgrid gap sm:col-span-4 md:col-span-6 xl:col-span-6 xl:row-span-2">
          <section className="copy col-span-full text-ink xl:col-span-5">
            <div>{text.body}</div>
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
                <h3 className="text-h3 text-ink">{text.more}</h3>
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
                  {text.links.map((link) => (
                    <li key={link.label}>
                      <ArrowLink
                        href={link.href}
                        className={cn(homeAccent && "home-accent-action")}
                      >
                        {link.label}
                      </ArrowLink>
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
              {/*
                Brand block. Was a hinge close-up, which read as an unrelated product shot
                in the signature row. The mark belongs here — this is the company signature,
                not a catalogue slot. Flat, no shadow, inherits nothing decorative.
              */}
              <div className="flex h-full w-[92.17%] items-center">
                <HydeLockup className="h-auto w-[62%] max-w-[18rem]" />
              </div>
            </div>
            <div className="col-span-6 flex flex-col justify-between text-c1 text-ink">
              <p className="whitespace-pre-line">{text.company}</p>
              {/* Monochrome vector certification marks — inherits --color-ink. */}
              <MediaPlaceholder
                ratio="87 / 46"
                src="/images/company/certification-marks.svg"
                label="ISO 9001 and ANSI/BHMA Grade 3 certification marks"
                className="w-[min(8.57rem,11.552083vw)] sm:w-[min(8.57rem,5.95208333vw)]"
              />
            </div>
            <div className="col-span-6 mt-48 text-c1 text-ink-secondary [grid-column-end:-1]">
              {text.tagline}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
