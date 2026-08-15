"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser, Conversation } from "@/types/chat";
import {
  Info,
  MoreVertical,
  Phone,
  Send,
  Video,
  Check,
  CheckCheck,
  Pencil,
  Trash2,
  Ban,
  Smile,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const EMOJIS = ["👍", "❤️", "😂", "😮"];

const parseReactions = (raw: any): { emoji: string; userId: string }[] => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }
  return [];
};

const getGroupedReactions = (rawReactions: any) => {
  const reactionsList = parseReactions(rawReactions);
  const grouped: { [emoji: string]: { count: number; userIds: string[] } } = {};

  reactionsList.forEach((r) => {
    if (!grouped[r.emoji]) {
      grouped[r.emoji] = { count: 0, userIds: [] };
    }
    grouped[r.emoji].count += 1;
    grouped[r.emoji].userIds.push(r.userId);
  });

  return grouped;
};

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
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherUser = conversation.participants.find(
    (p) => p.id !== currentUser.id
  );

  const onlineUserIds = useOnlineUsers();
  const isOnline = otherUser ? onlineUserIds.has(otherUser.id) : false;

  // Auto-scroll when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, conversation.id]);

  // Handle Socket.IO connections and historical messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Fetch historical messages from the backend
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/messages?chatId=${conversation.id}`
        );
        if (res.ok) {
          const data = await res.json();
          const formattedData = data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setMessages(formattedData);

          // Once loaded, mark them as read
          socket.emit("mark_messages_read", {
            chatId: conversation.id,
            readerId: currentUser.id,
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    socket.emit("join_chat", conversation.id);

    const handleReceiveMessage = (newMessage: any) => {
      if (newMessage.chatId === conversation.id) {
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            timestamp: new Date(
              newMessage.createdAt || Date.now()
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        // If someone else sent it and we just received it, mark it as read immediately
        if (newMessage.senderId !== currentUser.id) {
          socket.emit("mark_messages_read", {
            chatId: conversation.id,
            readerId: currentUser.id,
          });
        }
      }
    };

    const handleMessagesRead = ({ chatId, readerId }: any) => {
      if (chatId === conversation.id && readerId !== currentUser.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUser.id ? { ...msg, isRead: true } : msg
          )
        );
      }
    };

    const handleMessageUpdated = (updatedMsg: any) => {
      if (updatedMsg.chatId === conversation.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === updatedMsg.id
              ? {
                  ...msg,
                  content: updatedMsg.content,
                  isEdited: true,
                }
              : msg
          )
        );
      }
    };

    const handleMessageDeleted = (deletedMsg: any) => {
      if (deletedMsg.chatId === conversation.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === deletedMsg.id
              ? {
                  ...msg,
                  content: deletedMsg.content || "This message was deleted",
                  isDeleted: true,
                }
              : msg
          )
        );
      }
    };

    const handleMessageReacted = (data: {
      id: string;
      chatId: string;
      reactions: any[];
    }) => {
      if (data.chatId === conversation.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.id
              ? {
                  ...msg,
                  reactions: data.reactions,
                }
              : msg
          )
        );
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_read", handleMessagesRead);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_reacted", handleMessageReacted);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_read", handleMessagesRead);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_reacted", handleMessageReacted);
    };
  }, [conversation.id, currentUser.id, BACKEND_URL]);

  const getDisplayName = (user: ChatUser) => user.name || "Unknown";
  const getAvatar = (user: ChatUser) => user.image || user.avatar || "";

  if (!otherUser) return null;

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
  };

  const handleStartEdit = (msg: any) => {
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
      socket.emit("delete_message", {
        messageId,
        senderId: currentUser.id,
      });
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("react_message", {
        messageId,
        emoji,
        userId: currentUser.id,
      });
    }
    setActivePickerId(null);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={getAvatar(otherUser)}
                alt={getDisplayName(otherUser)}
              />
              <AvatarFallback>
                {getDisplayName(otherUser).substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{getDisplayName(otherUser)}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-muted-foreground"
                }`}
              />
              {isOnline ? "Online" : otherUser.email || "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={onToggleDetails}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Say hello! 👋
            </div>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            const isDeleted =
              msg.isDeleted || msg.content === "This message was deleted";
            const senderAvatar = isMe
              ? getAvatar(currentUser)
              : getAvatar(otherUser);
            const senderName = isMe
              ? getDisplayName(currentUser)
              : getDisplayName(otherUser);
            const showAvatar =
              idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            // Check if message is editable/deletable (less than 5 minutes old and not deleted)
            const isEditable =
              isMe &&
              !isDeleted &&
              msg.createdAt &&
              Date.now() - new Date(msg.createdAt).getTime() < 5 * 60 * 1000;

            const isEditingThis = editingMessageId === msg.id;
            const isPickerOpen = activePickerId === msg.id;

            return (
              <div
                key={msg.id}
                className={`group flex items-end gap-2 ${
                  isMe ? "flex-row-reverse" : ""
                }`}
              >
                {showAvatar ? (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={senderAvatar} alt={senderName} />
                    <AvatarFallback>
                      {senderName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8 shrink-0" />
                )}
                <div
                  className={`relative flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  } max-w-[70%]`}
                >
                  {/* Quick Floating Emoji Reaction Bar */}
                  {!isDeleted && !isEditingThis && (
                    <div
                      className={`absolute -top-4 ${
                        isMe ? "right-0" : "left-0"
                      } ${
                        isPickerOpen
                          ? "flex"
                          : "hidden group-hover:flex"
                      } items-center gap-1 bg-background/95 backdrop-blur border shadow-md rounded-full px-2 py-0.5 z-20 animate-in fade-in zoom-in duration-150`}
                    >
                      {EMOJIS.map((emoji) => {
                        const reactionsList = parseReactions(msg.reactions);
                        const isMyReaction = reactionsList.some(
                          (r) => r.userId === currentUser.id && r.emoji === emoji
                        );
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className={`hover:scale-125 transition-transform p-1 text-sm rounded-full ${
                              isMyReaction ? "bg-primary/20 scale-110" : ""
                            }`}
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isEditingThis ? (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-2xl border">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(msg.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="h-8 text-sm bg-background"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-green-600 hover:text-green-700"
                        onClick={() => handleSaveEdit(msg.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : isDeleted ? (
                    <div
                      className={`relative group/msg px-4 py-2 rounded-2xl border ${
                        isMe
                          ? "bg-muted/40 text-muted-foreground rounded-br-sm border-dashed"
                          : "bg-muted/40 text-muted-foreground rounded-bl-sm border-dashed"
                      }`}
                    >
                      <p className="text-sm italic flex items-center gap-1.5 text-muted-foreground select-none">
                        <Ban className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
                        <span>This message was deleted</span>
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`relative group/msg px-4 py-2 rounded-2xl ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  )}

                  {/* Reaction Badges */}
                  {!isDeleted && (
                    <>
                      {(() => {
                        const grouped = getGroupedReactions(msg.reactions);
                        const emojiKeys = Object.keys(grouped);
                        if (emojiKeys.length === 0) return null;

                        return (
                          <div
                            className={`flex flex-wrap gap-1 mt-1 ${
                              isMe ? "justify-end" : "justify-start"
                            }`}
                          >
                            {emojiKeys.map((emoji) => {
                              const item = grouped[emoji];
                              const isMyReaction = item.userIds.includes(
                                currentUser.id
                              );
                              return (
                                <button
                                  key={emoji}
                                  onClick={() =>
                                    handleToggleReaction(msg.id, emoji)
                                  }
                                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                                    isMyReaction
                                      ? "bg-primary/15 border-primary/40 text-primary font-medium shadow-xs"
                                      : "bg-muted/60 hover:bg-muted border-border/60 text-muted-foreground"
                                  }`}
                                  title={`${item.count} reaction${
                                    item.count > 1 ? "s" : ""
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span>{item.count}</span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </>
                  )}

                  <div className="flex items-center gap-1 mt-1 px-1">
                    {!isDeleted && !isEditingThis && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setActivePickerId(isPickerOpen ? null : msg.id)
                          }
                          className="p-0.5 hover:bg-muted rounded text-muted-foreground transition-colors"
                          title="React to message"
                        >
                          <Smile className="w-3 h-3" />
                        </button>
                        {isEditable && (
                          <>
                            <button
                              onClick={() => handleStartEdit(msg)}
                              className="p-0.5 hover:bg-muted rounded text-muted-foreground transition-colors"
                              title="Edit message (< 5 mins)"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-0.5 hover:bg-red-500/10 hover:text-red-500 rounded text-muted-foreground transition-colors"
                              title="Delete message (< 5 mins)"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    {msg.isEdited && !isDeleted && (
                      <span className="text-[10px] text-muted-foreground italic">
                        (edited)
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {msg.timestamp}
                    </span>
                    {isMe && (
                      <span className="text-muted-foreground">
                        {msg.isRead ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-background border-t shrink-0">
        <form className="flex items-center gap-2" onSubmit={handleSend}>
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full shrink-0"
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

