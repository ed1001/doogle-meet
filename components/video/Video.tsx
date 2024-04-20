import { ForwardedRef, forwardRef } from "react";
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
      className="relative m-1 flex aspect-video items-center rounded-lg bg-black"
      style={{ maxHeight: `${maxHeight}px` }}
      layout={!isFirstRender}
    >
      <video
        muted={muted}
        ref={ref}
        className="size-full scale-x-[-1] object-contain"
      />
      {showControlPanel ? <VideoControlPanel /> : null}
    </motion.div>
  );
});
