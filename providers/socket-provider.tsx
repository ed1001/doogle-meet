"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

import { SocketEvents } from "@/types";
import { useParams } from "next/navigation";

type SocketContextType = {
  socket?: Socket;
  isConnected: boolean;
  setMeetingId?: Dispatch<SetStateAction<string | undefined>>;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

type Props = { children: ReactNode };

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const params = useParams<{ meetingId: string }>();
  const { meetingId } = params || {};
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!meetingId) {
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      auth: { meetingId },
    });

    socketInstance.on(SocketEvents.CONNECT, () => {
      setIsConnected(true);
    });

    socketInstance.on(SocketEvents.DISCONNECT, () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      console.log("disconnect");
      socketInstance.disconnect();
    };
  }, [meetingId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
