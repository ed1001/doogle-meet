"use client";

import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Socket } from "socket.io-client";

import { MeetingState, PeerConnectionMapping } from "@/types";

type AppContextType = {
  socket?: Socket;
  isConnected: boolean;
  setMeetingState: Dispatch<SetStateAction<MeetingState>>;
  meetingState: MeetingState;
  participantCount: number;
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
  getCurrentInputDeviceIds: () => {
    [key in Exclude<MediaDeviceKind, "audiooutput">]: string | undefined;
  };
};

export const AppContext = createContext<AppContextType>({
  isConnected: false,
  meetingState: MeetingState.LOBBY,
  setMeetingState: () => {},
  participantCount: 0,
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
  getCurrentInputDeviceIds: () => {
    return {
      audioinput: undefined,
      videoinput: undefined,
    };
  },
});

export const useAppContext = () => useContext(AppContext);
