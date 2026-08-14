import { makeRouteHandler } from "@keystatic/next/route-handler";

import { isKeystaticEnabled } from "@/lib/keystatic-enabled";

import config from "../../../../../keystatic.config";

/**
 * The admin panel's API.
 *
 * In local mode this endpoint writes files with no sign-in, so it is gated on
 * every request — not just at module load — by the same check that guards the
 * panel itself: production needs GitHub mode plus all three secrets, and in
 * development only loopback hosts pass. Anything else answers 404, exactly as
 * if the route did not exist. See `src/lib/keystatic-enabled.ts` for how that
 * is decided.
 */
const notFound = () => new Response("Not Found", { status: 404 });

const handlers = makeRouteHandler({ config });

async function handle(request: Request, method: "GET" | "POST") {
  if (!isKeystaticEnabled(request.headers.get("host") ?? undefined)) {
    return notFound();
  }
  return handlers[method](request);
}

export const GET = (request: Request) => handle(request, "GET");
export const POST = (request: Request) => handle(request, "POST");