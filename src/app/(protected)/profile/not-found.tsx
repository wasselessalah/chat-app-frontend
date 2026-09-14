import Link from "next/link";

import {
  ArrowLeft,
  Home,
  UserRoundX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/30 blur-3xl dark:bg-zinc-800/20" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(228 228 231 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(228 228 231 / 0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/95 p-6 shadow-xl shadow-zinc-200/40 backdrop-blur-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-black/20">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="absolute inset-2 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700" />

              <UserRoundX
                className="relative h-8 w-8 text-zinc-500 dark:text-zinc-400"
                strokeWidth={1.7}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mt-7 text-center">
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              Error 404
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
              Profile not found
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              This profile may have been removed, deleted, or the link may be
              incorrect.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="outline"
              asChild
              className="h-11 w-full gap-2 rounded-xl border-zinc-200 bg-white px-5 text-sm font-medium shadow-none transition-all hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4" />
                Back to profile
              </Link>
            </Button>

            <Button
              asChild
              className="h-11 w-full gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Go to homepage
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="my-7 h-px bg-zinc-100 dark:bg-zinc-800" />

          {/* Hint */}
          <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-3.5 text-left dark:bg-zinc-800/60">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-zinc-700">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-300">
                ?
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Looking for someone?
              </p>
              <p className="mt-0.5 text-xs leading-5 text-zinc-400 dark:text-zinc-500">
                Check the profile URL and make sure it&apos;s correct.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[11px] text-zinc-400 dark:text-zinc-600">
          404 · Profile unavailable
        </p>
      </div>
    </main>
  );
}
