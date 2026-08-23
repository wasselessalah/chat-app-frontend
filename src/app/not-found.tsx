import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-[#09090b] font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none flex justify-center opacity-30 dark:opacity-20 blur-3xl">
        <div className="absolute -top-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 mix-blend-multiply animate-pulse" />
        <div className="absolute top-[30%] -right-[10%] h-[500px] w-[500px] rounded-full bg-violet-400/20 dark:bg-violet-500/10 mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center space-y-8 rounded-3xl border border-zinc-200/60 bg-white/70 backdrop-blur-xl p-10 shadow-2xl shadow-blue-900/5 dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:shadow-blue-900/20 transition-all hover:scale-[1.02] duration-500">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 shadow-inner group">
          <div className="absolute inset-0 rounded-2xl bg-zinc-400/20 dark:bg-zinc-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Ghost className="h-12 w-12 text-zinc-400 dark:text-zinc-500 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
            404
          </h1>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            Page Not Found
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto font-medium">
            Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-6">
          <Link href="/" className="w-full sm:w-auto inline-block group">
            <Button variant="default" className="w-full sm:w-auto h-12 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl shadow-lg shadow-zinc-900/20 dark:shadow-white/10 transition-all group-hover:shadow-xl group-hover:-translate-y-0.5">
              <Home className="mr-2 h-4 w-4 transform group-hover:-translate-y-0.5 transition-transform" />
              Back to Home
            </Button>
          </Link>
          <Link href="/chat" className="w-full sm:w-auto inline-block group">
            <Button variant="outline" className="w-full sm:w-auto h-12 rounded-xl transition-all group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800">
              <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              Go to Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
