"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser, Conversation } from "@/types/chat.types";
import { parseGroupName, parseGroupTheme, parseGroupAdmin } from "@/constants/group.constants";
import { Bell, FileText, Image as ImageIcon, Link2, X, Users, Pencil, Check, LogOut, Palette, ShieldAlert, UserMinus, UserPlus, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";

const THEMES = [
  { id: "default", name: "Default", colorClass: "bg-primary" },
  { id: "blue", name: "Blue", colorClass: "bg-blue-500" },
  { id: "rose", name: "Rose", colorClass: "bg-rose-500" },
  { id: "green", name: "Green", colorClass: "bg-green-500" },
  { id: "violet", name: "Violet", colorClass: "bg-violet-500" },
  { id: "orange", name: "Orange", colorClass: "bg-orange-500" },
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
  const isGroup = conversation.isGroup || conversation.participants.length > 2;
  const otherUsers = conversation.participants.filter(
    (p) => p.id !== currentUser.id
  );
  const otherUser = otherUsers[0];

  const defaultGroupName = parseGroupName(conversation.id, conversation.name) || "Group Chat";

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(defaultGroupName);

  useEffect(() => {
    const resolved = parseGroupName(conversation.id, conversation.name) || "Group Chat";
    setNameInput(resolved);
    setIsEditingName(false);
  }, [conversation.id, conversation.name]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [usersToSelect, setUsersToSelect] = useState<any[]>([]);
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  useEffect(() => {
    if (showAddUser) {
      const fetchUsers = async () => {
        setIsSearchingUsers(true);
        try {
          const res = await fetch(`/api/users?excludeId=${currentUser.id}&q=${addSearchQuery}`);
          if (res.ok) {
            const data = await res.json();
            const currentIds = conversation.participants.map(p => p.id);
            const available = data.filter((u: any) => !currentIds.includes(u.id));
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
    }
  }, [showAddUser, addSearchQuery, conversation.participants, currentUser.id]);

  const handleAddUser = (targetUserId: string, targetUserName: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("add_user_to_group", {
        chatId: conversation.id,
        targetUserId,
        targetUserName,
        adminName: currentUser.name,
      });
      setShowAddUser(false);
      setAddSearchQuery("");
    }
  };

  const currentTheme = parseGroupTheme(conversation.id);
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);

  const adminId = parseGroupAdmin(conversation.id);
  const isAdmin = currentUser.id === adminId;

  const handleRemoveUser = (targetUser: ChatUser) => {
    if (!isAdmin) return;
    const socket = getSocket();
    if (socket) {
      socket.emit("remove_user_from_group", {
        chatId: conversation.id,
        targetUserId: targetUser.id,
        targetUserName: targetUser.name,
        adminName: currentUser.name,
      });
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleGroupRenamed = ({ chatId, newChatId, newName }: any) => {
      const cleanTarget = chatId ? chatId.split("?")[0] : "";
      const cleanCurrent = conversation.id.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (newName !== undefined) setNameInput(newName);
        // Navigate to the updated chatId that the server authorised
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
    // Optimistically update the URL so the theme reflects immediately
    const [baseId, queryPart] = conversation.id.split("?");
    const params = new URLSearchParams(queryPart || "");
    params.set("theme", newTheme);
    router.push(`/chat/${baseId}?${params.toString()}`);
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const socket = getSocket();
    if (socket) {
      socket.emit("rename_group", {
        chatId: conversation.id,
        newName: nameInput.trim(),
        userId: currentUser.id,
        userName: currentUser.name,
      });
    }
    // Preserve all existing params (e.g. theme) when renaming
    const [baseId, queryPart] = conversation.id.split("?");
    const params = new URLSearchParams(queryPart || "");
    params.set("name", nameInput.trim());
    router.push(`/chat/${baseId}?${params.toString()}`);
    setIsEditingName(false);
  };

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

  const getAvatar = (user: ChatUser) => user.image || user.avatar || "";

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full shrink-0 min-h-0 overflow-hidden">
      <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
        <h3 className="font-semibold">{isGroup ? "Group Info" : "Contact Info"}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col items-center p-6 border-b text-center">
          {isGroup ? (
            <Avatar className="h-20 w-20 mb-3 bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="h-10 w-10 text-primary" />
            </Avatar>
          ) : (
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage
                src={getAvatar(otherUser)}
                alt={otherUser?.name}
              />
              <AvatarFallback className="text-2xl">
                {otherUser?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          {isEditingName && isGroup ? (
            <div className="flex items-center gap-1.5 mt-1 w-full max-w-[200px]">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="h-8 text-xs bg-background"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setIsEditingName(false);
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-green-600 shrink-0"
                onClick={handleSaveName}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 justify-center group mt-1">
              <h2 className="text-base font-semibold">
                {isGroup ? nameInput : otherUser?.name}
              </h2>
              {isGroup && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="opacity-60 hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity cursor-pointer"
                  title="Rename Group"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {isGroup
              ? `${conversation.participants.length} members`
              : otherUser?.email}
          </p>
        </div>

        {isGroup && (
          <div className="p-4 border-b">
            <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4" /> Theme Color
            </h4>
            <div className="flex flex-wrap gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    if (currentTheme !== t.id) {
                      setPendingTheme(t.id);
                    }
                  }}
                  title={t.name}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    t.colorClass
                  } ${
                    currentTheme === t.id
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : pendingTheme === t.id
                      ? "ring-2 ring-offset-2 ring-muted-foreground scale-110"
                      : "hover:scale-110 opacity-70 hover:opacity-100"
                  }`}
                >
                  {currentTheme === t.id && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
            {pendingTheme && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs text-center font-medium">Apply {THEMES.find(t => t.id === pendingTheme)?.name} theme?</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 h-7 text-xs" 
                    onClick={() => setPendingTheme(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 h-7 text-xs" 
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
        )}

        {/* Group members list if group */}
        {isGroup && (
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Members ({conversation.participants.length})
              </h4>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-6 w-6 rounded-full text-muted-foreground transition-colors ${showAddUser ? "bg-muted text-foreground" : "hover:bg-muted"}`} 
                  title="Add User"
                  onClick={() => {
                    setShowAddUser(!showAddUser);
                    setAddSearchQuery("");
                  }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              {conversation.participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatar(user)} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium truncate flex items-center gap-1">
                      {user.name} {user.id === currentUser.id ? "(You)" : ""}
                      {user.id === adminId && (
                        <span title="Group Admin" className="flex items-center">
                          <ShieldAlert className="w-3 h-3 text-primary ml-1" />
                        </span>
                      )}
                    </span>
                    {user.email && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {user.email}
                      </span>
                    )}
                  </div>
                  {isAdmin && user.id !== currentUser.id && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive shrink-0" 
                      title="Remove User"
                      onClick={() => handleRemoveUser(user)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {showAddUser && (
              <div className="mt-4 p-3 bg-muted/40 rounded-lg border flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    autoFocus
                    placeholder="Search users to add..." 
                    value={addSearchQuery}
                    onChange={(e) => setAddSearchQuery(e.target.value)}
                    className="pl-7 h-7 text-xs bg-background"
                  />
                </div>
                <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto mt-1">
                  {isSearchingUsers ? (
                    <span className="text-[10px] text-muted-foreground text-center py-2">Searching...</span>
                  ) : usersToSelect.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground text-center py-2">No users found.</span>
                  ) : (
                    usersToSelect.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted transition-colors group cursor-pointer" onClick={() => handleAddUser(u.id, u.name)}>
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={u.image || ""} alt={u.name} />
                            <AvatarFallback className="text-[8px]">{u.name.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium truncate">{u.name}</span>
                        </div>
                        <Button size="icon" variant="ghost" className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <UserPlus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 flex flex-col gap-2 border-b">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Bell className="mr-3 h-5 w-5" />
            Mute Notifications
          </Button>
          {isGroup && (
            <Button
              variant="ghost"
              onClick={handleLeaveGroup}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Leave Group
            </Button>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">
            Shared Media
          </h4>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-md flex items-center justify-center"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">
            Files &amp; Links
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  project_requirements.pdf
                </p>
                <p className="text-xs text-muted-foreground">1.2 MB • 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <Link2 className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Figma Design System</p>
                <p className="text-xs text-muted-foreground">
                  figma.com • Yesterday
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
