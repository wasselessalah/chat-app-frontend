"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { disconnectSocket } from "@/lib/socket";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    disconnectSocket();
    await authClient.signOut();
    router.push("/");
    setIsLoggingOut(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-xl">
              ChatApp
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/chat"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Chat
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
          ) : session ? (
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="text-sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
