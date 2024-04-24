"use client";

import { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { SocketContext } from "./socket-context";
import { SocketEvents } from "@/types";
import { useMeetingContext } from "../meeting/meeting-context";

type Props = { children: ReactNode };

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const { meetingId, meetingState, setParticipantCount } = useMeetingContext();
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

    socketInstance.on(SocketEvents.CONNECT, () => setIsConnected(true));
    socketInstance.on(SocketEvents.DISCONNECT, () => setIsConnected(false));
    socketInstance.on(SocketEvents.PARTICIPANT_COUNT, setParticipantCount);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [meetingId, setParticipantCount]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(SocketEvents.MEETING_STATE, meetingState);
  }, [meetingState, socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
