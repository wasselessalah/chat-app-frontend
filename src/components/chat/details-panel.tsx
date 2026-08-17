"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser, Conversation } from "@/types/chat";
import { Bell, FileText, Image as ImageIcon, Link2, X, Users, Pencil, Check, LogOut, Palette } from "lucide-react";
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

  const parseGroupName = (convId: string, convName?: string | null) => {
    if (convName) return convName;
    if (convId.startsWith("group_") && convId.includes("?")) {
      const params = new URLSearchParams(convId.split("?")[1]);
      const nameParam = params.get("name");
      if (nameParam) return nameParam;
    }
    return "";
  };

  const defaultGroupName = parseGroupName(conversation.id, conversation.name) || "Group Chat";

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(defaultGroupName);

  useEffect(() => {
    const resolved = parseGroupName(conversation.id, conversation.name) || "Group Chat";
    setNameInput(resolved);
    setIsEditingName(false);
  }, [conversation.id, conversation.name]);

  const parseGroupTheme = (convId: string) => {
    if (convId.startsWith("group_") && convId.includes("?")) {
      const params = new URLSearchParams(convId.split("?")[1]);
      const themeParam = params.get("theme");
      if (themeParam) return themeParam;
    }
    return "default";
  };

  const currentTheme = parseGroupTheme(conversation.id);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleGroupRenamed = ({ chatId, newName }: any) => {
      const cleanTarget = chatId ? chatId.split("?")[0] : "";
      const cleanCurrent = conversation.id.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (newName) setNameInput(newName);
      }
    };
    socket.on("group_renamed", handleGroupRenamed);
    return () => {
      socket.off("group_renamed", handleGroupRenamed);
    };
  }, [conversation.id]);

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
    const [baseId] = conversation.id.split("?");
    const newChatId = `${baseId}?name=${encodeURIComponent(nameInput.trim())}`;
    router.push(`/chat/${newChatId}`);
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
                  onClick={() => handleUpdateTheme(t.id)}
                  title={t.name}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    t.colorClass
                  } ${
                    currentTheme === t.id
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-110 opacity-70 hover:opacity-100"
                  }`}
                >
                  {currentTheme === t.id && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Group members list if group */}
        {isGroup && (
          <div className="p-4 border-b">
            <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Members ({conversation.participants.length})
            </h4>
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
                    <span className="text-xs font-medium truncate">
                      {user.name} {user.id === currentUser.id ? "(You)" : ""}
                    </span>
                    {user.email && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
