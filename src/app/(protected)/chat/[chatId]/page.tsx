
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ChatArea } from "@/components/chat/chat-area";
import { DetailsPanel } from "@/components/chat/details-panel";
import { authClient } from "@/lib/auth-client";
import { ChatUser } from "@/types/chat";
import { getParticipantIds } from "@/constants/group.constants";

export default function ChatDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const baseChatId = params.chatId as string;

  /**
   * The backend expects the query parameters to remain
   * part of the chat ID.
   */
  const chatId = useMemo(() => {
    const queryString = searchParams.toString();

    return queryString
      ? `${baseChatId}?${queryString}`
      : baseChatId;
  }, [baseChatId, searchParams]);

  const isGroup = chatId?.startsWith("group_");

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const currentUser = session?.user;

  const [participants, setParticipants] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!currentUser || !chatId) return;

    let cancelled = false;

    const loadConversation = async () => {
      setLoading(true);
      setError(false);
      setParticipants([]);
      setGroupName(undefined);

      try {
        // --------------------------------------------------
        // GROUP CHAT
        // --------------------------------------------------
        if (isGroup) {
          const [, queryPart] = chatId.split("?");

          const urlParams = new URLSearchParams(queryPart || "");
          const explicitName = urlParams.get("name");

          const memberIds = getParticipantIds(chatId);

          // Current user must belong to the group
          if (!memberIds.includes(currentUser.id)) {
            if (!cancelled) {
              setError(true);
              setLoading(false);
            }
            return;
          }

          const otherUserIds = memberIds.filter(
            (id) => id !== currentUser.id
          );

          const fetchedUsers = await Promise.all(
            otherUserIds.map(async (id) => {
              try {
                const response = await fetch(`/api/users/${id}`);

                if (!response.ok) return null;

                return (await response.json()) as ChatUser;
              } catch {
                return null;
              }
            })
          );

          if (cancelled) return;

          const validUsers = fetchedUsers.filter(
            Boolean
          ) as ChatUser[];

          setParticipants(validUsers);

          if (explicitName) {
            setGroupName(explicitName);
          } else {
            const names = validUsers
              .map((user) => user.name)
              .filter(Boolean);

            setGroupName(
              names.length > 0
                ? `Group (${names.join(", ")})`
                : "Group Chat"
            );
          }

          setLoading(false);
          return;
        }

        // --------------------------------------------------
        // ONE-TO-ONE CHAT
        // --------------------------------------------------
        const parts = chatId.split("_vs_");

        // Current user must be part of the conversation
        if (!parts.includes(currentUser.id)) {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
          return;
        }

        const otherUserId = parts.find(
          (id) => id !== currentUser.id
        );

        if (!otherUserId) {
          setError(true);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/users/${otherUserId}`
        );

        if (!response.ok) {
          throw new Error("User not found");
        }

        const user = (await response.json()) as ChatUser;

        if (cancelled) return;

        setParticipants([user]);
        setLoading(false);
      } catch (err) {
        console.error(
          "Failed to load conversation:",
          err
        );

        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadConversation();

    return () => {
      cancelled = true;
    };
  }, [chatId, currentUser, isGroup]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (sessionLoading || loading || !currentUser) {
    return <ChatLoadingSkeleton />;
  }

  // --------------------------------------------------
  // INVALID / UNAUTHORIZED CHAT
  // --------------------------------------------------

  if (error || participants.length === 0) {
    notFound();
  }

  // --------------------------------------------------
  // CURRENT USER
  // --------------------------------------------------

  const mappedCurrentUser: ChatUser = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image ?? undefined,
  };

  // --------------------------------------------------
  // CONVERSATION
  // --------------------------------------------------

  const conversation = {
    id: chatId,
    isGroup,
    name: isGroup
      ? groupName || "Group Chat"
      : undefined,
    participants: [
      mappedCurrentUser,
      ...participants,
    ],
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 overflow-hidden bg-background">
      {/* Main chat */}
      <main className="flex min-h-0 min-w-0 flex-1">
        <ChatArea
          conversation={conversation}
          currentUser={mappedCurrentUser}
          onToggleDetails={() =>
            setShowDetails((previous) => !previous)
          }
        />
      </main>

      {/* Details panel */}
      <aside
        className={`
          absolute inset-y-0 right-0 z-40
          w-full max-w-sm
          border-l bg-background
          shadow-2xl
          transition-all duration-300 ease-out
          md:relative md:z-auto md:shadow-none
          ${
            showDetails
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none md:hidden"
          }
        `}
        aria-hidden={!showDetails}
      >
        <DetailsPanel
          conversation={conversation}
          currentUser={mappedCurrentUser}
          onClose={() => setShowDetails(false)}
        />
      </aside>

      {/* Mobile backdrop */}
      {showDetails && (
        <button
          type="button"
          aria-label="Close conversation details"
          onClick={() => setShowDetails(false)}
          className="
            absolute inset-0 z-30
            bg-black/30 backdrop-blur-[2px]
            md:hidden
          "
        />
      )}
    </div>
  );
}

/**
 * Clean loading state instead of a generic spinner.
 * This makes the chat feel faster and avoids layout jumps.
 */
function ChatLoadingSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-background">
      {/* Header skeleton */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b px-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted/70" />
        </div>

        <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Messages skeleton */}
      <div className="flex flex-1 flex-col justify-end gap-5 p-4 md:p-6">
        <div className="flex justify-start">
          <div className="h-12 w-52 animate-pulse rounded-2xl rounded-bl-md bg-muted" />
        </div>

        <div className="flex justify-end">
          <div className="h-16 w-64 animate-pulse rounded-2xl rounded-br-md bg-muted" />
        </div>

        <div className="flex justify-start">
          <div className="h-10 w-40 animate-pulse rounded-2xl rounded-bl-md bg-muted" />
        </div>

        <div className="flex justify-end">
          <div className="h-12 w-56 animate-pulse rounded-2xl rounded-br-md bg-muted" />
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t p-3 md:p-4">
        <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
      </div>

      {/* Small loading indicator */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full border bg-background/80 p-3 shadow-sm backdrop-blur">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
