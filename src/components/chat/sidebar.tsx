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
import { getSocket } from "@/lib/socket";

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
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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

  // Fetch initial unread counts
  const fetchUnreadCounts = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/messages/unread-counts?userId=${currentUser.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setUnreadCounts(data);
      }
    } catch (err) {
      console.error("Error fetching unread counts:", err);
    }
  }, [currentUser?.id, BACKEND_URL]);

  // Initial load
  useEffect(() => {
    fetchUsers("");
    fetchUnreadCounts();
  }, [fetchUsers, fetchUnreadCounts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  // Handle incoming messages for unread counter
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (newMessage: any) => {
      // If we received a message from someone else
      if (newMessage.senderId !== currentUser.id) {
        // Only increment if we are NOT currently in that chat room
        if (selectedId !== newMessage.chatId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedId, currentUser]);

  // Clear unread count when opening a chat
  useEffect(() => {
    if (selectedId && currentUser) {
      // Find the other user ID from the selected chatId
      const otherUserId = selectedId
        .split("_vs_")
        .find((id) => id !== currentUser.id);

      if (otherUserId && unreadCounts[otherUserId]) {
        setUnreadCounts((prev) => ({
          ...prev,
          [otherUserId]: 0,
        }));
      }
    }
  }, [selectedId, currentUser, unreadCounts]);

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
            const unreadCount = unreadCounts[otherUser.id] || 0;

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
                {unreadCount > 0 && (
                  <div className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-primary-foreground bg-primary rounded-full">
                    {unreadCount}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
