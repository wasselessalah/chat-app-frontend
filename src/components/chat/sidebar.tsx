"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState, useCallback } from "react";
import { Search, Edit, Loader2, UserPlus, Plus, Users, Check, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { getSocket } from "@/lib/socket";

interface LastMessage {
  content: string;
  createdAt: string;
  senderId: string;
  senderName?: string;
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  lastMessage?: LastMessage | null;
}

interface GroupConversation {
  chatId: string;
  name: string | null;
  memberIds: string[];
  members: AppUser[];
  lastMessage?: LastMessage | null;
}

function formatMessageTime(dateString?: string | Date) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString([], {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

const formatTimestamp = formatMessageTime;

function sortUsers(userList: AppUser[]): AppUser[] {
  return [...userList].sort((a, b) => {
    const timeA = a.lastMessage
      ? new Date(a.lastMessage.createdAt).getTime()
      : 0;
    const timeB = b.lastMessage
      ? new Date(b.lastMessage.createdAt).getTime()
      : 0;

    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return a.name.localeCompare(b.name);
  });
}

function parseGroupFromId(
  chatId: string,
  availableUsers: AppUser[],
  currentUser?: { id: string; name: string; email: string; image?: string | null }
): GroupConversation | null {
  if (!chatId || !chatId.startsWith("group_")) return null;
  const [idPart, queryPart] = chatId.split("?");
  const urlParams = new URLSearchParams(queryPart || "");
  const customName = urlParams.get("name");
  const memberIds = idPart.replace("group_", "").split("_vs_");

  const membersMap = new Map<string, AppUser>();
  if (currentUser) {
    membersMap.set(currentUser.id, {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.image || null,
    });
  }
  availableUsers.forEach((u) => membersMap.set(u.id, u));

  const members: AppUser[] = memberIds.map(
    (id) =>
      membersMap.get(id) || {
        id,
        name: id.substring(0, 6),
        email: "",
        image: null,
      }
  );

  return {
    chatId,
    name: customName || null,
    memberIds,
    members,
  };
}

export function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const selectedId = params.chatId as string | undefined;
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [users, setUsers] = useState<AppUser[]>([]);
  const [groups, setGroups] = useState<GroupConversation[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "direct" | "groups">("all");
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // New Chat / Group Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupNameInput, setGroupNameInput] = useState("");

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateChatOrGroup = () => {
    if (selectedUserIds.length === 0 || !currentUser) return;

    if (selectedUserIds.length === 1) {
      const chatId = [currentUser.id, selectedUserIds[0]].sort().join("_vs_");
      router.push(`/chat/${chatId}`);
    } else {
      const sortedUsers = [currentUser.id, ...selectedUserIds].sort();
      const groupNameQuery = groupNameInput.trim()
        ? `?name=${encodeURIComponent(groupNameInput.trim())}`
        : "";
      const chatId = `group_${sortedUsers.join("_vs_")}${groupNameQuery}`;

      const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id));
      const newGroup: GroupConversation = {
        chatId,
        name: groupNameInput.trim() || null,
        memberIds: sortedUsers,
        members: [
          {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image || null,
          },
          ...selectedUsers,
        ],
      };

      setGroups((prev) => [
        newGroup,
        ...prev.filter(
          (g) => g.chatId.split("?")[0] !== chatId.split("?")[0]
        ),
      ]);
      router.push(`/chat/${chatId}`);
    }

    setIsModalOpen(false);
    setSelectedUserIds([]);
    setGroupNameInput("");
    setModalSearch("");
  };

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
          setUsers(sortUsers(data));
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

  // Fetch user group conversations
  const fetchGroups = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/messages/groups?userId=${currentUser.id}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setGroups(data);
        }
      }
    } catch (err) {
      console.error("Error fetching user groups:", err);
    }
  }, [currentUser?.id, BACKEND_URL]);

  // Initial load
  useEffect(() => {
    fetchUsers("");
    fetchUnreadCounts();
    fetchGroups();
  }, [fetchUsers, fetchUnreadCounts, fetchGroups]);

  // Ensure current active group from URL is always in state
  useEffect(() => {
    if (selectedId && selectedId.startsWith("group_")) {
      setGroups((prevGroups) => {
        const exists = prevGroups.some(
          (g) => g.chatId.split("?")[0] === selectedId.split("?")[0]
        );
        if (!exists) {
          const newGroup = parseGroupFromId(selectedId, users, currentUser);
          if (newGroup) {
            return [newGroup, ...prevGroups];
          }
        }
        return prevGroups;
      });
    }
  }, [selectedId, users, currentUser]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  // Handle incoming messages for unread counter & live sidebar update / re-sorting
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (newMessage: any) => {
      if (newMessage.senderId !== currentUser.id) {
        if (selectedId !== newMessage.chatId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      }

      if (newMessage.chatId && newMessage.chatId.startsWith("group_")) {
        setGroups((prevGroups) => {
          let found = false;
          const updated = prevGroups.map((g) => {
            if (g.chatId.split("?")[0] === newMessage.chatId.split("?")[0]) {
              found = true;
              return {
                ...g,
                lastMessage: {
                  content: newMessage.content,
                  createdAt: newMessage.createdAt || new Date().toISOString(),
                  senderId: newMessage.senderId,
                  senderName: newMessage.senderName,
                },
              };
            }
            return g;
          });

          if (!found) {
            const newG = parseGroupFromId(newMessage.chatId, users, currentUser);
            if (newG) {
              newG.lastMessage = {
                content: newMessage.content,
                createdAt: newMessage.createdAt || new Date().toISOString(),
                senderId: newMessage.senderId,
                senderName: newMessage.senderName,
              };
              return [newG, ...updated];
            }
          }
          return updated;
        });
      }

      const otherUserId = newMessage.chatId
        ? newMessage.chatId
            .split("_vs_")
            .find((id: string) => id !== currentUser.id)
        : null;

      if (otherUserId) {
        setUsers((prevUsers) => {
          const updated = prevUsers.map((user) => {
            if (user.id === otherUserId) {
              return {
                ...user,
                lastMessage: {
                  content: newMessage.content,
                  createdAt: newMessage.createdAt || new Date().toISOString(),
                  senderId: newMessage.senderId,
                },
              };
            }
            return user;
          });
          return sortUsers(updated);
        });
      }
    };

    const handleGroupRenamed = ({ chatId, newName }: any) => {
      setGroups((prevGroups) =>
        prevGroups.map((g) => {
          const cleanTarget = chatId.split("?")[0];
          const cleanCurrent = g.chatId.split("?")[0];
          if (cleanTarget === cleanCurrent) {
            const [baseId] = g.chatId.split("?");
            return {
              ...g,
              chatId: `${baseId}?name=${encodeURIComponent(newName)}`,
              name: newName,
            };
          }
          return g;
        })
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("group_renamed", handleGroupRenamed);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("group_renamed", handleGroupRenamed);
    };
  }, [selectedId, currentUser]);

  // Clear unread count when opening a chat
  useEffect(() => {
    if (selectedId && currentUser) {
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
    <div className="w-80 border-r bg-muted/30 flex flex-col shrink-0 min-h-0 h-full overflow-hidden">
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            title="New Chat or Group"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 shrink-0">
        <div className="relative">
          {isSearching ? (
            <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            type="search"
            placeholder="Search users or groups..."
            className="pl-8 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 mt-3 bg-muted/60 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("direct")}
            className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === "direct"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === "groups"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Groups {groups.length > 0 && `(${groups.length})`}
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-1 p-2">
          {/* Groups Section */}
          {(activeTab === "all" || activeTab === "groups") && groups.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              {activeTab === "all" && (
                <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Groups
                </div>
              )}
              {groups
                .filter((g) => {
                  const gName =
                    g.name || g.members.map((m) => m.name).join(", ");
                  return gName.toLowerCase().includes(search.toLowerCase());
                })
                .map((group) => {
                  const isSelected = selectedId
                    ? selectedId.split("?")[0] === group.chatId.split("?")[0]
                    : false;
                  const groupName =
                    group.name ||
                    group.members.map((m) => m.name).join(", ") ||
                    "Group Chat";

                  return (
                    <Link
                      href={`/chat/${group.chatId}`}
                      key={group.chatId}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm truncate">
                            {groupName}
                          </span>
                          {group.lastMessage?.createdAt && (
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatTimestamp(group.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {group.lastMessage?.content
                            ? `${
                                group.lastMessage.senderName
                                  ? group.lastMessage.senderName + ": "
                                  : ""
                              }${group.lastMessage.content}`
                            : `${group.memberIds.length} members`}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}

          {/* Direct Messages Section */}
          {(activeTab === "all" || activeTab === "direct") && (
            <div className="flex flex-col gap-1">
              {activeTab === "all" && groups.length > 0 && (
                <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Direct Messages
                </div>
              )}
              {users.length === 0 && !isSearching && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  {search ? `No users found for "${search}"` : "No other users yet"}
                </div>
              )}
              {users.map((otherUser) => {
                const chatId = [currentUser.id, otherUser.id]
                  .sort()
                  .join("_vs_");
                const isSelected = selectedId === chatId;
                const isOnline = onlineUserIds.has(otherUser.id);
                const unreadCount = unreadCounts[otherUser.id] || 0;
                const lastMsg = otherUser.lastMessage;

                return (
                  <Link
                    href={`/chat/${chatId}`}
                    key={otherUser.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="relative shrink-0">
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
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm truncate">
                          {otherUser.name}
                        </span>
                        {lastMsg?.createdAt && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatTimestamp(lastMsg.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                          {lastMsg ? lastMsg.content : otherUser.email}
                        </p>
                        {unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* New Chat / Create Group Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-base">New Chat or Group</h3>
                <p className="text-xs text-muted-foreground">
                  Select 1 user for DM, or 2+ users to create a group chat.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-3 border-b shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 bg-muted/40"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Optional Group Name input if 2+ selected */}
            {selectedUserIds.length > 1 && (
              <div className="p-3 border-b bg-muted/20 shrink-0 flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Group Name (Optional)
                </label>
                <Input
                  placeholder="e.g. Design Team, Family, Devs..."
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  className="bg-background text-sm"
                />
              </div>
            )}

            {/* User list with checkboxes */}
            <ScrollArea className="flex-1 p-2">
              <div className="flex flex-col gap-1">
                {users
                  .filter(
                    (u) =>
                      u.name
                        .toLowerCase()
                        .includes(modalSearch.toLowerCase()) ||
                      u.email.toLowerCase().includes(modalSearch.toLowerCase())
                  )
                  .map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    const isOnline = onlineUserIds.has(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => toggleUserSelection(u.id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={u.image ?? ""} alt={u.name} />
                              <AvatarFallback>
                                {u.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {u.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {u.email}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>

            {/* Modal Footer */}
            <div className="p-4 border-t flex items-center justify-between shrink-0 bg-muted/10">
              <span className="text-xs text-muted-foreground font-medium">
                {selectedUserIds.length === 0
                  ? "No user selected"
                  : selectedUserIds.length === 1
                  ? "1 user selected"
                  : `${selectedUserIds.length} users selected`}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={selectedUserIds.length === 0}
                  onClick={handleCreateChatOrGroup}
                  className="gap-1.5"
                >
                  {selectedUserIds.length > 1 ? (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Create Group ({selectedUserIds.length})</span>
                    </>
                  ) : (
                    <span>Start Chat</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

