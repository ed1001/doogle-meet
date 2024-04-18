import { MeetingState } from "@/types";

import { useSocketContext } from "@/context/socket/socket-context";
import { CircularButton } from "@/components/CircularButton";
import { ToggleMediaButton } from "@/components/video/ToggleMediaButton";
import { CallEnd } from "@/icons/CallEnd";
import { CircleDropdownBG } from "@/components/CircleDropdownBG";

export const ControlPanel = () => {
  const { setMeetingState } = useSocketContext();

  return (
    <div className="flex justify-center items-center flex-shrink-0 h-20 text-white [&>*]:mx-2">
      <CircleDropdownBG>
        <ToggleMediaButton kind="mic" size="sm" />
      </CircleDropdownBG>
      <CircleDropdownBG>
        <ToggleMediaButton kind="camera" size="sm" />
      </CircleDropdownBG>
      <CircularButton
        onClick={() => setMeetingState?.(MeetingState.LEFT)}
        size="sm"
        className="bg-red-600"
      >
        <CallEnd />
      </CircularButton>
    </div>
  );
};
