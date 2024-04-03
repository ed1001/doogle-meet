import { useAppContext } from "@/context/app-context";
import { MeetingState } from "@/types";

export default function Left() {
  const { setMeetingState } = useAppContext();

  return (
    <main className="flex flex-col h-lvh">
      you left the chat
      <button onClick={() => setMeetingState?.(MeetingState.LOBBY)}>
        rejoin meeting
      </button>
    </main>
  );
}
