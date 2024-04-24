"use client";

import { motion } from "framer-motion";

import { useMediaContext } from "@/context/media/media-context";
import { attachStreamToVideo } from "@/lib/attachStreamToVideo";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useVideoLayout } from "@/hooks/useVideoLayout";

import { Video } from "@/components/video/Video";

export default function VideoContainer() {
  const { localVidRefCallback } = useMediaContext();
  const { peerConnectionMappings } = useWebRTC();
  const { gridRef, gridContainerRef, maxVideoHeight } = useVideoLayout(
    peerConnectionMappings.length + 1,
  );

  return (
    <div
      ref={gridContainerRef}
      className="flex size-full items-center justify-center overflow-hidden bg-secondaryHighlight
        p-1"
    >
      <motion.div
        layout
        ref={gridRef}
        className="grid w-full items-center overflow-hidden"
      >
        <Video
          muted
          maxHeight={maxVideoHeight}
          ref={localVidRefCallback}
          layout
        />
        {peerConnectionMappings.map((pcMapping) => {
          return (
            <Video
              layout
              key={pcMapping.inverseSocketId}
              maxHeight={maxVideoHeight}
              ref={(element) => {
                if (!element) return;

                attachStreamToVideo(pcMapping.remoteStream, element);
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
