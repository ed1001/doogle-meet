import { ChangeEvent, SVGProps, useRef, useState } from "react";

import { useAppContext } from "@/context/app-context";
import { Microphone } from "@/icons/Microphone";
import { Speaker } from "@/icons/Speaker";
import { Camera } from "@/icons/Camera";

type Props = {
  deviceKind: MediaDeviceKind;
  devices: MediaDeviceInfo[];
};

export const DeviceSelect: React.FC<Props> = ({ deviceKind, devices }) => {
  const {
    assignDevicesAndStreams,
    localVidRef,
    getCurrentInputDeviceIds: getCurrentDeviceIds,
  } = useAppContext();
  const [selectedDevice, setSelectedDevice] = useState(() => {
    const currentDeviceIds = getCurrentDeviceIds();
    if (deviceKind === "audiooutput") return localVidRef?.current?.sinkId;

    return currentDeviceIds[deviceKind];
  });
  const selectRef = useRef<HTMLSelectElement>();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;

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

    setSelectedDevice(deviceId);
  };

  const selectId = `${deviceKind}-select`;
  const Icon = kindToIcon[deviceKind];

  const handleDropdown = () => {
    if (!selectRef.current) return;

    selectRef.current.showPicker();
  };

  return (
    <div
      className="flex rounded-full py-1 px-2 cursor-pointer border border-current
        bg-secondaryHighlight"
      onClick={handleDropdown}
    >
      <div className="flex items-center">
        <Icon width={16} height={16} />
      </div>
      <select
        ref={(element) => {
          if (!element) return;

          selectRef.current = element;
        }}
        id={selectId}
        onChange={onChange}
        value={selectedDevice}
        className="w-[150px] overflow-ellipsis whitespace-nowrap text-sm bg-transparent
          focus:outline-none"
      >
        {devices.map((device) => (
          <option
            key={device.deviceId}
            value={device.deviceId}
            label={device.label}
          />
        ))}
      </select>
    </div>
  );
};

const kindToIcon: {
  [key in MediaDeviceKind]: (props: SVGProps<SVGSVGElement>) => JSX.Element;
} = { audioinput: Microphone, audiooutput: Speaker, videoinput: Camera };
