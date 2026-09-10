export default function Loading() {
  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <div>
            <div className="h-7 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />

            <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </header>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Cover */}
          <div className="h-20 animate-pulse bg-zinc-100 dark:bg-zinc-800/80" />

          <div className="px-5 pb-6 sm:px-7">
            {/* Avatar + Button */}
            <div className="-mt-10 flex items-end justify-between gap-4">
              <div className="h-20 w-20 animate-pulse rounded-full border-4 border-white bg-zinc-200 shadow-sm dark:border-zinc-900 dark:bg-zinc-800" />

              <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>

            {/* User information */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-36 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />

                <div className="h-5 w-5 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <div className="mt-2 h-4 w-20 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>

            {/* Information */}
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <InfoSkeleton />
              <InfoSkeleton />
              <InfoSkeleton />
              <InfoSkeleton />
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-8">
          <div className="mb-3 px-1">
            <div className="h-4 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />

            <div className="mt-2 h-3 w-64 max-w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Information Skeleton */
/* -------------------------------- */

function InfoSkeleton() {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
      {/* Icon */}
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />

      <div className="min-w-0 flex-1">
        {/* Label */}
        <div className="h-3 w-14 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

        {/* Value */}
        <div className="mt-2 h-4 w-28 max-w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Account Action Skeleton */
/* -------------------------------- */

function ActionSkeleton() {
  return (
    <div className="flex w-full items-center gap-4 px-4 py-4 sm:px-5">
      {/* Icon */}
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="h-4 w-36 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-2 h-3 w-64 max-w-[80%] animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Chevron */}
      <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

/* -------------------------------- */
/* Divider */
/* -------------------------------- */

function Divider() {
  return <div className="mx-5 h-px bg-zinc-100 dark:bg-zinc-800" />;
}