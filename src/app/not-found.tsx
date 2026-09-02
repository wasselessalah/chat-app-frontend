import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home, MessageSquare } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-50 px-4 py-10 font-sans dark:bg-zinc-950">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Main soft glow */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/40 blur-3xl dark:bg-zinc-800/20" />

        {/* Subtle accent glows */}
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-blue-500/[0.04] blur-3xl dark:bg-blue-500/[0.06]" />

        <div className="absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-violet-500/[0.04] blur-3xl dark:bg-violet-500/[0.06]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[460px]">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl shadow-zinc-900/[0.04] backdrop-blur-xl sm:p-10 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-black/20">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="absolute inset-0 rounded-2xl bg-zinc-500/10 blur-xl" />

              <Ghost
                aria-hidden="true"
                className="relative h-9 w-9 text-zinc-500 dark:text-zinc-400"
                strokeWidth={1.7}
              />
            </div>
          </div>

          {/* Status */}
          <div className="mt-7 flex justify-center">
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-400">
              404 · Page unavailable
            </div>
          </div>

          {/* Error code */}
          <div className="mt-5 text-center">
            <h1 className="text-6xl font-bold tracking-[-0.04em] text-zinc-900 sm:text-7xl dark:text-zinc-100">
              404
            </h1>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
              Page not found
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              The page you re looking for doesn t exist, has been moved, or is
              no longer available.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="w-full">
              <Button
                className="h-11 w-full rounded-xl bg-zinc-900 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>

            <Link href="/chat" className="w-full">
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-zinc-200 text-sm font-medium text-zinc-700 transition-all hover:-translate-y-0.5 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Open chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Check the URL or return to a page you know.
        </p>
      </div>
    </main>
  );
}