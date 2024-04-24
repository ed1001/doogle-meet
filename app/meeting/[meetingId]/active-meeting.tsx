import { useSocketContext } from "@/context/socket/socket-context";
import { ActiveMeetingState, MeetingState } from "@/types";

import Chat from "./chat/Chat";
import Lobby from "./lobby/Lobby";

type Props = {
  activeMeetingState: ActiveMeetingState;
};

export const ActiveMeeting: React.FC<Props> = ({
  activeMeetingState,
}: {
  activeMeetingState: ActiveMeetingState;
}) => {
  useSocketContext();

  switch (activeMeetingState) {
    case MeetingState.LOBBY:
      return <Lobby />;
    case MeetingState.CHAT:
      return <Chat />;
    default:
      const exhaustiveCheck: never = activeMeetingState;
      throw new Error(exhaustiveCheck);
  }
};
