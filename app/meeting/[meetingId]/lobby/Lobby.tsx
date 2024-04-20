"use client";

import { useEffect } from "react";

import { MeetingState } from "@/types";

import { Button } from "@/components/Button";
import { Navbar } from "@/components/navbar/Navbar";
import { Video } from "@/components/video/Video";
import { DevicePanel } from "./components/DevicePanel";
import { useSocketContext } from "@/context/socket/socket-context";
import { useMediaContext } from "@/context/media/media-context";

export default function Lobby() {
  const { setMeetingState, participantCount } = useSocketContext();
  const { localStream, localVidRefCallback, assignDevicesAndStreams } =
    useMediaContext();

  useEffect(() => {
    if (localStream) return;

    assignDevicesAndStreams({});
  }, [localStream, assignDevicesAndStreams]);

  return (
    <main className="flex min-h-lvh items-center">
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
