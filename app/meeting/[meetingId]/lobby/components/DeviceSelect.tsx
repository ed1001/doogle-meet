import { SVGProps } from "react";

import { useMediaContext } from "@/context/media/media-context";
import { useDropdownContext } from "@/context/dropdown/dropdown-context";

import { Microphone } from "@/icons/Microphone";
import { Speaker } from "@/icons/Speaker";
import { Camera } from "@/icons/Camera";
import { ChevronDown } from "@/icons/ChevronDown";
import { DeviceSelectDropdown } from "@/components/DeviceSelectDropdown";

type Props = {
  deviceKind: MediaDeviceKind;
  devices: MediaDeviceInfo[];
};

const deviceIcons: {
  [key in MediaDeviceKind]: (props: SVGProps<SVGSVGElement>) => JSX.Element;
} = { audioinput: Microphone, audiooutput: Speaker, videoinput: Camera };

export const DeviceSelect: React.FC<Props> = ({ deviceKind, devices }) => {
  const { toggleActiveDropdown } = useDropdownContext();
  const { currentDeviceIds } = useMediaContext();

  const Icon = deviceIcons[deviceKind];
  const selectedDeviceId = currentDeviceIds[deviceKind];
  const selectedDevice = devices.find(
    ({ deviceId }) => deviceId === selectedDeviceId,
  );

  return (
    <div
      className="flex cursor-pointer rounded-full border border-transparent px-2 py-1
        text-lowlight transition duration-300 hover:border-current
        hover:bg-secondaryHighlight hover:text-white"
      onClick={() => {
        return toggleActiveDropdown(deviceKind);
      }}
    >
      <div className="flex items-center gap-2 p-1">
        <Icon width={16} height={16} />
        <div className="w-32 truncate text-xs">{selectedDevice?.label}</div>
        <ChevronDown width={10} height={10} />
      </div>
      <DeviceSelectDropdown deviceKind={deviceKind} devices={devices} />
    </div>
  );
};
