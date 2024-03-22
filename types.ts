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

export type SocketIdsInMeetings = {
  [meetingId: string]: string[];
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
  CLIENT_DISCONNECTED = "clientDisconnected",
  READY_TO_JOIN_MEETING = "readyToJoinMeeting",
  PEER_JOINED_MEETING = "peerJoinedMeeting",
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
