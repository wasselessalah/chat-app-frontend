export type ChatUser = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  image?: string;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
  lastMessage?: {
    content: string;
    createdAt: Date | string;
    senderId: string;
  } | null;
};

export type Reaction = {
  emoji: string;
  userId: string;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  chatId: string;
  timestamp: string; // formatted time string
  createdAt: string; // ISO string
  isRead: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  isSystem: boolean;
  reactions: string | Reaction[]; // depending on if it's parsed from DB JSON
};

export type Conversation = {
  id: string;
  participants: ChatUser[];
  lastMessage?: Partial<Message> | null;
  unreadCount?: number;
  isGroup?: boolean;
  name?: string | null;
  groupAvatar?: string;
};

// Keep legacy alias for backward compatibility
export type User = ChatUser;
