/**
 * Icon registry.
 *
 * Data files reference icons by name so that content stays free of JSX.
 * Icons are lazily imported on demand to keep the initial bundle small.
 * optimizePackageImports in next.config.ts helps with lucide-react tree-shaking.
 */

import type { ComponentType, SVGProps } from "react";

type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const iconLoaders: Record<string, () => Promise<{ default: LucideIcon }>> = {
  Activity: () => import("lucide-react").then((m) => ({ default: m.Activity })),
  Airplay: () => import("lucide-react").then((m) => ({ default: m.Airplay })),
  AlarmClock: () => import("lucide-react").then((m) => ({ default: m.AlarmClock })),
  ArrowRightLeft: () => import("lucide-react").then((m) => ({ default: m.ArrowRightLeft })),
  BarChart3: () => import("lucide-react").then((m) => ({ default: m.BarChart3 })),
  Bot: () => import("lucide-react").then((m) => ({ default: m.Bot })),
  Boxes: () => import("lucide-react").then((m) => ({ default: m.Boxes })),
  Brain: () => import("lucide-react").then((m) => ({ default: m.Brain })),
  BrainCircuit: () => import("lucide-react").then((m) => ({ default: m.BrainCircuit })),
  Briefcase: () => import("lucide-react").then((m) => ({ default: m.Briefcase })),
  Bug: () => import("lucide-react").then((m) => ({ default: m.Bug })),
  Building2: () => import("lucide-react").then((m) => ({ default: m.Building2 })),
  Calendar: () => import("lucide-react").then((m) => ({ default: m.Calendar })),
  ChartNoAxesCombined: () => import("lucide-react").then((m) => ({ default: m.ChartNoAxesCombined })),
  ClipboardCheck: () => import("lucide-react").then((m) => ({ default: m.ClipboardCheck })),
  ClipboardList: () => import("lucide-react").then((m) => ({ default: m.ClipboardList })),
  Cloud: () => import("lucide-react").then((m) => ({ default: m.Cloud })),
  Code2: () => import("lucide-react").then((m) => ({ default: m.Code2 })),
  Compass: () => import("lucide-react").then((m) => ({ default: m.Compass })),
  Component: () => import("lucide-react").then((m) => ({ default: m.Component })),
  Cpu: () => import("lucide-react").then((m) => ({ default: m.Cpu })),
  CreditCard: () => import("lucide-react").then((m) => ({ default: m.CreditCard })),
  Database: () => import("lucide-react").then((m) => ({ default: m.Database })),
  DatabaseBackup: () => import("lucide-react").then((m) => ({ default: m.DatabaseBackup })),
  FileClock: () => import("lucide-react").then((m) => ({ default: m.FileClock })),
  FileDown: () => import("lucide-react").then((m) => ({ default: m.FileDown })),
  FileOutput: () => import("lucide-react").then((m) => ({ default: m.FileOutput })),
  FileSearch: () => import("lucide-react").then((m) => ({ default: m.FileSearch })),
  FileSpreadsheet: () => import("lucide-react").then((m) => ({ default: m.FileSpreadsheet })),
  FileText: () => import("lucide-react").then((m) => ({ default: m.FileText })),
  Files: () => import("lucide-react").then((m) => ({ default: m.Files })),
  Fingerprint: () => import("lucide-react").then((m) => ({ default: m.Fingerprint })),
  FunctionSquare: () => import("lucide-react").then((m) => ({ default: m.FunctionSquare })),
  Gauge: () => import("lucide-react").then((m) => ({ default: m.Gauge })),
  GitBranch: () => import("lucide-react").then((m) => ({ default: m.GitBranch })),
  GitFork: () => import("lucide-react").then((m) => ({ default: m.GitFork })),
  Globe: () => import("lucide-react").then((m) => ({ default: m.Globe })),
  GraduationCap: () => import("lucide-react").then((m) => ({ default: m.GraduationCap })),
  Handshake: () => import("lucide-react").then((m) => ({ default: m.Handshake })),
  Headphones: () => import("lucide-react").then((m) => ({ default: m.Headphones })),
  Heart: () => import("lucide-react").then((m) => ({ default: m.Heart })),
  Image: () => import("lucide-react").then((m) => ({ default: m.Image })),
  Inbox: () => import("lucide-react").then((m) => ({ default: m.Inbox })),
  Layers: () => import("lucide-react").then((m) => ({ default: m.Layers })),
  Layers3: () => import("lucide-react").then((m) => ({ default: m.Layers3 })),
  LayoutDashboard: () => import("lucide-react").then((m) => ({ default: m.LayoutDashboard })),
  LifeBuoy: () => import("lucide-react").then((m) => ({ default: m.LifeBuoy })),
  Lightbulb: () => import("lucide-react").then((m) => ({ default: m.Lightbulb })),
  LineChart: () => import("lucide-react").then((m) => ({ default: m.LineChart })),
  Lock: () => import("lucide-react").then((m) => ({ default: m.Lock })),
  LockKeyhole: () => import("lucide-react").then((m) => ({ default: m.LockKeyhole })),
  MessagesSquare: () => import("lucide-react").then((m) => ({ default: m.MessagesSquare })),
  Mic: () => import("lucide-react").then((m) => ({ default: m.Mic })),
  Monitor: () => import("lucide-react").then((m) => ({ default: m.Monitor })),
  Network: () => import("lucide-react").then((m) => ({ default: m.Network })),
  Package: () => import("lucide-react").then((m) => ({ default: m.Package })),
  PanelsTopLeft: () => import("lucide-react").then((m) => ({ default: m.PanelsTopLeft })),
  PhoneCall: () => import("lucide-react").then((m) => ({ default: m.PhoneCall })),
  PlugZap: () => import("lucide-react").then((m) => ({ default: m.PlugZap })),
  Puzzle: () => import("lucide-react").then((m) => ({ default: m.Puzzle })),
  Radar: () => import("lucide-react").then((m) => ({ default: m.Radar })),
  Receipt: () => import("lucide-react").then((m) => ({ default: m.Receipt })),
  RefreshCw: () => import("lucide-react").then((m) => ({ default: m.RefreshCw })),
  Repeat2: () => import("lucide-react").then((m) => ({ default: m.Repeat2 })),
  Rocket: () => import("lucide-react").then((m) => ({ default: m.Rocket })),
  Route: () => import("lucide-react").then((m) => ({ default: m.Route })),
  Scale: () => import("lucide-react").then((m) => ({ default: m.Scale })),
  ScanLine: () => import("lucide-react").then((m) => ({ default: m.ScanLine })),
  Search: () => import("lucide-react").then((m) => ({ default: m.Search })),
  Send: () => import("lucide-react").then((m) => ({ default: m.Send })),
  Server: () => import("lucide-react").then((m) => ({ default: m.Server })),
  Shield: () => import("lucide-react").then((m) => ({ default: m.Shield })),
  ShieldAlert: () => import("lucide-react").then((m) => ({ default: m.ShieldAlert })),
  ShieldCheck: () => import("lucide-react").then((m) => ({ default: m.ShieldCheck })),
  ShoppingCart: () => import("lucide-react").then((m) => ({ default: m.ShoppingCart })),
  Smartphone: () => import("lucide-react").then((m) => ({ default: m.Smartphone })),
  Sparkles: () => import("lucide-react").then((m) => ({ default: m.Sparkles })),
  Stethoscope: () => import("lucide-react").then((m) => ({ default: m.Stethoscope })),
  Target: () => import("lucide-react").then((m) => ({ default: m.Target })),
  TestTube: () => import("lucide-react").then((m) => ({ default: m.TestTube })),
  Timer: () => import("lucide-react").then((m) => ({ default: m.Timer })),
  Truck: () => import("lucide-react").then((m) => ({ default: m.Truck })),
  TriangleAlert: () => import("lucide-react").then((m) => ({ default: m.TriangleAlert })),
  Users: () => import("lucide-react").then((m) => ({ default: m.Users })),
  Wallet: () => import("lucide-react").then((m) => ({ default: m.Wallet })),
  WalletCards: () => import("lucide-react").then((m) => ({ default: m.WalletCards })),
  Wand2: () => import("lucide-react").then((m) => ({ default: m.Wand2 })),
  Webhook: () => import("lucide-react").then((m) => ({ default: m.Webhook })),
  WifiOff: () => import("lucide-react").then((m) => ({ default: m.WifiOff })),
  Workflow: () => import("lucide-react").then((m) => ({ default: m.Workflow })),
  Wrench: () => import("lucide-react").then((m) => ({ default: m.Wrench })),
  Zap: () => import("lucide-react").then((m) => ({ default: m.Zap })),
  CheckCircle2: () => import("lucide-react").then((m) => ({ default: m.CheckCircle2 })),
  CheckCircle: () => import("lucide-react").then((m) => ({ default: m.CheckCircle2 })),
  AlertTriangle: () => import("lucide-react").then((m) => ({ default: m.TriangleAlert })),
  TrendingUp: () => import("lucide-react").then((m) => ({ default: m.TrendingUp })),
  Sliders: () => import("lucide-react").then((m) => ({ default: m.Sliders })),
  Key: () => import("lucide-react").then((m) => ({ default: m.Key })),
  Terminal: () => import("lucide-react").then((m) => ({ default: m.Terminal })),
  Star: () => import("lucide-react").then((m) => ({ default: m.Star })),
  Award: () => import("lucide-react").then((m) => ({ default: m.Award })),
  Trophy: () => import("lucide-react").then((m) => ({ default: m.Trophy })),
  Smile: () => import("lucide-react").then((m) => ({ default: m.Smile })),
  HeartHandshake: () => import("lucide-react").then((m) => ({ default: m.HeartHandshake })),
  UserCheck: () => import("lucide-react").then((m) => ({ default: m.UserCheck })),
};

