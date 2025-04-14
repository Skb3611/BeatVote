import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "./useSocket";

export const SocketContext = createContext<Socket | null>(null) as React.Context<Socket | null>;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext) as Socket;