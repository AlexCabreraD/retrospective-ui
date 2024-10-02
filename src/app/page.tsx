"use client";

import { useState } from "react";
import { io } from "socket.io-client";
import Landing from "@/app/components/landing";
import RetroBoard from "@/app/components/retroBoard";
import { SOCKET_SERVER_URL } from "@/app/utils/helper";
import Section from "@/app/types/section";
import { generateMultipleSections } from "@/app/__mock__/mockUtils";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [displayName, setDisplayName] = useState<string>("");
  const [boardName, setBoardName] = useState<string>("");
  const [boardCode, setBoardCode] = useState("");

  const [socket, setSocket] = useState<any>(null);

  const mockSections = generateMultipleSections(4, 5);

  const [sections, setSections] = useState<Section[]>(mockSections);

  const handleConnect = (name: string, board: string) => {
    console.log(name, board);
    setDisplayName(name);
    setBoardName(board);

    const socketInstance = io(SOCKET_SERVER_URL);
    setSocket(socketInstance);

    if (board) {
      setBoardName(board);
      setIsConnected(true);
      socketInstance.io;
    } else {
      socketInstance.on("boardName", (newBoardName: string) => {
        setBoardName(newBoardName);
        setIsConnected(true);
      });
    }

    return () => {
      socketInstance.disconnect();
    };
  };

  return (
    <div className={"h-screen w-screen flex justify-center"}>
      {!isConnected ? (
        <Landing
          onConnect={handleConnect}
          boardCode={boardCode}
          setBoardCode={setBoardCode}
          displayName={displayName}
          setDisplayName={setDisplayName}
          sections={sections}
          setSections={setSections}
        />
      ) : (
        <RetroBoard
          displayName={displayName}
          boardName={boardName}
          boardCode={boardCode}
          setSections={setSections}
          sections={sections}
          socket={socket}
        />
      )}
    </div>
  );
}
