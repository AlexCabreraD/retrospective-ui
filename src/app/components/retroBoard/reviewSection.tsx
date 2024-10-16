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
                       }: ReviewSectionProps) => {

    const handleFinishClick = () => {
        alert("Feature under construction.");
    };

    const renderSortedPosts = () => {
        if (sortedPosts.length === 0) {
            return <div className="text-body-sm text-center mt-4">All posts have been reviewed.</div>;
        }

        return sortedPosts.map((postWithSectionTitle, index) => (
            <Card
                key={index}
                post={postWithSectionTitle.post}
                socket={socket}
                showLikeCountOnly
                className="mt-4"
            />
        ));
    };

    const renderPostUnderReview = () => {
        if (!postUnderReview) {
            return <div className="text-body-sm text-center mt-4">No post is currently under review.</div>;
        }

        return (
            <Card
                key={postUnderReview.id}
                post={postUnderReview}
                socket={socket}
                showLikeCountOnly
                className="mt-4"
            />
        );
    };

    return (
        <div className="flex h-full">
            <div className="bg-[#1e1e1e] p-4 mr-8 rounded min-w-[480px]">
                <div className="flex justify-between w-full">
                    <span className="text-h2-sm">Cards</span>
                    <button
                        className="mt-2 sm:mt-0 border hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm"
                        onClick={sortedPosts.length === 0 ? handleFinishClick : handleNextClick}
                    >
                        {sortedPosts.length === 0 ? "Finish" : "Next"}
                    </button>
                </div>

                <div className="mt-4 w-full">
                    {renderSortedPosts()}
                </div>
            </div>

            <div className="bg-[#1e1e1e] p-4 rounded min-w-[682px]">
                {renderPostUnderReview()}
            </div>
        </div>
    );
};

export default ReviewSection;
