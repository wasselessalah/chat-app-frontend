export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  name?: string; // For group chats
  groupAvatar?: string;
};
