import { ForwardedRef, forwardRef } from "react";

import { VideoControlPanel } from "./VideoControlPanel";

type Props = { maxHeight: number; showControlPanel?: boolean };

export const Video = forwardRef<HTMLVideoElement, Props>(function Video(
  { maxHeight, showControlPanel },
  ref: ForwardedRef<HTMLVideoElement>,
) {
  return (
    <div
      className="relative flex items-center aspect-video bg-black rounded-lg"
      style={{ maxHeight: `${maxHeight}px` }}
    >
      <video ref={ref} className="w-full h-full object-contain scale-x-[-1]" />
      {showControlPanel ? <VideoControlPanel /> : null}
    </div>
  );
});
