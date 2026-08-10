import { Fragment } from "react";

import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/data/projects";

/**
 * Workflow / architecture diagram.
 *
 * Laid out as a sequence of nodes with dashed connectors: horizontal from lg,
 * vertical below. The flowing dashes come from the CSS `animate-dash` keyframe,
 * so the diagram animates with no client JavaScript and stops entirely under
 * prefers-reduced-motion.
 */
export function WorkflowDiagram({ project }: { project: Project }) {
  if (project.workflow.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="section-y-sm relative isolate overflow-hidden bg-ink-950"
    >
      <div aria-hidden className="absolute inset-0 bg-blueprint-dark opacity-45" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 size-[30rem] rounded-full bg-brand-600/10 blur-[130px]"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Architecture"
          tone="dark"
          title="How It Works"
          description="The path a single request takes through the system, end to end."
        />

        <Stagger
          as="ol"
          stagger={0.09}
          className="mt-10 flex flex-col lg:mt-12 lg:flex-row lg:items-stretch"
        >
          {project.workflow.map((node, index) => (
            <Fragment key={node.id}>
              <StaggerItem className="lg:flex-1">
                <div className="group h-full rounded-card border border-white/10 bg-white/[0.035] p-5 transition-[border-color,background-color] duration-300 hover:border-white/20 hover:bg-white/[0.06]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="type-eyebrow text-brand-300">
                      {node.tag}
                    </span>
                    <span className="nums-tabular font-mono text-xs text-ink-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="type-h4 mt-3 text-white">{node.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">
                    {node.description}
                  </p>
                </div>
              </StaggerItem>

              {index < project.workflow.length - 1 ? (
                <StaggerItem
                  className="flex shrink-0 items-center justify-center py-3 lg:px-3 lg:py-0"
                  aria-hidden
                >
                  {/* Vertical connector on small screens */}
                  <svg
                    width="2"
                    height="34"
                    viewBox="0 0 2 34"
                    className="lg:hidden"
                    aria-hidden
                  >
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="34"
                      stroke="#3d63ff"
                      strokeOpacity="0.5"
                      strokeWidth="1.5"
                      strokeDasharray="4 8"
                      className="animate-dash"
                    />
                  </svg>
                  {/* Horizontal connector from lg */}
                  <svg
                    width="34"
                    height="2"
                    viewBox="0 0 34 2"
                    className="hidden lg:block"
                    aria-hidden
                  >
                    <line
                      x1="0"
                      y1="1"
                      x2="34"
                      y2="1"
                      stroke="#3d63ff"
                      strokeOpacity="0.5"
                      strokeWidth="1.5"
                      strokeDasharray="4 8"
                      className="animate-dash"
                    />
                  </svg>
                </StaggerItem>
              ) : null}
            </Fragment>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
