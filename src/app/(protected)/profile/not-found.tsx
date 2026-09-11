import Link from "next/link";

import {
  ArrowLeft,
  Home,
  UserRoundX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/40 blur-3xl dark:bg-zinc-800/20" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <UserRoundX className="h-9 w-9 text-zinc-400 dark:text-zinc-500" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-7 text-center">
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              404 · Profile unavailable
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Profile not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              The profile you&apos;re looking for doesn&apos;t exist,
              has been removed, or is no longer available.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              asChild
              className="h-11 flex-1 gap-2 rounded-xl border-zinc-200 bg-white px-5 text-sm font-medium hover:bg-zinc-50 sm:flex-none dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4" />
                Back to profile
              </Link>
            </Button>

            <Button
              asChild
              className="h-11 flex-1 gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 sm:flex-none dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Go home
              </Link>
            </Button>
          </div>

          {/* Help text */}
          <div className="mt-8 border-t border-zinc-100 pt-6 text-center dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Check the URL or return to your profile to continue.
            </p>
          </div>
        </div>

        {/* Small footer */}
        <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Error 404
        </p>
      </div>
    </main>
  );
}
