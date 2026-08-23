import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareOff, ArrowLeft } from "lucide-react";

export default function ChatNotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-50/50 px-4 text-center dark:bg-zinc-950/50 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none flex justify-center opacity-30 dark:opacity-20 blur-3xl">
        <div className="absolute top-[30%] -left-[10%] h-[300px] w-[300px] rounded-full bg-red-400/30 dark:bg-red-500/20 mix-blend-multiply animate-pulse" />
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-rose-400/20 dark:bg-rose-500/20 mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center space-y-8 rounded-3xl border border-zinc-200/60 bg-white/70 backdrop-blur-xl p-10 shadow-2xl shadow-red-900/5 dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:shadow-red-900/20 transition-all hover:scale-[1.02] duration-500">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/40 dark:to-rose-900/20 shadow-inner group">
          <div className="absolute inset-0 rounded-2xl bg-red-400/20 dark:bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <MessageSquareOff className="h-12 w-12 text-red-500 dark:text-red-400 transform group-hover:-rotate-12 transition-transform duration-500" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
            Chat Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[280px] mx-auto font-medium">
            The conversation you're looking for doesn't exist, has been deleted, or you don't have access to it.
          </p>
        </div>

        <div className="pt-4 w-full">
          <Link href="/chat" className="w-full inline-block group">
            <Button variant="default" className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl shadow-lg shadow-zinc-900/20 dark:shadow-white/10 transition-all group-hover:shadow-xl group-hover:-translate-y-0.5">
              <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              Return to Chat List
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
