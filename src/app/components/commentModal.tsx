import post from "@/app/types/post";
import Card from "@/app/components/card";
import { IoSend } from "react-icons/io5";
import Comment from "@/app/types/comment";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

interface CommentModalProps {
  socket: Socket | null;
  post: post;
  sectionId: number;
  clearReplyToPost: () => void;
}

export default function CommentModal({
  socket,
  post,
  sectionId,
  clearReplyToPost,
}: CommentModalProps) {
  const [commentText, setCommentText] = useState<string>("");

  useEffect(() => {
    console.log("update comments", post.comments);
  }, [post.comments]);

  const handleSendComment = () => {
    setCommentText("");
    socket?.emit("post_comment", {
      postId: post.id,
      sectionId: sectionId,
      commentText: commentText,
    });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 sm:hidden">
        <div className="relative w-full sm:w-[500px] max-h-[90vh] sm:max-h-[600px] bg-[#1E1E1E] rounded-lg overflow-hidden">
          <button
            type="button"
            className="bg-[#292929] h-8 w-full rounded-t-md p-2 inline-flex items-center justify-center text-[#858585] hover:bg-white"
            onClick={clearReplyToPost}
          >
            Close
          </button>

          <div className="p-4 pt-8 flex-grow overflow-y-auto">
            <Card
              post={post}
              sectionId={sectionId}
              key={post.id}
              className="mb-8"
              socket={socket}
            />
            <hr className="h-px bg-[#292929] border-0 mb-8" />

            {post.comments.map((comment: Comment) => (
              <Card
                key={comment.id}
                post={comment}
                className="mt-4"
                socket={null}
              />
            ))}
          </div>

          <div className="flex flex-row items-center w-full bg-[#1E1E1E] p-4">
            <input
              placeholder="Reply"
              className="w-full bg-[#292929] h-12 rounded mr-4 placeholder:text-[#858585] px-4"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSendComment();
                }
              }}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="border-0" onClick={handleSendComment}>
              <IoSend size={25} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col h-screen w-full sm:w-[500px] bg-[#1E1E1E] overflow-hidden rounded-lg relative">
        <button
          type="button"
          className="bg-[#292929] h-8 rounded-t-md p-2 inline-flex items-center justify-center text-[#858585] hover:bg-white"
          onClick={clearReplyToPost}
        >
          Close
        </button>
        <div className="p-4 pt-8 flex-grow overflow-y-auto">
          <Card key={post.id} post={post} socket={null} className="mb-8" />
          <hr className="h-px bg-[#292929] border-0 mb-8" />

          {post.comments.map((comment: Comment) => (
            <Card
              key={comment.id}
              post={comment}
              socket={null}
              className="mt-4"
            />
          ))}
        </div>

        <div className="flex flex-row items-center w-full bg-[#1E1E1E] p-4">
          <input
            placeholder="Reply"
            className="w-full bg-[#292929] h-12 rounded mr-4 placeholder:text-[#858585] px-4"
            value={commentText}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendComment();
              }
            }}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="border-0" onClick={handleSendComment}>
            <IoSend size={25} />
          </button>
        </div>
      </div>
    </>
  );
}
