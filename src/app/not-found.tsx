
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home, MessageSquare, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-50 px-4 py-10 font-sans dark:bg-zinc-950">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Large 404 background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[18rem] font-black leading-none tracking-[-0.08em] text-zinc-900/[0.025] dark:text-white/[0.025] sm:text-[24rem]">
          404
        </div>

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/50 blur-3xl dark:bg-zinc-800/20" />

        {/* Accent glows */}
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-blue-500/[0.045] blur-3xl dark:bg-blue-500/[0.07]" />

        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-violet-500/[0.045] blur-3xl dark:bg-violet-500/[0.07]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[480px]">
        <div className="rounded-[28px] border border-zinc-200/80 bg-white/95 p-7 shadow-2xl shadow-zinc-900/[0.06] backdrop-blur-xl sm:p-10 dark:border-zinc-800/80 dark:bg-zinc-900/95 dark:shadow-black/30">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-2 rounded-2xl bg-zinc-400/20 blur-xl dark:bg-zinc-500/10" />

              {/* Icon container */}
              <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[22px] border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <Ghost
                  aria-hidden="true"
                  className="h-9 w-9 text-zinc-500 dark:text-zinc-400"
                  strokeWidth={1.6}
                />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="mt-7 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              Error 404
            </span>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-[72px] font-black leading-none tracking-[-0.06em] text-zinc-950 sm:text-[84px] dark:text-white">
              404
            </h1>

            <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
              Page not found
            </h2>

            <p className="mx-auto mt-3 max-w-[360px] text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              The page you're looking for doesn't exist, has been moved, or is
              no longer available.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/" className="w-full">
              <Button
                className="h-11 w-full rounded-xl bg-zinc-950 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <Home className="mr-2 h-4 w-4" />
                Back home
              </Button>
            </Link>

            <Link href="/chat" className="w-full">
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-zinc-200 bg-white text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-md active:translate-y-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Open chat
              </Button>
            </Link>
          </div>

          {/* Back link */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Go back to previous page
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[11px] text-zinc-400 dark:text-zinc-600">
          Check the URL or use one of the options above.
        </p>
      </div>
    </main>
  );
}
