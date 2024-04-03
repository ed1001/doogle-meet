import { ChangeEvent, useState } from "react";

import { useAppContext } from "@/context/app-context";

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

  return (
    <>
      <label htmlFor={selectId}>{deviceKind}</label>
      <select id={selectId} onChange={onChange} value={selectedDevice}>
        {devices.map((device) => (
          <option
            key={device.deviceId}
            value={device.deviceId}
            label={device.label}
          />
        ))}
      </select>
    </>
  );
};
