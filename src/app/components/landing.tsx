import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "@/app/utils/helper";
import Section from "@/app/types/section";

interface LandingProps {
  onConnect: (displayName: string, boardName: string) => void;
  boardCode: string;
  setBoardCode: Dispatch<SetStateAction<string>>;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
}

export default function Landing({
  onConnect,
  boardCode,
  setBoardCode,
  displayName,
  setDisplayName,
  sections,
  setSections,
}: LandingProps) {
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [boardName, setBoardName] = useState<string>("");
  const [retroCode, setRetroCode] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);

  //mocking the sections creation. TODO: Add place for users to create sections
  useEffect(() => {}, []);

  const onNameChange = (name: string) => {
    setDisplayName(name);
  };

  const onSetName = () => {
    setIsNameSet(true);
  };

  const handleJoinBoardClick = () => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    newSocket.emit("join_board", { boardCode: retroCode, displayName });
    onConnect(displayName, boardName);
  };

  const handleCreateBoardClick = () => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    newSocket.emit("create_board", { displayName, boardName, sections });
    onConnect(displayName, boardName);
    newSocket.on("board_created", (data) => {
      setBoardCode(data.boardCode);
    });
    return () => {
      socket.off("board_created");
    };
  };

  return (
    <div className={"w-[650px] flex flex-col justify-center"}>
      <p className={"w-full text-h1-lg tracking-[.6em]"}>Retrospective</p>
      <div className={"w-[80%]"}>
        {isNameSet && (
          <div className={"flex flex-col"}>
            <p className={"text-body-lg mt-[8px] tracking-widest"}>
              {displayName}
            </p>
            <button
              onClick={() => {
                setIsNameSet(false);
              }}
              className={"justify-start self-start text-small mt-[4px]"}
            >
              Change
            </button>
          </div>
        )}
        {!isNameSet && (
          <>
            <p className={"pt-[32px]"}>Enter your display name</p>
            <input
              placeholder={"Your Name"}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSetName();
                }
              }}
              className={
                "bg-[#1e1e1e] placeholder:text-[#4e4e4e] px-[8px] py-[16px] rounded w-full mt-[8px]"
              }
              onChange={(e) => {
                onNameChange(e.target.value);
              }}
              disabled={isNameSet}
            />
            <button
              className={"w-full rounded bg-green py-[16px] mt-[16px]"}
              onClick={onSetName}
            >
              Get Started
            </button>
          </>
        )}
        {isNameSet && (
          <>
            <p className={"pt-[32px] mt-[64px]"}>
              Enter your retro board&#39;s name
            </p>
            <input
              placeholder={"Your board's name"}
              className={
                "bg-[#1e1e1e] placeholder:text-[#4e4e4e] px-[8px] py-[16px] rounded-[5px] w-full mt-[8px]"
              }
              onChange={(e) => setBoardName(e.target.value)}
            />
            <button
              className={"w-full rounded-[5px] bg-green py-[16px] mt-[16px]"}
              onClick={handleCreateBoardClick}
            >
              Create a new board
            </button>
            <p className={"pt-[64px]"}>
              Enter Your Team&#39;s Unique Retro Code
            </p>
            <input
              placeholder={"Unique Retro Code"}
              className={
                "bg-[#1e1e1e] placeholder:text-[#4e4e4e] px-[8px] py-[16px] rounded-[5px] w-full mt-[8px]"
              }
              onChange={(e) => setRetroCode(e.target.value)}
            />
            <button
              className={"w-full rounded-[5px] bg-green py-[16px] mt-[16px]"}
              onClick={handleJoinBoardClick}
            >
              Join existing retro board
            </button>
          </>
        )}
      </div>
    </div>
  );
}
