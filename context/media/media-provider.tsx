"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PeerConnectionMapping, isActiveMeetingState } from "@/types";
import { attachStreamToVideo } from "@/lib/attachStreamToVideo";
import { MediaContext } from "./media-context";
import { useMeetingContext } from "../meeting/meeting-context";

type Props = { children: ReactNode };

export const MediaProvider: React.FC<Props> = ({ children }) => {
  const { meetingState } = useMeetingContext();
  const localVidRef = useRef<HTMLVideoElement | null>(null);
  const [localVidRefSet, setLocalVidRefSet] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoBlocked, setVideoBlocked] = useState<boolean>(false);
  const [videoActive, setVideoActive] = useState<boolean>(true);
  const [micBlocked, setMicBlocked] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(true);
  const [refreshDevices, setRefreshDevices] = useState<boolean>(true);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [currentDeviceIds, setCurrentDeviceIds] = useState<{
    [key in MediaDeviceKind]: string | undefined;
  }>({
    audioinput: undefined,
    videoinput: undefined,
    audiooutput: undefined,
  });
  const [peerConnectionMappings, setPeerConnectionMappings] = useState<
    PeerConnectionMapping[]
  >([]);

  const availableDevicesByKind = useMemo(() => {
    const accumulator: { [key in MediaDeviceKind]: MediaDeviceInfo[] } = {
      audioinput: [],
      audiooutput: [],
      videoinput: [],
    };

    return availableDevices.reduce((acc, device) => {
      acc[device.kind].push(device);

      return acc;
    }, accumulator);
  }, [availableDevices]);

  const getAvailableDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    triggerRefreshDevices();
    setAvailableDevices(devices);
  }, []);

  useEffect(() => {
    navigator.mediaDevices.addEventListener(
      "devicechange",
      getAvailableDevices,
    );

    return () =>
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        getAvailableDevices,
      );
  }, [getAvailableDevices]);

  useEffect(() => {
    getAvailableDevices().catch(console.error);
  }, [localStream, videoBlocked, getAvailableDevices]);

  const triggerRefreshDevices = () => {
    setRefreshDevices((prev) => !prev);
  };

  useEffect(() => {
    setCurrentDeviceIds({
      audioinput: localStream?.getAudioTracks()[0].getSettings().deviceId,
      videoinput: localStream?.getVideoTracks()[0].getSettings().deviceId,
      audiooutput: localVidRef?.current?.sinkId || "default",
    });
  }, [localStream, localVidRefSet, refreshDevices]);

  const assignDevicesAndStreams = useCallback(
    async ({
      audioDeviceId,
      videoDeviceId,
    }: {
      audioDeviceId?: string;
      videoDeviceId?: string;
    }) => {
      if (videoBlocked) throw new Error("Video is blocked");

      const constraintsWithDefaults: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          deviceId: audioDeviceId || currentDeviceIds?.audioinput,
        },
        video: { deviceId: videoDeviceId || currentDeviceIds?.videoinput },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          constraintsWithDefaults,
        );
        const newTracks = stream.getTracks();

        setLocalStream(stream);

        if (peerConnectionMappings.length) {
          for (const { peerConnection } of peerConnectionMappings) {
            for (const sender of peerConnection.getSenders()) {
              const { track } = sender;
              if (!track) continue;

              const newTrack = newTracks.find((t) => t.kind === track.kind);
              if (!newTrack) continue;

              sender.replaceTrack(newTrack);
            }
          }
        }
      } catch (e: any) {
        if (e.name === "NotAllowedError") {
          return setVideoBlocked(true);
        }

        console.error(e);
      }
    },
    [videoBlocked, peerConnectionMappings, currentDeviceIds],
  );

  const localVidRefCallback = useCallback(
    (element: HTMLVideoElement) => {
      if (!element || !localVidRef) return;

      localVidRef.current = element;
      setLocalVidRefSet(true);
      localStream && attachStreamToVideo(localStream, element);
    },
    [localStream, localVidRef],
  );

  // clear peer connections when left meeting
  useEffect(() => {
    return () => {
      if (!peerConnectionMappings.length) return;
      if (isActiveMeetingState(meetingState)) return;

      peerConnectionMappings.forEach((pcMapping) =>
        pcMapping.peerConnection.close(),
      );

      setPeerConnectionMappings([]);
    };
  }, [meetingState, peerConnectionMappings]);

  return (
    <MediaContext.Provider
      value={{
        localStream,
        setLocalStream,
        localVidRef,
        localVidRefCallback,
        videoBlocked,
        setVideoBlocked,
        videoActive,
        setVideoActive,
        micBlocked,
        setMicBlocked,
        micActive,
        setMicActive,
        peerConnectionMappings,
        setPeerConnectionMappings,
        assignDevicesAndStreams,
        currentDeviceIds,
        triggerRefreshDevices,
        availableDevicesByKind,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
