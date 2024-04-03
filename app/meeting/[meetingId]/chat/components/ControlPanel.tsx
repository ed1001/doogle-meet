import { useAppContext } from "@/context/app-context";
import { MeetingState } from "@/types";

export const ControlPanel = () => {
  const { setMeetingState } = useAppContext();

  return (
    <div className="flex-shrink-0 h-40 bg-sky-200">
      <button onClick={() => setMeetingState?.(MeetingState.LEFT)}>
        Leave meeting
      </button>
    </div>
  );
};
