import { ToggleMediaButton } from "./ToggleMediaButton";

export const VideoControlPanel = () => {
  return (
    <div className="flex justify-center absolute bottom-0 left-0 w-full h-16 text-white">
      <ToggleMediaButton kind="mic" size="lg" />
      <div className="w-6" />
      <ToggleMediaButton kind="camera" size="lg" />
    </div>
  );
};
