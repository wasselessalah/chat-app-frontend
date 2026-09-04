import Link from "next/link";
import {
  MessageSquareOff,
  ArrowLeft,
  Home,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ChatNotFound() {
  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-zinc-50 px-4 py-8 font-sans dark:bg-zinc-950">
      {/* Subtle background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/50 blur-3xl dark:bg-zinc-800/20" />

        <div className="absolute -left-40 top-1/3 h-72 w-72 rounded-full bg-red-500/[0.035] blur-3xl" />

        <div className="absolute -right-40 bottom-1/3 h-72 w-72 rounded-full bg-blue-500/[0.035] blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-xl shadow-zinc-900/[0.05] sm:p-9 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 scale-125 rounded-2xl bg-red-500/10 blur-2xl" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                <MessageSquareOff
                  aria-hidden="true"
                  className="h-9 w-9 text-zinc-500 dark:text-zinc-400"
                  strokeWidth={1.6}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
              Conversation unavailable
            </span>
          </div>

          {/* Heading */}
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              Chat not found
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              We couldn't find this conversation. It may have
              been deleted, moved, or you may no longer have
              access to it.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-2.5">
            <Link href="/chat" className="block">
              <Button
                className="
                  h-11 w-full rounded-xl
                  bg-zinc-900
                  text-sm font-medium text-white
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-zinc-800
                  hover:shadow-md
                  active:translate-y-0
                  dark:bg-zinc-100
                  dark:text-zinc-900
                  dark:hover:bg-zinc-200
                "
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="mr-2 h-4 w-4"
                />
                Back to chats
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="
                  h-11 w-full rounded-xl
                  text-sm font-medium
                  text-zinc-500
                  transition-colors
                  hover:bg-zinc-100
                  hover:text-zinc-900
                  dark:text-zinc-400
                  dark:hover:bg-zinc-800
                  dark:hover:text-zinc-100
                "
              >
                <Home
                  aria-hidden="true"
                  className="mr-2 h-4 w-4"
                />
                Go to home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400 dark:text-zinc-600">
          <RefreshCw
            aria-hidden="true"
            className="h-3 w-3"
          />
          <span>
            Try refreshing the page if you think this is a mistake.
          </span>
        </div>
      </div>
    </div>
  );
}
