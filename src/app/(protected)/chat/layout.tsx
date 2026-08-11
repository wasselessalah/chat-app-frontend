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
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <div className="flex-1 flex overflow-hidden ">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
