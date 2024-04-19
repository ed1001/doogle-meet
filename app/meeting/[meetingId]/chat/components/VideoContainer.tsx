"use client";

import { motion } from "framer-motion";

import { useMediaContext } from "@/context/media/media-context";
import { attachStreamToVideo } from "@/lib/attachStreamToVideo";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useVideoLayout } from "../hooks/useVideoLayout";

import { Video } from "@/components/video/Video";
import { useIsFirstRender } from "@/hooks/useFirstRender";

export default function VideoContainer() {
  const isFirstRender = useIsFirstRender();
  const { localVidRefCallback } = useMediaContext();
  const { peerConnectionMappings } = useWebRTC();
  const { gridRef, gridContainerRef, maxVideoHeight } = useVideoLayout(
    peerConnectionMappings.length + 1,
  );

  return (
    <div
      ref={gridContainerRef}
      className="flex items-center justify-center w-full h-full p-1 overflow-hidden
        bg-secondaryHighlight"
    >
      <motion.div
        layout={!isFirstRender}
        ref={gridRef}
        className="grid items-center overflow-hidden w-full"
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
      </motion.div>
    </div>
  );
}
