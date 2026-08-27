import { MessageCircle, ArrowLeft } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20 px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
          <MessageCircle className="h-8 w-8 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold tracking-tight">
          Select a conversation
        </h2>

        {/* Description */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Choose a conversation from the sidebar to view your messages and
          start chatting.
        </p>

        {/* Hint */}
        <div className="mt-6 flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-xs text-muted-foreground shadow-sm">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Select a chat from the sidebar</span>
        </div>
      </div>
    </div>
  );
}