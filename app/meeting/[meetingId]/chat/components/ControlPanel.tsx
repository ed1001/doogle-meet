import { useSocket } from "@/providers";
import { MeetingState } from "@/types";

export const ControlPanel = () => {
  const { setMeetingState } = useSocket();

  return (
    <div className="flex-shrink-0 h-40 bg-sky-200">
      <button onClick={() => setMeetingState?.(MeetingState.LEFT)}>
        Leave meeting
      </button>
    </div>
  );
};
