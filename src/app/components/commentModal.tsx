import post from "@/app/types/post";
import Card from "@/app/components/card";
import { IoSend } from "react-icons/io5";
import Comment from "@/app/types/comment";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { scrollbarStyle } from "@/app/utils/helper";

interface CommentModalProps {
  socket: Socket | null;
  post: post;
  sectionId: number;
  clearReplyToPost: () => void;
  handleSendComment: (
    commentText: string,
    sectionId: number,
    postId: number,
  ) => void;
}

export default function CommentModal({
  socket,
  post,
  sectionId,
  clearReplyToPost,
  handleSendComment,
}: CommentModalProps) {
  const [commentText, setCommentText] = useState<string>("");

  const handleSendClick = () => {
    setCommentText("");
    handleSendComment(commentText, sectionId, post.id);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-[600px] h-[90vh] bg-[#1E1E1E] rounded-lg flex flex-col">
          <button
            type="button"
            className="bg-[#292929] h-8 rounded-t-md p-2 inline-flex items-center justify-center text-[#858585] hover:bg-white"
            onClick={clearReplyToPost}
          >
            Close
          </button>

          <div className="p-4">
            <Card
              post={post}
              sectionId={sectionId}
              key={post.id}
              socket={socket}
            />
          </div>

          <div className={`flex-grow overflow-y-auto px-4 ${scrollbarStyle}`}>
            <hr className="h-px bg-[#292929] border-0 mb-4" />
            {post.comments.map((comment: Comment) => (
              <Card
                key={comment.id}
                post={comment}
                className="mt-4"
                socket={null}
              />
            ))}
          </div>

          <div className="p-4 bg-[#1E1E1E] flex items-center">
            <input
              placeholder="Reply"
              className="w-full bg-[#292929] h-12 rounded mr-4 placeholder:text-[#858585] px-4"
              value={commentText}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSendClick();
                }
              }}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="border-0" onClick={handleSendClick}>
              <IoSend size={25} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
