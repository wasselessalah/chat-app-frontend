"use client";

import { useState, useEffect } from "react";
import { ChatArea } from "@/components/chat/chat-area";
import { DetailsPanel } from "@/components/chat/details-panel";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [showDetails, setShowDetails] = useState(false);
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !chatId) return;

    // ChatId is "id1-id2". Find the ID that isn't the current user's ID.
    const otherUserId = chatId.split('-').find(id => id !== currentUser.id);
    
    if (otherUserId) {
      fetch(`/api/users/${otherUserId}`)
        .then(res => res.json())
        .then(data => {
          setOtherUser(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load other user", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [chatId, currentUser]);

  if (loading || !currentUser) {
    return <div className="flex-1 flex items-center justify-center bg-muted/20">Loading...</div>;
  }

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Chat Not Found</h2>
          <p className="text-muted-foreground">This user does not exist or invalid chat ID.</p>
        </div>
      </div>
    );
  }

  // Construct a conversation object to pass to ChatArea and DetailsPanel
  const selectedConversation = {
    id: chatId,
    participants: [
      { id: currentUser.id, name: currentUser.name, avatar: currentUser.image || "" },
      { id: otherUser.id, name: otherUser.name, avatar: otherUser.image || "" }
    ]
  };

  return (
    <>
      <ChatArea 
        conversation={selectedConversation} 
        onToggleDetails={() => setShowDetails(!showDetails)} 
      />
      {showDetails && (
        <DetailsPanel 
          conversation={selectedConversation} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
}
