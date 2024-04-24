import { useMeetingContext } from "@/context/meeting/meeting-context";
import { MeetingState } from "@/types";

export default function Left() {
  const { setMeetingState } = useMeetingContext();

  return (
    <main className="flex h-lvh flex-col">
      you left the chat
      <button onClick={() => setMeetingState?.(MeetingState.LOBBY)}>
        rejoin meeting
      </button>
    </main>
  );
}
