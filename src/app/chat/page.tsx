"use client";

import { useState } from "react";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { DetailsPanel } from "@/components/chat/details-panel";
import { mockConversations } from "@/lib/mock-data";
import { Conversation } from "@/types/chat";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar Panel */}
      <Sidebar 
        selectedConversation={selectedConversation} 
        onSelectConversation={setSelectedConversation} 
      />

      {/* Main Chat Area */}
      {selectedConversation ? (
        <ChatArea 
          conversation={selectedConversation} 
          onToggleDetails={() => setShowDetails(!showDetails)} 
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
            <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging.</p>
          </div>
        </div>
      )}

      {/* Details Panel */}
      {showDetails && selectedConversation && (
        <DetailsPanel 
          conversation={selectedConversation} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </div>
  );
}
