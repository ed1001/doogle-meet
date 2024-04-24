"use client";

import { Dispatch, SetStateAction, createContext, useContext } from "react";

import { MeetingState } from "@/types";

type MeetingContextType = {
  meetingId?: string;
  setMeetingState: Dispatch<SetStateAction<MeetingState>>;
  meetingState: MeetingState;
  participantCount: number;
  setParticipantCount: Dispatch<SetStateAction<number>>;
};

export const MeetingContext = createContext<MeetingContextType>({
  meetingState: MeetingState.LOBBY,
  setMeetingState: () => {},
  participantCount: 0,
  setParticipantCount: () => {},
});

export const useMeetingContext = () => useContext(MeetingContext);
