"use client";

import { ReactNode, useCallback, useRef, useState } from "react";

import { PeerConnectionMapping } from "@/types";
import { attachStreamToVideo } from "@/lib/attachStreamToVideo";
import { MediaContext } from "./media-context";

type Props = { children: ReactNode };

export const MediaProvider: React.FC<Props> = ({ children }) => {
  const localVidRef = useRef<HTMLVideoElement | null>(null);
  const [localVidRefSet, setLocalVidRefSet] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoBlocked, setVideoBlocked] = useState<boolean>(false);
  const [videoActive, setVideoActive] = useState<boolean>(true);
  const [micBlocked, setMicBlocked] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(true);
  const [peerConnectionMappings, setPeerConnectionMappings] = useState<
    PeerConnectionMapping[]
  >([]);

  const getCurrentDeviceIds = useCallback(() => {
    return {
      audioinput: localStream?.getAudioTracks()[0].getSettings().deviceId,
      videoinput: localStream?.getVideoTracks()[0].getSettings().deviceId,
      audiooutput: localVidRef?.current?.sinkId || "default",
    };
  }, [localStream, localVidRefSet]);

  const assignDevicesAndStreams = useCallback(
    async ({
      audioDeviceId,
      videoDeviceId,
    }: {
      audioDeviceId?: string;
      videoDeviceId?: string;
    }) => {
      if (videoBlocked) throw new Error("Video is blocked");

      const currentDeviceIds = getCurrentDeviceIds();
      const constraintsWithDefaults: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          deviceId: audioDeviceId || currentDeviceIds.audioinput,
        },
        video: { deviceId: videoDeviceId || currentDeviceIds.videoinput },
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
    [videoBlocked, peerConnectionMappings, getCurrentDeviceIds],
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
        getCurrentDeviceIds,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
