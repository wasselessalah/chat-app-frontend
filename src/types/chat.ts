export type ChatUser = {
  id: string;
  name: string;
  email?: string;
  /** avatar / image URL — DB stores as `image`, mock used `avatar` */
  avatar?: string;
  image?: string;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  chatId?: string;
  timestamp: string;
  createdAt?: string;
  isRead?: boolean;
};

export type Conversation = {
  id: string;
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount?: number;
  isGroup?: boolean;
  name?: string;
  groupAvatar?: string;
};

// Keep legacy alias
export type User = ChatUser;
