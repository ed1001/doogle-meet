"use client";

import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket?: Socket;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

export const useSocketContext = () => useContext(SocketContext);
