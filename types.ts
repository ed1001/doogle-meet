import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type CallConnection = {
  offerSocketId: string;
  offer: RTCSessionDescriptionInit;
  offerIceCandidates: RTCIceCandidate[];
  answerSocketId: string;
  answer?: RTCSessionDescriptionInit;
  answerIceCandidates: RTCIceCandidate[];
};

export type OfferPayload = {
  offer: RTCSessionDescriptionInit;
  inverseSocketId: string;
};

export type IceCandidateBasePayload = {
  iceCandidate: RTCIceCandidate;
  inverseSocketId: string;
};

export type IceCandidateFromServerPayload = IceCandidateBasePayload;

export type IceCandidateFromClientPayload = IceCandidateBasePayload & {
  initiatedOffer: boolean;
};

export enum SocketEvents {
  CONNECTION = "connection",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  PARTICIPANT_COUNT = "participantCount",
  CLIENT_LEFT = "clientLeft",
  MEETING_STATE = "meetingState",
  PEER_READY_FOR_OFFERS = "peerReadyForOffers",
  SEND_PEER_OFFERS = "sendPeerOffers",
  OFFER = "offer",
  ANSWER = "answer",
  NEW_OFFER = "newOffer",
  ANSWER_RESPONSE = "answerResponse",
  ICE_CANDIDATE_FROM_CLIENT = "iceCandidateFromClient",
  ICE_CANDIDATE_FROM_SERVER = "iceCandidateFromServer",
}

export type PeerConnectionMapping = {
  peerConnection: RTCPeerConnection;
  inverseSocketId: string;
  remoteStream: MediaStream;
};

export enum MeetingState {
  LOBBY = "lobby",
  CHAT = "chat",
  LEFT = "left",
}

export type RoomType = "lobby" | "chat";
export type Size = "sm" | "lg";

export type DropdownOption = { value: string; label: string; key: string };
export type DropdownName = MediaDeviceKind;
