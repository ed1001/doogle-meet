import { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { VideoControlPanel } from "./VideoControlPanel";
import { useIsFirstRender } from "@/hooks/useFirstRender";

type Props = { maxHeight: number; showControlPanel?: boolean; muted?: boolean };

export const Video = forwardRef<HTMLVideoElement, Props>(function Video(
  { maxHeight, showControlPanel, muted },
  ref: ForwardedRef<HTMLVideoElement>,
) {
  const isFirstRender = useIsFirstRender();

  return (
    <motion.div
      className="relative m-1 flex items-center aspect-video bg-black rounded-lg"
      style={{ maxHeight: `${maxHeight}px` }}
      layout={!isFirstRender}
    >
      <video
        muted={muted}
        ref={ref}
        className="w-full h-full object-contain scale-x-[-1]"
      />
      {showControlPanel ? <VideoControlPanel /> : null}
    </motion.div>
  );
});
