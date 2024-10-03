import Card from "@/app/components/card";
import CommentModal from "@/app/components/commentModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import post from "@/app/types/post";
import { Tooltip } from "@/app/components/tooltip";
import { Snackbar } from "@/app/components/snackbar";
import NewPostInput from "@/app/components/newPostInput";
import Post from "@/app/types/post";
import Section from "@/app/types/section";
import Board from "@/app/types/board";
import AddPostResponse from "@/app/types/addPostResponse";
import { Socket } from "socket.io-client";
import User from "@/app/types/user";

interface RetroBoardProps {
  user: User;
  displayName: string;
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
  socket: Socket | null;
  board: Board | null;
  setBoard: Dispatch<SetStateAction<Board | null>>;
}

export default function RetroBoard({
  user,
  socket,
  sections,
  setSections,
  board,
  setBoard,
}: RetroBoardProps) {
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<post | null>(null);

  useEffect(() => {
    const handleJoinedBoard = (data: { board: Board }) => {
      console.log("Joined board data:", data.board);
      setBoard(data.board);
      setSections(data.board.sections);
    };

    const handlePostAdded = ({
      sectionId,
      post,
    }: {
      sectionId: number;
      post: Post;
    }) => {
      if (board?.sections.some((section) => section.id === sectionId)) {
        console.log("Post added to section", sectionId, post);
        setSections((prevSections) =>
          prevSections.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                posts: [...section.posts, post],
              };
            }
            return section;
          }),
        );
      } else {
        console.log("didnt find section");
      }
    };

    socket?.on("joined_board", (data: { board: Board }) =>
      handleJoinedBoard(data),
    );
    socket?.on("post_added", handlePostAdded);

    return () => {
      socket?.off("joined_board", handleJoinedBoard);
      socket?.off("post_added", handlePostAdded);
    };
  }, [setSections, socket, setBoard, board]);

  const onCopyClick = () => {
    navigator.clipboard
      .writeText(board?.boardCode || "")
      .then(() => {
        setShowSnack(true);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleNewPost = async (text: string, sectionId: number) => {
    const newPost: Post = {
      id: Date.now(),
      user: { id: user.id, name: user.name },
      text,
      likeCount: 0,
      comments: [],
    };

    socket?.emit(
      "add_post",
      { boardCode: board?.boardCode, sectionId: sectionId, post: newPost },
      (response: AddPostResponse) => {
        if (response.error) {
          console.error("Error adding post:", response.error);
        } else {
          console.log("successful post");
        }
      },
    );
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:flex-row lg:justify-center lg:items-start">
      <Snackbar
        visible={showSnack}
        text={"Copied Retro Board Code"}
        status={"success"}
        onOpen={() => {}}
        onClose={() => setShowSnack(false)}
      />

      <div className="flex flex-col bg-black text-white w-full lg:w-[80%] max-w-[1720px] h-full py-6 lg:py-16 mx-auto min-w-full lg:min-w-[1250px]">
        <div className="flex flex-col lg:flex-row lg:items-center mb-[8px]">
          <h1 className="text-2xl lg:text-3xl font-bold">{board?.boardName}</h1>
          <Tooltip text={"Copy"} position={"end"}>
            <span
              className="bg-[#1e1e1e] py-1 px-4 rounded cursor-pointer ml-[8px]"
              onClick={onCopyClick}
            >
              {board?.boardCode}
            </span>
          </Tooltip>
        </div>

        <div className="flex flex-col sm:flex-row  mb-[8px]">
          <button className="mt-2 sm:mt-0 border-[2px] hover:bg-green px-4 py-1 rounded-lg">
            Start Vote
          </button>
          <button className="mt-2 sm:mt-0 sm:ml-2 border-[2px] hover:bg-red-600 px-4 py-1 rounded-lg">
            Leave
          </button>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full h-full"
          id={"cards"}
        >
          {sections?.map((section) => (
            <div key={section.id} className="p-4 bg-[#1e1e1e] rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-h3-lg font-semibold text-[#858585]">
                  {section.title}
                </h2>
                <div className="rounded-lg border-[2px] border-[#353535] w-10 h-10 flex justify-center items-center">
                  <p>{section.posts.length}</p>
                </div>
              </div>
              <NewPostInput onPost={handleNewPost} sectionId={section.id} />
              <hr className="h-px bg-[#292929] border-0 mb-6" />
              {section.posts
                .slice() // Create a shallow copy of the array to avoid mutating the original array
                .sort((a, b) => b.id - a.id) // Sort in descending order (newest first)
                .map((post) => (
                  <Card
                    key={post.id}
                    post={post}
                    className="mt-4"
                    onClickReply={() => setReplyTo(post)}
                    replyable
                  />
                ))}
            </div>
          )) ?? <div>No sections available</div>}{" "}
        </div>
      </div>

      {replyTo && (
        <CommentModal
          post={replyTo}
          clearReplyToPost={() => setReplyTo(null)}
        />
      )}
    </div>
  );
}
