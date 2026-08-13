import { io, Socket } from "socket.io-client";

// Define the URL of your backend server
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = (userId?: string): Socket | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    socket = io(BACKEND_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO backend:", socket?.id);
      // Re-emit user_connected after reconnect if userId is known
      if (userId) {
        socket?.emit("user_connected", userId);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }

  // Announce presence whenever called with a userId (e.g. on first render)
  if (userId && socket.connected) {
    socket.emit("user_connected", userId);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
