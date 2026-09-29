"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { FamilyMember, VariantFamily } from "@/lib/product-variants";
import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "./MediaPlaceholder";

export interface StudioData {
  ranges: { slug: string; name: string }[];
  families: (VariantFamily & { subName: string | null })[];
  finishNames: Record<string, string>;
  functionNames: Record<string, string>;
}

type StepKey = "range" | "model" | "finish" | "fn";

const noSubscribe = () => () => {};

/**
 * FSB's configurator layout: the part large on a stage, the choices stacked in a column,
 * the order code assembling in a card at the top of that column. See the page file for
 * why the stage only ever shows a photograph of the exact SKU.
 *
 * WHAT MOVES, AND WHY
 *
 *   - The stage cross-fades from the outgoing photograph to the incoming one, so a finish
 *     change reads as the same part changing rather than the page reloading.
 *   - Each segment of the order code re-enters when it changes, and stays grey until the
 *     buyer has made that choice — FSB's greyed article-number digits, doing the same job.
 *   - The progress bar fills as steps are confirmed.
 *
 * Opacity and transform only; all of it is off under prefers-reduced-motion (globals.css).
 *
 * STATE IN THE URL, WITHOUT useSearchParams. `?model=<slug>` is the whole configuration,
 * so a link to it is shareable. Read once on mount and written with replaceState, which
 * lets the page render on the server with a default part — the static export has no
 * server to answer a query string, and a Suspense fallback here would be the page.
 */
