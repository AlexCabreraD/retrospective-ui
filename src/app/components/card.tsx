import { FaReply } from "react-icons/fa6";
import post from "@/app/types/post";
import Comment from "@/app/types/comment";
import { Socket } from "socket.io-client";
import { Dispatch, SetStateAction } from "react";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import { scrollbarStyle } from "@/app/utils/helper";
interface PostCardBaseProps {
  post: post | Comment;
  socket: Socket | null;
  sectionId?: number;
  votesLeft?: number;
  setVotesLeft?: Dispatch<SetStateAction<number>>;
  className?: string;
  replyable?: boolean;
  voting?: boolean;
}

interface PostCardWithReply extends PostCardBaseProps {
  replyable: true;
  onClickReply: () => void;
  votesLeft: number;
  setVotesLeft: Dispatch<SetStateAction<number>>;
  voting: boolean;
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
  voting = false,
  socket,
  sectionId,
  setVotesLeft,
  votesLeft,
}: PostCardProps) {
  const handleUpVote = () => {
    if (typeof votesLeft === "number" && votesLeft > 0 && setVotesLeft) {
      setVotesLeft((prevState) => prevState - 1);
      socket?.emit("upvote_post", { postId: post.id, sectionId: sectionId });
    }
  };

  const handleUndoVote = () => {
    if (
      typeof votesLeft === "number" &&
      votesLeft < 5 &&
      setVotesLeft &&
      "comments" in post &&
      post.likeCount > 0
    ) {
      setVotesLeft((prevState) => prevState + 1);
      socket?.emit("undo_upvote_post", {
        postId: post.id,
        sectionId: sectionId,
      });
    }
  };

  return (
    <>
      <div
        id={String(post.id)}
        className={`bg-[#292929] max-h-[200px] rounded-[10px] z-1 ${scrollbarStyle} ${className} relative py-[16px] px-[16px] border-[3px] border-[#252525]`}
      >
        {voting && "likeCount" in post && (
          <div className="absolute right-[8px] top-[8px] w-[30px] h-[30px] flex items-center justify-center">
            <span
              className="min-w-[30px] w-[30px] h-[30px] flex items-center justify-center font-bold  border-[#353535] rounded bg-[#1E1E1E] text-center"
              style={{ lineHeight: "30px", padding: "0 2px" }}
            >
              {post.likeCount}
            </span>
          </div>
        )}

        <div className="flex flex-row justify-between items-center sticky bottom-0 ">
          <div className="flex items-center">
            <div
              className="rounded-lg w-[30px] h-[30px] flex justify-center items-center text-body-sm"
              style={{ backgroundColor: post.user.color }}
            >
              <span className="font-medium text-gray-600 dark:text-gray-300 text-body-sm">
                {post.user.name[0]}
              </span>
            </div>
            <span className="ml-[8px] text-body-sm">{post.user.name}</span>
          </div>

          <div className="flex flex-row justify-center items-center cursor-pointer">
            {!voting && replyable && "comments" in post && (
              <div className="flex flex-row justify-center items-center ml-4">
                <button
                  onClick={onClickReply}
                  className={
                    "flex flex-row justify-center items-center text-body-sm"
                  }
                >
                  <FaReply className="mr-[8px]" />
                  <span>{post.comments.length}</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="pt-[16px]  text-body-sm">{post.text}</p>
      </div>
      {voting ? (
        <div className={"flex flex-row"}>
          <button className="flex " onClick={handleUndoVote}>
            <CiSquareMinus
              size={35}
              className={"text-[#858585] hover:text-white"}
            />
          </button>
          <button className="flex" onClick={handleUpVote}>
            <CiSquarePlus
              size={35}
              className={"text-[#858585] hover:text-white"}
            />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
