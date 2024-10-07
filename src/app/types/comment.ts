import User from "@/app/types/user";

export default interface Comment {
  id: number;
  user: User;
  text: string;
}
