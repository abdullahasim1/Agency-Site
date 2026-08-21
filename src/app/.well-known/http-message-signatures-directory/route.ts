import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * HTTP Message Signatures Directory (Web Bot Auth) — publishes a JWKS so
 * receiving sites can verify signed requests from this origin when it acts
 * as a bot/agent.
 *
 * In production, generate a key pair (e.g. ES256 or EdDSA), store the private
 * key securely for signing outbound requests, and publish the public key here.
 *
 * See: https://datatracker.ietf.org/wg/webbotauth/about/
 *      https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  // Placeholder JWKS — replace with real public key in production
  // Generate with: openssl ecparam -name prime256v1 -genkey -noout -out private.pem
  // Then: openssl ec -in private.pem -pubout -out public.pem
  // Use the public key coordinates for the JWK below.
  const jwks = {
    keys: [
      {
        kty: "EC",
        crv: "P-256",
        alg: "ES256",
        use: "sig",
        kid: "devrox-web-bot-auth-1",
        x: "REPLACE_WITH_REAL_X_COORDINATE",
        y: "REPLACE_WITH_REAL_Y_COORDINATE",
      },
    ],
  };

  return new NextResponse(JSON.stringify(jwks, null, 2), {
    headers: {
      "Content-Type": "application/jwk-set+json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}