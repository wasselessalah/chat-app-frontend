import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/chat/sidebar";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden bg-background">
      <Navbar />
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
