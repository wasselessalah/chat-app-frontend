import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { ChatUser, Conversation, Message } from "@/types/chat.types";
import { messageService } from "../services/message.service";

export function useSidebar(currentUser: ChatUser) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [groups, setGroups] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [usersRes, groupsRes, unreadRes] = await Promise.all([
          fetch(`/api/users?excludeId=${currentUser.id}`),
          messageService.getUserGroups(currentUser.id).catch(() => []),
          messageService.getUnreadCounts(currentUser.id).catch(() => ({}))
        ]);

        if (!mounted) return;

        if (usersRes.ok) {
          const fetchedUsers = await usersRes.json();
          setUsers(fetchedUsers);
        }
        
        setGroups(groupsRes);
        setUnreadCounts(unreadRes);
      } catch (err) {
        console.error("Error fetching sidebar data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, [currentUser.id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || loading) return;

    users.forEach((u) => {
      const chatId = [currentUser.id, u.id].sort().join("_vs_");
      socket.emit("join_chat", chatId);
    });

    groups.forEach((g) => {
      socket.emit("join_chat", g.chatId);
    });

    const handleReceiveMessage = (newMessage: Message) => {
      const isGroup = newMessage.chatId.startsWith("group_");
      const baseChatId = newMessage.chatId.split("?")[0];

      if (!isGroup) {
        const parts = newMessage.chatId.split("_vs_");
        const senderId = newMessage.senderId;
        const otherUserId = parts.find((id: string) => id !== currentUser.id);

        setUsers((prevUsers) => {
          let updatedUsers = prevUsers.map((u) => {
            if (u.id === otherUserId) {
              return { ...u, lastMessage: newMessage };
            }
            return u;
          });
          updatedUsers.sort((a, b) => {
            const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
            if (timeA !== timeB) return timeB - timeA;
            return a.name.localeCompare(b.name);
          });
          return updatedUsers;
        });

        if (senderId !== currentUser.id) {
          setUnreadCounts((prev) => ({
            ...prev,
            [senderId]: (prev[senderId] || 0) + 1,
          }));
        }
      } else {
        setGroups((prevGroups) => {
          let updatedGroups = prevGroups.map((g) => {
            const gBase = g.id || g.chatId.split("?")[0];
            if (gBase === baseChatId) {
              return { ...g, lastMessage: newMessage };
            }
            return g;
          });
          updatedGroups.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return timeB - timeA;
          });
          return updatedGroups;
        });

        if (newMessage.senderId !== currentUser.id) {
          setUnreadCounts((prev) => ({
            ...prev,
            [baseChatId]: (prev[baseChatId] || 0) + 1,
          }));
        }
      }
    };

    const handleMessagesRead = ({ chatId, readerId }: { chatId: string, readerId: string }) => {
      if (readerId === currentUser.id) {
        const baseChatId = chatId.split("?")[0];
        const isGroup = chatId.startsWith("group_");
        if (isGroup) {
          setUnreadCounts((prev) => {
            const newCounts = { ...prev };
            delete newCounts[baseChatId];
            return newCounts;
          });
        } else {
          const parts = chatId.split("_vs_");
          const otherUserId = parts.find((id) => id !== currentUser.id);
          if (otherUserId) {
            setUnreadCounts((prev) => {
              const newCounts = { ...prev };
              delete newCounts[otherUserId];
              return newCounts;
            });
          }
        }
      }
    };

    const handleGroupRenamed = ({ chatId, newChatId, newName }: any) => {
      setGroups((prevGroups) =>
        prevGroups.map((g) => {
          const cleanTarget = chatId ? chatId.split("?")[0] : "";
          const cleanCurrent = g.chatId.split("?")[0];
          if (cleanTarget === cleanCurrent) {
            return {
              ...g,
              chatId: newChatId || g.chatId,
              name: newName !== undefined ? newName : g.name,
            };
          }
          return g;
        })
      );
    };

    const handleUserLeftGroup = ({ chatId, newChatId, userId }: any) => {
      if (userId === currentUser.id) {
        setGroups((prevGroups) => prevGroups.filter((g) => g.chatId.split("?")[0] !== chatId.split("?")[0]));
      } else {
        setGroups((prevGroups) =>
          prevGroups.map((g) => {
            if (g.chatId.split("?")[0] === chatId.split("?")[0]) {
              return {
                ...g,
                chatId: newChatId || g.chatId,
                participants: g.participants?.filter((m) => m.id !== userId) || [],
              };
            }
            return g;
          })
        );
      }
    };

    const handleGroupUserRemoved = ({ chatId, newChatId, targetUserId }: any) => {
      if (targetUserId === currentUser.id) {
        setGroups((prevGroups) => prevGroups.filter((g) => g.chatId.split("?")[0] !== chatId.split("?")[0]));
      } else {
        setGroups((prevGroups) =>
          prevGroups.map((g) => {
            if (g.chatId.split("?")[0] === chatId.split("?")[0]) {
              return {
                ...g,
                chatId: newChatId || g.chatId,
                participants: g.participants?.filter((m) => m.id !== targetUserId) || [],
              };
            }
            return g;
          })
        );
      }
    };

    const handleGroupUserAdded = ({ chatId, newChatId }: any) => {
      setGroups((prevGroups) => {
        let updated = false;
        const mapped = prevGroups.map((g) => {
          if (g.chatId.split("?")[0] === chatId.split("?")[0]) {
            updated = true;
            return { ...g, chatId: newChatId || g.chatId };
          }
          return g;
        });

        if (!updated) {
          // A user was added to a group they weren't in; fetch the new group list
          messageService.getUserGroups(currentUser.id).then((gs: any) => {
            setGroups(gs);
          });
        }
        return mapped;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_read", handleMessagesRead);
    socket.on("group_renamed", handleGroupRenamed);
    socket.on("user_left_group", handleUserLeftGroup);
    socket.on("group_user_removed", handleGroupUserRemoved);
    socket.on("group_user_added", handleGroupUserAdded);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_read", handleMessagesRead);
      socket.off("group_renamed", handleGroupRenamed);
      socket.off("user_left_group", handleUserLeftGroup);
      socket.off("group_user_removed", handleGroupUserRemoved);
      socket.off("group_user_added", handleGroupUserAdded);
    };
  }, [loading, currentUser.id, users, groups]);

  return { users, groups, loading, unreadCounts, setUnreadCounts };
}
