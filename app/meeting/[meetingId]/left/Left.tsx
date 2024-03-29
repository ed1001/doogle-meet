import { useSocket } from "@/providers";
import { MeetingState } from "@/types";

export default function Left() {
  const { setMeetingState } = useSocket();

  return (
    <main className="flex flex-col h-lvh">
      you left the chat
      <button onClick={() => setMeetingState?.(MeetingState.LOBBY)}>
        rejoin meeting
      </button>
    </main>
  );
}
