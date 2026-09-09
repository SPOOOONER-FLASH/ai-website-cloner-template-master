"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/data/site";
import { EmailLink } from "./EmailLink";
import { GlobeIcon } from "./icons";
import { contactChoices, languageChoices, localePickerCopy } from "@/lib/locale-picker";

/**
 * The location-and-language panel.
 *
 * ---------------------------------------------------------------------------
 * WHY THERE IS NO GLOBE
 *
 * The client asked on 2026-09-08 whether this could carry a map or globe animation. It
 * should not, for three reasons that are about this business rather than about taste.
 *
 * FSB's own panel — the screenshot the client sent — is a white sheet with two rows and
 * no motion at all. That restraint is the expensive-looking part, and it is the same
 * instruction the client's principal already gave: 不需要花里胡哨.
 *
 * The cost lands on the wrong reader. A globe is 100–300KB of library and geometry for a
 * control a buyer uses once, and the Google AI-features export for this site shows the
 * audience is India, Vietnam, Indonesia, Myanmar, Thailand and the Philippines — mostly
 * mobile, on networks where that payload is felt.
 *
 * And a globe answers nothing. A reader opens a location menu with two questions: is this
 * site in my language, and who do I talk to. A rotating earth addresses neither, which is
 * why this panel spends its space on a phone number instead.
 *
 * ---------------------------------------------------------------------------
 * THE ONE PIECE OF MOTION, AND WHAT IT CARRIES
 *
 * The sheet slides down from under the header rather than fading in place, because it
 * comes FROM the control that opened it and the movement says so. 180ms, no easing
 * theatrics, and `motion-safe:` throughout so a reduced-motion reader gets the panel
 * without the travel.
 *
 * Nothing else moves. The rows do not stagger — this is a menu being read, not a sequence
 * being watched, and a reader hunting for their own language should find it stationary.
 */
export function LocalePicker({ locale = "en" }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const text = localePickerCopy[locale === "es" ? "es" : "en"];
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    /* Return focus to where it came from, or a keyboard reader is stranded at page top. */
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    /*
      Pointer-down rather than click: a click listener fires after the browser has already
      followed a link inside the panel, which closes it a frame late and looks like a
      flicker on the page that is arriving.
    */
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const languages = languageChoices(pathname, locale);
  const contacts = contactChoices(locale);
  const currentLanguage = languages.find((l) => l.current) ?? languages[0];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={text.trigger}
        className="nav-marker flex h-24 items-center gap-8 text-ink no-underline transition-colors duration-200 hover:text-brand-hover"
      >
        {/*
          The header's own GlobeIcon at its own size. Every control in this row is a 24px
          box with a 20x20 icon — the comment in SiteHeader records that mixing 16 / 20 /
          16x22 is what made the row read as crooked — so the picker adopts the row's
          measurements rather than bringing its own.
        */}
        <GlobeIcon className="h-20 w-20 shrink-0 text-ink-tertiary" />
        <span className="text-c2 leading-none">
          {locale === "es" ? "ES" : "INT"} <span className="text-line">|</span>{" "}
          {currentLanguage.code.toUpperCase()}
        </span>
        </button>

      {/*
        Rendered only while open. A permanently mounted panel with `hidden` would put every
        contact address and phone number into the DOM of all 1,287 pages, which is a lot of
        repeated markup for a control most readers never touch.
      */}
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label={text.title}
          className={[
            "absolute left-0 right-0 top-full z-40 border-t border-line bg-surface shadow-sm",
            "motion-safe:animate-[locale-picker-in_180ms_ease-out]",
          ].join(" ")}
        >
          <div className="layout py-40">
            <div className="col-content grid grid-cols gap-x gap-y-40">
              <div className="col-span-full flex items-start justify-between gap-24">
                <h2 className="text-h3 text-ink">{text.title}</h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label={text.close}
                  className="-m-10 p-10 text-ink-secondary transition-colors hover:text-brand"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-20">
                    <path
                      d="M5 5l14 14M19 5L5 19"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </button>
              </div>

              <div className="col-span-full lg:col-span-4 xl:col-span-8">
                <h3 className="drawer-eyebrow">{text.languages}</h3>
                <ul className="mt-16 space-y-4">
                  {languages.map((language) => (
                    <li key={language.code}>
                      <Link
                        href={language.href}
                        hrefLang={language.code}
                        onNavigate={() => setOpen(false)}
                        aria-current={language.current ? "true" : undefined}
                        /*
                          Weight marks the current language, not an underline.

                          `underline underline-offset-*` is banned repo-wide and
                          short-marker.test.ts enforces it: the site has one shared
                          interaction marker (`.short-marker`, a double line that also
                          appears on :focus-visible) and a second, hand-rolled underline
                          would read as a different kind of thing. It would also be the
                          wrong signal here — an underline says "interactive", and the
                          current language is a state, which is how the header itself marks
                          its current nav item.
                        */
                        className={[
                          "block py-10 text-c1 transition-colors sm:py-4",
                          language.current
                            ? "font-semibold text-ink"
                            : "short-marker short-marker-compact text-ink-secondary hover:text-brand",
                        ].join(" ")}
                      >
                        {language.label}
                        {language.current ? (
                          <span className="ml-8 text-c2 text-ink-secondary">({text.current})</span>
                        ) : null}
                      </Link>
                      {/*
                        Said out loud rather than discovered on arrival. The Spanish mirror
                        is partial by design, and a reader who clicks Español from a page
                        that has no Spanish version should know before they lose their
                        place, not after.
                      */}
                      {!language.samePage && !language.current ? (
                        <p className="max-w-[38ch] text-c2 text-ink-secondary">
                          {text.notMirrored}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
                <h3 className="drawer-eyebrow">{text.contacts}</h3>
                <dl className="mt-16 grid grid-cols-1 gap-x gap-y-24 sm:grid-cols-2">
                  {contacts.map((contact) => (
                    <div key={contact.region} className="border-t border-line pt-12">
                      <dt className="text-c1 text-ink">{contact.region}</dt>
                      <dd className="mt-4 text-c2 text-ink-secondary">
                        <span className="block">{contact.cities.join(" · ")}</span>
                        {contact.phone ? (
                          <a
                            href={`tel:${contact.phone.replace(/\s/g, "")}`}
                            className="mt-4 block text-brand hover:text-brand-hover"
                          >
                            {contact.phone}
                          </a>
                        ) : null}
                        <EmailLink
                          address={contact.email}
                          className="mt-4 block text-brand hover:text-brand-hover"
                        />
                        {contact.note ? (
                          <span className="mt-8 block max-w-[42ch]">{contact.note}</span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
