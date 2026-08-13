"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState, useCallback } from "react";
import { Search, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";

interface AppUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export function Sidebar() {
  const params = useParams();
  const selectedId = params.chatId as string | undefined;
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Hook to get online users (also announces our presence)
  const onlineUserIds = useOnlineUsers(currentUser?.id);

  // Fetch users (with optional search query)
  const fetchUsers = useCallback(
    async (query: string) => {
      if (!currentUser?.id) return;
      setIsSearching(true);
      try {
        const params = new URLSearchParams({
          excludeId: currentUser.id,
        });
        if (query.trim()) params.set("q", query.trim());

        const res = await fetch(`/api/users?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [currentUser?.id]
  );

  // Initial load
  useEffect(() => {
    fetchUsers("");
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  if (!currentUser) {
    return (
      <div className="w-80 border-r bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col shrink-0 min-h-0">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b shrink-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={currentUser.image ?? ""}
              alt={currentUser.name}
            />
            <AvatarFallback>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Chats</span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
              {currentUser.name}
            </span>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <Edit className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 shrink-0">
        <div className="relative">
          {isSearching ? (
            <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User list */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {users.length === 0 && !isSearching && (
            <div className="text-center text-muted-foreground text-sm py-8">
              {search ? `No users found for "${search}"` : "No other users yet"}
            </div>
          )}
          {users.map((otherUser) => {
            // UUID-safe chat ID: sort both IDs and join with "_vs_"
            const chatId = [currentUser.id, otherUser.id]
              .sort()
              .join("_vs_");
            const isSelected = selectedId === chatId;
            const isOnline = onlineUserIds.has(otherUser.id);

            return (
              <Link
                href={`/chat/${chatId}`}
                key={otherUser.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={otherUser.image ?? ""}
                      alt={otherUser.name}
                    />
                    <AvatarFallback>
                      {otherUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{otherUser.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
