"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser, Conversation } from "@/types/chat";
import { Info, MoreVertical, Phone, Send, Video } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getSocket } from "@/lib/socket";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherUser = conversation.participants.find(
    (p) => p.id !== currentUser.id
  );

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
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversation.id]);

  const getDisplayName = (user: ChatUser) => user.name || "Unknown";
  const getAvatar = (user: ChatUser) => user.image || user.avatar || "";

  if (!otherUser) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Emit to backend — socket handler saves to DB then broadcasts
    // receive_message back to all room members (including sender),
    // so we do NOT add locally here to avoid showing the message twice.
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

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={getAvatar(otherUser)}
              alt={getDisplayName(otherUser)}
            />
            <AvatarFallback>
              {getDisplayName(otherUser).substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{getDisplayName(otherUser)}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              {otherUser.email || ""}
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
            const senderAvatar = isMe
              ? getAvatar(currentUser)
              : getAvatar(otherUser);
            const senderName = isMe
              ? getDisplayName(currentUser)
              : getDisplayName(otherUser);
            const showAvatar =
              idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
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
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </span>
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
