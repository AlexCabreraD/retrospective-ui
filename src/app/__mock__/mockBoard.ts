import Board from "@/app/types/board";
import { mockUser0, mockUser1 } from "@/app/__mock__/mockUser";
import {
  mockSection0,
  mockSection1,
  mockSection2,
  mockSection3,
} from "@/app/__mock__/mockSection";

const mockBoard: Board = {
  boardName: "Sample Retro Board",
  boardCode: "12345",
  creator: "mockUser 0",
  sections: [mockSection0, mockSection1, mockSection2, mockSection3],
  users: [mockUser0, mockUser1],
};

export default mockBoard;
