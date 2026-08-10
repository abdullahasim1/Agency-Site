import { makeRouteHandler } from "@keystatic/next/route-handler";

import { isKeystaticEnabled } from "@/lib/keystatic-mode";

import config from "../../../../../keystatic.config";

/**
 * The admin panel's API.
 *
 * In local mode this endpoint writes files with no sign-in, so it is only
 * mounted when the panel is actually configured — otherwise both methods
 * answer 404, exactly as if the route did not exist. See
 * `src/lib/keystatic-mode.ts` for how that is decided.
 */
const notFound = () => new Response("Not Found", { status: 404 });

const handlers = isKeystaticEnabled
  ? makeRouteHandler({ config })
  : { GET: notFound, POST: notFound };

export const { GET, POST } = handlers;
