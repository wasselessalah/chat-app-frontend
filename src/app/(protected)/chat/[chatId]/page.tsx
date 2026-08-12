"use client";

import { useState, useEffect } from "react";
import { ChatArea } from "@/components/chat/chat-area";
import { DetailsPanel } from "@/components/chat/details-panel";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ChatUser } from "@/types/chat";

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [showDetails, setShowDetails] = useState(false);
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !chatId) return;

    // ChatId format: "userId1_vs_userId2" (sorted).
    // We need to find the ID that isn't the current user's.
    const parts = chatId.split("_vs_");
    const otherUserId = parts.find((id) => id !== currentUser.id);

    if (otherUserId) {
      fetch(`/api/users/${otherUserId}`)
        .then((res) => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then((data) => {
          setOtherUser(data as ChatUser);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load other user", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [chatId, currentUser]);

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

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Chat Not Found</h2>
          <p className="text-muted-foreground">
            This user does not exist or the chat ID is invalid.
          </p>
        </div>
      </div>
    );
  }

  const mappedCurrentUser: ChatUser = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image ?? undefined,
  };

  const conversation = {
    id: chatId,
    participants: [mappedCurrentUser, otherUser],
  };

  return (
    <>
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
    </>
  );
}
