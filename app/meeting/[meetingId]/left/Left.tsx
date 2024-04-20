import { useSocketContext } from "@/context/socket/socket-context";
import { MeetingState } from "@/types";

export default function Left() {
  const { setMeetingState } = useSocketContext();

  return (
    <main className="flex h-lvh flex-col">
      you left the chat
      <button onClick={() => setMeetingState?.(MeetingState.LOBBY)}>
        rejoin meeting
      </button>
    </main>
  );
}
