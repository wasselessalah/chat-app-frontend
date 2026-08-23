import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-[#09090b] font-sans">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <Ghost className="h-12 w-12 text-zinc-400 dark:text-zinc-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            404
          </h1>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            Page Not Found
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="default" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/chat" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
