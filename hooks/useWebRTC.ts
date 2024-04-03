import { useCallback, useEffect, useRef } from "react";

import {
  CallConnection,
  IceCandidateFromClientPayload,
  IceCandidateFromServerPayload,
  OfferPayload,
  PeerConnectionMapping,
  SocketEvents,
} from "@/types";
import { useAppContext } from "@/context/app-context";

export const peerConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ],
};

export const useWebRTC = () => {
  const socketInitiated = useRef<boolean>(false);
  const {
    socket,
    localStream,
    peerConnectionMappings,
    setPeerConnectionMappings,
  } = useAppContext();

  const createPeerConnection = useCallback(
    async (inverseSocketId: string, initiatedOffer: boolean) => {
      if (!socket) throw Error("No socket");

      const peerConnection = new RTCPeerConnection(peerConfiguration);
      const remoteStream = new MediaStream();

      if (localStream) {
        for (const track of localStream.getTracks()) {
          peerConnection.addTrack(track, localStream);
        }
      }

      peerConnection.addEventListener("icecandidate", (e) => {
        if (!e.candidate) return;

        const payload: IceCandidateFromClientPayload = {
          iceCandidate: e.candidate,
          inverseSocketId,
          initiatedOffer,
        };

        socket.emit(SocketEvents.ICE_CANDIDATE_FROM_CLIENT, payload);
      });

      peerConnection.addEventListener("track", (e) => {
        for (const track of e.streams[0].getTracks()) {
          remoteStream.addTrack(track);
        }
      });

      return { peerConnection, remoteStream };
    },
    [socket, localStream],
  );

  const createOffer = useCallback(
    async (inverseSocketId: string) => {
      if (!socket) throw new Error("No socket");

      const { peerConnection, remoteStream } = await createPeerConnection(
        inverseSocketId,
        true,
      );

      const pcMapping: PeerConnectionMapping = {
        peerConnection,
        inverseSocketId,
        remoteStream,
      };

      setPeerConnectionMappings([...peerConnectionMappings, pcMapping]);

      const offer: RTCSessionDescriptionInit =
        await peerConnection.createOffer();

      peerConnection.setLocalDescription(offer);
      const offerPayload: OfferPayload = { offer, inverseSocketId };
      socket.emit(SocketEvents.OFFER, offerPayload);
    },
    [
      socket,
      createPeerConnection,
      peerConnectionMappings,
      setPeerConnectionMappings,
    ],
  );

  const answerOffer = useCallback(
    async (callConnection: CallConnection) => {
      if (!socket) throw new Error("socket does not exist");

      const { peerConnection, remoteStream } = await createPeerConnection(
        callConnection.offerSocketId,
        false,
      );

      await peerConnection.setRemoteDescription(callConnection.offer);

      const pcMapping: PeerConnectionMapping = {
        peerConnection,
        inverseSocketId: callConnection.offerSocketId,
        remoteStream,
      };

      setPeerConnectionMappings((prev) => [...prev, pcMapping]);
      const answer = await peerConnection.createAnswer({});
      await peerConnection.setLocalDescription(answer);
      callConnection.answer = answer;

      const offerIceCandidates = await socket.emitWithAck(
        SocketEvents.ANSWER,
        callConnection,
      );

      for (const iceCandidate of offerIceCandidates) {
        peerConnection.addIceCandidate(iceCandidate);
      }
    },
    [createPeerConnection, socket, setPeerConnectionMappings],
  );

  const addAnswer = useCallback(
    async (call: CallConnection) => {
      const pcMapping = peerConnectionMappings.find(
        (pc) => pc.inverseSocketId === call.answerSocketId,
      );

      if (!pcMapping || !call.answer) return;

      await pcMapping.peerConnection.setRemoteDescription(call.answer);
    },
    [peerConnectionMappings],
  );

  const addIceCandidate = useCallback(
    ({ iceCandidate, inverseSocketId }: IceCandidateFromServerPayload) => {
      const pcMapping = peerConnectionMappings.find(
        (pc) => pc.inverseSocketId === inverseSocketId,
      );

      if (!pcMapping) {
        throw new Error(
          "could not find peer connection while adding ice candidates",
        );
      }

      pcMapping.peerConnection.addIceCandidate(iceCandidate);
    },
    [peerConnectionMappings],
  );

  const removePeer = useCallback(
    (inverseSocketId: string) => {
      setPeerConnectionMappings((prev) =>
        prev.filter(
          (pcMapping) => pcMapping.inverseSocketId !== inverseSocketId,
        ),
      );
    },
    [setPeerConnectionMappings],
  );

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvents.SEND_PEER_OFFERS, createOffer);
    socket.on(SocketEvents.NEW_OFFER, answerOffer);
    socket.on(SocketEvents.ANSWER_RESPONSE, addAnswer);
    socket.on(SocketEvents.ICE_CANDIDATE_FROM_SERVER, addIceCandidate);
    socket.on(SocketEvents.CLIENT_LEFT, removePeer);

    if (!socketInitiated.current) {
      socket.emit(SocketEvents.PEER_READY_FOR_OFFERS);
      socketInitiated.current = true;
    }

    return () => {
      socket.off(SocketEvents.SEND_PEER_OFFERS, createOffer);
      socket.off(SocketEvents.NEW_OFFER, answerOffer);
      socket.off(SocketEvents.ANSWER_RESPONSE, addAnswer);
      socket.off(SocketEvents.ICE_CANDIDATE_FROM_SERVER, addIceCandidate);
      socket.off(SocketEvents.CLIENT_LEFT, removePeer);
    };
  }, [
    socket,
    createOffer,
    addAnswer,
    answerOffer,
    addIceCandidate,
    removePeer,
    setPeerConnectionMappings,
  ]);

  return { peerConnectionMappings };
};
