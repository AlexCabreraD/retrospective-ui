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
  const [user, setUser] = useState<User>({ name: "", id: "", role: "" });
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

    const handleJoinedBoard = () => {
      console.log("User joined the board");
      setIsInRoom(true);
    };

    const handleLeftBoard = () => {
      console.log("User left the board");
      setIsInRoom(false);
      setBoard(null);
      setUser((prevState) => ({ ...prevState, role: "" }));
    };

    socketInstance.on("joined_board", handleJoinedBoard);
    socketInstance.on("left_board", handleLeftBoard);

    // Cleanup function
    return () => {
      socketInstance.off("joined_board", handleJoinedBoard);
      socketInstance.off("left_board", handleLeftBoard);
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    setUser((prevState) => ({ ...prevState, name: displayName }));
  }, [displayName]);

  const leaveBoard = () => {
    if (socket) {
      socket.emit("leave_board", { boardCode: board?.boardCode });
    }
    setIsInRoom(false);
    setBoard(null);
  };

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
          leaveBoard={leaveBoard}
        />
      )}
    </div>
  );
}
