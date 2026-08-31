
import Link from "next/link";
import {
  // Github,
  MessageCircle,
  Heart,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 py-12 md:grid-cols-4 md:py-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
                <MessageCircle className="h-5 w-5" />
              </div>

              <span className="text-lg font-bold tracking-tight">
                ChatApp
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              A simple, fast, and modern way to connect with people.
              Chat in real time and stay connected wherever you are.
            </p>

            {/* GitHub */}
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {/* <Github className="h-4 w-4" /> */}
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold">Product</h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/chat"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Chat
                </Link>
              </li>

              <li>
                <Link
                  href="/#features"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Resources</h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ChatApp. All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Built with
            <Heart className="h-3.5 w-3.5 fill-current text-red-500" />
            for the web
          </p>
        </div>
      </div>
    </footer>
  );
}
