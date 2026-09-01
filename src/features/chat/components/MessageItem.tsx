
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Ban,
  Check,
  CheckCheck,
  Pencil,
  Smile,
  Trash2,
  X,
} from "lucide-react";

import {
  EMOJIS,
  FIVE_MINUTES_MS,
} from "@/constants/chat.constants";

import { Message } from "@/types/chat.types";

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

const parseReactions = (
  raw: any
): { emoji: string; userId: string }[] => {
  if (Array.isArray(raw)) return raw;

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  return [];
};

const getGroupedReactions = (rawReactions: any) => {
  const reactionsList = parseReactions(rawReactions);

  const grouped: {
    [emoji: string]: {
      count: number;
      userIds: string[];
    };
  } = {};

  reactionsList.forEach((reaction) => {
    if (!grouped[reaction.emoji]) {
      grouped[reaction.emoji] = {
        count: 0,
        userIds: [],
      };
    }

    grouped[reaction.emoji].count += 1;
    grouped[reaction.emoji].userIds.push(reaction.userId);
  });

  return grouped;
};

export function MessageItem({
  msg,
  idx,
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
  const isDeleted =
    msg.isDeleted ||
    msg.content === "This message was deleted";

  const isEditable =
    isMe &&
    !isDeleted &&
    !!msg.createdAt &&
    Date.now() - new Date(msg.createdAt).getTime() <
      FIVE_MINUTES_MS;

  const isEditingThis =
    editingMessageId === msg.id;

  const isPickerOpen =
    activePickerId === msg.id;

  const reactions = getGroupedReactions(
    msg.reactions
  );

  const reactionKeys = Object.keys(reactions);

  return (
    <div
      className={`
        group/message
        flex w-full items-end gap-2
        ${isMe ? "flex-row-reverse" : ""}
      `}
    >
      {/* Avatar */}
      {showAvatar ? (
        <Avatar className="h-8 w-8 shrink-0 ring-1 ring-border/40">
          <AvatarImage
            src={senderAvatar}
            alt={senderName}
          />

          <AvatarFallback className="text-[11px] font-semibold">
            {senderName
              .substring(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8 shrink-0" />
      )}

      {/* Message column */}
      <div
        className={`
          relative flex min-w-0 max-w-[78%] flex-col
          sm:max-w-[70%]
          ${isMe ? "items-end" : "items-start"}
        `}
      >
        {/* Group sender */}
        {!isMe && isGroup && (
          <span
            className="
              mb-1 px-1
              text-[11px]
              font-semibold
              text-primary
            "
          >
            {msg.senderName || senderName}
          </span>
        )}

        {/* Reaction picker */}
        {!isDeleted && !isEditingThis && (
          <div
            className={`
              absolute
              ${isMe ? "right-0" : "left-0"}
              -top-10
              z-30
              ${isPickerOpen
                ? "flex"
                : "hidden group-hover/message:flex"
              }
              items-center
              gap-0.5
              rounded-full
              border border-border/60
              bg-background/95
              px-1.5 py-1
              shadow-lg
              backdrop-blur-xl
              animate-in
              fade-in-0
              zoom-in-95
              duration-150
            `}
          >
            {EMOJIS.map((emoji) => {
              const reactionsList =
                parseReactions(msg.reactions);

              const isMyReaction =
                reactionsList.some(
                  (reaction) =>
                    reaction.userId === currentUserId &&
                    reaction.emoji === emoji
                );

              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() =>
                    onToggleReaction(
                      msg.id,
                      emoji
                    )
                  }
                  aria-label={`React with ${emoji}`}
                  className={`
                    flex h-7 w-7
                    items-center justify-center
                    rounded-full
                    text-base
                    transition-all
                    hover:scale-125
                    hover:bg-muted
                    active:scale-90
                    ${
                      isMyReaction
                        ? "bg-primary/15 ring-1 ring-primary/30"
                        : ""
                    }
                  `}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        )}

        {/* Message / Edit */}
        {isEditingThis ? (
          <div
            className="
              flex w-full items-center gap-1.5
              rounded-2xl
              border border-primary/30
              bg-background
              p-1.5
              shadow-md
              ring-2 ring-primary/5
            "
          >
            <Input
              value={editingText}
              onChange={(e) =>
                setEditingText(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  onSaveEdit(msg.id);
                }

                if (e.key === "Escape") {
                  onCancelEdit();
                }
              }}
              autoFocus
              className="
                h-9
                border-0
                bg-transparent
                text-sm
                shadow-none
                focus-visible:ring-0
              "
              placeholder="Edit message..."
            />

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() =>
                onSaveEdit(msg.id)
              }
              className="
                h-8 w-8
                shrink-0
                rounded-lg
                text-emerald-600
                hover:bg-emerald-500/10
                hover:text-emerald-600
              "
              aria-label="Save message"
            >
              <Check className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onCancelEdit}
              className="
                h-8 w-8
                shrink-0
                rounded-lg
                text-muted-foreground
                hover:bg-muted
                hover:text-foreground
              "
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : isDeleted ? (
          /* Deleted message */
          <div
            className={`
              flex items-center gap-2
              rounded-2xl
              border
              border-dashed
              border-border/70
              bg-muted/40
              px-4 py-2.5
              text-muted-foreground
              ${
                isMe
                  ? "rounded-br-md"
                  : "rounded-bl-md"
              }
            `}
          >
            <Ban className="h-3.5 w-3.5 shrink-0 opacity-60" />

            <span className="text-sm italic">
              This message was deleted
            </span>
          </div>
        ) : (
          /* Normal message */
          <div
            className={`
              relative
              px-3.5 py-2.5
              text-sm
              leading-relaxed
              shadow-sm
              transition-shadow
              group-hover/message:shadow-md
              ${
                isMe
                  ? `${themeColorClass} rounded-2xl rounded-br-md`
                  : "rounded-2xl rounded-bl-md bg-muted"
              }
            `}
          >
            <p
              className="
                whitespace-pre-wrap
                break-words
                [overflow-wrap:anywhere]
              "
            >
              {msg.content}
            </p>
          </div>
        )}

        {/* Reactions */}
        {!isDeleted &&
          reactionKeys.length > 0 && (
            <div
              className={`
                -mt-1.5
                z-10
                flex flex-wrap gap-1
                ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }
              `}
            >
              {reactionKeys.map((emoji) => {
                const reaction =
                  reactions[emoji];

                const isMyReaction =
                  reaction.userIds.includes(
                    currentUserId
                  );

                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() =>
                      onToggleReaction(
                        msg.id,
                        emoji
                      )
                    }
                    title={`${reaction.count} reaction${
                      reaction.count > 1
                        ? "s"
                        : ""
                    }`}
                    className={`
                      inline-flex
                      h-6
                      items-center
                      gap-1
                      rounded-full
                      border
                      px-2
                      text-[11px]
                      shadow-sm
                      transition-all
                      hover:-translate-y-0.5
                      hover:shadow-md
                      active:scale-95
                      ${
                        isMyReaction
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 bg-background/90 text-muted-foreground hover:bg-muted"
                      }
                    `}
                  >
                    <span className="text-sm leading-none">
                      {emoji}
                    </span>

                    <span className="font-medium">
                      {reaction.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

        {/* Message metadata + actions */}
        <div
          className={`
            mt-1
            flex min-h-5
            items-center gap-1.5
            px-1
            ${
              isMe
                ? "flex-row-reverse"
                : "flex-row"
            }
          `}
        >
          {/* Actions */}
          {!isDeleted &&
            !isEditingThis && (
              <div
                className="
                  flex items-center gap-0.5
                  opacity-0
                  transition-opacity
                  group-hover/message:opacity-100
                  group-focus-within/message:opacity-100
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setActivePickerId(
                      isPickerOpen
                        ? null
                        : msg.id
                    )
                  }
                  aria-label="React to message"
                  title="React"
                  className="
                    flex h-6 w-6
                    items-center justify-center
                    rounded-md
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                  "
                >
                  <Smile className="h-3.5 w-3.5" />
                </button>

                {isEditable && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        onStartEdit(msg)
                      }
                      aria-label="Edit message"
                      title="Edit"
                      className="
                        flex h-6 w-6
                        items-center justify-center
                        rounded-md
                        text-muted-foreground
                        transition-colors
                        hover:bg-muted
                        hover:text-foreground
                      "
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDeleteMessage(msg.id)
                      }
                      aria-label="Delete message"
                      title="Delete"
                      className="
                        flex h-6 w-6
                        items-center justify-center
                        rounded-md
                        text-muted-foreground
                        transition-colors
                        hover:bg-destructive/10
                        hover:text-destructive
                      "
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            )}

          {/* Edited */}
          {msg.isEdited && !isDeleted && (
            <span
              className="
                text-[10px]
                italic
                text-muted-foreground
              "
            >
              edited
            </span>
          )}

          {/* Timestamp */}
          <span
            className="
              text-[10px]
              tabular-nums
              text-muted-foreground/80
            "
          >
            {msg.timestamp}
          </span>

          {/* Read status */}
          {isMe && (
            <span
              className="
                flex items-center
                text-muted-foreground
              "
              aria-label={
                msg.isRead
                  ? "Read"
                  : "Sent"
              }
            >
              {msg.isRead ? (
                <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
