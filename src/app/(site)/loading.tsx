import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <div className="min-h-[80vh] w-full py-16 sm:py-24">
      <Container>
        {/* Header Skeleton */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow badge skeleton */}
          <div className="mx-auto mb-4 h-6 w-32 animate-pulse rounded-full bg-ink-100 dark:bg-white/10" />

          {/* Headline skeleton */}
          <div className="mx-auto h-12 w-3/4 animate-pulse rounded-xl bg-ink-200/80 dark:bg-white/15" />

          {/* Subtitle skeleton */}
          <div className="mx-auto mt-4 h-5 w-1/2 animate-pulse rounded-lg bg-ink-100 dark:bg-white/10" />
        </div>

        {/* Content Skeleton Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="relative isolate overflow-hidden rounded-card border border-ink-200/70 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/[0.03]"
            >
              {/* Image / Icon skeleton */}
              <div className="h-44 w-full animate-pulse rounded-lg bg-ink-100/90 dark:bg-white/10" />

              {/* Title skeleton */}
              <div className="mt-5 h-6 w-2/3 animate-pulse rounded-md bg-ink-200/70 dark:bg-white/15" />

              {/* Text lines skeleton */}
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-ink-100/80 dark:bg-white/10" />
                <div className="h-4 w-4/5 animate-pulse rounded-md bg-ink-100/80 dark:bg-white/10" />
              </div>

              {/* Tag / metadata pill */}
              <div className="mt-6 flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-ink-100 dark:bg-white/10" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-ink-100 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
