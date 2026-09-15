import models from "../../public/downloads/models/index.json";

export const productModels = models;
export type ProductModelEntry = (typeof models)[number];

export function productModelFor(slug: string) {
  return productModels.find((model) => model.slug === slug);
}
