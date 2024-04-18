import { SVGProps, useEffect, useState } from "react";

import { Microphone } from "@/icons/Microphone";
import { Speaker } from "@/icons/Speaker";
import { Camera } from "@/icons/Camera";
import { Dropdown } from "@/components/Dropdown";
import { DropdownOption } from "@/types";
import { useMediaContext } from "@/context/media/media-context";
import { useDropdownContext } from "@/context/dropdown/dropdown-context";
import { ChevronDown } from "@/icons/ChevronDown";

type Props = {
  deviceKind: MediaDeviceKind;
  devices: MediaDeviceInfo[];
};

export const DeviceSelect: React.FC<Props> = ({ deviceKind, devices }) => {
  const { activeDropdown, toggleActiveDropdown } = useDropdownContext();
  const {
    assignDevicesAndStreams,
    localVidRef,
    getCurrentDeviceIds,
    localStream,
  } = useMediaContext();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>();

  useEffect(() => {
    if (!localStream) return;

    const currentDeviceIds = getCurrentDeviceIds();
    setSelectedDeviceId(currentDeviceIds[deviceKind]);
  }, [localStream, deviceKind, getCurrentDeviceIds, localVidRef]);

  const onChange = (deviceId: string) => {
    switch (deviceKind) {
      case "audiooutput":
        localVidRef?.current?.setSinkId(deviceId);
        break;
      case "audioinput":
        assignDevicesAndStreams({ audioDeviceId: deviceId });
        break;
      case "videoinput":
        assignDevicesAndStreams({ videoDeviceId: deviceId });
        break;
      default:
        const exhaustiveCheck: never = deviceKind;
        throw new Error(exhaustiveCheck);
    }

    setSelectedDeviceId(deviceId);
  };

  const Icon = kindToIcon[deviceKind];
  const options: DropdownOption[] = devices.map(({ deviceId, label }) => ({
    key: deviceId,
    value: deviceId,
    label,
  }));
  const selectedDeviceName = options.find(
    (option) => option.value === selectedDeviceId,
  )?.label;

  return (
    <div
      className="flex rounded-full py-1 px-2 cursor-pointer text-lowlight border
        border-transparent transition duration-300 hover:border-current
        hover:bg-secondaryHighlight hover:text-white"
      onClick={() => {
        return toggleActiveDropdown(deviceKind);
      }}
    >
      <div className="flex items-center p-1">
        <Icon width={16} height={16} />
        <div className="w-32 truncate mx-2 text-xs">{selectedDeviceName}</div>
        <ChevronDown width={10} height={10} />
      </div>
      <Dropdown
        name={deviceKind}
        options={options}
        selectedValue={selectedDeviceId!}
        visible={activeDropdown === deviceKind}
        onChange={onChange}
      />
    </div>
  );
};

const kindToIcon: {
  [key in MediaDeviceKind]: (props: SVGProps<SVGSVGElement>) => JSX.Element;
} = { audioinput: Microphone, audiooutput: Speaker, videoinput: Camera };
