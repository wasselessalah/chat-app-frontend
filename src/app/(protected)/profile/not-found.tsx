import Link from "next/link";
import { ArrowLeft, Home, UserRoundX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <UserRoundX className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
        </div>

        {/* Content */}
        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
            Profile
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Profile not found
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            The profile you are looking for doesn&apos;t exist or is no longer
            available.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button
            variant="outline"
            asChild
            className="h-10 gap-2 rounded-lg px-4"
          >
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4" />
              Back to profile
            </Link>
          </Button>

          <Button
            asChild
            className="h-10 gap-2 rounded-lg bg-zinc-900 px-4 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-600">
          Error 404 · Profile unavailable
        </p>
      </div>
    </main>
  );
}
