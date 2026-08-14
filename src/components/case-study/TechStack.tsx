import { TechMarquee } from "@/components/ui/TechMarquee";
import type { Project } from "@/data/projects";

/**
 * Technology stack for the case study — a full-width scrolling strip of the
 * tools this system runs on, rendered as the same dark marquee used on the
 * home page. The tools are flattened from the project's grouped stack.
 */
export function TechStack({ project }: { project: Project }) {
  const tools = project.techStack.flatMap((group) => group.items);

  return <TechMarquee items={tools} label="Technology Stack" tone="dark" />;
}
