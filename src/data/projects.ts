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
import { projects as generatedProjects } from "./generated/projects";
import { applyImageAltOverride, applyImageAltOverrides } from "./image-alt-overrides";

export const projects: Project[] = generatedProjects.map((project) => ({
  ...project,
  heroImage: applyImageAltOverride(project.heroImage),
  gallery: applyImageAltOverrides(project.gallery),
}));

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectParams(): { slug: string }[] {
  return projects.map((project) => ({ slug: project.slug }));
}
