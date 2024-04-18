"use client";

import { Dispatch, SetStateAction, createContext, useContext } from "react";

import { PeerConnectionMapping } from "@/types";

type MediaContextType = {
  localStream: MediaStream | null;
  setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
  localVidRef?: React.MutableRefObject<HTMLVideoElement | null>;
  localVidRefCallback: (element: HTMLVideoElement) => void;
  videoBlocked: boolean;
  setVideoBlocked: Dispatch<SetStateAction<boolean>>;
  videoActive: boolean;
  setVideoActive: Dispatch<SetStateAction<boolean>>;
  micBlocked: boolean;
  setMicBlocked: Dispatch<SetStateAction<boolean>>;
  micActive: boolean;
  setMicActive: Dispatch<SetStateAction<boolean>>;
  peerConnectionMappings: PeerConnectionMapping[];
  setPeerConnectionMappings: Dispatch<SetStateAction<PeerConnectionMapping[]>>;
  assignDevicesAndStreams: ({
    audioDeviceId,
    videoDeviceId,
  }: {
    audioDeviceId?: string;
    videoDeviceId?: string;
  }) => void;
  getCurrentDeviceIds: () => {
    [key in MediaDeviceKind]: string | undefined;
  };
};

export const MediaContext = createContext<MediaContextType>({
  localStream: null,
  setLocalStream: () => {},
  localVidRefCallback: (_element: HTMLVideoElement) => {},
  videoBlocked: false,
  setVideoBlocked: () => {},
  videoActive: true,
  setVideoActive: () => {},
  micBlocked: false,
  setMicBlocked: () => {},
  micActive: true,
  setMicActive: () => {},
  peerConnectionMappings: [],
  setPeerConnectionMappings: () => {},
  assignDevicesAndStreams: ({
    audioDeviceId: _adid,
    videoDeviceId: _vdid,
  }) => {},
  getCurrentDeviceIds: () => {
    return {
      audioinput: undefined,
      videoinput: undefined,
      audiooutput: undefined,
    };
  },
});

export const useMediaContext = () => useContext(MediaContext);