export function ConfiguratorStudio({ data }: { data: StudioData }) {
  const { families, ranges, finishNames, functionNames } = data;
  const bySlug = useMemo(() => {
    const map = new Map<string, { family: StudioData["families"][number]; member: FamilyMember }>();
    for (const family of families) for (const member of family.members) map.set(member.slug, { family, member });
    return map;
  }, [families]);

  /*
    The shared link's model, read through useSyncExternalStore so the server snapshot
    (no query string in a static export) and the client's first render agree, and no
    effect has to copy the URL into state after hydration.
  */
  const linked = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("model"),
    () => null,
  );
  const fromLink = linked && bySlug.has(linked) ? linked : null;

  const [picked, setPicked] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [touchedState, setTouched] = useState<Set<StepKey> | null>(null);
  const slug = picked ?? fromLink ?? families[0].members[0].slug;
  /* A shared link is a finished configuration; a fresh visit starts with nothing confirmed. */
  const touched = useMemo(
    () => touchedState ?? new Set<StepKey>(fromLink ? ["range", "model", "finish", "fn"] : []),
    [touchedState, fromLink],
  );

  /*
    The site header pins its nav row, so the stage has to stick BELOW it rather than at
    the top of the viewport, or the first 110-150px of the photograph sit under the nav.
    Measured rather than hard-coded: the row's height differs by breakpoint and locale.
  */
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    /* SiteHeader renders a div (HeaderProvider), not a <header>; its sticky class is the hook. */
    const header = document.querySelector<HTMLElement>(".sticky.top-0.z-10");
    const el = root.current;
    if (!header || !el) return;
    const update = () => el.style.setProperty("--studio-top", `${Math.max(0, header.getBoundingClientRect().bottom)}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  const { family, member } = bySlug.get(slug)!;

  const select = useCallback(
    (next: string, step: StepKey) => {
      setTouched(new Set(touched).add(step));
      if (next === slug) return;
      setPrevious(slug);
      setPicked(next);
      const url = new URL(window.location.href);
      url.searchParams.set("model", next);
      window.history.replaceState(null, "", url);
    },
    [slug, touched],
  );

  const finishes = [...new Set(family.members.map((m) => m.finish).filter(Boolean))];
  const fns = [...new Set(family.members.map((m) => m.fn).filter(Boolean))];

  /* Change one axis, keep the other where that combination is made. */
  const memberFor = (axis: "finish" | "fn", value: string) => {
    const other = axis === "finish" ? "fn" : "finish";
    const candidates = family.members.filter((m) => m[axis] === value);
    return candidates.find((m) => m[other] === member[other]) ?? candidates[0];
  };

  const steps: { key: StepKey; title: string }[] = [
    { key: "range", title: "Range" },
    { key: "model", title: "Model" },
    ...(finishes.length > 1 ? [{ key: "finish" as const, title: "Finish" }] : []),
    ...(fns.length > 1 ? [{ key: "fn" as const, title: "Function" }] : []),
  ];
  const done = steps.filter((s) => touched.has(s.key)).length;
  const complete = done === steps.length;

  const finishName = (code: string) =>
    code
      .split("+")
      .map((c) => finishNames[c] ?? c)
      .join(" / ");

  /* The order code in segments; a segment stays grey until its step is confirmed. */
  const segments = [
    { key: "base", text: family.base, set: touched.has("model") },
    ...(member.finish ? [{ key: "finish", text: member.finish.replace("+", ""), set: touched.has("finish") || finishes.length < 2 }] : []),
    ...(member.fn ? [{ key: "fn", text: member.fn, set: touched.has("fn") || fns.length < 2 }] : []),
  ];

  const rangeFamilies = families.filter((f) => f.categoryPath[0] === family.categoryPath[0]);
  const productHref = `/products/${family.categoryPath[0]}/${member.slug}/`;
  const quoteHref = `/contact/?${new URLSearchParams({ model: member.model }).toString()}`;

  const incoming = member;
  const outgoing = previous && previous !== slug ? bySlug.get(previous)?.member : undefined;

  return (
    <div ref={root} className="studio">
      {/* ── Stage ─────────────────────────────────────────────────────── */}
      <div className="studio-stage" aria-live="polite">
        <div className="studio-stage-frame">
          {outgoing ? (
            <div key={`out-${outgoing.slug}`} className="studio-stage-layer studio-stage-out" aria-hidden="true">
              <MediaPlaceholder {...outgoing.heroImage} ratio="1 / 1" sizes="(min-width: 1024px) 56vw, 100vw" />
            </div>
          ) : null}
          <div key={`in-${incoming.slug}`} className={cn("studio-stage-layer", outgoing && "studio-stage-in")}>
            <MediaPlaceholder {...incoming.heroImage} ratio="1 / 1" priority sizes="(min-width: 1024px) 56vw, 100vw" />
          </div>
        </div>
        <p className="studio-stage-caption">
          <span className="tabular-nums text-ink">{member.model}</span>
          <span className="text-ink-secondary">
            {" · "}
            {[member.finish && finishName(member.finish), member.fn && functionNames[member.fn]].filter(Boolean).join(" · ")}
          </span>
        </p>
      </div>

      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <div className="studio-panel">
        <div className="studio-card">
          <div className="flex flex-wrap items-start justify-between gap-24">
            <div>
              <p className="text-c2 font-semibold text-ink">Order code</p>
              <p className="studio-code mt-8" aria-label={`Order code ${member.model}`}>
                {segments.map((s) => (
                  <span key={`${s.key}-${s.text}`} className={cn("studio-code-seg", !s.set && "studio-code-pending")}>
                    {s.text}
                  </span>
                ))}
              </p>
            </div>
            <div className="min-w-[16rem] flex-1">
              <div className="flex items-baseline justify-between">
                <p className="text-c2 font-semibold text-ink">Configuration</p>
                {touched.size ? (
                  <button type="button" className="config-reset" onClick={() => setTouched(new Set())}>
                    Reset
                  </button>
                ) : null}
              </div>
              <div className="mt-8 flex items-center gap-12">
                <span className="text-c1 tabular-nums text-ink">
                  {done}/{steps.length}
                </span>
                <span className="studio-progress" aria-hidden="true">
                  <span className="studio-progress-bar" style={{ transform: `scaleX(${done / steps.length})` }} />
                </span>
              </div>
            </div>
          </div>
          <div className="mt-24 flex flex-wrap gap-12">
            <Link href={quoteHref} className={cn("studio-action studio-action-primary", !complete && "studio-action-muted")}>
              Request a quote for {member.model}
            </Link>
            <Link href={productHref} className="studio-action">
              Product page ›
            </Link>
          </div>
        </div>

        {steps.map((step, index) => (
          <section key={step.key} className="mt-48" aria-labelledby={`studio-${step.key}`}>
            <div className="flex items-baseline justify-between">
              <h2 id={`studio-${step.key}`} className="text-c1 font-semibold text-ink">
                {step.title}
              </h2>
              <span className="flex items-center gap-8 text-c2 tabular-nums text-ink-secondary">
                <span className={cn("studio-dot", touched.has(step.key) && "studio-dot-set")} aria-hidden="true" />
                {index + 1}/{steps.length}
              </span>
            </div>

            <ul className="studio-tiles mt-16">
              {step.key === "range"
                ? ranges.map((range) => {
                    const first = families.find((f) => f.categoryPath[0] === range.slug)!;
                    return (
                      <Tile
                        key={range.slug}
                        title={range.name}
                        image={first.members[0].heroImage}
                        selected={range.slug === family.categoryPath[0]}
                        onSelect={() => select(range.slug === family.categoryPath[0] ? slug : first.members[0].slug, "range")}
                      />
                    );
                  })
                : null}

              {step.key === "model"
                ? rangeFamilies.map((f) => (
                    <Tile
                      key={f.key}
                      title={f.base}
                      meta={f.subName ?? f.name}
                      image={f.members[0].heroImage}
                      selected={f.key === family.key}
                      onSelect={() => select(f.key === family.key ? slug : f.members[0].slug, "model")}
                    />
                  ))
                : null}

              {step.key === "finish"
                ? finishes.map((code) => {
                    const target = memberFor("finish", code);
                    return (
                      <Tile
                        key={code}
                        title={finishName(code)}
                        meta={target.model}
                        image={target.heroImage}
                        selected={code === member.finish}
                        onSelect={() => select(target.slug, "finish")}
                      />
                    );
                  })
                : null}

              {step.key === "fn"
                ? fns.map((code) => {
                    const target = memberFor("fn", code);
                    return (
                      <Tile
                        key={code}
                        title={functionNames[code] ?? code}
                        meta={target.model}
                        image={target.heroImage}
                        selected={code === member.fn}
                        onSelect={() => select(target.slug, "fn")}
                      />
                    );
                  })
                : null}
            </ul>
          </section>
        ))}

        <p className="mt-48 max-w-[52ch] text-c2 text-ink-secondary">
          Every image here is a photograph of the model named under it. A finish or function
          missing from a range is one the factory does not list for that model; ask us if you
          need it.
        </p>
      </div>
    </div>
  );
}

function Tile({
  title,
  meta,
  image,
  selected,
  onSelect,
}: {
  title: string;
  meta?: string;
  image: FamilyMember["heroImage"];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn("studio-tile", selected && "studio-tile-selected")}
      >
        <span className="studio-tile-title">{title}</span>
        {meta ? <span className="studio-tile-meta">{meta}</span> : null}
        <span className="studio-tile-media">
          <MediaPlaceholder src={image.src} ratio="1 / 1" label="" sizes="120px" />
        </span>
      </button>
    </li>
  );
}
