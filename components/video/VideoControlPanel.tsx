import { useAppContext } from "@/context/app-context";

import { Camera } from "@/icons/Camera";
import { CameraOff } from "@/icons/CameraOff";
import { Microphone } from "@/icons/Microphone";
import { MicrophoneOff } from "@/icons/MicrophoneOff";
import { CircularButton } from "../CircularButton";

export const VideoControlPanel = () => {
  const {
    videoBlocked,
    videoActive,
    setVideoActive,
    micBlocked,
    micActive,
    setMicActive,
    localStream,
  } = useAppContext();
  const videoOn = videoActive && !videoBlocked;
  const micOn = micActive && !micBlocked;

  const toggleVideoActive = () => {
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

  const toggleMicActive = () => {
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

  return (
    <div className="flex justify-center absolute bottom-0 left-0 w-full h-16 text-white">
      <CircularButton size="lg" onClick={toggleMicActive} fill={!micOn}>
        {micOn ? <Microphone /> : <MicrophoneOff />}
      </CircularButton>
      <div className="w-6" />
      <CircularButton size="lg" onClick={toggleVideoActive} fill={!videoOn}>
        {videoOn ? <Camera /> : <CameraOff />}
      </CircularButton>
    </div>
  );
};
