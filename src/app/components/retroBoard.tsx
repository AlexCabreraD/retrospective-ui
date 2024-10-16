import { Dispatch, SetStateAction, useEffect, useState } from "react";
import post from "@/app/types/post";
import Post from "@/app/types/post";
import Section from "@/app/types/section";
import Board from "@/app/types/board";
import AddPostResponse from "@/app/types/addPostResponse";
import { Socket } from "socket.io-client";
import User from "@/app/types/user";
import Comment from "@/app/types/comment";
import {
  gatherAndSortPostsWithSectionTitle,
} from "@/app/utils/helper";
import { SnackBar } from "@/app/types/snackBar";
import PostWithSectionTitle from "../types/postWithSectionTitle";
import SnackbarComponent from "./retroBoard/snackBarComponent";
import BoardHeader from "./retroBoard/boardHeader";
import ActionButtons from "./retroBoard/actionButtons";
import CardsView from "./retroBoard/cardsView";
import ReviewSection from "./retroBoard/reviewSection";
import CommentModalComponent from "./retroBoard/commentModalComponent";
import ConfirmationModalComponent from "./retroBoard/confirmationModalComponent";

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
  const [reviewing, setReviewing] = useState(false);
  const [snackBar, setSnackBar] = useState<SnackBar>();

  const [sortedPosts, setSortedPosts] = useState<PostWithSectionTitle[]>([]);
  const [postUnderReview, setPostUnderReview] = useState<post | null>(null);

  const handleNextClick = () => {
    setSortedPosts((prevSortedPosts) => {
      const sortedPostsTemp = [...prevSortedPosts];
      const nextPost = sortedPostsTemp.shift();
      if (nextPost) {
        setPostUnderReview(nextPost.post);
      }
      return sortedPostsTemp;
    });
  };

  const onVotingClick = () => {
    socket?.emit("start_voting");
  };

  const onStartReviewClick = () => {
    socket?.emit("start_review");
  }

  const onStopVotingClick = () => {
    setVoting(false);
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

    const handleStartReview = () =>{
      setSections((prevSections) => {
        const sortedPostsTemp = gatherAndSortPostsWithSectionTitle(prevSections);
        const nextPost = sortedPostsTemp.shift();
        setSortedPosts(sortedPostsTemp);
        if (nextPost) setPostUnderReview(nextPost.post);
        return prevSections;
      });

      setVoting(false);
      setReviewing(true);
    }

    socket?.on("post_added", handlePostAdded);
    socket?.on("vote_started", handleStartVote);
    socket?.on("vote_stopped", handleStopVote);
    socket?.on("post_voted_update", updatePostVote);
    socket?.on("post_comments_update", updatePostComments);
    socket?.on("review_started", handleStartReview);
    return () => {
      socket?.off("post_added", handlePostAdded);
      socket?.off("vote_started", handleStartVote);
      socket?.on("vote_stopped", handleStopVote);
      socket?.off("post_voted_update", updatePostVote);
      socket?.off("post_comments_update", updatePostComments);
      socket?.off("review_started", handleStartReview);
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
      <SnackbarComponent showSnack={showSnack} setShowSnack={setShowSnack} />

      <div className="flex flex-col bg-black text-white w-full lg:w-[80%] max-w-[1720px] h-full py-6 lg:py-16 mx-auto min-w-full lg:min-w-[1250px]">
        <BoardHeader
          voting={voting}
          boardName={board?.boardName}
          boardCode={board?.boardCode}
          votesLeft={votesLeft}
          onCopyClick={onCopyClick}
        />

        <ActionButtons
          user={user}
          voting={voting}
          startReview={onStartReviewClick}
          onStopVotingClick={onStopVotingClick}
          onVotingClick={onVotingClick}
          setShowConfirmModal={setShowConfirmModal}
        />

        {!reviewing ? (
          <CardsView
            setReplyTo={setReplyTo}
            sections={sections}
            voting={voting}
            handleNewPost={handleNewPost}
            socket={socket}
            votesLeft={votesLeft}
            setVotesLeft={setVotesLeft}
          />
        ) : (
          <ReviewSection
            sortedPosts={sortedPosts}
            postUnderReview={postUnderReview}
            handleNextClick={handleNextClick}
            socket={socket}
          />
        )}
      </div>

      <CommentModalComponent
        replyTo={replyTo}
        socket={socket}
        handleSendComment={handleSendComment}
        clearReplyToPost={() => setReplyTo({ post: null, sectionId: null })}
      />

      <ConfirmationModalComponent
        showConfirmModal={showConfirmModal}
        confirmLeave={confirmLeave}
        cancelLeave={cancelLeave}
      />
    </div>
  );
}
