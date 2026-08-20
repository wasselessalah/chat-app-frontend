"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2, Users, MessageSquare, Check, X } from "lucide-react";
import { ChatUser } from "@/types/chat.types";
import { getSocket } from "@/lib/socket";

interface NewChatModalProps {
  currentUser: ChatUser;
  trigger?: React.ReactNode;
}

export function NewChatModal({ currentUser, trigger }: NewChatModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"direct" | "group">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Group specific
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([]);
  
  useEffect(() => {
    if (!open) {
      setMode("direct");
      setSearchQuery("");
      setGroupName("");
      setSelectedUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users?excludeId=${currentUser.id}&q=${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [open, searchQuery, currentUser.id]);

  const handleStartDirect = (targetUser: ChatUser) => {
    const chatId = [currentUser.id, targetUser.id].sort().join("_vs_");
    router.push(`/chat/${chatId}`);
    setOpen(false);
  };

  const toggleUserSelection = (user: ChatUser) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("create_group", {
        name: groupName.trim(),
        creatorName: currentUser.name,
        memberIds: selectedUsers.map((u) => u.id),
      });
      // The socket event will trigger a group_created event which we listen to in useSidebar
      // But we can also optimistically navigate to the URL
      const allIds = Array.from(new Set([currentUser.id, ...selectedUsers.map(u => u.id)])).sort();
      const baseGroupKey = `group_${allIds.join("_vs_")}`;
      const params = new URLSearchParams();
      params.set("name", groupName.trim());
      params.set("admin", currentUser.id);
      
      const newChatId = `${baseGroupKey}?${params.toString()}`;
      router.push(`/chat/${encodeURIComponent(newChatId)}`);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          (trigger as React.ReactElement) || (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <EditIcon className="h-4 w-4" />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 border-b bg-muted/30">
          <DialogTitle className="text-center font-bold">New Chat</DialogTitle>
          <div className="flex bg-background border rounded-lg p-1 mt-4">
            <Button
              variant={mode === "direct" ? "default" : "ghost"}
              className="flex-1 h-8 text-xs"
              onClick={() => { setMode("direct"); setSelectedUsers([]); setGroupName(""); }}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-2" /> Direct
            </Button>
            <Button
              variant={mode === "group" ? "default" : "ghost"}
              className="flex-1 h-8 text-xs"
              onClick={() => setMode("group")}
            >
              <Users className="w-3.5 h-3.5 mr-2" /> Group
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-3 min-h-[300px]">
          {mode === "group" && (
            <div className="space-y-2 mb-2 animate-in fade-in slide-in-from-top-2">
              <Input
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-muted/30"
                autoFocus
              />
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-muted/20 rounded-md border">
                  {selectedUsers.map((su) => (
                    <span key={su.id} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-medium px-2 py-1 rounded-full">
                      {su.name}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleUserSelection(su)} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={mode === "group" ? "Search users to add..." : "Search users to chat..."}
              className="pl-8 bg-muted/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="flex-1 h-[250px] -mx-4 px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-xs">Searching...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No users found.
              </div>
            ) : (
              <div className="flex flex-col gap-1 py-1">
                {users.map((user) => {
                  const isSelected = selectedUsers.some((u) => u.id === user.id);
                  
                  return (
                    <div
                      key={user.id}
                      onClick={() => mode === "direct" ? handleStartDirect(user) : toggleUserSelection(user)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                        ${mode === "group" && isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"}`}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="text-xs">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      {mode === "group" && (
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors
                          ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {mode === "group" && (
          <div className="p-4 border-t bg-muted/10">
            <Button 
              className="w-full" 
              disabled={!groupName.trim() || selectedUsers.length === 0}
              onClick={handleCreateGroup}
            >
              Create Group ({selectedUsers.length} members)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Just an icon wrapper since lucide-react Edit is used as fallback
function EditIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
