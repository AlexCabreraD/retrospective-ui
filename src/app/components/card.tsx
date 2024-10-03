import { FaReply } from "react-icons/fa6";
import post from "@/app/types/post";
import { Comment } from "@/app/types/comment";

interface PostCardBaseProps {
  post: post | Comment;
  className?: string;
  replyable?: boolean;
}

interface PostCardWithReply extends PostCardBaseProps {
  replyable: true;
  onClickReply: () => void;
}

interface PostCardWithoutReply extends PostCardBaseProps {
  replyable?: false;
  onClickReply?: never;
}

type PostCardProps = PostCardWithReply | PostCardWithoutReply;

export default function PostCard({
  post,
  className = "",
  replyable = false,
  onClickReply,
}: PostCardProps) {
  const scrollbarStyle =
    "overflow-auto overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500";

  return (
    <div
      id={String(post.id)}
      className={`bg-[#292929] max-h-[200px] rounded-[10px] z-1 ${scrollbarStyle} ${className}`}
    >
      <p className="pt-[16px] px-[16px]">{post.text}</p>
      <div className="flex flex-row justify-between items-center bg-[#292929] sticky bottom-0 py-[16px] px-[16px]">
        <div>
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {post.user.name[0]}
            </span>
          </div>
          <span className="ml-[8px]">{post.user.name}</span>
        </div>
        {replyable && "comments" in post && (
          <div className="flex flex-row justify-center items-center">
            <span className="mr-[8px]">{post.comments.length}</span>
            <button onClick={onClickReply}>
              <FaReply />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
