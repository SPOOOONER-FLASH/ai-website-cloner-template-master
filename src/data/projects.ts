import type { Project } from "./types";

/**
 * Representative application packages, not named completed projects.
 *
 * The client has not supplied approved project names, locations, architects, completion
 * years or installation photography. These entries therefore demonstrate how Canton
 * Hyland products can be scheduled together without implying a customer reference.
 * Replace `referenceStatus` only after documentary approval from the project owner.
 */
/** Records live in content/projects/*.json — see products.ts for the rationale. */
import { projects } from "./generated/projects";

export { projects };

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectParams(): { slug: string }[] {
  return projects.map((project) => ({ slug: project.slug }));
}
