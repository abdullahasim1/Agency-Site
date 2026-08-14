/**
 * A single JSON-LD block.
 *
 * Wraps the `dangerouslySetInnerHTML` call that every route used to repeat.
 * The object always comes from our own content files and config, never from a
 * request — but the panel makes that content editable, so every `<`, `>` and
 * `&` is escaped to its `\uXXXX` form before the JSON is placed inside the
 * `<script>` tag. That keeps a value like `</script><script>…` inert even if
 * one is ever written through the panel. `JSON.stringify` alone does not do
 * this, which is why the escape step exists.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}