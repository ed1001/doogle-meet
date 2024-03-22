"use client";

import { useWebRTC } from "@/hooks/useWebRTC";

export default function MeetingRoom() {
  const { localVidRef, peerConnectionMappings, socketId } = useWebRTC();

  return (
    <main className="flex flex-col justify-between">
      <p>{socketId}</p>
      <video
        ref={(element) => {
          if (element) {
            localVidRef.current = element;
          }
        }}
        className="h-full w-1/2 border"
      />
      {peerConnectionMappings.map((pcMapping) => {
        return (
          <video
            key={pcMapping.inverseSocketId}
            ref={(element) => {
              if (element) {
                element.srcObject = pcMapping.remoteStream;
                element.setAttribute("autoplay", "");
                element.setAttribute("muted", "");
                element.setAttribute("playsinline", "");
              }
            }}
            className="h-full w-1/2 border"
            autoPlay
          />
        );
      })}
    </main>
  );
}
