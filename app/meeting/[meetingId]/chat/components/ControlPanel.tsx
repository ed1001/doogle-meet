import { MeetingState } from "@/types";

import { useMeetingContext } from "@/context/meeting/meeting-context";
import { useMediaContext } from "@/context/media/media-context";
import { useDropdownContext } from "@/context/dropdown/dropdown-context";

import { CircularButton } from "@/components/CircularButton";
import { ToggleMediaButton } from "@/components/video/ToggleMediaButton";
import { CallEnd } from "@/icons/CallEnd";
import { CircleDropdownBG } from "@/components/CircleDropdownBG";
import { DeviceSelectDropdown } from "@/components/DeviceSelectDropdown";

export const ControlPanel = () => {
  const { setMeetingState } = useMeetingContext();
  const { availableDevicesByKind } = useMediaContext();
  const { toggleActiveDropdown } = useDropdownContext();

  return (
    <div className="flex h-20 flex-shrink-0 items-center justify-center gap-4 text-white">
      <CircleDropdownBG onClick={() => toggleActiveDropdown("audioinput")}>
        <ToggleMediaButton kind="mic" size="sm" />
        <DeviceSelectDropdown
          deviceKind="audioinput"
          devices={availableDevicesByKind["audioinput"]}
          upwards
        />
      </CircleDropdownBG>
      <CircleDropdownBG onClick={() => toggleActiveDropdown("videoinput")}>
        <ToggleMediaButton kind="camera" size="sm" />
        <DeviceSelectDropdown
          deviceKind="videoinput"
          devices={availableDevicesByKind["videoinput"]}
          upwards
        />
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
