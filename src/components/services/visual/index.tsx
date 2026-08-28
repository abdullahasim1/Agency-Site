import {
  accentHex,
  VisualPanel,
  type Mockup,
  type ServiceHeroVisualProps,
} from "./types";

/**
 * Per-service hero mockup.
 *
 * A service page has to argue for that one service, so the slug picks a
 * purpose-built drawing of the artefact we actually hand over — a call
 * transcript, an agent trace, a sync map — instead of one generic illustration
 * retinted eight times. Server-rendered inline SVG animated by the keyframes
 * already in globals.css, so it costs zero client JavaScript and is neutralised
 * under prefers-reduced-motion.
 *
 * Mockups are lazily imported per slug to avoid bundling all 8 on every page.
 */

const mockupLoaders: Record<string, () => Promise<{ default: Mockup }>> = {
  "ai-automation": () =>
    import("./automation").then((m) => ({ default: m.automationMockup })),
  "ai-agents": () =>
    import("./agents").then((m) => ({ default: m.agentsMockup })),
  "ai-voice-agents": () =>
    import("./voice").then((m) => ({ default: m.voiceMockup })),
  "web-application-development": () =>
    import("./web").then((m) => ({ default: m.webMockup })),
  "mobile-app-development": () =>
    import("./mobile").then((m) => ({ default: m.mobileMockup })),
  "workflow-automation": () =>
    import("./workflow").then((m) => ({ default: m.workflowMockup })),
  "crm-api-integrations": () =>
    import("./integrations").then((m) => ({ default: m.integrationsMockup })),
  "custom-software-development": () =>
    import("./custom").then((m) => ({ default: m.customMockup })),
};

const fallbackLoader = () =>
  import("./custom").then((m) => ({ default: m.customMockup }));

export async function ServiceHeroVisual({
  slug,
  accent,
  className,
}: ServiceHeroVisualProps) {
  const loader = mockupLoaders[slug] ?? fallbackLoader;
  const { default: mockup } = await loader();

  return (
    <VisualPanel
      accent={accent}
      label={mockup.label}
      description={mockup.description}
      className={className}
    >
      {mockup.body({ tint: accentHex[accent] })}
    </VisualPanel>
  );
}
