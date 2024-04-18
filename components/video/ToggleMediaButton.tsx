import { Size } from "@/types";

import { useMediaContext } from "@/context/media/media-context";
import { CircularButton } from "../CircularButton";
import { Camera } from "@/icons/Camera";
import { CameraOff } from "@/icons/CameraOff";
import { Microphone } from "@/icons/Microphone";
import { MicrophoneOff } from "@/icons/MicrophoneOff";

type Props = {
  kind: "camera" | "mic";
  size: Size;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ToggleMediaButton: React.FC<Props> = (props) => {
  const { kind, size, ...rest } = props;
  const {
    videoActive,
    setVideoActive,
    videoBlocked,
    micActive,
    setMicActive,
    micBlocked,
    localStream,
  } = useMediaContext();

  const toggleVideoActive = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (videoBlocked) {
      //TODO: show modal to mod preference
    }

    setVideoActive((prev) => {
      const newValue = !prev;
      localStream
        ?.getVideoTracks()
        .forEach((track) => (track.enabled = newValue));

      return newValue;
    });
  };

  const toggleMicActive = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (micBlocked) {
      //TODO: show modal to mod preference
    }

    setMicActive((prev) => {
      const newValue = !prev;
      localStream
        ?.getAudioTracks()
        .forEach((track) => (track.enabled = newValue));

      return newValue;
    });
  };

  const mediaBlocked = kind === "camera" ? videoBlocked : micBlocked;
  const mediaActive = kind === "camera" ? videoActive : micActive;
  const mediaOn = mediaActive && !mediaBlocked;
  const toggleMediaActive =
    kind === "camera" ? toggleVideoActive : toggleMicActive;

  const iconDimension = size === "sm" ? 18 : 22;
  const MediaOnIcon = kind === "camera" ? Camera : Microphone;
  const MediaOffIcon = kind === "camera" ? CameraOff : MicrophoneOff;

  return (
    <CircularButton
      size={size}
      onClick={toggleMediaActive}
      active={mediaOn}
      className={mediaOn ? "border border-white" : "bg-red-600"}
      {...rest}
    >
      {mediaOn ? (
        <MediaOnIcon width={iconDimension} height={iconDimension} />
      ) : (
        <MediaOffIcon width={iconDimension} height={iconDimension} />
      )}
    </CircularButton>
  );
};
