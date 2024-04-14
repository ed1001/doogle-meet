"use client";

import { useEffect } from "react";

import { useAppContext } from "@/context/app-context";
import { MeetingState } from "@/types";

import { Button } from "@/components/Button";
import { Navbar } from "@/components/navbar/Navbar";
import { Video } from "@/components/video/Video";
import { DevicePanel } from "./components/DevicePanel";

export default function Lobby() {
  const {
    setMeetingState,
    participantCount,
    localStream,
    localVidRefCallback,
    assignDevicesAndStreams,
  } = useAppContext();

  useEffect(() => {
    if (localStream) return;

    assignDevicesAndStreams({});
  }, [localStream, assignDevicesAndStreams]);

  return (
    <main className="flex items-center min-h-lvh">
      <Navbar />
      <div className="flex grow justify-center h-full p-4">
        <div className="flex flex-col">
          <Video
            muted
            maxHeight={400}
            ref={localVidRefCallback}
            showControlPanel
          />
          <DevicePanel />
        </div>
        <div className="ml-4">
          <h1>Ready to join?</h1>
          <p>
            {participantCount
              ? `${participantCount} others are on the call`
              : "no else is here"}
          </p>
          <Button
            text="Join Meeting"
            onClick={() => setMeetingState?.(MeetingState.CHAT)}
            className="bg-red-300"
          />
        </div>
      </div>
    </main>
  );
}
