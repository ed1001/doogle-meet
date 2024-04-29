import { MeetingState } from "@/types";

import { Button } from "@/components/Button";
import { useMeetingContext } from "@/context/meeting/meeting-context";
import Link from "next/link";

export default function Left() {
  const { setMeetingState } = useMeetingContext();

  return (
    <main className="flex h-lvh flex-col items-center justify-center gap-7">
      <h1 className="text-4xl">You left the meeting</h1>
      <div className="flex gap-3">
        <Button
          outline
          text="Rejoin meeting"
          onClick={() => setMeetingState?.(MeetingState.LOBBY)}
        ></Button>
        <Link href="/">
          <Button text="Return to homescreen"></Button>
        </Link>
      </div>
    </main>
  );
}
