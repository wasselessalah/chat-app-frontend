import Link from "next/link";
import {
  ArrowRight,
  Check,
  Lock,
  MessageCircle,
  Palette,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="absolute right-[-200px] top-[35%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[450px] w-[450px] rounded-full bg-violet-500/5 blur-[100px]" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        {/* Announcement */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="text-muted-foreground">
              Real-time communication
            </span>

            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        {/* Hero */}
        <section className="mt-10 flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">
              Conversations that
            </span>

            <span className="mt-2 block bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              feel instant.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
            A fast, secure, and beautifully simple messaging experience.
            Connect with people, share ideas, and stay in the conversation
            without distractions.
          </p>

          {/* CTA */}
          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/chat"
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-6 text-sm font-semibold text-background shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Start chatting
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="#features"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border bg-background/70 px-6 text-sm font-medium shadow-sm backdrop-blur transition-colors hover:bg-muted sm:w-auto"
            >
              Explore features
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Real-time messaging
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Private conversations
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Groups included
            </span>
          </div>
        </section>

        {/* Chat Preview */}
        <section className="mt-16 w-full max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border bg-background/80 shadow-2xl shadow-black/5 backdrop-blur-xl">
            {/* Window header */}
            <div className="flex h-12 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Online
              </div>
            </div>

            {/* Preview */}
            <div className="grid min-h-[320px] grid-cols-1 md:grid-cols-[220px_1fr]">
              {/* Fake sidebar */}
              <div className="hidden border-r bg-muted/20 p-3 md:block">
                <div className="mb-4 h-8 rounded-md bg-muted/70" />

                <PreviewUser
                  active
                  name="Alex Morgan"
                  message="Sounds good!"
                />

                <PreviewUser
                  name="Sarah Wilson"
                  message="See you tomorrow"
                />

                <PreviewUser
                  name="Development Team"
                  message="New update available"
                  group
                />
              </div>

              {/* Fake chat */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 border-b px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Alex Morgan
                    </p>

                    <p className="text-[11px] text-emerald-500">
                      Active now
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-end gap-3 p-5">
                  <ChatBubble
                    side="left"
                    text="Hey! How is the project going?"
                  />

                  <ChatBubble
                    side="right"
                    text="It's going really well. The new chat UI is almost ready."
                  />

                  <ChatBubble
                    side="left"
                    text="Nice! Send it over when you're ready."
                  />

                  <div className="mt-2 flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                    <div className="h-2 flex-1 rounded-full bg-muted" />
                    <div className="h-7 w-7 rounded-md bg-primary/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mt-24 w-full max-w-6xl"
        >
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Built for conversations
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay connected
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              A focused messaging experience designed around speed,
              privacy, and simplicity.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-background/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  {feature.icon}
                </div>

                <h3 className="text-base font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-24 w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border bg-muted/30 px-6 py-12 text-center sm:px-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />

            <div className="relative">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to start a conversation?
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                Jump into your conversations and experience a faster,
                cleaner way to communicate.
              </p>

              <Link
                href="/chat"
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Open chat
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        <Footer/>
      </main>

    </div>
  );
}

function PreviewUser({
  name,
  message,
  active = false,
  group = false,
}: {
  name: string;
  message: string;
  active?: boolean;
  group?: boolean;
}) {
  return (
    <div
      className={`mb-1 flex items-center gap-2 rounded-lg p-2 ${
        active ? "bg-primary/10" : "hover:bg-muted/50"
      }`}
    >
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
        {group ? "👥" : name.substring(0, 2).toUpperCase()}

        {active && (
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background bg-emerald-500" />
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium">
          {name}
        </p>

        <p className="truncate text-[9px] text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}

function ChatBubble({
  text,
  side,
}: {
  text: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={`flex ${
        side === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs leading-5 ${
          side === "right"
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

const features = [
  {
    title: "Real-time messaging",
    description:
      "Send and receive messages instantly with a responsive real-time architecture.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Private & secure",
    description:
      "Keep your conversations protected with secure authentication and privacy-focused design.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Simple by design",
    description:
      "A clean interface that keeps your attention on the conversation instead of the UI.",
    icon: <Palette className="h-5 w-5" />,
  },
];