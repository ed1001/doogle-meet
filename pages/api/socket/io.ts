import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import {
  NextApiResponseServerIo,
  CallConnection,
  SocketEvents,
  OfferPayload,
  IceCandidateFromClientPayload,
  MeetingState,
  RoomType,
} from "@/types";

export const config = { api: { bodyParser: false } };

let callConnections: { [meetingId: string]: CallConnection[] } = {};

const getRoomId = (roomType: RoomType, meetingId: string) =>
  `${roomType}:${meetingId}`;

const ioHandler = (_req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (res.socket.server.io) {
    res
      .status(200)
      .json({ success: true, message: "Socket is already running" });
    return;
  }

  const path = "/api/socket/io";
  const httpServer = res.socket.server as any;
  const io = new ServerIO(httpServer, { path, addTrailingSlash: false });

  const reportParticipantCount = (roomId: string, socketId: string) => {
    const socket = io.sockets.sockets.get(socketId);

    if (!socket) throw new Error("socket does not exist");

    const { meetingId } = socket.handshake.auth || {};
    const lobbyId = getRoomId("lobby", meetingId);
    const chatRoomId = getRoomId("chat", meetingId);

    if (![lobbyId, chatRoomId].includes(roomId)) return;

    const participantCount = io.sockets.adapter.rooms.get(chatRoomId)?.size;
    io.to(lobbyId).emit(SocketEvents.PARTICIPANT_COUNT, participantCount);
  };

  io.of("/").adapter.on("join-room", reportParticipantCount);
  io.of("/").adapter.on("leave-room", reportParticipantCount);

  io.on(SocketEvents.CONNECTION, (socket) => {
    const { meetingId } = socket.handshake.auth;
    const lobbyId = getRoomId("lobby", meetingId);
    const chatRoomId = getRoomId("chat", meetingId);

    socket.on(SocketEvents.MEETING_STATE, (meetingState: MeetingState) => {
      switch (meetingState) {
        case MeetingState.LOBBY:
          socket.leave(chatRoomId);
          socket.join(lobbyId);
          return;
        case MeetingState.CHAT:
          socket.leave(lobbyId);
          return;
        case MeetingState.LEFT:
          socket.leave(chatRoomId);
          socket.leave(lobbyId);
          return;
        default:
          const exhaustiveCheck: never = meetingState;
          throw new Error(exhaustiveCheck);
      }
    });

    socket.on(SocketEvents.PEER_READY_FOR_OFFERS, () => {
      socket.join(chatRoomId);
      socket.to(chatRoomId).emit(SocketEvents.SEND_PEER_OFFERS, socket.id);
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      callConnections[meetingId] = callConnections[meetingId]?.filter((cc) =>
        [cc.answerSocketId, cc.offerSocketId].includes(socket.id),
      );

      socket.to(chatRoomId).emit(SocketEvents.CLIENT_LEFT, socket.id);
    });

    socket.on(SocketEvents.OFFER, (offerPayload: OfferPayload) => {
      const { inverseSocketId, offer } = offerPayload;

      const callConnection: CallConnection = {
        offerSocketId: socket.id,
        offer,
        offerIceCandidates: [],
        answerIceCandidates: [],
        answerSocketId: inverseSocketId,
      };

      if (!callConnections[meetingId]) {
        callConnections[meetingId] = [];
      }

      callConnections[meetingId].push(callConnection);
      const index = callConnections[meetingId].indexOf(callConnection);

      socket
        .to(inverseSocketId)
        .emit(SocketEvents.NEW_OFFER, callConnections[meetingId].at(index));
    });

    socket.on(
      SocketEvents.ANSWER,
      (callConnection: CallConnection, ackFunction) => {
        const callConnectionToUpdate = callConnections[meetingId]?.find(
          (c) =>
            c.offerSocketId === callConnection.offerSocketId &&
            c.answerSocketId === callConnection.answerSocketId,
        );

        if (!callConnectionToUpdate)
          throw new Error("no call connection to update");

        ackFunction(callConnectionToUpdate.offerIceCandidates);
        callConnectionToUpdate.answer = callConnection.answer;

        socket
          .to(callConnection.offerSocketId)
          .emit(SocketEvents.ANSWER_RESPONSE, callConnectionToUpdate);
      },
    );

    socket.on(
      SocketEvents.ICE_CANDIDATE_FROM_CLIENT,
      (iceCandidatePayload: IceCandidateFromClientPayload) => {
        const { initiatedOffer, inverseSocketId, iceCandidate } =
          iceCandidatePayload;

        const callConnection = callConnections[meetingId]?.find((cc) => {
          const offerSocketId = initiatedOffer ? socket.id : inverseSocketId;
          const answerSocketId = initiatedOffer ? inverseSocketId : socket.id;

          return (
            offerSocketId === cc.offerSocketId &&
            answerSocketId === cc.answerSocketId
          );
        });

        if (!callConnection) throw new Error("callConnection does not exist");

        const { offerIceCandidates, answerIceCandidates } = callConnection;

        const candidatesToAddTo = initiatedOffer
          ? offerIceCandidates
          : answerIceCandidates;

        candidatesToAddTo.push(iceCandidate);

        socket
          .to(inverseSocketId)
          .emit(SocketEvents.ICE_CANDIDATE_FROM_SERVER, {
            iceCandidate,
            inverseSocketId: socket.id,
          });
      },
    );
  });

  res.status(200).json({
    success: true,
    message: "Socket connected",
  });
};

export default ioHandler;
