import Card from "@/app/components/card";
import CommentModal from "@/app/components/commentModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import post from "@/app/types/post";
import { Tooltip } from "@/app/components/tooltip";
import { Snackbar } from "@/app/components/snackbar";
import NewPostInput from "@/app/components/newPostInput";
import Post from "@/app/types/post";
import Section from "@/app/types/section";
import Board, { BoardData } from "@/app/types/board";

interface RetroBoardProps {
  displayName: string;
  boardName: string;
  boardCode: string;
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
  socket: any;
}

export default function RetroBoard({
  socket,
  boardCode,
  boardName,
  sections,
  setSections,
}: RetroBoardProps) {
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [posts, setPosts] = useState<post[]>([]);
  const [replyTo, setReplyTo] = useState<post | null>(null);
  const [board, setBoard] = useState<Board>(new BoardData("me"));

  useEffect(() => {
    socket.on("joined_board", (data: Board) => {
      console.log("Joined board data:", data); // Debugging line to see the data
      setBoard(data); // Update state with the received board data
    });
    // Connect to socket and set up event listeners
    socket.on(
      "post_added",
      ({ sectionId, post }: { sectionId: number; post: Post }) => {
        console.log("test", sectionId, post);
        // Update the local state to add the new post
        setSections((prevSections) =>
          prevSections.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                posts: [...section.posts, post], // Add the new post to the section
              };
            }
            return section;
          }),
        );
      },
    );

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off("post_added");
    };
  }, []);

  const onCopyClick = () => {
    navigator.clipboard
      .writeText(boardCode)
      .then(() => {
        setShowSnack(true);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleNewPost = (text: string) => {
    console.log("posts", posts);
    const newPost: Post = {
      id: Date.now(),
      user: { id: "currentUserId", name: "currentUserName" },
      text,
      likeCount: 0,
      comments: [],
    };

    socket.emit("add_post", {
      boardCode: boardCode,
      sectionId: "Section1",
      post: newPost,
    });
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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold mx-4 mb-4">
            {boardName}
          </h1>
          <Tooltip text={"Copy"} position={"end"}>
            <span
              className="bg-[#1e1e1e] py-1 px-4 rounded cursor-pointer"
              onClick={onCopyClick}
            >
              {boardCode}
            </span>
          </Tooltip>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mx-4 my-2">
          <p className="font-bold tracking-wide">Write</p>
          <div className="flex flex-col sm:flex-row">
            <button className="mt-2 sm:mt-0 sm:ml-2 border-[2px] hover:bg-green px-4 py-1 rounded-lg">
              Start Vote
            </button>
            <button
              onClick={() => {
                socket.emit("test", { boardCode });
              }}
              className="mt-2 sm:mt-0 sm:ml-2 border-[2px] hover:bg-red-600 px-4 py-1 rounded-lg"
            >
              Leave
            </button>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full h-full"
          id={"cards"}
        >
          {board.sections.map((section, index) => (
            <div key={section.id} className="p-4 bg-[#1e1e1e] rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-h3-lg font-semibold text-[#858585]">
                  {section.title}
                </h2>
                <div className="rounded-lg border-[2px] border-[#353535] w-10 h-10 flex justify-center items-center">
                  <p>{section.posts.length}</p>
                </div>
              </div>
              <NewPostInput onPost={handleNewPost} />
              <hr className="h-px bg-[#292929] border-0 mb-6" />
              {board.sections[index].posts.map((post) => (
                <Card
                  key={post.id}
                  post={post}
                  className="mt-4"
                  onClickReply={() => setReplyTo(post)}
                  replyable
                />
              ))}
            </div>
          ))}
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
