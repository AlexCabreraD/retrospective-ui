import Post from "@/app/types/post";

export default interface Section {
  id: number;
  title: string;
  posts: Post[];
}
