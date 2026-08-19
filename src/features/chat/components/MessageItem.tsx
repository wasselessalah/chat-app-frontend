import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, CheckCheck, Pencil, Trash2, Ban, Smile, X } from "lucide-react";
import { EMOJIS, FIVE_MINUTES_MS } from "@/constants/chat.constants";
import { Message, ChatUser } from "@/types/chat.types";

interface MessageItemProps {
  msg: Message;
  idx: number;
  isMe: boolean;
  senderName: string;
  senderAvatar: string;
  showAvatar: boolean;
  isGroup: boolean;
  themeColorClass: string;
  editingMessageId: string | null;
  editingText: string;
  activePickerId: string | null;
  currentUserId: string;
  onStartEdit: (msg: Message) => void;
  onSaveEdit: (messageId: string) => void;
  onCancelEdit: () => void;
  onDeleteMessage: (messageId: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  setActivePickerId: (id: string | null) => void;
  setEditingText: (text: string) => void;
}

const parseReactions = (raw: any): { emoji: string; userId: string }[] => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }
  return [];
};

const getGroupedReactions = (rawReactions: any) => {
  const reactionsList = parseReactions(rawReactions);
  const grouped: { [emoji: string]: { count: number; userIds: string[] } } = {};

  reactionsList.forEach((r) => {
    if (!grouped[r.emoji]) {
      grouped[r.emoji] = { count: 0, userIds: [] };
    }
    grouped[r.emoji].count += 1;
    grouped[r.emoji].userIds.push(r.userId);
  });

  return grouped;
};

export function MessageItem({
  msg,
  isMe,
  senderName,
  senderAvatar,
  showAvatar,
  isGroup,
  themeColorClass,
  editingMessageId,
  editingText,
  activePickerId,
  currentUserId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteMessage,
  onToggleReaction,
  setActivePickerId,
  setEditingText,
}: MessageItemProps) {
  const isDeleted = msg.isDeleted || msg.content === "This message was deleted";
  
  const isEditable =
    isMe &&
    !isDeleted &&
    msg.createdAt &&
    Date.now() - new Date(msg.createdAt).getTime() < FIVE_MINUTES_MS;

  const isEditingThis = editingMessageId === msg.id;
  const isPickerOpen = activePickerId === msg.id;

  return (
    <div className={`group flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
      {showAvatar ? (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback>{senderName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8 shrink-0" />
      )}
      <div className={`relative flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
        {/* Reaction Bar */}
        {!isDeleted && !isEditingThis && (
          <div
            className={`absolute -top-5 ${isMe ? "right-0" : "left-0"} ${
              isPickerOpen ? "flex" : "hidden group-hover:flex"
            } items-center gap-1 bg-background/95 backdrop-blur border shadow-md rounded-full px-2.5 py-1 z-20 max-w-[240px] overflow-x-auto overflow-y-hidden scrollbar-none whitespace-nowrap animate-in fade-in zoom-in duration-150`}
          >
            {EMOJIS.map((emoji) => {
              const reactionsList = parseReactions(msg.reactions);
              const isMyReaction = reactionsList.some(
                (r) => r.userId === currentUserId && r.emoji === emoji
              );
              return (
                <button
                  key={emoji}
                  onClick={() => onToggleReaction(msg.id, emoji)}
                  className={`hover:scale-125 transition-transform p-1 text-sm rounded-full shrink-0 ${
                    isMyReaction ? "bg-primary/20 scale-110" : ""
                  }`}
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        )}

        {/* Sender Name in Group Chat */}
        {!isMe && isGroup && (
          <span className="text-[11px] font-semibold text-primary mb-0.5 px-1">
            {msg.senderName || senderName}
          </span>
        )}

        {isEditingThis ? (
          <div className="flex items-center gap-2 bg-muted p-2 rounded-2xl border">
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveEdit(msg.id);
                if (e.key === "Escape") onCancelEdit();
              }}
              className="h-8 text-sm bg-background"
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={() => onSaveEdit(msg.id)}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={onCancelEdit}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : isDeleted ? (
          <div className={`relative group/msg px-4 py-2 rounded-2xl border ${
              isMe ? "bg-muted/40 text-muted-foreground rounded-br-sm border-dashed" : "bg-muted/40 text-muted-foreground rounded-bl-sm border-dashed"
            }`}
          >
            <p className="text-sm italic flex items-center gap-1.5 text-muted-foreground select-none">
              <Ban className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
              <span>This message was deleted</span>
            </p>
          </div>
        ) : (
          <div className={`relative group/msg px-4 py-2 rounded-2xl ${
              isMe ? `${themeColorClass} rounded-br-sm` : "bg-muted rounded-bl-sm"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        )}

        {/* Reaction Badges */}
        {!isDeleted && (
          <>
            {(() => {
              const grouped = getGroupedReactions(msg.reactions);
              const emojiKeys = Object.keys(grouped);
              if (emojiKeys.length === 0) return null;

              return (
                <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  {emojiKeys.map((emoji) => {
                    const item = grouped[emoji];
                    const isMyReaction = item.userIds.includes(currentUserId);
                    return (
                      <button
                        key={emoji}
                        onClick={() => onToggleReaction(msg.id, emoji)}
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                          isMyReaction ? "bg-primary/15 border-primary/40 text-primary font-medium shadow-xs" : "bg-muted/60 hover:bg-muted border-border/60 text-muted-foreground"
                        }`}
                        title={`${item.count} reaction${item.count > 1 ? "s" : ""}`}
                      >
                        <span>{emoji}</span>
                        <span>{item.count}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </>
        )}

        <div className="flex items-center gap-1 mt-1 px-1">
          {!isDeleted && !isEditingThis && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setActivePickerId(isPickerOpen ? null : msg.id)}
                className="p-0.5 hover:bg-muted rounded text-muted-foreground transition-colors"
                title="React to message"
              >
                <Smile className="w-3 h-3" />
              </button>
              {isEditable && (
                <>
                  <button
                    onClick={() => onStartEdit(msg)}
                    className="p-0.5 hover:bg-muted rounded text-muted-foreground transition-colors"
                    title="Edit message (< 5 mins)"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteMessage(msg.id)}
                    className="p-0.5 hover:bg-red-500/10 hover:text-red-500 rounded text-muted-foreground transition-colors"
                    title="Delete message (< 5 mins)"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}
          {msg.isEdited && !isDeleted && (
            <span className="text-[10px] text-muted-foreground italic">(edited)</span>
          )}
          <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
          {isMe && (
            <span className="text-muted-foreground">
              {msg.isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
