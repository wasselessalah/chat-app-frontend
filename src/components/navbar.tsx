
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  ChevronDown,
  LogOut,
  MessageCircle,
  Menu,
  Sparkles,
  User,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { disconnectSocket } from "@/lib/socket";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      disconnectSocket();

      await authClient.signOut();

      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
            <MessageCircle className="h-5 w-5" />
          </div>

          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight">
              ChatApp
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          <Link
            href="/chat"
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive("/chat")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Chat

            {isActive("/chat") && (
              <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/#features"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Sparkles className="h-4 w-4" />
            Features
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : session ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="flex h-10 items-center gap-2 rounded-xl px-2.5 hover:bg-muted"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>

                <div className="hidden max-w-[120px] text-left lg:block">
                  <p className="truncate text-sm font-medium">
                    {session.user?.name || "Account"}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isUserMenuOpen && (
                <>
                  <button
                    aria-label="Close user menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsUserMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border bg-popover p-1.5 shadow-xl">
                    <div className="border-b px-3 py-2.5">
                      <p className="truncate text-sm font-medium">
                        {session.user?.name || "Account"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>

                    <Link
                      href="/chat"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Open Chat
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}

                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="rounded-xl px-4 font-medium"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className="rounded-xl px-5 font-medium shadow-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              href="/chat"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive("/chat")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat</span>

              {isActive("/chat") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </Link>

            <Link
              href="/#features"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Sparkles className="h-5 w-5" />
              <span>Features</span>
            </Link>

            <div className="my-2 h-px bg-border" />

            {isPending ? (
              <div className="h-10 animate-pulse rounded-xl bg-muted" />
            ) : session ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {session.user?.name || "Account"}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <LogOut className="h-5 w-5" />
                  )}

                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" onClick={closeMobileMenu}>
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-xl"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/sign-up" onClick={closeMobileMenu}>
                  <Button className="h-11 w-full rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

