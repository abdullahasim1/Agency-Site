import { Fragment } from "react";
import { RotateCcw } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Workflow / architecture diagram.
 *
 * A sequence of nodes: a vertical timeline with numbered rails below xl, and a
 * horizontal flow with animated arrow connectors from xl up. Every project
 * ships exactly five nodes, so all diagrams share the same rhythm. Projects
 * marked `workflowLayout: "loop"` additionally draw a return arc from the
 * final step back to the first (daily cycles, retry loops, waitlist backfill).
 * The dashed connectors animate via the CSS `animate-dash` keyframe with no
 * client JavaScript and stop entirely under prefers-reduced-motion.
 */
export function WorkflowDiagram({ project }: { project: Project }) {
  const nodes = project.workflow;
  if (nodes.length === 0) return null;

  const isLoop = project.workflowLayout === "loop";

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
          eyebrow={portfolioCopy.caseStudy.workflow.eyebrow}
          tone="dark"
          title={portfolioCopy.caseStudy.workflow.title}
          description={portfolioCopy.caseStudy.workflow.description}
        />

        <div className="relative">
          {/* Glass sheen sweeping over the diagram. */}
          <span
            aria-hidden
            className="animate-sheen pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
          />

          <Stagger
            as="ol"
            stagger={0.09}
            className="mt-10 flex flex-col gap-5 lg:mt-12 xl:flex-row xl:items-stretch xl:gap-0"
          >
          {nodes.map((node, index) => {
            const step = String(index + 1).padStart(2, "0");
            const isLast = index === nodes.length - 1;

            return (
              <Fragment key={node.id}>
                <StaggerItem className="flex gap-4 xl:block xl:flex-1">
                  {/* Numbered rail — vertical timeline below xl */}
                  <div className="relative flex w-9 shrink-0 flex-col items-center xl:hidden">
                    <span className="flex size-9 items-center justify-center rounded-full border border-brand-400/40 bg-brand-600/15 font-mono text-xs text-brand-300">
                      {step}
                    </span>
                    {!isLast && (
                      <span
                        aria-hidden
                        className="my-2 -mb-5 flex-1 border-l-2 border-dashed border-brand-400/30"
                      />
                    )}
                  </div>

                  {/* Node card */}
                  <div className="group flex-1 rounded-card border border-white/15 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-[border-color,background-color] duration-300 hover:border-white/25 hover:bg-white/[0.09] xl:h-full">
                    <div className="flex items-center justify-between gap-3">
                      <span className="type-eyebrow text-brand-300">
                        {node.tag}
                      </span>
                      <span className="hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[0.6875rem] text-ink-400 xl:inline-flex">
                        STEP {step}
                      </span>
                    </div>
                    <h3 className="type-h4 mt-3 text-white">{node.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">
                      {node.description}
                    </p>
                  </div>
                </StaggerItem>

                {/* Arrow connector — horizontal flow from xl */}
                {!isLast && (
                  <StaggerItem
                    aria-hidden
                    className="hidden items-center justify-center px-4 xl:flex"
                  >
                    <svg width="48" height="2" viewBox="0 0 48 2">
                      <line
                        x1="0"
                        y1="1"
                        x2="36"
                        y2="1"
                        stroke="#3d63ff"
                        strokeOpacity="0.55"
                        strokeWidth="1.5"
                        strokeDasharray="4 8"
                        className="animate-dash"
                      />
                      <path
                        d="M36 0.25 L47 1 L36 1.75 Z"
                        fill="#3d63ff"
                        fillOpacity="0.8"
                      />
                    </svg>
                  </StaggerItem>
                )}
              </Fragment>
            );
          })}
        </Stagger>

        {isLoop && (
          <>
            {/* Curved return arc under the row — xl */}
            <div aria-hidden className="relative mt-6 hidden xl:block">
              <svg
                width="100%"
                height="48"
                viewBox="0 0 1200 52"
                preserveAspectRatio="none"
                className="block"
              >
                <path
                  d="M1080 34 C 900 56, 300 56, 120 34"
                  fill="none"
                  stroke="#3d63ff"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                  strokeDasharray="6 10"
                  className="animate-dash"
                />
                <path
                  d="M120 34 L130 25 L130 43 Z"
                  fill="#3d63ff"
                  fillOpacity="0.75"
                />
              </svg>
            </div>
            {/* Return note under the last card — below xl */}
            <p className="mt-4 flex items-center justify-end gap-1.5 font-mono text-[0.6875rem] uppercase tracking-wider text-brand-300/80 xl:hidden">
              <RotateCcw className="size-3.5" />
              returns to start
            </p>
          </>
        )}
        </div>
      </Container>
    </section>
  );
}
