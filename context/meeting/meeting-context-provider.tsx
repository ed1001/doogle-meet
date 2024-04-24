"use client";

import { ReactNode, useState } from "react";
import { useParams } from "next/navigation";

import { MeetingState } from "@/types";
import { MeetingContext } from "./meeting-context";

type Props = { children: ReactNode };

export const MeetingProvider: React.FC<Props> = ({ children }) => {
  const params = useParams<{ meetingId: string }>();
  const { meetingId } = params || {};
  const [participantCount, setParticipantCount] = useState(0);
  const [meetingState, setMeetingState] = useState<MeetingState>(
    MeetingState.LOBBY,
  );

  return (
    <MeetingContext.Provider
      value={{
        meetingId,
        meetingState,
        setMeetingState,
        participantCount,
        setParticipantCount,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
