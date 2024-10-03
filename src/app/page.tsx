"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Landing from "@/app/components/landing";
import RetroBoard from "@/app/components/retroBoard";
import { SOCKET_SERVER_URL } from "@/app/utils/helper";
import Section from "@/app/types/section";
import { generateMultipleSections } from "@/app/__mock__/mockUtils";
import Board from "@/app/types/board";
import User from "@/app/types/user";

export default function Home() {
  const [user, setUser] = useState<User>({ name: "", id: "" });

  const [displayName, setDisplayName] = useState<string>("");
  const [isInRoom, setIsInRoom] = useState<boolean>(false);

  const [socket, setSocket] = useState<Socket | null>(null);

  const mockSections = generateMultipleSections(4, 0);
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL);
    setUser((prevState) => ({ ...prevState, id: String(socketInstance.id) }));
    setSocket(socketInstance);

    // Listen for the 'joined_board' event to know when the user successfully joins a room
    socketInstance.on("joined_board", () => {
      setIsInRoom(true); // Change the view to RetroBoard once joined
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    setUser((prevState) => ({ ...prevState, name: displayName }));
  }, [displayName]);

  return (
    <div className="h-screen w-screen flex justify-center">
      {!isInRoom ? (
        <Landing
          setIsInRoom={setIsInRoom}
          displayName={displayName}
          setSections={setSections}
          setDisplayName={setDisplayName}
          sections={sections}
          socket={socket}
          setBoard={setBoard}
        />
      ) : (
        <RetroBoard
          user={user}
          displayName={displayName}
          setSections={setSections}
          sections={sections}
          socket={socket}
          board={board}
          setBoard={setBoard}
        />
      )}
    </div>
  );
}
