import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { Message } from "@/types/chat.types";
import { useRouter } from "next/navigation";

interface UseMessageSocketProps {
  chatId: string;
  currentUserId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setGroupNameInput?: (name: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function useMessageSocket({
  chatId,
  currentUserId,
  setMessages,
  setGroupNameInput,
  scrollRef,
}: UseMessageSocketProps) {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("join_chat", chatId);

    const handleReceiveMessage = (newMessage: any) => {
      const newMsgBase = newMessage.chatId ? newMessage.chatId.split("?")[0] : "";
      const convBase = chatId.split("?")[0];
      
      if (newMsgBase === convBase) {
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            timestamp: new Date(newMessage.createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 50);

        if (newMessage.senderId !== currentUserId) {
          socket.emit("mark_messages_read", { chatId, readerId: currentUserId });
        }
      }
    };

    const handleMessagesRead = ({ chatId: readChatId, readerId }: any) => {
      if (readChatId === chatId && readerId !== currentUserId) {
        setMessages((prev) =>
          prev.map((msg) => (msg.senderId === currentUserId ? { ...msg, isRead: true } : msg))
        );
      }
    };

    const handleMessageUpdated = (updatedMsg: any) => {
      const updatedBase = updatedMsg.chatId ? updatedMsg.chatId.split("?")[0] : "";
      const convBase = chatId.split("?")[0];
      if (updatedBase === convBase) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === updatedMsg.id
              ? { ...msg, content: updatedMsg.content, isEdited: true }
              : msg
          )
        );
      }
    };

    const handleMessageDeleted = (deletedMsg: any) => {
      const deletedBase = deletedMsg.chatId ? deletedMsg.chatId.split("?")[0] : "";
      const convBase = chatId.split("?")[0];
      if (deletedBase === convBase) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === deletedMsg.id
              ? { ...msg, content: deletedMsg.content || "This message was deleted", isDeleted: true }
              : msg
          )
        );
      }
    };

    const handleMessageReacted = (data: { id: string; chatId: string; reactions: any[] }) => {
      const reactBase = data.chatId ? data.chatId.split("?")[0] : "";
      const convBase = chatId.split("?")[0];
      if (reactBase === convBase) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === data.id ? { ...msg, reactions: data.reactions } : msg))
        );
      }
    };

    const handleGroupRenamed = ({ chatId: targetChatId, newChatId, newName, systemMessage }: any) => {
      const cleanTarget = targetChatId ? targetChatId.split("?")[0] : "";
      const cleanCurrent = chatId.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (newName && setGroupNameInput) setGroupNameInput(newName);
        if (systemMessage) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === systemMessage.id)) return prev;
            return [...prev, systemMessage];
          });
        }
        if (newChatId && newChatId !== chatId) {
          router.replace(`/chat/${newChatId}`);
        }
      }
    };

    const handleUserLeftGroup = ({ chatId: targetChatId, newChatId, userId }: any) => {
      const cleanTarget = targetChatId ? targetChatId.split("?")[0] : "";
      const cleanCurrent = chatId.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (userId === currentUserId) router.push("/chat");
        else if (newChatId && newChatId !== chatId) router.replace(`/chat/${newChatId}`);
      }
    };

    const handleGroupUserRemoved = ({ chatId: targetChatId, newChatId, targetUserId }: any) => {
      const cleanTarget = targetChatId ? targetChatId.split("?")[0] : "";
      const cleanCurrent = chatId.split("?")[0];
      if (cleanTarget === cleanCurrent) {
        if (targetUserId === currentUserId) router.push("/chat");
        else if (newChatId && newChatId !== chatId) router.replace(`/chat/${newChatId}`);
      }
    };

    const handleGroupUserAdded = ({ chatId: targetChatId, newChatId }: any) => {
      const cleanTarget = targetChatId ? targetChatId.split("?")[0] : "";
      const cleanCurrent = chatId.split("?")[0];
      if (cleanTarget === cleanCurrent && newChatId && newChatId !== chatId) {
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
  }, [chatId, currentUserId, router, setGroupNameInput, setMessages, scrollRef]);
}
