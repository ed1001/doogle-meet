import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import {
  NextApiResponseServerIo,
  CallConnection,
  SocketEvents,
  SocketIdsInMeetings,
  OfferPayload,
  IceCandidateFromClientPayload,
} from "@/types";

export const config = { api: { bodyParser: false } };

let meetings: SocketIdsInMeetings = {};
let callConnections: CallConnection[] = [];

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

  io.on(SocketEvents.CONNECTION, (socket) => {
    const { meetingId } = socket.handshake.auth;

    socket.on(SocketEvents.READY_TO_JOIN_MEETING, () => {
      socket.join(meetingId);

      const socketsInMeeting = meetings[meetingId] || [];
      meetings[meetingId] = [...socketsInMeeting, socket.id];

      socket.to(meetingId).emit(SocketEvents.PEER_JOINED_MEETING, socket.id);
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      const socketsInMeeting = meetings[meetingId] || [];
      const updatedSocketsInMeeting = socketsInMeeting.filter(
        (socketId) => socketId !== socket.id,
      );

      callConnections = callConnections.filter((cc) =>
        [cc.answerSocketId, cc.offerSocketId].includes(socket.id),
      );

      if (!updatedSocketsInMeeting.length) {
        return delete meetings[meetingId];
      }

      meetings[meetingId] = updatedSocketsInMeeting;

      socket.to(meetingId).emit(SocketEvents.CLIENT_DISCONNECTED, socket.id);
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

      callConnections.push(callConnection);
      const index = callConnections.indexOf(callConnection);

      socket
        .to(inverseSocketId)
        .emit(SocketEvents.NEW_OFFER, callConnections.at(index));
    });

    socket.on(
      SocketEvents.ANSWER,
      (callConnection: CallConnection, ackFunction) => {
        const callConnectionToUpdate = callConnections.find(
          (c) =>
            c.offerSocketId === callConnection.offerSocketId &&
            c.answerSocketId === callConnection.answerSocketId,
        );

        if (!callConnectionToUpdate) {
          throw new Error("no call connection to update");
        }

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

        const callConnection = callConnections.find((cc) => {
          const offerSocketId = initiatedOffer ? socket.id : inverseSocketId;
          const answerSocketId = initiatedOffer ? inverseSocketId : socket.id;

          return (
            offerSocketId === cc.offerSocketId &&
            answerSocketId === cc.answerSocketId
          );
        });

        if (!callConnection) {
          throw new Error("callConnection does not exist");
        }

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
