import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { clients, clientsLabel } from "@/data/clients";
import { imageSize } from "@/lib/image-size";
import { cn } from "@/lib/utils";

/**
 * Client logos wall — the social-proof strip under the hero.
 *
 * Renders nothing while the client list in the Keystatic panel is empty, by
 * design: an agency logos wall only works when every name on it is real and
 * recognisable. Add clients (Home page → Client logos) and the section
 * appears; empty the list again and it disappears with no code change.
 *
 * Entries with a logo file show the logo at a uniform height; entries without
 * fall back to a typographic wordmark so the wall can go live before every
 * logo asset has been collected. The track reuses the same CSS marquee engine
 * as the technology strip, so this ships no JavaScript.
 */
export async function ClientLogos({ className }: { className?: string }) {
  if (clients.length === 0) return null;

  /* Logo files get their intrinsic size read once at build time. */
  const sized = await Promise.all(
    clients.map(async (client) => ({
      ...client,
      size: client.logo ? await imageSize(client.logo) : undefined,
    })),
  );

  const items = (copy: number) =>
    sized.map((client) => {
      const content = client.size ? (
        <Image
          src={client.logo!}
          alt={client.name}
          width={client.size.width}
          height={client.size.height}
          className="h-7 w-auto object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 sm:h-8"
        />
      ) : (
        <span className="font-mono text-sm whitespace-nowrap text-ink-500 transition-colors duration-300 hover:text-ink-800">
          {client.name}
        </span>
      );

      return (
        <li key={`${copy}-${client.id}`} className="flex shrink-0 items-center px-6">
          {client.url ? (
            <a
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={client.name}
              title={client.name}
            >
              {content}
            </a>
          ) : (
            content
          )}
        </li>
      );
    });

  return (
    <section aria-label={clientsLabel} className={cn("section-y-sm bg-white", className)}>
      <Container>
        <p className="type-eyebrow text-center text-ink-500">{clientsLabel}</p>
      </Container>

      <div className="marquee-track mask-fade-x relative mt-8 overflow-hidden">
        <div className="animate-marquee flex w-full pr-3.5">
          {/* Second copy is decorative: the first already names every client. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 items-center"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {items(copy)}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
