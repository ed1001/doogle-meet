import { ForwardedRef, forwardRef } from "react";

type Props = { maxHeight: number };

export const Video = forwardRef<HTMLVideoElement, Props>(function Video(
  { maxHeight },
  ref: ForwardedRef<HTMLVideoElement>,
) {
  return (
    <div
      className="flex items-center aspect-video bg-black rounded-lg"
      style={{ maxHeight: `${maxHeight}px` }}
    >
      <video ref={ref} className="w-full h-full object-contain" />
    </div>
  );
});
