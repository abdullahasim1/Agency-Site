import type { Metadata } from "next";

import { LayoutBento } from "@/components/case-study/preview/LayoutBento";
import { LayoutNarrative } from "@/components/case-study/preview/LayoutNarrative";
import { LayoutSplit } from "@/components/case-study/preview/LayoutSplit";
import { Container } from "@/components/ui/Container";
import { getProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Case Study Layout Options",
  description: "Preview page for case-study layout variations.",
  robots: { index: false, follow: false },
};

const variants = [
  {
    id: "option-a",
    label: "Option A",
    name: "Split Sidebar",
    note: "Dark hero + sticky project brief that scrolls beside the story.",
  },
  {
    id: "option-b",
    label: "Option B",
    name: "Narrative Editorial",
    note: "Quiet typographic story — meta bar, numbered rows, results band.",
  },
  {
    id: "option-c",
    label: "Option C",
    name: "Bento Grid",
    note: "Compact hero + dense mixed tiles above the fold.",
  },
] as const;

function VariantFrame({
  id,
  label,
  name,
  note,
  children,
}: {
  id: string;
  label: string;
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="border-y border-ink-200 bg-ink-25">
        <Container className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
          <p className="type-eyebrow text-ink-500">
            {label} — {name}
          </p>
          <p className="text-sm text-ink-500">{note}</p>
        </Container>
      </div>
      {children}
    </section>
  );
}

export default async function LayoutOptionsPage() {
  const projects = await getProjects();
  const project = projects.find((item) => item.featured) ?? projects[0];

  if (!project) return null;

  return (
    <div>
      <section className="border-b border-ink-800 bg-ink-950 py-20" data-theme="dark">
        <Container>
          <p className="type-eyebrow text-brand-300">Preview — not indexed</p>
          <h1 className="type-display mt-4 text-white">
            Case Study Layout Options
          </h1>
          <p className="type-lead mt-5 max-w-2xl text-ink-300">
            Same content, three layouts, rendered with{" "}
            <strong className="font-semibold text-white">
              {project.title}
            </strong>
            . Scroll to compare, then pick one to promote to the live template.
          </p>
          <nav aria-label="Compare layouts" className="mt-8 flex flex-wrap gap-3">
            {variants.map((variant) => (
              <a
                key={variant.id}
                href={`#${variant.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-300 transition-colors hover:border-brand-400/50 hover:text-white"
              >
                {variant.label} · {variant.name}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      <VariantFrame
        id="option-a"
        label="Option A"
        name="Split Sidebar"
        note="Dark hero + sticky project brief that scrolls beside the story."
      >
        <LayoutSplit project={project} />
      </VariantFrame>

      <VariantFrame
        id="option-b"
        label="Option B"
        name="Narrative Editorial"
        note="Quiet typographic story — meta bar, numbered rows, results band."
      >
        <LayoutNarrative project={project} />
      </VariantFrame>

      <VariantFrame
        id="option-c"
        label="Option C"
        name="Bento Grid"
        note="Compact hero + dense mixed tiles above the fold."
      >
        <LayoutBento project={project} />
      </VariantFrame>
    </div>
  );
}