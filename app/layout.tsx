import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SocketProvider } from "@/context/socket/socket-context-provider";
import { DropdownProvider } from "@/context/dropdown/dropdown-provider";
import { MediaProvider } from "@/context/media/media-provider";
import { MeetingProvider } from "@/context/meeting/meeting-context-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doogle Meet",
  description: "Online video calls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MeetingProvider>
          <SocketProvider>
            <MediaProvider>
              <DropdownProvider>{children}</DropdownProvider>
            </MediaProvider>
          </SocketProvider>
        </MeetingProvider>
      </body>
    </html>
  );
}
