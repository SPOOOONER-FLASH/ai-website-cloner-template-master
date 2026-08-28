import overridesFile from "../../content/image-alt-overrides.json" with { type: "json" };
import type { ImageRef } from "./types";

export interface ImageAltOverride {
  src: string;
  label: string;
  labelEs?: string;
}

export type ImageAltOverrideMap = ReadonlyMap<string, ImageAltOverride>;

export function createImageAltOverrideMap(
  overrides: ImageAltOverride[],
): ImageAltOverrideMap {
  const overrideMap = new Map<string, ImageAltOverride>();

  for (const rawOverride of overrides) {
    const override = {
      src: rawOverride.src.trim(),
      label: rawOverride.label.trim(),
      labelEs: rawOverride.labelEs?.trim() || undefined,
    };

    if (!override.src.startsWith("/images/")) {
      throw new Error(`Image alt override must use an /images/ path: ${override.src}`);
    }
    if (!override.label) {
      throw new Error(`Image alt override is missing English alt text: ${override.src}`);
    }
    if (overrideMap.has(override.src)) {
      throw new Error(`Duplicate image alt override: ${override.src}`);
    }

    overrideMap.set(override.src, override);
  }

  return overrideMap;
}

export const imageAltOverrideMap = createImageAltOverrideMap(
  overridesFile.overrides as ImageAltOverride[],
);

export function applyImageAltOverride(
  image: ImageRef,
  overrides: ImageAltOverrideMap = imageAltOverrideMap,
): ImageRef {
  if (!image.src) return image;

  const override = overrides.get(image.src);
  if (!override) return image;

  return {
    ...image,
    label: override.label,
    labelEs: override.labelEs ?? image.labelEs,
  };
}

export function applyImageAltOverrides(images: ImageRef[]): ImageRef[] {
  return images.map((image) => applyImageAltOverride(image));
}
