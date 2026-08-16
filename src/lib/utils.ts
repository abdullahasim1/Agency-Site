/**
 * Minimal class-name joiner.
 *
 * Deliberately not clsx/tailwind-merge: the component API here uses explicit
 * variant maps rather than overriding classes, so conflict resolution is not
 * needed and the dependency would not earn its place.
 */
type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassValue[];

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (Array.isArray(value)) {
      const inner = cn(...value);
      if (inner) out.push(inner);
    } else {
      out.push(String(value));
    }
  }
  return out.join(" ");
}
