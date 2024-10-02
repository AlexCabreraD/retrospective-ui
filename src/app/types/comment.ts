import User from "@/app/types/user";

export interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: Date;
}
