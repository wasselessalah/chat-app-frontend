export default function Loading() {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
      {/* Main Chat */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />

            {/* User information */}
            <div className="min-w-0 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
            <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
          </div>
        </header>

        {/* Messages */}
        <main className="min-h-0 flex-1 overflow-hidden">
          <div className="mx-auto flex h-full max-w-4xl flex-col justify-end gap-6 px-4 py-6 sm:px-6">
            {/* Date separator */}
            <div className="flex justify-center py-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>

            {/* Incoming message */}
            <div className="flex items-end gap-2">
              <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />

              <div className="max-w-[75%] space-y-2">
                <div className="h-10 w-52 animate-pulse rounded-2xl rounded-bl-md bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
              </div>
            </div>

            {/* Incoming message - larger */}
            <div className="flex items-end gap-2">
              <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />

              <div className="max-w-[75%] space-y-2">
                <div className="h-16 w-72 max-w-full animate-pulse rounded-2xl rounded-bl-md bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
              </div>
            </div>

            {/* Outgoing message */}
            <div className="flex justify-end">
              <div className="space-y-2">
                <div className="ml-auto h-11 w-56 max-w-full animate-pulse rounded-2xl rounded-br-md bg-muted" />

                <div className="flex justify-end">
                  <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>

            {/* Outgoing message - large */}
            <div className="flex justify-end">
              <div className="space-y-2">
                <div className="ml-auto h-20 w-72 max-w-full animate-pulse rounded-2xl rounded-br-md bg-muted" />

                <div className="flex justify-end">
                  <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>

            {/* Incoming message */}
            <div className="flex items-end gap-2">
              <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />

              <div className="space-y-2">
                <div className="h-12 w-60 max-w-full animate-pulse rounded-2xl rounded-bl-md bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
              </div>
            </div>

            {/* Short outgoing message */}
            <div className="flex justify-end">
              <div className="space-y-2">
                <div className="ml-auto h-10 w-40 max-w-full animate-pulse rounded-2xl rounded-br-md bg-muted" />

                <div className="flex justify-end">
                  <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Composer */}
        <footer className="shrink-0 border-t bg-background p-3 sm:p-4">
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            {/* Attachment */}
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted" />

            {/* Input */}
            <div className="h-11 flex-1 animate-pulse rounded-xl bg-muted" />

            {/* Emoji */}
            <div className="hidden h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted sm:block" />

            {/* Send */}
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted" />
          </div>
        </footer>
      </section>

      {/* Details Panel */}
      <aside className="hidden w-[320px] shrink-0 border-l bg-background lg:block">
        {/* Panel header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="h-5 w-28 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-6 py-8">
          {/* Avatar */}
          <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />

          {/* Name */}
          <div className="mt-5 h-5 w-32 animate-pulse rounded-md bg-muted" />

          {/* Status */}
          <div className="mt-2 h-4 w-44 animate-pulse rounded-md bg-muted" />

          {/* Actions */}
          <div className="mt-8 w-full space-y-3">
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          </div>

          {/* Additional information */}
          <div className="mt-8 w-full space-y-4 border-t pt-6">
            <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />

            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

