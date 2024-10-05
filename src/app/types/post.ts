import Comment from "@/app/types/comment";
import User from "@/app/types/user";

export default interface Post {
  id: number;
  user: User;
  text: string;
  likeCount: number;
  comments: Comment[];
}
