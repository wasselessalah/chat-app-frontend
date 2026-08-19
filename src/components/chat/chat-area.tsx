"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser, Conversation, Message } from "@/types/chat.types";
import {
  Info, MoreVertical, Phone, Search, Send, Video,
  Check, Pencil, Smile, Loader2, Users,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { parseGroupName, parseGroupTheme } from "@/constants/group.constants";
import { useMessages } from "@/features/chat/hooks/useMessages";
import { useMessageSocket } from "@/features/chat/hooks/useMessageSocket";
import { MessageItem } from "@/features/chat/components/MessageItem";
import { EmojiPicker } from "@/features/chat/components/EmojiPicker";

interface ChatAreaProps {
  conversation: Conversation;
  currentUser: ChatUser;
  onToggleDetails: () => void;
}

export function ChatArea({
  conversation,
  currentUser,
  onToggleDetails,
}: ChatAreaProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const theme = parseGroupTheme(conversation.id);
  const getThemeColorClass = (theme: string) => {
    switch (theme) {
      case "rose": return "bg-rose-500 text-white";
      case "blue": return "bg-blue-500 text-white";
      case "green": return "bg-green-500 text-white";
      case "violet": return "bg-violet-500 text-white";
      case "orange": return "bg-orange-500 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };
  const themeColorClass = getThemeColorClass(theme);

  const [groupNameInput, setGroupNameInput] = useState(
    parseGroupName(conversation.id, conversation.name)
  );

  useEffect(() => {
    setGroupNameInput(parseGroupName(conversation.id, conversation.name));
    setIsEditingGroupName(false);
  }, [conversation.id, conversation.name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const isGroup = conversation.isGroup || conversation.participants.length > 2;
  const otherUsers = conversation.participants.filter((p) => p.id !== currentUser.id);
  const otherUser = otherUsers[0];

  const onlineUserIds = useOnlineUsers();
  const isOnline = otherUser ? onlineUserIds.has(otherUser.id) : false;

  const {
    messages,
    setMessages,
    hasMore,
    isLoadingMore,
    loadOlderMessages,
    scrollRef,
  } = useMessages(conversation.id, currentUser.id, activeSearch);

  useMessageSocket({
    chatId: conversation.id,
    currentUserId: currentUser.id,
    setMessages,
    setGroupNameInput,
    scrollRef,
  });

  const getDisplayName = (user: ChatUser) => user.name || "Unknown";
  const getAvatar = (user: ChatUser) => user.image || user.avatar || "";

  if (!otherUser && !isGroup) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("send_message", {
        content: inputValue,
        senderId: currentUser.id,
        senderName: currentUser.name,
        chatId: conversation.id,
      });
    }

    setInputValue("");
    setShowEmojiPicker(false);
  };

  const handleSelectEmoji = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleStartEdit = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.content);
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editingText.trim()) return;
    const socket = getSocket();
    if (socket) {
      socket.emit("update_message", {
        messageId,
        content: editingText.trim(),
        senderId: currentUser.id,
      });
    }
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleDeleteMessage = (messageId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("delete_message", { messageId, senderId: currentUser.id });
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("react_message", { messageId, emoji, userId: currentUser.id });
    }
    setActivePickerId(null);
  };

  const handleSaveGroupName = () => {
    if (!groupNameInput.trim()) return;
    const cleanName = groupNameInput.trim();
    const socket = getSocket();
    if (socket) {
      socket.emit("rename_group", {
        chatId: conversation.id,
        newName: cleanName,
        userId: currentUser.id,
        userName: currentUser.name,
      });
    }
    const [baseId, queryPart] = conversation.id.split("?");
    const urlParams = new URLSearchParams(queryPart || "");
    urlParams.set("name", cleanName);
    setGroupNameInput(cleanName);
    router.push(`/chat/${baseId}?${urlParams.toString()}`);
    setIsEditingGroupName(false);
  };

  return (
    <div className="flex-1 min-h-0 min-w-0 flex flex-col bg-background h-full overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            {isGroup ? (
              <Avatar className="h-10 w-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Users className="h-5 w-5 text-primary" />
              </Avatar>
            ) : (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getAvatar(otherUser)} alt={getDisplayName(otherUser || currentUser)} />
                  <AvatarFallback>{getDisplayName(otherUser || currentUser).substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>}
              </>
            )}
          </div>
          <div>
            {isEditingGroupName ? (
              <div className="flex items-center gap-1.5">
                <Input
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  className="h-7 text-xs bg-background w-44"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveGroupName();
                    if (e.key === "Escape") setIsEditingGroupName(false);
                  }}
                />
                <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 shrink-0" onClick={handleSaveGroupName}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-sm">
                  {isGroup ? groupNameInput || "Group Chat" : getDisplayName(otherUser || currentUser)}
                </h2>
                {isGroup && (
                  <button
                    onClick={() => { setGroupNameInput(groupNameInput || "Group Chat"); setIsEditingGroupName(true); }}
                    className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
                    title="Rename Group"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {isGroup ? (
                <span>{conversation.participants.length} members</span>
              ) : (
                <>
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-muted-foreground"}`} />
                  {isOnline ? "Online" : otherUser?.email || "Offline"}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost" size="icon" className={`text-muted-foreground ${showSearch ? "bg-muted text-foreground" : ""}`}
            onClick={() => {
              if (showSearch) { setShowSearch(false); setSearchQuery(""); setActiveSearch(""); } 
              else setShowSearch(true);
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onToggleDetails}>
            <Info className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-muted/40 p-3 border-b flex items-center gap-2 shrink-0 animate-in fade-in slide-in-from-top-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setActiveSearch(searchQuery.trim());
                if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); setActiveSearch(""); }
              }}
              placeholder="Search messages in this chat..."
              className="pl-8 bg-background h-9 text-sm"
            />
          </div>
          <Button size="sm" onClick={() => setActiveSearch(searchQuery.trim())}>Search</Button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-6" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {hasMore && (
            <div className="flex justify-center py-2">
              <Button
                variant="outline" size="sm" onClick={loadOlderMessages} disabled={isLoadingMore}
                className="text-xs text-muted-foreground gap-1.5 rounded-full hover:bg-muted"
              >
                {isLoadingMore ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Loading...</span></> : <span>Load older messages</span>}
              </Button>
            </div>
          )}

          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">No messages yet. Say hello! 👋</div>
          )}

          {messages.map((msg, idx) => {
            const isSystemMsg = msg.isSystem || msg.senderId === "system" || 
              (typeof msg.content === "string" && (msg.content.includes("renamed the group to") || msg.content.includes("changed the group theme to") || msg.content.includes("created the group") || msg.content.includes("left the group") || msg.content.includes("added ") || msg.content.includes("removed ")));

            if (isSystemMsg) {
              return (
                <div key={msg.id || idx} className="flex justify-center my-3">
                  <div className="text-xs text-muted-foreground bg-muted/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-border/50 font-medium shadow-2xs text-center max-w-[85%]">
                    <span className="font-semibold text-foreground">{msg.senderName || "A member"}</span> {msg.content}
                  </div>
                </div>
              );
            }

            const isMe = msg.senderId === currentUser.id;
            const senderParticipant = conversation.participants.find((p) => p.id === msg.senderId);
            const senderAvatar = isMe ? getAvatar(currentUser) : (senderParticipant ? getAvatar(senderParticipant) : "");
            const senderName = isMe ? getDisplayName(currentUser) : msg.senderName || (senderParticipant ? getDisplayName(senderParticipant) : "Member");
            const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            return (
              <MessageItem
                key={msg.id}
                msg={msg}
                idx={idx}
                isMe={isMe}
                senderName={senderName}
                senderAvatar={senderAvatar}
                showAvatar={showAvatar}
                isGroup={isGroup}
                themeColorClass={themeColorClass}
                editingMessageId={editingMessageId}
                editingText={editingText}
                activePickerId={activePickerId}
                currentUserId={currentUser.id}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDeleteMessage={handleDeleteMessage}
                onToggleReaction={handleToggleReaction}
                setActivePickerId={setActivePickerId}
                setEditingText={setEditingText}
              />
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-background border-t shrink-0 relative" ref={emojiPickerRef}>
        {showEmojiPicker && (
          <EmojiPicker onSelect={handleSelectEmoji} onClose={() => setShowEmojiPicker(false)} />
        )}
        <form className="flex items-center gap-2" onSubmit={handleSend}>
          <Button
            type="button" variant="ghost" size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`rounded-full shrink-0 ${showEmojiPicker ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            ref={inputRef} placeholder="Type a message..." value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary"
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
