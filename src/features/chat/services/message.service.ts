import { Message, Conversation } from "@/types/chat.types";
import { BACKEND_URL } from "@/constants/chat.constants";

export const messageService = {
  async getMessages(chatId: string, userId: string, limit = 15, cursor?: string, search?: string) {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const cursorParam = cursor ? `&before=${encodeURIComponent(cursor)}` : "";
    
    const res = await fetch(
      `${BACKEND_URL}/api/messages?chatId=${encodeURIComponent(chatId)}&userId=${userId}&limit=${limit}${cursorParam}${searchParam}`
    );
    
    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }
    
    const data = await res.json();
    return data;
  },

  async getUserGroups(userId: string) {
    const res = await fetch(`${BACKEND_URL}/api/messages/groups?userId=${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user groups");
    }
    return res.json();
  },

  async getUnreadCounts(userId: string) {
    const res = await fetch(`${BACKEND_URL}/api/messages/unread-counts?userId=${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch unread counts");
    }
    return res.json();
  }
};
