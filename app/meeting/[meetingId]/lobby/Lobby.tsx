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
      <div className="flex grow justify-center items-center h-full p-4 flex-col lg:flex-row">
        <div className="flex flex-col">
          <Video
            muted
            maxHeight={400}
            ref={localVidRefCallback}
            showControlPanel
          />
          <DevicePanel />
        </div>
        <div className="flex flex-col items-center p-20">
          <h1 className="text-2xl mb-4">Ready to join?</h1>
          <p className="text-sm text-lowlight mb-4">
            {participantCount
              ? `${participantCount} others are on the call`
              : "No one else is here"}
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
