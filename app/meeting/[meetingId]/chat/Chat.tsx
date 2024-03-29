"use client";

import { ControlPanel } from "./components/ControlPanel";
import VideoContainer from "./components/VideoContainer";

export default function Chat() {
  return (
    <main className="flex flex-col h-lvh">
      <VideoContainer />
      <ControlPanel />
    </main>
  );
}
