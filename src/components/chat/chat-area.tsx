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
  Search,
  Send,
  Video,
  Check,
  CheckCheck,
  Pencil,
  Trash2,
  Ban,
  Smile,
  Loader2,
  X,
  Users,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const EMOJIS = [
  "👍", "❤️", "😂", "😮", "🔥", "🎉", "😢", "👏",
  "🙏", "😍", "💯", "🚀", "🤣", "💩", "🥳", "✨"
];

const EMOJI_CATEGORIES = [
  {
    name: "Smiles & Expressions",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
      "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
      "😋", "😛", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳",
      "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖",
      "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯"
    ],
  },
  {
    name: "Hands & Gestures",
    emojis: [
      "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘",
      "👌", "🤌", "🤏", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚",
      "🖐️", "🖖", "👋", "🤙", "💪", "✍️", "🙏", "🤝", "👏", "🙌"
    ],
  },
  {
    name: "Hearts & Symbols",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "✨", "🌟",
      "⭐", "💫", "🔥", "💥", "🎉", "🎊", "💯", "🚀"
    ],
  },
  {
    name: "Food & Activities",
    emojis: [
      "🍕", "🍔", "🍟", "🌭", "🍿", "☕", "🍺", "🍻", "🥂", "🍾",
      "🎂", "🎈", "🎁", "⚽", "🏀", "🎮", "🎵", "🎧", "📷", "💡"
    ],
  },
];

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
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [isEditingGroupName, setIsEditingGroupName] = useState(false);

  const parseGroupName = (convId: string, convName?: string | null) => {
    if (convName) return convName;
    if (convId.startsWith("group_") && convId.includes("?")) {
      const queryPart = convId.split("?")[1];
      const params = new URLSearchParams(queryPart);
      const nameParam = params.get("name");
      if (nameParam) return nameParam;
    }
    return "";
  };

  const parseGroupTheme = (convId: string) => {
    if (convId.startsWith("group_") && convId.includes("?")) {
      const queryPart = convId.split("?")[1];
      const params = new URLSearchParams(queryPart);
      const themeParam = params.get("theme");
      if (themeParam) return themeParam;
    }
    return "default";
  };

  const theme = parseGroupTheme(conversation.id);
  const getThemeColorClass = (theme: string) => {
    switch(theme) {
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

  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSelectEmoji = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Pagination states
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const isInitialLoadRef = useRef(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const isGroup = conversation.isGroup || conversation.participants.length > 2;
  const otherUsers = conversation.participants.filter(
    (p) => p.id !== currentUser.id
  );
  const otherUser = otherUsers[0]; // for 1-on-1 chats

  const onlineUserIds = useOnlineUsers();
  const isOnline = otherUser ? onlineUserIds.has(otherUser.id) : false;

  // Auto-scroll on initial load or new message
  useEffect(() => {
    if (isInitialLoadRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      isInitialLoadRef.current = false;
    }
  }, [messages]);

  // Fetch messages (Initial & on Search)
  useEffect(() => {
    isInitialLoadRef.current = true;
    const fetchMessages = async () => {
      try {
        const searchParam = activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : "";
        const res = await fetch(
          `${BACKEND_URL}/api/messages?chatId=${encodeURIComponent(conversation.id)}&userId=${currentUser.id}&limit=15${searchParam}`
        );
        if (res.ok) {
          const data = await res.json();
          const rawMessages = Array.isArray(data) ? data : data.messages || [];
          const hasMoreMessages = Array.isArray(data) ? false : !!data.hasMore;
          const cursor = Array.isArray(data) ? null : data.nextCursor;

          const formattedData = rawMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setMessages(formattedData);
          setHasMore(hasMoreMessages);
          setNextCursor(cursor);

          // Scroll to bottom on initial load
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
          }, 50);

          // Once loaded, mark them as read if not searching
          if (!activeSearch) {
            const socket = getSocket();
            if (socket) {
              socket.emit("mark_messages_read", {
                chatId: conversation.id,
                readerId: currentUser.id,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [conversation.id, currentUser.id, BACKEND_URL, activeSearch]);

  // Handle Socket.IO connections
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("join_chat", conversation.id);

    const handleReceiveMessage = (newMessage: any) => {
      // Match by base chatId so messages still arrive after rename/add/remove
      const newMsgBase = newMessage.chatId ? newMessage.chatId.split("?")[0] : "";
      const convBase = conversation.id.split("?")[0];
      if (newMsgBase === convBase) {
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            timestamp: new Date(
              newMessage.createdAt || Date.now()
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        // Auto-scroll to bottom on new incoming message
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 50);

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
      const updatedBase = updatedMsg.chatId ? updatedMsg.chatId.split("?")[0] : "";
      const convBase = conversation.id.split("?")[0];
      if (updatedBase === convBase) {
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
      const deletedBase = deletedMsg.chatId ? deletedMsg.chatId.split("?")[0] : "";
      const convBase = conversation.id.split("?")[0];
      if (deletedBase === convBase) {
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
      const reactBase = data.chatId ? data.chatId.split("?")[0] : "";
      const convBase = conversation.id.split("?")[0];
      if (reactBase === convBase) {
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

    const handleGroupRenamed = ({ chatId, newChatId, newName, newTheme, systemMessage }: any) => {
      const cleanTarget = chatId ? chatId.split("?")[0] : "";
      const cleanCurrent = conversation.id.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (newName) setGroupNameInput(newName);
        if (systemMessage) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === systemMessage.id)) return prev;
            return [...prev, systemMessage];
          });
        }
        if (newChatId) {
          router.replace(`/chat/${newChatId}`);
        }
      }
    };

    const handleUserLeftGroup = ({ chatId, newChatId, userId }: any) => {
      const cleanTarget = chatId ? chatId.split("?")[0] : "";
      const cleanCurrent = conversation.id.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (userId === currentUser.id) {
          router.push("/chat");
        } else {
          if (newChatId) {
            router.replace(`/chat/${newChatId}`);
          }
        }
      }
    };

    const handleGroupUserRemoved = ({ chatId, newChatId, targetUserId }: any) => {
      const cleanTarget = chatId ? chatId.split("?")[0] : "";
      const cleanCurrent = conversation.id.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (targetUserId === currentUser.id) {
          router.push("/chat");
        } else if (newChatId) {
          router.replace(`/chat/${newChatId}`);
        }
      }
    };

    const handleGroupUserAdded = ({ chatId, newChatId }: any) => {
      const cleanTarget = chatId ? chatId.split("?")[0] : "";
      const cleanCurrent = conversation.id.split("?")[0];
      if (cleanTarget === cleanCurrent && newChatId) {
        router.replace(`/chat/${newChatId}`);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_read", handleMessagesRead);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_reacted", handleMessageReacted);
    socket.on("group_renamed", handleGroupRenamed);
    socket.on("user_left_group", handleUserLeftGroup);
    socket.on("group_user_removed", handleGroupUserRemoved);
    socket.on("group_user_added", handleGroupUserAdded);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_read", handleMessagesRead);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_reacted", handleMessageReacted);
      socket.off("group_renamed", handleGroupRenamed);
      socket.off("user_left_group", handleUserLeftGroup);
      socket.off("group_user_removed", handleGroupUserRemoved);
      socket.off("group_user_added", handleGroupUserAdded);
    };
  }, [conversation.id, currentUser.id, BACKEND_URL]);

  const loadOlderMessages = async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;
    setIsLoadingMore(true);

    const scrollContainer = scrollRef.current;
    const previousScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;

    try {
      const searchParam = activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : "";
      const res = await fetch(
        `${BACKEND_URL}/api/messages?chatId=${encodeURIComponent(conversation.id)}&userId=${currentUser.id}&limit=15&before=${encodeURIComponent(nextCursor)}${searchParam}`
      );
      if (res.ok) {
        const data = await res.json();
        const rawMessages = Array.isArray(data) ? data : data.messages || [];
        const hasMoreMessages = Array.isArray(data) ? false : !!data.hasMore;
        const cursor = Array.isArray(data) ? null : data.nextCursor;

        const formattedData = rawMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setMessages((prev) => [...formattedData, ...prev]);
        setHasMore(hasMoreMessages);
        setNextCursor(cursor);

        // Preserve scroll position when older messages load
        requestAnimationFrame(() => {
          if (scrollContainer) {
            scrollContainer.scrollTop =
              scrollContainer.scrollHeight - previousScrollHeight;
          }
        });
      }
    } catch (error) {
      console.error("Error loading older messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getDisplayName = (user: ChatUser) => user.name || "Unknown";
  const getAvatar = (user: ChatUser) => user.image || user.avatar || "";

  // In group chats otherUser may be undefined if you're alone — guard here
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
                  <AvatarImage
                    src={getAvatar(otherUser)}
                    alt={getDisplayName(otherUser || currentUser)}
                  />
                  <AvatarFallback>
                    {getDisplayName(otherUser || currentUser)
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                )}
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
                    if (e.key === "Enter") {
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
                    }
                    if (e.key === "Escape") setIsEditingGroupName(false);
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-green-600 shrink-0"
                  onClick={() => {
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
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-sm">
                  {isGroup
                    ? groupNameInput || "Group Chat"
                    : getDisplayName(otherUser || currentUser)}
                </h2>
                {isGroup && (
                  <button
                    onClick={() => {
                      setGroupNameInput(groupNameInput || "Group Chat");
                      setIsEditingGroupName(true);
                    }}
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
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-green-500" : "bg-muted-foreground"
                    }`}
                  />
                  {isOnline ? "Online" : otherUser?.email || "Offline"}
                </>
              )}
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
            className={`text-muted-foreground ${showSearch ? "bg-muted text-foreground" : ""}`}
            onClick={() => {
              if (showSearch) {
                setShowSearch(false);
                setSearchQuery("");
                setActiveSearch("");
              } else {
                setShowSearch(true);
              }
            }}
            title="Search Messages"
          >
            <Search className="h-5 w-5" />
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

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-muted/40 p-3 border-b flex items-center gap-2 shrink-0 animate-in fade-in slide-in-from-top-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setActiveSearch(searchQuery.trim());
                if (e.key === "Escape") {
                  setShowSearch(false);
                  setSearchQuery("");
                  setActiveSearch("");
                }
              }}
              placeholder="Search messages in this chat... (Press Enter)"
              className="pl-8 bg-background h-9 text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={() => setActiveSearch(searchQuery.trim())}
          >
            Search
          </Button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-6" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {/* Pagination Load Older Messages Button */}
          {hasMore && (
            <div className="flex justify-center py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadOlderMessages}
                disabled={isLoadingMore}
                className="text-xs text-muted-foreground gap-1.5 rounded-full hover:bg-muted"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading older messages...</span>
                  </>
                ) : (
                  <span>Load older messages</span>
                )}
              </Button>
            </div>
          )}

          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Say hello! 👋
            </div>
          )}
          {messages.map((msg, idx) => {
            const isSystemMsg =
              msg.isSystem ||
              msg.senderId === "system" ||
              (typeof msg.content === "string" &&
                (msg.content.includes("renamed the group to") || 
                 msg.content.includes("changed the group theme to") || 
                 msg.content.includes("created the group") || 
                 msg.content.includes("left the group")));

            if (isSystemMsg) {
              return (
                <div key={msg.id || idx} className="flex justify-center my-3">
                  <div className="text-xs text-muted-foreground bg-muted/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-border/50 font-medium shadow-2xs text-center max-w-[85%]">
                    <span className="font-semibold text-foreground">
                      {msg.senderName || "A member"}
                    </span>{" "}
                    {msg.content}
                  </div>
                </div>
              );
            }

            const isMe = msg.senderId === currentUser.id;
            const isDeleted =
              msg.isDeleted || msg.content === "This message was deleted";

            // In group chats, find the actual sender from participants
            const senderParticipant = conversation.participants.find(
              (p) => p.id === msg.senderId
            );
            const senderAvatar = isMe
              ? getAvatar(currentUser)
              : senderParticipant
              ? getAvatar(senderParticipant)
              : "";
            const senderName = isMe
              ? getDisplayName(currentUser)
              : msg.senderName || (senderParticipant ? getDisplayName(senderParticipant) : "Member");
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
                      className={`absolute -top-5 ${
                        isMe ? "right-0" : "left-0"
                      } ${
                        isPickerOpen
                          ? "flex"
                          : "hidden group-hover:flex"
                      } items-center gap-1 bg-background/95 backdrop-blur border shadow-md rounded-full px-2.5 py-1 z-20 max-w-[240px] overflow-x-auto overflow-y-hidden scrollbar-none whitespace-nowrap animate-in fade-in zoom-in duration-150`}
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
                            className={`hover:scale-125 transition-transform p-1 text-sm rounded-full shrink-0 ${
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

                  {/* Sender Name in Group Chat */}
                  {!isMe && isGroup && (
                    <span className="text-[11px] font-semibold text-primary mb-0.5 px-1">
                      {msg.senderName || senderName}
                    </span>
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
                          ? `${themeColorClass} rounded-br-sm`
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
      <div className="p-4 bg-background border-t shrink-0 relative" ref={emojiPickerRef}>
        {showEmojiPicker && (
          <div className="absolute bottom-18 left-4 z-30 w-80 bg-background/95 backdrop-blur border rounded-2xl shadow-xl p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between border-b pb-2 px-1 shrink-0">
              <span className="text-xs font-semibold text-muted-foreground">Emojis</span>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-3">
              {EMOJI_CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1 px-1 sticky top-0 bg-background/95 py-1 z-10 backdrop-blur">
                    {cat.name}
                  </p>
                  <div className="grid grid-cols-7 gap-1">
                    {cat.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleSelectEmoji(emoji)}
                        className="h-8 w-8 flex items-center justify-center text-lg rounded-md hover:bg-muted hover:scale-125 transition-all cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form className="flex items-center gap-2" onSubmit={handleSend}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`rounded-full shrink-0 ${
              showEmojiPicker
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Add emoji"
          >
            <Smile className="h-5 w-5" />
          </Button>

          <Input
            ref={inputRef}
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

