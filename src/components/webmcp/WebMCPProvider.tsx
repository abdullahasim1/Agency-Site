"use client";

import { useEffect } from "react";

import { siteConfig } from "@/data/site";

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

async function callMCPTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const base = siteConfig.url;
  const response = await fetch(`${base}/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message ?? "MCP tool call failed");
  }
  return data.result?.content?.[0]?.text ?? data.result;
}

const TOOLS: MCPTool[] = [
  {
    name: "get_site_info",
    description: "Get basic information about DevRox (name, tagline, contact, services list).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    execute: () => callMCPTool("get_site_info", {}),
  },
  {
    name: "list_projects",
    description: "Get all DevRox portfolio projects with metadata.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    execute: () => callMCPTool("list_projects", {}),
  },
  {
    name: "list_services",
    description: "Get all DevRox service offerings with descriptions.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    execute: () => callMCPTool("list_services", {}),
  },
  {
    name: "submit_enquiry",
    description:
      "Submit a project enquiry to DevRox. Requires fullName, email, projectType, message. Optional: company, phone, budget.",
    inputSchema: {
      type: "object",
      required: ["fullName", "email", "projectType", "message"],
      properties: {
        fullName: { type: "string", minLength: 2, maxLength: 100 },
        email: { type: "string", format: "email", maxLength: 254 },
        company: { type: "string", maxLength: 120 },
        phone: { type: "string", maxLength: 30 },
        projectType: { type: "string", minLength: 2, maxLength: 60 },
        budget: { type: "string", maxLength: 60 },
        message: { type: "string", minLength: 20, maxLength: 5000 },
      },
      additionalProperties: false,
    },
    execute: (args) => callMCPTool("submit_enquiry", args),
  },
];

export function WebMCPProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const modelContext = (navigator as unknown as { modelContext?: { provideContext: (tools: MCPTool[]) => void } }).modelContext;
    if (!modelContext?.provideContext) {
      console.debug("[WebMCP] navigator.modelContext.provideContext not available");
      return;
    }

    try {
      modelContext.provideContext(TOOLS);
      console.info("[WebMCP] Registered tools:", TOOLS.map((t) => t.name).join(", "));
    } catch (error) {
      console.warn("[WebMCP] Failed to register tools:", error);
    }
  }, []);

  return null;
}