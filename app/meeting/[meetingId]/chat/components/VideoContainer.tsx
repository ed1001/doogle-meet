"use client";

import { attachStreamToVideo } from "@/lib/attachStreamToVideo";
import { useAppContext } from "@/context/app-context";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useVideoLayout } from "../hooks/useVideoLayout";

import { Video } from "@/components/video/Video";

export default function VideoContainer() {
  const { localVidRefCallback } = useAppContext();
  const { peerConnectionMappings } = useWebRTC();
  const { gridRef, gridContainerRef, maxVideoHeight } = useVideoLayout(
    peerConnectionMappings.length + 1,
  );

  return (
    <div
      ref={gridContainerRef}
      className="flex items-center justify-center w-full h-full bg-secondaryHighlight"
    >
      <div
        ref={gridRef}
        className="grid gap-2 p-2 items-center overflow-hidden w-full"
      >
        <Video muted maxHeight={maxVideoHeight} ref={localVidRefCallback} />
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
    </div>
  );
}
