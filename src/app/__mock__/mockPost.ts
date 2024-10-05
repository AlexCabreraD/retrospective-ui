import Post from "@/app/types/post";
import { mockUser0 } from "@/app/__mock__/mockUser";
import mockComment from "@/app/__mock__/mockComment";

const mockPost: Post = {
  id: 0,
  user: mockUser0,
  text: "this is a test post",
  likeCount: 2,
  comments: [mockComment],
};

export default mockPost;
