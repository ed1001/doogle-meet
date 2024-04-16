"use client";

import { Button } from "@/components/Button";
import { Navbar } from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";

export default function Home() {
  const router = useRouter();

  const createMeeting = () => {
    const meetingId = uuid();
    router.push(`/meeting/${meetingId}`);
  };

  return (
    <main className="flex items-center justify-center min-h-lvh mx-12">
      <Navbar />
      <div className="flex flex-col">
        <h1 className="text-4xl mb-2">Video calls and meetings for all</h1>
        <h2 className="text-lg mb-2">
          Doogle meet provides easy to use video calls and meetings for all.
        </h2>
        <Button onClick={createMeeting} text="New meeting" />
      </div>
    </main>
  );
}
