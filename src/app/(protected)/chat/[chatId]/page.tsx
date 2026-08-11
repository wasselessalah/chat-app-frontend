"use client";

import { useState } from "react";
import { ChatArea } from "@/components/chat/chat-area";
import { DetailsPanel } from "@/components/chat/details-panel";
import { mockConversations } from "@/lib/mock-data";
import { useParams } from "next/navigation";

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [showDetails, setShowDetails] = useState(false);

  const selectedConversation = mockConversations.find(c => c.id === chatId);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Chat Not Found</h2>
          <p className="text-muted-foreground">This conversation does not exist.</p>
        </div>
      </div>
    );
  }

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
