"use client";

import { useEffect } from "react";

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (args: Record<string, unknown>) => Promise<string>;
}

interface WebMCPContext {
  registerTool: (
    tool: MCPTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void>;
}

interface WebMCPDocument extends Document {
  modelContext?: WebMCPContext;
}

interface LegacyWebMCPNavigator extends Navigator {
  modelContext?: { provideContext: (tools: MCPTool[]) => void };
}

/** Calls the same-origin MCP endpoint, so previews and production use their own data. */
async function callMCPTool(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  const response = await fetch("/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message ?? `MCP request failed: ${response.status}`);
  }
  if (data.error) {
    throw new Error(data.error.message ?? "MCP tool call failed");
  }

  const text = data.result?.content?.[0]?.text;
  return typeof text === "string" ? text : JSON.stringify(data.result ?? {});
}

const TOOLS: MCPTool[] = [
  {
    name: "get_site_info",
    description:
      "Get basic information about DevRox, including public contact details and services.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: () => callMCPTool("get_site_info", {}),
  },
  {
    name: "list_projects",
    description: "List DevRox portfolio projects and their public case-study metadata.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: () => callMCPTool("list_projects", {}),
  },
  {
    name: "search_projects",
    description:
      "Search DevRox portfolio projects by query with optional filters for technology, language, and category.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search term (title, description, technologies)" },
        filters: {
          type: "object",
          properties: {
            tech: { type: "string", description: "Filter by technology (e.g., React, Python, TensorFlow)" },
            language: { type: "string", description: "Filter by programming language" },
            category: {
              type: "string",
              enum: ["AI", "Automation", "Web Apps", "Mobile", "SaaS"],
              description: "Filter by project category",
            },
          },
          additionalProperties: false,
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: (args) => callMCPTool("search_projects", args),
  },
  {
    name: "search_works",
    description:
      "Search DevRox works (articles, case studies, tutorials) by query with optional type and date filters.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search term" },
        filters: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["article", "video", "tutorial", "case-study"], description: "Content type" },
            date: { type: "string", format: "date", description: "Filter by date (YYYY-MM-DD)" },
          },
          additionalProperties: false,
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: (args) => callMCPTool("search_works", args),
  },
  {
    name: "list_services",
    description: "List DevRox service offerings, descriptions and related technologies.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: () => callMCPTool("list_services", {}),
  },
  {
    name: "submit_enquiry",
    description:
      "Submit a project enquiry to DevRox. This sends the supplied details to DevRox; use only with the end user's confirmation.",
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
  {
    name: "book_meeting",
    description:
      "Get the DevRox meeting booking URL. The user must visit this URL to schedule a meeting.",
    inputSchema: {
      type: "object",
      properties: {
        purpose: { type: "string", description: "Meeting purpose (optional)" },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: (args) => callMCPTool("book_meeting", args),
  },
];

/**
 * Registers browser-local tools on every marketing page.
 *
 * `document.modelContext.registerTool()` is the current WebMCP API. The
 * navigator fallback keeps the tools visible to early browser previews that
 * implemented the previous `provideContext()` proposal. Aborting on unmount
 * removes every current-API tool before a route transition or React remount.
 */
export function WebMCPProvider() {
  useEffect(() => {
    const controller = new AbortController();
    const currentContext = (document as WebMCPDocument).modelContext;

    if (currentContext?.registerTool) {
      void Promise.all(
        TOOLS.map((tool) =>
          currentContext.registerTool(tool, { signal: controller.signal }),
        ),
      )
        .then(() => {
          console.info(
            "[WebMCP] Registered tools:",
            TOOLS.map((tool) => tool.name).join(", "),
          );
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            console.warn("[WebMCP] Failed to register tools:", error);
          }
        });

      return () => controller.abort();
    }

    /* Compatibility with the early navigator-based WebMCP proposal. */
    const legacyContext = (navigator as LegacyWebMCPNavigator).modelContext;
    if (legacyContext?.provideContext) {
      try {
        legacyContext.provideContext(TOOLS);
      } catch (error) {
        console.warn("[WebMCP] Failed to provide legacy context:", error);
      }
    }

    return () => controller.abort();
  }, []);

  return null;
}
