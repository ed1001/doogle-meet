"use client";

import { useWebRTC } from "@/hooks/useWebRTC";
import { useVideoLayout } from "../hooks/useVideoThing";
import { Video } from "@/components/Video";
import { attachStreamToVideo } from "@/lib/attachStreamToVideo";

export default function VideoContainer() {
  const { peerConnectionMappings, localVidRef, localStream } = useWebRTC();
  const { gridRef, maxVideoHeight } = useVideoLayout(
    peerConnectionMappings.length + 1,
  );

  return (
    <div
      ref={gridRef}
      className="flex-grow grid gap-2 items-center overflow-auto bg-sky-300 w-full"
    >
      <Video
        maxHeight={maxVideoHeight}
        ref={(element: HTMLVideoElement) => {
          if (!element) return;

          localVidRef.current = element;
          localStream && attachStreamToVideo(localStream, element);
        }}
      />
      {peerConnectionMappings.map((pcMapping) => {
        return (
          <Video
            key={pcMapping.inverseSocketId}
            maxHeight={maxVideoHeight}
            ref={(element) => {
              if (!element) return;

              attachStreamToVideo(pcMapping.remoteStream, element);
            }}
          />
        );
      })}
    </div>
  );
}
