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
import Comment from "@/app/types/comment";
import { scrollbarStyle } from "@/app/utils/helper";

interface RetroBoardProps {
  user: User;
  displayName: string;
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
  socket: Socket | null;
  board: Board | null;
  setBoard: Dispatch<SetStateAction<Board | null>>;
  leaveBoard: () => void;
}

export default function RetroBoard({
  user,
  socket,
  sections,
  setSections,
  board,
  setBoard,
  leaveBoard,
}: RetroBoardProps) {
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<{
    post: post | null;
    sectionId: number | null;
  }>({ post: null, sectionId: null });
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [voting, setVoting] = useState<boolean>(false);
  const [votesLeft, setVotesLeft] = useState<number>(5);

  const onVotingClick = () => {
    socket?.emit("start_voting");
  };
  const onStopVotingClick = () => {
    socket?.emit("stop_voting");
  };
  const handleLeaveBoard = () => {
    leaveBoard();
  };

  const confirmLeave = () => {
    setShowConfirmModal(false);
    handleLeaveBoard();
  };

  const cancelLeave = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    const handleStartVote = () => {
      setVoting(true);
    };
    const handleStopVote = () => {
      setVoting(false);
    };
    const handlePostAdded = ({
      sectionId,
      post,
    }: {
      sectionId: number;
      post: Post;
    }) => {
      if (board?.sections.some((section) => section.id === sectionId)) {
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
    const updatePostVote = (data: {
      likeCount: number;
      postId: number;
      sectionId: number;
    }) => {
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === data.sectionId) {
            return {
              ...section,
              posts: section.posts.map((post) => {
                if (post.id === data.postId) {
                  return { ...post, likeCount: data.likeCount };
                }

                return post;
              }),
            };
          }

          return section;
        }),
      );
    };

    const updatePostComments = (data: {
      comment: Comment;
      postId: number;
      sectionId: number;
    }) => {
      console.log("searching...");
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === data.sectionId) {
            console.log("section");
            return {
              ...section,
              posts: section.posts.map((post) => {
                if (post.id === data.postId) {
                  console.log(post);
                  setReplyTo((prevState) => ({
                    ...prevState,
                    post: {
                      ...post,
                      comments: [...post.comments, data.comment],
                    },
                  }));
                  return {
                    ...post,
                    comments: [...post.comments, data.comment],
                  };
                }

                return post;
              }),
            };
          }

          return section;
        }),
      );
    };

    socket?.on("post_added", handlePostAdded);
    socket?.on("vote_started", handleStartVote);
    socket?.on("vote_stopped", handleStopVote);
    socket?.on("post_voted_update", updatePostVote);
    socket?.on("post_comments_update", updatePostComments);
    return () => {
      socket?.off("post_added", handlePostAdded);
      socket?.off("vote_started", handleStartVote);
      socket?.on("vote_stopped", handleStopVote);
      socket?.off("post_voted_update", updatePostVote);
      socket?.off("post_comments_update", updatePostComments);
    };
  }, [setSections, socket, setBoard, board]);

  const onCopyClick = () => {
    console.log(sections);
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
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        color: user.color,
      },
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

  const handleSendComment = (
    commentText: string,
    sectionId: number,
    postId: number,
  ) => {
    const newComment: Comment = {
      id: Date.now(),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        color: user.color,
      },
      text: commentText,
    };

    socket?.emit("post_comment", {
      postId: postId,
      sectionId: sectionId,
      comment: newComment,
    });
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:flex-row lg:justify-center lg:items-start overflow-hidden">
      <Snackbar
        visible={showSnack}
        text={"Copied Retro Board Code"}
        status={"success"}
        onOpen={() => {}}
        onClose={() => setShowSnack(false)}
      />

      <div className="flex flex-col bg-black text-white w-full lg:w-[80%] max-w-[1720px] h-full py-6 lg:py-16 mx-auto min-w-full lg:min-w-[1250px] ">
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

        <div className="flex flex-col sm:flex-row mb-[8px] justify-between">
          <div>
            {user.role === "creator" && voting && (
              <button
                className="mt-2 sm:mt-0 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg"
                onClick={onStopVotingClick}
              >
                Stop Vote
              </button>
            )}
            {user.role === "creator" && (
              <button
                className="mt-2 sm:mt-0 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm"
                onClick={onVotingClick}
              >
                Start Vote
              </button>
            )}
            <button
              className={`mt-2 sm:mt-0 ${user.role === "creator" ? "sm:ml-2" : ""} border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm`}
              onClick={() => {
                setShowConfirmModal(true);
              }}
            >
              Leave
            </button>
          </div>
          <div>
            {voting && (
              <div
                className={
                  "flex justify-center text-center align-middle content-center"
                }
              >
                <span
                  className={
                    "flex items-center justify-center font-bold text-center mr-[8px]"
                  }
                >
                  votes:
                </span>
                <div className="w-[30px] h-[30px] flex items-center justify-center">
                  <span
                    className="min-w-[30px] w-[30px] h-[30px] flex items-center justify-center font-bold border-[2px] border-[#353535] rounded bg-[#1E1E1E] text-center"
                    style={{ lineHeight: "30px", padding: "0 2px" }}
                  >
                    {votesLeft}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full h-full overflow-hidden "
          id={"cards"}
        >
          {sections?.map((section) => (
            <div
              key={section.id}
              className={`bg-[#1e1e1e] rounded-lg overflow-auto ${scrollbarStyle}`}
            >
              <div className={"sticky top-0 bg-[#1e1e1e] p-4 z-10"}>
                <div className="flex justify-between items-center">
                  <h2 className="text-h3 font-semibold text-[#858585]">
                    {section.title}
                  </h2>
                  <div className="rounded-lg border-[2px] border-[#353535] w-[30px] h-[30px] flex justify-center items-center text-body-sm">
                    <p>{section.posts.length}</p>
                  </div>
                </div>
                <NewPostInput
                  onPost={handleNewPost}
                  sectionId={section.id}
                  voting={voting}
                />
                <hr className="h-px bg-[#292929] border-0 mt-[16px]" />
              </div>
              <div className={"w-full overflow-auto px-4 relative"}>
                {section.posts
                  .slice()
                  .sort((a, b) => b.id - a.id)
                  .map((post) => (
                    <Card
                      key={post.id}
                      post={post}
                      className="mt-4"
                      onClickReply={() =>
                        setReplyTo({ post: post, sectionId: section.id })
                      }
                      voting={voting}
                      socket={socket}
                      sectionId={section.id}
                      votesLeft={votesLeft}
                      setVotesLeft={setVotesLeft}
                      replyable
                    />
                  ))}
              </div>
            </div>
          )) ?? <div>No sections available</div>}
        </div>
      </div>

      {replyTo.post && replyTo.sectionId && (
        <CommentModal
          socket={socket}
          post={replyTo.post}
          sectionId={replyTo.sectionId}
          handleSendComment={handleSendComment}
          clearReplyToPost={() => setReplyTo({ post: null, sectionId: null })}
        />
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#0f0f0f] p-6 rounded shadow-[0_0px_55px_2px_rgba(0,0,0,.4)]">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">
              If you leave, your posts will remain visible on the board.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={confirmLeave}
              >
                Yes, Leave
              </button>
              <button
                className="mt-2 sm:mt-0 sm:ml-2 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg"
                onClick={cancelLeave}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
