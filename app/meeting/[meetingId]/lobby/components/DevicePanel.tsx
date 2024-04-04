import { useEffect, useMemo, useState } from "react";

import { useAppContext } from "@/context/app-context";

import { DeviceSelect } from "./DeviceSelect";

export const DevicePanel = () => {
  const { localStream, videoBlocked } = useAppContext();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const devicesByKind = useMemo(() => {
    const accumulator: { [key in MediaDeviceKind]: MediaDeviceInfo[] } = {
      audioinput: [],
      audiooutput: [],
      videoinput: [],
    };

    return devices.reduce((acc, device) => {
      acc[device.kind].push(device);

      return acc;
    }, accumulator);
  }, [devices]);

  const getDevices = async () => {
    //TODO: check current device is connected, if not connect to next available
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices);
  };

  useEffect(() => {
    navigator.mediaDevices.addEventListener("devicechange", getDevices);

    return () =>
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
  }, []);

  useEffect(() => {
    getDevices().catch(console.error);
  }, [localStream, videoBlocked]);

  return (
    <div className="flex justify-start" onClick={getDevices}>
      <DeviceSelect
        deviceKind="audioinput"
        devices={devicesByKind["audioinput"]}
      />
      <DeviceSelect
        deviceKind="audiooutput"
        devices={devicesByKind["audiooutput"]}
      />
      <DeviceSelect
        deviceKind="videoinput"
        devices={devicesByKind["videoinput"]}
      />
    </div>
  );
};