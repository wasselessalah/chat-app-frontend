import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

/**
 * Returns a Set of userIds that are currently online.
 * Optionally accepts the currentUserId so the socket can announce presence.
 */
export function useOnlineUsers(currentUserId?: string): Set<string> {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize socket and announce this user's presence
    const socket = getSocket(currentUserId);
    if (!socket) return;

    const handleOnlineUsers = (userIds: string[]) => {
      setOnlineUsers(new Set(userIds));
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [currentUserId]);

  return onlineUsers;
}
