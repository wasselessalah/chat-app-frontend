import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/mock-data";
import { Conversation } from "@/types/chat";
import { Bell, FileText, Image as ImageIcon, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailsPanelProps {
  conversation: Conversation;
  onClose: () => void;
}

export function DetailsPanel({ conversation, onClose }: DetailsPanelProps) {
  const otherUser = conversation.participants.find((p) => p.id !== currentUser.id);

  if (!otherUser) return null;

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <h3 className="font-semibold">Contact Info</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center p-6 border-b">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback className="text-2xl">{otherUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">{otherUser.name}</h2>
          <p className="text-sm text-muted-foreground">{otherUser.email}</p>
        </div>

        <div className="p-4 flex flex-col gap-2 border-b">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Bell className="mr-3 h-5 w-5" />
            Mute Notifications
          </Button>
        </div>

        <div className="p-4">
          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Shared Media</h4>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            </div>
          </div>

          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Files & Links</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">project_requirements.pdf</p>
                <p className="text-xs text-muted-foreground">1.2 MB • 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <Link2 className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Figma Design System</p>
                <p className="text-xs text-muted-foreground">figma.com • Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
