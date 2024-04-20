"use client";

import { ControlPanel } from "./components/ControlPanel";
import VideoContainer from "./components/VideoContainer";

export default function Chat() {
  return (
    <main className="flex h-lvh flex-col">
      <VideoContainer />
      <ControlPanel />
    </main>
  );
}
