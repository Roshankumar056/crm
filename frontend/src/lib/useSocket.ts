import { useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(userId?: string) {
  const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
  const socket: Socket | null = useMemo(() => io(url, { autoConnect: !!userId }), [url, userId]);

  useEffect(() => {
    if (!socket) return;
    const s = socket;
    if (userId) s.emit("joinUser", userId);
    return () => { s.disconnect(); };
  }, [socket, userId]);

  return socket;
}
