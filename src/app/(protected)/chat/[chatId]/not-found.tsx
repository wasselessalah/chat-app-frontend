import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquareOff,
  ArrowLeft,
  Home,
  AlertCircle,
} from "lucide-react";

export default function ChatNotFound() {
  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-zinc-50 px-4 py-10 font-sans dark:bg-zinc-950">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/40 blur-3xl dark:bg-zinc-800/20" />

        <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-red-500/[0.04] blur-3xl dark:bg-red-500/[0.05]" />

        <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-blue-500/[0.04] blur-3xl dark:bg-blue-500/[0.05]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl shadow-zinc-900/[0.04] backdrop-blur-xl sm:p-10 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-black/20">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="absolute inset-0 rounded-2xl bg-red-500/10 blur-xl" />

              <MessageSquareOff
                aria-hidden="true"
                className="relative h-9 w-9 text-zinc-500 dark:text-zinc-400"
                strokeWidth={1.7}
              />
            </div>
          </div>

          {/* Status */}
          <div className="mt-7 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200/70 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              Conversation unavailable
            </div>
          </div>

          {/* Text */}
          <div className="mt-5 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              Chat not found
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              This conversation may have been deleted, moved, or you may not
              have permission to access it.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Link href="/chat" className="block w-full">
              <Button
                className="h-11 w-full rounded-xl bg-zinc-900 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to chats
              </Button>
            </Link>

            <Link href="/" className="block w-full">
              <Button
                variant="ghost"
                className="h-11 w-full rounded-xl text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to home
              </Button>
            </Link>
          </div>
        </div>

        {/* Small footer hint */}
        <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-600">
          If you think this is a mistake, try refreshing the page.
        </p>
      </div>
    </div>
  );
}