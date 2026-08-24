/**
 * WebMCP tool definitions for browser-resident AI agents.
 *
 * Registration runs from a parse-time inline script rather than a React
 * effect. Detectors and browser agents snapshot the model context around the
 * page's load event, which races React hydration — an effect-based provider
 * was verified as "no tools registered" even though it worked in a real
 * session. Injecting the script into the HTML guarantees the tools exist
 * before any post-load sampling.
 *
 * Implementations disagree on where the context lives, so both surfaces are
 * registered when present:
 *
 * - `document.modelContext` — current WICG proposal (`registerTool`)
 * - `navigator.modelContext` — Chrome origin-trial shape (`registerTool`,
 *   with `provideContext` accepted for early builds)
 *
 * A guard flag keeps repeat renders from double-registering, and teardown is
 * unnecessary: the provider sits in the (site) layout for the document's whole
 * lifetime, so aborting on unmount would only fire at navigation-away.
 */

interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
}

const TOOL_DEFINITIONS: MCPToolDefinition[] = [
  {
    name: "get_site_info",
    description:
      "Get basic information about DevRox, including public contact details and services.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: "list_projects",
    description:
      "List DevRox portfolio projects and their public case-study metadata.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: "search_projects",
    description:
      "Search DevRox portfolio projects by query with optional filters for technology, language, and category.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term (title, description, technologies)",
        },
        filters: {
          type: "object",
          properties: {
            tech: {
              type: "string",
              description:
                "Filter by technology (e.g., React, Python, TensorFlow)",
            },
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
  },
  {
    name: "list_services",
    description:
      "List DevRox service offerings, descriptions and related technologies.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
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
  },
];

/*
 * Every tool proxies to the same-origin `/mcp` JSON-RPC endpoint, so preview
 * and production each serve their own data and this bundle carries no content
 * logic. The script is ES5-shaped deliberately: it must parse everywhere the
 * page does, before any module code has necessarily run.
 */
const WEBMCP_SCRIPT = `(function () {
  if (window.__devroxWebMCPRegistered) return;
  window.__devroxWebMCPRegistered = true;
  var defs = ${JSON.stringify(TOOL_DEFINITIONS).replace(/</g, "\\u003c")};
  var controller = typeof AbortController === "function" ? new AbortController() : null;

  function execute(name, args) {
    return fetch("/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        method: "tools/call",
        params: { name: name, arguments: args }
      })
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error((data.error && data.error.message) || "MCP request failed: " + response.status);
        }
        if (data.error) {
          throw new Error(data.error.message || "MCP tool call failed");
        }
        var text = data.result && data.result.content && data.result.content[0] && data.result.content[0].text;
        return typeof text === "string" ? text : JSON.stringify(data.result == null ? {} : data.result);
      });
    });
  }

  function bind(def) {
    return Object.assign({}, def, {
      execute: function (args) { return execute(def.name, args || {}); }
    });
  }

  function registerIn(context) {
    if (!context) return false;
    try {
      if (typeof context.registerTool === "function") {
        defs.forEach(function (def) {
          var options = controller ? { signal: controller.signal } : undefined;
          var result = context.registerTool(bind(def), options);
          if (result && typeof result.catch === "function") {
            result.catch(function () {});
          }
        });
        return true;
      }
      if (typeof context.provideContext === "function") {
        context.provideContext(defs.map(bind));
        return true;
      }
    } catch (error) {
      if (window.console && console.warn) console.warn("[WebMCP] registration failed:", error);
    }
    return false;
  }

  registerIn(document.modelContext);
  registerIn(navigator.modelContext);
})();`;

/** Renders the parse-time registration script; see the file header. */
export function WebMCPProvider() {
  return (
    <script
      id="webmcp-tools"
      dangerouslySetInnerHTML={{ __html: WEBMCP_SCRIPT }}
    />
  );
}
