import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareOff, ArrowLeft } from "lucide-react";

export default function ChatNotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-50/50 px-4 text-center dark:bg-zinc-950/50 font-sans">
      <div className="flex max-w-md flex-col items-center space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-[#09090b]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
          <MessageSquareOff className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Chat Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
            The conversation you're looking for doesn't exist, has been deleted, or you don't have access to it.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/chat" className="w-full">
            <Button variant="default" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Chat List
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
