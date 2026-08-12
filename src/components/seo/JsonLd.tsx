/**
 * A single JSON-LD block.
 *
 * Wraps the `dangerouslySetInnerHTML` call that every route used to repeat.
 * The name is accurate here: the object always comes from our own content
 * files and config, never from a request, so there is nothing to escape — but
 * keeping it in one place means there is only one line to audit if that ever
 * changes.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
