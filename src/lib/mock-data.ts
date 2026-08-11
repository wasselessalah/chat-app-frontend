import { Conversation, User, Message } from '@/types/chat';

export const currentUser: User = {
  id: 'u1',
  name: 'Wassel',
  email: 'wassel@example.com',
  avatar: 'https://i.pravatar.cc/150?u=wassel',
  status: 'online',
};

export const mockUsers: User[] = [
  {
    id: 'u2',
    name: 'Alice Smith',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    status: 'online',
  },
  {
    id: 'u3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    status: 'offline',
    lastSeen: '2 hours ago',
  },
  {
    id: 'u4',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    avatar: 'https://i.pravatar.cc/150?u=charlie',
    status: 'busy',
  },
];

export const mockMessages: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm1',
      content: 'Hey Alice, how are you doing?',
      senderId: 'u1',
      timestamp: '10:00 AM',
      isRead: true,
    },
    {
      id: 'm2',
      content: 'I am doing well, Wassel! Working on the new Next.js project.',
      senderId: 'u2',
      timestamp: '10:05 AM',
      isRead: true,
    },
    {
      id: 'm3',
      content: 'That sounds awesome. Need any help with the frontend?',
      senderId: 'u1',
      timestamp: '10:10 AM',
      isRead: true,
    },
    {
      id: 'm4',
      content: 'Actually yes, could you take a look at the layout components?',
      senderId: 'u2',
      timestamp: '10:12 AM',
      isRead: true,
    },
  ],
  'c2': [
    {
      id: 'm5',
      content: 'Hi Bob, did you check the latest designs?',
      senderId: 'u1',
      timestamp: 'Yesterday',
      isRead: true,
    },
    {
      id: 'm6',
      content: 'Not yet, will do it this afternoon.',
      senderId: 'u3',
      timestamp: 'Yesterday',
      isRead: true,
    },
  ]
};

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: [currentUser, mockUsers[0]],
    lastMessage: mockMessages['c1'][mockMessages['c1'].length - 1],
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: 'c2',
    participants: [currentUser, mockUsers[1]],
    lastMessage: mockMessages['c2'][mockMessages['c2'].length - 1],
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: 'c3',
    participants: [currentUser, mockUsers[2]],
    lastMessage: {
      id: 'm7',
      content: 'Let us sync up tomorrow morning.',
      senderId: 'u4',
      timestamp: 'Monday',
      isRead: false,
    },
    unreadCount: 2,
    isGroup: false,
  }
];
