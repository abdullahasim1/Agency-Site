import { agentsMockup } from "./agents";
import { automationMockup } from "./automation";
import { customMockup } from "./custom";
import { integrationsMockup } from "./integrations";
import { mobileMockup } from "./mobile";
import { webMockup } from "./web";
import { workflowMockup } from "./workflow";
import { voiceMockup } from "./voice";
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
 */

const fallbackMockup = customMockup;

const registry: Record<string, Mockup> = {
  "ai-automation": automationMockup,
  "ai-agents": agentsMockup,
  "ai-voice-agents": voiceMockup,
  "web-application-development": webMockup,
  "mobile-app-development": mobileMockup,
  "workflow-automation": workflowMockup,
  "crm-api-integrations": integrationsMockup,
  "custom-software-development": customMockup,
};

export function ServiceHeroVisual({
  slug,
  accent,
  className,
}: ServiceHeroVisualProps) {
  const mockup = registry[slug] ?? fallbackMockup;

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
