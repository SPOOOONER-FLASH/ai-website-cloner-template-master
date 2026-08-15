import type { CSSProperties } from "react";
import type { SpacerHeights } from "@/types/fsb-modules";

/**
 * `data-content-module="spacer"` — 9 instances on the page.
 *
 * The target drives height through a `--spacer-height` cascade fed by inline
 * `--spacer-{default,sm,md,lg,xl}` custom properties. Reproduced here with
 * `--spacer-h-*` inline vars resolved by the `.spacer` rules in globals.css;
 * unset breakpoints fall through to the previous step.
 */
export function Spacer({ heights }: { heights: SpacerHeights }) {
  const style: CSSProperties = {
    "--spacer-h-default": `${heights.default / 10}rem`,
    ...(heights.sm !== undefined && { "--spacer-h-sm": `${heights.sm / 10}rem` }),
    ...(heights.md !== undefined && { "--spacer-h-md": `${heights.md / 10}rem` }),
    ...(heights.lg !== undefined && { "--spacer-h-lg": `${heights.lg / 10}rem` }),
    ...(heights.xl !== undefined && { "--spacer-h-xl": `${heights.xl / 10}rem` }),
  } as CSSProperties;

  return (
    <div className="layout" data-content-module="spacer">
      <div className="grid grid-cols-1 grid-rows-1 items-center justify-items-center">
        <div className="spacer col-start-1 row-start-1 w-full" style={style} />
      </div>
    </div>
  );
}
