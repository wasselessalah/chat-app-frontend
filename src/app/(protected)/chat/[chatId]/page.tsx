"use client";

import { useState, useEffect } from "react";
import { ChatArea } from "@/components/chat/chat-area";
import { DetailsPanel } from "@/components/chat/details-panel";
import { useParams, notFound } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ChatUser } from "@/types/chat";

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [showDetails, setShowDetails] = useState(false);
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [participants, setParticipants] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const isGroup = chatId?.startsWith("group_");

  useEffect(() => {
    if (!currentUser || !chatId) return;

    if (isGroup) {
      // Group Chat ID format: group_id1_vs_id2_vs_id3?name=CustomName
      const [idPart, queryPart] = chatId.split("?");
      const urlParams = new URLSearchParams(queryPart || "");
      const explicitName = urlParams.get("name");

      const rawIds = idPart.replace("group_", "").split("_vs_");

      // Authorization Check: Only members can view this group
      if (!rawIds.includes(currentUser.id)) {
        setParticipants([]);
        setLoading(false);
        return;
      }

      const otherUserIds = rawIds.filter((id) => id !== currentUser.id);

      Promise.all(
        otherUserIds.map((id) =>
          fetch(`/api/users/${id}`)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
        )
      )
        .then((fetchedUsers) => {
          const validUsers = fetchedUsers.filter(Boolean) as ChatUser[];
          setParticipants(validUsers);
          if (explicitName) {
            setGroupName(decodeURIComponent(explicitName));
          } else {
            setGroupName(`Group (${validUsers.map((u) => u.name).join(", ")})`);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load group users", err);
          setLoading(false);
        });
    } else {
      // 1-on-1 Chat ID format: id1_vs_id2
      const parts = chatId.split("_vs_");

      // Authorization Check: Only participants can view this chat
      if (!parts.includes(currentUser.id)) {
        setParticipants([]);
        setLoading(false);
        return;
      }

      const otherUserId = parts.find((id) => id !== currentUser.id);

      if (otherUserId) {
        fetch(`/api/users/${otherUserId}`)
          .then((res) => {
            if (!res.ok) throw new Error("User not found");
            return res.json();
          })
          .then((data) => {
            setParticipants([data as ChatUser]);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to load other user", err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [chatId, currentUser, isGroup]);

  if (loading || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (participants.length === 0 && !loading) {
    notFound();
  }

  const mappedCurrentUser: ChatUser = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image ?? undefined,
  };

  const conversation = {
    id: chatId,
    isGroup,
    name: isGroup ? groupName || "Group Chat" : undefined,
    participants: [mappedCurrentUser, ...participants],
  };

  return (
    <div className="flex-1 flex min-h-0 min-w-0 h-full overflow-hidden">
      <ChatArea
        conversation={conversation}
        currentUser={mappedCurrentUser}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />
      {showDetails && (
        <DetailsPanel
          conversation={conversation}
          currentUser={mappedCurrentUser}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}
