"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { Video } from "@/components/Video";
import { useSocket } from "@/providers";
import { MeetingState } from "@/types";

export default function Lobby() {
  const { setMeetingState, participantCount } = useSocket();

  return (
    <main className="flex items-center min-h-lvh">
      <Navbar />
      <div className="flex grow justify-center h-full p-4">
        <Video maxHeight={400} />
        <div>
          <h1>Ready to join?</h1>
          <p>
            {participantCount
              ? `${participantCount} others are on the call`
              : "no else is here"}
          </p>
          <button onClick={() => setMeetingState?.(MeetingState.CHAT)}>
            Join meeting
          </button>
        </div>
      </div>
    </main>
  );
}
