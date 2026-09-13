export default function Loading() {
  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-6 dark:bg-zinc-950 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <header className="mb-7">
          <div className="space-y-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          </div>
        </header>

        {/* Profile */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Cover */}
          <div className="relative h-24 overflow-hidden bg-zinc-100 dark:bg-zinc-800 sm:h-28">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>

          <div className="px-5 pb-6 sm:px-7">
            {/* Avatar / Edit */}
            <div className="-mt-11 flex items-end justify-between gap-4">
              <div className="relative">
                <div className="h-[88px] w-[88px] animate-pulse rounded-full border-4 border-white bg-zinc-200 shadow-md dark:border-zinc-900 dark:bg-zinc-800 sm:h-24 sm:w-24">
                  <div className="skeleton-shimmer rounded-full" />
                </div>
              </div>

              <Skeleton className="h-9 w-24 rounded-lg sm:w-28" />
            </div>

            {/* User information */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-40 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>

              <Skeleton className="mt-2 h-4 w-24 rounded-md" />
            </div>

            {/* Personal information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoSkeleton />
              <InfoSkeleton />
              <InfoSkeleton />
              <InfoSkeleton />
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-8">
          {/* Section heading */}
          <div className="mb-3 px-1">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="mt-2 h-3 w-72 max-w-full rounded-md" />
          </div>

          {/* Actions */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <ActionSkeleton />
            <Divider />
            <ActionSkeleton />
            <Divider />
            <ActionSkeleton />
            <Divider />
            <ActionSkeleton />
          </div>
        </section>

        {/* Account status */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>
      </div>

      {/* Shimmer animation */}
      <style jsx global>{`
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }

        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.45),
            transparent
          );
          animation: shimmer 1.6s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer::after {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

/* -------------------------------- */
/* Base Skeleton */
/* -------------------------------- */

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 ${className}`}
    />
  );
}

/* -------------------------------- */
/* Information Skeleton */
/* -------------------------------- */

function InfoSkeleton() {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
      {/* Icon */}
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Skeleton className="h-3 w-16 rounded" />

        <Skeleton className="mt-2 h-4 w-32 max-w-full rounded-md" />
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Account Action Skeleton */
/* -------------------------------- */

function ActionSkeleton() {
  return (
    <div className="flex w-full items-center gap-4 px-4 py-4 sm:px-5 sm:py-4.5">
      {/* Icon */}
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />

      {/* Text */}
      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-40 rounded-md" />

        <Skeleton className="mt-2 h-3 w-64 max-w-[85%] rounded-md" />
      </div>

      {/* Chevron */}
      <Skeleton className="h-4 w-4 shrink-0 rounded" />
    </div>
  );
}

/* -------------------------------- */
/* Divider */
/* -------------------------------- */

function Divider() {
  return (
    <div className="mx-5 h-px bg-zinc-100 dark:bg-zinc-800" />
  );
}
