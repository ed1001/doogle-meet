"use client";

import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Socket } from "socket.io-client";

import { MeetingState } from "@/types";

type SocketContextType = {
  socket?: Socket;
  isConnected: boolean;
  setMeetingState: Dispatch<SetStateAction<MeetingState>>;
  meetingState: MeetingState;
  participantCount: number;
};

export const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  meetingState: MeetingState.LOBBY,
  setMeetingState: () => {},
  participantCount: 0,
});

export const useSocketContext = () => useContext(SocketContext);
