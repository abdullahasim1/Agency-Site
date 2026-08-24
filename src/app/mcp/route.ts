import { NextRequest, NextResponse } from "next/server";

import { siteConfig } from "@/data/site";
import { getProjects } from "@/data/projects";
import { getServices } from "@/data/services";
import type { ProjectCategory } from "@/data/projects";

/**
 * Minimal MCP (Model Context Protocol) server — JSON-RPC 2.0 over HTTP.
 *
 * Supports:
 * - initialize
 * - tools/list
 * - tools/call
 * - notifications/initialized
 */

// Tool definitions
const TOOLS = [
  {
    name: "get_site_info",
    description: "Get basic information about DevRox (name, tagline, contact, services list).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_projects",
    description: "Get all DevRox portfolio projects with metadata.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
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
  },
  {
    name: "list_services",
    description: "Get all DevRox service offerings with descriptions.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
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
  },
];

const SERVER_INFO = {
  name: "DevRox Agency MCP",
  version: "1.0.0",
};

function jsonRpcResponse(id: string | number | null, result?: unknown, error?: { code: number; message: string }) {
  const body: Record<string, unknown> = { jsonrpc: "2.0", id };
  if (error) body.error = error;
  else body.result = result;
  return NextResponse.json(body);
}

function jsonRpcError(id: string | number | null, code: number, message: string) {
  return jsonRpcResponse(id, undefined, { code, message });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  const rpc = body as Record<string, unknown>;
  const id = (rpc.id ?? null) as string | number | null;
  const method = rpc.method as string;

  if (!method) return jsonRpcError(id, -32600, "Invalid Request");

  switch (method) {
    case "initialize":
      return jsonRpcResponse(id, {
        protocolVersion: "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case "notifications/initialized":
      // No response for notifications
      return new NextResponse(null, { status: 204 });

    case "tools/list":
      return jsonRpcResponse(id, { tools: TOOLS });

    case "tools/call": {
      const params = rpc.params as { name: string; arguments?: Record<string, unknown> } | undefined;
      if (!params?.name) return jsonRpcError(id, -32602, "Invalid params: missing tool name");

      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return jsonRpcError(id, -32601, `Tool not found: ${params.name}`);

      try {
        let result: unknown;

        switch (params.name) {
          case "get_site_info": {
            result = {
              name: siteConfig.name,
              legalName: siteConfig.legalName,
              tagline: siteConfig.tagline,
              description: siteConfig.description,
              shortDescription: siteConfig.shortDescription,
              url: siteConfig.url,
              contact: {
                email: siteConfig.contact.email,
                whatsapp: siteConfig.contact.whatsapp,
                whatsappHref: siteConfig.contact.whatsappHref,
                location: siteConfig.contact.location,
                hours: siteConfig.contact.hours,
                responseTime: siteConfig.contact.responseTime,
              },
              social: siteConfig.social,
              twitterHandle: siteConfig.twitterHandle,
            };
            break;
          }

          case "list_projects": {
            const projects = await getProjects();
            result = projects.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              tagline: p.tagline,
              category: p.category,
              technologies: p.technologies,
              shortDescription: p.shortDescription,
              caseStudyUrl: `${siteConfig.url}/portfolio/${p.slug}`,
            }));
            break;
          }

          case "search_projects": {
            const args = params.arguments ?? {};
            const query = (args.query as string)?.toLowerCase() ?? "";
            const filters = (args.filters as Record<string, string>) ?? {};

            const projects = await getProjects();
            const filtered = projects.filter((p) => {
              const haystack = [
                p.title,
                p.tagline,
                p.shortDescription,
                p.fullDescription,
                p.category,
                ...p.technologies,
              ]
                .join(" ")
                .toLowerCase();

              if (query && !haystack.includes(query)) return false;

              if (filters.tech && !p.technologies.some((t) => t.toLowerCase().includes(filters.tech!.toLowerCase()))) {
                return false;
              }
              if (filters.language && !p.technologies.some((t) => t.toLowerCase().includes(filters.language!.toLowerCase()))) {
                return false;
              }
              if (filters.category && !p.categories.includes(filters.category as ProjectCategory)) {
                return false;
              }

              return true;
            });

            result = filtered.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              tagline: p.tagline,
              category: p.category,
              technologies: p.technologies,
              shortDescription: p.shortDescription,
              caseStudyUrl: `${siteConfig.url}/portfolio/${p.slug}`,
            }));
            break;
          }

          case "list_services": {
            const services = await getServices();
            result = services.map((s) => ({
              id: s.id,
              slug: s.slug,
              title: s.title,
              navLabel: s.navLabel,
              shortDescription: s.shortDescription,
              fullDescription: s.fullDescription,
              technologies: s.technologies,
              deliverables: s.deliverables,
              useCases: s.useCases,
              relatedProjects: s.relatedProjects,
              url: `${siteConfig.url}/services/${s.slug}`,
            }));
            break;
          }

          case "submit_enquiry": {
            const args = params.arguments ?? {};
            const { fullName, email, projectType, message, company, phone, budget } = args as Record<
              string,
              unknown
            >;

            // Validate required fields
            if (
              !fullName ||
              typeof fullName !== "string" ||
              fullName.length < 2
            ) {
              return jsonRpcError(id, -32602, "fullName is required (min 2 chars)");
            }
            if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
              return jsonRpcError(id, -32602, "email is required and must be valid");
            }
            if (!projectType || typeof projectType !== "string" || projectType.length < 2) {
              return jsonRpcError(id, -32602, "projectType is required");
            }
            if (!message || typeof message !== "string" || message.length < 20) {
              return jsonRpcError(id, -32602, "message is required (min 20 chars)");
            }

            // Call the internal contact API
            const contactRes = await fetch(new URL("/api/contact", siteConfig.url).toString(), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fullName,
                email,
                company: company ?? "",
                phone: phone ?? "",
                projectType,
                budget: budget ?? "",
                message,
                website: "", // honeypot
              }),
            });

            const contactData = await contactRes.json();
            if (!contactRes.ok) {
              return jsonRpcError(id, -32603, contactData.message ?? "Failed to submit enquiry");
            }

            result = contactData;
            break;
          }

          case "book_meeting": {
            const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
            if (!bookingUrl) {
              result = {
                message:
                  "Meeting booking is not configured. Please contact via email or contact form.",
                email: siteConfig.contact.email,
                contactForm: `${siteConfig.url}/contact`,
              };
            } else {
              result = {
                bookingUrl,
                message: "Visit this URL to schedule a meeting with DevRox.",
              };
            }
            break;
          }

          default:
            return jsonRpcError(id, -32601, `Tool not found: ${params.name}`);
        }

        return jsonRpcResponse(id, {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        });
      } catch (err) {
        console.error("[mcp] tool error:", err);
        return jsonRpcError(id, -32603, `Internal error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    default:
      return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}

// OPTIONS for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}