"use client";

import { useEffect } from "react";

import { MeetingState } from "@/types";
import { useMediaContext } from "@/context/media/media-context";
import { useMeetingContext } from "@/context/meeting/meeting-context";

import { Button } from "@/components/Button";
import { NAVBAR_HEIGHT, Navbar } from "@/components/navbar/Navbar";
import { Video } from "@/components/video/Video";
import { DevicePanel } from "./components/DevicePanel";

export default function Lobby() {
  const { setMeetingState, participantCount } = useMeetingContext();
  const { localStream, localVidRefCallback, assignDevicesAndStreams } =
    useMediaContext();

  useEffect(() => {
    if (localStream) return;

    assignDevicesAndStreams({});
  }, [localStream, assignDevicesAndStreams]);

  return (
    <main className={`flex min-h-lvh items-center pt-${NAVBAR_HEIGHT}`}>
      <Navbar />
      <div className="flex h-full grow flex-col items-center justify-center p-4 lg:flex-row">
        <div className="flex flex-col">
          <Video
            muted
            maxHeight={400}
            ref={localVidRefCallback}
            showControlPanel
          />
          <DevicePanel />
        </div>
        <div className="flex flex-col items-center gap-4 p-20">
          <h1 className="text-2xl">Ready to join?</h1>
          <p className="text-sm text-lowlight">
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
