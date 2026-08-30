"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Link2,
  LogOut,
  Palette,
  Pencil,
  Search,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatUser, Conversation } from "@/types/chat.types";
import {
  parseGroupAdmin,
  parseGroupName,
  parseGroupTheme,
} from "@/constants/group.constants";
import { getSocket } from "@/lib/socket";

const THEMES = [
  {
    id: "default",
    name: "Default",
    colorClass: "bg-primary",
  },
  {
    id: "blue",
    name: "Blue",
    colorClass: "bg-blue-500",
  },
  {
    id: "rose",
    name: "Rose",
    colorClass: "bg-rose-500",
  },
  {
    id: "green",
    name: "Green",
    colorClass: "bg-green-500",
  },
  {
    id: "violet",
    name: "Violet",
    colorClass: "bg-violet-500",
  },
  {
    id: "orange",
    name: "Orange",
    colorClass: "bg-orange-500",
  },
];

interface DetailsPanelProps {
  conversation: Conversation;
  currentUser: ChatUser;
  onClose: () => void;
}

export function DetailsPanel({
  conversation,
  currentUser,
  onClose,
}: DetailsPanelProps) {
  const router = useRouter();

  const isGroup =
    conversation.isGroup || conversation.participants.length > 2;

  const otherUsers = conversation.participants.filter(
    (p) => p.id !== currentUser.id
  );

  const otherUser = otherUsers[0];

  const defaultGroupName =
    parseGroupName(conversation.id, conversation.name) || "Group Chat";

  const currentTheme = parseGroupTheme(conversation.id);
  const adminId = parseGroupAdmin(conversation.id);
  const isAdmin = currentUser.id === adminId;

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(defaultGroupName);

  const [showAddUser, setShowAddUser] = useState(false);
  const [usersToSelect, setUsersToSelect] = useState<any[]>([]);
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const [pendingTheme, setPendingTheme] = useState<string | null>(null);

  useEffect(() => {
    const resolved =
      parseGroupName(conversation.id, conversation.name) || "Group Chat";

    setNameInput(resolved);
    setIsEditingName(false);
  }, [conversation.id, conversation.name]);

  /*
   * Search users that can be added to the group.
   */
  useEffect(() => {
    if (!showAddUser) return;

    const fetchUsers = async () => {
      setIsSearchingUsers(true);

      try {
        const res = await fetch(
          `/api/users?excludeId=${currentUser.id}&q=${encodeURIComponent(
            addSearchQuery
          )}`
        );

        if (res.ok) {
          const data = await res.json();

          const currentIds = conversation.participants.map((p) => p.id);

          const available = data.filter(
            (user: any) => !currentIds.includes(user.id)
          );

          setUsersToSelect(available);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsSearchingUsers(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);

    return () => clearTimeout(debounce);
  }, [
    showAddUser,
    addSearchQuery,
    conversation.participants,
    currentUser.id,
  ]);

  /*
   * Listen for group rename updates.
   */
  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    const handleGroupRenamed = ({
      chatId,
      newChatId,
      newName,
    }: any) => {
      const cleanTarget = chatId ? chatId.split("?")[0] : "";
      const cleanCurrent = conversation.id.split("?")[0];

      if (cleanTarget === cleanCurrent) {
        if (newName !== undefined) {
          setNameInput(newName);
        }

        if (newChatId && newChatId !== conversation.id) {
          router.replace(`/chat/${newChatId}`);
        }
      }
    };

    socket.on("group_renamed", handleGroupRenamed);

    return () => {
      socket.off("group_renamed", handleGroupRenamed);
    };
  }, [conversation.id, router]);

  const getAvatar = (user?: ChatUser) =>
    user?.image || user?.avatar || "";

  const getInitials = (name?: string) =>
    name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?";

  /*
   * Add user.
   */
  const handleAddUser = (
    targetUserId: string,
    targetUserName: string
  ) => {
    const socket = getSocket();

    if (!socket) return;

    socket.emit("add_user_to_group", {
      chatId: conversation.id,
      targetUserId,
      targetUserName,
      adminName: currentUser.name,
    });

    setShowAddUser(false);
    setAddSearchQuery("");
  };

  /*
   * Remove user.
   */
  const handleRemoveUser = (targetUser: ChatUser) => {
    if (!isAdmin) return;

    const socket = getSocket();

    if (!socket) return;

    socket.emit("remove_user_from_group", {
      chatId: conversation.id,
      targetUserId: targetUser.id,
      targetUserName: targetUser.name,
      adminName: currentUser.name,
    });
  };

  /*
   * Change group theme.
   */
  const handleUpdateTheme = (newTheme: string) => {
    if (newTheme === currentTheme) return;

    const socket = getSocket();

    if (socket) {
      socket.emit("rename_group", {
        chatId: conversation.id,
        newTheme,
        userId: currentUser.id,
        userName: currentUser.name,
      });
    }

    const [baseId, queryPart] = conversation.id.split("?");

    const params = new URLSearchParams(queryPart || "");

    params.set("theme", newTheme);

    router.push(`/chat/${baseId}?${params.toString()}`);
  };

  /*
   * Save group name.
   */
  const handleSaveName = () => {
    const newName = nameInput.trim();

    if (!newName) return;

    const socket = getSocket();

    if (socket) {
      socket.emit("rename_group", {
        chatId: conversation.id,
        newName,
        userId: currentUser.id,
        userName: currentUser.name,
      });
    }

    const [baseId, queryPart] = conversation.id.split("?");

    const params = new URLSearchParams(queryPart || "");

    params.set("name", newName);

    router.push(`/chat/${baseId}?${params.toString()}`);

    setIsEditingName(false);
  };

  /*
   * Leave group.
   */
  const handleLeaveGroup = () => {
    const socket = getSocket();

    if (socket) {
      socket.emit("leave_group", {
        chatId: conversation.id,
        userId: currentUser.id,
        userName: currentUser.name,
      });
    }

    router.push("/chat");
    onClose();
  };

  return (
    <aside className="relative flex h-full w-full max-w-[360px] shrink-0 flex-col overflow-hidden border-l bg-background shadow-[-8px_0_30px_rgba(0,0,0,0.04)]">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-5 backdrop-blur">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            {isGroup ? "Group details" : "Contact details"}
          </h2>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {isGroup
              ? `${conversation.participants.length} members`
              : "Conversation information"}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-9 w-9 rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="pb-8">
          {/* ==========================================================
              PROFILE
          ========================================================== */}
          <section className="border-b px-5 py-7">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {isGroup ? (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-primary/10 ring-1 ring-primary/20">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                ) : (
                  <Avatar className="h-24 w-24 rounded-[28px] ring-4 ring-background shadow-md">
                    <AvatarImage
                      src={getAvatar(otherUser)}
                      alt={otherUser?.name}
                    />

                    <AvatarFallback className="rounded-[28px] bg-muted text-xl font-semibold">
                      {getInitials(otherUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {!isGroup && (
                  <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-background bg-emerald-500" />
                )}
              </div>

              <div className="mt-4 w-full">
                {isEditingName && isGroup ? (
                  <div className="mx-auto flex max-w-[270px] items-center gap-2">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setIsEditingName(false);
                        }
                      }}
                      className="h-9 rounded-lg text-center text-sm"
                    />

                    <Button
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-lg"
                      onClick={handleSaveName}
                      aria-label="Save group name"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="max-w-[260px] truncate text-base font-semibold">
                      {isGroup ? nameInput : otherUser?.name}
                    </h3>

                    {isGroup && (
                      <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Rename group"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-1.5 flex items-center justify-center gap-2">
                  {isGroup ? (
                    <>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {conversation.participants.length} members
                      </span>

                      {isAdmin && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                          Admin
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              GROUP APPEARANCE
          ========================================================== */}
          {isGroup && (
            <section className="border-b px-5 py-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </div>

                <div>
                  <h4 className="text-xs font-semibold">
                    Appearance
                  </h4>

                  <p className="text-[10px] text-muted-foreground">
                    Choose your group color
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  {THEMES.map((theme) => {
                    const selected = currentTheme === theme.id;
                    const pending = pendingTheme === theme.id;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        title={theme.name}
                        onClick={() => {
                          if (selected) return;
                          setPendingTheme(theme.id);
                        }}
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                          theme.colorClass
                        } ${
                          selected
                            ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                            : pending
                            ? "scale-105 ring-2 ring-muted-foreground ring-offset-2 ring-offset-background"
                            : "opacity-60 hover:scale-110 hover:opacity-100"
                        }`}
                      >
                        {selected && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {pendingTheme && (
                  <div className="mt-3 rounded-lg bg-background p-3 shadow-sm ring-1 ring-border">
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="text-xs font-medium">
                        Apply{" "}
                        {
                          THEMES.find(
                            (theme) => theme.id === pendingTheme
                          )?.name
                        }{" "}
                        theme?
                      </span>

                      <button
                        type="button"
                        onClick={() => setPendingTheme(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex-1 text-xs"
                        onClick={() => setPendingTheme(null)}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="sm"
                        className="h-8 flex-1 text-xs"
                        onClick={() => {
                          handleUpdateTheme(pendingTheme);
                          setPendingTheme(null);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ==========================================================
              MEMBERS
          ========================================================== */}
          {isGroup && (
            <section className="border-b px-5 py-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold">
                    Members
                  </h4>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    People in this group
                  </p>
                </div>

                <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  {conversation.participants.length}
                </span>
              </div>

              {/* Add member */}
              {isAdmin && (
                <Button
                  variant="outline"
                  className={`mb-3 h-9 w-full justify-start rounded-lg text-xs ${
                    showAddUser
                      ? "border-primary/30 bg-primary/5 text-primary"
                      : ""
                  }`}
                  onClick={() => {
                    setShowAddUser(!showAddUser);
                    setAddSearchQuery("");
                  }}
                >
                  <UserPlus className="mr-2.5 h-4 w-4" />
                  Add member
                </Button>
              )}

              {/* Search members */}
              {showAddUser && (
                <div className="mb-4 rounded-xl border bg-muted/20 p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      autoFocus
                      value={addSearchQuery}
                      onChange={(e) =>
                        setAddSearchQuery(e.target.value)
                      }
                      placeholder="Search people..."
                      className="h-9 rounded-lg bg-background pl-9 text-xs"
                    />
                  </div>

                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {isSearchingUsers ? (
                      <div className="py-5 text-center text-[11px] text-muted-foreground">
                        Searching...
                      </div>
                    ) : usersToSelect.length === 0 ? (
                      <div className="py-5 text-center">
                        <Users className="mx-auto mb-2 h-5 w-5 text-muted-foreground/50" />

                        <p className="text-[11px] text-muted-foreground">
                          No people found
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {usersToSelect.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() =>
                              handleAddUser(user.id, user.name)
                            }
                            className="group flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-background"
                          >
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage
                                src={user.image || ""}
                                alt={user.name}
                              />

                              <AvatarFallback className="text-[10px]">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>

                            <span className="min-w-0 flex-1 truncate text-xs font-medium">
                              {user.name}
                            </span>

                            <span className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:bg-muted group-hover:opacity-100">
                              <UserPlus className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Members list */}
              <div className="space-y-1">
                {conversation.participants.map((user) => {
                  const userIsAdmin = user.id === adminId;
                  const isCurrentUser = user.id === currentUser.id;

                  return (
                    <div
                      key={user.id}
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={getAvatar(user)}
                            alt={user.name}
                          />

                          <AvatarFallback className="text-[10px] font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>

                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-medium">
                            {user.name}
                          </span>

                          {isCurrentUser && (
                            <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                              You
                            </span>
                          )}
                        </div>

                        {userIsAdmin && (
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-primary">
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                          </div>
                        )}
                      </div>

                      {isAdmin && !isCurrentUser && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveUser(user)
                          }
                          className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                          title="Remove member"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ==========================================================
              CHAT ACTIONS
          ========================================================== */}
          <section className="border-b px-5 py-5">
            <h4 className="mb-3 text-xs font-semibold">
              Conversation
            </h4>

            <div className="overflow-hidden rounded-xl border bg-muted/10">
              <Button
                variant="ghost"
                className="h-12 w-full justify-start rounded-none px-3 text-xs font-medium hover:bg-muted/60"
              >
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>

                <span className="flex-1 text-left">
                  Mute notifications
                </span>

                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>

              {isGroup && (
                <>
                  <div className="mx-3 border-t" />

                  <Button
                    variant="ghost"
                    onClick={handleLeaveGroup}
                    className="h-12 w-full justify-start rounded-none px-3 text-xs font-medium text-destructive hover:bg-destructive/5 hover:text-destructive"
                  >
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                      <LogOut className="h-4 w-4" />
                    </div>

                    <span className="flex-1 text-left">
                      Leave group
                    </span>

                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </section>

          {/* ==========================================================
              SHARED MEDIA
          ========================================================== */}
          <section className="border-b px-5 py-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold">
                  Shared media
                </h4>

                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Photos and media shared here
                </p>
              </div>

              <button
                type="button"
                className="text-[10px] font-medium text-primary hover:underline"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="group relative aspect-square overflow-hidden rounded-xl bg-muted transition-all hover:ring-2 hover:ring-primary/30"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground/40 transition-transform group-hover:scale-110" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ==========================================================
              FILES & LINKS
          ========================================================== */}
          <section className="px-5 py-5">
            <div className="mb-3">
              <h4 className="text-xs font-semibold">
                Files & links
              </h4>

              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Shared documents and links
              </p>
            </div>

            <div className="space-y-1.5">
              {/* File */}
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-2.5 text-left transition-all hover:border-border hover:bg-muted/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">
                    project_requirements.pdf
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    1.2 MB · 2 days ago
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              {/* Link */}
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-2.5 text-left transition-all hover:border-border hover:bg-muted/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Link2 className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">
                    Figma Design System
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    figma.com · Yesterday
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}