export type IconName = keyof typeof iconLoaders | (string & {});

/**
 * Synchronous icon name registry for Keystatic dropdowns.
 * Only the names are exported — actual icon components are lazy-loaded via loadIcon().
 */
export const iconRegistry = Object.fromEntries(
  Object.keys(iconLoaders).map((name) => [name, name]),
) as Record<string, string>;

/**
 * Normalizes an icon name to PascalCase:
 * "webhook" -> "Webhook", "check-circle-2" -> "CheckCircle2", "alert_triangle" -> "AlertTriangle"
 */
function toPascalCase(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .replace(/[-_ ]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

/**
 * Common keyword / legacy aliases to modern Lucide icon names.
 */
const iconAliases: Record<string, string> = {
  ai: "BrainCircuit",
  robot: "Bot",
  api: "Webhook",
  webhook: "Webhook",
  security: "ShieldCheck",
  secure: "ShieldCheck",
  speed: "Zap",
  fast: "Zap",
  performance: "Gauge",
  analytics: "BarChart3",
  chart: "BarChart3",
  chat: "MessagesSquare",
  message: "MessagesSquare",
  mobile: "Smartphone",
  web: "Globe",
  integration: "PlugZap",
  sync: "RefreshCw",
  automation: "Workflow",
  settings: "Wrench",
  time: "Timer",
  clock: "Timer",
  star: "Sparkles",
  success: "CheckCircle2",
  check: "CheckCircle2",
  checkcircle: "CheckCircle2",
  warning: "TriangleAlert",
  alert: "TriangleAlert",
  alerttriangle: "TriangleAlert",
  error: "ShieldAlert",
  code: "Code2",
  dev: "Code2",
  database: "Database",
  db: "Database",
  cloud: "Cloud",
};

/**
 * Universal dynamic icon loader.
 * Resolves bundled icons, converts naming variations, checks aliases,
 * dynamically loads any of the 1,400+ Lucide icons, and gracefully falls back to Sparkles.
 * Never returns undefined, so layout never renders a broken/empty box.
 */
export async function loadIcon(name: string): Promise<LucideIcon> {
  if (!name || typeof name !== "string") {
    const fallback = await iconLoaders.Sparkles();
    return fallback.default;
  }

  const trimmed = name.trim();

  // 1. Direct match in iconLoaders
  if (iconLoaders[trimmed]) {
    const { default: Icon } = await iconLoaders[trimmed]();
    return Icon;
  }

  // 2. PascalCase conversion (e.g. "webhook" -> "Webhook", "check-circle-2" -> "CheckCircle2")
  const pascal = toPascalCase(trimmed);
  if (iconLoaders[pascal]) {
    const { default: Icon } = await iconLoaders[pascal]();
    return Icon;
  }

  // 3. Alias dictionary check
  const lower = trimmed.toLowerCase();
  const alias = iconAliases[lower] || iconAliases[pascal];
  if (alias && iconLoaders[alias]) {
    const { default: Icon } = await iconLoaders[alias]();
    return Icon;
  }

  // 4. Dynamic import from lucide-react (access to all 1,400+ icons!)
  try {
    const lucide = await import("lucide-react");
    const candidateName =
      pascal in lucide
        ? pascal
        : alias && alias in lucide
          ? alias
          : trimmed in lucide
            ? trimmed
            : undefined;

    if (candidateName) {
      const CandidateIcon = (lucide as Record<string, unknown>)[
        candidateName
      ] as LucideIcon | undefined;
      if (CandidateIcon) return CandidateIcon;
    }
  } catch {
    // Dynamic import fallback
  }

  // 5. Fallback icon so layout never renders empty box
  const fallback = await iconLoaders.Sparkles();
  return fallback.default;
}
