import Post from "@/app/types/post";

export default interface AddPostResponse {
  success: boolean; // Indicates if the post was added successfully
  error?: string; // An optional error message if there was an issue
  post?: Post; // The newly added post, if applicable
}
