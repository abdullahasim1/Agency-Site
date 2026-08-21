import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_SITE_URL ? "deployed" : "dev",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
      },
    },
  );
}