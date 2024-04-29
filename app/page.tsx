"use client";

import { useEffect } from "react";

import { Button } from "@/components/Button";
import { NAVBAR_HEIGHT, Navbar } from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useMeetingContext } from "@/context/meeting/meeting-context";
import { MeetingState } from "@/types";

export default function Home() {
  const router = useRouter();
  const { setMeetingState } = useMeetingContext();

  const createMeeting = () => {
    const meetingId = uuid();
    router.push(`/meeting/${meetingId}`);
  };

  useEffect(() => {
    setMeetingState(MeetingState.LOBBY);
  }, [setMeetingState]);

  return (
    <main
      className={`mx-12 flex min-h-lvh items-center justify-center mt-${NAVBAR_HEIGHT}`}
    >
      <Navbar />
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl text-white">
          Video calls and meetings for all
        </h1>
        <h2 className="text-lg text-lowlight">
          Doogle Meet provides easy to use video calls and meetings for all.
        </h2>
        <Button onClick={createMeeting} text="New meeting" />
      </div>
    </main>
  );
}
