import PostWithSectionTitle from "@/app/types/postWithSectionTitle";
import Card from "../card";
import { Socket } from "socket.io-client";
import Comment from "@/app/types/comment";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

interface ReviewSectionProps {
    sortedPosts: PostWithSectionTitle[];
    postUnderReview: PostWithSectionTitle | null;
    socket: Socket | null;
    handleNextClick: () => void;
}

const ReviewSection = ({
                           sortedPosts,
                           postUnderReview,
                           handleNextClick,
                           socket,
                       }: ReviewSectionProps) => {

    const [commentText, setCommentText] = useState<string>("")

    const handleFinishClick = () => {
        alert("Feature under construction.");
    };

    const handleSendClick = () =>{
        alert("Feature under construction.");
    }

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
            <div className="flex flex-col h-full">
                <h2 className="text-h3 font-semibold text-[#858585]">{postUnderReview.sectionTitle}</h2>
                <Card
                    key={postUnderReview.post.id}
                    post={postUnderReview.post}
                    socket={socket}
                    className="mt-4"
                    showLikeCountOnly
                />

                <div className="flex flex-col flex-grow overflow-hidden mt-4">
                    <div className="flex-grow overflow-y-auto mb-4">
                        {postUnderReview.post.comments && postUnderReview.post.comments.length > 0 ? (
                            postUnderReview.post.comments.map((comment: Comment) => (
                                <Card
                                    key={comment.id}
                                    post={comment}
                                    className="mt-4"
                                    socket={null}
                                />
                            ))
                        ) : (
                            <div className="text-body-sm text-center mt-4">No comments available for this post.</div>
                        )}
                    </div>

                    <div className="flex items-center w-full bg-[#1E1E1E] sticky bottom-0 p-2">
                        <input
                            placeholder="Reply"
                            value={commentText}
                            className="w-full bg-[#292929] h-12 rounded mr-4 placeholder:text-[#858585] px-4"
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSendClick();
                                }
                            }}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button className="border-0" onClick={handleSendClick}>
                            <IoSend size={25}/>
                        </button>
                    </div>
                </div>
            </div>
        );

    };

    return (
        <div className="flex h-full max-h-[90%] overflow-hidden">
            <div className="bg-[#1e1e1e] p-4 mr-8 rounded min-w-[480px] h-full">
                <div className="flex justify-between w-full">
                    <span className="text-h2-sm">Cards</span>
                    <button
                        className="mt-2 sm:mt-0 border hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm"
                        onClick={sortedPosts.length === 0 ? handleFinishClick : handleNextClick}
                    >
                        {sortedPosts.length === 0 ? "Finish" : "Next"}
                    </button>
                </div>

                <div className="mt-4 w-full h-full">
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
