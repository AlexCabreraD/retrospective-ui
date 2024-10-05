import post from "@/app/types/post";
import Card from "@/app/components/card";
import { IoSend } from "react-icons/io5";
import Comment from "@/app/types/comment";

interface CommentModalProps {
  post: post;
  clearReplyToPost: () => void;
}

export default function CommentModal({
  post,
  clearReplyToPost,
}: CommentModalProps) {
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
            <Card key={post.id} post={post} className="mb-8" />
            <hr className="h-px bg-[#292929] border-0 mb-8" />

            {post.comments.map((comment: Comment) => (
              <Card key={comment.id} post={comment} className="mt-4" />
            ))}
          </div>

          <div className="flex flex-row items-center w-full bg-[#1E1E1E] p-4">
            <input
              placeholder="Reply"
              className="w-full bg-[#292929] h-12 rounded mr-4 placeholder:text-[#858585] px-4"
            />
            <button className="border-0">
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
          <Card key={post.id} post={post} className="mb-8" />
          <hr className="h-px bg-[#292929] border-0 mb-8" />

          {post.comments.map((comment: Comment) => (
            <Card key={comment.id} post={comment} className="mt-4" />
          ))}
        </div>

        <div className="flex flex-row items-center w-full bg-[#1E1E1E] p-4">
          <input
            placeholder="Reply"
            className="w-full bg-[#292929] h-12 rounded mr-4 placeholder:text-[#858585] px-4"
          />
          <button className="border-0">
            <IoSend size={25} />
          </button>
        </div>
      </div>
    </>
  );
}
