import Comment from "@/app/types/comment";
import { mockUser1 } from "@/app/__mock__/mockUser";

const mockComment: Comment = {
  id: 0,
  user: mockUser1,
  text: "this is a mock comment",
  timestamp: new Date("2024-12-25"),
};

export default mockComment;
