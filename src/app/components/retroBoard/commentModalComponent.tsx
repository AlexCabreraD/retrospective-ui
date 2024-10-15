import { Socket } from "socket.io-client";
import Post from "@/app/types/post";
import CommentModal from "../commentModal";

interface commentModalComponentProps {
  replyTo: { post: Post | null; sectionId: number | null };
  socket: Socket | null;
  handleSendComment: (
    commentText: string,
    sectionId: number,
    postId: number,
  ) => void;
  clearReplyToPost: () => void;
}

const CommentModalComponent = ({
  replyTo,
  socket,
  handleSendComment,
  clearReplyToPost,
}: commentModalComponentProps) =>
  replyTo.post &&
  replyTo.sectionId && (
    <CommentModal
      socket={socket}
      post={replyTo.post}
      sectionId={replyTo.sectionId}
      handleSendComment={handleSendComment}
      clearReplyToPost={clearReplyToPost}
    />
  );

export default CommentModalComponent;
