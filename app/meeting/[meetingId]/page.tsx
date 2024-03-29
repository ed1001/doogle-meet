"use client";

import { useSocket } from "@/providers";
import { MeetingState } from "@/types";

import Lobby from "./lobby/Lobby";
import Chat from "./chat/Chat";
import Left from "./left/Left";

export default function MeetingRoom() {
  const { meetingState } = useSocket();

  const renderMeeting = () => {
    switch (meetingState) {
      case MeetingState.LOBBY:
        return <Lobby />;
      case MeetingState.CHAT:
        return <Chat />;
      case MeetingState.LEFT:
        return <Left />;
      default:
        const exhaustiveCheck: never = meetingState;
        throw new Error(exhaustiveCheck);
    }
  };

  return renderMeeting();
}
