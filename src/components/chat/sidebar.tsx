"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser } from "@/types/chat.types";
import {
  Loader2,
  Search,
  Settings,
  Users,
  MessageSquarePlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { parseGroupName } from "@/constants/group.constants";
import { useSidebar } from "@/features/chat/hooks/useSidebar";
import { NewChatModal } from "@/features/chat/components/NewChatModal";

interface SidebarProps {
  currentUser: ChatUser;
}

export function Sidebar({ currentUser }: SidebarProps) {
  const router = useRouter();
  const params = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");

  const { users, groups, loading, unreadCounts } =
    useSidebar(currentUser);

  const onlineUserIds = useOnlineUsers(currentUser.id);

  const formatMessageTime = (date?: Date | string) => {
    if (!date) return "";

    const d = new Date(date);
    const today = new Date();

    const isToday = d.toDateString() === today.toDateString();

    if (isToday) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const getDisplayName = (user: ChatUser) => user.name || "Unknown";

  const getAvatar = (user: ChatUser) =>
    user.image || user.avatar || "";

  const handleChatClick = (targetUserId: string) => {
    const chatId = [currentUser.id, targetUserId]
      .sort()
      .join("_vs_");

    router.push(`/chat/${chatId}`);
  };

  const handleGroupClick = (groupChatId: string) => {
    router.push(`/chat/${encodeURIComponent(groupChatId)}`);
  };

  const normalizedSearch = searchQuery.toLowerCase().trim();

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(normalizedSearch) ||
      user.email?.toLowerCase().includes(normalizedSearch)
  );

  const filteredGroups = groups.filter((group) => {
    const name = parseGroupName(
      group.chatId || group.id,
      group.name
    );

    return name.toLowerCase().includes(normalizedSearch);
  });

  const totalUnread = Object.values(unreadCounts).reduce(
    (total, count) => total + count,
    0
  );

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-r bg-background">
      {/* ───────────────── Header ───────────────── */}
      <div className="shrink-0 border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">
                Messages
              </h1>

              {totalUnread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Stay connected with your conversations
            </p>
          </div>

          <div className="flex items-center gap-1">
            <NewChatModal currentUser={currentUser} />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder={
                activeTab === "direct"
                  ? "Search people..."
                  : "Search groups..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-lg border-muted bg-muted/40 pl-9 pr-9 text-sm shadow-none transition-colors focus-visible:bg-background"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-2 rounded-lg bg-muted/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("direct")}
              className={`flex h-8 items-center justify-center gap-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "direct"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Direct</span>

              {users.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {users.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("groups")}
              className={`flex h-8 items-center justify-center gap-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "groups"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-3.5 w-3.5" />

              <span>Groups</span>

              {groups.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {groups.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────── Conversations ───────────────── */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">
                  Loading conversations
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Please wait a moment...
                </p>
              </div>
            </div>
          ) : activeTab === "direct" ? (
            filteredUsers.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                type="direct"
              />
            ) : (
              <div className="space-y-0.5">
                {filteredUsers.map((user) => {
                  const isOnline = onlineUserIds.has(user.id);

                  const chatId = [currentUser.id, user.id]
                    .sort()
                    .join("_vs_");

                  const isActive = params.chatId === chatId;

                  const unreadCount =
                    unreadCounts[user.id] || 0;

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleChatClick(user.id)}
                      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                        isActive
                          ? "bg-primary/10"
                          : "hover:bg-muted/70"
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" />
                      )}

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <Avatar className="h-11 w-11 border bg-background shadow-sm">
                          <AvatarImage
                            src={getAvatar(user)}
                            alt={getDisplayName(user)}
                          />

                          <AvatarFallback className="text-xs font-semibold">
                            {getDisplayName(user)
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {isOnline && (
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`truncate text-sm ${
                              unreadCount > 0
                                ? "font-semibold"
                                : "font-medium"
                            }`}
                          >
                            {getDisplayName(user)}
                          </h3>

                          {user.lastMessage && (
                            <span
                              className={`shrink-0 text-[10px] ${
                                unreadCount > 0
                                  ? "font-medium text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatMessageTime(
                                user.lastMessage.createdAt
                              )}
                            </span>
                          )}
                        </div>

                        <div className="mt-0.5 flex items-center gap-2">
                          <p
                            className={`min-w-0 flex-1 truncate text-xs ${
                              unreadCount > 0
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {user.lastMessage ? (
                              <>
                                {user.lastMessage.senderId ===
                                  currentUser.id && (
                                  <span className="mr-1">
                                    You:
                                  </span>
                                )}

                                {user.lastMessage.content}
                              </>
                            ) : (
                              <span className="italic">
                                No messages yet
                              </span>
                            )}
                          </p>

                          {unreadCount > 0 && !isActive && (
                            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                              {unreadCount > 99
                                ? "99+"
                                : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          ) : filteredGroups.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              type="groups"
            />
          ) : (
            <div className="space-y-0.5">
              {filteredGroups.map((group) => {
                const displayChatId =
                  group.chatId || group.id;

                const isActive =
                  params.chatId === displayChatId ||
                  (typeof params.chatId === "string" &&
                    params.chatId.split("?")[0] ===
                      displayChatId.split("?")[0]);

                const baseChatId =
                  displayChatId.split("?")[0];

                const unreadCount =
                  unreadCounts[baseChatId] || 0;

                return (
                  <button
                    key={displayChatId}
                    type="button"
                    onClick={() =>
                      handleGroupClick(displayChatId)
                    }
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? "bg-primary/10"
                        : "hover:bg-muted/70"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" />
                    )}

                    {/* Group Avatar */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-sm ${
                        isActive
                          ? "border-primary/20 bg-primary/10"
                          : "border-border bg-muted"
                      }`}
                    >
                      <Users
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    {/* Group content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`truncate text-sm ${
                            unreadCount > 0
                              ? "font-semibold"
                              : "font-medium"
                          }`}
                        >
                          {parseGroupName(
                            displayChatId,
                            group.name
                          )}
                        </h3>

                        {group.lastMessage && (
                          <span
                            className={`shrink-0 text-[10px] ${
                              unreadCount > 0
                                ? "font-medium text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatMessageTime(
                              group.lastMessage.createdAt
                            )}
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-center gap-2">
                        <p
                          className={`min-w-0 flex-1 truncate text-xs ${
                            unreadCount > 0
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {group.lastMessage ? (
                            <>
                              {group.lastMessage.senderId ===
                                currentUser.id
                                ? "You"
                                : group.lastMessage.senderName}
                              :{" "}
                              {group.lastMessage.content}
                            </>
                          ) : (
                            <span className="italic">
                              No messages yet
                            </span>
                          )}
                        </p>

                        {unreadCount > 0 && !isActive && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                            {unreadCount > 99
                              ? "99+"
                              : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ───────────────── Footer ───────────────── */}
      <div className="shrink-0 border-t bg-background px-3 py-2">
        <p className="text-center text-[10px] text-muted-foreground">
          {activeTab === "direct"
            ? `${users.length} conversation${
                users.length !== 1 ? "s" : ""
              }`
            : `${groups.length} group${
                groups.length !== 1 ? "s" : ""
              }`}
        </p>
      </div>
    </aside>
  );
}

/* ───────────────── Empty State ───────────────── */

function EmptyState({
  searchQuery,
  type,
}: {
  searchQuery: string;
  type: "direct" | "groups";
}) {
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        {type === "direct" ? (
          <MessageSquarePlus className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Users className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <h3 className="text-sm font-semibold">
        {isSearching
          ? "No results found"
          : type === "direct"
          ? "No conversations yet"
          : "No groups yet"}
      </h3>

      <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted-foreground">
        {isSearching
          ? `We couldn't find anything matching "${searchQuery}".`
          : type === "direct"
          ? "Start a conversation to see your messages here."
          : "Create or join a group to start chatting."}
      </p>
    </div>
  );
}