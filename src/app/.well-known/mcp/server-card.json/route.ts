import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * MCP Server Card (SEP-1649) — advertises an MCP server for agent discovery.
 * We also serve a minimal JSON-RPC 2.0 MCP server at /mcp.
 */

export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const card = {
    serverInfo: {
      name: "DevRox Agency MCP",
      version: "1.0.0",
      description:
        "Read-only MCP server exposing DevRox portfolio data, site info and contact submission capability.",
    },
    transport: {
      type: "http+jsonrpc",
      endpoint: `${base}/mcp`,
      protocols: ["mcp/2025-06-18"],
    },
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
      logging: false,
    },
  };

  return new NextResponse(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}