import { useState, useEffect, useRef, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { messageService } from "../services/message.service";
import { Message } from "@/types/chat.types";

export function useMessages(chatId: string, currentUserId: string, activeSearch: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  // Initial fetch
  useEffect(() => {
    isInitialLoadRef.current = true;
    const fetchMessages = async () => {
      try {
        const data = await messageService.getMessages(chatId, currentUserId, 15, undefined, activeSearch);
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

        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 50);

        if (!activeSearch) {
          const socket = getSocket();
          if (socket) {
            socket.emit("mark_messages_read", { chatId, readerId: currentUserId });
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chatId, currentUserId, activeSearch]);

  const loadOlderMessages = async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;
    setIsLoadingMore(true);

    const scrollContainer = scrollRef.current;
    const previousScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;

    try {
      const data = await messageService.getMessages(chatId, currentUserId, 15, nextCursor, activeSearch);
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

      requestAnimationFrame(() => {
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight - previousScrollHeight;
        }
      });
    } catch (error) {
      console.error("Error loading older messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    messages,
    setMessages,
    hasMore,
    isLoadingMore,
    loadOlderMessages,
    scrollRef,
  };
}
