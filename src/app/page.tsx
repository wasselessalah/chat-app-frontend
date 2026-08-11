import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 font-sans w-full">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center justify-center pt-16 pb-16 px-4 md:px-6">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
          Real-time Communication
        </div>

        {/* Hero Section */}
        <div className="mt-8 flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Connect Instantly. <br className="hidden sm:inline" />
            Communicate Seamlessly.
          </h1>
          <p className="max-w-[750px] text-base md:text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            A modern, fast, and secure chat application designed for the best user experience. Built with Next.js, TypeScript, and robust real-time architecture.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/chat"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-50 px-8 text-sm font-medium text-zinc-50 dark:text-zinc-900 shadow transition-colors hover:bg-zinc-900/90 dark:hover:bg-zinc-50/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50"
          >
            Start Chatting
          </Link>
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50"
          >
            Learn More
          </Link>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-20 grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 lg:gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-900">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight">{feature.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const features = [
  {
    title: "Real-time Messaging",
    description: "Experience zero latency conversations powered by robust WebSocket architecture.",
    icon: (
      <svg className="h-5 w-5 text-zinc-900 dark:text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Secure & Private",
    description: "End-to-end security ensuring your data and conversations stay protected at all times.",
    icon: (
      <svg className="h-5 w-5 text-zinc-900 dark:text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: "Modern Design",
    description: "A clean, minimalistic interface focusing on readability, spacing, and user experience.",
    icon: (
      <svg className="h-5 w-5 text-zinc-900 dark:text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
];
