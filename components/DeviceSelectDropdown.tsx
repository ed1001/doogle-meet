import { useMediaContext } from "@/context/media/media-context";
import { useDropdownContext } from "@/context/dropdown/dropdown-context";
import { DropdownOption } from "@/types";

import { Dropdown } from "./Dropdown";

type Props = {
  deviceKind: MediaDeviceKind;
  devices: MediaDeviceInfo[];
  upwards?: boolean;
};

export const DeviceSelectDropdown: React.FC<Props> = ({
  deviceKind,
  devices,
  upwards,
}) => {
  const { activeDropdown } = useDropdownContext();
  const {
    assignDevicesAndStreams,
    localVidRef,
    currentDeviceIds,
    triggerRefreshDevices,
  } = useMediaContext();

  const onChange = async (deviceId: string) => {
    switch (deviceKind) {
      case "audiooutput":
        await localVidRef?.current?.setSinkId(deviceId);
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

    triggerRefreshDevices();
  };

  const options: DropdownOption[] = devices.map(({ deviceId, label }) => ({
    key: deviceId,
    value: deviceId,
    label: label.replace(/\(\w{4}:\w{4}\)/, "").trim(),
  }));

  return (
    <Dropdown
      name={deviceKind}
      options={options}
      selectedValue={currentDeviceIds[deviceKind]}
      visible={activeDropdown === deviceKind}
      onChange={onChange}
      upwards={upwards}
    />
  );
};
