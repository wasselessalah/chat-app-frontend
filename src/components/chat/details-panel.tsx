"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser, Conversation } from "@/types/chat";
import { Bell, FileText, Image as ImageIcon, Link2, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailsPanelProps {
  conversation: Conversation;
  currentUser: ChatUser;
  onClose: () => void;
}

export function DetailsPanel({
  conversation,
  currentUser,
  onClose,
}: DetailsPanelProps) {
  const isGroup = conversation.isGroup || conversation.participants.length > 2;
  const otherUsers = conversation.participants.filter(
    (p) => p.id !== currentUser.id
  );
  const otherUser = otherUsers[0];

  const getAvatar = (user: ChatUser) => user.image || user.avatar || "";

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full shrink-0 min-h-0 overflow-hidden">
      <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
        <h3 className="font-semibold">{isGroup ? "Group Info" : "Contact Info"}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col items-center p-6 border-b text-center">
          {isGroup ? (
            <Avatar className="h-20 w-20 mb-3 bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="h-10 w-10 text-primary" />
            </Avatar>
          ) : (
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage
                src={getAvatar(otherUser)}
                alt={otherUser?.name}
              />
              <AvatarFallback className="text-2xl">
                {otherUser?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <h2 className="text-base font-semibold">
            {isGroup
              ? conversation.name || "Group Chat"
              : otherUser?.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isGroup
              ? `${conversation.participants.length} members`
              : otherUser?.email}
          </p>
        </div>

        {/* Group members list if group */}
        {isGroup && (
          <div className="p-4 border-b">
            <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Members ({conversation.participants.length})
            </h4>
            <div className="flex flex-col gap-2">
              {conversation.participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatar(user)} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium truncate">
                      {user.name} {user.id === currentUser.id ? "(You)" : ""}
                    </span>
                    {user.email && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 flex flex-col gap-2 border-b">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Bell className="mr-3 h-5 w-5" />
            Mute Notifications
          </Button>
        </div>

        <div className="p-4">
          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">
            Shared Media
          </h4>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-md flex items-center justify-center"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">
            Files &amp; Links
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  project_requirements.pdf
                </p>
                <p className="text-xs text-muted-foreground">1.2 MB • 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <Link2 className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Figma Design System</p>
                <p className="text-xs text-muted-foreground">
                  figma.com • Yesterday
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
