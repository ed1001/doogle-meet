"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

import { AppContext } from "./app-context";
import { MeetingState, PeerConnectionMapping, SocketEvents } from "@/types";
import { attachStreamToVideo } from "@/lib/attachStreamToVideo";

type Props = { children: ReactNode };

export const AppProvider: React.FC<Props> = ({ children }) => {
  const params = useParams<{ meetingId: string }>();
  const { meetingId } = params || {};
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVidRef = useRef<HTMLVideoElement | null>(null);
  const [videoBlocked, setVideoBlocked] = useState<boolean>(false);
  const [videoActive, setVideoActive] = useState<boolean>(true);
  const [micBlocked, setMicBlocked] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [peerConnectionMappings, setPeerConnectionMappings] = useState<
    PeerConnectionMapping[]
  >([]);
  const [meetingState, setMeetingState] = useState<MeetingState>(
    MeetingState.LOBBY,
  );

  const getCurrentInputDeviceIds = useCallback(() => {
    return {
      audioinput: localStream?.getAudioTracks()[0].getSettings().deviceId,
      videoinput: localStream?.getVideoTracks()[0].getSettings().deviceId,
    };
  }, [localStream]);

  const assignDevicesAndStreams = useCallback(
    async ({
      audioDeviceId,
      videoDeviceId,
    }: {
      audioDeviceId?: string;
      videoDeviceId?: string;
    }) => {
      if (videoBlocked) throw new Error("Video is blocked");

      const currentDeviceIds = getCurrentInputDeviceIds();

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
    [videoBlocked, peerConnectionMappings, getCurrentInputDeviceIds],
  );

  const localVidRefCallback = useCallback(
    (element: HTMLVideoElement) => {
      if (!element || !localVidRef) return;

      localVidRef.current = element;
      localStream && attachStreamToVideo(localStream, element);
    },
    [localStream, localVidRef],
  );

  useEffect(() => {
    if (!meetingId) {
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      auth: { meetingId },
    });

    socketInstance.on(SocketEvents.CONNECT, () => {
      setIsConnected(true);
    });

    socketInstance.on(SocketEvents.DISCONNECT, () => {
      setIsConnected(false);
    });

    socketInstance.on(SocketEvents.PARTICIPANT_COUNT, setParticipantCount);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [meetingId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(SocketEvents.MEETING_STATE, meetingState);
  }, [meetingState, socket]);

  return (
    <AppContext.Provider
      value={{
        socket,
        isConnected,
        meetingState,
        setMeetingState,
        participantCount,
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
        getCurrentInputDeviceIds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
