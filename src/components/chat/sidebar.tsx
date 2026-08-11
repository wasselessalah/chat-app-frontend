import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockConversations, currentUser } from "@/lib/mock-data";
import { Conversation } from "@/types/chat";
import { Search, Edit } from "lucide-react";

interface SidebarProps {
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function Sidebar({ selectedConversation, onSelectConversation }: SidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Chats</span>
            <span className="text-xs text-muted-foreground">{currentUser.name}</span>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <Edit className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8 bg-background"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {mockConversations.map((conv) => {
            const otherUser = conv.participants.find((p) => p.id !== currentUser.id);
            if (!otherUser) return null;

            const isSelected = selectedConversation?.id === conv.id;

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                  isSelected ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {otherUser.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{otherUser.name}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {conv.lastMessage?.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground truncate pr-2">
                      {conv.lastMessage?.content}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
