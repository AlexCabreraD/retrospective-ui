"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Landing from "@/app/components/landing";
import RetroBoard from "@/app/components/retroBoard";
import {
  profileIconColors,
  randomInteger,
  SOCKET_SERVER_URL,
} from "@/app/utils/helper";
import Section from "@/app/types/section";
import Board from "@/app/types/board";
import User from "@/app/types/user";

export default function Home() {
  const userColor = profileIconColors[randomInteger(0, 19)];
  const [user, setUser] = useState<User>({
    name: "",
    id: "",
    role: "",
    color: userColor,
  });
  const [displayName, setDisplayName] = useState<string>("");
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    setSocket(socketInstance);

    const handleJoinedBoard = (data: { board: Board; user: User }) => {
      console.log(`${user} joined the board`);
      setBoard(data.board);
      setSections(data.board.sections);
      setUser({ ...data.user, color: user.color });
      setIsInRoom(true);
    };

    const handleLeftBoard = () => {
      console.log("User left the board");
      setIsInRoom(false);
      setBoard(null);
    };

    socketInstance.on("joined_board", (data: { board: Board; user: User }) =>
      handleJoinedBoard(data),
    );
    socketInstance.on("left_board", handleLeftBoard);

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
          user={user}
          setUser={setUser}
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
