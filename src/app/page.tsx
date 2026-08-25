import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 font-sans w-full overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center">
        <div className="absolute -top-[20%] left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/20 mix-blend-multiply blur-[120px] dark:bg-blue-600/20" />
        <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-purple-500/20 mix-blend-multiply blur-[120px] dark:bg-purple-600/20" />
        <div className="absolute -bottom-[20%] left-[10%] h-[600px] w-[600px] rounded-full bg-indigo-500/20 mix-blend-multiply blur-[120px] dark:bg-indigo-600/20" />
      </div>

      <Navbar />
      


      
      <main className="relative z-10 flex-1 w-full flex flex-col items-center pt-24 pb-16 px-4 md:px-6">
        
        {/* Badge */}
        <div className="group inline-flex cursor-pointer items-center rounded-full border border-zinc-200/50 dark:border-zinc-700/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-all hover:bg-white/60 dark:hover:bg-zinc-800/60 hover:shadow-md">
          <span className="relative flex h-2.5 w-2.5 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          Next-Generation Communication
        </div>

        {/* Hero Section */}
        <div className="mt-12 flex max-w-[1000px] flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-zinc-900 dark:text-white mb-2">Connect Instantly.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Communicate Seamlessly.
            </span>
          </h1>
          <p className="max-w-[700px] mt-4 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            A premium, ultra-fast, and deeply secure chat application crafted for the optimal user experience. Powered by Next.js and robust real-time architecture.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-5">
          <Link
            href="/chat"
            className="group relative inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 dark:bg-white px-10 text-base font-semibold text-white dark:text-zinc-900 shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
          >
            Start Chatting
            <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md px-10 text-base font-medium text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 disabled:pointer-events-none disabled:opacity-50"
          >
            Learn More
          </Link>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-32 grid max-w-6xl w-full gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group relative flex flex-col justify-start overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-blue-900/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-zinc-800 dark:to-zinc-800 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="relative mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="relative text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
    description: "Experience zero latency conversations powered by a robust, highly optimized WebSocket architecture.",
    icon: (
      <svg className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Secure & Private",
    description: "Military-grade encryption and strictly enforced security protocols ensuring your data stays fully protected.",
    icon: (
      <svg className="h-7 w-7 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: "Premium Design",
    description: "A meticulously crafted interface focusing on typography, micro-interactions, and visual harmony.",
    icon: (
      <svg className="h-7 w-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
];
