import Post from "@/app/types/post";

export default interface AddPostResponse {
  success: boolean;
  error?: string;
  post?: Post;
}
