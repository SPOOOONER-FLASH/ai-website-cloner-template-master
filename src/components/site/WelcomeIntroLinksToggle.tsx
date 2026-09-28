"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "./icons";

/**
 * The mobile "More links" accordion from WelcomeIntro — the only interactive part of it.
 *
 * `heading` and `children` are rendered by the server component and passed through, so the
 * heading text and the link list stay static HTML; this island owns only the open state.
 * Below 744px the panel starts closed; at `sm` and up the button is hidden and `sm:!block`
 * forces the panel open, exactly as before the split.
 */
export function WelcomeIntroLinksToggle({
  heading,
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mb-24 flex w-full justify-between gap-x-24 text-start sm:hidden sm:cursor-default"
      >
        {heading}
        <span
          className={cn(
            "flex h-[var(--leading-h3)] place-items-center transition-transform duration-[var(--motion-medium)]",
            expanded && "rotate-180",
          )}
        >
          <ChevronDownIcon className="h-auto w-16 text-ink-tertiary" />
        </span>
      </button>

      <div className={cn(expanded ? "block" : "hidden", "sm:!block")}>{children}</div>
    </>
  );
}
