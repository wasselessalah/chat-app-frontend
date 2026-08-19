"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatUser, Conversation } from "@/types/chat.types";
import { Edit, Loader2, Search, Settings, Check, X, Users } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { parseGroupName } from "@/constants/group.constants";
import { useSidebar } from "@/features/chat/hooks/useSidebar";

interface SidebarProps {
  currentUser: ChatUser;
}

export function Sidebar({ currentUser }: SidebarProps) {
  const router = useRouter();
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");
  
  const { users, groups, loading, unreadCounts } = useSidebar(currentUser);
  const onlineUserIds = useOnlineUsers(currentUser.id);

  const formatMessageTime = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getDisplayName = (user: ChatUser) => user.name || "Unknown";
  const getAvatar = (user: ChatUser) => user.image || user.avatar || "";

  const handleChatClick = (targetUserId: string) => {
    const chatId = [currentUser.id, targetUserId].sort().join("_vs_");
    router.push(`/chat/${chatId}`);
  };

  const handleGroupClick = (groupChatId: string) => {
    router.push(`/chat/${encodeURIComponent(groupChatId)}`);
  };

  const filteredUsers = users.filter((u) => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredGroups = groups.filter((g) => {
    const name = parseGroupName(g.chatId || g.id, g.name);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-80 h-full border-r bg-muted/30 flex flex-col shrink-0">
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Chats
          </h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-8 bg-background h-9 border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center p-2 gap-2 bg-background/50 border-b shrink-0">
        <Button
          variant={activeTab === "direct" ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-8 text-xs font-medium"
          onClick={() => setActiveTab("direct")}
        >
          Direct Messages
        </Button>
        <Button
          variant={activeTab === "groups" ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-8 text-xs font-medium"
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm">Loading chats...</p>
            </div>
          ) : activeTab === "direct" ? (
            filteredUsers.length === 0 ? (
              <div className="text-center text-muted-foreground p-4 text-sm">
                No direct messages found.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isOnline = onlineUserIds.has(user.id);
                const chatId = [currentUser.id, user.id].sort().join("_vs_");
                const isActive = params.chatId === chatId;
                const unreadCount = unreadCounts[user.id] || 0;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleChatClick(user.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
                      ${isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/80"}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={getAvatar(user)} alt={getDisplayName(user)} />
                        <AvatarFallback>{getDisplayName(user).substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold text-sm truncate ${isActive ? "text-primary-foreground" : ""}`}>
                          {getDisplayName(user)}
                        </h3>
                        {user.lastMessage && (
                          <span className={`text-[10px] whitespace-nowrap ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {formatMessageTime(user.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {user.lastMessage ? (
                            <span>
                              {user.lastMessage.senderId === currentUser.id ? "You: " : ""}
                              {user.lastMessage.content}
                            </span>
                          ) : (
                            <span className="italic">No messages yet</span>
                          )}
                        </p>
                        {unreadCount > 0 && !isActive && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm animate-in zoom-in">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            filteredGroups.length === 0 ? (
              <div className="text-center text-muted-foreground p-4 text-sm">
                No groups found.
              </div>
            ) : (
              filteredGroups.map((group) => {
                const displayChatId = group.chatId || group.id;
                const isActive = params.chatId === displayChatId || (typeof params.chatId === "string" && params.chatId.split("?")[0] === displayChatId.split("?")[0]);
                const baseChatId = displayChatId.split("?")[0];
                const unreadCount = unreadCounts[baseChatId] || 0;
                
                return (
                  <div
                    key={displayChatId}
                    onClick={() => handleGroupClick(displayChatId)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
                      ${isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/80"}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm transition-transform group-hover:scale-105 bg-primary/10 flex items-center justify-center text-primary font-bold">
                        <Users className={`h-6 w-6 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold text-sm truncate ${isActive ? "text-primary-foreground" : ""}`}>
                          {parseGroupName(displayChatId, group.name)}
                        </h3>
                        {group.lastMessage && (
                          <span className={`text-[10px] whitespace-nowrap ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {formatMessageTime(group.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {group.lastMessage ? (
                            <span>
                              {group.lastMessage.senderId === currentUser.id ? "You" : group.lastMessage.senderName}: {group.lastMessage.content}
                            </span>
                          ) : (
                            <span className="italic">No messages yet</span>
                          )}
                        </p>
                        {unreadCount > 0 && !isActive && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm animate-in zoom-in">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
