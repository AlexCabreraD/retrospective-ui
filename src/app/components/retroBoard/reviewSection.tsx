import PostWithSectionTitle from "@/app/types/postWithSectionTitle";
import Card from "../card";
import Post from "@/app/types/post";
import { Socket } from "socket.io-client";

interface ReviewSectionProps {
  sortedPosts: PostWithSectionTitle[];
  postUnderReview: Post | null;
  socket: Socket | null;
  handleNextClick: () => void;
}

const ReviewSection = ({
  sortedPosts,
  postUnderReview,
  handleNextClick,
  socket,
}: ReviewSectionProps) => (
  <div className="flex">
    <div className="bg-[#1e1e1e] p-[16px] mr-[32px] rounded min-w-[480px]">
      <div className="flex justify-between w-full">
        <span className="text-h2-sm">Cards</span>
        <button
          className="mt-2 sm:mt-0 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
      <div className="mt-[16px]">
        {sortedPosts.map(
          (postWithSectionTitle: PostWithSectionTitle, index: number) => (
            <Card
              key={index}
              post={postWithSectionTitle.post}
              socket={socket}
              showLikeCountOnly
              className="mt-[16px]"
            />
          ),
        )}
      </div>
    </div>
    <div className="bg-[#1e1e1e] p-[16px] rounded min-w-[682px]">
      {postUnderReview && (
        <Card
          key={postUnderReview.id}
          post={postUnderReview}
          socket={socket}
          showLikeCountOnly
          className="mt-[16px]"
        />
      )}
    </div>
  </div>
);

export default ReviewSection;
