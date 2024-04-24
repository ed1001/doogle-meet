"use client";

import { useMeetingContext } from "@/context/meeting/meeting-context";
import { MeetingState } from "@/types";

import { ActiveMeeting } from "./active-meeting";
import Left from "./left/Left";

export default function Meeting() {
  const { meetingState } = useMeetingContext();

  switch (meetingState) {
    case MeetingState.LOBBY:
    case MeetingState.CHAT:
      return <ActiveMeeting activeMeetingState={meetingState} />;
    case MeetingState.LEFT:
      return <Left />;
    default:
      const exhaustiveCheck: never = meetingState;
      throw new Error(exhaustiveCheck);
  }
}
