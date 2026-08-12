"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Search, Edit } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function Sidebar() {
  const params = useParams();
  const selectedId = params.chatId as string;
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data.filter((u) => u.id !== currentUser?.id));
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [currentUser?.id]);

  if (!currentUser) return <div className="w-80 border-r min-h-9/12 bg-muted/30 p-4">Loading...</div>;

  return (
    <div className="w-80 border-r min-h-9/12 bg-muted/30 flex flex-col  shrink-0">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Chats</span>
            <span className="text-xs text-muted-foreground">{currentUser.name}</span>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <Edit className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4">
        <form 
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            // Search is already filtered by onChange, but user wants a button
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {users
            .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
            .map((otherUser) => {
            // Generate a deterministic chat ID based on both user IDs
            const chatId = [currentUser.id, otherUser.id].sort().join("-");
            const isSelected = selectedId === chatId;

            return (
              <Link
                href={`/chat/${chatId}`}
                key={otherUser.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                  isSelected ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={otherUser.image || ""} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{otherUser.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground truncate pr-2">
                      Start chatting...
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
