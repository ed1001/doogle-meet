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

import { MeetingState, SocketEvents } from "@/types";
import { useParams } from "next/navigation";

type SocketContextType = {
  socket?: Socket;
  isConnected: boolean;
  setMeetingId?: Dispatch<SetStateAction<string | undefined>>;
  setMeetingState?: Dispatch<SetStateAction<MeetingState>>;
  meetingState: MeetingState;
  participantCount: number;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  meetingState: MeetingState.LOBBY,
  participantCount: 0,
});

export const useSocket = () => useContext(SocketContext);

type Props = { children: ReactNode };

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const params = useParams<{ meetingId: string }>();
  const { meetingId } = params || {};
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [meetingState, setMeetingState] = useState<MeetingState>(
    MeetingState.LOBBY,
  );

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

    socketInstance.on(SocketEvents.PARTICIPANT_COUNT, setParticipantCount);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [meetingId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(SocketEvents.MEETING_STATE, meetingState);
  }, [meetingState, socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        meetingState,
        setMeetingState,
        participantCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
