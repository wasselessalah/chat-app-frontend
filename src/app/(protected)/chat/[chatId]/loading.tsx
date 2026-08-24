import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

            {/* User info */}
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </header>

        {/* Messages */}
        <main className="min-h-0 flex-1 overflow-hidden">
          <div className="mx-auto flex h-full max-w-4xl flex-col justify-end gap-5 px-4 py-6">
            {/* Date */}
            <div className="flex justify-center py-2">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Incoming message */}
            <div className="flex items-end gap-2">
              <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-10 w-52 rounded-2xl rounded-bl-md" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
            </div>

            {/* Incoming message */}
            <div className="flex items-end gap-2">
              <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-16 w-72 rounded-2xl rounded-bl-md" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
            </div>

            {/* Outgoing message */}
            <div className="flex justify-end">
              <div className="space-y-2">
                <Skeleton className="ml-auto h-11 w-56 rounded-2xl rounded-br-md" />

                <div className="flex justify-end">
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              </div>
            </div>

            {/* Outgoing message */}
            <div className="flex justify-end">
              <div className="space-y-2">
                <Skeleton className="ml-auto h-20 w-72 rounded-2xl rounded-br-md" />

                <div className="flex justify-end">
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              </div>
            </div>

            {/* Incoming message */}
            <div className="flex items-end gap-2">
              <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-12 w-60 rounded-2xl rounded-bl-md" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
            </div>
          </div>
        </main>

        {/* Message Composer */}
        <footer className="shrink-0 border-t bg-background p-3 sm:p-4">
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            {/* Attachment */}
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />

            {/* Input */}
            <Skeleton className="h-11 flex-1 rounded-xl" />

            {/* Send */}
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          </div>
        </footer>
      </div>

      {/* Details Panel */}
      <aside className="hidden w-[320px] shrink-0 border-l bg-background lg:block">
        {/* Panel Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-6 py-8">
          <Skeleton className="h-24 w-24 rounded-full" />

          <Skeleton className="mt-5 h-5 w-32 rounded-md" />

          <Skeleton className="mt-2 h-4 w-44 rounded-md" />

          {/* Actions */}
          <div className="mt-8 w-full space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </aside>
    </div>
  );
}