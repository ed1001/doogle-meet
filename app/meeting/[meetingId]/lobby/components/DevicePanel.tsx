import { useMediaContext } from "@/context/media/media-context";
import { DeviceSelect } from "./DeviceSelect";

export const DevicePanel = () => {
  const { availableDevicesByKind } = useMediaContext();

  return (
    <div className="flex justify-start gap-2 pt-4">
      <DeviceSelect
        deviceKind="audioinput"
        devices={availableDevicesByKind["audioinput"]}
      />
      <DeviceSelect
        deviceKind="audiooutput"
        devices={availableDevicesByKind["audiooutput"]}
      />
      <DeviceSelect
        deviceKind="videoinput"
        devices={availableDevicesByKind["videoinput"]}
      />
    </div>
  );
};
