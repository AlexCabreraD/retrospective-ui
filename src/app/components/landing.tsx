import { Dispatch, SetStateAction, useState } from "react";
import Section from "@/app/types/section";
import Board from "@/app/types/board";
import { Socket } from "socket.io-client";
import User from "@/app/types/user";

interface LandingProps {
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
  socket: Socket | null;
  setBoard: Dispatch<SetStateAction<Board | null>>;
  setIsInRoom: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<User>>;
  user: User;
}

export default function Landing({
  displayName,
  setDisplayName,
  setSections,
  socket,
  setBoard,
  setIsInRoom,
  setUser,
  user,
}: LandingProps) {
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [boardName, setBoardName] = useState<string>("");
  const [retroCode, setRetroCode] = useState<string>("");
  const [isCreatingBoard, setIsCreatingBoard] = useState<boolean>(false);
  const [customSections, setCustomSections] = useState<string[]>([
    "Good",
    "Bad",
    "Meh",
    "Action Items",
  ]);

  const onNameChange = (name: string) => {
    setDisplayName(name);
  };

  const onSetName = () => {
    setIsNameSet(true);
  };

  const handleJoinBoardClick = () => {
    setBoardName("joining...");
    socket?.emit("join_board", {
      boardCode: retroCode,
      displayName,
      bgColor: user.color,
    });

    socket?.on("joined_board", (data: { board: Board }) => {
      console.log("Joined board data:", data);
      setBoard(data.board);
      setIsInRoom(true);
    });

    return () => {
      socket?.off("joined_board");
    };
  };

  const handleCreateBoardClick = () => {
    setIsCreatingBoard(true);
  };

  const handleSectionChange = (index: number, title: string) => {
    const updatedSections = [...customSections];
    updatedSections[index] = title;
    setCustomSections(updatedSections);
  };

  const handleSubmitSections = () => {
    const sections = customSections.map((title, index) => ({
      id: index + 1,
      title,
      posts: [],
    }));

    setSections(sections);

    socket?.emit("create_board", {
      displayName,
      boardName,
      sections,
      bgColor: user.color,
    });

    socket?.on("board_created", (data: { board: Board; user: User }) => {
      console.log("Created board:", data);
      setBoard(data.board);
      setUser({ ...data.user, color: user.color });
      setIsInRoom(true);
    });

    return () => {
      socket?.off("board_created");
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
              onClick={() => setIsNameSet(false)}
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
              value={displayName}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSetName();
                }
              }}
              className={
                "bg-[#1e1e1e] placeholder:text-[#4e4e4e] px-[8px] py-[16px] rounded w-full mt-[8px]"
              }
              onChange={(e) => onNameChange(e.target.value)}
              disabled={isNameSet}
              maxLength={15}
            />
            <button
              className={
                "w-full rounded bg-green py-[16px] mt-[16px] disabled:bg-[#4e4e4e]"
              }
              onClick={onSetName}
              disabled={displayName.length < 2}
            >
              Get Started
            </button>
          </>
        )}

        {isNameSet && !isCreatingBoard && (
          <>
            <p className={"pt-[32px] mt-[64px]"}>
              Enter your retro board&#39;s name
            </p>
            <input
              placeholder={"Your board's name"}
              className={
                "bg-[#1e1e1e] placeholder:text-[#4e4e4e] px-[8px] py-[16px] rounded-[5px] w-full mt-[8px]"
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCreateBoardClick();
                }
              }}
              onChange={(e) => setBoardName(e.target.value)}
              maxLength={50}
            />
            <button
              className={
                "w-full rounded-[5px] bg-green py-[16px] mt-[16px] disabled:bg-[#4e4e4e]"
              }
              disabled={boardName.length < 3}
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
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleJoinBoardClick();
                }
              }}
              onChange={(e) => setRetroCode(e.target.value)}
              maxLength={5}
            />
            <button
              className={
                "w-full rounded-[5px] bg-green py-[16px] mt-[16px] disabled:bg-[#4e4e4e]"
              }
              onClick={handleJoinBoardClick}
              disabled={retroCode.length != 5}
            >
              Join existing retro board
            </button>
          </>
        )}

        {isCreatingBoard && (
          <>
            <p className={"mt-[32px]"}>Customize your sections</p>
            {customSections.map((section, index) => (
              <input
                key={index}
                value={section}
                placeholder={`Section ${index + 1}`}
                className={
                  "bg-[#1e1e1e] placeholder:text-[#4e4e4e] px-[8px] py-[16px] rounded-[5px] w-full mt-[16px]"
                }
                onChange={(e) => handleSectionChange(index, e.target.value)}
                maxLength={17}
              />
            ))}
            <button
              className={"w-full rounded bg-green py-[16px] mt-[32px]"}
              onClick={handleSubmitSections}
            >
              Create board with sections
            </button>
          </>
        )}
      </div>
    </div>
  );
}
