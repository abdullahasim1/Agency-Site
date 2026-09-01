/**
 * Client logos wall content.
 *
 * Content lives in `src/content/clients.json` and is edited from the Keystatic
 * admin panel at `/keystatic`. This module keeps the `ClientLogo` shape and the
 * `clients` export.
 *
 * The wall renders only when this list is non-empty — see ClientLogos.tsx for
 * why it must never be seeded with placeholder names.
 */

import { v } from "@/lib/asset-version";
import raw from "@/content/clients.json";

interface ClientLogo {
  id: string;
  /** Client name; doubles as the text wordmark when no logo file exists. */
  name: string;
  /** Optional logo path under /logos or /images; falls back to a wordmark. */
  logo?: string;
  /** Optional link out to the client's site. */
  url?: string;
}

const data = raw as unknown as { label?: string; items: ClientLogo[] };

/** Heading shown above the strip on the home page. */
export const clientsLabel = data.label ?? "Trusted by forward-thinking teams";

/** Clients in display order, with content-hashed logo URLs for cache busting. */
export const clients: ClientLogo[] = data.items.map((client) => ({
  ...client,
  logo: client.logo ? v(client.logo) : undefined,
}));
